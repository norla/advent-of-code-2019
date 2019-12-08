#!/usr/bin/env ruby

input = File.read("input/d8.txt")
layers = input.scan(/.{150}/)
counts = layers.map { |l| Hash[["0", "1", "2"].map{|n| [n, l.count(n)]}] }
sorted = counts.sort { |a,b| a["0"] <=> b["0"]}
puts "Part 1: %s" % [sorted[0]["1"] * sorted[0]["2"]]

top, *lower = layers
image = top.each_char.with_index.map{ |p, i| p == "2" ? lower.find { |l| l[i] != "2"}[i] : p}
puts "Part 2:"
image.join("").scan(/.{25}/).each { |x| puts x.gsub("0", " ").gsub("1", "#")};
