let kick = s0
let clap = s1
let breaks = s3
let subb = s4
let lb = s5
let glitch1 = s6
let glitch2 = s7
let noise1 = s8
let noise2 = s9

let pbs = qpbs().fn(a => a.filter(p=>p>0.02))

z.bpm.toggle(kick.e).ifelse(140,105)
z.set({dist:.25,cutr:btms(1/8)})
z.q.set(12)

qubits.slice(0,6).map((qubit,i,arr) => {
  const isLast = i === arr.length - 1
  const position = i%2 ? 2 : 0
  const entangle = isLast ? 0 : i+1
  qubit
    .fb(i)
    .rx(noise())
    .ry(saw(.25,.2,0.4), position)
    .cx(entangle, isLast ? 1 : 0)
})

// all streams
;streams.slice(0,10).map((st,i) => {
  st.set({cutr:btms(1/8),dist:.25,m:every(1)})
  st.x.set(1/16 * i);
  st.y.set(pbs).at(i).mul(10);
})

// streams triggered by circuit
;[kick,glitch1,glitch2].map((st,i) => {
  st.e.qm(i)
    .degrade('0.5|*7 0.25')
    .cache(q(),3/(i+1))
})

// streams toggle between samp and grains
;[s3,s6,s7,s8,s9].map(st => {
  st.set({inst:'1?2*16|*4'})
  st.rate.set(st.inst).eq(1)
    .ifelse(1,$(st.y).mtr(0.5,2).step(0.25))
    .mul($(st.y).gt(0.5).ifelse(-1,1))
})

kick.set({
  inst:1,bank:'bd808',i:9,lpf:.75,vol:2,
  cut:[3,6,7,9,4,5]
})
kick.e
  .reset()
  .set('3:8')
  .degrade('0 0.3*15 | 0.3 0*15')
  .and(not(clap.e))
  .and(not(lb.e))

clap.set({inst:1,bank:'clap',cut:[8,9,4,5,3]})
clap.i.set([0,5]).at($(clap.y).mul(2).step(1))
clap.e.set('0 0 0 0 0 0 1 0 | 0')

breaks.set({bank:'breaks.archn',snap:q(),vol:1,a:btms(4),acurve:0.75,dur:btms(2),s:.25})
breaks.begin.set(breaks.y).step(0.125).subr(1)
breaks.i.set(breaks.y).mul(16).step(1)
breaks.e.set(kick.e)
  .and(every(2))
  .and(not(lb.e))

subb.set({inst: 6, n:36, dur:btms(1.5), vol:.25})
subb.acurve.saw(1/8,.75,.5)
subb.lfodepth.set(subb.y).saw(1,1,0.5)
subb.a.set(subb.y).saw(1,1.5,3).step(0.5).btms()
subb.lforate.set(kick.y).saw(1,1.75,7).step(1.75)
subb.e.set(kick.e)
  .and(not(lb.e))

lb.set({
  inst: 1, dist: 0,
  bank: 'lb02', dur:btms(4), 
  cut: [0,1,2,3,4,5,6,7,8]
})
lb.i.random(0,8).step(1)
lb.e.set(clap.e)  

glitch1.set({
  bank:'gm.glitch.4b', snap:q().mul(2), oneshot:1, 
  i:12, d:btms(1), s:0.5,
  cut:[3,6,7,9], 
})
glitch1.begin.saw(1).step(0.125)
glitch1._pan.noise(1,0.25,0.5)
glitch1.fx0.set(glitch1.y)
glitch1.e
  .and(not(kick.e))
  .and(not(lb.e))
  .and(odd())

glitch2.set({
  bank:'gm.glitch.2b', snap:q(), oneshot:1, 
  cut:[6,7,1,4],
  i:2, d:btms(1),vol:1.75,s:0.5
})
glitch2.begin.saw(1,0,1).step(0.125)
glitch2._pan.set(glitch1._pan).subr(1)
glitch2.fx0.set(glitch2.y)
glitch2.e
  .and(not(glitch1.e))
  .and(not(lb.e))
  .and(even())

noise1.set({bank:'gm.radio',oneshot:1,a:btms(4),acurve:0.75,i:'8..11?*16', hpf:0.5})
noise1.begin.saw(0,1).step(0.125)
noise1._pan.noise(0.2,0.5)
noise1.fx0.set(noise1.y).mul(0.5)
noise1.e.set(glitch2.e)
  .and(not(lb.e))

noise2.set({bank:'gm.radio',oneshot:1,a:btms(2),acurve:.75,i:5,hpf:0.5, vol:1.5})
noise2.begin.noise(.125,0,1).step(0.125)
noise2._pan.set(noise1._pan).subr(1)
noise2.fx0.set(noise2.y).mul(0.5)
noise2.e
  .set(glitch1.e)
  .and(not(lb.e))

fx0.set({dfb:0.8,hpf:0.25})
fx0.delay.toggle(kick.e).mul(0.75)
fx0.reverb.toggle(kick.e).subr(1).mul(0.5)
fx0.dtime.set(kick.y).mtr(1/16,12/16).step(1/16)
fx0.rtail.toggle(clap.e).mtr(0.1,0.5)
fx0.e.every(1)

// kick.e.set(0)
// sub.e.set(0)
clap.e.set(0)
breaks.e.set(0)
glitch1.e.set(0)
glitch2.e.set(0)
noise1.e.set(0)
noise2.e.set(0)
lb.e.set(0)

// kick.mute.set('1?0*16')
// clap.solo.set(0)
// breaks.mute.set('1?0*16')
// glitch1.mute.set('1?0*16')
// glitch2.mute.set('1?0*16')
// fx0.mute.set(1)