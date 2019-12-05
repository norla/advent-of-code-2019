"use strict"

const fs = require("fs");

const input = fs.readFileSync("./input/d5.txt", "utf-8").split(",").map(n => Number(n));

function run(inp) {
    let pos = 0;
    const program = input.slice(0);
    while(true) {
        const [opCode] = program.slice(pos, pos + 1);
        const {op, paramModes} = decode(opCode);
        let p1, p2, pR;
        switch (op) {
            case 1:
                [p1, p2] = getParams(2, pos, program, paramModes);
                [pR] = program.slice(pos + 3, pos + 4)
                program[pR] = p1 + p2;
                pos += 4;
                break;
            case 2:
                [p1, p2] = getParams(2, pos, program, paramModes);
                [pR] = program.slice(pos + 3, pos + 4)
                program[pR] = p1 * p2;
                pos += 4;
                break;
            case 3:
                [p1] = program.slice(pos + 1, pos + 2);
                program[p1] = inp; // only input
                pos += 2;
                break;
            case 4:
                [p1] = getParams(1, pos, program, paramModes);
                console.log("Output: ", p1);
                pos += 2;
                break;
            case 5:
                [p1, p2] = getParams(2, pos, program, paramModes);
                if (p1 !== 0) {
                    pos = p2;
                } else {
                    pos += 3;
                }
                break;
            case 6:
                [p1, p2] = getParams(2, pos, program, paramModes);
                if (p1 === 0) {
                    pos = p2;
                } else {
                    pos += 3;
                }
                break;
            case 7:
                [p1, p2] = getParams(2, pos, program, paramModes);
                [pR] = program.slice(pos + 3, pos + 4)
                program[pR] = (p1 < p2) ? 1 : 0;
                pos += 4;
                break;
            case 8:
                 [p1, p2] = getParams(2, pos, program, paramModes);
                [pR] = program.slice(pos + 3, pos + 4)
                program[pR] = (p1 === p2) ? 1 : 0;
                pos += 4;
                break;
            case 99:
                return;
                break;
            default:
                throw "Unknown op " + op;
        }
    }
}

function getParams(n, pos, program, paramModes) {
    const params = program.slice(pos + 1, pos + 1 + n);
    return params.map((p, i) => paramModes[i] === "1" ? p : program[p]);
}

function decode(instr) {
    const [...digits] = instr.toString();
    return {
        op: Number(digits.slice(digits.length - 2).join("")),
        paramModes: digits.slice(0, digits.length -2).reverse()
    }
}

console.log("Part 1");
run(1);
console.log("Part 2");
run(5);
