/* GitHub Pages interactive portfolio — no framework, cookies, APIs or build step. */
(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const page = document.body.dataset.page;

  if ('IntersectionObserver' in window && !reduced) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08 });
    $$('[data-reveal]').forEach(el => observer.observe(el));
  } else {
    $$('[data-reveal]').forEach(el => el.classList.add('visible'));
  }
  if (page === 'hub' && !reduced && matchMedia('(pointer:fine)').matches) {
    $$('.world').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', (px * 100) + '%');
        card.style.setProperty('--my', (py * 100) + '%');
        card.style.setProperty('--ry', ((px - .5) * 11) + 'deg');
        card.style.setProperty('--rx', ((.5 - py) * 11) + 'deg');
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  if (page === 'music') {
    const steps = $('#sequencer');
    const meter = $('#levelMeter');
    const bpm = $('#bpm');
    const bpmReadout = $('#bpmReadout');
    const play = $('#playBeat');
    const stop = $('#stopBeat');
    const vinyl = $('.record');
    const save = $('#saveSoundcloud');
    const urlField = $('#soundcloudUrl');
    const savedBlock = $('#soundcloudOutput');
    const status = $('#soundcloudStatus');
    const pattern = [true, false, false, true, false, true, false, false];
    let audio, timer, index = 0, playing = false;
    let meterBars = [];
    if (meter) {
      for (let i = 0; i < 31; i++) {
        const bar = document.createElement('i');
        const h = 14 + 35 * Math.abs(Math.sin(i * .59) * Math.cos(i * .21));
        bar.style.height = h + 'px';
        meter.appendChild(bar);
        meterBars.push(bar);
      }
    }
    function drawSteps(active = -1) {
      pattern.forEach((enabled, i) => {
        const button = steps.children[i] || document.createElement('button');
        button.type = 'button';
        button.className = 'step' + (enabled ? ' on' : '') + (i === active ? ' playing' : '');
        button.textContent = String(i + 1).padStart(2, '0');
        button.setAttribute('aria-label', 'Step ' + (i + 1) + ': ' + (enabled ? 'on' : 'off'));
        button.setAttribute('aria-pressed', String(enabled));
        if (!button.parentNode) {
          button.addEventListener('click', () => {
            pattern[i] = !pattern[i];
            drawSteps(playing ? (index + pattern.length - 1) % pattern.length : -1);
          });
          steps.appendChild(button);
        }
      });
    }
    function tick() {
      drawSteps(index);
      if (pattern[index] && audio) {
        const now = audio.currentTime;
        const osc = audio.createOscillator();
        const gain = audio.createGain();
        const lowpass = audio.createBiquadFilter();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(index % 4 === 0 ? 110 : 146.83, now);
        osc.frequency.exponentialRampToValueAtTime(68, now + .18);
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 620;
        gain.gain.setValueAtTime(.0001, now);
        gain.gain.exponentialRampToValueAtTime(.16, now + .012);
        gain.gain.exponentialRampToValueAtTime(.0001, now + .32);
        osc.connect(lowpass).connect(gain).connect(audio.destination);
        osc.start(now);
        osc.stop(now + .35);
      }
      meterBars.forEach((el, i) => {
        const h = playing ? 10 + 43 * Math.abs(Math.sin(i * .43 + index * .66)) : 10 + 13 * Math.abs(Math.sin(i * .31));
        el.style.height = h + 'px';
      });
      index = (index + 1) % pattern.length;
    }
    function stopBeat() {
      clearInterval(timer);
      playing = false;
      play.textContent = '▶ Play the loop';
      play.setAttribute('aria-pressed', 'false');
      vinyl.classList.remove('playing');
      drawSteps(-1);
    }
    play.addEventListener('click', async () => {
      if (playing) { stopBeat(); return; }
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) { play.textContent = 'Audio unavailable'; return; }
      audio ||= new AudioCtx();
      try { await audio.resume(); } catch (err) { play.textContent = 'Audio blocked'; return; }
      playing = true;
      index = 0;
      play.textContent = 'Ⅱ Pause the loop';
      play.setAttribute('aria-pressed', 'true');
      vinyl.classList.add('playing');
      tick();
      timer = setInterval(tick, 60000 / Number(bpm.value) / 2);
    });
    stop.addEventListener('click', stopBeat);
    bpm.addEventListener('input', () => {
      bpmReadout.textContent = bpm.value + ' BPM';
      if (playing) {
        clearInterval(timer);
        timer = setInterval(tick, 60000 / Number(bpm.value) / 2);
      }
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopBeat(); });
    drawSteps();
    function isSoundcloud(raw) {
      try {
        const url = new URL(raw.trim());
        return url.protocol === 'https:' && (url.hostname === 'soundcloud.com' || url.hostname === 'www.soundcloud.com') && url.pathname.length > 2;
      } catch { return false; }
    }
    function showTrack(raw) {
      savedBlock.replaceChildren();
      if (!isSoundcloud(raw)) return;
      const container = document.createElement('div');
      const iframe = document.createElement('iframe');
      iframe.className = 'player-frame';
      iframe.title = 'SoundCloud embedded player';
      iframe.loading = 'lazy';
      iframe.allow = 'autoplay';
      iframe.src = 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(raw.trim()) + '&color=%23fab1c6&auto_play=false&visual=false';
      const link = document.createElement('a');
      link.href = raw.trim();
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'btn small ghost';
      link.style.marginTop = '12px';
      link.textContent = 'Open this track on SoundCloud ↗';
      container.append(iframe, link);
      savedBlock.appendChild(container);
    }
    const savedUrl = (() => { try { return localStorage.getItem('dlSoundcloudUrl') || ''; } catch { return ''; } })();
    if (savedUrl) { urlField.value = savedUrl; showTrack(savedUrl); }
    save.addEventListener('submit', e => {
      e.preventDefault();
      const url = urlField.value.trim();
      if (!isSoundcloud(url)) {
        status.textContent = 'Enter a full https://soundcloud.com/artist/track or playlist URL.';
        return;
      }
      try { localStorage.setItem('dlSoundcloudUrl', url); } catch {}
      showTrack(url);
      status.textContent = 'Loaded your SoundCloud player. This preference is saved on this browser.';
    });
  }

  if (page === 'engineering') {
    const canvas = $('#gliderCanvas');
    const ctx = canvas.getContext('2d');
    const speedControl = $('#speed'), angleControl = $('#angle'), windControl = $('#wind');
    const speedOut = $('#speedOut'), angleOut = $('#angleOut'), windOut = $('#windOut');
    const rangeOut = $('#rangeOut'), glideOut = $('#glideOut'), descentOut = $('#descentOut');
    const go = $('#flightToggle'), reset = $('#flightReset');
    let time = 0, isFlying = !reduced, last = 0, frame, points = [];
    let w = 650, h = 350, current = {range: 0, height: 0};
    function parameters() {
      const v = +speedControl.value, wing = +angleControl.value, wind = +windControl.value;
      // A deliberately simplified, educational kinematic toy, not a flight controller.
      const glide = Math.max(2, 8.4 - .12 * Math.abs(wing - 7) ** 1.5);
      const descent = v / glide;
      const dx = v * .68 + wind;
      return {v, wing, wind, glide, descent, dx};
    }
    function redrawLabels(p) {
      speedOut.textContent = p.v.toFixed(1) + ' m/s';
      angleOut.textContent = p.wing + '°';
      windOut.textContent = (p.wind > 0 ? '+' : '') + p.wind.toFixed(1) + ' m/s';
      glideOut.textContent = p.glide.toFixed(1) + ':1';
      descentOut.textContent = p.descent.toFixed(1) + ' m/s';
      rangeOut.textContent = Math.max(0,current.range).toFixed(0) + ' m';
    }
    function size() {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(250,rect.width);
      h = Math.max(230,rect.height);
      const dpr = Math.min(2,window.devicePixelRatio||1);
      canvas.width = Math.round(w*dpr); canvas.height = Math.round(h*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      draw();
    }
    function draw() {
      const p = parameters();
      ctx.clearRect(0,0,w,h);
      const floor = h - 33, baseY = 48, sx = 3.2;
      ctx.strokeStyle = '#bdffd733'; ctx.lineWidth = 1;
      for(let y=baseY;y<floor;y+=50){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
      ctx.strokeStyle = '#bdfdb8';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,floor);ctx.lineTo(w,floor);ctx.stroke();
      ctx.fillStyle = '#a4c6bf';ctx.font='11px monospace';ctx.fillText('GROUND / conceptual scale',16,floor+19);
      ctx.strokeStyle = '#caff6c';ctx.lineWidth=2.3;ctx.beginPath();
      points.forEach((pt,i) => {
        const x=25+pt.range*sx, y=floor-(55-pt.drop)*4.2;
        if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      });ctx.stroke();
      const bx=Math.min(w-32,25+current.range*sx),by=Math.min(floor-10,Math.max(40,floor-(55-current.height)*4.2));
      ctx.save();ctx.translate(bx,by);ctx.rotate((p.wing-7)*.016);
      ctx.fillStyle='#e8fff1';ctx.strokeStyle='#cafa70';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(24,0);ctx.lineTo(-22,-10);ctx.lineTo(-12,0);ctx.lineTo(-22,10);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.moveTo(-9,0);ctx.lineTo(10,0);ctx.stroke();ctx.restore();
      ctx.fillStyle='#cafa70';ctx.font='11px monospace';ctx.fillText('CAM  ◉',Math.min(w-110,bx+28),Math.max(20,by-15));
      ctx.strokeStyle='#d3ff9f88';ctx.beginPath();ctx.moveTo(w-115,55);ctx.lineTo(w-25,55);ctx.stroke();
      ctx.fillStyle='#caff6c';ctx.font='11px monospace';ctx.fillText(p.wind>=0?'WIND  →':'WIND  ←',w-115,40);
      redrawLabels(p);
    }
    function resetFlight() {
      time=0;current={range:0,height:0};points=[{range:0,drop:0}];redrawLabels(parameters());draw();
    }
    function animate(stamp) {
      if (!isFlying) return;
      const delta=Math.min(.05,(stamp-last)/1000||.016);
      last=stamp;
      time+=delta*1.35;
      const p=parameters();
      current.range=Math.max(0,p.dx*time);
      current.height=Math.min(55,p.descent*time);
      if (points.length===0||current.range-points[points.length-1].range>.5)points.push({range:current.range,drop:current.height});
      draw();
      if(current.height>=55 || 25+current.range*3.2>w-30){
        isFlying=false;go.textContent='↻ Fly again';go.setAttribute('aria-pressed','false');
        return;
      }
      frame=requestAnimationFrame(animate);
    }
    go.addEventListener('click',()=>{
      if(isFlying){isFlying=false;cancelAnimationFrame(frame);go.textContent='▶ Resume flight';go.setAttribute('aria-pressed','false');return;}
      if(current.height>=55||25+current.range*3.2>w-30)resetFlight();
      isFlying=true;last=performance.now();go.textContent='Ⅱ Pause flight';go.setAttribute('aria-pressed','true');frame=requestAnimationFrame(animate);
    });
    reset.addEventListener('click',()=>{isFlying=false;cancelAnimationFrame(frame);resetFlight();go.textContent='▶ Start flight';go.setAttribute('aria-pressed','false');});
    [speedControl,angleControl,windControl].forEach(el=>el.addEventListener('input',()=>{resetFlight();}));
    window.addEventListener('resize',size);
    resetFlight();size();
    if(isFlying){last=performance.now();frame=requestAnimationFrame(animate);}else {go.textContent='▶ Start flight';go.setAttribute('aria-pressed','false');}
    document.addEventListener('visibilitychange',()=>{if(document.hidden&&isFlying){isFlying=false;cancelAnimationFrame(frame);go.textContent='▶ Resume flight';go.setAttribute('aria-pressed','false');}});
  }

  if (page === 'ml') {
    const term=$('#terminalOutput'),form=$('#terminalForm'),field=$('#terminalInput');
    const plot=$('#trainingPlot'),ctx=plot.getContext('2d');
    const run=$('#runTrain'),lr=$('#learningRate'),epochs=$('#epochs');
    const lossReadout=$('#lossValue'),weightReadout=$('#weightsValue'),epochReadout=$('#epochValue');
    let fitting=false,results=[];
    const pts=Array.from({length:21},(_,i)=>{const x=-1+i/10;return{x,y:1+1.8*x+Math.sin(i*5)*.16};});
    function log(t,klass='output'){
      const span=document.createElement('div');span.className=klass;span.textContent=t;term.appendChild(span);term.scrollTop=term.scrollHeight;
    }
    const commands={
      help:()=>log('Try: projects · train · about · github · clear · help'),
      projects:()=>log('01 PyTorch training workbench [interactive demo]\n02 Deep hedging [research interest]\n03 Covariance denoising [research experience]\n04 Robotics + AI [exploration]'),
      about:()=>log('Math × computation × uncertainty. Python, optimization, stochastic control, machine learning. The browser demo is vanilla JS; the sample code uses PyTorch.'),
      github:()=>{log('Opening github.com/dallenleeyx ↗');window.open('https://github.com/dallenleeyx','_blank','noopener,noreferrer');},
      train:()=>run.click(),
      clear:()=>{term.replaceChildren();log('Terminal cleared. Type help to explore.');}
    };
    form.addEventListener('submit',e=>{e.preventDefault();const cmd=field.value.trim().toLowerCase();field.value='';if(!cmd)return;log('$ '+cmd,'command');commands[cmd] ? commands[cmd]() : log('Unknown command: '+cmd+' — try help');});
    function size(){
      const rect=plot.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);
      plot.width=Math.max(200,Math.round(rect.width*dpr));plot.height=Math.round(260*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();
    }
    function draw(){
      const w=plot.getBoundingClientRect().width,h=260;ctx.clearRect(0,0,w,h);
      const pad=34;
      ctx.strokeStyle='#6685ad55';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(pad,16);ctx.lineTo(pad,h-pad);ctx.lineTo(w-10,h-pad);ctx.stroke();
      ctx.font='11px monospace';ctx.fillStyle='#96a9c2';ctx.fillText('loss',8,15);ctx.fillText('epoch →',w-90,h-8);
      if(!results.length){ctx.fillText('Press Run to train a tiny model',Math.max(45,w/2-105),h/2);return;}
      const max=Math.max(...results.map(x=>x.loss),.05),maxE=Math.max(results[results.length-1].epoch,1);
      ctx.beginPath();results.forEach((r,i)=>{
        const x=pad+(w-pad-20)*r.epoch/maxE,y=h-pad-(h-pad-25)*r.loss/max;
        if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      });ctx.strokeStyle='#89acff';ctx.lineWidth=2.5;ctx.stroke();
      const last=results[results.length-1],x=pad+(w-pad-20)*last.epoch/maxE,y=h-pad-(h-pad-25)*last.loss/max;
      ctx.fillStyle='#c1d1ff';ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fill();
    }
    function train(){
      if(fitting)return;
      const alpha=Number(lr.value),requestedEpochs=Number(epochs.value);
      if(!Number.isFinite(alpha)||alpha<.001||alpha>.9||!Number.isInteger(requestedEpochs)||requestedEpochs<20||requestedEpochs>1500){
        log('Use a learning rate from 0.001 to 0.9 and a whole number of epochs from 20 to 1500.');
        return;
      }
      const total=requestedEpochs;
      fitting=true;run.disabled=true;run.textContent='Training…';results=[];
      let w=-1.6,b=-1.2,epoch=0;
      function step(){
        const chunk=Math.max(1,Math.ceil(total/70));
        for(let i=0;i<chunk&&epoch<total;i++){
          let dw=0,db=0,loss=0;
          pts.forEach(p=>{const diff=w*p.x+b-p.y;loss+=diff*diff;dw+=2*diff*p.x;db+=2*diff;});
          loss/=pts.length;dw/=pts.length;db/=pts.length;
          w-=alpha*dw;b-=alpha*db;epoch++;
          results.push({epoch,loss});
        }
        const last=results[results.length-1];
        lossReadout.textContent=last.loss.toFixed(4);
        weightReadout.textContent=w.toFixed(2)+'x + '+b.toFixed(2);
        epochReadout.textContent=String(epoch);
        draw();
        if(epoch<total)requestAnimationFrame(step);
        else {fitting=false;run.disabled=false;run.textContent='↻ Train again';log('Trained '+total+' epochs | MSE '+last.loss.toFixed(4)+' | prediction ≈ '+w.toFixed(2)+'x + '+b.toFixed(2));}
      }
      log('Training: lr='+alpha+' · epochs='+total);
      requestAnimationFrame(step);
    }
    run.addEventListener('click',train);
    $('#copyCode').addEventListener('click',async()=>{
      const code=$('#pytorchCode').textContent;
      try{await navigator.clipboard.writeText(code);$('#copyCode').textContent='✓ Copied';setTimeout(()=>$('#copyCode').textContent='Copy code',1800);}
      catch{$('#copyCode').textContent='Select to copy';}
    });
    log('Welcome to the ML playground. Type help to explore.');
    window.addEventListener('resize',size);size();
  }
})();
