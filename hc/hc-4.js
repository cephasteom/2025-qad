// ROOM 4
// d.fetch('https://zendata.cephasteom.co.uk/api/packets', 'hc')
// d.fetch('https://zendata.cephasteom.co.uk/api/packet', 'hc_last')

const book = d.hc[2]
let mf = 2
z.bpm.set(120)

let loop = 3;
let offset = 0
let smoothing = 4
z.t.saw(0,z.q*loop*2,1/(loop*2)).step(1)

let states = $set(book).fn(o => o.data.states)
let amps = $set(book).fn(o => o.data.amps)
let values = $set(book).fn(o => o.data.values)

let energy = $midicc(0,mf,0.5)
let space = $cc(1,mf,0.5)
let fx0level = $cc(2,mf,0.5)
let fx1level = $cc(3,mf,0.5)

streams.slice(0,6).map((s,i) => {
  let t = (offset = 0) => $t().add(offset).mod(loop * z.q)
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
fx1.p.dtime.set(s0.x).mtr(1.5,3.5).step(0.5).btms()
fx1.p.dfb.set(space)
fx1.p._level.set(fx1level)
fx1.e.set(1)

;[s3,s4].map((s,i) => {
  s.set({inst:i,ba:'ma808?bd*16',lag:ms(smoothing),mods:0.1,moda:0,modd:ms(1),s:0.125,r:ms(4),cut:5})
  s.p._n.set(`Daeo%16..?*16|*${loop} Bblyd%16..?*16|*${loop}`).add(0).sub(i*12)
  s.p._vol.mul(1.75)
  s.p._level.add(i*12).noise()
  s.py._pan.saw(0.2,0.8)
  s.px._modi.saw(0,10).mul(energy)
  s.py._harm.saw(1,(i+1),1)
  s.py.fx0.saw(0.01,0.5)
  s.px.fx1.saw(1,0.5)
  s.p.i.set(0)
  s.p.amp.random(0.5,1)
  s.m.reset().noise().gt(0.75)
})

s5.set({in:1,ba:'gm.static',dur:ms(2),i:3,lag:ms(smoothing),fx0:1,fx1:1, level:0, a:ms(1)})
s5.py.n.set('Cdor%16..*16')
s5.px._pan.set(s3.p._pan).subr(1)
s5.p.begin.saw(0,0.5,0,1/4)
s5.e.reset().set(s3.e)

let bars = 8
s6.set({inst:1,bank:'drone.ts',dur:ms(bars*4),cut:2,n:48,_track:7,i:11,rate:-1,a:ms(4),cutr:ms(4),fx0:0.5,fx1:0.5,hc:0.25})
s6.e.every(z.q*bars)
s6.p.begin.set(0.5)
s6.p._vol.cc(14,mf,0).mul(2)
s6.p._level.noise().mtr(0.5,1)
s6.m.not(s6.e)