// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BattleShip {
// VARIABLES
address public host;
address public guest;
address public winner;
address public currentPlayer;
bool public gameStarted;
bool public gameOver;
mapping(address => Coordinate[]) public historyAttacks;

    // ENUM
    enum coordinateStatus {
        Miss,
        Hit,
        Sunk
    }
    // STRUCT
    struct Coordinate {
        uint8 x;
        uint8 y;
        coordinateStatus status;
    }

    // EVENT
    event GameStarted(address host, address guest);
    event GameEnded(address winner);
    event Attack(address indexed attacker, uint8 x, uint8 y, coordinateStatus result);

    constructor(address _guest) {
        host = msg.sender;
        guest = _guest;
        gameStarted = false;
        gameOver = false;
    }

    // MODIFIERS
    modifier onlyPlayers() {
        require(msg.sender == host || msg.sender == guest, "You are not a player in this game.");
        _;
    }

    modifier gameNotStarted() {
        require(!gameStarted, "The game has already started.");
        _;
    }

    modifier gameStartedOnly() {
        require(gameStarted, "The game has not started yet.");
        _;
    }

    modifier gameNotOver() {
        require(!gameOver, "The game is over.");
        _;
    }

    modifier validCoordinate(uint8 _x, uint8 _y) {
        require(_x >= 0 && _x < 10, "Invalid x coordinate.");
        require(_y >= 0 && _y < 10, "Invalid y coordinate.");
        _;
    }

    modifier isCurrentPlayer() {
        require(msg.sender == currentPlayer, "Not your turn.");
        _;
    }

    // FUNCTIONS
    function startGame() external onlyPlayers gameNotStarted {
        require(msg.sender == host, "Only host can start the game.");
        gameStarted = true;
        currentPlayer = host;
        emit GameStarted(host, guest);
    }

    function attack(uint8 _x, uint8 _y, coordinateStatus _status) external onlyPlayers gameStartedOnly gameNotOver isCurrentPlayer validCoordinate(_x, _y) {
        for (uint i = 0; i < historyAttacks[msg.sender].length; i++) {
            uint8 x = historyAttacks[msg.sender][i].x;
            uint8 y = historyAttacks[msg.sender][i].y;
            if (x == _x && y == _y) {
                revert("You have already attacked this coordinate.");
            }
        }
        historyAttacks[msg.sender].push(Coordinate(_x, _y, _status));
        emit Attack(msg.sender, _x, _y, _status);
        checkGameOver();
        currentPlayer = currentPlayer == host ? guest : host;
    }

    function checkGameOver() internal {
        uint8 sunkShips = 0;
        for (uint i = 0; i < historyAttacks[msg.sender].length; i++) {
            if (historyAttacks[msg.sender][i].status == coordinateStatus.Sunk) {
                sunkShips++;
            }
        }
        if (sunkShips == 5) {
            gameOver = true;
            winner = msg.sender;
            emit GameEnded(msg.sender);
        }
    }

    function getAllAttacks(address _player) external view onlyPlayers returns (Coordinate[] memory) {
        return historyAttacks[_player];
    }

    function endGameManually() external onlyPlayers gameStartedOnly gameNotOver {
    if (currentPlayer == host) {
        winner = guest;
    }else{
        winner = host;
    }
    gameOver = true;
    emit GameEnded(winner);

    }

}
