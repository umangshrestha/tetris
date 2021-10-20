import React from "react";
import Square from "./square";

const ROW_SIZE = 10;
const COL_SIZE = 20;

const style = {
	width        : "250px",
	height       : "250px",
	margin       : "0 auto",
	display      : "grid",
	gridTemplate : `repeat(${COL_SIZE}, 1fr) / repeat(${ROW_SIZE}, 1fr)`,
};

const Board = () =>  (
    <div style={style}> 
        {[...Array(ROW_SIZE)].map( row => 
            [...Array(COL_SIZE)].map( col =>
                    <Square key={`${row}-${col}`} color="orange"/>)
        )}
    </div>
)

export default Board;