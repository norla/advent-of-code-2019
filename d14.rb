#!/usr/bin/env ruby

input = File.readlines("./input/d14.txt") #ex5

reactions = input.reduce({}){ |acc, l|
  left, right = l.split(" => ")
  prodQ, prodC = right.split(" ")
  acc[prodC] = left.split(", ").reduce({amount: prodQ.to_i, sources: {}}){ |acc2, r|
    fromQ, fromC = r.split(" ")
    acc2[:sources][fromC] = fromQ.to_i
    acc2
  }
  acc
}

needs = {"FUEL" => 4052920}
leftovers = {}
while needs.keys != ["ORE"] do
  newNeeds = {"ORE" => needs["ORE"]}
  needs.each do |need, needAmount|
    next if need == "ORE"
    leftover = [(leftovers[need] or 0), needAmount].min
    leftovers[need] = (leftovers[need] or 0) - leftover;
    needAmount -= leftover
    reaction = reactions[need];
    nReactions = (needAmount.to_f / reaction[:amount]).ceil
    surplus = reaction[:amount] * nReactions - needAmount
    leftovers[need] = (leftovers[need] or 0) + surplus
    reaction[:sources].each do |source, sourceAmount|
      amount = sourceAmount * nReactions
      newNeeds[source] = newNeeds[source] ? newNeeds[source] + amount : amount
    end
  end
  needs = newNeeds
end

p  1000000000000 - needs["ORE"]
# 4052920
