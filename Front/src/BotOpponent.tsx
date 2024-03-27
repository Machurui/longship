import { useState } from "react";
import {
  Answer,
  Coord,
  Damage,
} from "./model/Battleship";
import { computeAnswer } from "./utils/autoAnswer";
import { createBoatsAndGrid } from "./tests/fixtures/game";

export function useBot(
  attack: (coord: Coord) => void,
  answer: (answer: Answer) => void
) {

  const {boats:theirSecretBoats,grid:_grid} = createBoatsAndGrid();
  const [theirSecretGrid, setTheirSecretGrid] = useState(_grid);

  function onAttack(coord: Coord) {
    setTimeout(() => {
      theirSecretGrid[coord.row][coord.column].damage = Damage.HIT;
      setTheirSecretGrid([...theirSecretGrid]);

      let _answer = computeAnswer(coord, theirSecretBoats, theirSecretGrid);

      answer(_answer);
      if (_answer.damage === Damage.NONE) {
        setTimeout(() => {
          attack(pickRandomCell());
        }, 3000);
      }
    }, 3000);
  }

  function pickRandomCell(): Coord {
    const cell = {
      row: Math.floor(Math.random() * 10),
      column: Math.floor(Math.random() * 10),
    };
    return cell;
  }

  function onAnswer(answer: Answer) {
    if (answer.damage === Damage.HIT) {
      setTimeout(() => {
        attack(pickRandomCell());
      }, 3000);
    }
  }

  return { attack:onAttack, answer:onAnswer };
}