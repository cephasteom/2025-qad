z.bpm.set(130)

fx0.set({
  delay:1, dtime:btms(toggle(s3.e).ifelse(0.75,1.5)), 
  dfb:every(32).ifelse(0,.5),
  reverb:toggle(s3.e).ifelse(1,0), rtail:.1,
  e:$(s3.e),
})

let k = 0.25; s = 0.25; hh = .15; silence = .5;

q0.rz($noise()).rx(k).cx(1).crx(4,silence)
q1.x(1).crx(2,s,1).crx(3,1 - hh).crx(5,silence,2)
q2.cx(1,4).crx(6,silence,4)
q3.cx(1,6)
q4.cx(0,8)
q5.cx(1,10)
q6.cx(2,12)

ps = qphases().mul(16).step(1)

;streams.slice(0,2).map((s,i) => s.set({
  inst:1,
  i:count().cache(16 + (i*4),4),
  snap:q().div(2),
  bank:'gm.perc',
  fx0:noise(.5,0,.5),
  e:qm(i).cache(16,4),
}))

s3.set({inst:1,bank:'breaks.archn|*3',
  // i:'1|*7 0..?16*16',
  i:count(),
  snap:q(),
  d:100, s:.1, r:noise().btms().mul(2),
  dur:btms(1/16),
  cut:[0,1,2],
  hpf:'0|*7 .4',
  vol:.75
})
s3.begin.saw(0.5)
s3.e.set('3:8').or(c().mod(8).eq(7).ifelse(random(0,1).step(1)))