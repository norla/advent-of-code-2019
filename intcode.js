"use strict";

const events = require("events");

function intcode(code, input) {
    const out = new events.EventEmitter();
    const run = async () => {
        let pos = 0, base = 0, output = [];
        const program = code.slice(0); // clone
        while (true) {
            const [opCode] = program.slice(pos, pos + 1);
            const { op, paramModes } = decode(opCode);
            let p1, p2, pR;

            function getParams(n) {
                const params = program.slice(pos + 1, pos + 1 + n);
                const ret = params.map((p, i) => {
                    const pMode = paramModes[i];
                    if (pMode === "1") return p;
                    else if (pMode === "2") return program[p + base] || 0
                    else return program[p] || 0
                });
                return ret;
            }

            function getRelativeParam(n) {
                return program[pos + n] + (paramModes[n - 1] === "2" ? base : 0);
            }
            switch (op) {
                case 1: // add
                    [p1, p2] = getParams(2);
                    pR = getRelativeParam(3);
                    program[pR] = p1 + p2;
                    pos += 4;
                    break;
                case 2: // mul
                    [p1, p2] = getParams(2);
                    pR = getRelativeParam(3);
                    program[pR] = p1 * p2;
                    pos += 4;
                    break;
                case 3: // read
                    p1 = pR = getRelativeParam(1);
                    program[p1] = await input();
                    pos += 2;
                    break;
                case 4: //write
                    [p1] = getParams(1);
                    out.emit("data", p1);
                    pos += 2;
                    break;
                case 5: // jmp if non-zero
                    [p1, p2] = getParams(2);
                    pos = p1 !== 0 ? p2 : pos + 3;
                    break;
                case 6: // jmp if zerp
                    [p1, p2] = getParams(2);
                    pos = p1 === 0 ? p2 : pos + 3;
                    break;
                case 7: // less than
                    [p1, p2, pR] = getParams(2);
                    pR = pR = getRelativeParam(3);
                    program[pR] = p1 < p2 ? 1 : 0;
                    pos += 4;
                    break;
                case 8: // eq
                    [p1, p2] = getParams(2);
                    pR = pR = getRelativeParam(3);
                    program[pR] = p1 === p2 ? 1 : 0;
                    pos += 4;
                    break;
                case 9: // modify base
                    [p1] = getParams(1);
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

function decode(instr) {
    const [...digits] = instr.toString();
    return {
        op: Number(digits.slice(digits.length - 2).join("")),
        paramModes: digits.slice(0, digits.length - 2).reverse()
    };
}

module.exports = intcode;
