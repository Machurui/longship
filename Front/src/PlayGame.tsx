import { useEffect, useState } from "react";
import { useBot } from "./BotOpponent";
import "./PlayGame.css";
import { Game } from "./components/Game";
import { useGame } from "./context/GameContext";

import {
  Answer,
  Boat,
  BoatType,
  Coord,
  Damage,
  Presence,
  createEmptyGrid,
  toString,
} from "./model/Battleship";
import { getBoatAtCoord, placeBoat } from "./utils/grid";

export default function PlayGame({
  myBoats,
}: {
  myBoats: Map<BoatType, Boat>;
}) {
  const {
    checkCurrentPlayer,
    gameStarted,
    checkPlayer2,
    checkPlayer1,
    surrender,
    attackContract,
  } = useGame();
  const [acurrentPlayer, setaCurrentPlayer] = useState<string>("");
  const [host, setHost] = useState<string>("");
  const [guest, setGuest] = useState<string>("");
  const [statusAttack, setStatusAttack] = useState<number>(0);

  const fetchCurrentPlayer = async () => {
    const player = await checkCurrentPlayer();
    setaCurrentPlayer(player);
  };

  useEffect(() => {
    fetchCurrentPlayer();
    checkPlayer2().then((result) => {
      setGuest(result || "");
    });
    checkPlayer1().then((result) => {
      setHost(result || "");
    });
  }, [gameStarted]);

  const [gameOver, setGameOver] = useState(false);
  const [nbSunks, setNbSunks] = useState(0);

  const myName = "remy";
  const players = ["remy", "bob"];
  const [currentPlayer, setCurrentPlayer] = useState(0);

  const [opponentSpeech, setOpponentSpeech] = useState("waiting...");
  const [showAnswerButtons, setShowAnswerButtons] = useState(false);

  const [myGrid, setMyGrid] = useState(createEmptyGrid(Presence.WATER));
  useEffect(() => {
    const grid = createEmptyGrid(Presence.WATER);
    for (const [type, boat] of myBoats.entries()) {
      placeBoat(grid, type, boat);
    }
    setMyGrid(grid);
  }, []);

  const [theirKnownGrid, setTheirKnownGrid] = useState(createEmptyGrid(null));
  const [attackCell, setAttackCell] = useState<Coord | null>(null);
  const [oppAttackCell, setOppAttackCell] = useState<Coord | null>(null);

  const { answer, attack } = useBot(onAttack, onAnswer);

  function isMyTurn() {
    return players[currentPlayer] === myName;
  }

  function togglePlayer() {
    setCurrentPlayer((currentPlayer + 1) % players.length);
  }

  function onAttack(coord: Coord) {
    setOppAttackCell(coord);
    setOpponentSpeech(toString(coord) + "?");
    setShowAnswerButtons(true);
  }
  function onAnswer(answer: Answer) {
    setOpponentSpeech(
      toString(answer.coord) +
      " : " +
      answer.damage +
      (answer.sunk ? ", SUNK!" : "")
    );
    setOppAttackCell(null);
    theirKnownGrid[answer.coord.row][answer.coord.column].presence =
      answer.damage == Damage.HIT ? Presence.BOAT : Presence.WATER;
    theirKnownGrid[answer.coord.row][answer.coord.column].damage = Damage.HIT;
    if (answer.sunk) {
      setNbSunks(nbSunks + 1);
      if (nbSunks === 4) {
        setGameOver(true);
        setOpponentSpeech("Game over... you win!");
      }
    }
    setTheirKnownGrid([...theirKnownGrid]);
    if (answer.damage === Damage.NONE) {
      togglePlayer();
    }

    // determine status based on answer
    if (answer.damage === Damage.NONE) {
      setStatusAttack(0);
    } else if (answer.damage === Damage.HIT && !answer.sunk) {
      setStatusAttack(1);
    } else if (answer.sunk) {
      setStatusAttack(2);
    }

    // fetch current player
    fetchCurrentPlayer();
  }

  return (
    <>
      <div>
        <span>Current player: {acurrentPlayer}</span>
      </div>
      <div>
        <span>
          {/* {players.find((p) => p !== myName)} : {opponentSpeech} */}
          {String(currentPlayer) === host ? guest : host} : {opponentSpeech}
        </span>
      </div>
      {gameStarted ? (
        <>
          <Game
            myGrid={myGrid}
            otherGrid={theirKnownGrid}
            onClick={async (coord) => {
              if (gameOver || !isMyTurn()) {
                return;
              }
              setAttackCell(coord);
              // Call the attack function with coordinates and status
              await attackContract(coord.row, coord.column, statusAttack);
              setOpponentSpeech("thinking...");
            }}
            focus={attackCell}
          />
          {!gameOver && !isMyTurn() && showAnswerButtons && (
            <div>
              <button
                onClick={() => {
                  answer({
                    coord: oppAttackCell!,
                    damage: Damage.NONE,
                    sunk: false,
                  });
                  myGrid[oppAttackCell!.row][oppAttackCell!.column].damage =
                    Damage.NONE;
                  setMyGrid([...myGrid]);
                  togglePlayer();
                  setOpponentSpeech("waiting...");
                  setShowAnswerButtons(false);
                }}
              >
                Manqué
              </button>
              <button
                onClick={() => {
                  answer({
                    coord: oppAttackCell!,
                    damage: Damage.HIT,
                    sunk: false,
                  });
                  myGrid[oppAttackCell!.row][oppAttackCell!.column].damage =
                    Damage.HIT;
                  setMyGrid([...myGrid]);
                  setShowAnswerButtons(false);
                }}
              >
                Touché
              </button>
              <button
                onClick={() => {
                  answer({
                    coord: oppAttackCell!,
                    damage: Damage.HIT,
                    sunk: true,
                  });
                  const { boat } = getBoatAtCoord(myBoats, oppAttackCell!)!;
                  boat.sunk = true;
                  setMyGrid([...myGrid]);
                  setShowAnswerButtons(false);
                  if (Object.values(myBoats).every((boat) => boat.sunk)) {
                    setGameOver(true);
                    setOpponentSpeech("Game over... you lose!");
                  }
                }}
              >
                Coulé
              </button>
            </div>
          )}
        </>
      ) : (
        "Waiting for game to start..."
      )}
    </>
  );
}
