z.bpm.set(75)

fx0.set({reverb:1,rtail:.1})
fx0.e.once()

/** s0 - FM synth */
s0.set({
  inst: 0, 
  modi: cosine(4,.25,.5), 
  harm: sine(3,1,3).step(.5), 
  dur: btms(1), 
  cut: pulse(.75, .25), cutr: btms(.125),
  amp: cosine(4,.25,.5),
  s:.25, r:btms(1), mods:.1,
  fx0: .25,
  bus0: noise(.5),
  level: noise(.75),
  lpf:.75,
  pan: noise(),
  vol: 2
})
s0.n.set('Aaeo%16').at(
  $([
    saw().mtr(0,16).step(1), // asc
    saw().mtr(16,0).step(1), // desc
    tri(2).mtr(8,0)
      .sub(12)
      .add(tri(.25).mtr(0,12)).mod(16).step(1) // pat1
  ]).at('0|*16 2|*12 1|*4')
).sub('24|*16 12|*16')
s0.e.set([
  every('4|*4 3|*4 2|*4').or(every('5|*4 4|*4 3|*4')),
  noise().gt('.75|*8 .9|*8').cache(24,2)
]).at('0|*16 1|*16')

/** s1 - ZMod looping */
s1.patch.set(`
  stack(
    bus(0),
    bus(1)
      .lpf(lfo(.3,250,500))
      .hpf(75),
    pink().amp(.5).amp(#e).bpf(#bpf_)
    .pan(lfo(.5))
  )
    .loop(#record,#length,1,#clear)
    .delay(#delay_)
    .reverb(.5)
`)
s1.r.set(10)
s1.dur.noise().gt(.9).ifelse(1000,10).cache(64,2)
s1.record.c().mod(9).lt(2).ifelse(sine(.5),0)
s1.delay_.saw(1/16,.1,.5)
s1.bpf_.noise(100,500)
s1.length.set(7)
s1.clear.every(q().mul(12)).and($(s1.record).eq(0))
s1.e.set(s0.e)

/** s2 - Samples */
s2.set({inst: 1, bank: 'gm.radio', level: 0, dur: btms(4), loop:1, a:100})
s2._bus1.noise(.5).mul(.75)
s2.i.count(s2.e)
s2.begin.noise()
s2.e.every('64|*16 48|*32')
s2.m.set(1)