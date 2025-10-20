let vox = s9

vox.set({inst: 1, bank: 'vox.borges', 
  i:2, dur:btms(34), hpf:0.3, vol:.5, re:.5, lag:btms(1)
})
vox._rate.noise(.25,.75,1)
vox.e.once()
vox.m.set(1)