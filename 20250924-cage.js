z.bpm.set(140)

// weightings
let k = 0.125
let s = 0.125
let hh = .5

q0.rx(k).cx(1)
q1.x().crx(2,s).crx(3,1 - hh)
q2.cx(1,3)
q3.cx(1,5)

;streams.slice(0,3).map((s,i) => s.set({
  inst: 1, 
  bank: 'cage.01', i: $(i*4).add('0..3*4')
    .add(c()).mod(16).add(16)
    .cache(16,4),
  rate: '1?-1*16',
  dur: 10, a: 100, r: 10, pan: random(.25,.75),
  hpf:.1,
  _fx0:1, _level:noise(),
  e:qm(i).cache(16,4),
  m:not(s.e)
}))

;streams.slice(3,6).map((s,i) => s.set({
  inst: 1,
  e: qm(i).cache(16,4),
}))

s3.set({bank: 'breaks.hp', snap:q(), s:.5, lpf:.5, cut: [4,7], begin: noise().step(.125)})
s3.e.or(every(32))
s4.set({bank: 'breaks.archn', snap:q(), i: count(), hpf:.9, cut: 3, begin: noise().step(.125)})
s5.set({bank: 'claps.rare', i: 4, cut: [3,4,6,7], amp:.25, dur:noise().mul(100).add(10), r:noise(.25).mul(1000), dur: 10})

s6.set({inst: 'synth', n: 'Dmix%16..?*16 |*4', amp: '.125?.25?.1*16', s: 0.125, _fx0: 0, cut: [0,1,2]})
s6.e.qm(0).or(qm(1))

s7.set({inst: 'synth', dur:btms(4)})
s7.n.set('F#').sub($(s3.e).ifelse(36,24))
s7.e.every(32).or(s5.e).and(every(2))

fx0.set({delay:1,reverb:1,rtail:.01})
fx0.e.once()