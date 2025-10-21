// d.fetch('https://zendata.cephasteom.co.uk/api/book/7', 'holywrit')
let kpat = '3:8*2'

let kick = s0
let sn = s1
let hh = s2
let tom = s3

// d.fetch('https://zendata.cephasteom.co.uk/api/book/7', 'holywrit')
z.q.set(16)
z.bpm.set(140)

let loop = q().floor()
let fill = c().mod(8).eq(7)

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
  s.dist.set(.4)
  s.x.qphase(i).mod(1)
  s.y.qpb(i).mod(1).mul(10)
  s.e.set(fill).ifelse(
    qm(i%4).degrade(0.25),
    qm(i%4).degrade(0.5).cache(loop,4)
  )
});

let bassfile = 'http://localhost:6060/_midi/tune03/tune03-bass.mid'
let bassp = midifile(bassfile).cache(loop,8)

kick.set({inst: 1, bank: 'kick.808', cut:[0,2,3], vol:1.5, lpf:0.5})
kick.n.set(bassp).sub(31).mod(12).add(60).add($(kpat).ifelse(0,12))
kick.dur.set('1 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0').ifelse(1, 1/4).btms()
kick.i.set(kpat).ifelse(5, 0)
kick.e.or(kpat)

sn.set({inst: 1, bank: 'toms808', cut:[0,2],dur:btms(1/2)})
sn.n.set(bassp).sub(36).mod(12).add(48)
sn.e
  .or('0 0 1 0 0 0 0 0 | 0')
  .and(not(kick.e))

hh.set({inst: 1, bank: 'clap', dur:10, d:10, s:0.1, r:10, cut:[0,1], hpf:0.3, i:5})
hh.r.set(hh.y).mtr(10,20).step(1)
hh.e.reset()
  .every(4)
  .and(not(sn.e))

tom.set({inst: 1, bank: 'rs808', s:0.5})
tom.i.set(tom.y).mul(16).step(1).cache(q(),4)
tom.e.reset()
  .set(kick.e)
  .and(not(kpat))
  .and(not(hh.e))
  // .or('1*16')