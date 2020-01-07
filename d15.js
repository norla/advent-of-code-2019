"use strict";
const fs = require("fs");

const intcode = require("./intcode");
const strInput = fs.readFileSync("./input/d15.txt", "utf-8")
const code = strInput.split(",").map(x => Number(x));
const program = intcode(code, nextInput);

const opposite = {"N": "S", "S": "N", "E": "W", "W": "E"};
const directions = {"N": 1, "S": 2, "E": 3, "W": 4}

// State
let backtrack = false;
let direction;
let trail = [{todo: ["E", "W", "N", "S"], pos: [0, 0], back: null}];
let map = {};
const solutions = [];

function move(dir, pos) {
    const movements = {"N": [0, 1], "S": [0, -1], "E": [1, 0], "W": [-1, 0]};
    const movement = movements[dir];
    return [pos[0] + movement[0], pos[1] + movement[1]];
}

function nextInput() {
    draw();
    const currentStep = trail[trail.length - 1];
    if (currentStep.todo.length === 0) {
        trail.pop();
        backtrack = true;
        return delay(directions[currentStep.back]);
    } else {
        direction = currentStep.todo.pop();
        return delay(directions[direction]);
    }
}

program.on("data", (data) => {
    if (backtrack) {
        backtrack = false;
        return;
    }

    const currentStep = trail[trail.length - 1];
    const nextPos = move(direction, currentStep.pos);

    if (data === 0) {
        map[key(nextPos)] = "#";
    }

    if (data === 1 && !backtrack) {
        map[key(nextPos)] = ".";
        const back = opposite[direction];
        const validMovements = Object.keys(directions)
              .filter(d => d !== back)
              .filter(d => !trail.map(({pos}) => key(pos)).includes(key(nextPos)))
        trail.push({todo: validMovements, pos: nextPos, back})
    }

    if (data === 2) {
        map[key(nextPos)] = "X";
        solutions.push(trail.length);
        trail.push({todo: [], back: opposite[direction], pos:nextPos});
     }
});

program.on("end", () => {
    console.log(solutions);
});

// Helpers

function draw() {
    let maxX = 0, maxY = 0, minX = 0, minY = 0;
    Object.keys(map).forEach(posKey => {
        const [x, y] = JSON.parse(posKey);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
    });
    let buffer = "";
    for (let y = minY - 1; y <= maxY + 1; y++) {
        for (let x = minX - 1; x <= maxX + 1; x++) {
            if (trail[trail.length - 1].pos[0] === x && trail[trail.length - 1].pos[1] === y ) {
                buffer += "D";
            } else {
                buffer += map[key([x, y])] || " ";
            }
        }
        buffer += "\n";
    }
    console.clear();
    console.log(buffer);
}

const key = (x) => JSON.stringify(x);
const delay = (v) => new Promise((resolve) => setTimeout(() => resolve(v), 20));
