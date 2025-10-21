// d.fetch('http://localhost:6060/_data/hw_book-7.json', 'holywrit')
z.q.set(16)
z.bpm.set(160)

let loop = q().mul(.75).floor()

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
  s.e.qm(i%6)
    .degrade(0.75)
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
let drone = s8;

// streams toggle between samp and grains
;[breaks,noise2].map(st => {
  st.inst.io(kick.e,sn.e).ifelse(2,1)
  st.rate.set(st.inst).eq(1)
    .ifelse(1,$(st.y).mtr(0.5,1).step(0.25))
})

kick.set({inst: 1, bank: 'kick.808', cut: [0,5,6,3],cutr:btms(0.5),vol:1.5})
kick.n.set(bassp).sub(31).mod(12).add(60)
kick.i.set(kick.x).mul(16).step(1)
kick.e.or('1|0|*3')

sn.set({inst: 1, bank:'claps.rare', i: 3, fx0:0.125, vol:1.1,
  cut: [0,1,2,3,4,5,6]
})
sn.pan.set(breaks._pan).subr(1)
sn.e.reset().set('0 0 0 1 0 0 0 0 | 0')

bass.set({inst: 1, cut:5, bank: 'lb02', dur:btms(4),dist:0,vol:1.5})
bass.i.set(4)
bass.n.set(bassp).sub(24).mod(12).add(60)
bass.e.reset().set(kick.e)

hh.set({inst: 1, snap:q(), hpf:0.75, dur:btms(8), vol:1.5, cut:3})
hh.e.reset().set(kick.e).or(sn.e)
  .and('1*16|*4 0*16|*2')
hh._pan.set(hh.x).mtr(0.1,0.7)
hh.i.set(hh.x).mul(16).step(1)
hh.begin.set(kick.e).ifelse(0, saw())
hh.bank.set(kick.e).ifelse('breaks.tech', 'gm.glitch.2b')

breaks.set({cut: [3,5,2], bank: 'breaks.hp', hpf:0.3, dur:btms(4), acurve:0.75, vol:0.7, lpf:0.3})
breaks.a.set(kick.e).ifelse(1,0).btms()
breaks._pan.set(breaks.y).mtr(0.75,0.3)
breaks.snap.set(kick.e).ifelse(1,2).mul(q())
breaks.i.set(breaks.y).mul(4).step(1)
breaks.fx0.set(breaks.y).mtr(0,0.125)
breaks.begin.saw(.25)
breaks.e.or(kick.e)
  .and('1*16|*6 0*16|*2')
  .and(every(2).or(every(3)))

noise1.set({inst: 1, bank: 'tune.02',snap:q().mul(1.75), fx0:0.25, hpf:0.5, vol: 1.5})
noise1.i.set(noise1.y).mul(5).step(1).seq([6,7,8,9,10,11])
noise1.begin.saw(1/7)
noise1.dur.midifile(bassfile, 'dur').btms()
noise1._pan.noise(1,0.3,0.7)
noise1.e.set(kick.e)

noise2.set({inst: 1, bank: 'gm.horror', hpf:0.5, a:btms(2), acurve:0.75, dur:btms(4), vol:1.5,lag:btms(2)})
noise2.i.random(0,32).step(1)
noise2.begin.saw(.25)
noise2._fx0.set(noise2.y).mtr(0,0.25)
noise2._level.set(noise2.y).subr(1).mul(0.25)
noise2._pan.set(1).sub(noise1._pan)
noise2.e.reset().set(sn.e)

fx0.set({dfb:0.8,hpf:0.3,dtime:17.75})
fx0.delay.set(kick.n).mod(12).eq(0).mtr(0,0.75)
fx0.reverb.toggle(kick.e).mul(0.5)
fx0.rtail.io(sn.e,kick.e).mtr(0.1,0.35)
fx0.e.set(kick.e).or(sn.e)

// // kick.e.set(0)
// sn.e.set(0)
// hh.e.set(0)
// breaks.e.set(0)
// bass.e.set(0)
// // noise1.e.set(0)
// // noise2.e.set(0)
// // drone.e.set(0)

// // N.B. This is where the piece stops...