z.bpm.set(150)

s4._canvas
  .pack(s4.e)
  .fn(([e]) =>`
    #e ? background(128) : background(0)
    Array(50).fill().forEach((p, i) => {
      noFill()
      strokeWeight(floor(i/2))
      stroke(#e ? 255 - i : i)
      circle(
        (i * 30) - halfWidth, 
        (i * 20) - halfHeight, 
        noise(((frameCount + i) * .001)%1) * 2500
      )
    })
  `)

let notes = 'F Fpro%16..?*15|Fpro%8..*16|E Ephr%16..?*15|Ephr%8..*8 Fpro%8..*8'

fx0.set({
  delay:1, dtime:btms(toggle(s3.e).ifelse(0.75,1.5)), 
  dfb:toggle(s4.e).mul(.75),
  reverb:toggle(s3.e).ifelse(1,0), rtail:.25,
  e:$(s3.e),
})

let k = 0.25; s = 0.5; hh = .25; silence = .5;

q0.rz($noise()).rx(k).cx(1).crx(4,silence)
q1.x(1).crx(2,s,1).crx(3,1 - hh).crx(5,silence,2)
q2.cx(1,4).crx(6,silence,4)
q3.cx(1,6)
q4.cx(0,8)
q5.cx(1,10)
q6.cx(2,12)

ps = qphases().mul(16).step(1)

;streams.slice(0,3).map((s,i) => s.e.qm(i%3).cache(16,4))
;streams.slice(0,6).map(s => s.nudge.sine(.5,0,25))

;streams.slice(0,2).map(s => s.set({
  inst:1,
  i:count().cache(12,4),
  bank:'mm.verdersoe?mm.stadil*16|*4',
  n: notes,
  fx0:noise(.5,0,.5),
  cut:6
}))

s3.set({inst:1,bank:'breaks.archn',
  i:count(),
  snap:q(),
  d:100, s:.1, r:noise().btms().mul(2),
  dur:btms(1/16),
  cut:[1,2,6],
  hpf:'0.3|*7 .4',
  vol:.25
})
s3.begin.saw(0.5)
s3.e.qm(1)
  .or(c().mod(8).eq(7).ifelse(random(0,1).step(1)))
  .and(not(s4.e))

s4.set({inst:1,bank:'bd',i:5,lpf:saw(4,0.75,1),cut:[0,1,2,3],amp:saw(4,1,.25),r:noise().btms(),dur:100,vol:.5})
s4.e.set('1|0 1 0*6|1|0 1 0*5 1')
  .or(random().gt(.95).and(every(2)))
s4.m.not(s4.e)

s5.set({inst:1,bank:'mm.verdersoe',i:3,cut:[0,1,2,3,4,6],dur:btms(1/16),fx0:.5})
s5.e.set('0 1')

s6.set({inst:0,cut:6,lag:btms(1),amp:0.5})
s6.n.set(s0.n).sub(24)
s6.e.set(s4.e)
s6.m.set('0 1*7')

s7.set({inst:0, n:$(notes).fn(n=>[n,n+7]),cut:7,fx0:noise(.25,0.1,.75),amp:random(),s:.1,level:0,harm:noise().mtr(0.5,11).step(0.5),modi:noise().mul(2)})
s7.e.qm(0)