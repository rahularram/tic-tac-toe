var origBoard; // array keeps track of whats in each board of tic tac toe i.e., O or X
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [   // winning combinations
	[0, 1, 2],  // horizontal matching
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell'); // cell variable stores each reference of cell in html.
// it select each element on the page that has the class as cell for all the td elements.
startGame();  //functions to start the game. it will start at begining and after everytime when replay is clicked.

function startGame() {
	document.querySelector(".endgame").style.display = "none"; 
    origBoard = Array.from(Array(9).keys());  // to make array of 9 elements and attach to the dom td elements
    // so through out the game though we use X or O it will internally be from 0 to 8.
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = ''; 
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false); // calls turnclick function 
	}
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') { // square.target.id will be from 0 to 8
		turn(square.target.id, huPlayer) // huplayer will be humar player. not the ai player
        if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer); //check tie 
        // if not tie then ai will take a turn. and you cannot click on block which you already clicked.
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player; // assign board id to the player
	document.getElementById(squareId).innerText = player;  // select element with the swaure id and set the inner text to O.
	let gameWon = checkWin(origBoard, player) // when turn is clicked we will check whether we had won game or not 
	if (gameWon) gameOver(gameWon) // if won  call gameover function.
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) => // find all the places on the board that already played in
        (e === player) ? a.concat(i) : a, []); // initialize the accumilator with empty array.
        //i-index if e==player add index to the array--->to find every index that player had played in
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) { //loop through every possible way that player can win.
        if (win.every(elem => plays.indexOf(elem) > -1)) { // go through every element of win 
            //has the player played in  every spots in which there is a chance of winning
			gameWon = {index: index, player: player}; // which player won.
			break;
		}
	}
	return gameWon; // if nobody wins returns null
}

function gameOver(gameWon) { 
	for (let index of winCombos[gameWon.index]) { // highlight all the square that are part of winning combination
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red"; 
	}
	for (var i = 0; i < cells.length; i++) { // you cant click the cell anymore after finishing game.  
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block"; //
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() { // if type of element is a number
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() { // for ai player
	return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0) { //every square is filled up
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}


// return a value if a terminal state is found (+10,0,-10)
//go through available spots on the board.
//call the minimax problem on each available spot(recursion)
//evaluate returning values from function calls
//return best value.

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {  // if 0 wins return -10
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {   // tie
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]]; 
		newBoard[availSpots[i]] = player; 

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer); //recursion 
			move.score = result.score;
		} else { 
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove; //evaluate best move from moves array
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}
