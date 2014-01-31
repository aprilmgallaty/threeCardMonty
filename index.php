<?php
	include "_include/globals.php";
	$title = "Three Card Monty";
	include INCLUDE_DIR . "_header.php";
?>



<body>
	<header>
		<div>
		<h1>Three Card Monty</h1>
			<div id="speedSlider">
				<div class="speedStops" id="slowSpeed"></div>
				<div class="speedStops" id="medSpeed"></div>
				<div class="speedStops" id="fastSpeed"></div>
			</div>
		</div>
	</header>

	<section id="content">
		<div id="table">
		</div>
		
		<div id="infoDialog">
			<p>This a version of the classic con game Three Card Monte, although this isn't a con. There are three cards arranged on a table, one of them being the Queen. The player is shown the cards, and then they are placed face-down in a row. The player places a bet on whether or not he thinks he will be able to follow where the Queen is. The cards are then shuffled around, while the player attempts to follow the card. After the cards are shuffled several times, the player picks one card out of the three. The card is turned over to reveal whether or not it's the Queen. If the player is correct, he wins the payout on the bet, and if not, he loses the bet.</p>
			<br/>
			<p>To start a game, click the RESET button at the top of the table, then click on the poker chips to add to your bet. You can click on the RESET BET button if you need to re-do your bet. When you are ready, click the START button at the top of the table, and the cards will be shuffled. Once the cards stop moving, click on a card to turn it over and see if you win. Your money total will change according to whether you win or lose. You can also set the speed of the shuffle using the slider at the top right. If you set the shuffle faster, the payout is higher, but it's harder to win.</p>
			<br/>
			<p>Click the RESET button next to your money to reset the amount.</p>
		</div>
		
		<div id="opsArea">
			<div id="reset"></div>
				<div id="pot">
					<p class="scoreText">Your Money</p>
					<div class="money">
						<p class="dollar"><span class="specialFont">$</span></p>
						<p class="amount"></p>
					</div>
				</div>
				
				<div id="bet">
					<p class="scoreText">Your Bet</p>
					<div class="money">
						<p class="dollar"><span class="specialFont">$</span></p>
						<p class="amount"></p>
					</div>
				</div>

			<div id="resetBet">Reset Bet</div>
				
			<div id="chips">
				<div id="oneChip"></div>
				<div id="fiveChip"></div>
				<div id="tenChip"></div>
				<div id="twentyFiveChip"></div>
				<div id="hundredChip"></div>
			</div>
			
			<div id="information"></div>
		
		</div><!-- end #opsArea -->
	
		<div class="clear"></div>
		
		<div id="credits">
			<p>Powered by <a href="http://jquery.com/" target="_blank">jQuery</a>, <a href="http://jqueryui.com/" target="_blank">jQueryUI</a>, and <a href="http://ricostacruz.com/jquery.transit/" target="_blank">Transit</a></p>
			<p>Images licensed from <a href="http://vectorstock.com/" target="_blank">Vector Stock</a>, &copy; 2013. All rights reserved.</p>
		</div><!-- end #credits -->
	
	</section><!-- end #content -->
		
<?php include INCLUDE_DIR . "_footer.php"; ?>

