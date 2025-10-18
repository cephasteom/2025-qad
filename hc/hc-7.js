// ROOM 7
// d.fetch('https://zendata.cephasteom.co.uk/api/packets', 'hc')
// d.fetch('https://zendata.cephasteom.co.uk/api/packet', 'hc_last')

// 0, 10, 20, 3
const book = d.hc[10]
let mf = 2
let lb = 1

z.bpm.set(160)

let hits = book.data.states.length; // length of book
let smoothing = 4
let loop = 3
z.t.saw(0,z.q*loop,1/loop).step(1)
  .add(z.q*4)

let states = $set(book).fn(o => o.data.states)
let amps = $set(book).fn(o => o.data.amps)
let values = $set(book).fn(o => o.data.values)

let energy = $cc(0,mf,0.75)
let space = $cc(1,mf,0.5)
let fx0level = $cc(2,mf,0.5)
let fx1level = $cc(3,mf,0.5)

streams.slice(0,6).map((s,i) => {
  let t = $t().mod(hits)
  s.x.set(values).at(t).mtr(0,1,-Math.PI,Math.PI).subr(1)
  s.y.set(amps).at(t).at(i)
  s.e.set(states).at(t).at(i)
  s.m.n(s.e).and($every(2))
  s.p._vol.cc(4 + (i * 2),mf,1)
});

fx0.set({re:1, rsize:0.75, rdamp:0.5, _track:6})
fx0.p.rtail.set(space)
fx0.p._level.set(fx0level)
fx0.e.set(1)

fx1.set({de:1, _track:7})
fx1.p.dtime.set(space).mtr(1.5,3.5).step(0.5).btms()
fx1.p.dfb.set(space)
fx1.p._level.set(fx1level)
fx1.e.set(1)

s0.set({inst:2,bank:'breaks.archn',_snap:z.q*loop,cut:[3],fx0:1/8,d:ms(1/4),cutr:ms(1/2)})
s0.p.i.random(0,16).step(1)
s0.p._vol.mul(0.5)
s0.py._grainsize.saw(1/8,1/32)
s0.py._grainrate.set(32,8).add(4)
s0.px.begin.noise().gt(0.5).if(0, $noise().step(0.125))
s0.p._pan.set(s0.px.begin).eq(0).if(0.5, $random(0.25,0.75))
s0.px.s.saw(0.125,0.75)
s0.p.dur.set(energy).mtr(0.25,4).btms()
s0.mute.noise(0,1).gt(energy)
s0.solo.noise(0,1).lt(energy)

s1.set({in:2,bank:'clap808',dur:ms(1),cut:[0,2,7]})
s1.p._vol.mul(1.75)
s1.e.reset().set('0*3 1 0*4| 0 | 0 | 0')
s1.solo.set(s0.e)

// sine bass
s2.set({inst:6,dur:ms(2),r:ms(4),lforate:1,lfodepth:0,fat:0.25,cut:2,cutr:50})
s2.py.n.set(38)
s2.e.reset().set(s0.e)
s2.m.reset().set(1)
s2.solo.set(s0.solo)
s2.mute.set(s0.mute)

s5.set({inst:1,bank:'gm.static',dur:ms(16),lag:ms(smoothing),fx0:0,fx1:0,cut:5,snap:z.q*2})
s5.p._vol.mul(2)
s5.p.i.random(0,16).step(1)
s5.px._pan.random()
s5.p.begin.saw(0,0.5,0,1/4)
s5.solo.set(s0.solo)
// s5.e.set(s0.e)
s5.m.set(s5.e)

// l bass
s7.set({midi:lb,mididelay:200,dur:ms(4)})
s7.py.n.set('Dmpent%6..*6').sub(24)
s7.px._cc2.saw(0,0.75)
s7.py._cc3.saw(1,0.1)
s7.e.set(s2.e)
s7.m.set(s2.m)
s7.x.set(s2.x)
s7.y.set(s2.y)
s7.solo.set(s2.solo)
s7.mute.set(s2.mute)

s4.set({in:1,ba:'air',dur:ms(16),snap:z.q*2,i:3,lag:ms(smoothing),loop:1,
fx0:1})
s4.py._pan.saw(0.3,0.7)
s4.p.begin.saw(0,1,0,1/2)
s4.e.reset().every(z.q*4)
s4.solo.set(s0.e)