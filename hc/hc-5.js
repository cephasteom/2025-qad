// ROOM 5
// d.fetch('https://zendata.cephasteom.co.uk/api/packets', 'hc')
// d.fetch('https://zendata.cephasteom.co.uk/api/packet', 'hc_last')

const book = d.hc[3]
let mf = 2

z.bpm.set(160)

let hits = book.data.states.length; // length of book
let loop = 4
let smoothing = 4

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

s0.t.saw(0,z.q*loop,1/loop)
s0.set({inst:2,bank:'breaks.hp',_snap:z.q*loop,cut:2,fx0:1/8,d:ms(1/4),s:0.25,cutr:ms(1/2),r:ms(2)})
s0.p._vol.mul(0.75)
s0.p.i.random(0,6).step(1)
s0.p.n.set('50 Dmi%6..?*15')
s0.p._grainsize.set(energy).mtr(0.5,0.125)
  .mul($noise().mtr(0.5,1))
s0.p.dur.set(energy).mtr(4,8).btms()
s0.px.begin.noise().gt(0.5).if(0, $noise().step(0.125))
s0.py._grainrate.saw(2,64,16).sub(5)
s0.py.rate.saw(0.25,0.5,0.25)
s0.e.or($every(32))
s0.mute.noise(0,1).gt(energy)
s0.solo.noise(0,1).lt(energy)

s1.set({in:2,ba:'oriki',lc:0.75,cut:1,dur:ms(1/16),r:10,dtime:50,dfb:0.85})
s1.p.nudge.sine(0,1/8,0,1/6).btms()
s1.px.begin.saw(0,1/4)
s1.p._dcolour.noise(0.5,1,0,1/6)
s1.p._delay.set(1).sub($set(s1.p._dcolour).mul(0.125))
s1.p._pan.noise(0.25,0.75,0,1/3)
s1.p._vol.mul(4)
s1.e.reset().every(1)

s2.t.saw(0,z.q*loop,1/loop).step(1)
s2.set({inst:6,r:ms(4)})
s2.p.dist.set(energy).mtr(0,0.25)
s2.p.dur.set(s0.p.dur)
s2.p.n.set('38')
s2.p._fat.noise().mul(0.125)
s2.p._drive.set(1).sub(s2.p._fat).mul(0.5)
s2.px.lforate.saw()
s2.py.lfodepth.saw()
s2.e.reset()
  .set(s0.e)
  .and($every('1*2 1?2*14'))
  .and($c().mod(loop).lt(loop - 1))
s2.m.reset().set(1)
s2.solo.set(s0.solo)
s2.mute.set(s0.mute)

s3.set({inst:0,fx0:1,fx1:1,dur:ms(2),a:ms(4),cut:3,lag:ms(4),moda:ms(4),strum:ms(1),lc:0.5})
s3.p.n.set('Dmi').sub(12)
s3.py._modi.saw(1,2).mul($set(energy).mtr(1,4))
s3.solo.set(s0.solo)
// s3.e.or($every(16))

s4.set({in:1,ba:'air',dur:ms(16),snap:z.q*2,i:3,lag:ms(smoothing),loop:1})
s4.py._pan.saw(0.3,0.7)
s4.p.begin.saw(0,1,1/2)
s4.p._vol.mul(2)
s4.e.reset().every(z.q)

s5.set({in:1,ba:'atmos',dur:ms(2),i:0,lag:ms(smoothing),
fx0:1,fx1:1,cutr:ms(0.5),loop:0.125})
s5.p._vol.mtr(0,1)
s5.p.n.set('65|60|65')
s5.px._pan.saw()
s5.px.a.saw(0.1,4).btms()
s5.p.begin.saw(0,0.5)