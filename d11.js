"use strict";
const fs = require("fs");

const intcode = require("./intcode");
const strInput = fs.readFileSync("./input/d11.txt", "utf-8")
const code = strInput.split(",").map(x => Number(x));
const program = intcode(code, currentPanelColor);

function currentPanelColor() {
    return Promise.resolve(paintedTiles[JSON.stringify(pos)] === 1 ? 1 : 0)}

let dirs = [
    {x: 0, y: 1}, // up
    {x: 1, y: 0}, // left
    {x: 0, y: -1}, // down
    {x: -1, y: 0} // right
];

let pos =  {x: 0, y:0};
const paintedTiles = {};
paintedTiles[JSON.stringify(pos)] = 1;
let color = null;
let dir = 0;
program.on("data", (data) => {
    if (color === null) {
        color = data;
    } else {
        console.log(pos, data, color)
        paintedTiles[JSON.stringify(pos)] = color;
        color = null;
        if (data === 0) {
            dir = Math.abs(dir + 4 - 1) % 4;
        } else {
            dir = Math.abs(dir + 4 + 1) % 4;
        }
        pos.x += dirs[dir].x
        pos.y += dirs[dir].y
    }
});

const graphics = {1: "#", 0: " "}
program.on("end", () => {
    for(let i = -10; i < 10; i++) {
        for(let j = -10; j < 50; j++) {
            color = paintedTiles[JSON.stringify({x: j, y: i})];
            process.stdout.write(graphics[color] || " ");
        }
        process.stdout.write("\n");
    }
});
