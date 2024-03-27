import {
  Boat,
  BoatSize,
  BoatType,
  Coord,
  Direction,
  Grid as ModelGrid,
  Presence,
} from "../model/Battleship";

export function getBoatAtCoord(
  placedBoats: Map<BoatType, Boat>,
  coord: Coord
): {type:BoatType, boat:Boat} | never {
  for (const [type, boat] of placedBoats.entries()) {
    let drow = 0,
      dcol = 0;
    for (let i = 0; i < BoatSize[type as BoatType]; i++) {
      let r = boat.origin.row + drow;
      let c = boat.origin.column + dcol;

      if (r == coord.row && c == coord.column) {
        return {type, boat};
      }
      if (boat.direction === Direction.HORIZONTAL) {
        dcol++;
      } else {
        drow++;
      }
    }
  }
  throw new Error("no boat found at cell")
  // return null;
}

export function fitsIn(
  type: BoatType,
  boat: Boat,
  grid: ModelGrid
): boolean {
  const boatSize = BoatSize[type as keyof typeof BoatSize];
  let drow = 0,
    dcol = 0;
  for (let i = 0; i < boatSize; i++) {
    let r = boat.origin.row + drow;
    let c = boat.origin.column + dcol;

    if (
      r < 0 ||
      r > 9 ||
      c < 0 ||
      c > 9 ||
      grid[r][c].presence !== Presence.WATER
    ) {
      return false;
    }

    if (boat.direction === Direction.HORIZONTAL) {
      dcol++;
    } else {
      drow++;
    }
  }
  return true;
}

export function placeBoat(
  grid: ModelGrid,
  type: BoatType,
  boat: Boat,
  presence = Presence.BOAT
) {

  let drow = 0,
    dcol = 0;
  for (let i = 0; i < BoatSize[type]; i++) {
    let r = boat.origin.row + drow;
    let c = boat.origin.column + dcol;

    grid[r][c].presence = presence;
    grid[r][c].boat = boat;

    if (boat.direction === Direction.HORIZONTAL) {
      dcol++;
    } else {
      drow++;
    }
  }
}

export function getBoatCells(
  grid: ModelGrid,
  type: BoatType,
  boat: Boat
) {
  const cells = [];
  let drow = 0,
    dcol = 0;

  for (let i = 0; i < BoatSize[type as BoatType]; i++) {
    let r = boat.origin.row + drow;
    let c = boat.origin.column + dcol;

    cells.push({ coord: { row: r, column: c }, cell: grid[r][c] });

    if (boat.direction === Direction.HORIZONTAL) {
      dcol++;
    } else {
      drow++;
    }
  }
  return cells;
}
