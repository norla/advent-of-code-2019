"use strict";

const fs = require("fs");
const events = require("events");

const strInput = fs.readFileSync("./input/d9.txt", "utf-8")

let input;

input = [
    109,1, // incease base 1
    204,-1, // outout base - 1
    1001,100,1,100, // $100 ++
    1008,100,16,101, // $101 = true if 100 eq 16
    1006,101,0, // start over if 101 eq 0
    99];

input = strInput
      .split(",")
      .map(n => Number(n));

function amp(inputCh, outputCh) {
    return new Promise(async (resolve) => {
        let pos = 0, base = 0;
        const program = input.slice(0); // clone
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
                    program[p1] = await inputCh.read();
                    pos += 2;
                    break;
                case 4: //write
                    [p1] = getParams(1, pos, program, paramModes, base);
                    outputCh.write(p1);
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
                    return resolve();
                default:
                    throw "Unknown op " + op;
            }
        }
    });
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

function channel(initialValue) {
    const evt = new events.EventEmitter();
    const buffer = [initialValue];
    return {
        write: (d) => {
        //    console.log("WRITE" , d)
            buffer.push(d);
            evt.emit("data", d);
        },
        read: () => {
            if (buffer.length > 0) return Promise.resolve(buffer.shift());
            return new Promise((resolve) => evt.once("data", () => resolve(buffer.shift())));
        },
        evt
    }
}


async function run () {
    const input = channel(1);
    const output = channel();
    output.evt.on("data", (d) => {console.log("Part 1" , d)});
    await amp(input, output);

    const input2 = channel(2)
    const output2 = channel()
    output2.evt.on("data", (d) => {console.log("Part 2" , d)});
    await amp(input2, output2);
}

run()
