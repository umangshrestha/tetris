import React from 'react';

/* for css */
const getStyle = (color) =>{
    return {
        height        : "30px",
        width         : "30px",
        borderStyle   : "solid",
        borderWidth   : "1px",
        color         : "black",
        justifyContent  : "center",
        backgroundColor : color
    }
}

const Square = (props) => <div style={getStyle(props.color)} />

export default Square;
