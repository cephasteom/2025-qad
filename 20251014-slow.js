z.bpm.set(85)

let qs = 4

let phase = qphs().mul($(2).pow(qs)).step(1).at(t()).cache(16,4)
let prob = qpbs().mul($(2).pow(qs)).step(1).at(t()).cache(16,4)
let result = qresult().div($(2).pow(qs))

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
  dist:noise(.25,0.25,.5), _drive:noise(.3,0,.5),
  m:s0.m, lag:btms(1),
  lpf:.3,hpf:.5,
  e:s0.e,
  vol:2
})

;streams.slice(0,4).map(s => s.nudge.sine(.5,0,25))

s0.set({
  inst: 0, 
  cut:0, 
  level:noise(.5,0,.125), 
  s:.5, r:btms(2), mods:.75, moda:10, 
  hpf:.3,
})
s0.fx0.noise(.1,.75,1)
s0._pan.noise()
s0._modi.noise(.25,1,3)
s0._harm.set(prob).div(16).step(.25).add(.5)
s0.amp.set(phase).div(16).mtr(0.1,.75)
s0._n.set('Dhexaeo%16|*2 Bblyd%16|*2 Gmi7%8|*2 Dmi%6| Ami%8').at(
  c().mod(32).lt(16).ifelse(
    saw(1,0,16).step(1),
    prob
  )
)
  .sub(12)
s0.m.not(s0.e).degrade()
s0.e.set(s1.e)

s1.set({inst:1, bank:'lw.kick', dur:btms(4),lag:10, fx0:.125, cut: 4, vol: .75})
s1._n.set(s2.e).ifelse(68,56)
s1.e.set('3:8|*7 3:8*2').and('1*4 0*4 | 0*2 1*6')
s1.m.set('5:16')

s2.set({inst:1, bank:'lw.hh', i: '2*3 3', cut: [3], cutr:btms(.5), amp: saw(4,.25,0)})
s2.e.set('5:16').and(not(s1.e))

s3.set({inst:1, bank:'gm.static', snap: q(), dur:btms(4), i:2, s:.5, fx0:noise(.3,0,.5),level:.25})
s3.begin.saw()
s3.e.set(s1.e)

s4.set({inst:1, bank:'breaks.145',snap:q().div(2),hpf:.8,i:'2?4*16|*4',a:btms(1/2),acurve:.75,fx0:noise(.5,0,.25)})
s4.e.set(s2.e)