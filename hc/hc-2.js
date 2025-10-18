// ROOM 2
// d.fetch('https://zendata.cephasteom.co.uk/api/packets', 'hc')
// d.fetch('https://zendata.cephasteom.co.uk/api/packet', 'hc_last')

seed(3)

// 2,0,3
const book = d.hc[2]

z.bpm.set(180)

let mf = 2
let loop = book.data.states.length; // length of book
loop = 3 * z.q; // custom length
let smoothing = 4
z.t.saw(0,loop,1/3)
  .add(z.q)

let states = $set(book).fn(o => o.data.states)
let amps = $set(book).fn(o => o.data.amps)
let values = $set(book).fn(o => o.data.values)

let energy = $midicc(0,mf,0.5)
let space = $cc(1,mf,0.5)
let fx0level = $cc(2,mf,0.5)
let fx1level = $cc(3,mf,0.5)

streams.slice(0,6).map((s,i) => {
  let t = $t().mod(loop)
  s.x.set(values).at(t).mtr(0,1,-Math.PI,Math.PI).subr(1)
  s.y.set(amps).at(t).at(i)
  s.e.set(states).at(t).at(i)
  s.m.n(s.e).and($every(2))
  s.p._vol.cc(4 + (i * 2),mf,0)
});

fx0.set({re:1, rsize:0.75, rdamp:0.5, _track:6})
fx0.p.rtail.set(space)
fx0.p._level.set(fx0level)
fx0.e.set(1)

fx1.set({de:1, _track:6})
fx1.p.dtime.set(space).mtr(1.5,3.5).step(0.5).btms()
fx1.p.dfb.set(space)
fx1.p._level.set(fx1level)
fx1.e.set(1)

s0.set({inst:'2',bank:'breaks.archn',_snap:loop,cut:[2,3],fx0:1/8,d:ms(1/4),s:0.125,cutr:ms(1/2)})
s0.p.i.random(0,16,1)
s0.p._grainsize.set(energy).mtr(1,0.125)
s0.p.dur.set(energy).mtr(0.5,4).btms()
s0.px.begin.noise().gt(0.5).if(0, $noise().step(0.125))
s0.mute.noise(0,1).gt(energy)
s0.solo.noise(0,1).lt(energy)

s1.set({inst:2,bank:'gm.sine',cut:[0,1,4],dur:ms(1),cutr:ms(0.25),acurve:0.75})
s1.p._vol.mul(2.5)
s1.p.i.random(0,12,1)
s1.p._pan.noise()
s1.px.begin.saw(0,1,1/8).step(1/8)
s1.px._grainsize.saw(1/6,1/16)
s1.px._grainrate.saw(6,32)
s1.py._rate.saw(1,4).mul(-1)
s1.py._level.saw(0,1)
s1.py._fx0.saw(1,0)
s1.py.a.saw(0.25,2).btms()
s1.e.and($every(2))

s2.set({inst:6,dur:ms(2),r:ms(4),lforate:1,lfodepth:0,fat:0.25})
s2.p.n.set(38)
s2.e.reset().set(s0.e).and($c().mod(loop/z.q).lt((loop/z.q) - 1))
s2.m.reset().set(1)
s2.solo.set(s0.solo)
s2.mute.set(s0.mute)

s4.set({inst:1,bank:'metal.vlong1',dur:ms(8),r:ms(1),d:ms(1/4),a:ms(1/4)})
s4.p._vol.mul(4)
s4.p.i.random(0,16).step(1)
s4.p.n.random(0,16).step(1).add(60)
s4.px.begin.saw(0,1,1/16).step(1/8)
s4.p.s.set(energy).mtr(0.75,0.25)
s4.p._level.set(1).sub(s1.py._level)
s4.p._fx0.set(s4.p._level).subr(1)
s4.p._fx1.set(s4.p._level).subr(1)
s4.p._pan.set(1).sub(s1.p._pan)
