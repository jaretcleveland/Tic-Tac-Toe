function Gameboard() {
    const board = Array(9).fill(null); // Initialize a 3x3 board with null values

    const getBoard = () => [...board]; // Return a copy of the board to prevent external modification

    const setCell = (position, symbol) => {
        if (position >= 0 && position < 9 && board[position] === null) { // Check if the position is valid and the cell is empty
            board[position] = symbol; // Set the cell to the player's symbol
            return true; // Return true if the move was successful
        }
        return false; // Return false if the move was invalid
    };

    const printBoard = () => {
        console.log("Current Board:");
        for (let i = 0; i < 3; i++) {
            console.log(
                board.slice(i * 3, i * 3 + 3).map((cell) => (cell === null ? "-" : cell)).join(" | ") // Print the board in a 3x3 format, replacing null values with dashes for better visibility
            );
        }
    };

    return { // Return the public methods of the Gameboard module
        getBoard,
        setCell,
        printBoard,
    };
}

function createPlayer(name, symbol) { // Factory function to create a player object
    return {
        name,
        symbol,
    };
}

function GameController( // Main game controller function
    playerOneName = "Player 1",
    playerTwoName = "Player 2"
) {
    const gameboard = Gameboard();
    
    const players = [ // Create two player objects using the factory function
        createPlayer(playerOneName, "X"),
        createPlayer(playerTwoName, "O")
    ];

    let activePlayer = players[0]; // Start with player one
    let gameActive = true;

    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;
    const isGameActive = () => gameActive;

    const printActivePlayer = () => {
        console.log(`It's ${activePlayer.name}'s turn (${activePlayer.symbol})`);
    };

    const makeMove = (position) => { // Function to handle a player's move
        if (!gameActive) {
            const message = "The game is over. Please start a new game.";
            console.log(message);
            return { success: false, message, gameOver: true };
        }

        if (gameboard.setCell(position, activePlayer.symbol)) {
            gameboard.printBoard();
            if (checkWinCondition()) {
                const message = `${activePlayer.name} wins the game!`;
                console.log(message);
                gameActive = false;
                return { success: true, message, gameOver: true };
            }
            if (checkDrawCondition()) {
                const message = "The game is a draw!";
                console.log(message);
                gameActive = false;
                return { success: true, message, gameOver: true };
            }
            switchPlayer();
            printActivePlayer();
            return {
                success: true,
                message: `It's ${activePlayer.name}'s turn (${activePlayer.symbol})`,
                gameOver: false,
            };
        } else {
            const message = "Invalid move! Try again.";
            console.log(message);
            return { success: false, message, gameOver: false };
        }
    };

    const checkWinCondition = () => {
        const currentGameState = gameboard.getBoard();

        const winningCombinations = [ // Define all possible winning combinations for a 3x3 Tic-Tac-Toe board
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (const combination of winningCombinations) { // Check each winning combination to see if any player has won
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

    const checkDrawCondition = () => { // Function to check if the game is a draw (i.e., all cells are filled and no winner)
        if (gameboard.getBoard().every((cell) => cell !== null)) {
            return true;
        }
        return false;
    };

    return {
        getActivePlayer,
        isGameActive,
        printActivePlayer,
        makeMove,
        getBoard: gameboard.getBoard, // Expose the getBoard method from the Gameboard module to allow external access to the current game state
    };
}

function ScreenController() {
    let gameController = GameController();
    let hasStarted = false;
    const boardElement = document.querySelector(".board");
    const statusElement = document.querySelector(".status");
    const startButton = document.querySelector(".start-button");
    const playerOneInput = document.querySelector("#player-one");
    const playerTwoInput = document.querySelector("#player-two");

    const updateStatus = (message) => {
        statusElement.textContent = message;
    };

    const getCurrentTurnMessage = () => {
        const activePlayer = gameController.getActivePlayer();
        return `It's ${activePlayer.name}'s turn (${activePlayer.symbol})`;
    };

    const render = () => {
        const board = gameController.getBoard();
        boardElement.textContent = "";

        board.forEach((cell, index) => { // Create a button for each cell in the game board
            const cellElement = document.createElement("button");
            cellElement.classList.add("cell");
            cellElement.dataset.index = index;
            cellElement.textContent = cell || ""; // Display the player's symbol in the cell if it exists, otherwise leave it empty
            cellElement.disabled = !hasStarted || cell !== null || !gameController.isGameActive();
            boardElement.appendChild(cellElement);
        });
    };

    const makeMove = (position) => {
        if (!hasStarted) {
            return;
        }

        const result = gameController.makeMove(position);
        render();

        if (result) {
            updateStatus(result.message);
        }
    };

    const handleBoardClick = (event) => {
        if (!event.target.classList.contains("cell")) {
            return;
        }

        const selectedCell = Number(event.target.dataset.index);
        makeMove(selectedCell);
    };

    boardElement.addEventListener("click", handleBoardClick);

    const startGame = () => {
        const playerOneName = playerOneInput.value.trim() || "Player 1";
        const playerTwoName = playerTwoInput.value.trim() || "Player 2";

        gameController = GameController(playerOneName, playerTwoName);
        hasStarted = true;
        startButton.textContent = "Restart Game";
        updateStatus(getCurrentTurnMessage());
        render();
    };

    startButton.addEventListener("click", startGame);

    updateStatus("Enter player names and start the game.");
    render();
}

document.addEventListener("DOMContentLoaded", () => { // Wait for the DOM to fully load before initializing the screen controller
    ScreenController();
});