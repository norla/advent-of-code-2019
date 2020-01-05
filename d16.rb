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
#print run(input, 100).join("")
#print run(input * 10000, 100).join("")
# 1  2  3  4 1001 1010 0100 0212
# 1  0  3  0 1111 1111 1111 1111
# 0  2  0  4 1001 
#
## does not pattern turn into all 0 pretty fast?
## no. there will be N-1 leading zeros for the last digit
#
# Aborting when pattern/signal repeatsitself saves 99% of operations
# but till requires 42.265.440.744.912 operatin ons ?
#
# pattern size = current_number_index * 4
# required iterations = pattern_size.lcm(651)
#
# string slice is O(n) since each byte is copied one-by-one
#
# Pack into homegrown binary format and do bitwise and
# 0100 1101 0010 -> 0001 0010 0011 0100

def fft2(signal, repeat)
  tot = 0;
  Array(0..(signal.length - 1) * repeat).each{ |n|
    patternLength = n * 4
    repeatLength = [patternLength.lcm(signal.length), signal.length * repeat].min
    p [n, patternLength,signal.length] if n % 1000 == 0
    tot += repeatLength
  }
  tot
end

def chunk(string, size)
    ((string.length + size - 1) / size).times.collect { |i| string[i * size, size] }
end



def fft3(signal)
  Array(0..signal.size - 1).map{ |n|
    patternLength = 4 * n
    p [Time.now, n, patternLength,signal.length] if n % 1000 == 0
    if (patternLength > signal.length * 4)
    # just zeroes so...
      0
    else
     # pattern = getPattern(n)
     # tot = signal.each_with_index.reduce(0){ |acc, (d, i)|
     #   acc + pattern[i % pattern.length] * d
     # }
     # tot.abs % 10
      1
    end
  }
end

ops = fft2("1" * 651, 10000)
puts ops
puts "%.20f" % [ops.to_f / (65100000.pow(2))]
