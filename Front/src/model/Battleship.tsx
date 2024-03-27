
export enum Presence {
    WATER = "water",
    BOAT = "boat",
}

export enum Damage {
    NONE = "none",
    HIT = "hit",
}

export enum BoatSize {
    CARRIER = 5,
    BATTLESHIP = 4,
    CRUISER = 3,
    SUBMARINE = 3,
    DESTROYER = 2
}

export enum BoatType {
    CARRIER = "CARRIER",
    BATTLESHIP = "BATTLESHIP",
    CRUISER = "CRUISER",
    SUBMARINE = "SUBMARINE",
    DESTROYER = "DESTROYER"
}

export enum Direction {
    HORIZONTAL = "HORIZONTAL",
    VERTICAL = "VERTICAL"
}

export type Coord = {row: number, column: number}
export type Answer = {coord:Coord,damage:Damage,sunk:boolean}

const letters = "ABCDEFGHIJ"
export function toString(coord: Coord): string {
    return `${letters[coord.row]}${coord.column + 1}`
}

export function fromString(coord: string): Coord {
    let [letter,idx,idx2] = coord.split("")
    if(idx2 == '0'){
        idx = "10"
    }
    return {row:letters.indexOf(letter),column:parseInt(idx)-1}
}

export type Boat = {origin: Coord, direction: Direction,type:BoatType,sunk:boolean|null}

export type Cell = {coord:Coord,presence: Presence | null, damage: Damage | null,boat:Boat | null}
export type Grid = Cell[][]


export function createEmptyGrid(presence : Presence | null = Presence.WATER): Grid {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((j) => {
            return {
                coord: {row: i, column: j},
                presence: presence,
                damage: null,
                boat:null
            };
        });
    });}


export function eq(coord1 : Coord,coord2 : Coord) : boolean {
    return coord1.row == coord2.row && coord1.column == coord2.column
}

export function getEnd(boat: Boat) {
    if(boat.direction === "HORIZONTAL") {
        return {row: boat.origin.row, column: boat.origin.column + BoatSize[boat.type] - 1}
    }
    return {row: boat.origin.row + BoatSize[boat.type] - 1, column: boat.origin.column}
}