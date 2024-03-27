import { Coord, Grid as ModelGrid } from "../model/Battleship";
import "./Game.css";
import { Grid } from "./Grid";

export function Game({
  myGrid,
  otherGrid,
  onClick,
  focus,
}: {
  myGrid: ModelGrid;
  otherGrid: ModelGrid;
  onClick: (coord: Coord) => void;
  focus: Coord | null;
}) {
  return (
    <div className="flex">
      <Grid grid={myGrid} onClick={null} focus={null} />
      <span className="fence"></span>
      <Grid grid={otherGrid} onClick={onClick} focus={focus} />
    </div>
  );
}
