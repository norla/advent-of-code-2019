"use strict";

const fs = require("fs");
const events = require("events");

const strInput = fs.readFileSync("./input/d7.txt", "utf-8")

const input = strInput
      .split(",")
      .map(n => Number(n));

function amp(inputCh, outputCh) {
    return new Promise(async (resolve) => {
        let pos = 0;
        const program = input.slice(0); // clone
        while (true) {
            const [opCode] = program.slice(pos, pos + 1);
            const { op, paramModes } = decode(opCode);
            let p1, p2, pR;
            switch (op) {
                case 1:
                    [p1, p2] = getParams(2, pos, program, paramModes);
                    pR = program[pos + 3];
                    program[pR] = p1 + p2;
                    pos += 4;
                    break;
                case 2:
                    [p1, p2] = getParams(2, pos, program, paramModes);
                    pR = program[pos + 3];
                    program[pR] = p1 * p2;
                    pos += 4;
                    break;
                case 3:
                    p1 = program[pos + 1];
                    program[p1] = await inputCh.read();
                    pos += 2;
                    break;
                case 4:
                    [p1] = getParams(1, pos, program, paramModes);
                    outputCh.write(p1);
                    pos += 2;
                    break;
                case 5:
                    [p1, p2] = getParams(2, pos, program, paramModes);
                    pos = p1 !== 0 ? p2 : pos + 3;
                    break;
                case 6:
                    [p1, p2] = getParams(2, pos, program, paramModes);
                    pos = p1 === 0 ? p2 : pos + 3;
                    break;
                case 7:
                    [p1, p2] = getParams(2, pos, program, paramModes);
                    pR = program[pos + 3];
                    program[pR] = p1 < p2 ? 1 : 0;
                    pos += 4;
                    break;
                case 8:
                    [p1, p2] = getParams(2, pos, program, paramModes);
                    pR = program[pos + 3];
                    program[pR] = p1 === p2 ? 1 : 0;
                    pos += 4;
                    break;
                case 99:
                    return resolve();
                default:
                    throw "Unknown op " + op;
            }
        }
    });
}

function getParams(n, pos, program, paramModes) {
    const params = program.slice(pos + 1, pos + 1 + n);
    return params.map((p, i) => (paramModes[i] === "1" ? p : program[p]));
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
            buffer.push(d);
            evt.emit("data", d);
        },
        read: () => {
            if (buffer.length > 0) return Promise.resolve(buffer.shift());
            return new Promise((resolve) => evt.once("data", () => resolve(buffer.shift())));
        }
    }
}

function allPhaseSettings(pv) {
    const settings = [];
    pv.forEach(a => pv.forEach(b => pv.forEach(c => pv.forEach(d => pv.forEach(async e => {
        const setting = [a, b, c, d, e];
        if (new Set(setting).size === 5) {
            settings.push(setting)
        }
      })))));
    return settings;
}

async function run() {
    const settings = allPhaseSettings([5, 6, 7, 8, 9]);
    const work = settings.map(async setting => {
        const [ea, ab, bc, cd, de] = setting.map(channel);
        ea.write(0);
        await Promise.all([amp(ea, ab), amp(ab, bc), amp(bc, cd), amp(cd, de), amp(de, ea)]);
        return ea.read();
    });
    const signals = await Promise.all(work);
    console.log("Part 2", signals.sort((a, b) => b - a)[0]);
}

run();
