
const winningCombinations = [
		[0,1,2],
		[0,3,6],
		[0,4,8],
		[3,4,5],
		[6,7,8],
		[1,4,7],
		[2,5,8],
		[2,4,6]
	];
const didWinByPlayer = (squares, player) => {
	const isWinner
		= combo => {
			const [a, b, c] = combo;
			return (squares[a] === player && squares[b] === player && squares[c] === player)
		}
	return winningCombinations.some(isWinner);
}

const isDraw
	= (squares) => squares.every(square => square !== null);
module.exports = {
	didWinByPlayer,
	isDraw
};
