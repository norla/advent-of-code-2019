"use strinct";

const _ = require("lodash");
const fs = require("fs");

let input = fs.readFileSync("./input/d3.txt", "utf8").split("\n").filter(l => l !== "").map(l => l.split(","));
const grid = new Map();
const dirs = { "U": [0, 1], "D": [0, -1], "L": [-1, 0], "R": [1, 0] };

function parseKey(str) { return str.split(",").map(x => Number(x)); }
function toKey(x, y) { return x + "," + y};
function manhattan([x, y]) { return Math.abs(x) + Math.abs(y); }

input.forEach((wire, wireN) => {
    let xPos = yPos = 0;
    wire.forEach(step => {
        const dir = step.slice(0, 1);
        const n = step.slice(1);
        const [xD, yD] = dirs[dir];
        for (i = 1; i <= n; i++) {
            xPos += xD;
            yPos += yD;
            const key = toKey(xPos, yPos);
            grid[key] = grid[key] || new Set();
            grid[key].add(wireN);
        }
    });
});

const intersections = Object.entries(grid).filter(([_, n]) => n.size > 1).map(([key]) => key);
const manhattans = intersections.map(key => manhattan(parseKey(key))).sort((a, b) => a - b);
console.log("Part 1", manhattans[0]);

const intersectionDistance = {};
input.forEach((wire, wireN) => {
    let xPos = yPos = totN = 0;
    wire.forEach(step => {
        const dir = step.slice(0, 1);
        const n = step.slice(1);
        const [xD, yD] = dirs[dir];
        for (i = 1; i <= n; i++) {
            xPos += xD;
            yPos += yD;
            totN += 1;
            const key = toKey(xPos, yPos);
            const iKey = `${wireN}.${key}`;
            if (intersections.includes(key) && !_.get(intersectionDistance, iKey)) {
                _.set(intersectionDistance, iKey, totN)
            }
        }
    });
});
const steps = [];
Object.keys(intersectionDistance[0]).forEach(k => {
    steps[k] = intersectionDistance[0][k] + intersectionDistance[1][k];
});
console.log("Part 2", Object.values(steps).sort((a, b) => a - b)[0]);
