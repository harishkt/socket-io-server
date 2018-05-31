const { didWinByPlayer, isDraw } = require('./gamelogic');
const getRoomNum = () => {
	const min = Math.ceil(3000);
	const max = Math.floor(10000);
	return Math.floor(Math.random()* (max - min + 1)) + min;
};
const getPlayerSymbol = (gameInfoByRoom, playerName) => {
	console.log(`getPlayerSymbol method entered with ${playerName} and it is ${JSON.stringify(gameInfoByRoom)}`)
	const { player1, player2 } = gameInfoByRoom;
	return playerName === player1.name ? player1.symbol : player2.symbol;
}
const getOtherPlayer = (gameInfoByRoom, player) => {
	console.log(`getOtherPlayer method entered with ${player} and it is ${JSON.stringify(gameInfoByRoom)}`)
	const { player1, player2 } = gameInfoByRoom;
	return player === player1.name ? player2.name : player1.name;
};

const updateGameInfo = (gameInfoByRoom, currentPlayer, tilePositions) => {
	
	const currentPlayerSymbol = getPlayerSymbol(gameInfoByRoom, currentPlayer);
	if (didWinByPlayer(tilePositions, currentPlayerSymbol)) {
		return {
			...gameInfoByRoom,
			tilePositions,
			currentPlayer,
			status: 'Win',
			isGameOver: true
		}
	} else if(isDraw(tilePositions)) {
		return {
			...gameInfoByRoom,
			tilePositions,
			currentPlayer,
			status: 'Draw',
			isGameOver: true
		}
	} else {
		const nextPlayer = getOtherPlayer(gameInfoByRoom, currentPlayer);
		return {
			...gameInfoByRoom,
			tilePositions, 
			currentPlayer: nextPlayer,
			status: null,
		}
	}
}

const resetGameInfo = (gameInfoByRoom) => {
	const { player1 } = gameInfoByRoom;
	return {
		...gameInfoByRoom,
		currentPlayer: player1.name,
		status: null,
		isGameOver: false,
		tilePositions: Array(9).fill(null)
	};
}

module.exports = {
	getRoomNum,
	getOtherPlayer,
	updateGameInfo,
	resetGameInfo
}
