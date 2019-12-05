"use strict"

const fs = require("fs");
const _ = require("lodash");
const input = fs.readFileSync("./input/d2.txt", "utf-8").split(",").map(n => Number(n));
//let input = [1,9,10,70, 2,3,11,0, 99, 30,40,50];
//input = [2,4,4,5,99,0]

//console.log("- - - DEBUG input", JSON.stringify(input, null, 2));
function run(noun, verb) {
    let pos = 0;
    const program = input.slice(0);
    program[1] = noun;
    program[2] = verb;
    while(program[pos] != 99) {
        const [op, p1, p2, pR] = program.slice(pos, pos + 4);
        const res = op === 1 ? program[p1] + program[p2] : program[p1] * program[p2];
        program[pR] = res;
        pos += 4;
    }
    return program[0]
}

console.log("Part 1", run(12, 2)); //4945026


_.range(0, 100).forEach(noun => _.range(0, 100).forEach(verb => {
    if (run(noun, verb) === 19690720) {
        console.log("Part 2", 100 * noun + verb);
    }
}));
