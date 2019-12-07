"use strict";

const fs = require("fs");

const strInput = fs.readFileSync("./input/d7.txt", "utf-8")

const input = strInput
  .split(",")
  .map(n => Number(n));

function run(inputs) {
  let pos = 0;
 // console.log("INP", inputs, input)
  const program = input.slice(0); // clone
  const outputs = [];
  while (true) {
 //   console.log(program.slice(pos))
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
        program[p1] = inputs.shift();
        pos += 2;
        break;
      case 4:
        [p1] = getParams(1, pos, program, paramModes);
        outputs.push(p1);
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
        return outputs;
      default:
        throw "Unknown op " + op;
    }
  }
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

const ps = [0, 1, 2, 3, 4];
let maxThrust = 0;
//let maxSetting;
ps.forEach(a => ps.forEach(b => ps.forEach(c => ps.forEach(d => ps.forEach(e => {
  let lastOutput = 0;
  const setting = [a, b, c, d, e];
  if (new Set(setting).size === 5) {
  setting.forEach(phaseSetting => {
    lastOutput = run([phaseSetting, lastOutput])[0]
  });

  if (lastOutput > maxThrust) {
    maxThrust = lastOutput;
  //  maxSetting = setting;
  }
  }
})))));

console.log("Part 1", maxThrust);
