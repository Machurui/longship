import { Damage, Presence,Cell as ModelCell, Boat, BoatSize, Coord, eq, getEnd } from "../model/Battleship";
import "./Cell.css";

export function Cell({onClick,cell,hasFocus}:{onClick : () => void,cell:ModelCell,hasFocus:boolean}) {
    
    let isOrigin = false;
    let isEnd = false;
    if(cell.boat){
        isOrigin = eq(cell.boat.origin,cell.coord);
        isEnd = eq(cell.coord,getEnd(cell.boat));
    }
    let isSunk = cell.boat && cell.boat.sunk
    return <div
        className={
            `cell
            ${cell.presence?cell.presence.toLowerCase():""}
            ${cell.damage?cell.damage.toLowerCase():""}
            ${hasFocus ? "focus" : ""}
            ${cell.boat ? "boat" : ""}
            ${cell.boat && cell.boat.direction === "HORIZONTAL" ? "horizontal" : ""}
            ${cell.boat && cell.boat.direction === "VERTICAL" ? "vertical" : ""}
            ${cell.boat && isOrigin? "origin" : ""}
            ${cell.boat && isEnd? "end" : ""}
            ${cell.boat && (!isOrigin && !isEnd)? "middle" : ""}
            ${cell.boat && isSunk? "sunk" : ""}
        `}
        onClick={onClick}>
        {/* <div className="bomb"></div> */}
    </div>
}