import { Boat, BoatType, Direction, createEmptyGrid, fromString } from "../../model/Battleship";
import { placeBoat } from "../../utils/grid";

export function createBoatsAndGrid(){
    const theirSecretBoats: Map<BoatType, Boat> = new Map([
        [
          BoatType.CARRIER,
          {
            origin: fromString("A1"),
            direction: Direction.HORIZONTAL,
          } as Boat,
        ],
        [
          BoatType.BATTLESHIP,
          {
            origin: fromString("B2"),
            direction: Direction.HORIZONTAL,
          } as Boat,
        ],
        [
          BoatType.CRUISER,
          { origin: fromString("C1"), direction: Direction.VERTICAL } as Boat,
        ],
        [
          BoatType.DESTROYER,
          { origin: fromString("D5"), direction: Direction.VERTICAL } as Boat,
        ],
        [
          BoatType.SUBMARINE,
          { origin: fromString("H9"), direction: Direction.VERTICAL } as Boat,
        ],
      ]);
      
      const theirSecretGrid = createEmptyGrid(null);
      for (const [type, boat] of theirSecretBoats.entries()) {
        placeBoat(theirSecretGrid, type, boat);
      }
      return {boats:theirSecretBoats,grid:theirSecretGrid}
}