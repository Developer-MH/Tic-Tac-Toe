let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let difficultyLevel = 'extreme';

function makeMove(cellIndex) {
    if (!gameBoard[cellIndex]) {
        gameBoard[cellIndex] = currentPlayer;
        document.getElementsByClassName('cell')[cellIndex].innerText = currentPlayer;
        if (checkWinner()) {
            document.getElementById('winner').innerText = `Player ${currentPlayer} wins!`;
            disableBoard();
        } else if (isBoardFull()) {
            document.getElementById('winner').innerText = "It's a draw!";
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (currentPlayer === 'O') {
                makeBotMove();
            }
        }
    }
}

function checkWinner() {
    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return true;
        }
    }
    return false;
}

function isBoardFull() {
    return gameBoard.every(cell => cell !== '');
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    document.getElementById('winner').innerText = '';
    const cells = document.getElementsByClassName('cell');
    for (let cell of cells) {
        cell.innerText = '';
        cell.style.pointerEvents = 'auto';
    }
}

function disableBoard() {
    const cells = document.getElementsByClassName('cell');
    for (let cell of cells) {
        cell.style.pointerEvents = 'none';
    }
}

function makeBotMove() {
    const bestMove = findBestMove(gameBoard, currentPlayer);
    setTimeout(() => {
        makeMove(bestMove.index);
    }, 1000);
}

function findBestMove(board, player) {
    let bestScore = -Infinity;
    let bestMove = {};

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = player;
            let score = minimax(board, 0, false, -Infinity, Infinity);
            board[i] = ''; // Reset the cell after evaluating the move
            if (score > bestScore) {
                bestScore = score;
                bestMove.index = i;
            }
        }
    }

    return bestMove;
}

function minimax(board, depth, isMaximizing, alpha, beta) {
    let result = checkResult(board);
    if (result !== null) {
        if (result === 'X') {
            return 10 - depth;
        } else if (result === 'O') {
            return depth - 10;
        }
        return 0;
    }

    if (depth >= 7) { // Increase depth for harder difficulty
        return 0; // Return neutral score for deeper levels
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, false, alpha, beta);
                board[i] = ''; // Reset the cell after evaluating the move
                bestScore = Math.max(bestScore, score);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, true, alpha, beta);
                board[i] = ''; // Reset the cell after evaluating the move
                bestScore = Math.min(bestScore, score);
                beta = Math.min(beta, score);
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return bestScore;
    }
}

function checkResult(board) {
    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    if (board.every(cell => cell !== '')) {
        return 'tie';
    }
    return null;
}
