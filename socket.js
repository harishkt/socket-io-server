const { getRoomNum, getOtherPlayer, updateGameInfo, resetGameInfo } = require('./utils');
let gameInfo = {};
/*
{
	...
	roomId: {
		player1: {
			name: null,
			symbol: 'X'
		},
		player2: {
			name: null,
			symbol: 'O'
		},
		tilePositions: [null, null, ....]
		isGameOver: false,
		winner: null,
		currentPlayer: null,
		messages: []
	}
	...
}

*/
const socketHandler = (io, socket) => {
	socket.on('createGame', (data) => {
		const room = getRoomNum();
		socket.join(room);
		const player1 = { name: data.name, symbol: 'X' };
		gameInfo = { ...gameInfo, [room]: { player1, currentPlayer: data.name, roomNum: room, messages: [] }};
		socket.emit('newGame',
			{
				name: data.name,
				room, gameInfo: gameInfo[room]
			});
	});

	/**
	 * Connect the Player 2 to the room he requested. Show error if room full.
	 */
	socket.on('joinGame', (data) => {
		const room = io.nsps['/'].adapter.rooms[data.room];
		console.log(`room in join Game is ${JSON.stringify(room)}`);
		if( room && room.length === 1){
			socket.join(data.room);
			const player2 = { name: data.name, symbol: 'O' };
			const tilePositions = Array(9).fill(null);
			const isGameOver = false;
			const winner = null;
			gameInfo[data.room] = { ...gameInfo[data.room], player2, tilePositions, isGameOver, winner };
			console.log(`gameInfo in joinGame - ${JSON.stringify(gameInfo)}`)
			socket.broadcast.to(data.room).emit('allPlayersJoined',
				{ showBoard: true, gameInfo: gameInfo[data.room] });
			socket.emit('playerJoined',
				{
					name: data.name,
					room: data.room,
					gameInfo: gameInfo[data.room] 
				});
			
		}
		else {
			socket.emit('err', {message: 'Sorry, The room is full!'});
		}
	});

	socket.on('boardUpdated', ({ player, data, room }) => {
		console.log(`Boardupdated event in server when ${player} clicked - ${JSON.stringify(data)}`);
		// player, gameId, data
		const newGameInfo = updateGameInfo(gameInfo[room], player, data);
		gameInfo[room] = newGameInfo;
		console.log(`gameInfo after BoardUpdated event is ${JSON.stringify(gameInfo[room])}`)
		io.in(room).emit('turnPlayed', {
		  gameInfo: newGameInfo
		});
	});

	socket.on('playAgain', ({ room }) => {
		console.log('playAgain event triggered from client');
		const newGameInfo = resetGameInfo(gameInfo[room]);
		io.in(room).emit('resetGame', {
			gameInfo: newGameInfo
		});

	});

	socket.on('postChat', ({ roomNum, msgToBePosted }) => {
		console.log(`roomNum in postChat is ${roomNum}`);
		console.log(`gameInfo for that room is ${JSON.stringify(gameInfo[roomNum])}`);
		const { messages } = gameInfo[roomNum];
		console.log(`messages is ${messages}`);
		console.log(`msgToBePosted got from client is ${JSON.stringify(msgToBePosted)}`);
		const updatedChat = [ ...messages, msgToBePosted ];
		const newGameInfo = { ...gameInfo[roomNum], messages: updatedChat };
		gameInfo[roomNum] = newGameInfo;
		io.in(roomNum).emit('chatUpdated', {
			messages: updatedChat
		});
	})
}
module.exports = socketHandler;
