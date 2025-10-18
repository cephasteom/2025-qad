z.bpm.set(140)

let qs = 4

qubits.slice(0,qs).map((q,i,arr) => {
  let last = i === arr.length - 1
  q.ry(noise(1/(i+1)))
  !(i%2) && q.cz(i+1)
  q.rz(noise(1/(i+1)))
  i%2 && (last ? q.cz(0,1) : q.cz(i+1))
});

let phase = qphs().mul($(2).pow(qs)).step(1).at(t()).cache(16,4)
let prob = qpbs().mul($(2).pow(qs)).step(1).at(t()).cache(16,4)

fx0.set({
  hpf: .4,
  delay:1,
  dtime:btms(s3._harm), 
  dfb:toggle(s1.e).mtr(.1,.75),
  reverb:toggle(s0.e,s1.e).mtr(1,0), rtail:.1,
  e:1,
})

s0.set({inst: 1, bank: 'ct.01', cut:[0,1,2], i:13, s:.1, vol:.75})
s0.dur.set('4|*16 .25|*8').btms()
s0.e.set('3:8|*7 3:8*2')

s1.set({
  inst: 1, bank: 'lw.hh', 
  cut: random().gt(.5).ifelse(0,[0,4]).cache(16,4), 
  cutr:btms('.5?.05*8'), 
  i: '11*3 16|*12 13*3 14|*8', s:.5, fx0:.5})
s1.e.not(s0.e).and('5:8')

s2.set({inst: 1, bank: 'mm.stadil', s:.25, hpf:.5, fx0:noise(), cut:2,pan:noise(.5,.25,.75)})
s2.i.set(phase).add(c())
s2.n.set('Cegy%16').at(prob).mod(12).add(48)
s2.e.set(prob).gt(0).degrade(.25)

s3.set({inst: 1, bank:'breaks.archn', hpf:.9, snap:q(), vol:.25})
s3.i.set(phase)
s3.begin.saw()
s3.e.c().mod(32).gt(15).and(set(s0.e).or(c().mod(8).eq(7)))

s4.set({inst: 0, cut:[2], dist:.3, drive:0.2, modi:saw(4,1,.5),vol:.6})
s4._harm.set(prob).mod(11).set(2).add(1)
s4._n
  .set(s4.e)
  .ifelse(
    26,
    set(s2.n).sub(24).cache(64,2)
  )
s4.m.set(s1.e)
s4.e.not(s0.e)
  .and(not(s1.e))
  .and('2:16')

s5.set({inst: 2, bank: 'gm.horror', i: random(0,32).step(1), hpf:.75, dur:btms(2), loop:0, _fx0:noise(), r:1000, vol:.5, rate: random(.25,.75)})
s5.e.set('0|*15 1')
s5.m.set(1)

s6.set({inst: 1, bank: 'atmos', i: 3, _n: '55|*7 56', hpf:.4, _fx0:noise(), dur:btms(4),a:btms(4),acurve:.25})
s6.m.set(1)
// s6.e.every(128)
s6.e.every(16)