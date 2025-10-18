// ROOM 3
// d.fetch('https://zendata.cephasteom.co.uk/api/packets', 'hc')
// d.fetch('https://zendata.cephasteom.co.uk/api/packet', 'hc_last')

s7.set({inst: 1, bank: 'vox.babel', i: 8, _track: 8, dur:ms(34)})
// s7.e.once()

const book = d.hc[1]
let mf = 2

z.bpm.set(180)

let loop = book.data.states.length; // length of book
let offset = 4
let smoothing = 1

let states = $set(book).fn(o => o.data.states)
let amps = $set(book).fn(o => o.data.amps)
let values = $set(book).fn(o => o.data.values)

let energy = $midicc(0,mf,0.5)
let space = $cc(1,mf,0.5)
let fx0level = $cc(2,mf,0.5)
let fx1level = $cc(3,mf,0.5)

streams.slice(0,6).map((s,i) => {
  let t = (offset = 0) => $t().add(offset).mod(loop)
  s.x.set(values).at(t((1 + i) * offset))
    .mtr(0,1,-Math.PI,Math.PI)
    .subr(1)
  s.y.set(amps).at(t((1 + i) * offset)).at(i)
  s.e.set(states).at(t((1 + i) * offset)).at(i)
  s.m.n(s.e).and($every(2))
  s.p._vol.cc(4 + (i * 2),mf,1)
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

s0.set({in:2,ba:'bd',dur:ms(4),s:0.125,grainrate:32,fx1:0.25,begin:0.9,cut:0,cutr:20})
s0.p.fx0.set(energy)
s0.p.level.set(s0.p.fx0).subr(1)
s0.p.a.set(energy).mtr(2,1).btms()
s0.px.i.random(0,32,1)
s0.p._rate.set(s0.p.fx0).mtr(-0.5,-2).step(0.25)
s0.e.and($every('2?3*16|*2'))

s1.set({in:2,ba:'glass',s:0.25,snap:q*2,dur:ms(4),lc:0.5,a:ms(1),de:1,dtime:ms(1/16),dfb:0.8})
s1.p._vol.mul(2)
s1.px.dcolour.set(energy).mtr(0.5,0.75)
s1.px.i.noise(0,16,1)
s1.py.begin.random()
s1.e.and($every('1?2*16|*2').and($not(s0.e)))

s4.set({in:1,ba:'air',dur:ms(16),snap:z.q*2,i:3,lag:ms(smoothing),loop:1,
fx0:1})
s4.px._hc.set(energy).mtr(0.5,0.125)
s4.py._pan.saw(0.3,0.7)
s4.p.begin.saw(0,1,0,1/2)
s4.e.reset().every(z.q*4)

s5.set({in:1,ba:'gm.static',dur:ms(2),snap:z.q*16,i:54,lag:ms(smoothing),a:ms(2),acurve:0.75,cut:2,cutr:ms(1),fx0:1,fx1:1})
s5.p._vol.mtr(0,0.125)
s5.py.n.set('Cdor%16..*16')
s5.px._pan.saw()
s5.p.begin.saw(0,0.5,1/4)

let bars = 4
s6.set({inst:1,bank:'drone.ts',dur:ms(bars*4),cut:2,n:48,_track:7,i:7,rate:-1,a:ms(4),cutr:ms(4),fx0:0.5,hc:0.5})
s6.e.every(z.q*bars)
s6.p._vol.cc(14,mf,0)
s6.m.not(s6.e)