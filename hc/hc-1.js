// ROOM 1
// d.fetch('https://zendata.cephasteom.co.uk/api/packets', 'hc')
// d.fetch('https://zendata.cephasteom.co.uk/api/packet', 'hc_last')

// 0, 12
const book = d.hc[12]

z.bpm.set(180)
let mf = 2

let loop = book.data.states.length; // length of book
loop = 4 * z.q; // custom length
let section = 32 // length of larger section
let smoothing = 4

let states = $set(book).fn(o => o.data.states)
let amps = $set(book).fn(o => o.data.amps)
let values = $set(book).fn(o => o.data.values)

let energy = $saw(0,1,1/section)
let space = $cc(1,mf,0.25)
let fx0level = $cc(2,mf,0.25)
let fx1level = $cc(3,mf,0.25)

streams.slice(0,6).map((s,i) => {
  let t = $t().mod(loop)
  s.x.set(values).at(t).mtr(0,1,-Math.PI,Math.PI).subr(1)
  s.y.set(amps).at(t).at(i)
  s.e.set(states).at(t).at(i)
  s.m.n(s.e).and($every(2))
  s.p._vol.cc(4 + (i * 2),mf,i ? 1 : 0)
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

s0.set({in:2,ba:'design',a:ms(0.25),loop:1,r:ms(2),cut:[0,5]})
s0.p.i.random(0,4).step(1)
s0.p._vol.mul(0.75)
s0.px._hc.set(energy).mtr(0.5,0.125)
s0.px._grainrate.saw(4,12).step(1)
s0.px._rate.saw(0.5,1).step(0.25)
s0.px._fx0.saw(0,0.75)
s0.py._fx1.saw(0,0.5)
s0.py._grainsize.saw(1/4,1/8)
s0.py.dur.saw(4,16).step(1).btms()
s0.p._pan.noise()
s0.p.begin.random(0,0.75).step(1/8)
s0.m.reset().set(1)

s1.set({in:2,ba:'rumble',dur:ms(16),snap:q*16,n:49,i:4,lag:ms(smoothing),a:ms(2),
r:ms(2),fx0:1,level:0.125,cut:1,cutr:ms(2),lc:0.3})
s1.px._hc.set(energy).mtr(0.5,0)
s1.px._grainrate.saw(4,12).step(1)
s1.py._grainsize.saw(0.25,1)
s1.p.begin.saw(0,1,1/16)
s1.e.reset().every(z.q*2)

s4.set({in:1,ba:'air',dur:ms(16),snap:z.q*2,i:3,lag:ms(smoothing),loop:1,fx0:1})
s4.px._hc.set(energy).mtr(0.5,1)
s4.py._pan.saw(0.3,0.7)
s4.p.begin.saw(0,1,1/2)
s4.e.reset().every(z.q*4)

s5.set({in:1,ba:'gm.static',dur:ms(2),i:'3?4?5*16|*4',lag:ms(smoothing),cut:2,fx0:1,fx1:1,hc:0.5,a:ms(4)})
s5.py.n.v('Cdor%16..*16')
s5.p._hc.set(energy).subr(1)
s5.px._pan.saw()
s5.p.begin.saw(0,0.5,1/4)
s5.e.reset().set(s0.e).degrade(0.25)
s5.m.not(s5.e)

let bars = 4
s6.set({inst:1,bank:'drone.ts',dur:ms(bars*4),cut:2,n:48,_track:7,i:5,rate:-1,a:ms(4),cutr:ms(4),fx0:0.5,hc:0.5})
s6.e.every(z.q*bars)
s6.p._vol.cc(14,mf,0)
s6.m.not(s6.e)