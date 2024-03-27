import { useEffect, useState } from "react";
import "./PlaceBoats.css";
import { Grid } from "./components/Grid";
import { useGame } from "./context/GameContext";
import {
  Boat,
  BoatType,
  Coord,
  Direction,
  Presence,
  createEmptyGrid,
} from "./model/Battleship";
import { fitsIn, getBoatAtCoord, placeBoat } from "./utils/grid";

export default function PlaceBoats({
  onDone,
}: {
  onDone: (boats: Map<BoatType, Boat>) => void;
}) {
  const [placedBoats, setPlacedBoats] = useState<Map<BoatType, Boat>>(
    new Map()
  );

  const { startGame, checkIfGameStarted } = useGame();

  const [grid, setGrid] = useState(createEmptyGrid(Presence.WATER));

  useEffect(() => {
    const grid = createEmptyGrid(Presence.WATER);
    for (const [type, boat] of placedBoats.entries()) {
      placeBoat(grid, type, boat);
    }
    setGrid(grid);
  }, [placedBoats]);

  const allBoats = Object.keys(BoatType);
  const [remainingBoats, setRemainingBoats] = useState(allBoats);

  const [direction, setDirection] = useState<Direction>(Direction.HORIZONTAL);

  const actions = ["PLACE", "REMOVE"];
  const [action, setAction] = useState<string>(actions[0]);
  const [currentBoatType, setCurrentBoatType] = useState<BoatType | null>(
    BoatType.CARRIER
  );

  function onClick(coord: Coord) {
    if (
      action === "REMOVE" &&
      grid[coord.row][coord.column].presence === Presence.BOAT
    ) {
      const { type } = getBoatAtCoord(placedBoats, coord)!;
      placedBoats.delete(type);
      setPlacedBoats(new Map(placedBoats));
      const remainings = [...remainingBoats, type];
      setRemainingBoats(remainings);
      setCurrentBoatType(remainings[0] as BoatType);

      return;
    }
    if (
      action === "PLACE" &&
      currentBoatType &&
      grid[coord.row][coord.column].presence === Presence.WATER
    ) {
      const boat: Boat = {
        origin: coord,
        direction: direction,
        type: currentBoatType,
        sunk: false,
      };
      if (fitsIn(currentBoatType!, boat, grid)) {
        placedBoats.set(currentBoatType!, boat);
        setPlacedBoats(new Map(placedBoats));
        const remainings = remainingBoats.filter(
          (boat) => boat !== currentBoatType
        );
        setRemainingBoats(remainings);
        setCurrentBoatType(
          remainings.length > 0 ? (remainings[0] as BoatType) : null
        );
      }
    }
  }

  return (
    <div>
      <div>
        <span>Action: </span>
        <select onChange={(e) => setAction(e.target.value)}>
          {actions.map((action) => {
            return <option key={action}>{action}</option>;
          })}
        </select>
      </div>
      <span>Boat: </span>
      <select onChange={(e) => setCurrentBoatType(e.target.value as BoatType)}>
        {remainingBoats.map((name) => {
          return <option key={name}>{name}</option>;
        })}
      </select>
      <span>Direction: </span>
      <select
        onChange={(e) => {
          setDirection(e.target.value as Direction);
        }}
      >
        {Object.keys(Direction).map((direction) => {
          return <option key={direction}>{direction}</option>;
        })}
      </select>
      <Grid grid={grid} onClick={onClick} focus={null} />
      <button
        disabled={remainingBoats.length > 0}
        onClick={() => {
          onDone(placedBoats);
          startGame();
          checkIfGameStarted();
        }}
      >
        Done!
      </button>
    </div>
  );
}
