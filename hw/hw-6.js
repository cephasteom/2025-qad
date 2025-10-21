// d.fetch('https://zendata.cephasteom.co.uk/api/book/7', 'holywrit')
z.q.set(16)
z.bpm.set(180)

let loop = q().floor()
let fill = c().mod(8).eq(7)

// circuit
let param = i => $(d.holywrit).at(t())
  .fn(o => o.params).at(i).or(0)
  .mtr(0,1,-Math.PI*2,Math.PI*2)

q0.fb(3).ry(param(0)).rz(param(4)).cx([1],2).ry(param(8)).rz(param(12))
q1.fb(0).ry(param(1)).rz(param(5)).cx([2],1).ry(param(9),1).rz(param(13))
q2.fb(1).ry(param(2)).rz(param(6)).cx([3],0).ry(param(10)).rz(param(14))
q3.fb(2).ry(param(3)).rz(param(7)).ry(param(11)).rz(param(15))

// all streams
streams.slice(0,16).map((s,i) => {
  s.set({dist:.25})
  s.x.qphase(i)
    // .add($noise())
    .mod(1)
  s.y.qpb(i)
    // .mul(5)
    .mod(1)
  s.e.set(fill).ifelse(
    qm(i%4).degrade(0.75).cache(loop,4),
    qm(i%4).degrade(0.5)
  )
  s.m.not(s.e)
});

let bassfile = 'http://localhost:6060/_midi/tune03/tune03-bass.mid'
let bassp = midifile(bassfile).cache(loop,8)

let kick = s0
let sn = s1
let hh = s2
let breaks = s3
let bass = s5
let layer1 = s8

kick.set({inst: 1, bank: 'kick.808', cut: [0, 3, 5, 2, 8],cutr:btms(0.5),vol:1.5, lpf:0.5})
kick.n.set(bassp).sub(31).mod(12).add(60)
  .add($('3:8').ifelse(0,12))
kick.dur.set('1 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0').ifelse(1, 1/16).btms()
kick.i.set('3:8').ifelse(5, 0)
kick.e
  .and(even())
  .or('3:8')

sn.set({inst: 1, bank:'toms808', i: 0, vol:1.1,
  cut: [0,1,2,3,5,6,7,8],dist:0,
  // fx0:0.5
})
sn.n.set(bassp).sub(34).mod(12).add(60)
sn.dur.set(sn.y).mtr(0.25,1).btms()
sn.s.saw(1/16,0.25,1)
sn.pan.set(breaks._pan).subr(1)
sn.e.reset().set('0 0 1 0 0 0 0 0 | 0')

hh.set({inst: 1, bank: 'gm.glitch.2b', dur:20, vol:2, r:5, snap:q().mul(2), 
  cut:[3],
  cutr:btms(0.5), s:0.5})
hh.hpf.set(hh.inst).eq(1).ifelse(0.5,0)
hh.amp.random(0.5,1).cache(loop,4)
hh._pan.set(breaks._pan).subr(1)
hh.i.set(hh.y).mul(16).step(1).cache(loop,4)
hh.begin.saw(.5)
hh.e.reset()
  .every('1|*16 2|*16')
  .every(1)
  .and(not(breaks.e))
  .and(not(sn.e))

breaks.set({inst:1, lc:0.3, vol:0.8, cut:[3,2,8],s:0,a:0})
breaks.dur.set('1 0 0 1 0 0 0 0 0').ifelse(1.5,1).btms()
breaks.d.set('1 0 0 1 0 0 0 0 0').ifelse(1.5,1).btms()
breaks.e.reset()
  .set(kick.e)
  .and(square(1/32))
breaks._pan.set(breaks.x).mtr(0.25,0.75)
breaks.s.saw(1/16,0.25,1)
breaks.i.set(fill).ifelse(
  8,
  $(breaks.x).mul(16).step(1)
)
breaks.snap.q().div(2)
breaks.bank.set('breaks.145')

layer1.set({
  lag:btms(1/4),
  inst:7,
  d:50,
  s:0.1,
  r:1000,
  op2a:0,
  op2d:10,
  op2ratio:1.5,
  dist:0,
  // fx0:0.5,
  level:0.35
})
layer1.n.set('3:8')
  .ifelse('Gmi%3','Gmi9%8')
  .sub(36).add($('3:8').ifelse(0,12))
layer1.strum.set('3:8').ifelse(0,1/4).btms()
layer1.dur.set('3:8').ifelse(1,1/8).btms()
layer1.amp.set('3:8').ifelse(1,0.5)
layer1.cut.not('3:8').ifelse(8)
layer1.e
  .add(even())
  .and(not(sn.e))
  .and(not(breaks.e))
  .or('3:8')
layer1._op2gain.set(layer1.x).mtr(10,100)
layer1._op2s.set(layer1.y).mtr(0.01,1)
layer1.op3gain.set(layer1.y).mtr(1,0)
layer1.op3ratio.set(layer1.x).mtr(1,11).step(1)
layer1.fx0.saw(1/32,0,0.5)
layer1.m.reset().not('3:8')

fx0.set({dfb:0.5,hpf:0.3,dtime:btms(0.25)})
fx0.delay.set(kick.n).mod(12).eq(0).mtr(0,0.75)
fx0.reverb.io(sn.e,kick.e).mtr(0.1,0.5)
fx0.rtail.io(sn.e,kick.e).mtr(0.1,0.35)
fx0.e.set(kick.e).or(sn.e)