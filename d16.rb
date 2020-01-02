#!/usr/bin/env ruby

def getPattern(digit)
  basePattern = [0,1,0,-1]
  basePattern.map{ |m| Array.new(digit + 1) { m } }.flatten.rotate
end

def fft(signal)
  Array(0..signal.size - 1).map{ |n|
    pattern = getPattern(n)
    tot = signal.each_with_index.reduce(0){ |acc, (d, i)|
      acc + pattern[i % pattern.length] * d
    }
    tot.abs % 10
  }
end

def run(input, n)
  digits = String(input).split("").map{|x| x.to_i}
  n.times do |i|
    digits = fft(digits)
  end
  digits
end
input = File.read("./input/d16.txt")
print run(input, 100).join("")
#print run(input * 10000, 100).join("")
