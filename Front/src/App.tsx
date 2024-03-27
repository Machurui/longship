import { useState, useEffect } from "react";
import "./App.css";
import PlaceBoats from "./PlaceBoats";
import PlayGame from "./PlayGame";
import { Boat, BoatType } from "./model/Battleship";
import { GameProvider, useGame } from "./context/GameContext";

function Game() {
  const [myBoats, setMyBoats] = useState<Map<BoatType, Boat>>(new Map());
  const { checkIfGameStarted, checkIfGameEnded, checkWinner } = useGame();
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isGameEnded, setIsGameEnded] = useState<boolean>(false);
  const [winner, setWinner] = useState<string>("");

  useEffect(() => {
    const fetchGameStarted = async () => {
      const gameStarted = await checkIfGameStarted();
      setIsGameStarted(gameStarted);
    };
    const fetchGameEnded = async () => {
      const gameEnded = await checkIfGameEnded();
      setIsGameEnded(gameEnded);
      if (gameEnded) {
        checkWinner().then((winner) => {
          setWinner(winner);
        });
      }
    };

    fetchGameStarted();
    fetchGameEnded();

    // toutes les 5 secondes
    const intervalId = setInterval(() => {
      fetchGameStarted();
      fetchGameEnded();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [checkIfGameStarted, checkIfGameEnded]);

  return (
    <div>
      {isGameEnded ? (
        <span>Game ended, winner is: {winner}</span>
      ) : (
        <span>GameState : {isGameStarted ? "Started" : "Not Started"}</span>
      )}

      {myBoats.size < 5 && (
        <PlaceBoats
          onDone={(boats) => {
            setMyBoats(boats);
          }}
        />
      )}
      {myBoats.size === 5 && <PlayGame myBoats={myBoats} />}
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}

export default App;
