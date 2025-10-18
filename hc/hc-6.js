// ROOM 6
// d.fetch('https://zendata.cephasteom.co.uk/api/packets', 'hc')
// d.fetch('https://zendata.cephasteom.co.uk/api/packet', 'hc_last')

const book = d.hc[0]
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

s0.t.saw(0,z.q*loop,1/loop).step(1)
s0.set({inst:2,bank:'breaks.hp?breaks.archn*16',snap:z.q*loop,cut:[0,1],fx0:1/8,d:ms(1/4),s:0.25,cutr:ms(1/2),r:ms(2),lag:ms(smoothing)})
s0.p.i.random(0,6).step(1)
s0.px.n.set('50 Dmi%6..?*15')
s0.p.dur.set(energy).mtr(4,8).btms()
s0.px.begin.noise().gt(0.5).if(0, $noise().step(0.25))
s0.e.or($every(z.q*2))

s1.set({inst:2,bank:'hh2',cut:'0?1*16',lc:0.5,dur:ms(1/32),r:10,dtime:ms(1/8),dcolour:0.85,dfb:0.85,n:72})
s1.p.i.random(0,32).step(1)
s1.p._vol.mul(1.5)
s1.p.amp.random()
s1.p.r.set(energy).mtr(5,250)
s1.p.delay.set(space).mtr(0,0.75)
s1.py.pan.noise()
s1.e.and($every(1)).and($not(s0.e))

s5.set({in:1,ba:'atmos',dur:ms(2),i:'4?5*16',lag:ms(smoothing),
  fx0:1,fx1:1,
  detune: 0.1,
  cutr:ms(0.5),
  level:1,
  a:ms(1/8)
})
s5.p.n.set('65|60|65')
s5.px._pan.saw()
s5.px.a.saw(0.1,4).btms()
s5.p.begin.saw(0,1)