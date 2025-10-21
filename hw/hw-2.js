// d.fetch('http://localhost:6060/_data/hw_book-7.json', 'holywrit')

let kick = s0
let clap = s1
let hh = s2
let breaks = s3
let subb = s4
let lb = s5
let glitch1 = s6
let glitch2 = s7
let noise1 = s8
let noise2 = s9

z.bpm.toggle(kick.e).ifelse(180,140)
z.q.set(16)

// circuit
let loop = q().mul(2).floor()

let param = i => $(d.holywrit).at(t())
  .fn(o => o.params).at(i).or(0)
  .mtr(0,1,-Math.PI*2,Math.PI*2)

q0.fb(3).ry(param(0)).rz(param(4)).cx([1],2).ry(param(8)).rz(param(12))
q1.fb(0).ry(param(1)).rz(param(5)).cx([2],1).ry(param(9),1).rz(param(13))
q2.fb(1).ry(param(2)).rz(param(6)).cx([3],0).ry(param(10)).rz(param(14))
q3.fb(2).ry(param(3)).rz(param(7)).ry(param(11)).rz(param(15))

// all streams
streams.slice(0,16).map((s,i) => {
  s.dist.set(.25)
  s.x.qphase(i).mod(1)
  s.y.qpb(i).mod(1)
    .mul(10)
  s.e.qm(i%6)
    .degrade('0.5|*3 0.75|*3')
    .cache(loop,2)
  s.m.not(s.e)
});

// streams triggered by circuit
[s0,s6,s7,s8,s9].map((st,i) => {
  st.e.qm(i)
    .degrade('0.75|*7 0.25')
    .cache(z.q,3/(i+1))
});

// streams toggle between samp and grains
[s3,s6,s8,s9,s2].map(st => {
  st.set({inst:'1?2*16|*4'})
  st.rate.set(st.inst).eq(1)
    .ifelse(1,$(st.y).mtr(0.75,1).step(0.25))
})

kick.set({
  inst:1,bank:'kick.808',i:9,vol: 1.75,n:57,
  cut:[3,6,7,9,4,5],
})
kick.e
  .reset()
  .set('3:8')
  .degrade('0 0.3*15 | 0.3 0*15')
  .and(not(clap.e))
  .and(not(lb.e))

clap.set({inst:1,bank:'claps.rare',cut:[8,9,4,7,2],cutr:20})
clap.i.set(clap.x).saw(1,2,12).step(3)
clap.fx0.set(clap.y).mul(0.25)
clap.e.set('0 0 1 0 0 0 0 0 |*3 0')

hh.set({bank:'breaks.tech', snap:q(), hpf:0.5, i: 1, dur:btms(4), vol:0.75,
  a:btms(0.25), acurve:0.75,
})
hh.e.reset().set(kick.e)

breaks.set({bank:'breaks.90.4b',snap:q(),a:btms(1),acurve:0.75,oneshot:1,s:0.5,fx0:0.25})
breaks.begin.set(breaks.y).step(0.125).subr(1)
breaks.i.set(breaks.x).mul(16).step(1)
breaks.e.set(kick.e)
  .and(every(1))
  .and(not(lb.e))

subb.set({inst: 7, n:'36', dur:btms(1.5),
  op2ratio:3,op2gain:0.125,
  op3ratio:11,op3gain:0.25
})
subb.acurve.saw(0.75,0.5,1/8)
subb.a.set(subb.y).saw(1.5,3).step(0.5).btms()
subb.op2a.set(subb.a).mul(2)
subb.op3a.set(subb.a).mul(2)
subb.e.set(kick.e)
  .and(not(lb.e))

lb.set({
  inst: 1, dist: 0,
  bank: 'lb02', dur:btms(4), 
  cut: [0,1,2,3,4,5,6,7,8],
})
lb.i.set(lb.y).mul(16).step(3).add('1?2?3*16|*4')
lb.e.reset().set(clap.e)

glitch1.set({
  bank:'pack.jviews', snap:q().mul(2), oneshot:1, 
  i:12, vol: 1.75, d:btms(1), s:0.5,
  cut:[3,6,7,9], 
})
glitch1.begin.saw(1,0,1).step(0.125)
glitch1._pan.noise(1,0.25,0.5)
glitch1.fx0.set(glitch1.y)
glitch1.e
  .and(not(kick.e))
  .and(not(lb.e))
  .and(odd())

glitch2.set({
  bank:'breaks.145', snap:q(), oneshot:1, 
  cut:[6,7,1,4],
  i: 2, d:btms(1),vol:1.75,s:0.5,lag:btms(4),
  delay:0.5,dtime:btms(1/6)
})
glitch2.dfb.toggle(clap.e).mul(0.8)
glitch2.begin.set(glitch2.y).step(0.125)
glitch2._pan.set(glitch1._pan).subr(1)
glitch2.fx0.set(glitch2.x)
glitch2._n.square(.25,60,72)
glitch2.e
  .and(not(glitch1.e))
  .and(not(lb.e))
  .and(even())

noise1.set({bank:'gm.horror|*3 gm.radio',oneshot:1,a:btms(4),acurve:0.75,i:'0..32?*16', hpf:0.35})
noise1.begin.saw(0,1).step(0.125)
noise1._pan.noise(0.2,0.5)
noise1.fx0.set(noise1.y).mul(0.5)
noise1.e
  // .set(glitch2.e)
  .and(not(lb.e))

noise2.set({bank:'gm.radio gm.horror',oneshot:1,a:btms(2),acurve:0.75,i:5, hpf:0.3, vol:1.5})
noise2.i.set('1 |*3 0').ifelse(5, random(0,32).step(1))
noise2.begin.noise(1/16,0,1).step(0.125)
noise2._pan.set(noise1._pan).subr(1)
noise2.fx0.set(noise2.y).mul(0.5)
noise2.e
  // .set(glitch1.e)
  .and(not(lb.e))

fx0.set({dfb:0.7,hpf:0.25,dist:0.5})
fx0.delay.toggle(kick.e).mul(0.75)
fx0.reverb.toggle(kick.e).subr(1).mul(0.5)
    // .mul(saw(1/64,.5,1))
fx0._dtime.set(kick.y).mtr(1/16,1/4).step(1/16).btms()
fx0.rtail.toggle(clap.e).mtr(0.1,0.5).mul(saw(1/64,.75,1))
fx0.drive.saw(1/64,0,0.75)
fx0.e.every(1)
fx0.m.every(1)

// // kick.e.set(0)
// // sub.e.set(0)
// // clap.e.set(0)
// hh.e.set(0)
// // breaks.e.set(0)
// // glitch1.e.set(0)
// // glitch2.e.set(0)
// // noise1.e.set(0)
// // noise2.e.set(0)
// // lb.e.set(0)

// kick.mute.set('1?0*16')
// clap.mute.set('1?0*16')
// breaks.mute.set('1?0*16')
// glitch1.mute.set('1?0*16')
// glitch2.mute.set('1?0*16')
// noise1.mute.set('1?0*16')
// noise2.mute.set('1?0*16')
// // fx0.mute.set('1?0*16')