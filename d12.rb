#!/usr/bin/env ruby

ex1 = [
  "<x=-1, y=0, z=2>",
  "<x=2, y=-10, z=-7>",
  "<x=4, y=-8, z=8>",
  "<x=3, y=5, z=-1>"
]


# ex 2
ex2 = [
  "<x=-8, y=-10, z=0>",
  "<x=5, y=5, z=10>",
  "<x=2, y=-7, z=3>",
  "<x=9, y=-8, z=-3>"
]
input = ex2;
input = File.readlines("./input/d12.txt")

moons = input.map { |l|
  pos = l.match(/x=(-?\d+), y=(-?\d+), z=(-?\d+)/) .to_a.slice(1,3) .map{ |x| x.to_i }
  {pos: pos, vel: [0, 0, 0]}
}

1000.times{ |n|
  pairs = moons.combination(2).to_a;
  pairs.each{ |m1, m2|
    [0,1,2].each{ |dim|
      if m1[:pos][dim] > m2[:pos][dim] then
        m1[:vel][dim] -= 1
        m2[:vel][dim] += 1
      elsif m1[:pos][dim] < m2[:pos][dim] then
        m1[:vel][dim] += 1
        m2[:vel][dim] -= 1
      end
    }
  }
  moons.each{ |m|
    [0,1,2].each{ |dim|
      m[:pos][dim] += m[:vel][dim]
    }
  }
}

def energy (moons)
  moons.reduce(0) { |sum, m|
    pot = m[:pos].map{ |n| n.abs() }.reduce(0, :+)
    kin = m[:vel].map{ |n| n.abs() }.reduce(0, :+)
    sum + pot * kin
}
end

puts "Part 1: %d" % (energy(moons))

require 'set'

moons = input.map { |l|
  pos = l.match(/x=(-?\d+), y=(-?\d+), z=(-?\d+)/) .to_a.slice(1,3) .map{ |x| x.to_i }
  {pos: pos, vel: [0, 0, 0]}
}

n = 0
initial = Marshal.dump(moons);
start = Time.now

#while (!states.add?(Marshal.dump(moons)))
pairs = moons.combination(2).to_a;
while(true)
 # puts moons
 # puts
  pairs.each{ |m1, m2|
    [0,1,2].each{ |dim|
      if m1[:pos][dim] > m2[:pos][dim] then
        m1[:vel][dim] -= 1
        m2[:vel][dim] += 1
      elsif m1[:pos][dim] < m2[:pos][dim] then
        m1[:vel][dim] += 1
        m2[:vel][dim] -= 1
      end
    }
  }
  moons.each{ |m|

    [0,1,2].each{ |dim|
      m[:pos][dim] += m[:vel][dim]
    }
  }
  n += 1
  if (Marshal.dump(moons) == initial)
    break
  end
  n += 1;
  if (n % 60000 == 0)
    #puts n / 4686774924.0
    elapsed = Time.now - start;
    tp = n/elapsed
    puts  4686774924.0/(tp*60*60)
  end
end

#puts states.size
puts moons
puts n
