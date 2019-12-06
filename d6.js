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

const tree = nodes.reduce((acc, n) => {
  acc[n] = [input[n]]
    .concat(Object.entries(input).filter(([_, v]) => v === n).map(([k]) => k))
    .filter(k => k)
  return acc;
}, {});


let thePath;
function findSanta(node, path) {
  const prev = path[path.length - 1];
  return tree[node].filter(n => n !== prev).find(n => {
    if (n === "SAN") thePath = path;
    return n === "SAN" || findSanta(n, path.concat(node));
  });
}

findSanta("YOU", []);
console.log("FOO", thePath.length - 1); // 409
