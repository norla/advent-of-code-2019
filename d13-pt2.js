"use strict";

const fs = require("fs");
const readline = require("readline");
const intcode = require("./intcode");

const strInput = fs.readFileSync("./input/d13.txt", "utf-8")
const code = strInput.split(",").map(x => Number(x));
code [0] = 2;
const grid = [];
const sleep = 50;

function movePaddle () {
    const ballPos = grid.map(l => l.indexOf(4)).filter(x => x >= 0)[0];
    const paddlePos =  grid.map(l => l.indexOf(3)).filter(x => x >= 0)[0];
    let direction = 0;
    if (ballPos < paddlePos) direction = -1;
    else if (ballPos > paddlePos) direction = 1;
    return new Promise(resolve => {
        setTimeout(() => resolve(direction), sleep);
    });
}
const output = intcode(code, movePaddle);
let current = [];
let score = 0;
output.on("data", (x) => {
    current.push(x);
    if (current.length === 3) {
        const [x, y, type] = current;
        if (x === -1 && y === 0) {
            score = type;
        } else {
            grid[y] = grid[y] || [];
            grid[y][x] = type;
        }
        current = [];
    }
});

output.on("end", () => {
    console.log("GAME OVER");
})

const graphics = {
    "0": " ",
    "1": "+",
    "2": "#",
    "3": "^",
    "4": "o"
};

setInterval(() => {
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
    grid.forEach(l => {
        console.log(l.map(c => graphics[c]).join(""));
    });
    console.log("SCORE:", score)
}, sleep)
