"use strict";
const fs = require("fs");

const input = fs.readFileSync("./input/d1.txt", "utf-8").split("\n").filter(l => l !== "");

function fuel(mass) {
  return Math.floor(mass / 3) - 2;
}

function fuel2(mass) {
  const thisFuel = fuel(mass);
  return (thisFuel > 0) ? thisFuel + fuel2(thisFuel) : 0;
}

console.log("Solution 1:", input.map(fuel).reduce((sum, n) => sum + n));
console.log("Solution 2:", input.map(fuel2).reduce((sum, n) => sum + n));
