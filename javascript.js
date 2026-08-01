function Gameboard() {
    const board = Array(9).fill(null);

    const getBoard = () => [...board]; // Return a copy of the board to prevent external modification

    const setCell = (position, symbol) => {
        if (position >= 0 && position < 9 && board[position] === null) {
            board[position] = symbol; // Set the cell to the player's symbol
            return true; // Return true if the move was successful
        }
        return false; // Return false if the move was invalid
    };

    const printBoard = () => {
        console.log("Current Board:");
        for (let i = 0; i < 3; i++) {
            console.log(
                board.slice(i * 3, i * 3 + 3).map((cell) => (cell === null ? "-" : cell)).join(" | ")
            );
        }
    };

    return {
        getBoard,
        setCell,
        printBoard,
    };
}

function createPlayer(name, symbol) {
    return {
        name,
        symbol,
    };
}

function GameController(
    playerOneName = "Player 1",
    playerTwoName = "Player 2"
) {
    const gameboard = Gameboard();
    
    const players = [
        createPlayer(playerOneName, "X"),
        createPlayer(playerTwoName, "O")
    ];

    let activePlayer = players[0]; // Start with player one
    let gameActive = true;

    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printActivePlayer = () => {
        console.log(`It's ${activePlayer.name}'s turn (${activePlayer.symbol})`);
    };

    const makeMove = (position) => {
        if (!gameActive) {
            console.log("The game is over. Please start a new game.");
            return;
        }

        if (gameboard.setCell(position, activePlayer.symbol)) {
            gameboard.printBoard();
            if (checkWinCondition()) {
                console.log(`${activePlayer.name} wins the game!`);
                gameActive = false;
                return;
            }
            if (checkDrawCondition()) {
                console.log("The game is a draw!");
                gameActive = false;
                return;
            }
            switchPlayer();
            printActivePlayer();
        } else {
            console.log("Invalid move! Try again.");
        }
    };

    const checkWinCondition = () => {
        const currentGameState = gameboard.getBoard();

        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (
                currentGameState[a] &&
                currentGameState[a] === currentGameState[b] &&
                currentGameState[a] === currentGameState[c]
            ) {
                return true;
            }
        }
        return false;
    };

    const checkDrawCondition = () => {
        if (gameboard.getBoard().every((cell) => cell !== null)) {
            return true;
        }
        return false;
    };

    return {
        getActivePlayer,
        printActivePlayer,
        makeMove,
    };
}