import { Coord, Grid } from "../model/Battleship";
import { Cell } from "./Cell";
import "./Grid.css";

export function Grid({onClick,grid,focus}:{onClick : null | ((coord : Coord) => void),grid:Grid,focus:Coord|null}) {
  const letters = ["A","B","C","D","E","F","G","H","I","J"]
  const numbers = [1,2,3,4,5,6,7,8,9,10]
  return (
    <div>
    <div className="numbers">{numbers.map((n,i) => {
      return <span className="number" key={"n"+i}>{n}</span>
    })}</div>
      {grid.map((row,i) => {
        return <div key={"r"+i} className="flex">
        <span className="center number">{letters[i]}</span>
        <span className="flex">
          {row.map((cell,j) => {
            return (
              <Cell
                key={"c"+(i * 10 + j)}
                onClick={onClick? () => onClick({row:i,column:j}):()=>{}}
                cell={cell}
                hasFocus={focus?.row === i && focus?.column === j}
              />
            );
          })}
        </span>
        </div>
      })}
    </div>
    )
}
