"use strict";

const _ = require("lodash");

const lower = 171309;
const upper = 643603;

const decreasing = (l) => l.find((x, i) => (i !== l.length - 1) && x > l[i + 1]);
const hasDupl = (l) =>  l.find((x, i) => x === l[i + 1]);
const hasDupl2 = (l) => l
      .reduce(({found, dupls}, x, i) => {
        if (x !== l[i + 1]) return {found: found || dupls === 2, dupls: 1};
        else return {found, dupls: dupls + 1};
      }, {found: false, dupls: 1})
      .found;

function isValid(pwd) {
  const digits = [...pwd.toString()].map(x => Number(x));
  return hasDupl(digits) && !decreasing(digits);
}

const valid = _.range(lower, upper +1).filter(isValid)
console.log("Part 1", valid.length); // 1625

function isValid2(pwd) {
  const digits = [...pwd.toString()].map(x => Number(x));
  return !decreasing(digits) && hasDupl2(digits);
}

const valid2 = _.range(lower, upper +1).filter(isValid2)
console.log("Part 2", valid2.length); //                                                                                                               111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
