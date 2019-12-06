"use strict";

const fs = require("fs");

const input = fs
  .readFileSync("./input/d6.txt", "utf-8")
  .split("\n")
  .reduce((acc, n) => {
    const [to, from] = n.split(")");
    acc[from] = to;
    return acc;
  }, {});

const nodes = [...new Set(Object.values(input).concat(Object.keys(input)))];


function count(node) {
  const inner = input[node];
  if (inner) return 1 + count(inner);
  else return 0;
}

const res = nodes.map(count).reduce((acc, n) => acc + n, 0);
console.log("- - - DEBUG res", JSON.stringify(res, null, 2));
