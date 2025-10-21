// d.fetch('https://zendata.cephasteom.co.uk/api/book/7', 'holywrit')
z.q.set(16)
// z.bpm.set(180)

let loop = q().floor()

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
  s.set({dist:.35,x:qphase(i),y:qpb(i).mul(10)})
  s.e.qm(i%4)
    .degrade(0.5)
    .cache(loop,8)
  s.m.not(s.e)
});

let bassfile = 'http://localhost:6060/_midi/tune03/tune03-bass.mid'
let bassp = midifile(bassfile).cache(loop,8)

let kick = s0
let sn = s1
let hh = s2
let breaks = s3
let bass = s5
let noise1 = s6;
let noise2 = s7;

// streams toggle between samp and grains
;[kick,sn,breaks,noise1,noise2,hh,bass].map(st => {
  st.inst.toggle(kick.e).ifelse(2,1)
  st._grainrate.set(st.y).mtr(1,32).step(1)
  st.rate.set(st.inst).eq(1)
    .ifelse(1,$(st.y).mtr(0.5,1).step(0.25))
})

kick.set({inst: 1, bank: 'kick.808', cut:[0,5], cutr:btms(0.5),vol:1.5})
kick._n.set(bassp).sub(31).mod(12).add(60)
kick.i.set(qm(0).ifelse(random(0,16).step(1), 0))
kick.amp.set(qm(0).ifelse(random(0.25,0.5), 1))
kick.e
  .degrade(0.8)
  .or('3:8|2:8|1:8')

sn.set({inst: 1, bank:'clap808', i:6, fx0:0.125, vol:1.5,
  cut: [0,1,2,3,4,5,6,7]
})
sn.s.set(sn.y).mtr(0.1,0.5)
sn.dur.set(sn.x).mtr(1,0.1).btms()
sn.e.reset().set('0 0 0 1?0 0 0 0 0 |*8')

bass.set({inst: 1, cut:5, bank: 'lb02', dur:btms(4),dist:0,vol:1.5})
bass.i.set(4)
bass.n.set(bassp).sub(24).mod(12).add(60)
bass.e
  .and(not(kick.e))
  .or(sn.e)
  .and(odd())

hh.set({inst: 1, snap:q().mul(2), hpf:0.75, dur:btms(8), vol:1, bank:'breaks.tech'})
hh.e.reset().set(kick.e).or(sn.e)
  .and('1*16|*4 0*16|*2')
hh._pan.set(breaks._pan).subr(1)
hh.i.set(hh.x).mul(16).step(1)
hh.begin.set(kick.e).ifelse(0,saw())

breaks.set({cut: [5,2], bank: 'breaks.90.4b', hpf:0.3, dur:btms(4), acurve:0.75, vol:1})
breaks.a.set(kick.e).ifelse(1,0).btms()
breaks._pan.noise(.25,0.25,0.75)
breaks.snap.set(kick.e).ifelse(2,3).mul(q())
breaks.i.set(breaks.y).mul(4).step(1)
breaks._grainrate.set(breaks.y).mtr(1,32).step(1)
breaks._lpf.set(breaks.y).mtr(1,0.75)
breaks.fx0.set(breaks.y).mtr(0,0.125)
breaks.begin.saw(.25)
breaks.e.or(kick.e)
  .and('1*16|*6 0*16|*2')
  .and(every(2).or(every(3)))

noise1.set({inst: 1, bank: 'tune.02',snap:q().mul(.75), fx0:0.5, hpf:0.5,vol:1.5})
noise1.i.set(noise1.y).mtr(6,10).step(1)
noise1.begin.saw(1/7)
noise1.dur.midifile(bassfile, 'dur').btms()
noise1.e.set(kick.e)

noise2.set({inst: 1, bank: 'tune.02', hpf:0.5, a:btms(2), acurve:0.75, dur:btms(4), vol:2,lag:btms(2)})
noise2.i.random(18,23).step(1)
noise2.begin.saw(.25)
noise2._fx0.set(noise2.y).mtr(0,0.25)
noise2._level.set(noise2.y).subr(1).mul(0.25)
noise2.e.reset().set(sn.e)

fx0.set({dfb:0.8,hpf:0.3,dtime:17.75})
fx0.delay.set(kick.n).mod(12).eq(0).mtr(0,0.75)
fx0.reverb.toggle(kick.e).mul(0.5)
fx0.rtail.io(sn.e,kick.e).mtr(0.1,0.35)
fx0.e.set(kick.e).or(sn.e)