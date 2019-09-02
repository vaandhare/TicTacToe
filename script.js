var Board;
const Player = 'O';
const Comp = 'X';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	Board = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
    if(typeof Board[square.target.id] == 'number'){
        turn(square.target.id, Player)
        if(!checkTie()) turn(bestSpot(), Comp);
    }
}

function turn(squareId, player) {
	Board[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(Board, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) => 
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == Player ? "skyblue" : "pink";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == Player ? "You Win!" : "You Loose!");
}

function bestSpot(){
    return minmax(Board, Comp).index;
}

function emptySquares(){
    return Board.filter(s => typeof s == 'number');
}

function checkTie(){
    if(emptySquares().length == 0){
        for(var i=0; i<cells.length; i++){
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!");
		return true;
	}
	return false;
}

function declareWinner(winnerP){
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = winnerP;
}

function minmax(newBoard, player){
	var availableSpot = emptySquares();
	if(checkWin(newBoard, Player)){
		return {score: -10};
	}else if(checkWin(newBoard, Comp)){
		return {score: 20};
	}else if( availableSpot.length === 0){
		return {score: 0};
	}

	var moves = [];
	for(var i=0; i< availableSpot.length; i++){
		var move = {};
		move.index= newBoard[availableSpot[i]];
		newBoard[availableSpot[i]] = player;

		if(player == Comp){
			var result = minmax(newBoard, Player);
			move.score = result.score;
		}else{
			var result = minmax(newBoard, Comp);
			move.score = result.score;
		}

		newBoard[availableSpot[i]] = move.index;
		moves.push(move);
	}

	var bestMove;
	if(player === Comp){
		var bestScore = -1000;
		for(var i=0; i<moves.length; i++){
			if(moves[i].score > bestScore){
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}else{
		var bestScore = 1000;
		for(var i=0; i<moves.length; i++){
			if(moves[i].score < bestScore){
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}