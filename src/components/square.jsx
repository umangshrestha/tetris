import React from 'react';
import {COLOR_MAP} from './shapes.js';


/* for css */
const getStyle = (colorVal) => {
    return {
        height        : "35px",
        width         : "35px",
        borderStyle   : "solid",
        borderWidth   : "1px",
        color         : "black",
        justifyContent  : "center",
        backgroundColor : COLOR_MAP[colorVal],
    }
}

const Square = (props) => {
    return <div style={getStyle(props.color)}>{props.color}</div> 
}
export default Square;
