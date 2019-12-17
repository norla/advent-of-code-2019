"use strict";

const fs = require("fs");
const events = require("events");
const readline = require("readline");

//const pressedKeys = new Set();

//var stdin = process.stdin;

//stdin.setRawMode( true );
//stdin.resume();
//stdin.setEncoding( 'utf8' );
//
const grid = [];


function intcode(code) {
    const out = new events.EventEmitter();
    const run = async () => {
        let pos = 0, base = 0, output = [];
        const program = code.slice(0); // clone
        while (true) {
            const [opCode] = program.slice(pos, pos + 1);
            //console.log(opCode);
            const { op, paramModes } = decode(opCode);
            let p1, p2, pR;
            switch (op) {
                case 1: // add
                    [p1, p2] = getParams(2, pos, program, paramModes, base);
                    pR = program[pos + 3] + (paramModes[2] === "2" ? base : 0);
                    program[pR] = p1 + p2;
                    pos += 4;
                    break;
                case 2: // mul
                    [p1, p2] = getParams(2, pos, program, paramModes, base);
                    pR = program[pos + 3] + (paramModes[2] === "2" ? base : 0);
                    program[pR] = p1 * p2;
                    pos += 4;
                    break;
                case 3: // read
                    p1 = program[pos + 1] + (paramModes[0] === "2" ? base : 0); //getParams(1, pos, program, paramModes, base);
                    await new Promise(resolve => {
                       setTimeout(resolve, 10);
                    });
                    const ballPos = grid.map(l => l.indexOf(4)).filter(x => x >= 0)[0];
                    const paddlePos =  grid.map(l => l.indexOf(3)).filter(x => x >= 0)[0];
                    if (ballPos < paddlePos) program[p1] = -1;
                    else if (ballPos > paddlePos) program[p1] = 1;
                    else program[p1] = 0;
                    pos += 2;
                    break;
                case 4: //write
                    [p1] = getParams(1, pos, program, paramModes, base);
                    out.emit("data", p1);
                    pos += 2;
                    break;
                case 5: // jmp if non-zero
                    [p1, p2] = getParams(2, pos, program, paramModes, base);
                    pos = p1 !== 0 ? p2 : pos + 3;
                    break;
                case 6: // jmp if zerp
                    [p1, p2] = getParams(2, pos, program, paramModes, base);
                    pos = p1 === 0 ? p2 : pos + 3;
                    break;
                case 7: // less than
                    [p1, p2, pR] = getParams(2, pos, program, paramModes, base);
                    pR = program[pos + 3] + (paramModes[2] === "2" ? base : 0);
                    program[pR] = p1 < p2 ? 1 : 0;
                    pos += 4;
                    break;
                case 8: // eq
                    [p1, p2] = getParams(2, pos, program, paramModes, base);
                    pR = program[pos + 3] + (paramModes[2] === "2" ? base : 0);
                    program[pR] = p1 === p2 ? 1 : 0;
                    pos += 4;
                    break;
                case 9: // modify base
                    [p1] = getParams(1, pos, program, paramModes, base);
                    base = base + p1;
                    pos += 2;
                    break;
                case 99:
                    return out.emit("end");
                default:
                    throw "Unknown op " + op;
            }
        }
    };
    setImmediate(run);
    return out;
}

function getParams(n, pos, program, paramModes, base) {
    const params = program.slice(pos + 1, pos + 1 + n);
    const ret = params.map((p, i) => {
        const pMode = paramModes[i];
        if (pMode === "1") return p;
        else if (pMode === "2") return program[p + base] || 0
        else return program[p] || 0
    });
    return ret;
}

function decode(instr) {
    const [...digits] = instr.toString();
    return {
        op: Number(digits.slice(digits.length - 2).join("")),
        paramModes: digits.slice(0, digits.length - 2).reverse()
    };
}

const strInput = fs.readFileSync("./input/d13.txt", "utf-8")
const code = strInput.split(",").map(x => Number(x));
code [0] = 2;
const output = intcode(code, []);
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
   // process.exit(0);
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
    //console.log( grid.map(l => l.indexOf("o")));
}, 10)
