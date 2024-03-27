import {
  Answer,
  Boat,
  BoatType,
  Coord,
  Damage,
  Grid as ModelGrid,
  Presence,
} from "../model/Battleship";
import { getBoatAtCoord, getBoatCells } from "./grid";

export function computeAnswer(
  coord: Coord,
  boats: Map<BoatType, Boat>,
  grid: ModelGrid
): Answer {
  const isBoat = grid[coord.row][coord.column].presence == Presence.BOAT;
  let damage = Damage.NONE;
  let isSunk = false;
  if (isBoat) {
    damage = Damage.HIT;
    const {type,boat} = getBoatAtCoord(boats, coord);
    const cells = getBoatCells(grid, type, boat);
    isSunk = cells!.every(({ cell }) => cell.damage === Damage.HIT);
  }
  return { coord, damage, sunk: isSunk };
}
