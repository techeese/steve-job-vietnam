/* js/audio.js — generative campus-lofi + musical SFX (STRUCTURE-epic iter 65, relocated verbatim
   from ui.js). All procedural (no asset files); defensive (any failure silently disables). window.AUDIO. */
(function () {
  "use strict";
  function S() { return HVS.S(); }
  function $(id) { return document.getElementById(id); }
  var soundOn = false;
  var actx = null, master = null, sndTimers = [];
  var MOODS = {
    normal:  { base: 220, scale: [0, 2, 4, 7, 9],     pad: [0, 7, 16],     gain: 0.050, rate: [1500, 3200] }, // warm major pentatonic
    tet:     { base: 247, scale: [0, 2, 4, 7, 9, 12], pad: [0, 7, 12, 16], gain: 0.055, rate: [1100, 2400] }, // brighter, busier (Tết)
    june:    { base: 196, scale: [0, 3, 5, 7, 10],    pad: [0, 7, 12, 15], gain: 0.060, rate: [1700, 3400] }, // slower swell (Lễ Tốt Nghiệp)
    scandal: { base: 196, scale: [0, 3, 5, 8, 10],    pad: [0, 3, 10],     gain: 0.044, rate: [1900, 3800] }  // minor undertone (phốt)
  };
  function currentMood() {
    try { var s = S(); if (s.pendingJune) return "june"; if (s.month === 2) return "tet"; if ((s.photSeeds && s.photSeeds.length >= 3) || s.tiengTam < 16) return "scandal"; return "normal"; }
    catch (e) { return "normal"; }
  }
  function freqOf(base, semi) { return base * Math.pow(2, semi / 12); }
  function tone(freq, dur, gain, type, attack) {
    if (!actx || !master) return;
    var o = actx.createOscillator(), g = actx.createGain();
    o.type = type || "sine"; o.frequency.value = freq; o.connect(g); g.connect(master);
    var t = actx.currentTime, a = attack || 0.4;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(gain, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.start(t); o.stop(t + dur + 0.05);
  }
  function schedMelody() {
    if (!soundOn || !actx) return;
    var m = MOODS[currentMood()];
    var semi = m.scale[(Math.random() * m.scale.length) | 0] + (Math.random() < 0.35 ? 12 : 0);
    tone(freqOf(m.base, semi), 2.4, m.gain, "sine", 0.5);
    sndTimers.push(setTimeout(schedMelody, m.rate[0] + Math.random() * (m.rate[1] - m.rate[0])));
  }
  function schedPad() {
    if (!soundOn || !actx) return;
    var m = MOODS[currentMood()];
    m.pad.forEach(function (semi) { tone(freqOf(m.base, semi - 12), 9, m.gain * 0.45, "triangle", 2.6); });
    sndTimers.push(setTimeout(schedPad, 8000 + Math.random() * 4000));
  }
  function schedBass() {
    if (!soundOn || !actx) return;
    var m = MOODS[currentMood()];
    tone(freqOf(m.base, -24), 3.4, m.gain * 0.7, "sine", 0.8);
    sndTimers.push(setTimeout(schedBass, 4200 + Math.random() * 2200));
  }
  // gentle musical SFX (same timbre as the score) for key moments — opt-in via the 🎵 toggle
  function sfx(kind) {
    if (!soundOn || !actx) return;
    var base = 523.25; // C5
    function n(semi, delay, dur, gain, type) { sndTimers.push(setTimeout(function () { tone(freqOf(base, semi), dur || 0.18, gain || 0.13, type || "sine", 0.012); }, delay || 0)); }
    if (kind === "build") { n(0, 0, 0.12, 0.12); n(7, 70, 0.16, 0.12); }                       // a confirming perfect-fifth
    else if (kind === "milestone") { n(0, 0, 0.14); n(4, 90, 0.14); n(7, 180, 0.22, 0.15); }   // bright major arpeggio
    else if (kind === "chime") { n(12, 0, 0.24, 0.12); }                                       // a soft high ding
    else if (kind === "grad") { [0, 4, 7, 12].forEach(function (s, i) { n(s, i * 45, 0.55, 0.09, "triangle"); }); } // warm chord
    else if (kind === "sparkle") { n(12, 0, 0.10, 0.10); n(19, 60, 0.13, 0.10); }              // a tiny shimmer
  }
  function clearSnd() { for (var i = 0; i < sndTimers.length; i++) clearTimeout(sndTimers[i]); sndTimers = []; }
  function startSound() {
    try {
      if (!actx) { actx = new (window.AudioContext || window.webkitAudioContext)(); master = actx.createGain(); master.gain.value = 0.85; master.connect(actx.destination); }
      if (actx.state === "suspended") actx.resume();
      soundOn = true; S().META.sound = true; $("soundBtn").classList.add("on");
      clearSnd(); schedMelody(); sndTimers.push(setTimeout(schedPad, 400)); sndTimers.push(setTimeout(schedBass, 1800));
    } catch (e) { soundOn = false; }
  }
  function stopSound() { soundOn = false; try { S().META.sound = false; } catch (e) {} $("soundBtn").classList.remove("on"); clearSnd(); }
  function toggleSound() { if (soundOn) stopSound(); else startSound(); }
  window.AUDIO = {
    sfx: sfx, toggle: toggleSound, start: startSound, stop: stopSound,
    isOn: function () { return soundOn; },
    init: function () { try { soundOn = !!S().META.sound; if (soundOn) { var b = $("soundBtn"); if (b) b.classList.add("on"); } } catch (e) {} }
  };
})();
