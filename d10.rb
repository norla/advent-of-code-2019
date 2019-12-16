#!/usr/bin/env ruby

input = [
  ".#....#####...#..",
  "##...##.#####..##",
  "##...#...#.#####.",
  "..#.....#...###..",
  "..#.#.....#....##"
];

input = File.readlines("input/d10.txt")

starMap = input.map.with_index {
  |l, y| l.chars.map.with_index {
    |c, x| {x: x, y: y, item: c}
  }
}.flatten.filter { |c| c[:item] == "#" }

visibilty = starMap.map { |p|
  slopes = starMap.filter{ |o| o != p }.map { |o|
    Math.atan2(o[:y] - p[:y],  o[:x] - p[:x])
  }
  p[:inSight] = slopes.uniq.size
  p
}.sort{ |a, b| b[:inSight] <=> a[:inSight]}

puts "Part 1 %s" % [visibilty[0][:inSight]]

l = visibilty[0];
#p l

starMap = starMap
    .filter{ |o| o[:x] != l[:x] || o[:y] != l[:y]}
    .map { |p|
  p[:angle] =  Math.atan2(l[:y] - p[:y],  l[:x] - p[:x]) * 180 / Math::PI - 90
  if (p[:angle] < 0)
   p[:angle] += 360;
  end
  p[:dist] = Math.sqrt((l[:x] - p[:x]) ** 2 + (l[:y] - p[:y]) ** 2)
  p
}.sort_by{ |p| [p[:angle], p[:dist]]}

angle = 0.0;
victims = []
while starMap.size > 0
  victim = starMap.find{ |p| p[:angle] >= angle}
  if victim
    victims << victim
    angle = victim[:angle] + 0.001;
    if (angle > 360)
      angle = 0
    end
    starMap.delete(victim)
  else
    angle = 0
  end
end

puts "Part 2 %s" % [victims[199][:x]*100 + victims[199][:y]]
