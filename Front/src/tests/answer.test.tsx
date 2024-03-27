import { Damage, fromString } from "../model/Battleship";
import { computeAnswer } from "../utils/autoAnswer";
import { createBoatsAndGrid } from "./fixtures/game";

describe("computeAnswer", () => {
  it("should compute a 'none' answer", () => {
    const {boats, grid} = createBoatsAndGrid();
    const answer = computeAnswer(fromString("A6"),boats,grid);
    expect(answer.coord).toEqual(fromString("A6"));
    expect(answer.damage).toEqual(Damage.NONE);
    expect(answer.sunk).toEqual(false);
  })
  it("should compute a 'hit' answer", () => {
        const {boats, grid} = createBoatsAndGrid();
        const answer = computeAnswer(fromString("A1"),boats,grid);
        expect(answer.coord).toEqual(fromString("A1"));
        expect(answer.damage).toEqual(Damage.HIT);
        expect(answer.sunk).toEqual(false);
    })
    it("should compute a 'sunk' answer", () => {
      const {boats, grid} = createBoatsAndGrid();
      grid[0][0].damage = Damage.HIT;
      grid[0][1].damage = Damage.HIT;
      grid[0][2].damage = Damage.HIT;
      grid[0][3].damage = Damage.HIT;
      grid[0][4].damage = Damage.HIT;
      const answer = computeAnswer(fromString("A5"),boats,grid);
      expect(answer.coord).toEqual(fromString("A5"));
      expect(answer.damage).toEqual(Damage.HIT);
      expect(answer.sunk).toEqual(true);
  })
})