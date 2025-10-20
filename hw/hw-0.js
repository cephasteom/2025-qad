let lo = noise(1/3,40,60); 
let hi = noise(1/5,320,280);
// z.bpm.sine('0.25|*3 0.125|*5 0.5|*3',lo,hi).step(1)
z.bpm.cosine(.25,hi,lo).step(1)

let static1 = s6
let noise1 = s7
let tones = s8
let vox = s9

static1.set({
  inst: 1, 
  bank: 'gm.static', i: 2, begin:0, n:56, detune:0.1,
  // bank: 'tune.06', i: 6, begin:0.1, n:48,
  cut:6,
  d:10, r:100,
  dfb:0.85,
  lag:btms(1/4),
  lc:0.2,
})
// static1.n.set(tones._n).sub(39)
static1.s.set(z.bpm).mtr(0.1,1,lo,hi)
static1._fx0.set(z.bpm).mtr(0,saw(1/24,0.5,1),lo,hi)
static1._level.set(static1._fx0).subr(1)
static1._lpf.set(z.bpm).mtr(1,0.75,lo,hi)
static1.acurve.set(z.bpm).mtr(.75,.25,lo,hi)
static1.dur.set($(1).div(q().mul(2))).btms()
static1.pan.set(z.bpm)
  .mtr(0,1,lo,hi)
  .subr(c().mod(32).lt(16).ifelse(1,0))
  .abs()
static1.dist.saw(1/64,0,0.25)
static1.a.saw(1/64,100,50)
static1.e.every(1)
static1.m.every(1)

noise1.set({inst:1,bank:'tune.02',dur:btms(32),cut:noise1.i,i:7,fx0:0.25})
noise1._rate.set(z.bpm).mtr(1,8,lo,hi)
noise1._hc.set(z.bpm).mtr(0.75,0.25,lo,hi)
noise1._pan.set(static1.pan).subr(1).mtr(0.2,0.8)
noise1.e.every(32)
noise1.m.set(1)

tones.set({inst:0,
  delay:.5, _dtime:btms(2), dcolour:0.25,
  vol:.5,mods:0.1, dfb:0.25
})
tones._n
  .set(z.bpm).mtr(0,16,lo,hi).step(1).add(1)
  .set('83 Ador%16..*15')
tones._fx0.set(z.bpm).mtr(0,saw(1/24,.25,.5),lo,hi)
tones._level.set(tones._fx0).subr(1)  
tones.s.set(z.bpm).mtr(0.05,0.5,lo,hi)
tones._modi.set(z.bpm).mtr(0.1,1,lo,hi)
tones.dur.set(z.bpm).mtr(1/32,1/8,lo,hi).btms()
tones.e.set(z.bpm).gt(100).ifelse(every('1?2*16'), static1.e)
tones._lpf.set(z.bpm).mtr(0.5,1,lo,hi)
tones.amp.set(z.bpm).mtr(0.25,1,lo,hi)
tones._pan.set(static1.pan).subr(1).mtr(0.4,0.6)
tones.m.not(tones.e)

vox.set({inst: 1, bank: 'vox.borges', 
  i:3, dur:btms(34), hpf:0.3, vol:.5, reverb:.5, lag:btms(1)
})
vox._rate.noise(.25,.75,1.25)
vox.e.every(q().mul(8))
vox.m.set(1)

fx0.set({dfb:0.5,hpf:0.3,reverb:0.25,rtail:0.1,rsize:0.25,dtime:btms(1/100),dfb:.85,delay:0.25})
fx0._dcolour.set(z.bpm).mtr(0.01,0.5,lo,hi)
fx0.e.set(1)
fx0.m.set(1)

static1.mute.set(0)
noise1.mute.set(1)
tones.mute.set(1)
vox.mute.set(1)