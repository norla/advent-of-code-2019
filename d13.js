"use strict";

const fs = require("fs");
const events = require("events");

function intcode(code, input) {
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
                    program[p1] = input.shift();
                    pos += 2;
                    break;
                case 4: //write
                    [p1] = getParams(1, pos, program, paramModes, base);
                    output.push(p1);
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
                    return output;
                default:
                    throw "Unknown op " + op;
            }
        }
}

function getParams(n, pos, program, paramModes, base) {
    const params = program.slice(pos + 1, pos + 1 + n);
    const ret = params.map((p, i) => {
        const pMode = paramModes[i];
        if (pMode === "1") return p;
        else if (pMode === "2") return program[p + base] || 0
        else return program[p] || 0
    });
    //console.log("PARAMS", ret, paramModes, program.slice(pos + 1, pos + 1 + n), base);
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
const output = intcode(code, []);
console.log("Part 1", output.filter((x, i) => (i + 1) % 3 === 0 && x === 2).length);
