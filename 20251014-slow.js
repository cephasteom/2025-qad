z.bpm.set(130)

let qs = 4
let phase = qphs().mul($(2).pow(qs)).step(1).at(t()).cache(16,4)
let prob = qpbs().mul($(2).pow(qs)).step(1).at(t()).cache(16,4)
let result = qresult().div($(2).pow(qs))

let progression = 'Dhexaeo%16|*2 Bblyd%16|*2 Gmi7%8|*2 Dmi%6| Ami%8'

qubits.slice(0,qs).map((q,i,arr) => {
  let last = i === arr.length - 1
  q.ry(qphs().at(t()))
  !(i%2) && q.cz(i+1)
  q.rz(qpbs().at(t()))
  i%2 && (last ? q.cz(0,1) : q.cz(i+1))
});

fx0.set({
  delay:.5,
  _dtime:btms('.75?1.5?.25*16|*4'),
  dfb:toggle(s0.m).mtr(.5,.75),
  reverb:noise(), rtail:.1, rspread: 1,
  dist:noise(.25,0.25,.5), _drive:noise(.3,0,.125),
  m:s0.m, lag:btms(1),
  lpf:.3,hpf:.5,
  level: noise(.25,.5,1).mul(tri(1/32,1,0)),
  e:s0.e,
})

;streams.slice(0,6).map(s => s.nudge.c().mod(4).neq(3).ifelse(sine(.5,0,25)))

s0.set({
  inst: 'tone.synth', 
  cut:0, 
  level:noise(.5,0,.125), 
  s:.5, r:btms(2), mods:.75, moda:10, 
  hpf:.3,
})
s0.fx0.noise(.1,.75,1)
s0._pan.noise()
s0._modi.noise(.25,1,3).mul(100)
s0._harm.set(prob).div(16).step(.25).add(.5)
s0.amp.set(phase).div(16).mtr(0.1,.75)
s0._n.set(progression)
  .at(c().mod(32).lt(16).ifelse(
    saw(1,0,8).step(1),
    prob
  ))
  .sub(12)
s0.m.not(s0.e).and(every(2)).degrade()
s0.e.set(s1.e)

s1.set({inst:1, bank:'lw.kick', dur:btms(0.25),lag:10, fx0:.125, cut: [4,6,7], vol: .5})
s1._n.set(s2.e).ifelse(68,56)
s1.e.set('3:8|*7 3:8*2').and('1*4 0*4 | 0*2 1*6')
s1.m.set('5:16')

s2.set({
  inst:1, bank:'lw.hh', i: '2*3 3', 
  cut: [3], cutr:btms(.5), amp: saw(4,.25,0),
  delay:toggle(s2.e).mtr(.1,.75).mul(square(1/12)),
  dtime:btms(1.5),dfb:.5,dcolour:.5
})
s2.pan.set(s4.pan).subr(1)
s2.e
  .not(s1.e)
  .and(c().mod(32).lt(16).ifelse('5:16','11:16'))

s3.set({inst:1, bank:'gm.static', snap: q(), dur:btms(4), i:2, s:.5, fx0:noise(.3,0,.5),level:.25, hpf:.5})
s3.begin.saw()
s3.e.set(s1.e)

// try breaks.archn, breaks.145
s4.set({inst:1, bank:'breaks.archn',snap:q(),a:btms(.5),acurve:.75,fx0:noise(.5,0,.25),nudge:0,lpf:.75})
s4.dur.saw(1,4,0).btms()
s4.i.set('4?5?6*16|*4')
s4.hpf.saw(1/16,.75,.4)
s4.begin.c().mod(4).eq(3).ifelse(saw())
s4.pan.c().mod(4).eq(3).ifelse(random(.2,.8),.5)
s4.e.c().mod(4).eq(3).ifelse(
  $(s1.e).and('0*3 1*5'),
  s2.e
)

s7.set({inst: 0, n: 26, dist: .3, acurve:.75, vol:.6})
s7.lforate.bts(1.5)
s7.lfodepth.bts('1.5 | 0')
s7.a.c().mod(2).ifelse(0.125,0.5).btms()
s7.e.every(32).or(c().mod(2).ifelse(s1.e))

let text = 'Out of nowhere, the mind comes forth.'

s5.set({inst: 'tone.mono', cut: 0, hpf: .4})
s5.fila.textToNormal(text).mtr(10,1000).mul(tri(1/16,0,1))
// s5.fila.set(0)
s5.level.textToNormal(text).mtr(0,0.5)
s5.fx0.set(s5.level).subr(1)
s5.n.textToMidi(text).tune(progression).sub(12)
// s5.e.textToRhythm(text).and(s2.e)

s6.set({inst: 2, bank: 'vox.babel', snap: q().div(2), level: 0.5, fx0:1, i: c().div(4).step(1), lag:btms(1), hpf:.35,dur:btms(6), delay: 0, dfb:.8, dtime: btms(1/8)})
s6._rate.textToNormal(text).mtr(0.5,1)
s6.begin.saw(0.5)
s6._n.textToMidi(text).tune(progression).sub(24)
s6.e.set(s1.e).and(c().mod(8).gt(6))
s6.m.not(s6.e)