$(function() {
	var player = new Player();
	player.resetMoney();
	player.resetBet();
	var table = new CardTable("#table", player);
	table.reset();
});

function CardTable(container, player){
	var tableButtons = $("<div id='tableButtons'></div>").appendTo(container);
	
	this.player = player;
	this.resetButton = $("<div id='resetTableButton'>Reset</div>").appendTo(tableButtons);
	this.startButton = $("<div id='startTableButton'>Start</div>").appendTo(tableButtons);
	this.infoButton = $("<img src='img/information25x25_1.png' />").appendTo("#information");
	this.element = $("<div id='cardTable'></div>").appendTo(container);
	this.leftCard = null;
	this.centerCard = null;
	this.rightCard = null;
	this.pickedCard = null;
	this.queenCard = null;
	this.numSwaps = 0;
	this.maxSwaps = 10;
	
	this.currentState = 0;

	this.speedSlider = $("<img src='img/sliderButton123x138.png' width='40' height='44' id='speedKnob' />");
	this.speedSlider.draggable({
		axis: "x", 
		containment: "parent",
		snap: ".speedStops",
		snapMode: "inner",
		snapTolerance: 40
	});
	this.speedSlider.css("position","absolute").css("top","54px").css("left","0").appendTo("#speedSlider");

	this.infoDialog = $("#infoDialog");
	this.infoDialog.dialog({
		autoOpen: false,
		draggable: false,
		modal: true,
		resizable: false,
		title: "Game Information",
		width: 800
	});

	var self = this;

	$(".speedStops").droppable({
		accept: "#speedKnob",
		drop: function(event, ui){
			if ($(this).is("#slowSpeed")) {
				self.player.setPayout(1);
			} else if ($(this).is("#medSpeed")) {
				self.player.setPayout(5);
			} else if ($(this).is("#fastSpeed")) {
				self.player.setPayout(10);
			}
		}
	});
	
	this.reset = function(){
		$(".playingCard").remove();
		self.numSwaps = 0;
		self.currentState = 0;
		self.leftCard = new PlayingCard(self, 0);
		self.centerCard = new PlayingCard(self, 1);
		self.rightCard = new PlayingCard(self, 2);
		self.pickedCard = null;
		self.leftCard.display();
		self.centerCard.display();
		self.rightCard.display();
		self.leftCard.moveLeft();
		self.centerCard.moveCenter();
		self.rightCard.moveRight();
	}

	this.doSwap = function(){
		var swap;
		if (self.numSwaps < self.maxSwaps) {
			self.numSwaps++;
			swap = Math.random();
			if (swap < 0.333) {
				var leftCard = self.leftCard;
				self.leftCard.moveCenter();
				self.centerCard.moveLeft();
				self.leftCard = self.centerCard;
				self.centerCard = leftCard;
			}
			else if (swap < 0.666) {
				var rightCard = self.rightCard;
				self.rightCard.moveCenter();
				self.centerCard.moveRight();
				self.rightCard = self.centerCard;
				self.centerCard = rightCard;
			}
			else {
				var leftCard = self.leftCard;
				self.leftCard.moveRight();
				self.rightCard.moveLeft();
				self.leftCard = self.rightCard;
				self.rightCard = leftCard;
			}
		}
		else {
			self.currentState = 4;
		}
	}
	
	this.doCompleted = function(){
		switch (self.currentState) {
			case 1:
				if (self.leftCard.completed && self.centerCard.completed && self.rightCard.completed) {
					self.currentState = 2;
					self.leftCard.flipToLeft();
					self.centerCard.flipToLeft();
					self.rightCard.flipToLeft();
				}
				break;
				
			case 2:
				if (self.leftCard.completed && self.centerCard.completed && self.rightCard.completed) {
					self.currentState = 3;
					self.doSwap();
				}
				break;
				
			case 3:
				if (self.leftCard.completed && self.centerCard.completed && self.rightCard.completed) {
					self.doSwap();
				}
				break;

			case 5:
				if (self.pickedCard.completed) {
					self.currentState = 6;
					self.pickedCard.flipToLeft();
				}
				break;
				
			case 6:
				if (self.pickedCard.completed) {
					self.player.setGameInProgress(false);
					if (self.pickedCard.isCard("queen")) {
						self.currentState = 10;
						self.player.win();
					}
					else {
						if (self.leftCard.isCard("queen")) {
							self.queenCard = self.leftCard;
						}
						else if (self.centerCard.isCard("queen")) {
							self.queenCard = self.centerCard;
						}
						else {
							self.queenCard = self.rightCard;
						}
						self.currentState = 7;
						self.queenCard.flipToMiddle();
					}
				}
				break;
				
			case 7:
				if (self.queenCard.completed) {
					self.currentState = 8;
					self.queenCard.flipToLeft();
				}
				break;
				
			case 8:
				if (self.queenCard.completed) {
					self.currentState = 9;
					self.queenCard.wiggle();
				}
				break;

			case 9:
				if (self.queenCard.completed) {
					self.currentState = 10;
					self.player.lose();
				}
				break;
		}
	}
	
	this.startButton.mousedown(function() {
		if ((self.currentState == 0) && (self.player.getBet() > 0)) {
			self.startButton.css("color", "#000");
		}
	});
	
	this.startButton.mouseup(function() {
		self.startButton.css("color", "#fff");
	});
	
	this.startButton.click(function() {
		if ((self.currentState == 0) && (self.player.getBet() > 0)) {
			self.player.setGameInProgress(true);
			self.currentState = 1;
			self.leftCard.flipToMiddle();
			self.centerCard.flipToMiddle();
			self.rightCard.flipToMiddle();
		}
	});

	this.resetButton.mousedown(function() {
		if ((self.currentState == 10) || (self.currentState == 0)) {
			self.resetButton.css("color", "#000");
		}
	});
	
	this.resetButton.mouseup(function() {
		self.resetButton.css("color", "#fff");
	});
	
	this.resetButton.click(function() {
		if ((self.currentState == 10) || (self.currentState == 0)) {
			self.reset();
		}
	});

	this.clickCard = function(card){
		if (self.currentState == 4) {
			self.pickedCard = card;
			self.currentState = 5;
			self.pickedCard.flipToMiddle();
		}
	}
	
	this.infoButton.mousedown(function() {
		self.infoButton.attr("src", "img/information25x25_2.png");
	});

	this.infoButton.mouseup(function() {
		self.infoButton.attr("src", "img/information25x25_1.png");
	});

	this.infoButton.click(function() {
		self.infoDialog.dialog("open");
	});
	
	this.getSpeed = function(){
		if (self.speedSlider.position().left < 43) {
			return 500;
		}
		if (self.speedSlider.position().left < 128) {
			return 300;
		}
		return 200;
	}
}

function PlayingCard(table, cardNum){
	
	var cardTitle = ["two", "queen", "three"];
	var cardImages = ["card2Spades180x250.png", "cardQHearts180x250.png", "card3Club180x250.png"];
	var cardBack = "cardBack180x250.png";
	
	var self = this;
	
	this.table = table;
	this.title = cardTitle[cardNum];
	this.frontImage = cardImages[cardNum];
	this.backImage = "cardBack180x250.png";
	this.faceDown = false;
	this.element = $("<img class='playingCard' id='" + this.title + "' src='' />").css("position","absolute").css("top","0").css("left","0");
	this.completed = true;
	
	this.moveLeft = function(){
		self.completed = false;
		self.element.transition({x: 0, rotateY: '0deg', duration: self.table.getSpeed()}, self.doCompleted);
	}
	
	this.moveCenter = function(){
		self.completed = false;
		self.element.transition({x: 284, rotateY: '0deg', duration: self.table.getSpeed()}, self.doCompleted);
	}
	
	this.moveRight = function(){
		self.completed = false;
		self.element.transition({x: 562, rotateY: '0deg', duration: self.table.getSpeed()}, self.doCompleted);
	}
	
	this.doCompleted = function(){
		self.completed = true;
		self.table.doCompleted();
	}
	
	this.draw = function(){
		if (self.faceDown == true) {
			self.element.attr("src", "img/" + self.backImage);
		}
		else {
			self.element.attr("src", "img/" + self.frontImage);
		}
	}
	
	this.display = function(){
		self.element.appendTo(self.table.element);
		self.draw();
	}
	
	this.flipToLeft = function(){
		self.draw();
		self.completed = false;
		self.element.delay(100).transition({rotateY: '0deg'}, self.doCompleted);
	}

	this.flipToMiddle = function(){
		self.completed = false;
		self.element.transition({rotateY: '90deg'}, self.doCompleted);
		if (self.faceDown == true) {
			self.faceDown = false;
		} 
		else {
			self.faceDown = true;
		}
	}
	
	this.wiggle = function(){
		self.completed = false;
		self.element
			.transition({rotate: '+=15deg', x: '+=10'})
			.transition({rotate: '-=30deg', x: '-=20'})
			.transition({rotate: '+=30deg', x: '+=20'})
			.transition({rotate: '-=30deg', x: '-=20'})
			.transition({rotate: '+=30deg', x: '+=20'})
			.transition({rotate: '-=30deg', x: '-=20'})
			.transition({rotate: '+=15deg', x: '+=10'}, self.doCompleted);
	}
	
	this.isCard = function(title){
		if (self.title == title) {
			return true;
		}
		return false;
	}

	this.element.click(function() {
		self.table.clickCard(self);
	});
}

function Player(){
	this.resetButton = $("<img src='img/resetUp100x87.png' />").appendTo("#reset");
	this.resetBetButton = $("#resetBet");
	this.moneyElement = $("#pot .money .amount");
	this.betElement = $("#bet .money .amount");
	this.oneChip = new Chip(1, "img/_1_50x50reg.png", "img/_1_50x50ro.png", "#oneChip", this);
	this.fiveChip = new Chip(5, "img/_5_50x50reg.png", "img/_5_50x50ro.png", "#fiveChip", this);
	this.tenChip = new Chip(10, "img/_10_50x50reg.png", "img/_10_50x50ro.png", "#tenChip", this);
	this.twentyFiveChip = new Chip(25, "img/_25_50x50reg.png", "img/_25_50x50ro.png", "#twentyFiveChip", this);
	this.hundredChip = new Chip(100, "img/_100_50x50reg.png", "img/_100_50x50ro.png", "#hundredChip", this);
	this.money = 1000;
	this.bet = 0;
	this.payout = 1;
	this.gameInProgress = false;
	
	var self = this;
	
	this.resetMoney = function() {
		self.money = 1000;
		self.draw();
	}
	
	this.resetBet = function() {
		self.bet = 0;
		self.draw();
	}
	
	this.getBet = function() {
		return self.bet;
	}
	
	this.draw = function() {
		self.moneyElement.text(self.money);
		self.betElement.text(self.bet);
	}
	
	this.win = function() {
		self.money += self.bet * self.payout;
		self.draw();
	}

	this.lose = function() {
		self.money -= self.bet;
		if (self.bet > self.money) {
			self.bet = self.money;
		}
		self.draw();
	}
	
	this.addBet = function(amount) {
		self.bet += amount;
		if (self.bet > self.money) {
			self.bet = self.money;
		}
		self.draw();
	}
	
	this.setPayout = function(payout) {
		self.payout = payout;
	}

	this.setGameInProgress = function(inProgress) {
		self.gameInProgress = inProgress;
	}
	
	this.resetButton.mousedown(function() {
		if (self.gameInProgress == false) {
			self.resetButton.attr("src", "img/resetDown100x87.png");
		}
	});

	this.resetButton.mouseup(function() {
		self.resetButton.attr("src", "img/resetUp100x87.png");
	});

	this.resetButton.click(function() {
		if (self.gameInProgress == false) {
			self.resetMoney();
		}
	});

	this.resetBetButton.mousedown(function() {
		if (self.gameInProgress == false) {
			self.resetBetButton.css("color", "#000");
		}
	});
	
	this.resetBetButton.mouseup(function() {
		self.resetBetButton.css("color", "#fff");
	});
	
	this.resetBetButton.click(function() {
		if (self.gameInProgress == false) {
			self.resetBet();
		}
	});
}

function Chip(amount, imgSrc, pushImgSrc, parent, player){
	this.amount = amount;
	this.imgSrc = imgSrc;
	this.pushImgSrc = pushImgSrc;
	this.bet = $("#bet .money .amount");
	this.element = $("<img src='" + imgSrc + "' />").appendTo(parent);
	this.player = player;

	var self = this;
	
	this.element.mousedown(function() {
		self.element.attr("src", self.pushImgSrc);
	});
	
	this.element.mouseup(function() {
		self.element.attr("src", self.imgSrc);
	});
	
	this.element.click(function() {
		self.player.addBet(self.amount);
	});

}

