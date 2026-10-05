/* Сад Эха 0.95 — standalone browser bundle */
(()=>{
window.GARDEN_ASSETS={"collectibles/meteor-volcanic":"assets/echo-garden/collectibles/meteor-volcanic.webp"};
/* Game-only touch guard. Editable fields retain their normal text gestures. */
(() => {
  const editable = target => target instanceof Element && Boolean(target.closest('input,textarea,select,[contenteditable="true"]'));
  const cancel = event => { if (!editable(event.target) && event.cancelable) event.preventDefault(); };
  for (const type of ['gesturestart', 'gesturechange', 'gestureend']) document.addEventListener(type, cancel, {passive:false});
  document.addEventListener('selectstart', cancel);
  document.addEventListener('contextmenu', cancel);
  document.addEventListener('dragstart', cancel);
  document.addEventListener('touchmove', event => { if (event.touches.length > 1) cancel(event); }, {passive:false});
  let previousTap = 0;
  document.addEventListener('touchend', event => {
    const now = performance.now();
    if (previousTap>0 && event.changedTouches.length === 1 && now - previousTap < 300 && !editable(event.target)) {
      cancel(event);
      // Preserve the second game-button activation after cancelling Safari's
      // synthetic double-tap zoom. Disabled controls remain inactive.
      const button=event.target.closest?.('button');
      if(button&&!button.disabled)button.click();
    }
    previousTap = now;
  }, {passive:false});
  const style = document.createElement('style');
  style.textContent = 'html,body{overscroll-behavior:none;touch-action:pan-x pan-y;-webkit-text-size-adjust:100%;text-size-adjust:100%}body,body *{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}button,a,canvas{touch-action:none}input,textarea,select,[contenteditable="true"]{-webkit-user-select:text;user-select:text;touch-action:auto}input[type="text"],input[type="search"],textarea,select{font-size:max(16px,1em)}.overlay,.menu-panel,.flower-guide,.flight-tools-body,.answers-panel,.route-list,.studio,.library-panel,[role="dialog"]{touch-action:pan-y}';
  document.head.append(style);
  // A manifest preference is not a lock. Request the real API only when supported.
  const lockPortrait = () => {
    if (!matchMedia('(pointer:coarse)').matches || !screen.orientation?.lock) return;
    screen.orientation.lock('portrait-primary').catch(() => {});
  };
  document.addEventListener('pointerup', lockPortrait, {once:true});
  document.addEventListener('fullscreenchange', lockPortrait);
  lockPortrait();
})();

const module_book_catalog=(()=>{
// Generated from ../app.js by tools/catalog.mjs. Do not edit.
const BOOK_CATALOG=[{"id":"fig-1-6","chapter":1,"name":"Fig. 1.6 — basic model","source":"Chapter 1 · Fig. 1.6 · printed p. 9","baseTonic":5,"sequence":[{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null},{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"IV","offset":5,"quality":"maj","spelling":null,"bassOffset":null},{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null}],"distractors":[{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7sus4","offset":7,"quality":"7sus4","spelling":null,"bassOffset":null}]},{"id":"fig-1-7","chapter":1,"name":"Fig. 1.7 — simple substitution","source":"Chapter 1 · Fig. 1.7 · printed p. 9","baseTonic":5,"sequence":[{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null},{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null}],"distractors":[{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"IV","offset":5,"quality":"maj","spelling":null,"bassOffset":null},{"degree":"V7sus4","offset":7,"quality":"7sus4","spelling":null,"bassOffset":null}]},{"id":"fig-1-8","chapter":1,"name":"Fig. 1.8 — another substitution","source":"Chapter 1 · Fig. 1.8 · printed p. 9","baseTonic":5,"sequence":[{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null},{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7sus4","offset":7,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null}],"distractors":[{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"IV","offset":5,"quality":"maj","spelling":null,"bassOffset":null}]},{"id":"fig-1-9","chapter":1,"name":"Fig. 1.9 — minor II–V","source":"Chapter 1 · Fig. 1.9 · printed p. 10","baseTonic":5,"sequence":[{"degree":"II−7(♭5)","offset":2,"quality":"m7b5","spelling":null,"bassOffset":null},{"degree":"V7(♭9)","offset":7,"quality":"7b9","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}],"distractors":[{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null}]},{"id":"fig-1-10a","chapter":1,"name":"Fig. 1.10 — variant with VII−7(♭5)","source":"Chapter 1 · Fig. 1.10 · printed p. 10","baseTonic":5,"sequence":[{"degree":"II−7(♭5)","offset":2,"quality":"m7b5","spelling":null,"bassOffset":null},{"degree":"VII−7(♭5)","offset":11,"quality":"m7b5","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}],"distractors":[{"degree":"V7(♭9)","offset":7,"quality":"7b9","spelling":null,"bassOffset":null},{"degree":"V7sus4","offset":7,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null}]},{"id":"fig-1-10b","chapter":1,"name":"Fig. 1.10 — variant with V7sus4","source":"Chapter 1 · Fig. 1.10 · printed p. 10","baseTonic":5,"sequence":[{"degree":"II−7(♭5)","offset":2,"quality":"m7b5","spelling":null,"bassOffset":null},{"degree":"V7sus4","offset":7,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}],"distractors":[{"degree":"V7(♭9)","offset":7,"quality":"7b9","spelling":null,"bassOffset":null},{"degree":"VII−7(♭5)","offset":11,"quality":"m7b5","spelling":null,"bassOffset":null},{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null}]},{"id":"fig-1-11","chapter":1,"name":"Fig. 1.11 — resolution to III−7","source":"Chapter 1 · Fig. 1.11 · printed p. 10","baseTonic":5,"sequence":[{"degree":"II−7(♭5)","offset":2,"quality":"m7b5","spelling":null,"bassOffset":null},{"degree":"V7(♭9)","offset":7,"quality":"7b9","spelling":null,"bassOffset":null},{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null}],"distractors":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7sus4","offset":7,"quality":"7sus4","spelling":null,"bassOffset":null}]},{"id":"fig-1-15","chapter":1,"name":"Fig. 1.15 — slash bass in III−7","source":"Chapter 1 · Fig. 1.15 · printed p. 13","baseTonic":5,"sequence":[{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null},{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"III−7/5","offset":4,"quality":"m7","spelling":null,"bassOffset":11},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"IV","offset":5,"quality":"maj","spelling":null,"bassOffset":null},{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null}],"distractors":[{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null}]},{"id":"fig-1-16","chapter":1,"name":"Fig. 1.16 — extended substitution","source":"Chapter 1 · Fig. 1.16 · printed p. 13","baseTonic":5,"sequence":[{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null},{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"III−7/5","offset":4,"quality":"m7","spelling":null,"bassOffset":11},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"IV","offset":5,"quality":"maj","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null}],"distractors":[{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"V7sus4","offset":7,"quality":"7sus4","spelling":null,"bassOffset":null}]},{"id":"fig-2-4","chapter":2,"name":"Fig. 2.4 — strong cadence","source":"Chapter 2 · Fig. 2.4 · printed p. 19","baseTonic":0,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"IVMaj7","offset":5,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}],"distractors":[{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"IIIMaj7","offset":4,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null}]},{"id":"fig-2-5","chapter":2,"name":"Fig. 2.5 — weak cadence","source":"Chapter 2 · Fig. 2.5 · printed p. 20","baseTonic":0,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"IVMaj7","offset":5,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}],"distractors":[{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null}]},{"id":"fig-2-6","chapter":2,"name":"Fig. 2.6 — deceptive cadence","source":"Chapter 2 · Fig. 2.6 · printed p. 20","baseTonic":0,"sequence":[{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"♭VIMaj7","offset":8,"quality":"maj7","spelling":"flat","bassOffset":null}],"distractors":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"♭VI7","offset":8,"quality":"7","spelling":"flat","bassOffset":null}]},{"id":"fig-2-8","chapter":2,"name":"Fig. 2.8 — less active harmonic rhythm","source":"Chapter 2 · Fig. 2.8 · printed p. 21","baseTonic":0,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"VII−7(♭5)","offset":11,"quality":"m7b5","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}],"distractors":[{"degree":"IVMaj7","offset":5,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"♭VIIMaj7","offset":10,"quality":"maj7","spelling":"flat","bassOffset":null}]},{"id":"fig-2-9","chapter":2,"name":"Fig. 2.9 — third in the top voice","source":"Chapter 2 · Fig. 2.9 · printed p. 21","baseTonic":0,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"VII−7(♭5)","offset":11,"quality":"m7b5","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"IVMaj7","offset":5,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}],"distractors":[{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"♭VIIMaj7","offset":10,"quality":"maj7","spelling":"flat","bassOffset":null}]},{"id":"fig-2-10","chapter":2,"name":"Fig. 2.10 — borrowed ♭VIIMaj7","source":"Chapter 2 · Fig. 2.10 · printed p. 22","baseTonic":0,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"♭VIIMaj7","offset":10,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"IVMaj7","offset":5,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}],"distractors":[{"degree":"VII−7(♭5)","offset":11,"quality":"m7b5","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"♭VII7","offset":10,"quality":"7","spelling":"flat","bassOffset":null}]},{"id":"fig-2-11","chapter":2,"name":"Fig. 2.11 — fifth in the top voice","source":"Chapter 2 · Fig. 2.11 · printed p. 22","baseTonic":0,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"IVMaj7","offset":5,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}],"distractors":[{"degree":"VII−7(♭5)","offset":11,"quality":"m7b5","spelling":null,"bassOffset":null},{"degree":"♭VIIMaj7","offset":10,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null}]},{"id":"fig-2-12a","chapter":2,"name":"Fig. 2.12 — variant with VII−7(♭5)","source":"Chapter 2 · Fig. 2.12 · printed p. 22","baseTonic":0,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"IVMaj7","offset":5,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"VII−7(♭5)","offset":11,"quality":"m7b5","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}],"distractors":[{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"♭VIIMaj7","offset":10,"quality":"maj7","spelling":"flat","bassOffset":null}]},{"id":"fig-2-12b","chapter":2,"name":"Fig. 2.12 — variant with ♭VIIMaj7","source":"Chapter 2 · Fig. 2.12 · printed p. 22","baseTonic":0,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"IVMaj7","offset":5,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"♭VIIMaj7","offset":10,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}],"distractors":[{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"VII−7(♭5)","offset":11,"quality":"m7b5","spelling":null,"bassOffset":null}]},{"id":"ch3-fifths-chain","chapter":3,"name":"Extended dominants — circle-of-fifths motion","source":"Chapter 3 · introduction · printed p. 28","baseTonic":0,"sequence":[{"degree":"I7","offset":0,"quality":"7","spelling":null,"bassOffset":null},{"degree":"IV7","offset":5,"quality":"7","spelling":null,"bassOffset":null},{"degree":"♭VII7","offset":10,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"♭III7","offset":3,"quality":"7","spelling":"flat","bassOffset":null}],"distractors":[{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"♭VI7","offset":8,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"II7","offset":2,"quality":"7","spelling":null,"bassOffset":null}]},{"id":"ch3-chromatic-chain","chapter":3,"name":"Extended dominants — chromatic descent","source":"Chapter 3 · introduction · printed p. 28","baseTonic":0,"sequence":[{"degree":"I7","offset":0,"quality":"7","spelling":null,"bassOffset":null},{"degree":"VII7","offset":11,"quality":"7","spelling":null,"bassOffset":null},{"degree":"♭VII7","offset":10,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"VI7","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"♭VI7","offset":8,"quality":"7","spelling":"flat","bassOffset":null}],"distractors":[{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"♭V7","offset":6,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"IV7","offset":5,"quality":"7","spelling":null,"bassOffset":null}]},{"id":"fig-3-2","chapter":3,"name":"Fig. 3.2 — complete extended-dominant chain","source":"Chapter 3 · Fig. 3.2 · printed p. 29","baseTonic":3,"sequence":[{"degree":"#II7","offset":3,"quality":"7","spelling":"sharp","bassOffset":null},{"degree":"#V7","offset":8,"quality":"7","spelling":"sharp","bassOffset":null},{"degree":"#I7","offset":1,"quality":"7","spelling":"sharp","bassOffset":null},{"degree":"#IV7","offset":6,"quality":"7","spelling":"sharp","bassOffset":null},{"degree":"VII7","offset":11,"quality":"7","spelling":null,"bassOffset":null},{"degree":"III7","offset":4,"quality":"7","spelling":null,"bassOffset":null},{"degree":"VI7","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II7","offset":2,"quality":"7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}],"distractors":[{"degree":"IV7","offset":5,"quality":"7","spelling":null,"bassOffset":null},{"degree":"♭VII7","offset":10,"quality":"7","spelling":"flat","bassOffset":null}]},{"id":"fig-3-4","chapter":3,"name":"Fig. 3.4 — tritone substitutions","source":"Chapter 3 · Fig. 3.4 · printed p. 30","baseTonic":3,"sequence":[{"degree":"VI7","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II7sus4","offset":2,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"#IV7sus4","offset":6,"quality":"7sus4","spelling":"sharp","bassOffset":null},{"degree":"IV7","offset":5,"quality":"7","spelling":null,"bassOffset":null},{"degree":"III7","offset":4,"quality":"7","spelling":null,"bassOffset":null},{"degree":"VI7","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"#V7","offset":8,"quality":"7","spelling":"sharp","bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}],"distractors":[{"degree":"II7","offset":2,"quality":"7","spelling":null,"bassOffset":null},{"degree":"VII7","offset":11,"quality":"7","spelling":null,"bassOffset":null},{"degree":"♭III7","offset":3,"quality":"7","spelling":"flat","bassOffset":null}]},{"id":"fig-3-7","chapter":3,"name":"Fig. 3.7 — Georgia, corrected substitution","source":"Chapter 3 · Fig. 3.7 · printed p. 31","baseTonic":5,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"VI7","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"#V7","offset":8,"quality":"7","spelling":"sharp","bassOffset":null},{"degree":"#I7","offset":1,"quality":"7","spelling":"sharp","bassOffset":null},{"degree":"#IV7","offset":6,"quality":"7","spelling":"sharp","bassOffset":null},{"degree":"IV7","offset":5,"quality":"7","spelling":null,"bassOffset":null},{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"VI7","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null}],"distractors":[{"degree":"III7","offset":4,"quality":"7","spelling":null,"bassOffset":null},{"degree":"♭VII7","offset":10,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null}]},{"id":"fig-3-16","chapter":3,"name":"Fig. 3.16 — extended dominants only","source":"Chapter 3 · Fig. 3.16 · printed p. 33","baseTonic":5,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"VI7","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"#I7","offset":1,"quality":"7","spelling":"sharp","bassOffset":null},{"degree":"I7","offset":0,"quality":"7","spelling":null,"bassOffset":null},{"degree":"VII7sus4","offset":11,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"III7","offset":4,"quality":"7","spelling":null,"bassOffset":null},{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"VI7","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null}],"distractors":[{"degree":"♭VI7","offset":8,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"IV7","offset":5,"quality":"7","spelling":null,"bassOffset":null},{"degree":"VII7","offset":11,"quality":"7","spelling":null,"bassOffset":null}]},{"id":"fig-3-17","chapter":3,"name":"Fig. 3.17 — dominants and minor sevenths","source":"Chapter 3 · Fig. 3.17 · printed p. 33","baseTonic":5,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"VI7","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"V−7","offset":7,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"I7","offset":0,"quality":"7","spelling":null,"bassOffset":null},{"degree":"VII−7","offset":11,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"III7","offset":4,"quality":"7","spelling":null,"bassOffset":null},{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"VI7","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null}],"distractors":[{"degree":"VII7sus4","offset":11,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"♭II7","offset":1,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"IVMaj7","offset":5,"quality":"maj7","spelling":null,"bassOffset":null}]},{"id":"fig-4-1","chapter":4,"name":"Fig. 4.1 — Georgia, original form","source":"Chapter 4 · Fig. 4.1 · printed p. 37","baseTonic":5,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"III7","offset":4,"quality":"7","spelling":null,"bassOffset":null},{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"IV−6","offset":5,"quality":"m6","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"VI7","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"VI7","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null}],"distractors":[{"degree":"IV6","offset":5,"quality":"6","spelling":null,"bassOffset":null},{"degree":"III7sus4","offset":4,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null}]},{"id":"fig-4-2","chapter":4,"name":"Fig. 4.2 — Georgia with displacement","source":"Chapter 4 · Fig. 4.2 · printed p. 37","baseTonic":5,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"VII−7","offset":11,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"III7","offset":4,"quality":"7","spelling":null,"bassOffset":null},{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"IV6","offset":5,"quality":"6","spelling":null,"bassOffset":null},{"degree":"IV−6","offset":5,"quality":"m6","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"VI7","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"VI7","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null}],"distractors":[{"degree":"VII−7(♭5)","offset":11,"quality":"m7b5","spelling":null,"bassOffset":null},{"degree":"III7sus4","offset":4,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null}]},{"id":"fig-4-3","chapter":4,"name":"Fig. 4.3 — My Ship, original form","source":"Chapter 4 · Fig. 4.3 · printed p. 38","baseTonic":5,"sequence":[{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null},{"degree":"VI7","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null}],"distractors":[{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"III7","offset":4,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II7","offset":2,"quality":"7","spelling":null,"bassOffset":null}]},{"id":"fig-4-4","chapter":4,"name":"Fig. 4.4 — displaced dominants and related II−7","source":"Chapter 4 · Fig. 4.4 · printed p. 38","baseTonic":5,"sequence":[{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null},{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"VI7","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"II7","offset":2,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null}],"distractors":[{"degree":"III7","offset":4,"quality":"7","spelling":null,"bassOffset":null},{"degree":"V7sus4","offset":7,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}]},{"id":"fig-4-6","chapter":4,"name":"Fig. 4.6 — My Ship, clashes fixed","source":"Chapter 4 · Fig. 4.6 · printed p. 39","baseTonic":5,"sequence":[{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null},{"degree":"V7sus4","offset":7,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"#IV7","offset":6,"quality":"7","spelling":"sharp","bassOffset":null},{"degree":"VII7sus4","offset":11,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"III7","offset":4,"quality":"7","spelling":null,"bassOffset":null},{"degree":"VI7","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II7","offset":2,"quality":"7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null}],"distractors":[{"degree":"♭V7sus4","offset":6,"quality":"7sus4","spelling":"flat","bassOffset":null},{"degree":"VII7","offset":11,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null}]},{"id":"fig-4-7","chapter":4,"name":"Fig. 4.7 — tritone substitution for III7","source":"Chapter 4 · Fig. 4.7 · printed p. 39","baseTonic":5,"sequence":[{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null},{"degree":"V7sus4","offset":7,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"#IV7","offset":6,"quality":"7","spelling":"sharp","bassOffset":null},{"degree":"VII7sus4","offset":11,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"♭VII7","offset":10,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"VI7","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II7","offset":2,"quality":"7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null}],"distractors":[{"degree":"III7","offset":4,"quality":"7","spelling":null,"bassOffset":null},{"degree":"VII7","offset":11,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null}]},{"id":"fig-4-8","chapter":4,"name":"Fig. 4.8 — two tritone substitutions","source":"Chapter 4 · Fig. 4.8 · printed p. 39","baseTonic":5,"sequence":[{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null},{"degree":"V7sus4","offset":7,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"I7","offset":0,"quality":"7","spelling":null,"bassOffset":null},{"degree":"VII7sus4","offset":11,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"♭VII7","offset":10,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"♭III7","offset":3,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"II7","offset":2,"quality":"7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null}],"distractors":[{"degree":"♭V7","offset":6,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"III7","offset":4,"quality":"7","spelling":null,"bassOffset":null},{"degree":"VI7","offset":9,"quality":"7","spelling":null,"bassOffset":null}]},{"id":"exercise-5-1","chapter":5,"name":"Exercise 5.1 — original form","source":"Chapter 5 · Exercise 5.1 · printed p. 50","baseTonic":3,"sequence":[{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null},{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"#I°7","offset":1,"quality":"dim7","spelling":"sharp","bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null}]},{"id":"fig-5-3","chapter":5,"name":"Fig. 5.3 — Never on Sunday, original form","source":"Chapter 5 · Fig. 5.3 · printed p. 47","baseTonic":0,"sequence":[{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null}]},{"id":"fig-5-4","chapter":5,"name":"Fig. 5.4 — modal interchange","source":"Chapter 5 · Fig. 5.4 · printed p. 47","baseTonic":0,"sequence":[{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null},{"degree":"I−6","offset":0,"quality":"m6","spelling":null,"bassOffset":null},{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null}]},{"id":"fig-5-5","chapter":5,"name":"Fig. 5.5 — MI chord as a link","source":"Chapter 5 · Fig. 5.5 · printed p. 47","baseTonic":0,"sequence":[{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null},{"degree":"IV−6","offset":5,"quality":"m6","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null}]},{"id":"fig-5-7","chapter":5,"name":"Fig. 5.7 — neighboring MI chords","source":"Chapter 5 · Fig. 5.7 · printed p. 48","baseTonic":0,"sequence":[{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"I","offset":0,"quality":"maj","spelling":null,"bassOffset":null},{"degree":"V7sus4","offset":7,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"♭VIIMaj7","offset":10,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"♭VIMaj7","offset":8,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"♭IIIMaj7","offset":3,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"♭VIMaj7","offset":8,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"I/5","offset":0,"quality":"maj","spelling":null,"bassOffset":7},{"degree":"IV−7","offset":5,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"I/3","offset":0,"quality":"maj","spelling":null,"bassOffset":4},{"degree":"♭IIIMaj7","offset":3,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"♭IIMaj7","offset":1,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"I","offset":0,"quality":"maj","spelling":null,"bassOffset":null},{"degree":"IV/5","offset":5,"quality":"maj","spelling":null,"bassOffset":0},{"degree":"I","offset":0,"quality":"maj","spelling":null,"bassOffset":null},{"degree":"IV−7","offset":5,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"♭VII7","offset":10,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"I","offset":0,"quality":"maj","spelling":null,"bassOffset":null}]},{"id":"fig-5-8","chapter":5,"name":"Fig. 5.8 — Georgia, original form","source":"Chapter 5 · Fig. 5.8 · printed p. 49","baseTonic":5,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"V7/II","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7/II","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null}]},{"id":"fig-5-9","chapter":5,"name":"Fig. 5.9 — Georgia with modal interchange","source":"Chapter 5 · Fig. 5.9 · printed p. 49","baseTonic":5,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"V7/II","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"♭VIIMaj7","offset":10,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"♭IIIMaj7","offset":3,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"♭IIMaj7","offset":1,"quality":"maj7","spelling":"flat","bassOffset":null}]},{"id":"fig-5-10","chapter":5,"name":"Fig. 5.10 — several reharmonization techniques","source":"Chapter 5 · Fig. 5.10 · printed p. 49","baseTonic":5,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"SubV7/III","offset":5,"quality":"7","spelling":null,"bassOffset":null},{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"SubV7/II","offset":3,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"♭IIIMaj7","offset":3,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"♭VIMaj7","offset":8,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"♭IIMaj7","offset":1,"quality":"maj7","spelling":"flat","bassOffset":null}]},{"id":"fig-6-7","chapter":6,"name":"Fig. 6.7 — descending bass line","source":"Chapter 6 · Fig. 6.7 · printed p. 56","baseTonic":5,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"V7/3","offset":7,"quality":"7","spelling":null,"bassOffset":11},{"degree":"II−7/5","offset":2,"quality":"m7","spelling":null,"bassOffset":9},{"degree":"III−7/3","offset":4,"quality":"m7","spelling":null,"bassOffset":7},{"degree":"IVMaj7","offset":5,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"IVMaj7/7","offset":5,"quality":"maj7","spelling":null,"bassOffset":4},{"degree":"V−7/5","offset":7,"quality":"m7","spelling":null,"bassOffset":2},{"degree":"I7","offset":0,"quality":"7","spelling":null,"bassOffset":null},{"degree":"IVMaj7","offset":5,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null}]},{"id":"fig-6-9","chapter":6,"name":"Fig. 6.9 — Camptown Races, active bass line","source":"Chapter 6 · Fig. 6.9 · printed p. 56","baseTonic":5,"sequence":[{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"SubV7/II","offset":3,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"SubV7/I","offset":1,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"I7","offset":0,"quality":"7","spelling":null,"bassOffset":null},{"degree":"V7/3","offset":7,"quality":"7","spelling":null,"bassOffset":11},{"degree":"♭VII7","offset":10,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"V7/II","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"#IV−7(♭5)","offset":6,"quality":"m7b5","spelling":"sharp","bassOffset":null},{"degree":"IV−6","offset":5,"quality":"m6","spelling":null,"bassOffset":null}]},{"id":"fig-6-10a","chapter":6,"name":"Fig. 6.10 — bass-line variant A","source":"Chapter 6 · Fig. 6.10 · printed p. 57","baseTonic":5,"sequence":[{"degree":"I/3","offset":0,"quality":"maj","spelling":null,"bassOffset":4},{"degree":"V7/5","offset":7,"quality":"7","spelling":null,"bassOffset":2},{"degree":"I","offset":0,"quality":"maj","spelling":null,"bassOffset":null},{"degree":"V7/3","offset":7,"quality":"7","spelling":null,"bassOffset":11},{"degree":"♭VII7","offset":10,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"II−7/5","offset":2,"quality":"m7","spelling":null,"bassOffset":9},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"#IV−7(♭5)","offset":6,"quality":"m7b5","spelling":"sharp","bassOffset":null},{"degree":"IV−6","offset":5,"quality":"m6","spelling":null,"bassOffset":null}]},{"id":"fig-6-10b","chapter":6,"name":"Fig. 6.10 — bass-line variant B","source":"Chapter 6 · Fig. 6.10 · printed p. 57","baseTonic":5,"sequence":[{"degree":"V7/5","offset":7,"quality":"7","spelling":null,"bassOffset":2},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"V7/3","offset":7,"quality":"7","spelling":null,"bassOffset":11},{"degree":"♭VII7","offset":10,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"V7/V/5","offset":2,"quality":"7","spelling":null,"bassOffset":9},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"#IV−7(♭5)","offset":6,"quality":"m7b5","spelling":"sharp","bassOffset":null},{"degree":"IV−6","offset":5,"quality":"m6","spelling":null,"bassOffset":null}]},{"id":"fig-6-11","chapter":6,"name":"Fig. 6.11 — Over the Rainbow","source":"Chapter 6 · Fig. 6.11 · printed p. 57","baseTonic":0,"sequence":[{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null},{"degree":"♭VIIMaj7","offset":10,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"SubV7/V","offset":8,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"III−7/3","offset":4,"quality":"m7","spelling":null,"bassOffset":7},{"degree":"#IV−7(♭5)","offset":6,"quality":"m7b5","spelling":"sharp","bassOffset":null},{"degree":"IVMaj7","offset":5,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"SubV7/II","offset":3,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null}]},{"id":"fig-7-4","chapter":7,"name":"Fig. 7.4 — appropriate jazz symbols","source":"Chapter 7 · Fig. 7.4 · printed p. 66","baseTonic":3,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"V−7/IV","offset":7,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7/IV","offset":0,"quality":"7","spelling":null,"bassOffset":null},{"degree":"IVMaj7","offset":5,"quality":"maj7","spelling":null,"bassOffset":null}]},{"id":"fig-7-10","chapter":7,"name":"Fig. 7.10 — consistent sharp-key spelling","source":"Chapter 7 · Fig. 7.10 · printed p. 68","baseTonic":11,"sequence":[{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}]},{"id":"fig-7-15","chapter":7,"name":"Fig. 7.15 — clarified diminished function","source":"Chapter 7 · Fig. 7.15 · printed p. 69","baseTonic":0,"sequence":[{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null},{"degree":"#I°7","offset":1,"quality":"dim7","spelling":"sharp","bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null}]},{"id":"fig-7-17","chapter":7,"name":"Fig. 7.17 — line cliché notation","source":"Chapter 7 · Fig. 7.17 · printed p. 70","baseTonic":0,"sequence":[{"degree":"I","offset":0,"quality":"maj","spelling":null,"bassOffset":null},{"degree":"I+","offset":0,"quality":"aug","spelling":null,"bassOffset":null},{"degree":"I6","offset":0,"quality":"6","spelling":null,"bassOffset":null},{"degree":"#I°7","offset":1,"quality":"dim7","spelling":"sharp","bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null}]},{"id":"fig-8-6","chapter":8,"name":"Fig. 8.6 — typical turnaround","source":"Chapter 8 · Fig. 8.6 · printed p. 74","baseTonic":0,"sequence":[{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"VI7","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}]},{"id":"fig-8-11","chapter":8,"name":"Fig. 8.11 — turnaround example 1","source":"Chapter 8 · Fig. 8.11 · printed p. 76","baseTonic":0,"sequence":[{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7/II","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}]},{"id":"fig-8-12","chapter":8,"name":"Fig. 8.12 — turnaround example 2","source":"Chapter 8 · Fig. 8.12 · printed p. 76","baseTonic":0,"sequence":[{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"VI7","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}]},{"id":"fig-8-13","chapter":8,"name":"Fig. 8.13 — turnaround example 3","source":"Chapter 8 · Fig. 8.13 · printed p. 76","baseTonic":0,"sequence":[{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"SubV7/V","offset":8,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}]},{"id":"fig-8-14","chapter":8,"name":"Fig. 8.14 — chromatic III substitution","source":"Chapter 8 · Fig. 8.14 · printed p. 77","baseTonic":0,"sequence":[{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"♭IIIMaj7","offset":3,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"♭VIMaj7","offset":8,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"♭IIMaj7","offset":1,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}]},{"id":"fig-8-15","chapter":8,"name":"Fig. 8.15 — turnaround example 5","source":"Chapter 8 · Fig. 8.15 · printed p. 77","baseTonic":0,"sequence":[{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"♭IIMaj7","offset":1,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}]},{"id":"fig-8-17","chapter":8,"name":"Fig. 8.17 — advanced turnaround 1","source":"Chapter 8 · Fig. 8.17 · printed p. 78","baseTonic":0,"sequence":[{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"III−7(♭5)","offset":4,"quality":"m7b5","spelling":null,"bassOffset":null},{"degree":"VI7(♭9)","offset":9,"quality":"7b9","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"SubV7/I","offset":1,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}]},{"id":"fig-8-18","chapter":8,"name":"Fig. 8.18 — advanced turnaround 2","source":"Chapter 8 · Fig. 8.18 · printed p. 78","baseTonic":0,"sequence":[{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"♭VIIMaj7","offset":10,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"♭IIIMaj7","offset":3,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"♭VIMaj7","offset":8,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"♭IIMaj7","offset":1,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}]},{"id":"fig-8-19","chapter":8,"name":"Fig. 8.19 — advanced turnaround 3","source":"Chapter 8 · Fig. 8.19 · printed p. 78","baseTonic":0,"sequence":[{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"IVMaj7","offset":5,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"IV−7","offset":5,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"♭VII7","offset":10,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}]},{"id":"fig-8-22","chapter":8,"name":"Fig. 8.22 — turnaround variation 3","source":"Chapter 8 · Fig. 8.22 · printed p. 79","baseTonic":0,"sequence":[{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"III7","offset":4,"quality":"7","spelling":null,"bassOffset":null},{"degree":"VI7","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}]},{"id":"fig-8-23","chapter":8,"name":"Fig. 8.23 — turnaround variation 4","source":"Chapter 8 · Fig. 8.23 · printed p. 79","baseTonic":0,"sequence":[{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"VI7(♭9)","offset":9,"quality":"7b9","spelling":null,"bassOffset":null},{"degree":"SubV7/V","offset":8,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}]},{"id":"fig-8-24","chapter":8,"name":"Fig. 8.24 — turnaround variation 5","source":"Chapter 8 · Fig. 8.24 · printed p. 79","baseTonic":0,"sequence":[{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"VI7(♭9)","offset":9,"quality":"7b9","spelling":null,"bassOffset":null},{"degree":"V7/V","offset":2,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}]},{"id":"fig-9-3","chapter":9,"name":"Fig. 9.3 — extended ending to a new key","source":"Chapter 9 · Fig. 9.3 · printed p. 87","baseTonic":5,"sequence":[{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"♭IIIMaj7","offset":3,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"♭VIMaj7","offset":8,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"VMaj7","offset":7,"quality":"maj7","spelling":null,"bassOffset":null}]},{"id":"fig-9-5","chapter":9,"name":"Fig. 9.5 — Misty, extended ending","source":"Chapter 9 · Fig. 9.5 · printed p. 87","baseTonic":3,"sequence":[{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7/V","offset":2,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}]},{"id":"fig-9-6","chapter":9,"name":"Fig. 9.6 — deceptive ending to a new key","source":"Chapter 9 · Fig. 9.6 · printed p. 88","baseTonic":3,"sequence":[{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7/V","offset":2,"quality":"7","spelling":null,"bassOffset":null},{"degree":"V−7","offset":7,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"I7","offset":0,"quality":"7","spelling":null,"bassOffset":null},{"degree":"IVMaj7(#11)","offset":5,"quality":"maj7sharp11","spelling":null,"bassOffset":null}]},{"id":"fig-9-7","chapter":9,"name":"Fig. 9.7 — extended ending in C","source":"Chapter 9 · Fig. 9.7 · printed p. 88","baseTonic":0,"sequence":[{"degree":"IV−7","offset":5,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"♭VII7","offset":10,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"V7/II","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7sus4","offset":7,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}]},{"id":"fig-9-13","chapter":9,"name":"Fig. 9.13 — Misty, modulatory interlude","source":"Chapter 9 · Fig. 9.13 · printed p. 90","baseTonic":3,"sequence":[{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"SubV7/V","offset":8,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"V−7","offset":7,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"I7","offset":0,"quality":"7","spelling":null,"bassOffset":null},{"degree":"#IV−7","offset":6,"quality":"m7","spelling":"sharp","bassOffset":null},{"degree":"VII7","offset":11,"quality":"7","spelling":null,"bassOffset":null},{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"SubV7/V","offset":8,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"V−7","offset":7,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"I7","offset":0,"quality":"7","spelling":null,"bassOffset":null},{"degree":"IVMaj7","offset":5,"quality":"maj7","spelling":null,"bassOffset":null}]},{"id":"fig-10-3","chapter":10,"name":"Fig. 10.3 — voice-leading resolutions","source":"Chapter 10 · Fig. 10.3 · printed p. 97","baseTonic":0,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"#IV−7","offset":6,"quality":"m7","spelling":"sharp","bassOffset":null},{"degree":"VII7","offset":11,"quality":"7","spelling":null,"bassOffset":null},{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"VI7","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}]},{"id":"fig-10-7","chapter":10,"name":"Fig. 10.7 — voice leading with tensions","source":"Chapter 10 · Fig. 10.7 · printed p. 98","baseTonic":0,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"#IV−7(♭5)","offset":6,"quality":"m7b5","spelling":"sharp","bassOffset":null},{"degree":"VII7(♭9,♭13)","offset":11,"quality":"7b9b13","spelling":null,"bassOffset":null},{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"VI7","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}]},{"id":"fig-10-8","chapter":10,"name":"Fig. 10.8 — tensions between chord tones","source":"Chapter 10 · Fig. 10.8 · printed p. 99","baseTonic":0,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"#IV−7(♭5)","offset":6,"quality":"m7b5","spelling":"sharp","bassOffset":null},{"degree":"VII7(♭9,♭13)","offset":11,"quality":"7b9b13","spelling":null,"bassOffset":null},{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"VI7","offset":9,"quality":"7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}]},{"id":"fig-10-15","chapter":10,"name":"Fig. 10.15 — root position and third inversions","source":"Chapter 10 · Fig. 10.15 · printed p. 101","baseTonic":0,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"IMaj7/7","offset":0,"quality":"maj7","spelling":null,"bassOffset":11},{"degree":"IVMaj7/3","offset":5,"quality":"maj7","spelling":null,"bassOffset":9},{"degree":"IVMaj7","offset":5,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"IVMaj7/7","offset":5,"quality":"maj7","spelling":null,"bassOffset":4},{"degree":"♭VIIMaj7/3","offset":10,"quality":"maj7","spelling":"flat","bassOffset":2}]},{"id":"fig-11-5","chapter":11,"name":"Fig. 11.5 — chromatic line cliché","source":"Chapter 11 · Fig. 11.5 · printed p. 106","baseTonic":9,"sequence":[{"degree":"I−","offset":0,"quality":"min","spelling":null,"bassOffset":null},{"degree":"I−/Maj7","offset":0,"quality":"min","spelling":null,"bassOffset":11},{"degree":"I−/♭7","offset":0,"quality":"min","spelling":null,"bassOffset":10},{"degree":"I−/6","offset":0,"quality":"min","spelling":null,"bassOffset":9}]},{"id":"fig-11-7","chapter":11,"name":"Fig. 11.7 — Aeolian line cliché","source":"Chapter 11 · Fig. 11.7 · printed p. 106","baseTonic":9,"sequence":[{"degree":"I−","offset":0,"quality":"min","spelling":null,"bassOffset":null},{"degree":"I−/♭7","offset":0,"quality":"min","spelling":null,"bassOffset":10},{"degree":"I−/♭6","offset":0,"quality":"min","spelling":null,"bassOffset":8},{"degree":"I−/5","offset":0,"quality":"min","spelling":null,"bassOffset":7}]},{"id":"fig-11-12","chapter":11,"name":"Fig. 11.12 — line cliché added","source":"Chapter 11 · Fig. 11.12 · printed p. 108","baseTonic":10,"sequence":[{"degree":"I−","offset":0,"quality":"min","spelling":null,"bassOffset":null},{"degree":"I−/Maj7","offset":0,"quality":"min","spelling":null,"bassOffset":11},{"degree":"I−/♭7","offset":0,"quality":"min","spelling":null,"bassOffset":10},{"degree":"I−/6","offset":0,"quality":"min","spelling":null,"bassOffset":9},{"degree":"I−7","offset":0,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"I−6","offset":0,"quality":"m6","spelling":null,"bassOffset":null},{"degree":"I−7(♭5)","offset":0,"quality":"m7b5","spelling":null,"bassOffset":null},{"degree":"I−6","offset":0,"quality":"m6","spelling":null,"bassOffset":null}]},{"id":"fig-11-17","chapter":11,"name":"Fig. 11.17 — simplified line cliché notation","source":"Chapter 11 · Fig. 11.17 · printed p. 110","baseTonic":10,"sequence":[{"degree":"I","offset":0,"quality":"maj","spelling":null,"bassOffset":null},{"degree":"I7","offset":0,"quality":"7","spelling":null,"bassOffset":null},{"degree":"IVMaj7","offset":5,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"IV−7","offset":5,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"I","offset":0,"quality":"maj","spelling":null,"bassOffset":null}]},{"id":"fig-12-2","chapter":12,"name":"Fig. 12.2 — typical diminished resolution","source":"Chapter 12 · Fig. 12.2 · printed p. 113","baseTonic":0,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"#I°7","offset":1,"quality":"dim7","spelling":"sharp","bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null}]},{"id":"fig-12-13a","chapter":12,"name":"Fig. 12.13 — diminished approach","source":"Chapter 12 · Fig. 12.13 · printed p. 116","baseTonic":0,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"#I°7","offset":1,"quality":"dim7","spelling":"sharp","bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null}]},{"id":"fig-12-13b","chapter":12,"name":"Fig. 12.13 — dominant substitute A7(♭9)","source":"Chapter 12 · Fig. 12.13 · printed p. 116","baseTonic":0,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"VI7(♭9)","offset":9,"quality":"7b9","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null}]},{"id":"fig-12-13c","chapter":12,"name":"Fig. 12.13 — substitute ♭III7","source":"Chapter 12 · Fig. 12.13 · printed p. 116","baseTonic":0,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"♭III7","offset":3,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null}]},{"id":"fig-12-14","chapter":12,"name":"Fig. 12.14 — approach to III−7","source":"Chapter 12 · Fig. 12.14 · printed p. 116","baseTonic":0,"sequence":[{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"#II°7","offset":3,"quality":"dim7","spelling":"sharp","bassOffset":null},{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null}]},{"id":"fig-12-15","chapter":12,"name":"Fig. 12.15 — approach to V7","source":"Chapter 12 · Fig. 12.15 · printed p. 116","baseTonic":0,"sequence":[{"degree":"IVMaj7","offset":5,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"#IV°7","offset":6,"quality":"dim7","spelling":"sharp","bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null}]},{"id":"fig-12-16","chapter":12,"name":"Fig. 12.16 — approach to VI−7","source":"Chapter 12 · Fig. 12.16 · printed p. 116","baseTonic":0,"sequence":[{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"#V°7","offset":8,"quality":"dim7","spelling":"sharp","bassOffset":null},{"degree":"VI−7","offset":9,"quality":"m7","spelling":null,"bassOffset":null}]},{"id":"fig-12-23","chapter":12,"name":"Fig. 12.23 — diminished chords replaced","source":"Chapter 12 · Fig. 12.23 · printed p. 118","baseTonic":0,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"♭III7(♭9)","offset":3,"quality":"7b9","spelling":"flat","bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null},{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"VII7(♭9)","offset":11,"quality":"7b9","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"V7","offset":7,"quality":"7","spelling":null,"bassOffset":null}]},{"id":"fig-13-6","chapter":13,"name":"Fig. 13.6 — Maiden Voyage, Dorian cadence","source":"Chapter 13 · Fig. 13.6 · printed p. 125","baseTonic":0,"sequence":[{"degree":"I−7","offset":0,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"♭VIIMaj7","offset":10,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"I−7","offset":0,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"I−7","offset":0,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"♭VIIMaj7","offset":10,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"I−7","offset":0,"quality":"m7","spelling":null,"bassOffset":null}]},{"id":"fig-13-8","chapter":13,"name":"Fig. 13.8 — Dorian cadences with tonic pedal","source":"Chapter 13 · Fig. 13.8 · printed p. 125","baseTonic":7,"sequence":[{"degree":"I−7","offset":0,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"♭VIIMaj7","offset":10,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"I−7","offset":0,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"I−7","offset":0,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"♭VIIMaj7","offset":10,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"I−7","offset":0,"quality":"m7","spelling":null,"bassOffset":null}]},{"id":"fig-13-11","chapter":13,"name":"Fig. 13.11 — The Duke, Dorian","source":"Chapter 13 · Fig. 13.11 · printed p. 126","baseTonic":2,"sequence":[{"degree":"I−7","offset":0,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"I−7","offset":0,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null}]},{"id":"fig-13-15","chapter":13,"name":"Fig. 13.15 — Phrygian cadences","source":"Chapter 13 · Fig. 13.15 · printed p. 127","baseTonic":5,"sequence":[{"degree":"I−7","offset":0,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"♭II","offset":1,"quality":"maj","spelling":"flat","bassOffset":null},{"degree":"♭VII","offset":10,"quality":"maj","spelling":"flat","bassOffset":null},{"degree":"I−7","offset":0,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"I−7","offset":0,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"♭II","offset":1,"quality":"maj","spelling":"flat","bassOffset":null},{"degree":"♭VII","offset":10,"quality":"maj","spelling":"flat","bassOffset":null},{"degree":"I−7","offset":0,"quality":"m7","spelling":null,"bassOffset":null}]},{"id":"fig-13-20","chapter":13,"name":"Fig. 13.20 — Aeolian cadences","source":"Chapter 13 · Fig. 13.20 · printed p. 129","baseTonic":0,"sequence":[{"degree":"IV−7","offset":5,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"I−7","offset":0,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"IV−6","offset":5,"quality":"m6","spelling":null,"bassOffset":null},{"degree":"I−7","offset":0,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"IV−7","offset":5,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"I−7","offset":0,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"♭VIMaj7","offset":8,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"I−7","offset":0,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"♭VI","offset":8,"quality":"maj","spelling":"flat","bassOffset":null},{"degree":"I−7","offset":0,"quality":"m7","spelling":null,"bassOffset":null}]},{"id":"fig-13-28","chapter":13,"name":"Fig. 13.28 — Lydian cadences","source":"Chapter 13 · Fig. 13.28 · printed p. 131","baseTonic":0,"sequence":[{"degree":"II","offset":2,"quality":"maj","spelling":null,"bassOffset":null},{"degree":"I","offset":0,"quality":"maj","spelling":null,"bassOffset":null},{"degree":"II","offset":2,"quality":"maj","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"II7","offset":2,"quality":"7","spelling":null,"bassOffset":null},{"degree":"IMaj7(#11)","offset":0,"quality":"maj7sharp11","spelling":null,"bassOffset":null},{"degree":"VII−","offset":11,"quality":"min","spelling":null,"bassOffset":null},{"degree":"IMaj7(#11)","offset":0,"quality":"maj7sharp11","spelling":null,"bassOffset":null},{"degree":"VII−7","offset":11,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}]},{"id":"fig-13-35","chapter":13,"name":"Fig. 13.35 — Mixolydian cadences","source":"Chapter 13 · Fig. 13.35 · printed p. 134","baseTonic":0,"sequence":[{"degree":"♭VII","offset":10,"quality":"maj","spelling":"flat","bassOffset":null},{"degree":"I","offset":0,"quality":"maj","spelling":null,"bassOffset":null},{"degree":"V−","offset":7,"quality":"min","spelling":null,"bassOffset":null},{"degree":"I","offset":0,"quality":"maj","spelling":null,"bassOffset":null},{"degree":"♭VIIMaj7","offset":10,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"I7","offset":0,"quality":"7","spelling":null,"bassOffset":null},{"degree":"V−7","offset":7,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"I7sus4","offset":0,"quality":"7sus4","spelling":null,"bassOffset":null}]},{"id":"fig-13-44","chapter":13,"name":"Fig. 13.44 — modal cadences in several keys","source":"Chapter 13 · Fig. 13.44 · printed p. 138","baseTonic":0,"sequence":[{"degree":"I−7","offset":0,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"IV7","offset":5,"quality":"7","spelling":null,"bassOffset":null},{"degree":"♭VIMaj7","offset":8,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"♭VII7(♭9)","offset":10,"quality":"7b9","spelling":"flat","bassOffset":null},{"degree":"I−7","offset":0,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"IVMaj7","offset":5,"quality":"maj7","spelling":null,"bassOffset":null}]},{"id":"fig-14-5","chapter":14,"name":"Fig. 14.5 — hybrid voicings","source":"Chapter 14 · Fig. 14.5 · printed p. 147","baseTonic":0,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"III−7/VI","offset":4,"quality":"m7","spelling":null,"bassOffset":9},{"degree":"I/II","offset":0,"quality":"maj","spelling":null,"bassOffset":2},{"degree":"IV/V","offset":5,"quality":"maj","spelling":null,"bassOffset":7},{"degree":"V/I","offset":7,"quality":"maj","spelling":null,"bassOffset":0}]},{"id":"fig-14-7","chapter":14,"name":"Fig. 14.7 — The Girl from Ipanema, hybrids","source":"Chapter 14 · Fig. 14.7 · printed p. 148","baseTonic":0,"sequence":[{"degree":"I/IV","offset":0,"quality":"maj","spelling":null,"bassOffset":5},{"degree":"IV/V","offset":5,"quality":"maj","spelling":null,"bassOffset":7},{"degree":"II−/V","offset":2,"quality":"min","spelling":null,"bassOffset":7},{"degree":"♭V/V","offset":6,"quality":"maj","spelling":"flat","bassOffset":7},{"degree":"I/IV","offset":0,"quality":"maj","spelling":null,"bassOffset":5},{"degree":"♭VI/V","offset":8,"quality":"maj","spelling":"flat","bassOffset":7}]},{"id":"fig-14-9","chapter":14,"name":"Fig. 14.9 — Bossa Lo Nut, hybrid voicings","source":"Chapter 14 · Fig. 14.9 · printed p. 148","baseTonic":0,"sequence":[{"degree":"I−/IV","offset":0,"quality":"min","spelling":null,"bassOffset":5},{"degree":"II−/V","offset":2,"quality":"min","spelling":null,"bassOffset":7},{"degree":"♭IIIMaj7/IV","offset":3,"quality":"maj7","spelling":"flat","bassOffset":5},{"degree":"IVMaj/V","offset":5,"quality":"maj","spelling":null,"bassOffset":7}]},{"id":"fig-15-1","chapter":15,"name":"Fig. 15.1 — constant major-seventh structure","source":"Chapter 15 · Fig. 15.1 · printed p. 155","baseTonic":0,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"♭IIIMaj7","offset":3,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"♭VMaj7","offset":6,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"♭IIIMaj7","offset":3,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}]},{"id":"fig-15-2","chapter":15,"name":"Fig. 15.2 — tonal constant structure","source":"Chapter 15 · Fig. 15.2 · printed p. 155","baseTonic":0,"sequence":[{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"♭IIIMaj7","offset":3,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"IVMaj7","offset":5,"quality":"maj7","spelling":null,"bassOffset":null},{"degree":"IMaj7","offset":0,"quality":"maj7","spelling":null,"bassOffset":null}]},{"id":"fig-15-3","chapter":15,"name":"Fig. 15.3 — constant dominant-sus structure","source":"Chapter 15 · Fig. 15.3 · printed p. 155","baseTonic":0,"sequence":[{"degree":"V7sus4","offset":7,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"VI7sus4","offset":9,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"♭VII7sus4","offset":10,"quality":"7sus4","spelling":"flat","bassOffset":null},{"degree":"V7sus4","offset":7,"quality":"7sus4","spelling":null,"bassOffset":null}]},{"id":"fig-15-4","chapter":15,"name":"Fig. 15.4 — constant minor-seventh structure","source":"Chapter 15 · Fig. 15.4 · printed p. 156","baseTonic":0,"sequence":[{"degree":"II−7","offset":2,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"♭III−7","offset":3,"quality":"m7","spelling":"flat","bassOffset":null},{"degree":"III−7","offset":4,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"♭III−7","offset":3,"quality":"m7","spelling":"flat","bassOffset":null}]},{"id":"fig-15-5","chapter":15,"name":"Fig. 15.5 — structured bass motion","source":"Chapter 15 · Fig. 15.5 · printed p. 156","baseTonic":0,"sequence":[{"degree":"I7sus4","offset":0,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"♭III7sus4","offset":3,"quality":"7sus4","spelling":"flat","bassOffset":null},{"degree":"IV7sus4","offset":5,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"♭III7sus4","offset":3,"quality":"7sus4","spelling":"flat","bassOffset":null},{"degree":"II7sus4","offset":2,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"IV7sus4","offset":5,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"V7sus4","offset":7,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"IV7sus4","offset":5,"quality":"7sus4","spelling":null,"bassOffset":null}]},{"id":"fig-15-8","chapter":15,"name":"Fig. 15.8 — sus structure by thirds","source":"Chapter 15 · Fig. 15.8 · printed p. 157","baseTonic":9,"sequence":[{"degree":"I7sus4","offset":0,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"IV7sus4","offset":5,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"V7sus4","offset":7,"quality":"7sus4","spelling":null,"bassOffset":null}]},{"id":"fig-15-9","chapter":15,"name":"Fig. 15.9 — sus structure over diminished triad","source":"Chapter 15 · Fig. 15.9 · printed p. 157","baseTonic":2,"sequence":[{"degree":"III7sus4","offset":4,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"V7sus4","offset":7,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"♭VII7sus4","offset":10,"quality":"7sus4","spelling":"flat","bassOffset":null}]},{"id":"fig-15-13","chapter":15,"name":"Fig. 15.13 — In Her Memory, constant structures","source":"Chapter 15 · Fig. 15.13 · printed p. 158","baseTonic":0,"sequence":[{"degree":"V7sus4","offset":7,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"IV7sus4","offset":5,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"III7sus4","offset":4,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"II7sus4","offset":2,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"V7sus4","offset":7,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"♭III7sus4","offset":3,"quality":"7sus4","spelling":"flat","bassOffset":null},{"degree":"III7sus4","offset":4,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"#IV7sus4","offset":6,"quality":"7sus4","spelling":"sharp","bassOffset":null},{"degree":"V7sus4","offset":7,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"VI7sus4","offset":9,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"♭VIMaj7","offset":8,"quality":"maj7","spelling":"flat","bassOffset":null}]},{"id":"fig-16-2","chapter":16,"name":"Fig. 16.2 — Phrygian reharmonization","source":"Chapter 16 · Fig. 16.2 · printed p. 163","baseTonic":4,"sequence":[{"degree":"I−7","offset":0,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"♭IIMaj7","offset":1,"quality":"maj7","spelling":"flat","bassOffset":null},{"degree":"I−7","offset":0,"quality":"m7","spelling":null,"bassOffset":null}]},{"id":"fig-16-4","chapter":16,"name":"Fig. 16.4 — hybrid chords develop progression","source":"Chapter 16 · Fig. 16.4 · printed p. 164","baseTonic":4,"sequence":[{"degree":"V−/I","offset":7,"quality":"min","spelling":null,"bassOffset":0},{"degree":"♭VI/♭II","offset":8,"quality":"maj","spelling":"flat","bassOffset":1},{"degree":"V−/I","offset":7,"quality":"min","spelling":null,"bassOffset":0}]},{"id":"fig-16-7","chapter":16,"name":"Fig. 16.7 — Aeolian progression","source":"Chapter 16 · Fig. 16.7 · printed p. 165","baseTonic":9,"sequence":[{"degree":"I−7","offset":0,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"♭VII","offset":10,"quality":"maj","spelling":"flat","bassOffset":null},{"degree":"I−7","offset":0,"quality":"m7","spelling":null,"bassOffset":null},{"degree":"♭VII","offset":10,"quality":"maj","spelling":"flat","bassOffset":null}]},{"id":"fig-16-8","chapter":16,"name":"Fig. 16.8 — hybrid variation","source":"Chapter 16 · Fig. 16.8 · printed p. 165","baseTonic":9,"sequence":[{"degree":"V−/I","offset":7,"quality":"min","spelling":null,"bassOffset":0},{"degree":"IV−/♭VII","offset":5,"quality":"min","spelling":null,"bassOffset":10},{"degree":"V−/I","offset":7,"quality":"min","spelling":null,"bassOffset":0},{"degree":"IV−/♭VII","offset":5,"quality":"min","spelling":null,"bassOffset":10}]},{"id":"fig-16-9","chapter":16,"name":"Fig. 16.9 — hybrid chord variants","source":"Chapter 16 · Fig. 16.9 · printed p. 165","baseTonic":9,"sequence":[{"degree":"♭VII/I","offset":10,"quality":"maj","spelling":"flat","bassOffset":0},{"degree":"♭VI/♭VII","offset":8,"quality":"maj","spelling":"flat","bassOffset":10},{"degree":"II−/I","offset":2,"quality":"min","spelling":null,"bassOffset":0},{"degree":"♭VI/♭VII","offset":8,"quality":"maj","spelling":"flat","bassOffset":10}]},{"id":"fig-16-10","chapter":16,"name":"Fig. 16.10 — constant structures from Aeolian roots","source":"Chapter 16 · Fig. 16.10 · printed p. 166","baseTonic":9,"sequence":[{"degree":"I7sus4","offset":0,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"♭VII7sus4","offset":10,"quality":"7sus4","spelling":"flat","bassOffset":null},{"degree":"I7sus4","offset":0,"quality":"7sus4","spelling":null,"bassOffset":null},{"degree":"♭VII7sus4","offset":10,"quality":"7sus4","spelling":"flat","bassOffset":null},{"degree":"I7","offset":0,"quality":"7","spelling":null,"bassOffset":null},{"degree":"♭VII7","offset":10,"quality":"7","spelling":"flat","bassOffset":null},{"degree":"I7","offset":0,"quality":"7","spelling":null,"bassOffset":null},{"degree":"♭VII7","offset":10,"quality":"7","spelling":"flat","bassOffset":null}]}];

return {BOOK_CATALOG};
})();
const module_music=(()=>{
const {BOOK_CATALOG}=module_book_catalog;
// The canonical source remains ../app.js. These two small snapshots are checked
// against it by tools/check.mjs; see MUSICAL_NOTES.md for the visual PDF audit.
const BOOK_ROUTES = [
  { id:'fig-1-6', source:'Chapter 1 · Fig. 1.6 · printed p. 9', baseTonic:5,
    sequence:[{degree:'I6',offset:0,quality:'6'},{degree:'VI−7',offset:9,quality:'m7'},{degree:'IV',offset:5,quality:'maj'},{degree:'I6',offset:0,quality:'6'}] },
  { id:'fig-1-8', source:'Chapter 1 · Fig. 1.8 · printed p. 9', baseTonic:5,
    sequence:[{degree:'I6',offset:0,quality:'6'},{degree:'VI−7',offset:9,quality:'m7'},{degree:'V7sus4',offset:7,quality:'7sus4'},{degree:'VI−7',offset:9,quality:'m7'}] },
];
const DEGREES = {
  0:{glyph:'I',label:'тоника'},1:{glyph:'♭II',label:'= ♯I'},
  2:{glyph:'II',label:'вторая'},3:{glyph:'♭III',label:'= ♯II'},
  4:{glyph:'III',label:'третья'},5:{glyph:'IV',label:'четвёртая'},
  6:{glyph:'♯IV',label:'= ♭V'},7:{glyph:'V',label:'пятая'},
  8:{glyph:'♭VI',label:'= ♯V'},9:{glyph:'VI',label:'шестая'},
  10:{glyph:'♭VII',label:'= ♯VI'},11:{glyph:'VII',label:'седьмая'},
};
for(const d of Object.values(DEGREES)){d.name=d.glyph;d.color='#79f5d0';}
// Exact pitch sets copied from the canonical QUALITY table and checked against it.
// Standalone recognition drills are authored material, not textbook progressions.
const INTERVALS = {
  maj:[0,4,7],min:[0,3,7],aug:[0,4,8],'6':[0,4,7,9],maj7:[0,4,7,11],
  maj7sharp11:[0,4,7,11,18],m7:[0,3,7,10],m7b5:[0,3,6,10],
  m7natural9:[0,3,7,10,14],m7b5natural9:[0,3,6,10,14],m6:[0,3,7,9],
  '7':[0,4,7,10],'7b9':[0,4,7,10,13],'7b9b13':[0,4,7,10,13,20],
  dim7:[0,3,6,9],'7sus4':[0,5,7,10],'7b5':[0,4,6,10],
  '7sharp5':[0,4,8,10],'7alt':[0,4,6,10,13],m7b9:[0,3,7,10,13],
  minSharp5:[0,3,8],augMaj7:[0,4,8,11],
};
const QUALITIES = {
  maj:{glyph:'maj',label:'мажорное трезвучие'},min:{glyph:'m',label:'минорное трезвучие'},
  '6':{glyph:'6',label:'мажорный с секстой'},m6:{glyph:'m6',label:'минорный с секстой'},
  '7':{glyph:'7',label:'доминантсептаккорд'},maj7:{glyph:'maj7',label:'большой мажорный септаккорд'},
  m7:{glyph:'m7',label:'минорный септаккорд'},m7b5:{glyph:'m7♭5',label:'полууменьшённый'},
  dim7:{glyph:'°7',label:'уменьшённый септаккорд'},'7sus4':{glyph:'7sus4',label:'септаккорд с задержанием'},
  aug:{glyph:'aug',label:'увеличенное трезвучие'},
  maj7sharp11:{glyph:'maj7(♯11)',label:'мажорный септаккорд с ♯11'},
  m7natural9:{glyph:'m7(9)',label:'минорный септаккорд с 9'},
  m7b5natural9:{glyph:'m7(♭5,9)',label:'полууменьшённый с 9'},
  '7b9':{glyph:'7(♭9)',label:'доминантовый с ♭9'},
  '7b9b13':{glyph:'7(♭9,♭13)',label:'доминантовый с ♭9 и ♭13'},
  '7b5':{glyph:'7(♭5)',label:'доминантовый с ♭5'},
  '7sharp5':{glyph:'7(♯5)',label:'доминантовый с ♯5'},
  '7alt':{glyph:'7alt',label:'альтерированный: ♭5 и ♭9'},
  m7b9:{glyph:'m7(♭9)',label:'минорный септаккорд с ♭9'},
  minSharp5:{glyph:'m(♯5)',label:'минорное трезвучие с ♯5'},
  augMaj7:{glyph:'aug(maj7)',label:'увеличенный с большой септимой'},
};
for(const q of Object.values(QUALITIES)){q.name=q.glyph;q.color='#f7cd7f';}
const QUALITY_BANKS=[['maj','min','6','m6','7','maj7','m7','m7b5','dim7','7sus4','aug'],
  ['maj7sharp11','m7natural9','m7b5natural9','7b9','7b9b13','7b5','7sharp5','7alt','m7b9','minSharp5','augMaj7']];
const MASTER_OPENING_QUALITIES=['maj','min','6','m6','7','maj7','m7','m7b5','dim7','7sus4','aug'];
const MASTER_MIDDLE_QUALITIES=[...MASTER_OPENING_QUALITIES,'maj7sharp11','m7natural9','m7b5natural9','7b9','7b5','7sharp5'];
function routeQualities(pilotLevel=3,routeIndex=0){
  if(pilotLevel!==2)return SECTORS[3].qualities;
  if(routeIndex<2)return MASTER_OPENING_QUALITIES;
  if(routeIndex<5)return MASTER_MIDDLE_QUALITIES;
  return SECTORS[3].qualities;
}
const family = quality => quality;
const chordSymbol = chord => `${DEGREES[chord.offset].glyph}${chord.quality==='maj'?'':chord.qualityGlyph??QUALITIES[chord.quality]?.glyph??chord.quality}${chord.intervals&&chord.bassOffset!=null?'/'+DEGREES[chord.bassOffset].glyph:''}`;
const chordAnswerKey = chord => `${chord.offset}:${chord.quality}:${chord.intervals&&chord.bassOffset!=null&&chord.bassOffset!==chord.offset?chord.bassOffset:'root'}`;
const SECTORS = [
  {name:'Маяк',degrees:[0,7],qualities:[],title:'Услышь I и V',description:'Сначала звучит тоника I, потом сигнал гидры. Узнай: это I или V?',patterns:[[0,7,7,0],[0,7,0,0],[7,7,0,0]],count:8},
  {name:'Переправа',degrees:[0,5,7],qualities:[],title:'Знакомься: IV',description:'От тоники I до IV — чистая кварта. Сравни её с квинтой I–V.',patterns:[[0,5,7,0],[0,7,5,0],[5,0,7,0]],count:8},
  {name:'Двойной щит',degrees:[0,5,7,9],qualities:['maj','6','m7','7sus4'],title:'Корень + тип аккорда',description:'Верхний блок оружия — ступень корня. Нижний — точный тип аккорда: maj, 6, m7 или 7sus4. Пробивай щиты в любом порядке.',count:8},
  {name:'Хроматический полёт',degrees:Array.from({length:12},(_,i)=>i),qualities:QUALITY_BANKS.flat(),title:'Вся хроматика. Точная цифровка.',description:'12 корней × 22 типа аккорда. Например: ♭IImaj7 или IIIm7. Типы оружия переключаются вкладками «Аккорды» / «Альтерации».',count:12},
];
const pick = (items,rng) => items[Math.floor(rng()*items.length)];
const routeBags=new Map();
function createRoute(sector,previousKey=-1,rng=Math.random,routeIndex=0,pilotLevel=3) {
  const keys=[0,2,3,5,7,9,10].filter(k=>k!==previousKey);
  const key=pick(keys,rng);
  const qualities=sector===3?routeQualities(pilotLevel,routeIndex):sector===2?SECTORS[2].qualities:['maj'];
  const pool=SECTORS[sector].degrees.flatMap(offset=>qualities.map(quality=>({offset,quality})));
  const signature=`${sector}:${qualities.join(',')}`;
  let state=routeBags.get(signature);
  if(!state){state={bag:[],last:null,streak:0};routeBags.set(signature,state);}
  const sequence=Array.from({length:4},()=>{
    if(!state.bag.length)state.bag=pool.map(c=>({...c}));
    // Small beginner pools allow a double, but never an endless repeated signal.
    const allowed=state.bag.filter(c=>chordAnswerKey(c)!==state.last||pool.length<=3&&state.streak<2);
    const candidates=allowed.length?allowed:pool.filter(c=>chordAnswerKey(c)!==state.last);
    const c={...pick(candidates.length?candidates:state.bag,rng)},id=chordAnswerKey(c);
    const index=state.bag.findIndex(item=>chordAnswerKey(item)===id);
    if(index>=0)state.bag.splice(index,1);
    state.streak=id===state.last?state.streak+1:1;state.last=id;
    return {...c,degree:chordSymbol(c)};
  });
  return {key,sequence,source:'Авторские независимые сигналы · не книжная прогрессия',id:'random-signals',
    // Keep one timbre, register and articulation throughout each musical phrase.
    timbre:routeIndex%2?'soft':'synth',register:sector===0?60:48+(rng()<.5?0:12),
    articulation:'block'};
}
function missionCode(exercise){
  const raw=exercise.id.replace(/^fig-/,'F').replace(/^exercise-/,'E').replaceAll('-','·').toUpperCase();
  return `C${String(exercise.chapter).padStart(2,'0')}·${raw}`;
}
function createBookRoute(chapter,routeIndex=0,previousKey=-1,rng=Math.random){
  const chapterRoutes=BOOK_CATALOG.filter(item=>item.chapter===chapter),exercise=chapterRoutes[routeIndex%chapterRoutes.length];
  const keys=[0,2,3,5,7,9,10].filter(key=>key!==previousKey),key=pick(keys,rng);
  return {...exercise,sequence:exercise.sequence.map(chord=>({...chord,answerOffset:chord.offset})),key,code:missionCode(exercise),catalogIndex:routeIndex%chapterRoutes.length,catalogCount:chapterRoutes.length,timbre:'synth',register:48,articulation:'block'};
}
const bookRoutesForChapter=chapter=>BOOK_CATALOG.filter(item=>item.chapter===chapter);
function chordNotes(chord,tonic,spread=false) {
  const root=tonic+chord.offset;
  const notes=(chord.intervals??INTERVALS[chord.quality]).map(i=>root+12+i);
  if(spread) notes[1]+=12;
  return [tonic+(chord.bassOffset??chord.offset),...notes];
}
function cueEvents(route,chord,sector) {
  const tonic=route.register+route.key;
  const events=[{at:.12,duration:.82,notes:[tonic,tonic+4,tonic+7],part:'home'}];
  if(sector>=2){
    const notes=chordNotes(chord,tonic,route.articulation==='down');
    events.push({at:1.28,duration:1.40,notes,part:'chord'});
  }else events.push({at:1.28,duration:1.15,notes:[tonic+chord.offset],part:'bass'});
  return {events,duration:sector>=2?2.84:2.58};
}
function progressionEvents(route,targetIndex,finale=false){
  const tonic=route.register+route.key,sequence=route.sequence;
  let at=.12;const events=[];
  if(!finale&&targetIndex===0){events.push({at,duration:.62,notes:[tonic,tonic+(route.sourceKey?.endsWith('-')?3:4),tonic+7],part:'home',index:-1});at+=.82;}
  const start=finale?0:Math.max(0,targetIndex-3),end=finale?sequence.length-1:targetIndex;
  for(let index=start;index<=end;index++){
    const target=!finale&&index===targetIndex,duration=target?1.16:.56;
    if(target&&index>start)at+=.20;
    events.push({at,duration,notes:chordNotes(sequence[index],tonic),part:target?'target':'context',index});
    at+=target?1.28:.68;
  }
  return {events,duration:at+.12};
}
function bookReferenceEvents(route,targetIndex){
  const tonic=route.register+route.key;
  return {events:[
    {at:.12,duration:.58,notes:[tonic],part:'home',index:-1},
    {at:.98,duration:1.20,notes:chordNotes(route.sequence[targetIndex],tonic),part:'target',index:targetIndex},
  ],duration:2.34};
}
function answerResult(chord,shields,kind,value) {
  if(!['bass','quality'].includes(kind)||shields[kind]) return {ignored:true};
  const correct=kind==='bass'?Number(value)===(chord.answerOffset??chord.bassOffset??chord.offset):value===family(chord.quality);
  const next={...shields,[kind]:correct};
  return {correct,shields:correct?next:shields,destroyed:correct&&next.bass&&next.quality};
}

return {BOOK_ROUTES,DEGREES,INTERVALS,QUALITIES,QUALITY_BANKS,routeQualities,family,chordSymbol,chordAnswerKey,SECTORS,createRoute,missionCode,createBookRoute,bookRoutesForChapter,chordNotes,cueEvents,progressionEvents,bookReferenceEvents,answerResult};
})();
const module_garden_flight_renderer=(()=>{
// One continuous garden map. Additional paintings provide material/color
// references, while geography always comes from the same master texture.
const VERTEX = `attribute vec2 a_position;
varying vec2 v_uv;
void main(){v_uv=vec2(a_position.x*.5+.5,.5-a_position.y*.5);gl_Position=vec4(a_position,0.,1.);}`;

const GROUND = `precision highp float;
varying vec2 v_uv;
uniform sampler2D u_base,u_bloom,u_thaw;
uniform vec2 u_resolution,u_pilot;
uniform float u_size,u_scroll,u_pan,u_time,u_growth,u_night,u_lantern,u_mirror,u_lowcost;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec2 hash2(vec2 p){return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
vec3 tileSample(sampler2D tex,vec2 p){
  // Canyon paintings are not seamless. Mirroring keeps their edge pixels
  // continuous at every wrap without changing the original Garden sampling.
  vec2 uv=u_mirror>.5?1.-abs(mod(p,2.)-1.):fract(p);
  return texture2D(tex,uv).rgb;
}
vec3 gardenTile(sampler2D tex,vec2 p){
  vec2 cell=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  vec3 a=tileSample(tex,p+hash2(cell)*.74);
  vec3 b=tileSample(tex,p+hash2(cell+vec2(1.,0.))*.74);
  vec3 c=tileSample(tex,p+hash2(cell+vec2(0.,1.))*.74);
  vec3 d=tileSample(tex,p+hash2(cell+vec2(1.,1.))*.74);
  return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}
vec3 terrain(sampler2D tex,vec2 uv){
  vec3 c=gardenTile(tex,uv);
  if(u_lowcost>.5)return c;
  float water=smoothstep(.03,.22,c.g-c.r)*smoothstep(.05,.23,c.b-c.r);
  vec2 ripples=vec2(sin(uv.y*120.+u_time*.6),cos(uv.x*100.-u_time*.5))*.00065*water;
  return gardenTile(tex,uv+ripples);
}
float waterness(vec3 c){return smoothstep(.03,.22,c.g-c.r)*smoothstep(.05,.23,c.b-c.r);}
vec3 amberMaterial(vec3 c){
  float water=waterness(c),luma=dot(c,vec3(.299,.587,.114));
  vec3 warm=vec3(c.r*1.24+c.g*.24,luma*.50+c.r*.38,c.b*.44+c.r*.12);
  warm=mix(warm,vec3(luma*1.18,luma*.64,luma*.29),smoothstep(.22,.72,luma)*.42);
  return mix(clamp(warm,0.,1.),c,water*.93);
}
void main(){
  vec2 uv=(v_uv-.5)*u_resolution/u_size+vec2(.5+u_pan,.53-u_scroll);
  vec3 base=terrain(u_base,uv);
  float phase=mod(u_growth,4.),amount=fract(phase);vec3 a,b;
  if(phase<1.){a=base;b=terrain(u_bloom,uv);}
  else if(phase<2.){a=terrain(u_bloom,uv);b=terrain(u_thaw,uv);}
  else if(phase<3.){a=terrain(u_thaw,uv);b=amberMaterial(base);}
  else{a=amberMaterial(base);b=base;}
  vec2 n=uv*5.;
  float field=noise(n)*.52+noise(n*2.7)*.29+noise(n*7.9)*.13;
  float shore=abs(waterness(base)-.5)*2.;
  field-=shore*.055+sin((uv.x+uv.y)*18.+noise(n*1.3)*4.)*.035;
  float edge=amount*1.42-.21;
  float blend=smoothstep(field-.14,field+.14,edge);
  vec3 c=mix(a,b,blend);
  float neon=smoothstep(.08,.42,max(c.b,c.g)-c.r*.75)*smoothstep(.25,.72,max(c.b,c.g));
  float petal=smoothstep(.17,.55,c.r-c.g)*smoothstep(.25,.65,c.b);
  float emission=max(neon,petal*.65);
  // At night the terrain almost disappears. Cyan/green pigments retain a
  // narrow bioluminescent contour instead of lifting the whole photograph.
  vec3 dark=c*vec3(.025,.042,.058)+c*emission*.62;
  vec2 delta=(v_uv-u_pilot)*u_resolution;
  float radius=min(u_resolution.x,u_resolution.y)*.20;
  float distance=length(delta);
  float halo=1.-smoothstep(radius*.12,radius,distance);
  float cone=smoothstep(.58,.97,-delta.y/max(distance,1.))*(1.-smoothstep(radius*.45,radius*2.15,distance));
  float lamp=max(halo*.9,cone*.92)*u_lantern;
  vec3 night=mix(dark,c*vec3(1.05,1.02,.86),lamp);
  vec3 dusk=c*vec3(1.01,.86,.88);
  vec3 color=mix(mix(c,dusk,sin(u_night*3.14159)*.48),night,u_night);
  gl_FragColor=vec4(color,1.);
}`;

const SHIP = `precision highp float;
varying vec2 v_uv;
uniform sampler2D u_ship;
uniform vec2 u_resolution,u_pilot;
uniform float u_shipSize,u_angle,u_time,u_shadow,u_night,u_thrust,u_brake,u_lateral;
void main(){
  vec2 p=(v_uv-u_pilot)*u_resolution;
  p-=vec2(17.,25.)*u_shadow;
  float co=cos(u_angle),si=sin(u_angle);
  vec2 uv=mat2(co,-si,si,co)*p/u_shipSize+.5;
  if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.28)discard;
  float tail=smoothstep(.63,.94,uv.y);
  uv.x+=sin(uv.y*45.-u_time*5.)*.003*tail;
  vec4 texel=uv.y<=1.?texture2D(u_ship,uv):vec4(0.);
  vec3 c=texel.rgb;
  // The approved ship assets now carry a real feathered alpha matte. Using
  // that matte avoids the faint square produced by the old studio backdrop.
  // The key is retained as a safety net for Safari tabs that still hold the
  // former opaque WebP in their decoded-image cache.
  float bright=max(c.r,max(c.g,c.b));
  float low=min(c.r,min(c.g,c.b));
  float saturation=(bright-low)/max(bright,.001);
  float keyed=max(smoothstep(.145,.235,bright),smoothstep(.12,.29,saturation)*smoothstep(.04,.095,bright));
  float alpha=min(texel.a,keyed);
  alpha*=mix(1.,.86+.12*sin(u_time*9.+uv.y*20.),tail);
  float exhaustY=clamp((uv.y-.79)/(.12+.18*u_thrust),0.,1.);
  float sway=u_lateral*.055*exhaustY;
  float left=exp(-pow((uv.x-(.455-sway))/(.027+.025*exhaustY),2.));
  float right=exp(-pow((uv.x-(.545-sway))/(.027+.025*exhaustY),2.));
  float exhaust=max(left,right)*(1.-smoothstep(.68,1.,exhaustY))*smoothstep(.78,.86,uv.y);
  exhaust*=.72+.28*sin(u_time*(15.+u_thrust*9.)+uv.y*54.);
  vec3 hot=mix(vec3(1.,.22,.06),vec3(.24,.96,1.),clamp(u_thrust-u_brake*.65,0.,1.));
  if(u_shadow<.5){c=mix(c,hot,clamp(exhaust,0.,1.));alpha=max(alpha,exhaust*(.48+.42*u_thrust));}
  if(u_shadow>.5){alpha*=.28*(1.-smoothstep(.60,.81,uv.y));c=vec3(.015,.034,.037);}
  else{c*=1.-u_night*.1;}
  gl_FragColor=vec4(c,alpha);
}`;

function createPass(canvas,fragment,images,options={}){
  const gl=canvas.getContext('webgl',{alpha:true,antialias:false,depth:false,stencil:false,powerPreference:'low-power',...options});
  if(!gl)throw new Error('Для полёта нужен WebGL. Открой просмотр в Safari или Chrome с аппаратным ускорением.');
  function compile(type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){const info=gl.getShaderInfoLog(shader);gl.deleteShader(shader);throw Error(info);}return shader;}
  const p=gl.createProgram(),vertex=compile(gl.VERTEX_SHADER,VERTEX),pixel=compile(gl.FRAGMENT_SHADER,fragment);
  gl.attachShader(p,vertex);gl.attachShader(p,pixel);gl.linkProgram(p);gl.deleteShader(vertex);gl.deleteShader(pixel);
  if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));
  const attribute=gl.getAttribLocation(p,'a_position'),uniforms=new Map(),buffer=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const textures=images.map(image=>{
    const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);return texture;
  });
  const uniform=name=>{if(!uniforms.has(name))uniforms.set(name,gl.getUniformLocation(p,name));return uniforms.get(name);};
  const use=()=>{gl.useProgram(p);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.enableVertexAttribArray(attribute);gl.vertexAttribPointer(attribute,2,gl.FLOAT,false,0,0);};
  const f=(key,value)=>gl.uniform1f(uniform(key),value),v=(key,x,y)=>gl.uniform2f(uniform(key),x,y);
  const texture=(key,index,unit)=>{gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,textures[index]);gl.uniform1i(uniform(key),unit);};
  return {gl,p,buffer,textures,use,f,v,texture,dispose(){textures.forEach(item=>gl.deleteTexture(item));gl.deleteBuffer(buffer);gl.deleteProgram(p);}};
}

function createGardenRenderer(groundCanvas,shipCanvas,images) {
  const ground=createPass(groundCanvas,GROUND,images.slice(0,3),{alpha:false,antialias:false});
  const vessel=createPass(shipCanvas,SHIP,images.slice(4,6),{alpha:true,antialias:true,premultipliedAlpha:false});
  return {
    render(s){
      const g=ground.gl;g.viewport(0,0,groundCanvas.width,groundCanvas.height);g.disable(g.BLEND);ground.use();
      ground.texture('u_base',0,0);ground.texture('u_bloom',1,1);ground.texture('u_thaw',2,2);
      ground.v('u_resolution',s.width,s.height);ground.v('u_pilot',s.x/s.width,s.y/s.height);
      ground.f('u_size',s.worldSize);ground.f('u_scroll',s.scroll);ground.f('u_pan',s.pan);ground.f('u_time',s.time);
      ground.f('u_growth',s.growth);ground.f('u_night',s.night);ground.f('u_lantern',s.lantern?1:0);
      ground.f('u_mirror',s.mirrorTiles?1:0);ground.f('u_lowcost',s.lowCostGraphics?1:0);
      g.drawArrays(g.TRIANGLES,0,6);

      const gl=vessel.gl;gl.viewport(0,0,shipCanvas.width,shipCanvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
      if(s.ship===2)return;
      gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);vessel.use();vessel.texture('u_ship',s.ship,0);
      vessel.v('u_resolution',s.width,s.height);vessel.v('u_pilot',s.x/s.width,s.y/s.height);
      const size=Math.min(190,Math.max(110,s.width*.22))*(s.ship===1?1.35:1);
      vessel.f('u_shipSize',size);vessel.f('u_angle',s.angle);vessel.f('u_time',s.time);vessel.f('u_night',s.night);
      vessel.f('u_thrust',s.thrust??.45);vessel.f('u_brake',s.brake??0);vessel.f('u_lateral',Math.max(-1,Math.min(1,(s.motionX??0)*4)));
      vessel.f('u_shadow',1);gl.drawArrays(gl.TRIANGLES,0,6);vessel.f('u_shadow',0);gl.drawArrays(gl.TRIANGLES,0,6);
    },
    dispose(){ground.dispose();vessel.dispose();},
    diagnostics(){return {textures:ground.textures.length+vessel.textures.length,groundError:ground.gl.getError(),shipError:vessel.gl.getError(),width:groundCanvas.width,height:groundCanvas.height};}
  };
}

return {createGardenRenderer};
})();
const module_garden_arrangement=(()=>{
// Authored accompaniment patterns, not new textbook progressions. Every pitch
// comes from the current voicing (or an octave of it); slash bass stays intact.
const GARDEN_ARRANGEMENTS=Object.freeze({
  arpWave:{track:'arpeggio',label:'Лотос волны',detail:'Вверх-вниз · восьмые',color:'#8ff3db',symbol:'↕',petals:6,steps:8},
  arpBroken:{track:'arpeggio',label:'Орхидея излома',detail:'Ломаное арпеджио · восьмые',color:'#c7b0ff',symbol:'⋈',petals:5,steps:8},
  arpSpark:{track:'arpeggio',label:'Искристый папоротник',detail:'Шестнадцатые',color:'#fff0a0',symbol:'✧',petals:8,steps:16},
  arpMist:{track:'arpeggio',label:'Звёздная россыпь',detail:'Тридцать вторые · тихое стекло',color:'#a3e7ff',symbol:'✺',petals:10,steps:32},
  bassCanon:{track:'bass',label:'Янтарный корень',detail:'Канон-пульс · спокойный бас',color:'#f6bf79',symbol:'∿',petals:3},
  bassChill:{track:'bass',label:'Лунная ягода',detail:'Chill · мягкая синкопа',color:'#9dc5ec',symbol:'≈',petals:4},
  bassFunk:{track:'bass',label:'Пружинящий ирис',detail:'Полуфанк · короткий бас',color:'#e7a2c9',symbol:'ϟ',petals:5}
});

function createGardenArrangement(length){
  const bars=Math.max(2,Number(length)||2),tracks={arpeggio:null,bass:null};let current={};
  const snapshot=()=>Object.fromEntries(Object.entries(tracks).filter(([name,item])=>item&&(item.remaining>0||current[name])).map(([name,item])=>[name,{style:item.style,remaining:item.remaining,rounds:Math.ceil(item.remaining/bars),playing:current[name]===item.style}]));
  return {
    activate(style,rounds=1){const spec=GARDEN_ARRANGEMENTS[style];if(!spec)return false;const count=bars*Math.min(3,Math.max(1,Math.trunc(rounds)||1)),old=tracks[spec.track];tracks[spec.track]={style,remaining:Math.min(bars*3,(old?.style===style?old.remaining:0)+count)};return true;},
    boost(){let boosted=false;for(const [name,item] of Object.entries(tracks))if(item&&(item.remaining>0||current[name])){item.remaining=Math.min(bars*3,item.remaining+bars);boosted=true;}return boosted;},
    next(){current={};for(const [name,item] of Object.entries(tracks))if(item?.remaining>0){current[name]=item.style;item.remaining-=1;}return {...current};},
    current:()=>({...current}),snapshot,
    clear(track){if(!(track in tracks))return false;tracks[track]=null;delete current[track];return true;},
    reset(){tracks.arpeggio=tracks.bass=null;current={};}
  };
}

function gardenArrangementEvents(notes,arrangement={},seconds=4){
  if(!Array.isArray(notes)||!notes.length||notes.some(note=>!Number.isFinite(note)))return [];
  const sorted=[...new Set(notes)].sort((a,b)=>a-b),lowest=sorted[0],upper=sorted.length>1?sorted.slice(1):sorted;
  const duration=Math.max(.4,Number(seconds)||4),events=[],arp=GARDEN_ARRANGEMENTS[arrangement.arpeggio],bass=GARDEN_ARRANGEMENTS[arrangement.bass];
  if(arp){
    const wave=upper.length<2?[0]:[...upper.map((_,i)=>i),...upper.slice(1,-1).map((_,i)=>upper.length-2-i)],broken=upper.map((_,i)=>(i%2?upper.length-1-Math.floor(i/2):Math.floor(i/2)));
    const order=arrangement.arpeggio==='arpBroken'?broken:wave;
    for(let i=0;i<arp.steps;i++){const midi=upper[order[i%order.length]];events.push({track:'arpeggio',midi,at:i*duration/arp.steps,duration:Math.min(.42,duration/arp.steps*.78),level:(arp.steps===32?.045:arp.steps===16?.075:.11)*(i%4===0?1:.8)});}
  }
  if(bass){
    // Do not substitute root for a slash-bass. A fifth is used only when it
    // really belongs to the supplied voicing; otherwise use its octave.
    const fifth=sorted.find(note=>((note-lowest)%12+12)%12===7),octave=lowest+12;
    const shape=arrangement.bass==='bassCanon'?[[0,lowest,.42],[.5,octave,.32]]:arrangement.bass==='bassChill'?[[0,lowest,.26],[.375,lowest,.14],[.75,fifth?lowest+7:octave,.20]]:[[0,lowest,.14],[.1875,lowest,.09],[.4375,octave,.12],[.625,fifth?lowest+7:octave,.11],[.875,lowest,.10]];
    for(const [phase,midi,gate] of shape)events.push({track:'bass',midi,at:phase*duration,duration:Math.min(duration*gate,1.4),level:arrangement.bass==='bassFunk'?.17:.14});
  }
  return events.sort((a,b)=>a.at-b.at);
}

function drawGardenArrangementFlower(ctx,spec,size,rounds=1,intensity=1){
  const radius=size*.27,opacity=Math.min(1,ctx.globalAlpha*.35*intensity);ctx.save();ctx.strokeStyle=spec.color;ctx.fillStyle=spec.color;ctx.lineWidth=1.2;
  for(let i=0;i<spec.petals;i++){ctx.save();ctx.rotate(i*Math.PI*2/spec.petals);ctx.globalAlpha=opacity*.74;ctx.beginPath();ctx.ellipse(radius*.6,0,radius*.75,radius*(spec.track==='bass'?.42:.22),.22,0,Math.PI*2);ctx.fill();ctx.globalAlpha=opacity*.95;ctx.stroke();ctx.restore();}
  ctx.globalAlpha=opacity*.5;ctx.beginPath();ctx.arc(0,0,size*.10,0,Math.PI*2);ctx.stroke();
  for(let i=0;i<rounds;i++){ctx.globalAlpha=opacity*.45;ctx.beginPath();ctx.arc(0,0,size*(.35+i*.035),0,Math.PI*2);ctx.stroke();}
  ctx.restore();
}

return {GARDEN_ARRANGEMENTS,createGardenArrangement,gardenArrangementEvents,drawGardenArrangementFlower};
})();
const module_garden_harmony=(()=>{
const {BOOK_CATALOG}=module_book_catalog;
const {INTERVALS,DEGREES,QUALITIES}=module_music;
const {createGardenArrangement,gardenArrangementEvents}=module_garden_arrangement;

const GARDEN_INTERVALS={...INTERVALS,'1':[0],m:INTERVALS.min,'m7♭5':INTERVALS.m7b5,sus2:[0,2,7],sus4:[0,5,7],add9:[0,4,7,14],m9:INTERVALS.m7natural9};
const gardenDegreeLabel=offset=>DEGREES[Number(offset)]?.glyph??'?';
const gardenQualityLabel=quality=>quality==='1'?'1 / 8':QUALITIES[quality]?.glyph??quality;
const gardenCanonicalQuality=quality=>({m:'min','m7♭5':'m7b5',m9:'m7natural9'})[quality]??quality;
// Bottom rail identifies the audible bass, not the root of the upper chord.
const gardenBassOffset=chord=>Number(chord.bassOffset??chord.offset);
const gardenHasIndependentBass=chord=>gardenBassOffset(chord)!==Number(chord.offset);
const gardenQualityAnswer=chord=>gardenHasIndependentBass(chord)?`${Number(chord.offset)}:${gardenCanonicalQuality(chord.quality)}`:gardenCanonicalQuality(chord.quality);
function gardenQualityAnswerLabel(value){
  const parts=String(value).split(':');
  return parts.length===2?`${gardenDegreeLabel(parts[0])} ${gardenQualityLabel(parts[1])}`:gardenQualityLabel(value);
}
function gardenAvailableAnswers(exercise,{expanded=false}={}){
  const required=exercise.sequence.map(gardenQualityAnswer);
  return [...new Set([...GARDEN_CORE_QUALITIES,...GARDEN_QUALITY_PALETTE.filter(q=>expanded||required.includes(q)),...required])];
}
// Fixed motor-memory slots: never derive their order from a route's contents.
const GARDEN_QUALITY_PALETTE=Object.freeze(['maj','min','6','m6','7','maj7','m7','m7b5','dim7','7sus4','sus2','sus4','aug','add9','m7natural9','m7b5natural9','maj7sharp11','7b9','7b9b13','7b5','7sharp5','7alt','m7b9','minSharp5','augMaj7','1']);
const GARDEN_CORE_QUALITIES=Object.freeze(['maj','min','6','7','maj7','m7','m7b5','dim7','7sus4','sus4']);
function gardenFilteredChoices(kind,target,filter,available){
  const values=available??(kind==='degree'?Array.from({length:12},(_,i)=>i):GARDEN_QUALITY_PALETTE);
  if(!filter?.remaining)return new Set(values);
  const correct=kind==='degree'?gardenBassOffset(target):gardenQualityAnswer(target);
  const wrong=values.filter(value=>value!==correct);
  // Suppression masks slots; it never changes the button geometry or order.
  const keep=Math.ceil(wrong.length/(filter.divisor||2));
  const start=kind==='degree'?gardenBassOffset(target)%wrong.length:Math.max(0,values.indexOf(correct))%wrong.length;
  return new Set([correct,...Array.from({length:keep},(_,i)=>wrong[(start+i+wrong.length)%wrong.length])]);
}
// Found answers use the same spelling as their buttons; book notation stays
// available in the node title, rather than replacing the player's answer.
function gardenChordLabel(chord){
  const bass=chord.bassOffset!=null&&Number(chord.bassOffset)!==Number(chord.offset)?`/${gardenDegreeLabel(chord.bassOffset)}`:'';
  const voicing=chord.voicingNote==='no-third'?'(без 3)':chord.voicingNote==='no-fifth'?'(без 5)':'';
  return `${gardenDegreeLabel(chord.offset)}${chord.quality==='maj'?'':gardenQualityLabel(chord.quality)}${voicing}${bass}`;
}
function gardenAnswerState(model,kind,value){
  const parts=model.currentParts??model.progress?.[model.cursor]??{};
  const found=model.cursor>=0&&Boolean(parts[kind]);
  const matches=kind==='degree'?gardenBassOffset(model.current)===Number(value):gardenQualityAnswer(model.current)===gardenCanonicalQuality(value);
  return {selected:found&&matches,disabled:!model.running||model.cursor<0||model.complete||found};
}
const PRESETS={
  felt:{name:'Фетровое пиано',engine:'sample',cutoff:1450,delay:0,feedback:0,drift:0},
  deep:{name:'Глубокий хор',engine:'deep',cutoff:620,delay:.67,feedback:.56,drift:4},
  air:{name:'Воздушное стекло',engine:'air',cutoff:2350,delay:.46,feedback:.42,drift:7}
};

const keyOf=chord=>`${chord.offset}:${chord.quality}:${chord.bassOffset??'root'}`;
const frequency=midi=>440*2**((midi-69)/12);

class GardenPad{
  constructor({deferSamplesUntilReady=false}={}){
    this.context=null;this.output=null;this.cleanOutput=null;this.filter=null;this.delay=null;this.delayFeedback=null;this.voices=[];this.preset='felt';this.sampleBuffers=[];this.generation=0;
    const loadSamples=()=>Promise.all([
      ['assets/echo-garden/samples/felt-c3.wav',48],
      ['assets/echo-garden/samples/felt-e3.wav',52],
      ['assets/echo-garden/samples/felt-g3.wav',55]
    ].map(async([url,midi])=>{
      const embedded=globalThis.GARDEN_SAMPLE_DATA?.[url];
      if(embedded)return {midi,data:Uint8Array.from(atob(embedded),c=>c.charCodeAt(0)).buffer};
      const response=await fetch(url,{priority:'low'});if(!response.ok)throw Error(`Не загрузился семпл ${url}`);return {midi,data:await response.arrayBuffer()};
    }));
    this.sampleData=deferSamplesUntilReady?new Promise(resolve=>addEventListener('garden-ready',()=>resolve(loadSamples()),{once:true})):loadSamples();
    // Handle early failure without an unhandled rejection, then report it on play.
    this.sampleData.catch(()=>{});
  }
  async unlock(){
    if(!this.context){
      const Engine=window.AudioContext||window.webkitAudioContext;
      if(!Engine)throw Error('В этом браузере нет Web Audio.');
      const c=this.context=new Engine({latencyHint:'interactive'});
      this.output=c.createGain();this.output.gain.value=.46;
      this.cleanOutput=c.createGain();this.cleanOutput.gain.value=.82;this.cleanOutput.connect(c.destination);
      this.filter=c.createBiquadFilter();this.filter.type='lowpass';this.filter.Q.value=.72;
      this.delay=c.createDelay(1.4);this.delayFeedback=c.createGain();
      const wet=c.createGain();wet.gain.value=.24;
      this.output.connect(this.filter);this.filter.connect(c.destination);
      this.filter.connect(this.delay);this.delay.connect(this.delayFeedback);this.delayFeedback.connect(this.delay);this.delay.connect(wet);wet.connect(c.destination);
      this.applyPreset(this.preset);
    }
    if(this.context.state!=='running')await this.context.resume();
    if(!this.sampleBuffers.length){const data=await this.sampleData;this.sampleBuffers=await Promise.all(data.map(async sample=>({midi:sample.midi,buffer:await this.context.decodeAudioData(sample.data.slice(0))})));}
  }
  applyPreset(name){
    this.preset=PRESETS[name]?name:'felt';
    if(!this.context)return;
    const p=PRESETS[this.preset],t=this.context.currentTime;
    this.filter.frequency.setTargetAtTime(p.cutoff,t,.18);this.delay.delayTime.setTargetAtTime(p.delay,t,.18);this.delayFeedback.gain.setTargetAtTime(p.feedback,t,.18);
  }
  async play(chord,tonicPitchClass=5,{arpeggio=false,arrangement={},barSeconds=4}={}){
    const generation=++this.generation;
    await this.unlock();
    if(generation!==this.generation)return;
    const c=this.context,p=PRESETS[this.preset],now=c.currentTime;this.lastArrangement=[];
    for(const voice of this.voices){voice.gain.gain.cancelScheduledValues(now);voice.gain.gain.setTargetAtTime(.0001,now,.035);setTimeout(()=>voice.stop(),180);}
    this.voices=[];
    if(chord.audio instanceof Blob){
      const buffer=await c.decodeAudioData(await chord.audio.arrayBuffer()),source=c.createBufferSource(),group=c.createGain();
      source.buffer=buffer;source.loop=buffer.duration>1;source.loopStart=Math.min(.45,buffer.duration*.2);source.loopEnd=Math.max(source.loopStart+.12,buffer.duration-.12);
      group.gain.setValueAtTime(.0001,now);group.gain.exponentialRampToValueAtTime(.34,now+.65);source.connect(group);group.connect(this.output);source.start(now);
      const voice={gain:group,stop:()=>{try{source.stop();}catch{}try{group.disconnect();}catch{}}};this.voices=[voice];return;
    }
    const root=48+tonicPitchClass+chord.offset;
    const bass=48+tonicPitchClass+(chord.bassOffset??chord.offset)-12;
    // Imported MIDI routes retain the player's exact register, voicing and
    // independent bass instead of being rebuilt from the detected label.
    const exactNotes=Array.isArray(chord.notes)&&chord.notes.length;
    if(!exactNotes&&!GARDEN_INTERVALS[chord.quality])throw Error(`Неизвестный тип аккорда: ${chord.quality}. Воспроизведение остановлено, без подмены мажором.`);
    const notes=exactNotes?[...chord.notes]:[bass,...GARDEN_INTERVALS[chord.quality].map(interval=>root+interval)];
    this.lastArrangement=gardenArrangementEvents(notes,chord.reference?{}:arrangement,barSeconds);
    // Sustained foundation stays identifiable underneath two quieter layers.
    // All future attacks belong to this voice group, so pause/route changes
    // cancel them together rather than leaving an accompaniment running.
    if(this.lastArrangement.length){
      const group=c.createGain(),sources=[];group.gain.value=1;group.connect(this.cleanOutput);
      for(const event of this.lastArrangement){
        const tone=c.createOscillator(),level=c.createGain(),at=now+event.at;
        tone.type=event.track==='bass'?'triangle':'sine';tone.frequency.value=frequency(event.midi);
        level.gain.setValueAtTime(.0001,at);level.gain.exponentialRampToValueAtTime(event.level,at+.009);level.gain.exponentialRampToValueAtTime(.0001,at+event.duration);
        tone.connect(level);level.connect(group);tone.start(at);tone.stop(at+event.duration+.025);sources.push(tone);
        tone.onended=()=>{try{tone.disconnect();level.disconnect();}catch{}};
      }
      this.voices.push({gain:group,stop:()=>{for(const tone of sources){try{tone.stop();}catch{}}try{group.disconnect();}catch{}}});
    }
    if(p.engine==='sample'){
      const group=c.createGain(),sources=[];group.gain.setValueAtTime(.68/Math.sqrt(notes.length),now);group.connect(this.cleanOutput);
      notes.forEach((midi,index)=>{
        const sample=this.sampleBuffers.reduce((best,item)=>Math.abs(item.midi-midi)<Math.abs(best.midi-midi)?item:best,this.sampleBuffers[0]);
        const voice=c.createBufferSource(),voiceGain=c.createGain();voice.buffer=sample.buffer;voice.playbackRate.value=2**((midi-sample.midi)/12);voiceGain.gain.value=index===0?.62:1;voice.connect(voiceGain);voiceGain.connect(group);voice.start(now+(arpeggio?index*.18:0));sources.push(voice);
      });
      const voice={gain:group,stop:()=>{for(const item of sources){try{item.stop();}catch{}}try{group.disconnect();}catch{}}};this.voices.push(voice);return;
    }
    const group=c.createGain();group.gain.setValueAtTime(.0001,now);group.connect(this.output);
    if(p.engine==='felt'){
      group.gain.exponentialRampToValueAtTime(.29/Math.sqrt(notes.length),now+.025);
      group.gain.exponentialRampToValueAtTime(.055/Math.sqrt(notes.length),now+3.2);
    }else if(p.engine==='deep')group.gain.exponentialRampToValueAtTime(.18/Math.sqrt(notes.length),now+1.45);
    else group.gain.exponentialRampToValueAtTime(.16/Math.sqrt(notes.length),now+.72);
    const oscillators=[];
    notes.forEach((midi,index)=>{
      const fundamental=c.createOscillator(),body=c.createOscillator(),mix=c.createGain();
      fundamental.type='sine';fundamental.frequency.value=frequency(midi);fundamental.detune.value=(index%2?1:-1)*p.drift;
      body.type=p.engine==='deep'?'triangle':p.engine==='air'?'sine':'triangle';
      body.frequency.value=frequency(midi+(p.engine==='air'&&index>0?12:0));body.detune.value=(index%2?-1:1)*(p.drift+2);
      mix.gain.value=p.engine==='felt'?(index===0?.08:.20):p.engine==='deep'?(index===0?.16:.34):(index===0?.06:.30);
      fundamental.connect(group);body.connect(mix);mix.connect(group);fundamental.start(now);body.start(now);oscillators.push(fundamental,body);
      if(p.engine==='felt'){
        const hammer=c.createOscillator(),hammerGain=c.createGain();hammer.type='sine';hammer.frequency.setValueAtTime(frequency(midi+24),now);hammer.frequency.exponentialRampToValueAtTime(frequency(midi+12),now+.09);hammerGain.gain.setValueAtTime(index===0?.018:.045,now);hammerGain.gain.exponentialRampToValueAtTime(.0001,now+.16);hammer.connect(hammerGain);hammerGain.connect(group);hammer.start(now);hammer.stop(now+.18);oscillators.push(hammer);
      }
      if(p.engine==='air'&&index>0){const shimmer=c.createOscillator(),shimmerGain=c.createGain();shimmer.type='sine';shimmer.frequency.value=frequency(midi+19);shimmer.detune.value=-p.drift;shimmerGain.gain.value=.085;shimmer.connect(shimmerGain);shimmerGain.connect(group);shimmer.start(now);oscillators.push(shimmer);}
      if(p.engine==='deep'){const sub=c.createOscillator(),subGain=c.createGain();sub.type='sine';sub.frequency.value=frequency(midi-12);subGain.gain.value=index===0?.24:.055;sub.connect(subGain);subGain.connect(group);sub.start(now);oscillators.push(sub);}
    });
    const voice={gain:group,stop:()=>{for(const oscillator of oscillators){try{oscillator.stop();}catch{}}try{group.disconnect();}catch{}}};
    this.voices.push(voice);
  }
  async feedback(correct,{complete=false,kind='degree',value=0}={}){
    await this.unlock();
    const c=this.context,at=c.currentTime+.006,group=c.createGain(),degree=Number(value),isDegree=kind==='degree';
    const voices=correct
      ?isDegree
        ?[{pitch:523.25*2**((Number.isFinite(degree)?degree:0)/12),type:'sine',level:1,delay:0,glide:1.045}]
        :[{pitch:392,type:'triangle',level:1,delay:0,glide:1.015},{pitch:783.99,type:'sine',level:.32,delay:.032,glide:1.025}]
      :isDegree
        ?[{pitch:196,type:'triangle',level:1,delay:0,glide:.82}]
        :[{pitch:174.61,type:'square',level:.5,delay:0,glide:.9},{pitch:146.83,type:'triangle',level:.72,delay:.038,glide:.86}];
    if(correct&&complete)voices.push({pitch:1174.66,type:'sine',level:.28,delay:.075,glide:1.04});
    const duration=correct?(complete?.3:isDegree?.17:.22):.14;
    group.gain.setValueAtTime(.0001,at);
    group.gain.exponentialRampToValueAtTime(correct?(complete?.11:.072):.052,at+.008);
    group.gain.exponentialRampToValueAtTime(.0001,at+duration);
    group.connect(this.cleanOutput);
    this.lastFeedback={correct,complete,kind,character:correct?(isDegree?'degree-glass':'quality-petal'):(isDegree?'degree-low':'quality-knock'),pitches:voices.map(voice=>voice.pitch)};
    const oscillators=voices.map(voice=>{
      const oscillator=c.createOscillator(),partial=c.createGain();
      oscillator.type=voice.type;
      oscillator.frequency.setValueAtTime(voice.pitch,at+voice.delay);
      oscillator.frequency.exponentialRampToValueAtTime(voice.pitch*voice.glide,at+Math.min(duration-.015,voice.delay+.11));
      partial.gain.value=voice.level;oscillator.connect(partial);partial.connect(group);
      oscillator.start(at+voice.delay);oscillator.stop(at+duration+.015);
      oscillator.onended=()=>{try{oscillator.disconnect();partial.disconnect();}catch{}};
      return oscillator;
    });
    setTimeout(()=>{try{group.disconnect();}catch{}},Math.ceil((duration+.08)*1000));
    return oscillators.length;
  }
  stop(immediate=false){
    this.generation+=1;
    if(!this.context){this.voices=[];return;}
    const now=this.context.currentTime;
    for(const voice of this.voices){voice.gain.gain.cancelScheduledValues(now);if(immediate){voice.gain.gain.setValueAtTime(.0001,now);voice.stop();}else{voice.gain.gain.setTargetAtTime(.0001,now,.035);setTimeout(()=>voice.stop(),180);}}
    this.voices=[];
  }
}

function createGardenMission({onChange,onChord,barSeconds=4,exercise:providedExercise}={}){
  const sourceExercise=providedExercise??BOOK_CATALOG.find(item=>item.id==='fig-1-6');
  if(!sourceExercise)throw Error('В каталоге не найдена Fig. 1.6.');
  if(sourceExercise.sequence.length<2)throw Error('Для маршрута нужны база и хотя бы один следующий аккорд.');
  // The reference is the tonic sonority of the key, independent of whichever
  // chord starts the printed figure. Prefer the tonic voicing printed in the
  // exercise so modal/minor and sixth-chord examples keep their real colour.
  const tonic=sourceExercise.sequence.find(chord=>Number(chord.offset)===0&&/^I(?!I|V)/.test(String(chord.degree).replace(/^БАЗА\s*/,'')))
    ??{degree:'I',offset:0,quality:'maj',bassOffset:null};
  const reference={...tonic,degree:`БАЗА ${tonic.degree}`,offset:0,bassOffset:null,reference:true};
  const exercise=sourceExercise;
  const accompaniment=createGardenArrangement(exercise.sequence.length);
  const state={exercise,cursor:-1,round:1,basePlayed:false,progress:exercise.sequence.map(()=>({degree:false,quality:false})),running:false,complete:false,feedback:'',barSeconds,timer:0,deadline:0,held:false,arpeggio:false,arpeggioRounds:0,navigation:{enabled:true,revealedPosition:-1,teleportCharges:0},filters:{degree:null,quality:null}};
  const choices=[...exercise.sequence,...(exercise.distractors??[])]
    .filter((chord,index,list)=>list.findIndex(item=>keyOf(item)===keyOf(chord))===index);
  const solvedIndexes=()=>state.progress.flatMap((part,index)=>part.degree&&part.quality?[index]:[]);
  const snapshot=()=>({
    exercise,cursor:state.cursor,round:state.round,progress:state.progress.map(part=>({...part})),parts:state.progress.map(part=>({...part})),solved:solvedIndexes(),
    solvedParts:state.progress.reduce((sum,part)=>sum+Number(part.degree)+Number(part.quality),0),totalParts:exercise.sequence.length*2,
    running:state.running,complete:state.complete,basePlayed:state.basePlayed,feedback:state.feedback,barSeconds:state.barSeconds,deadline:state.deadline,choices,reference,held:state.held,arpeggio:state.arpeggio||state.arpeggioRounds>0,arrangement:state.cursor<0?{}:accompaniment.current(),arrangementStatus:accompaniment.snapshot(),navigation:{...state.navigation},
    current:state.cursor<0?reference:exercise.sequence[state.cursor],currentParts:state.cursor<0?{degree:true,quality:true}:{...state.progress[state.cursor]},filters:{degree:state.filters.degree&&{...state.filters.degree},quality:state.filters.quality&&{...state.filters.quality}}
  });
  const emit=()=>onChange?.(snapshot());
  const schedule=()=>{clearTimeout(state.timer);state.deadline=performance.now()+state.barSeconds*1000;state.timer=setTimeout(()=>{if(!state.running)return;if(state.held&&state.cursor>=0){sound();schedule();}else step();},state.barSeconds*1000);emit();};
  const sound=()=>onChord?.(state.cursor<0?reference:exercise.sequence[state.cursor],snapshot());
  const validPosition=position=>Number.isInteger(position)&&position>=0&&position<exercise.sequence.length;
  const spendFilterStep=()=>{for(const kind of ['degree','quality']){const filter=state.filters[kind];if(filter&&--filter.remaining<=0)state.filters[kind]=null;}};
  const moveTo=(position,feedback)=>{
    if(!state.navigation.enabled||!state.running||state.complete||!validPosition(position))return {ignored:true};
    clearTimeout(state.timer);spendFilterStep();state.held=false;state.arpeggio=false;state.cursor=position;state.feedback=feedback;state.navigation.revealedPosition=-1;sound();schedule();return {position};
  };
  function step(){
    if(!state.running)return;
    if(state.cursor>=0)spendFilterStep();state.feedback='';state.cursor+=1;
    if(state.cursor>=exercise.sequence.length){state.cursor=0;state.round+=1;}
    accompaniment.next();sound();if(state.arpeggioRounds>0)state.arpeggioRounds-=1;schedule();
  }
  const finish=()=>{state.complete=true;state.running=false;state.held=false;state.arpeggio=false;clearTimeout(state.timer);state.timer=0;state.deadline=0;};
  const settleAnswer=()=>{
    if(state.progress.every(item=>item.degree&&item.quality)){finish();emit();return false;}
    if(state.held){state.held=false;state.arpeggio=false;step();return true;}
    emit();return false;
  };
  return {
    start(){
      if(state.running)return;
      state.running=true;state.complete=false;state.feedback='';
      if(state.cursor<0&&state.basePlayed){step();return;}
      state.basePlayed=true;sound();schedule();
    },
    pause({preserveHold=false}={}){state.running=false;if(!preserveHold)state.held=false;clearTimeout(state.timer);state.timer=0;state.deadline=0;emit();},
    restart(){clearTimeout(state.timer);accompaniment.reset();state.cursor=-1;state.round=1;state.basePlayed=false;state.progress=exercise.sequence.map(()=>({degree:false,quality:false}));state.running=false;state.complete=false;state.feedback='';state.deadline=0;state.filters={degree:null,quality:null};state.navigation.revealedPosition=-1;emit();},
    answerPart(kind,value){
      if(!state.running||state.cursor<0||state.complete||!['degree','quality'].includes(kind))return {ignored:true};
      const position=state.cursor,part=state.progress[position];
      if(part[kind])return {ignored:true,correct:true,position,positionComplete:part.degree&&part.quality,complete:state.complete};
      const target=exercise.sequence[state.cursor];
      const correct=kind==='degree'?Number(value)===gardenBassOffset(target):gardenCanonicalQuality(value)===gardenQualityAnswer(target);
      if(correct){
        part[kind]=true;
        const positionComplete=part.degree&&part.quality;
        state.feedback=positionComplete?'Бас и аккорд найдены':kind==='degree'?'Бас найден — теперь аккорд':'Аккорд найден — теперь бас';
        const advanced=settleAnswer();
        return {correct,kind,position,positionComplete,complete:state.complete,advanced};
      }else state.feedback=kind==='degree'?'Бас не совпал — найденный аккорд сохранён':'Аккорд не совпал — найденный бас сохранён';
      emit();return {correct,kind,position,positionComplete:part.degree&&part.quality,complete:state.complete,advanced:false};
    },
    answer(chord){
      if(!state.running||state.cursor<0||state.complete)return {ignored:true};
      const position=state.cursor,target=exercise.sequence[position],part=state.progress[position];
      if(part.degree&&part.quality)return {ignored:true,correct:true,position,positionComplete:true,complete:state.complete};
      const correct=gardenBassOffset(chord)===gardenBassOffset(target)&&Number(chord.offset)===Number(target.offset)&&gardenCanonicalQuality(chord.quality)===gardenCanonicalQuality(target.quality);
      if(correct){part.degree=true;part.quality=true;state.feedback='Обе части сигнала встроены в маршрут';const advanced=settleAnswer();return {correct,position,positionComplete:true,complete:state.complete,advanced};}
      else state.feedback='Не совпало — найденные раньше части сохранены';
      emit();return {correct,position,positionComplete:part.degree&&part.quality,complete:state.complete,advanced:false};
    },
    advance(){step();},
    shift(delta,{consume}={}){
      if(!state.running||state.complete||state.cursor<0||![-7,-5,-3,3,5,7].includes(delta)||typeof consume!=='function')return {ignored:true};
      const position=(state.cursor+delta%exercise.sequence.length+exercise.sequence.length)%exercise.sequence.length;
      if(position===state.cursor||!consume())return {ignored:true};
      return moveTo(position,`Мандала сместила маршрут на ${delta>0?'+':''}${delta}: позиция ${position+1}`);
    },
    revealPosition(){return {ignored:true};},
    teleportTo(){return {ignored:true};},
    assist(spec,{consume}={}){
      if(!state.running||state.complete||state.cursor<0||typeof consume!=='function'||!['degree','quality','both'].includes(spec?.answerKind))return {ignored:true};
      const kind=spec.answerKind;
      if(spec.reveal){
        const part=state.progress[state.cursor];
        if(kind==='both'?(part.degree&&part.quality):part[kind])return {ignored:true};
        if(!consume())return {ignored:true};
        const target=exercise.sequence[state.cursor];
        // Reveal both atomically: one inventory charge, one render, no route
        // advance between the bass and upper-chord answers.
        const result=kind==='both'?this.answer(target):this.answerPart(kind,kind==='degree'?gardenBassOffset(target):gardenQualityAnswer(target));
        return {...result,assisted:true};
      }
      if(kind==='both'||![2,4].includes(spec.divisor)||!consume())return {ignored:true};
      state.filters[kind]={divisor:spec.divisor,remaining:spec.rounds?exercise.sequence.length*spec.rounds:spec.steps};
      state.feedback=`Подсказка: ${kind==='degree'?'бас':'аккорды'} ×${spec.divisor}, ${state.filters[kind].remaining} ходов`;
      emit();return {assisted:true,kind};
    },
    arrange(style,rounds=1){if(!accompaniment.activate(style,rounds))return false;state.feedback='Цветок добавит слой со следующего аккорда';emit();return true;},
    boostArrangement(){const applied=accompaniment.boost();state.feedback=applied?'Активные слои продлены на один круг':'Сначала поймай цветок арпеджио или баса';emit();return applied;},
    clearArrangement(track){if(!accompaniment.clear(track))return false;state.feedback='Слой выключится со следующего аккорда';emit();return true;},
    arpeggioRound(){accompaniment.activate('arpWave',1);state.feedback='Арпеджио начнётся со следующего аккорда на один круг';emit();},
    restartFromRoot(){clearTimeout(state.timer);state.running=true;state.held=false;state.cursor=-1;state.basePlayed=true;state.feedback='Возврат к тонике';sound();schedule();},
    jumpToMiddle(){clearTimeout(state.timer);state.running=true;state.held=false;state.cursor=Math.max(-1,Math.floor(exercise.sequence.length/2)-1);state.feedback='Маршрут продолжен с середины';step();},
    hold(arpeggio=false){if(!state.running||state.complete)return {ignored:true};clearTimeout(state.timer);if(state.cursor<0)state.cursor=0;state.held=true;state.arpeggio=arpeggio;state.feedback='∞ Повторяем текущий аккорд в темпе';sound();schedule();return {held:true};},
    replayCurrent(){if(!state.held||state.cursor<0)return;state.feedback=state.arpeggio?'Арпеджио прозвучит ещё раз':'Аккорд прозвучит ещё раз';sound();emit();},
    continue({advance=true}={}){if(!state.held||!state.running||state.complete)return {ignored:true};state.held=false;state.arpeggio=false;state.feedback='Продолжаем маршрут';if(state.progress.every(item=>item.degree&&item.quality)){finish();emit();}else if(advance)step();else emit();return {held:false,advanced:advance&&!state.complete,complete:state.complete};},
    snapshot
  };
}

{PRESETS,keyOf};
const gardenExercisesForChapter=chapter=>BOOK_CATALOG.filter(item=>item.chapter===chapter);

return {gardenDegreeLabel,gardenQualityLabel,gardenCanonicalQuality,gardenBassOffset,gardenHasIndependentBass,gardenQualityAnswer,gardenQualityAnswerLabel,gardenAvailableAnswers,GARDEN_QUALITY_PALETTE,GARDEN_CORE_QUALITIES,gardenFilteredChoices,gardenChordLabel,gardenAnswerState,GardenPad,createGardenMission,gardenExercisesForChapter};
})();
const module_garden_tour_routes=(()=>{
// Exact user-supplied MIDI notes and voicings.
const BUILTIN_TOUR_ROUTES=Object.freeze([
  {
    "id": "builtin-gospel-05",
    "tour": "gospel",
    "number": "05",
    "name": "Gospel 5",
    "source": "MIDI пользователя · Gospel 5.midi",
    "chords": [
      [
        36,
        48,
        62,
        64,
        71
      ],
      [
        36,
        48,
        62,
        64,
        69
      ],
      [
        36,
        48,
        62,
        64,
        67,
        71
      ],
      [
        39,
        51,
        63,
        66,
        70,
        74
      ],
      [
        60,
        72
      ],
      [
        39,
        63,
        69
      ],
      [
        47,
        51,
        59,
        63,
        66,
        72
      ],
      [
        47,
        55,
        57,
        63,
        67,
        69,
        72
      ],
      [
        40,
        52,
        62,
        64,
        67,
        71
      ],
      [
        43,
        55,
        62,
        64,
        67,
        71
      ],
      [
        43,
        55,
        62,
        64,
        67
      ],
      [
        43,
        55,
        62,
        64,
        69
      ],
      [
        62,
        64,
        67,
        71
      ],
      [
        35,
        42,
        47,
        63,
        67,
        70,
        74
      ],
      [
        35,
        42,
        47,
        63,
        68,
        72
      ],
      [
        39,
        46,
        51,
        63,
        66,
        69,
        70
      ],
      [
        35,
        42,
        47,
        63,
        68,
        72
      ],
      [
        40,
        47,
        52,
        62,
        64,
        67,
        71
      ]
    ]
  },
  {
    "id": "builtin-gospel-02",
    "tour": "gospel",
    "number": "02",
    "name": "Gospel 2",
    "source": "MIDI пользователя · Gospel 2.midi",
    "chords": [
      [
        51,
        54,
        58,
        61,
        65
      ],
      [
        53,
        56,
        60,
        63,
        67
      ],
      [
        58,
        61,
        65,
        68,
        72
      ],
      [
        56,
        58,
        60,
        63,
        67,
        70
      ],
      [
        51,
        54,
        56,
        58,
        61,
        65
      ],
      [
        53,
        56,
        60,
        63,
        67
      ],
      [
        58,
        61,
        65,
        68,
        72
      ],
      [
        56,
        58,
        60,
        63,
        67,
        70
      ],
      [
        52,
        56,
        58,
        59,
        63,
        66
      ],
      [
        51,
        55,
        58,
        61,
        63
      ],
      [
        38,
        50,
        53,
        56,
        60,
        63,
        66
      ]
    ]
  },
  {
    "id": "builtin-gospel-01",
    "tour": "gospel",
    "number": "01",
    "name": "Gospel 1",
    "source": "MIDI пользователя · Gospel 1.midi",
    "chords": [
      [
        35,
        42,
        47,
        56,
        59,
        63
      ],
      [
        37,
        44,
        49,
        56,
        61,
        65
      ],
      [
        39,
        46,
        51,
        54,
        58,
        61,
        63,
        65
      ],
      [
        39,
        46,
        51,
        54,
        58,
        61,
        63,
        65
      ],
      [
        34,
        41,
        46,
        56,
        58,
        61,
        65
      ],
      [
        34,
        46,
        56,
        58,
        61,
        65
      ],
      [
        35,
        42,
        47,
        58,
        59,
        63,
        66
      ],
      [
        37,
        44,
        49,
        56,
        58,
        61,
        65
      ],
      [
        39,
        46,
        51,
        54,
        58,
        61,
        65
      ],
      [
        51,
        54,
        58,
        63,
        66,
        75
      ],
      [
        61,
        63,
        66,
        73
      ],
      [
        58,
        63,
        66,
        70
      ],
      [
        59,
        63,
        66,
        68,
        71
      ],
      [
        35,
        42,
        47,
        59,
        63,
        66,
        70
      ],
      [
        37,
        41,
        44,
        49,
        61,
        65,
        68,
        70,
        73
      ],
      [
        42,
        46,
        49,
        54,
        66,
        70,
        73,
        75,
        78
      ],
      [
        39,
        46,
        51,
        66,
        70,
        73,
        75,
        78
      ],
      [
        34,
        41,
        46,
        56,
        58,
        61,
        63,
        65,
        68,
        70
      ],
      [
        34,
        41,
        46,
        56,
        58,
        61,
        63,
        65,
        68,
        70
      ],
      [
        35,
        42,
        47,
        59,
        66,
        70
      ],
      [
        37,
        41,
        44,
        49,
        61,
        65,
        68,
        70,
        73
      ],
      [
        42,
        46,
        49,
        54,
        63,
        66,
        70,
        73,
        75
      ],
      [
        39,
        46,
        51,
        66,
        70,
        73,
        75
      ],
      [
        34,
        41,
        46,
        56,
        58,
        61,
        63,
        65,
        68,
        70
      ],
      [
        34,
        41,
        46,
        58,
        61,
        63,
        65,
        68,
        70
      ]
    ]
  },
  {
    "id": "builtin-drum-bass-03",
    "tour": "drum-bass",
    "number": "03",
    "name": "Drum&Bass 3",
    "source": "MIDI пользователя · Drum&Bass 3.midi",
    "chords": [
      [
        55,
        57,
        59,
        60,
        64
      ],
      [
        57,
        59,
        61,
        62,
        66
      ],
      [
        59,
        60,
        62,
        64,
        67
      ],
      [
        59,
        62,
        64,
        67,
        71
      ],
      [
        55,
        57,
        59,
        60,
        64
      ],
      [
        57,
        59,
        61,
        62,
        66
      ],
      [
        62,
        64,
        66,
        69
      ],
      [
        59,
        60,
        62,
        64,
        67
      ]
    ]
  },
  {
    "id": "builtin-drum-bass-02",
    "tour": "drum-bass",
    "number": "02",
    "name": "Drum&Bass 2",
    "source": "MIDI пользователя · Drum&Bass 2.midi",
    "chords": [
      [
        48,
        64,
        67,
        71
      ],
      [
        50,
        62,
        66,
        69
      ],
      [
        52,
        64,
        67,
        71
      ],
      [
        52,
        59,
        67,
        76
      ],
      [
        48,
        64,
        67,
        71
      ],
      [
        50,
        62,
        66,
        69
      ],
      [
        52,
        64,
        67,
        71
      ],
      [
        48,
        55,
        60,
        64
      ]
    ]
  },
  {
    "id": "builtin-drum-bass-01plus",
    "tour": "drum-bass",
    "number": "01+",
    "name": "Drum&Bass 1+",
    "source": "MIDI пользователя · Drum&Bass 1+.midi",
    "chords": [
      [
        59,
        61,
        62,
        66,
        69
      ],
      [
        59,
        61,
        63,
        64,
        68
      ],
      [
        61,
        62,
        64,
        66,
        69
      ],
      [
        61,
        64,
        68,
        69,
        71
      ],
      [
        59,
        61,
        64,
        66,
        68
      ],
      [
        63,
        64,
        66,
        68,
        71
      ],
      [
        62,
        64,
        66,
        69,
        73
      ],
      [
        67,
        71,
        74
      ]
    ]
  },
  {
    "id": "builtin-ambient-03plus",
    "tour": "ambient",
    "number": "03+",
    "name": "Ambient 3+",
    "source": "MIDI пользователя · Ambient 3+.midi",
    "chords": [
      [
        43,
        60,
        77
      ],
      [
        48,
        57,
        79
      ],
      [
        45,
        60,
        74
      ],
      [
        50,
        62,
        72,
        74
      ],
      [
        48,
        57,
        74
      ],
      [
        50,
        55,
        69,
        77
      ],
      [
        57,
        60,
        64
      ],
      [
        50,
        53,
        57
      ]
    ]
  },
  {
    "id": "builtin-ambient-02",
    "tour": "ambient",
    "number": "02",
    "name": "Ambient 2",
    "source": "MIDI пользователя · Ambient 2.midi",
    "chords": [
      [
        40,
        52,
        56,
        66,
        80
      ],
      [
        40,
        52,
        57,
        66,
        78
      ],
      [
        40,
        52,
        56,
        68,
        76
      ],
      [
        40,
        56,
        75
      ],
      [
        40,
        52,
        56,
        66,
        80
      ],
      [
        40,
        52,
        57,
        66,
        78
      ],
      [
        40,
        52,
        56,
        68,
        81
      ],
      [
        40,
        56,
        80
      ]
    ]
  },
  {
    "id": "builtin-ambient-01",
    "tour": "ambient",
    "number": "01",
    "name": "Ambient 1",
    "source": "MIDI пользователя · Ambient 1.midi",
    "chords": [
      [
        38,
        57,
        73,
        78
      ],
      [
        38,
        57,
        71,
        79
      ],
      [
        38,
        54,
        74,
        83
      ],
      [
        38,
        57,
        73,
        83
      ],
      [
        38,
        57,
        71,
        79
      ],
      [
        38,
        54,
        74,
        78
      ]
    ]
  },
  {
    "id": "builtin-chill-03",
    "tour": "chill",
    "number": "03",
    "name": "Chill 3",
    "source": "MIDI пользователя · Chill 3.midi",
    "chords": [
      [
        37,
        49,
        52,
        56,
        59,
        63
      ],
      [
        42,
        49,
        52,
        56,
        59,
        61
      ],
      [
        44,
        51,
        54,
        58,
        61,
        63
      ],
      [
        47,
        54,
        57,
        60,
        63
      ],
      [
        49,
        52,
        56,
        59,
        63
      ],
      [
        44,
        51,
        54,
        58,
        61,
        63
      ],
      [
        47,
        51,
        54,
        57,
        60,
        63
      ]
    ]
  },
  {
    "id": "builtin-chill-02",
    "tour": "chill",
    "number": "02",
    "name": "Chill 2",
    "source": "MIDI пользователя · Chill 2.midi",
    "chords": [
      [
        51,
        56,
        58,
        61,
        65,
        68
      ],
      [
        54,
        57,
        59,
        61,
        64,
        68,
        71
      ],
      [
        53,
        56,
        58,
        63,
        67,
        70
      ],
      [
        50,
        58,
        62,
        66,
        70,
        73
      ],
      [
        51,
        56,
        58,
        61,
        65,
        68
      ],
      [
        44,
        51,
        54,
        57,
        60,
        64
      ],
      [
        49,
        56,
        60,
        63,
        65,
        68
      ],
      [
        49,
        56,
        60,
        63,
        65,
        68
      ]
    ]
  },
  {
    "id": "builtin-chill-01",
    "tour": "chill",
    "number": "01",
    "name": "Chill 1",
    "source": "MIDI пользователя · Chill 1.midi",
    "chords": [
      [
        48,
        60,
        63,
        67
      ],
      [
        51,
        56,
        60,
        63
      ],
      [
        48,
        53,
        57,
        60
      ],
      [
        50,
        55,
        59,
        62
      ],
      [
        51,
        55,
        58,
        63
      ],
      [
        50,
        55,
        58,
        67
      ],
      [
        53,
        58,
        60,
        65
      ],
      [
        53,
        57,
        60,
        65
      ]
    ]
  }
]);

return {BUILTIN_TOUR_ROUTES};
})();
const module_garden_sequence_studio=(()=>{
const {BUILTIN_TOUR_ROUTES}=module_garden_tour_routes;
const NOTE_NAMES=['C','C♯','D','E♭','E','F','F♯','G','A♭','A','B♭','B'];
const CHORDS=[
  ['1',[0]],
  ['maj',[0,4,7]],['m',[0,3,7]],['6',[0,4,7,9]],['m6',[0,3,7,9]],
  ['maj7',[0,4,7,11]],['7',[0,4,7,10]],['m7',[0,3,7,10]],['m7♭5',[0,3,6,10]],
  ['sus2',[0,2,7]],['sus4',[0,5,7]],['m9',[0,3,7,10,2]],['add9',[0,4,7,2]]
];
const TOURS=Object.freeze([
  ['reharm','Reharm'],['anime','Anime'],['chill','Chill'],['ambient','Ambient'],['cinematic','Cinematic'],
  ['deep-house','Deep House'],['funk','Funk'],['gospel','Gospel'],['drum-bass','Drum & Bass']
]);
const $=id=>document.getElementById(id),magnitude=db=>db<=-100?0:10**(db/20),median=values=>values.length?[...values].sort((a,b)=>a-b)[Math.floor(values.length/2)]:0;
function chooseMime(){for(const type of ['audio/webm;codecs=opus','audio/mp4;codecs=mp4a.40.2','audio/webm','audio/mp4'])if(MediaRecorder?.isTypeSupported(type))return type;return '';}
function recognizeChord(chroma,bassPc){
  const total=chroma.reduce((a,b)=>a+b,0)||1,normalized=chroma.map(value=>value/total);let best={score:-Infinity,root:0,quality:'maj'};
  for(let root=0;root<12;root++)for(const [quality,intervals] of CHORDS){
    const inside=intervals.reduce((sum,interval)=>sum+normalized[(root+interval)%12],0),outside=1-inside;
    const score=inside-outside*.22+normalized[root]*.18+(root===bassPc ? .08 : 0)-intervals.length*.008;
    if(score>best.score)best={score,root,quality};
  }
  return {...best,label:`${NOTE_NAMES[best.root]}${best.quality==='maj'?'':best.quality}`};
}
function stepFromMidi(notes){
  const bassMidi=Math.min(...notes),bassPc=(bassMidi%12+12)%12,chroma=Array(12).fill(0);notes.forEach(note=>chroma[(note%12+12)%12]++);
  const found=recognizeChord(chroma,bassPc),suffix=found.quality==='maj'?'':found.quality==='1'?' · 1/8':found.quality,base=`${NOTE_NAMES[found.root]}${suffix}`,label=bassPc===found.root?base:`${base}/${NOTE_NAMES[bassPc]}`;
  const pcs=new Set(notes.map(note=>(note-found.root+120)%12));
  const voicingNote=found.quality==='6'&&!pcs.has(4)?'no-third':found.quality==='6'&&!pcs.has(7)?'no-fifth':null;
  return {id:crypto.randomUUID(),degree:label,label,rootPc:found.root,quality:found.quality,notes:[...notes],voicingNote,bassMidi,duration:0,audio:null,mimeType:'',bassOffset:(bassPc-found.root+12)%12,bassPc};
}
function builtInRoute(spec){
  const steps=spec.chords.map(stepFromMidi),baseRoot=steps[0]?.rootPc??0;
  return {...spec,builtin:true,created:'2000-01-01T00:00:00.000Z',baseTonic:baseRoot,sequence:steps.map(step=>({...step,offset:(step.rootPc-baseRoot+12)%12,bassOffset:(step.bassPc-baseRoot+12)%12})),distractors:[]};
}
const chordLabel=(chroma,bassPc)=>recognizeChord(chroma,bassPc).label;
const qualityIntervals=quality=>CHORDS.find(([name])=>name===quality)?.[1]??[0,4,7];
const musicXmlQuality=kind=>({major:'maj',minor:'m',dominant:'7','major-seventh':'maj7','minor-seventh':'m7','half-diminished':'m7b5','diminished-seventh':'dim7','suspended-fourth':'sus4','suspended-second':'sus2','major-sixth':'6','minor-sixth':'m6'}[kind]||'maj');
const pitchClass=(step,alter=0)=>(['C','D','E','F','G','A','B'].indexOf(step)*2-[0,0,0,1,1,1,1][Math.max(0,['C','D','E','F','G','A','B'].indexOf(step))]+Number(alter)+12)%12;
function wavSlice(buffer,start,end){
  const channels=buffer.numberOfChannels,from=Math.max(0,Math.floor(start*buffer.sampleRate)),to=Math.min(buffer.length,Math.ceil(end*buffer.sampleRate)),length=Math.max(1,to-from),out=new ArrayBuffer(44+length*channels*2),view=new DataView(out);
  const text=(offset,value)=>{for(let i=0;i<value.length;i++)view.setUint8(offset+i,value.charCodeAt(i));};
  text(0,'RIFF');view.setUint32(4,36+length*channels*2,true);text(8,'WAVE');text(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,channels,true);view.setUint32(24,buffer.sampleRate,true);view.setUint32(28,buffer.sampleRate*channels*2,true);view.setUint16(32,channels*2,true);view.setUint16(34,16,true);text(36,'data');view.setUint32(40,length*channels*2,true);
  let offset=44;for(let i=0;i<length;i++)for(let channel=0;channel<channels;channel++){const sample=Math.max(-1,Math.min(1,buffer.getChannelData(channel)[from+i]||0));view.setInt16(offset,sample<0?sample*32768:sample*32767,true);offset+=2;}
  return new Blob([out],{type:'audio/wav'});
}
function splitAudio(buffer){
  const data=buffer.getChannelData(0),frame=1024,rms=[];
  for(let at=0;at<data.length;at+=frame){let sum=0;for(let i=at;i<Math.min(data.length,at+frame);i++)sum+=data[i]*data[i];rms.push(Math.sqrt(sum/Math.min(frame,data.length-at)));}
  const sorted=[...rms].sort((a,b)=>a-b),loud=sorted[Math.floor(sorted.length*.9)]||0,threshold=Math.max(.0025,loud*.105),gapFrames=Math.max(2,Math.round(buffer.sampleRate*.22/frame));
  const spans=[];let start=-1,last=-1;
  for(let i=0;i<rms.length;i++)if(rms[i]>threshold){if(start<0)start=i;if(last>=0&&i-last>gapFrames){spans.push([start,last+1]);start=i;}last=i;}
  if(start>=0)spans.push([start,(last??start)+1]);
  let segments=spans.map(([a,b])=>[Math.max(0,a*frame/buffer.sampleRate-.06),Math.min(buffer.duration,b*frame/buffer.sampleRate+.14)]).filter(([a,b])=>b-a>.28);
  if(segments.length<2){
    const onsets=[0];for(let i=2;i<rms.length;i++){const time=i*frame/buffer.sampleRate;if(time-onsets.at(-1)<.58)continue;const before=Math.max(rms[i-1],rms[i-2],.0001);if(rms[i]>threshold*1.7&&rms[i]>before*1.75)onsets.push(time);}
    if(onsets.length>1)segments=onsets.map((time,index)=>[time,onsets[index+1]??buffer.duration]).filter(([a,b])=>b-a>.3);
  }
  return segments.length?segments:[[0,buffer.duration]];
}
function analyzeSegment(buffer,start,end){
  const data=buffer.getChannelData(0),sampleRate=buffer.sampleRate,windowSize=Math.min(4096,Math.max(1024,Math.floor((end-start)*sampleRate/5))),chroma=Array(12).fill(0),midiEnergy=[];
  for(let midi=36;midi<=83;midi++){
    const frequency=440*2**((midi-69)/12),coefficient=2*Math.cos(2*Math.PI*frequency/sampleRate);let energy=0;
    for(let window=1;window<=4;window++){const center=start+(end-start)*window/5,at=Math.max(0,Math.min(data.length-windowSize,Math.floor(center*sampleRate-windowSize/2)));let previous=0,previous2=0;for(let i=0;i<windowSize;i++){const value=data[at+i]*(.5-.5*Math.cos(2*Math.PI*i/(windowSize-1)))+coefficient*previous-previous2;previous2=previous;previous=value;}energy+=previous2*previous2+previous*previous-coefficient*previous*previous2;}
    midiEnergy.push([midi,energy]);chroma[(midi%12+12)%12]+=energy*(midi<64?1:.55);
  }
  const max=Math.max(...midiEnergy.map(([,value])=>value),1),bassMidi=midiEnergy.find(([,value])=>value>max*.12)?.[0]??48,recognized=recognizeChord(chroma,(bassMidi%12+12)%12),rootMidi=48+recognized.root;
  return {...recognized,label:`${NOTE_NAMES[recognized.root]}${recognized.quality==='maj'?'':recognized.quality}`,bassMidi,notes:qualityIntervals(recognized.quality).map(interval=>rootMidi+interval)};
}
function parseMidi(arrayBuffer){
  const bytes=new Uint8Array(arrayBuffer),view=new DataView(arrayBuffer);let cursor=0;
  const text=length=>{let value='';while(length--)value+=String.fromCharCode(bytes[cursor++]);return value;};
  const u16=()=>{const value=view.getUint16(cursor);cursor+=2;return value;},u32=()=>{const value=view.getUint32(cursor);cursor+=4;return value;};
  if(text(4)!=='MThd')throw Error('это не Standard MIDI File');const headerLength=u32(),format=u16(),trackCount=u16(),division=u16();cursor=8+headerLength;
  const noteOns=[];
  const vlq=end=>{let value=0,count=0;while(cursor<end&&count++<4){const byte=bytes[cursor++];value=(value<<7)|(byte&127);if(byte<128)return value;}return value;};
  for(let track=0;track<trackCount&&cursor<bytes.length;track++){
    if(text(4)!=='MTrk')throw Error('повреждён блок MTrk');const length=u32(),end=Math.min(bytes.length,cursor+length);let tick=0,running=0;
    while(cursor<end){tick+=vlq(end);let status=bytes[cursor];if(status<128){if(!running)throw Error('MIDI running status без события');status=running;}else{cursor++;if(status<240)running=status;}
      if(status===255){cursor++;const size=vlq(end);cursor+=size;continue;}
      if(status===240||status===247){const size=vlq(end);cursor+=size;running=0;continue;}
      const type=status&240,channel=status&15,data1=bytes[cursor++],twoBytes=!([192,208].includes(type)),data2=twoBytes?bytes[cursor++]:0;
      if(type===144&&data2>0)noteOns.push({tick,note:data1,velocity:data2,channel});
    }
    cursor=end;
  }
  if(!noteOns.length)throw Error('в MIDI нет нот');noteOns.sort((a,b)=>a.tick-b.tick||a.note-b.note);
  const tolerance=Math.max(3,Math.round(division/16)),groups=[];
  for(const event of noteOns){const group=groups.at(-1);if(group&&event.tick-group.tick<=tolerance)group.events.push(event);else groups.push({tick:event.tick,events:[event]});}
  const chords=groups.map(group=>[...new Set(group.events.map(event=>event.note))].sort((a,b)=>a-b)).filter(notes=>notes.length>=2);
  if(!chords.length)throw Error('не найдено одновременных групп нот');
  return {format,division,chords};
}
function openDatabase(){return new Promise((resolve,reject)=>{const request=indexedDB.open('echo-garden-studio',1);request.onupgradeneeded=()=>request.result.createObjectStore('routes',{keyPath:'id'});request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}
async function databaseAction(mode,work){const db=await openDatabase();return new Promise((resolve,reject)=>{const tx=db.transaction('routes',mode),store=tx.objectStore('routes'),result=work(store);tx.oncomplete=()=>{db.close();resolve(result?.result)};tx.onerror=()=>{db.close();reject(tx.error);};});}

class GardenSequenceStudio{
  constructor({onUse,onOpen,onClose}={}){
    this.onUse=onUse;this.onOpen=onOpen;this.onClose=onClose;this.steps=[];this.routes=[];this.capture=null;
    $('studio-add-step')?.addEventListener('click',()=>this.addManualStep());
    $('studio-import-audio')?.addEventListener('change',event=>{for(const file of event.target.files||[])this.addManualStep(file);event.target.value='';});
    $('studio-import-route')?.addEventListener('change',event=>{const file=event.target.files?.[0];if(file)this.importRouteFile(file);event.target.value='';});
    this.renderSteps();this.refresh();
  }
  async refresh(){const saved=await databaseAction('readonly',store=>store.getAll()).catch(()=>[]);saved.sort((a,b)=>b.created.localeCompare(a.created));this.routes=[...BUILTIN_TOUR_ROUTES.map(builtInRoute),...saved];this.renderLibrary();}
  open(){this.onOpen?.();$('sequence-studio').hidden=false;$('studio-name').focus();this.refresh(); }
  close(){if(this.capture)this.stopCapture();$('sequence-studio').hidden=true;this.onClose?.();}
  async startCapture(){
    $('studio-error').textContent='';
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false,channelCount:{ideal:2}},video:false});
      const Context=window.AudioContext||window.webkitAudioContext,context=new Context({latencyHint:'interactive'});await context.resume();
      const source=context.createMediaStreamSource(stream),analyser=context.createAnalyser();analyser.fftSize=32768;analyser.smoothingTimeConstant=.7;analyser.minDecibels=-105;analyser.maxDecibels=-18;source.connect(analyser);
      const mime=chooseMime(),chunks=[],recorder=new MediaRecorder(stream,mime?{mimeType:mime,audioBitsPerSecond:192000}:undefined),frames=[];
      recorder.ondataavailable=event=>{if(event.data.size)chunks.push(event.data);};recorder.start(250);
      const started=performance.now(),freq=new Float32Array(analyser.frequencyBinCount),timer=setInterval(()=>{
        analyser.getFloatFrequencyData(freq);const step=context.sampleRate/2/freq.length,chroma=Array(12).fill(0),midiEnergy=new Map();let bass={midi:48,value:0};
        for(let index=1;index<freq.length;index++){const hz=index*step;if(hz<42||hz>6000)continue;const value=magnitude(freq[index]);if(value<.00008)continue;const midi=Math.round(69+12*Math.log2(hz/440)),pc=(midi%12+12)%12,weight=hz<1800?1:.3;chroma[pc]+=value*weight;midiEnergy.set(midi,(midiEnergy.get(midi)||0)+value);if(hz<360&&value>bass.value)bass={midi,value};}
        if(chroma.reduce((a,b)=>a+b,0)>.006)frames.push({chroma,bass:bass.midi,midiEnergy:[...midiEnergy]});
        const aggregate=Array(12).fill(0);for(const frame of frames.slice(-8))frame.chroma.forEach((value,index)=>aggregate[index]+=value);
        if(frames.length)$('studio-detected').textContent=`Слышу: ${chordLabel(aggregate,(frames.at(-1).bass%12+12)%12)}`;
        $('studio-capture-time').textContent=`${((performance.now()-started)/1000).toFixed(1)} с`;
      },120);
      this.capture={stream,context,source,analyser,recorder,chunks,frames,timer,started};$('studio-capture').textContent='■ Зафиксировать аккорд';$('studio-capture').classList.add('recording');$('studio-state').textContent=`ШАГ ${String(this.steps.length+1).padStart(2,'0')} · СЛУШАЮ`;
    }catch(error){$('studio-error').textContent=error.name==='NotAllowedError'?'Разреши микрофон в настройках браузера.':`Микрофон не включился: ${error.message}`;}
  }
  async stopCapture(){
    const capture=this.capture;if(!capture)return;this.capture=null;clearInterval(capture.timer);
    const blob=await new Promise(resolve=>{capture.recorder.onstop=()=>resolve(new Blob(capture.chunks,{type:capture.recorder.mimeType||'audio/webm'}));capture.recorder.stop();});
    capture.stream.getTracks().forEach(track=>track.stop());capture.source.disconnect();capture.analyser.disconnect();capture.context.close();
    const useful=capture.frames.slice(Math.floor(capture.frames.length*.15)),chroma=Array(12).fill(0),energy=new Map();
    for(const frame of useful){frame.chroma.forEach((value,index)=>chroma[index]+=value);for(const [midi,value] of frame.midiEnergy)energy.set(midi,(energy.get(midi)||0)+value);}
    const bassMidi=Math.round(median(useful.map(frame=>frame.bass))),bassPc=(bassMidi%12+12)%12;
    const notes=[...energy].sort((a,b)=>b[1]-a[1]).filter(([midi],index,list)=>list.slice(0,index).every(([chosen])=>Math.abs(chosen-midi)>1)).slice(0,6).map(([midi])=>midi).sort((a,b)=>a-b);
    const recognized=recognizeChord(chroma,bassPc),label=recognized.label,duration=(performance.now()-capture.started)/1000;
    this.steps.push({id:crypto.randomUUID(),degree:label,label,rootPc:recognized.root,quality:recognized.quality,notes:notes.length?notes:[bassMidi,bassMidi+4,bassMidi+7],bassMidi,duration,audio:blob,mimeType:blob.type});
    $('studio-capture').textContent='● Записать следующий аккорд';$('studio-capture').classList.remove('recording');$('studio-state').textContent='ГОТОВ К НОВОМУ ШАГУ';$('studio-detected').textContent=`Зафиксирован ${label} · бас ${NOTE_NAMES[bassPc]}${Math.floor(bassMidi/12)-1}`;$('studio-capture-time').textContent=`${duration.toFixed(1)} с`;this.renderSteps();
  }
  toggleCapture(){return this.capture?this.stopCapture():this.startCapture();}
  addManualStep(audio=null){
    const quality='maj',rootPc=0,label=audio?.name?.replace(/\.[^.]+$/,'').trim()||'C';
    this.steps.push({id:crypto.randomUUID(),degree:label,label,rootPc,quality,notes:[48,52,55],bassMidi:48,duration:0,audio,mimeType:audio?.type||''});
    this.renderSteps();
  }
  async importRouteFile(file){
    $('studio-error').textContent=`Читаю ${file.name}…`;
    try{
      if(/\.(?:mid|midi)$/i.test(file.name)||/midi/.test(file.type))await this.importMidi(file);
      else if(/\.(?:xml|musicxml)$/i.test(file.name)||/xml/.test(file.type))await this.importMusicXml(file);
      else await this.importLongAudio(file);
      $('studio-error').textContent=`${file.name}: добавлено ${this.steps.length} шагов. Проверь цепочку и сохрани.`;
    }catch(error){$('studio-error').textContent=`Не удалось разобрать ${file.name}: ${error.message}`;}
  }
  async importLongAudio(file){
    const Context=window.AudioContext||window.webkitAudioContext,context=new Context();const buffer=await context.decodeAudioData(await file.arrayBuffer()),segments=splitAudio(buffer);this.steps=[];
    for(const [start,end] of segments){const found=analyzeSegment(buffer,start,end),audio=wavSlice(buffer,start,end);this.steps.push({id:crypto.randomUUID(),degree:found.label,label:found.label,rootPc:found.root,quality:found.quality,notes:found.notes,bassMidi:found.bassMidi,duration:end-start,audio,mimeType:'audio/wav'});}
    await context.close();this.renderSteps();if(!$('studio-name').value)$('studio-name').value=file.name.replace(/\.[^.]+$/,'');
  }
  async importMidi(file){
    const stem=file.name.replace(/\.(?:mid|midi)$/i,''),parsed=parseMidi(await file.arrayBuffer());
    // In the supplied Anime 3 take the first two simultaneities are accidental
    // keyboard input before the seven-chord route begins on Fm7.
    const chordGroups=/^anime\s+3$/i.test(stem.trim())&&parsed.chords.length===9?parsed.chords.slice(2):parsed.chords;
    this.steps=chordGroups.map(stepFromMidi);
    const match=stem.match(/^(.+?)\s+(\d+)$/);if(match){const folder=match[1].trim().toLowerCase().replace(/\s+tour$/,'');const option=[...$('studio-tour').options].find(item=>item.value===folder||item.textContent.toLowerCase()===`${folder} tour`);if(option)$('studio-tour').value=option.value;$('studio-number').value=String(Number(match[2])).padStart(2,'0');}
    $('studio-name').value=stem;this.renderSteps();
  }
  async importMusicXml(file){
    const xml=new DOMParser().parseFromString(await file.text(),'application/xml');if(xml.querySelector('parsererror'))throw Error('XML повреждён');const imported=[];
    for(const measure of xml.querySelectorAll('part:first-of-type > measure, score-partwise > part:first-of-type > measure')){
      const harmonies=[...measure.querySelectorAll(':scope > harmony')];
      if(harmonies.length){for(const harmony of harmonies){const step=harmony.querySelector('root-step')?.textContent?.trim()||'C',alter=Number(harmony.querySelector('root-alter')?.textContent||0),rootPc=pitchClass(step,alter),quality=musicXmlQuality(harmony.querySelector('kind')?.getAttribute('text')||harmony.querySelector('kind')?.textContent?.trim()),label=`${NOTE_NAMES[rootPc]}${quality==='maj'?'':quality}`,rootMidi=48+rootPc;imported.push({id:crypto.randomUUID(),degree:label,label,rootPc,quality,notes:qualityIntervals(quality).map(interval=>rootMidi+interval),bassMidi:rootMidi,duration:0,audio:null,mimeType:''});}continue;}
      const pcs=[...measure.querySelectorAll(':scope > note:not(:has(rest)) pitch')].map(pitch=>pitchClass(pitch.querySelector('step')?.textContent?.trim()||'C',pitch.querySelector('alter')?.textContent||0));if(!pcs.length)continue;const chroma=Array(12).fill(0);pcs.forEach(pc=>chroma[pc]++);const rootPc=pcs[0],found=recognizeChord(chroma,rootPc),label=`${NOTE_NAMES[found.root]}${found.quality==='maj'?'':found.quality}`,rootMidi=48+found.root;imported.push({id:crypto.randomUUID(),degree:label,label,rootPc:found.root,quality:found.quality,notes:qualityIntervals(found.quality).map(interval=>rootMidi+interval),bassMidi:rootMidi,duration:0,audio:null,mimeType:''});
    }
    if(!imported.length)throw Error('не найдено ни harmony symbols, ни нот по тактам');this.steps=imported;this.renderSteps();if(!$('studio-name').value)$('studio-name').value=file.name.replace(/\.(?:musicxml|xml)$/i,'');
  }
  renderSteps(){
    $('studio-steps').replaceChildren(...this.steps.map((step,index)=>{
      const row=document.createElement('li');row.className='studio-step';
      const number=document.createElement('span');number.textContent=String(index+1).padStart(2,'0');
      const root=document.createElement('select');root.className='studio-root';root.setAttribute('aria-label',`Корень аккорда ${index+1}`);root.replaceChildren(...NOTE_NAMES.map((name,pc)=>{const option=document.createElement('option');option.value=String(pc);option.textContent=name;option.selected=pc===step.rootPc;return option;}));
      const quality=document.createElement('select');quality.className='studio-quality';quality.setAttribute('aria-label',`Тип аккорда ${index+1}`);quality.replaceChildren(...CHORDS.map(([name])=>{const option=document.createElement('option');option.value=name;option.textContent=name;option.selected=name===step.quality;return option;}));
      const input=document.createElement('input');input.value=step.label;input.setAttribute('aria-label',`Название аккорда ${index+1}`);input.addEventListener('change',()=>{step.label=input.value.trim()||step.degree;step.degree=step.label;});
      const syncLabel=()=>{step.rootPc=Number(root.value);step.quality=quality.value;step.bassMidi=48+step.rootPc;step.label=`${NOTE_NAMES[step.rootPc]}${step.quality==='maj'?'':step.quality}`;step.degree=step.label;input.value=step.label;};root.addEventListener('change',syncLabel);quality.addEventListener('change',syncLabel);
      const meta=document.createElement('small');meta.textContent=`бас ${NOTE_NAMES[(step.bassMidi%12+12)%12]}${Math.floor(step.bassMidi/12)-1} · ${step.notes.map(midi=>NOTE_NAMES[(midi%12+12)%12]+(Math.floor(midi/12)-1)).join(' ')}`;
      const sound=document.createElement('label');sound.className=`studio-step-audio${step.audio?' attached':''}`;sound.textContent=step.audio?'♫':'＋ звук';const file=document.createElement('input');file.type='file';file.accept='audio/*';file.addEventListener('change',()=>{const picked=file.files?.[0];if(!picked)return;step.audio=picked;step.mimeType=picked.type;step.duration=0;this.renderSteps();});sound.append(file);
      const listen=document.createElement('button');listen.textContent='▶';listen.title=step.audio?'Прослушать файл':'Сначала прикрепи звук';listen.disabled=!step.audio;listen.addEventListener('click',()=>{if(!step.audio)return;const url=URL.createObjectURL(step.audio),audio=new Audio(url);audio.onended=()=>URL.revokeObjectURL(url);audio.play();});
      const remove=document.createElement('button');remove.textContent='×';remove.title='Удалить';remove.addEventListener('click',()=>{this.steps.splice(index,1);this.renderSteps();});
      row.append(number,root,quality,input,sound,listen,remove,meta);return row;
    }));
    $('studio-count').textContent=`${this.steps.length} ${this.steps.length===1?'аккорд':'аккорда'}`;$('studio-save').disabled=this.steps.length<2;
  }
  async save(){
    const name=$('studio-name').value.trim()||`Маршрут ${this.routes.length+1}`,number=$('studio-number').value.trim()||String(this.routes.length+1).padStart(2,'0'),tour=$('studio-tour')?.value||'reharm';
    const baseRoot=this.steps[0].rootPc;
    const route={id:`user-${crypto.randomUUID()}`,name,number,tour,created:new Date().toISOString(),source:`${TOURS.find(([id])=>id===tour)?.[1]||'Reharm Tour'} · маршрут ${number}`,baseTonic:baseRoot,sequence:this.steps.map(step=>({...step,degree:step.label,offset:(step.rootPc-baseRoot+12)%12})),distractors:[]};
    await databaseAction('readwrite',store=>store.put(route));this.steps=[];this.renderSteps();$('studio-name').value='';$('studio-number').value='';await this.refresh();$('studio-error').textContent=`«${name}» сохранён.`;return route;
  }
  renderLibrary(){
    $('studio-library').replaceChildren(...TOURS.map(([tourId,tourName])=>{
      const folder=document.createElement('section');folder.className='library-folder';const routes=this.routes.filter(route=>(route.tour||'reharm')===tourId);
      const heading=document.createElement('header');heading.innerHTML=`<strong>${tourName}</strong><span>${routes.length}</span>`;folder.append(heading);
      for(const route of routes){
        const row=document.createElement('article');row.className='library-route';
        const text=document.createElement('div');text.innerHTML=`<small>МАРШРУТ ${route.number}</small><strong>${route.name}</strong><span>${route.sequence.length} аккордов</span>`;
        const use=document.createElement('button');use.textContent='В полёт';use.addEventListener('click',()=>{this.onUse?.(route);this.close();});
        row.append(text,use);if(!route.builtin){const remove=document.createElement('button');remove.textContent='×';remove.title='Удалить маршрут';remove.addEventListener('click',async()=>{await databaseAction('readwrite',store=>store.delete(route.id));this.refresh();});row.append(remove);}folder.append(row);
      }
      if(!routes.length){const empty=document.createElement('p');empty.textContent='Пока пусто';folder.append(empty);}return folder;
    }));
    $('studio-empty').hidden=this.routes.length>0;
  }
}

return {stepFromMidi,parseMidi,GardenSequenceStudio};
})();
const module_garden_life=(()=>{
const {GARDEN_ARRANGEMENTS,drawGardenArrangementFlower}=module_garden_arrangement;
const clamp=(value,min=0,max=100)=>Math.min(max,Math.max(min,value));
const modulo=(value,period)=>((value%period)+period)%period;

const GARDEN_RESOURCES=Object.freeze({
  fuel:{label:'FUEL',color:'#e8b85d'},water:{label:'H₂O',color:'#75e9ed'},
  crew:{label:'CREW',color:'#9ee08a'},hull:{label:'HULL',color:'#d8c4f5'}
});

const GARDEN_ITEMS=Object.freeze({
  restoration:{resource:'all',amount:100,restoration:true,sprite:null,label:'Колесо жизни · все запасы восстановлены',color:'#b8eee0',size:92,rare:true},
  shield:{resource:'inventory',amount:1,shield:true,sprite:'cocoon-shield',label:'Кокон · защита от трёх ударов камней',color:'#cbded8',size:70,artifact:true,rare:true},
  ...Object.fromEntries(Object.entries(GARDEN_ARRANGEMENTS).map(([kind,spec])=>[kind,{...spec,resource:'arrangement',sprite:null,size:80,arrangement:true,label:spec.label}])),
  arrangementBoost:{resource:'inventory',amount:1,assist:{answerKind:'degree',divisor:4,rounds:1},sprite:'hold-arpeggio-flower',visualFilter:'hue-rotate(72deg) saturate(.75) brightness(1.04)',label:'Аметист баса · оставить четверть вариантов · круг',color:'#a87aff',size:66,artifact:true,rare:true},
  fuel:{resource:'fuel',amount:10,sprite:'fuel-seed',label:'Энергетическое семя',color:'#e9b95e',size:68},
  water:{resource:'water',amount:9,sprite:'water-pearl',label:'Водяная жемчужина',color:'#75f4ef',size:62},
  crew:{resource:'crew',amount:8,sprite:'crew-berries',label:'Спелые ягоды',color:'#a7ec86',size:70},
  hull:{resource:'hull',amount:11,sprite:'repair-lotus',label:'Смола лотоса',color:'#dcc9ff',size:72},
  poison:{resource:'crew',amount:-8,hullAmount:-3,sprite:'poison-seed',label:'Ядовитое семя',color:'#ff716c',size:68,harmful:true},
  degreeReveal:{resource:'inventory',amount:1,assist:{answerKind:'degree',reveal:true},sprite:'arpeggio-flower',label:'Лунный цветок · открыть ступень текущей позиции',color:'#a9b6ec',size:72,artifact:true,rare:true},
  hold:{resource:'inventory',amount:1,repeat:true,sprite:'hold-flower',label:'Лотос бесконечности · удержать аккорд',color:'#b7ef86',size:33,artifact:true},
  qualityFocus:{resource:'inventory',amount:1,assist:{answerKind:'quality',divisor:2,steps:5},sprite:'root-flower',visualFilter:'saturate(.55) brightness(.94)',label:'Жемчужный бутон · половина вариантов аккорда · 5 ходов',color:'#d9c4a2',size:66,artifact:true,rare:true},
  holdArpeggio:{resource:'inventory',amount:1,assist:{answerKind:'degree',divisor:2,steps:3},sprite:'hold-arpeggio-flower',visualFilter:'hue-rotate(54deg) saturate(.50) brightness(.94)',label:'Сиреневая лоза · половина вариантов баса · 3 хода',color:'#d1b9ee',size:66,artifact:true,rare:true},
  midpoint:{resource:'inventory',amount:1,assist:{answerKind:'quality',divisor:4,rounds:1},sprite:'root-flower',visualFilter:'saturate(.84) brightness(1.03)',label:'Янтарный бутон · оставить четверть вариантов аккорда · круг',color:'#d9ad72',size:66,artifact:true,rare:true},
  focusRare:{resource:'inventory',amount:1,assist:{answerKind:'quality',divisor:4,rounds:2},sprite:'root-flower',visualFilter:'saturate(.94) brightness(1.10)',label:'Солнечный бутон · четверть вариантов аккорда · 2 круга',color:'#ecc285',size:68,artifact:true,rare:true},
  ...Object.fromEntries([-7,-5,-3,3,5,7].map(delta=>[`jump${delta<0?'Back':'Forward'}${Math.abs(delta)}`,{resource:'inventory',amount:2,navigationDelta:delta,sprite:null,label:`Прыжок ${delta>0?'+':'−'}${Math.abs(delta)} · два заряда`,color:'#abe5d4',size:48,artifact:true}])),
  crater:{resource:'hull',amount:-6,sprite:'crater',label:'Удар о кратер',color:'#ff7b5f',size:126,harmful:true,ground:true,damage:6},
  stoneAsteroid:{resource:'hull',amount:-5,sprite:'meteor-volcanic',label:'Каменный астероид',color:'#a8a595',size:70,harmful:true,asteroid:true,damage:5},
  porousAsteroid:{resource:'hull',amount:-3,sprite:'crater',label:'Пористый астероид',color:'#7b8d83',size:52,harmful:true,asteroid:true,damage:3},
  crystalAsteroid:{resource:'hull',amount:-8,sprite:'crater',label:'Кристаллический астероид',color:'#a997e8',size:82,harmful:true,asteroid:true,damage:8},
  lavaAsteroid:{resource:'hull',amount:-100,sprite:'meteor-volcanic',label:'Раскалённое лавовое ядро',color:'#ff5c25',size:94,harmful:true,asteroid:true,fatal:true},
  campSpore:{resource:'crew',amount:-1,waterAmount:-1,sprite:null,label:'Споры застоя',color:'#d49aff',size:92,harmful:true,pressure:true},
  storm:{resource:'hull',amount:-2,crewAmount:-1,sprite:null,label:'Ядро смерча',color:'#8fe7dd',size:164,harmful:true,storm:true}
});

// Shared botanical diagram in the sky, inventory and guide. A branching sprig
// marks bass choices; a radial corolla marks chord choices. Veins and nodes
// distinguish strength without covering the landscape with lettering.
function drawGardenLifeWheel(ctx,size,time,phase=0){
  const alpha=ctx.globalAlpha,pulse=.86+.14*Math.sin(time*1.8),colors=['#b6eae3','#c3b4ef','#e9d6a4','#a6dcbe'];
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=Math.max(.65,size*.0075);
  const orbit=(radius,count,speed,color,shape)=>{
    ctx.save();ctx.rotate(time*speed+phase);ctx.strokeStyle=color;ctx.fillStyle=color;ctx.globalAlpha=alpha*pulse*.72;
    ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);ctx.stroke();
    for(let i=0;i<count;i++){
      const a=i*Math.PI*2/count;ctx.save();ctx.rotate(a);
      if(shape==='bead'){ctx.globalAlpha=alpha*(.55+.32*Math.sin(time*1.4+i*.5)**2);ctx.beginPath();ctx.arc(radius,0,size*.012,0,Math.PI*2);ctx.stroke();}
      else if(shape==='tick'){ctx.beginPath();ctx.moveTo(radius-size*.015,0);ctx.lineTo(radius+size*.019,0);ctx.stroke();}
      else{ctx.beginPath();ctx.moveTo(radius-size*.05,0);ctx.bezierCurveTo(radius-size*.014,-size*.025,radius+size*.015,-size*.028,radius+size*.043,0);ctx.bezierCurveTo(radius+size*.014,size*.025,radius-size*.025,size*.024,radius-size*.05,0);ctx.stroke();}
      ctx.restore();
    }
    ctx.restore();
  };
  // Independently rotating circular linework, not one rotating painted disc.
  orbit(size*.46,36,.16,colors[0],'tick');
  orbit(size*.38,24,-.23,colors[1],'bead');
  orbit(size*.29,12,.32,colors[2],'leaf');
  orbit(size*.19,24,-.43,colors[0],'tick');
  orbit(size*.10,12,.53,colors[3],'bead');
  ctx.rotate(-time*.11+phase);ctx.strokeStyle=colors[2];ctx.globalAlpha=alpha*.38;ctx.lineWidth=Math.max(.6,size*.006);
  ctx.beginPath();for(let i=0;i<=96;i++){const a=i*Math.PI*2/96,r=size*(.425+Math.sin(a*12)*.012),x=Math.cos(a)*r,y=Math.sin(a)*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  for(let lamp=0;lamp<4;lamp++){ctx.fillStyle=Object.values(GARDEN_RESOURCES)[lamp].color;ctx.globalAlpha=alpha*(.58+.25*Math.sin(time*2-lamp)**2);const a=lamp*Math.PI/2+time*.24;ctx.beginPath();ctx.arc(Math.cos(a)*size*.048,Math.sin(a)*size*.048,size*.014,0,Math.PI*2);ctx.fill();}
  ctx.restore();
}
function drawGardenAssistGlyph(ctx,item,size){
  const bass=item.assist.answerKind==='degree',strong=item.assist.divisor===4,alpha=ctx.globalAlpha;
  ctx.save();ctx.strokeStyle=item.color;ctx.fillStyle=item.color;ctx.shadowColor=item.color;ctx.shadowBlur=Math.min(2,size*.025);ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=Math.max(.65,size*.012);ctx.globalAlpha=alpha*(strong?.64:.48);
  const leaf=(x,y,angle,length,width)=>{
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-width,-length*.23,-width*.92,-length*.74,0,-length);ctx.bezierCurveTo(width*.92,-length*.74,width,-length*.23,0,0);ctx.stroke();
    ctx.globalAlpha*=.58;ctx.lineWidth*=.72;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(width*.07,-length*.5,0,-length);
    for(let vein=1;vein<=3;vein++){const t=vein/4,vy=-length*t,vw=width*Math.sin(t*Math.PI)*.78;ctx.moveTo(0,vy);ctx.quadraticCurveTo(-vw*.55,vy-length*.055,-vw,vy-length*.14);ctx.moveTo(0,vy);ctx.quadraticCurveTo(vw*.55,vy-length*.055,vw,vy-length*.14);}
    ctx.stroke();ctx.restore();
  };
  if(bass){
    ctx.beginPath();ctx.moveTo(0,size*.32);ctx.bezierCurveTo(-size*.04,size*.08,size*.035,-size*.12,0,-size*.32);ctx.stroke();
    leaf(0,-size*.09,0,size*.31,size*.1);
    for(const side of [-1,1]){leaf(0,size*.13,side*.86,size*.32,size*.078);leaf(0,-size*.02,side*.65,size*.29,size*.071);if(strong)leaf(0,size*.23,side*1.12,size*.24,size*.058);}
    ctx.globalAlpha=alpha*.23;ctx.beginPath();ctx.moveTo(0,size*.31);ctx.quadraticCurveTo(-size*.09,size*.34,-size*.13,size*.39);ctx.moveTo(0,size*.31);ctx.quadraticCurveTo(size*.07,size*.34,size*.12,size*.38);ctx.stroke();
  }else{
    for(let petal=0;petal<6;petal++)leaf(0,0,petal*Math.PI/3,size*.39,size*.075);
    if(strong)for(let petal=0;petal<6;petal++)leaf(0,0,petal*Math.PI/3+Math.PI/6,size*.25,size*.046);
    ctx.beginPath();ctx.arc(0,0,size*.045,0,Math.PI*2);ctx.stroke();
  }
  ctx.shadowBlur=0;ctx.globalAlpha=alpha*(strong?.7:.52);
  const nodes=strong?2:1;for(let node=0;node<nodes;node++){ctx.beginPath();ctx.arc((node-(nodes-1)/2)*size*.1,size*.43,Math.max(.85,size*.018),0,Math.PI*2);ctx.fill();}
  if(item.assist.rounds===2){ctx.globalAlpha=alpha*.31;ctx.lineWidth=Math.max(.6,size*.009);for(const side of [-1,1]){ctx.beginPath();ctx.arc(0,0,size*.46,side<0?Math.PI*.64:Math.PI*1.64,side<0?Math.PI*1.36:Math.PI*2.36);ctx.stroke();}}
  ctx.restore();
}

const weightedItem=(resources,random)=>{
  const entries=Object.entries(GARDEN_ITEMS).filter(([,item])=>!item.ground&&!item.storm&&!item.asteroid&&!item.pressure&&!item.arrangement&&!item.rare).map(([kind,item])=>{
    const value=resources[item.resource]??100,need=item.navigationDelta?.11:item.artifact?.22:item.harmful?.3:1+Math.max(0,76-value)/15+(value<30?4:0);
    return {kind,weight:need};
  });
  let cursor=random()*entries.reduce((sum,item)=>sum+item.weight,0);
  return entries.find(item=>(cursor-=item.weight)<=0)?.kind??'water';
};

const announce=(owner,entity)=>{
  const item=entity.item;
  owner.event={id:++owner.eventCounter,kind:entity.kind,label:item.arrangement?`${item.label} · ${entity.rounds} кр.`:item.label,harmful:Boolean(item.harmful),resource:item.artifact?'artifact':item.resource};
  owner.eventAge=0;owner.effects.push({x:entity.x,y:entity.y,age:0,color:item.color,harmful:Boolean(item.harmful)});
};

class GardenLife{
  constructor({random=Math.random,onArrangement}={}){
    this.random=random;this.onArrangement=onArrangement;this.images={};this.reset();
    this.ambient=Array.from({length:22},(_,index)=>({x:random(),y:random(),phase:random()*Math.PI*2,size:3+random()*8,speed:.012+random()*.026,spin:(random()-.5)*.42,tint:index%4}));
  }
  reset(){
    this.restorationAppeared=false;this.restorationRescueChecked=false;
    this.shieldHits=0;this.shieldFlash=0;this.shieldFade=0;
    this.time=0;this.spawnClock=1.4;this.craterClock=3.4;this.asteroidClock=6.5;this.stormClock=8.5;this.gameOver=false;
    this.arrangementClock=5;this.arrangementOrder=0;this.assistClock=30+this.random()*25;
    this.entities=[];this.effects=[];this.chips=[];this.event=null;this.eventAge=99;this.eventCounter=0;this.flightForce={x:0,y:0,intensity:0};this.impact=0;
    this.campIdle=0;this.campPressure=null;this.lastShip=null;this.critical=null;this.failureResource=null;
    this.resources={fuel:86,water:78,crew:92,hull:84};this.inventory=Object.fromEntries(Object.entries(GARDEN_ITEMS).filter(([,item])=>item.artifact).map(([kind])=>[kind,0]));
  }
  setImages(images){this.images={...images};}
  setResource(name,value){if(name in this.resources)this.resources[name]=clamp(value);}
  wrongAnswer(kind,value,qualityOrder=[]){
    if(this.gameOver)return;
    const resource=kind==='degree'?(Number(value)<6?'fuel':'water'):(qualityOrder.indexOf(value)%2===0?'crew':'hull');
    this.resources[resource]=Math.max(this.difficulty?.minResource||0,clamp(this.resources[resource]-(this.difficulty?.wrongDamage??3)));
    announce(this,{kind:'wrongAnswer',item:{resource,label:`Ошибка · ${GARDEN_RESOURCES[resource].label} −3`,harmful:true,color:GARDEN_RESOURCES[resource].color},x:.5,y:.55});
    this.updateCritical(0);
  }
  getFlightForce(){return {...this.flightForce};}
  consumeArtifact(kind){if(!(kind in this.inventory)||this.inventory[kind]<1)return false;this.inventory[kind]-=1;return true;}
  useShield(mission,kind='shield'){
    const state=mission.snapshot();
    if(!GARDEN_ITEMS[kind]?.shield||!state.running||state.complete||state.cursor<0||this.shieldHits>0||!this.consumeArtifact(kind))return {ignored:true};
    this.shieldHits=3;this.shieldFlash=.15;this.shieldFade=1;
    announce(this,{kind:'shield',item:{resource:'artifact',label:'Кокон раскрыт',color:GARDEN_ITEMS.shield.color},x:.5,y:.56});
    return {shield:true,hits:3};
  }
  useJump(mission,kind){
    const delta=GARDEN_ITEMS[kind]?.navigationDelta;
    if(!Number.isInteger(delta))return {ignored:true};
    return mission.shift(delta,{consume:()=>this.consumeArtifact(kind)});
  }
  useAssist(mission,kind){const spec=GARDEN_ITEMS[kind]?.assist;if(!spec)return {ignored:true};return mission.assist(spec,{consume:()=>this.consumeArtifact(kind)});}
  useRepeat(mission,kind='hold'){
    const state=mission.snapshot();
    if(!GARDEN_ITEMS[kind]?.repeat||!state.running||state.complete||state.cursor<0)return {ignored:true};
    if(state.held){mission.continue();return {held:false};}
    if(!this.consumeArtifact(kind))return {ignored:true};
    return mission.hold();
  }
  forceSpawn(kind='water',overrides={}){
    const item=GARDEN_ITEMS[kind]??GARDEN_ITEMS.water,edge=!item.ground&&!item.storm&&this.random()<.28,fromLeft=this.random()<.5;
    const entity={id:`${kind}-${this.time.toFixed(3)}-${this.random().toFixed(6)}`,kind,item,
      x:item.storm?(fromLeft?-.13:1.13):item.ground?.18+this.random()*.64:edge?(this.random()<.5?-.08:1.08):.17+this.random()*.66,
      y:item.storm?.2+this.random()*.3:item.ground?-.12:edge?.16+this.random()*.32:-.10,
      vx:item.storm?(fromLeft?.055+this.random()*.025:-.055-this.random()*.025):item.ground?0:edge?(this.random()<.5?.065:-.065):(this.random()-.5)*.025,
      vy:item.ground?.05+this.random()*.018:item.storm?.01:.052+this.random()*.036,angle:this.random()*Math.PI*2,
      spin:item.storm?(fromLeft?1:-1)*(.42+this.random()*.28):(this.random()-.5)*(item.artifact?1.2:item.harmful?.8:.42),phase:this.random()*Math.PI*2,
      age:0,rounds:item.arrangement?1+Math.floor(this.random()*3):0,scale:item.ground?.78+this.random()*.34:item.storm?.82+this.random()*.28:.82+this.random()*.3,
      collected:false,triggered:false,impactArmed:true,lastDamage:-999,baseY:item.storm?.2+this.random()*.3:0,...overrides};
    if(item.fatal){entity.x=Math.max(.18,Math.min(.82,entity.x));entity.vx=0;}
    if(item.asteroid&&!item.fatal){const resource=overrides.damageResource??['fuel','water','crew','hull'][Math.floor(this.random()*4)];entity.item={...item,resource,color:GARDEN_RESOURCES[resource].color,label:`${item.label} · ${GARDEN_RESOURCES[resource].label}`,damageResource:resource};}
    if(item.storm&&overrides.y!==undefined)entity.baseY=overrides.y;
    if(!item.ground&&!item.storm)for(let attempt=0;attempt<8;attempt++){
      const crowded=this.entities.some(other=>!other.item.ground&&!other.item.storm&&Math.hypot(other.x-entity.x,other.y-entity.y)<.16);
      if(!crowded)break;entity.x=.17+this.random()*.66;entity.y=-.08-this.random()*.1;
    }
    if(this.difficulty?.minResource&&(item.navigationDelta||item.fatal||item.storm||item.assist)){entity.collected=true;return entity;}
    this.entities.push(entity);return entity;
  }
  applyDamage(entity,{repeat=false}={}){
    if(!entity||entity.collected||(!repeat&&entity.triggered))return false;
    entity.triggered=true;entity.lastDamage=this.time;const item=entity.item;
    this.resources[item.resource]=clamp(this.resources[item.resource]+item.amount);
    if(item.hullAmount)this.resources.hull=clamp(this.resources.hull+item.hullAmount);
    if(item.crewAmount)this.resources.crew=clamp(this.resources.crew+item.crewAmount);
    announce(this,entity);return true;
  }
  collect(entity){
    if(!entity||entity.collected)return false;
    if(entity.item.restoration&&this.gameOver)return false;
    if(entity.item.ground||entity.item.storm)return this.applyDamage(entity,{repeat:entity.item.storm});
    entity.collected=true;const item=entity.item;
    if(item.fatal)this.gameOver=true;
    if(item.restoration){for(const resource of Object.keys(this.resources))this.resources[resource]=100;this.critical=null;this.failureResource=null;}
    else if(item.arrangement)this.onArrangement?.(entity.kind,entity.rounds);
    else if(item.artifact)this.inventory[entity.kind]=Math.min(99,(this.inventory[entity.kind]||0)+item.amount);
    else{this.resources[item.resource]=clamp(this.resources[item.resource]+item.amount);if(item.hullAmount)this.resources.hull=clamp(this.resources.hull+item.hullAmount);}
    announce(this,entity);return true;
  }
  asteroidImpact(entity,view,w,h){
    if(!entity||!entity.impactArmed||this.time-entity.lastDamage<2.5)return false;
    const sx=Number(view.x)||w*.5,sy=Number(view.y)||h*.56,dx=entity.x*w-sx,dy=entity.y*h-sy,distance=Math.hypot(dx,dy)||1,item=entity.item;
    entity.triggered=true;entity.impactArmed=false;entity.lastDamage=this.time;
    const protectedHit=!item.fatal&&this.shieldHits>0;
    if(protectedHit){this.shieldHits-=1;this.shieldFlash=1;}
    if(item.fatal){this.resources.hull=0;this.gameOver=true;this.failureResource='lava';}
    else if(!protectedHit){
      const damage=(item.damage??Math.abs(item.amount||8))*1.15,resource=item.damageResource??'hull';
      this.resources[resource]=clamp(this.resources[resource]-damage);
      for(const secondary of ['crew','fuel'])if(secondary!==resource)this.resources[secondary]=clamp(this.resources[secondary]-Math.max(1,(item.damage??8)*(secondary==='crew'?.12:.08))*1.15);
    }
    const severity=item.fatal?1:clamp((item.damage??8)/28,.24,.9),awayX=-dx/distance,awayY=-dy/distance;
    this.flightForce.x+=awayX*(.34+severity*.38);this.flightForce.y+=awayY*(.28+severity*.32);this.flightForce.intensity=Math.max(this.flightForce.intensity,severity);
    entity.vx-=awayX*(.08+severity*.06);entity.vy-=awayY*(.06+severity*.05);entity.spin+=(this.random()-.5)*(2.2+severity*3);
    this.impact=Math.max(this.impact,Math.max(.68,severity));
    for(let i=0;i<8+Math.round(severity*10);i++){const angle=Math.PI*2*this.random();this.chips.push({x:entity.x,y:entity.y,vx:Math.cos(angle)*(.035+this.random()*.09),vy:Math.sin(angle)*(.035+this.random()*.09),age:0,life:.42+this.random()*.58,size:1+this.random()*3,color:item.color});}
    announce(this,protectedHit?{...entity,item:{...item,resource:'artifact',label:'Кокон погасил удар',harmful:false,color:'#cbded8'}}:entity);return true;
  }
  updateCampPressure(dt,view,w,h,sx,sy){
    const current={x:sx/w,y:sy/h},moving=this.lastShip&&Math.hypot(current.x-this.lastShip.x,current.y-this.lastShip.y)>.0035;
    this.lastShip=current;
    if(!view.active||!view.answering||view.ship===2){this.campIdle=0;this.campPressure=null;return;}
    if(moving)this.campIdle=Math.max(0,this.campIdle-dt*5);else this.campIdle+=dt*(current.x<.16||current.x>.84||current.y<.24||current.y>.76?1.55:1);
    if(!this.campPressure&&this.campIdle>15)this.campPressure={x:current.x,y:current.y,age:0,lastDamage:-99};
    const pressure=this.campPressure;if(!pressure)return;
    pressure.age+=dt;const distance=Math.hypot((current.x-pressure.x)*w,(current.y-pressure.y)*h);
    if(distance>78){this.campPressure=null;this.campIdle=0;return;}
    if(pressure.age>3&&this.time-pressure.lastDamage>7){pressure.lastDamage=this.time;const item=GARDEN_ITEMS.campSpore;this.resources.crew=clamp(this.resources.crew+item.amount);this.resources.water=clamp(this.resources.water+item.waterAmount);announce(this,{kind:'campSpore',item,x:pressure.x,y:pressure.y});}
  }
  updateCritical(dt){
    const empty=Object.keys(this.resources).find(name=>this.resources[name]<=0);
    if(!empty){this.critical=null;return;}
    if(!this.critical||this.critical.resource!==empty)this.critical={resource:empty,age:0};else this.critical.age+=dt;
    if(this.critical.age>=3.5){this.gameOver=true;this.failureResource=empty;}
  }
  maybeSpawnRestoration(dt,view){
    if(this.restorationAppeared||this.gameOver||!view.active||!view.answering||this.time<12)return null;
    const finishing=Number.isInteger(view.remainingChords)&&view.remainingChords>0&&view.remainingChords<=3;
    const critical=Math.min(...Object.values(this.resources))<=18;
    let spawn=false;
    if(finishing&&critical&&!this.restorationRescueChecked){
      // One rescue lottery per flight, not a fresh chance on every frame.
      this.restorationRescueChecked=true;spawn=this.random()<.35;
    }else if(this.time>60)spawn=this.random()<1-Math.exp(-dt/1200);
    if(!spawn)return null;
    this.restorationAppeared=true;
    const x=clamp((Number(view.x)||view.width*.5)/Math.max(1,view.width)+.12,.18,.82);
    const y=finishing&&critical?clamp((Number(view.y)||view.height*.56)/Math.max(1,view.height)-.17,.12,.64):-.08;
    const entity=this.forceSpawn('restoration',{x,y,vx:0,vy:.055,scale:1,spin:.18});
    // Keep the rescue reachable; crowd avoidance must not move it off-screen.
    entity.x=x;entity.y=y;return entity;
  }
  update(dt,view={}){
    if(dt&&!view.paused&&view.active!==false&&view.flying!==false&&!this.gameOver){this.shieldFlash=Math.max(0,this.shieldFlash-dt*1.6);this.shieldFade=clamp(this.shieldFade+(this.shieldHits>0?dt*2:-dt*1.8),0,1);}
    this.flightForce={x:0,y:0,intensity:0};if(!dt||view.paused||view.active===false||view.flying===false||this.gameOver)return;
    this.impact=Math.max(0,this.impact-dt*2.8);
    this.time+=dt;this.eventAge+=dt;const speed=Number(view.speed)||0,profile=this.difficulty||{drain:1,spawnRate:1,minResource:0};
    this.maybeSpawnRestoration(dt,view);
    for(const resource of ['fuel','water','crew','hull'])this.resources[resource]=Math.max(profile.minResource,clamp(this.resources[resource]-dt*({fuel:.32,water:.22,crew:.14,hull:.1}[resource])*profile.drain));
    dt*=profile.spawnRate;
    if(view.active){this.resources.fuel=clamp(this.resources.fuel-dt*(.06+speed*.04));this.resources.water=clamp(this.resources.water-dt*(.03+speed*.01));this.resources.crew=clamp(this.resources.crew-dt*(.008+Math.max(0,18-this.resources.water)*.002));if(this.resources.fuel<6)this.resources.hull=clamp(this.resources.hull-dt*(6-this.resources.fuel)*.01);}
    this.spawnClock-=dt;this.craterClock-=dt;this.asteroidClock-=dt;this.stormClock-=dt;this.assistClock-=dt;
    if(view.active)this.arrangementClock-=dt;
    const pickupCount=this.entities.filter(entity=>!entity.item.ground&&!entity.item.storm&&!entity.item.asteroid).length;
    if(this.assistClock<=0&&pickupCount<6){
      const roll=this.random(),kinds=Object.keys(GARDEN_ITEMS).filter(kind=>GARDEN_ITEMS[kind].assist&&!GARDEN_ITEMS[kind].assist.reveal&&kind!=='focusRare');
      const kind=roll<.03?'focusRare':roll<.1?'shield':roll<.28&&view.routeLength>=8?'degreeReveal':kinds[Math.floor(this.random()*kinds.length)];
      const x=.22+this.random()*.56,y=-.10;
      this.forceSpawn(this.random()<.28?'lavaAsteroid':'stoneAsteroid',{x:x-.075,y:y+.03,scale:.6,vy:.085,vx:0});
      const pickup=this.forceSpawn(kind,{x:x+.075,y:y-.055,scale:.78,vy:.085,vx:0});pickup.x=x+.075;pickup.y=y-.055;
      this.assistClock=40+this.random()*35;
    }
    if(this.arrangementClock<=0&&pickupCount<6){const styles=Object.keys(GARDEN_ARRANGEMENTS),kind=styles[this.arrangementOrder++%styles.length];this.forceSpawn(kind);this.arrangementClock=12+this.random()*8;}
    if(this.spawnClock<=0&&pickupCount<6){this.forceSpawn(weightedItem(this.resources,this.random));this.spawnClock=4.7+this.random()*3.8;}
    if(this.craterClock<=0&&this.entities.filter(entity=>entity.item.ground).length<2){this.forceSpawn('crater');this.craterClock=16+this.random()*10;}
    if(this.asteroidClock<=0&&this.entities.filter(entity=>entity.item.asteroid).length<2){const roll=this.random(),kind=roll<.09?'lavaAsteroid':roll<.30?'crystalAsteroid':roll<.62?'porousAsteroid':'stoneAsteroid';this.forceSpawn(kind,{scale:kind==='lavaAsteroid'?.45+this.random()*.22:.58+this.random()*1.25,shapeSeed:this.random()});this.asteroidClock=11+this.random()*9;}
    if(this.stormClock<=0&&!this.entities.some(entity=>entity.item.storm)){this.forceSpawn('storm');this.stormClock=40+this.random()*20;}
    const w=Math.max(1,Number(view.width)||1),h=Math.max(1,Number(view.height)||1),sx=Number(view.x)||w*.5,sy=Number(view.y)||h*.56;
    this.updateCampPressure(dt,view,w,h,sx,sy);
    for(const entity of this.entities){
      entity.age+=dt;
      if(entity.item.storm){
        entity.baseY+=(entity.vy+speed*.012)*dt;entity.x+=entity.vx*dt;
        entity.y=entity.baseY+Math.sin(entity.age*.58+entity.phase)*.085+Math.sin(entity.age*.19+entity.phase*1.7)*.03;entity.angle+=entity.spin*dt;
        const dx=entity.x*w-sx,dy=entity.y*h-sy,distance=Math.hypot(dx,dy)||1,influence=entity.item.size*entity.scale*1.05+105;
        if(view.active&&view.ship!==2&&distance<influence){const strength=(1-distance/influence)**1.45;this.flightForce.x+=dx/distance*strength*.075;this.flightForce.y+=dy/distance*strength*.06;this.flightForce.intensity=Math.max(this.flightForce.intensity,strength*.5);this.resources.fuel=clamp(this.resources.fuel-dt*strength*.22);if(distance<entity.item.size*entity.scale*.2+22&&this.time-entity.lastDamage>2.5)this.applyDamage(entity,{repeat:true});}
        continue;
      }
      if(entity.item.ground){entity.vy+=(.05+speed*.06-entity.vy)*(1-Math.exp(-dt*.9));entity.y+=entity.vy*dt;entity.angle+=Math.sin(entity.phase)*dt*.012;continue;}
      const seed=entity.phase+this.time*.22+entity.y*10.4,flow=Math.sin(seed)*.031+Math.cos(seed*.47+entity.x*8)*.015;
      const targetVx=entity.item.fatal?0:flow+(entity.kind==='poison'?Math.sin(this.time*.7+entity.phase)*.012:0);entity.vx=entity.item.fatal?0:entity.vx+(targetVx-entity.vx)*(1-Math.exp(-dt*1.2));entity.vy+=((entity.item.asteroid?.074:.052)+speed*.055-entity.vy)*(1-Math.exp(-dt*.75));entity.x+=entity.vx*dt;entity.y+=entity.vy*dt;entity.angle+=entity.spin*dt+Math.sin(seed*.63)*dt*.08;
      // Recover lateral entrants and reflect drift before leaving the reachable field.
      if(!entity.item.fatal){const margin=Math.min(.23,entity.item.size*entity.scale/w*.5+.10);if(entity.x<margin){entity.x+=(margin-entity.x)*Math.min(1,dt*1.5);entity.vx=Math.abs(entity.vx)+.015;}else if(entity.x>1-margin){entity.x-=(entity.x-1+margin)*Math.min(1,dt*1.5);entity.vx=-Math.abs(entity.vx)-.015;}}
    }
    const floaters=this.entities.filter(entity=>!entity.item.ground&&!entity.item.storm);
    for(let i=0;i<floaters.length;i++)for(let j=i+1;j<floaters.length;j++){const a=floaters[i],b=floaters[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||.001,min=.095;if(d<min){const force=(min-d)*.26/d;a.vx-=dx*force;b.vx+=dx*force;a.vy-=dy*force*.28;b.vy+=dy*force*.28;if(a.item.asteroid&&b.item.asteroid&&this.time-(a.lastCollision??-99)>1.1){a.lastCollision=b.lastCollision=this.time;for(let chip=0;chip<5;chip++){const angle=this.random()*Math.PI*2;this.chips.push({x:(a.x+b.x)/2,y:(a.y+b.y)/2,vx:Math.cos(angle)*(.025+this.random()*.05),vy:Math.sin(angle)*(.025+this.random()*.05),age:0,life:.35+this.random()*.45,size:1+this.random()*2,color:'#c7c1a8'});}}}}
    if((view.active||view.flying)&&view.ship!==2)for(const entity of this.entities){if(entity.item.storm)continue;const dx=entity.x*w-sx,dy=entity.y*h-sy,distance=Math.hypot(dx,dy),radius=entity.item.size*entity.scale*(entity.item.ground?.38:entity.item.asteroid?.38:.44)+(entity.item.ground?24:entity.item.asteroid?25:34);if(distance<radius){if(entity.item.asteroid||entity.item.ground)this.asteroidImpact(entity,view,w,h);else this.collect(entity);}else if((entity.item.asteroid||entity.item.ground)&&distance>radius+25)entity.impactArmed=true;}
    this.entities=this.entities.filter(entity=>!entity.collected&&entity.y<1.18&&entity.x>-.24&&entity.x<1.24);
    for(const effect of this.effects)effect.age+=dt;this.effects=this.effects.filter(effect=>effect.age<1.15);
    for(const chip of this.chips){chip.age+=dt;chip.x+=chip.vx*dt;chip.y+=chip.vy*dt;chip.vy+=.045*dt;}this.chips=this.chips.filter(chip=>chip.age<chip.life);
    for(const petal of this.ambient){const flow=Math.sin(this.time*.18+petal.phase+petal.y*9)*.008;petal.x+=flow*dt;petal.y+=(petal.speed+speed*.015)*dt;petal.phase+=petal.spin*dt;if(petal.y>1.08){petal.y=-.06;petal.x=this.random();}if(petal.x<-.05)petal.x=1.05;if(petal.x>1.05)petal.x=-.05;}
    if(profile.minResource){for(const key of Object.keys(this.resources))this.resources[key]=Math.max(profile.minResource,this.resources[key]);this.gameOver=false;this.critical=null;}
    this.updateCritical(dt);
  }
  drawStorm(ctx,entity,x,y,size,night){
    const fade=Math.min(1,entity.age*.85)*clamp((1.18-entity.y)/.18,0,1)*clamp((entity.x+.24)/.16,0,1)*clamp((1.24-entity.x)/.16,0,1),alpha=ctx.globalAlpha*fade,height=size*1.45;
    ctx.save();ctx.translate(x,y);ctx.lineCap='round';ctx.lineJoin='round';ctx.shadowBlur=0;
    // Every strand and leaf shares the same axis, from the narrow lower tip
    // to the open crown. No filled silhouette sits behind the filaments.
    for(let flow=0;flow<6;flow++){
      let previous=null;
      for(let segment=0;segment<=44;segment++){
        const t=segment/44,turn=entity.phase+flow*Math.PI/3+entity.age*(.8+flow*.018)+t*9.8,radius=size*(.014+Math.pow(t,1.65)*.46),point={x:Math.cos(turn)*radius,y:height*(.50-t)+Math.sin(turn*.8)*size*.012};
        if(previous){const shimmer=.32+.68*(.5+.5*Math.sin(t*27-entity.age*2.8+flow));ctx.globalAlpha=alpha*Math.sin(t*Math.PI)*(.28+night*.04+shimmer*.38);ctx.strokeStyle=flow%3===0?'#ede2b3':'#b9f5e2';ctx.lineWidth=Math.max(.55,size*.004)*(.55+t*.45);ctx.beginPath();ctx.moveTo(previous.x,previous.y);ctx.lineTo(point.x,point.y);ctx.stroke();if(segment%8===flow%8){ctx.globalAlpha=alpha*Math.sin(t*Math.PI)*(.4+shimmer*.45);ctx.fillStyle='#dcfff2';ctx.beginPath();ctx.arc(point.x,point.y,.9+shimmer*.4,0,Math.PI*2);ctx.fill();}}
        previous=point;
      }
    }
    for(let leaf=0;leaf<24;leaf++){
      const t=modulo(leaf/24+entity.age*.016,1),turn=entity.phase+leaf*2.399+entity.age*(.95+(leaf%3)*.08),radius=size*(.024+t*t*.46),yy=height*(.50-t)+Math.sin(turn*1.7)*size*.025;
      ctx.save();ctx.translate(Math.cos(turn)*radius,yy);ctx.rotate(turn*.45);ctx.globalAlpha=alpha*Math.sin(t*Math.PI)*(.17+night*.05);ctx.fillStyle=leaf%5===0?'#d8c394':'#afd7c4';ctx.beginPath();ctx.ellipse(0,0,size*(.007+t*.014),size*(.003+t*.005),0,0,Math.PI*2);ctx.fill();ctx.restore();
    }
    for(let spark=0;spark<10;spark++){
      const t=modulo(spark/10+entity.age*.024,1),turn=entity.phase+spark*2.399+entity.age*.67,radius=size*(.018+t*t*.40);ctx.globalAlpha=alpha*Math.sin(t*Math.PI)*(.21+Math.sin(entity.age*1.6+spark)*.07);ctx.fillStyle='#dce8cc';ctx.beginPath();ctx.arc(Math.cos(turn)*radius,height*(.50-t),Math.max(.5,size*.004),0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }
  drawAsteroid(ctx,entity,size){ctx.save();const lava=entity.kind==='lavaAsteroid',crystal=entity.kind==='crystalAsteroid',porous=entity.kind==='porousAsteroid',points=crystal?8:11,seed=entity.shapeSeed??entity.phase;ctx.beginPath();for(let i=0;i<points;i++){const a=i/points*Math.PI*2,r=size*(.36+(Math.sin(seed*29+i*7.13)+1)*.055+(crystal&&i%2?-.1:.05));const px=Math.cos(a)*r,py=Math.sin(a)*r*(.82+Math.sin(seed*9)*.08);i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();const g=ctx.createRadialGradient(-size*.12,-size*.15,2,0,0,size*.48);if(lava){g.addColorStop(0,'#ffe16a');g.addColorStop(.22,'#ff6a24');g.addColorStop(.58,'#7e1f12');g.addColorStop(1,'#170a09');}else if(crystal){g.addColorStop(0,'#d8d2ff');g.addColorStop(.35,'#7468a5');g.addColorStop(1,'#252838');}else{g.addColorStop(0,porous?'#87958b':'#aaa999');g.addColorStop(.45,porous?'#4b5d54':'#62635d');g.addColorStop(1,'#252927');}ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=lava?'rgba(255,173,73,.8)':crystal?'rgba(205,194,255,.65)':'rgba(205,213,196,.25)';ctx.lineWidth=crystal?2:1;ctx.stroke();for(let i=0;i<(porous?9:lava?6:4);i++){const a=seed*11+i*2.37,r=size*(.08+(i%4)*.055),cx=Math.cos(a)*r,cy=Math.sin(a)*r*.7;ctx.fillStyle=lava?'rgba(255,202,79,.72)':'rgba(11,17,16,.36)';ctx.beginPath();ctx.ellipse(cx,cy,size*(.018+(i%3)*.009),size*(.012+(i%2)*.011),a,0,Math.PI*2);ctx.fill();}if(lava){ctx.shadowColor='#ff4d18';ctx.shadowBlur=size*.28;ctx.stroke();}ctx.restore();}
  draw(ctx,view={}){
    const w=Math.max(1,Number(view.width)||1),h=Math.max(1,Number(view.height)||1),night=Number(view.night)||0;ctx.save();ctx.globalCompositeOperation='source-over';
    if(this.shieldFade>0&&view.ship!==2){
      const x=view.x??w*.5,y=view.y??h*.56,r=Math.min(190,Math.max(110,w*.22))*(view.ship===1?1.35:1)*.59,pulse=1+Math.sin(this.time*1.2)*.012;
      ctx.save();ctx.translate(x,y);ctx.scale(pulse,pulse*1.12);ctx.globalAlpha=this.shieldFade;
      const skin=ctx.createRadialGradient(-r*.23,-r*.35,r*.05,0,0,r);skin.addColorStop(0,'rgba(216,234,245,.035)');skin.addColorStop(.78,'rgba(165,212,223,.006)');skin.addColorStop(1,`rgba(203,220,232,${.04+this.shieldFlash*.11})`);ctx.fillStyle=skin;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();
      const edge=ctx.createLinearGradient(-r,-r,r,r);edge.addColorStop(0,'rgba(221,232,240,.28)');edge.addColorStop(.28,'rgba(153,221,221,.1)');edge.addColorStop(.65,'rgba(205,178,218,.08)');edge.addColorStop(1,'rgba(240,228,189,.25)');ctx.strokeStyle=edge;ctx.lineWidth=.8+this.shieldFlash*.8;ctx.stroke();
      ctx.strokeStyle='rgba(234,244,243,.17)';ctx.lineWidth=.7;ctx.beginPath();ctx.arc(-r*.06,-r*.05,r*.85,3.6,4.8);ctx.stroke();
      for(let petal=0;petal<this.shieldHits;petal++){const a=-Math.PI/2+petal*Math.PI*2/3;ctx.save();ctx.rotate(a);ctx.strokeStyle='rgba(219,232,208,.32)';ctx.beginPath();ctx.ellipse(r*.97,0,4,1.8,0,0,Math.PI*2);ctx.stroke();ctx.restore();}
      ctx.restore();
    }
    const colors=['rgba(172,236,201,','rgba(104,215,205,','rgba(211,189,236,','rgba(241,211,155,'];
    for(const petal of this.ambient){const x=petal.x*w,y=petal.y*h,alpha=.08+night*.07,stretch=1.6+Math.sin(petal.phase)*.35;ctx.save();ctx.translate(x,y);ctx.rotate(petal.phase);ctx.scale(stretch,1);ctx.fillStyle=`${colors[petal.tint]}${alpha})`;ctx.beginPath();ctx.moveTo(-petal.size,0);ctx.bezierCurveTo(-petal.size*.28,-petal.size*.52,petal.size*.55,-petal.size*.38,petal.size,0);ctx.bezierCurveTo(petal.size*.34,petal.size*.38,-petal.size*.36,petal.size*.42,-petal.size,0);ctx.fill();ctx.restore();}
    for(const entity of this.entities){
      const x=entity.x*w,y=entity.y*h,pulse=entity.item.ground?1:1+Math.sin(this.time*1.8+entity.phase)*(entity.item.assist?.025:.045),size=entity.item.size*entity.scale*pulse;
      if(entity.item.storm){this.drawStorm(ctx,entity,x,y,size,night);continue;}
      if(entity.item.restoration){
        ctx.save();ctx.translate(x,y);ctx.globalAlpha=Math.min(1,entity.age*1.8)*.84;drawGardenLifeWheel(ctx,size,entity.age,entity.phase);ctx.restore();continue;
      }
      if(entity.item.assist&&!entity.item.assist.reveal&&!entity.item.sprite){ctx.save();ctx.translate(x,y);ctx.globalAlpha=Math.min(1,entity.age*2.4);drawGardenAssistGlyph(ctx,entity.item,size);ctx.restore();continue;}
      const image=this.images[entity.item.sprite],filterArtifact=entity.item.assist&&!entity.item.assist.reveal;ctx.save();ctx.translate(x,y);ctx.rotate(entity.item.navigationDelta?0:entity.item.assist?Math.sin(entity.age*.6+entity.phase)*.035:entity.angle);ctx.globalAlpha=Math.min(1,entity.age*2.4)*(filterArtifact?(entity.item.assist.divisor===4?.64:.50):entity.item.ground?.84:.92+night*.08);ctx.shadowColor=entity.item.color;ctx.shadowBlur=filterArtifact?2:entity.item.ground?4:(entity.item.harmful?8:13)+night*9;if(entity.item.visualFilter)ctx.filter=entity.item.visualFilter;if(entity.item.navigationDelta){const delta=entity.item.navigationDelta;ctx.fillStyle='#bde8da';ctx.font=`${Math.round(size*.44)}px Georgia`;ctx.textAlign='center';ctx.fillText(`${delta>0?'+':'−'}${Math.abs(delta)}`,0,size*.12);}else if(entity.item.arrangement)drawGardenArrangementFlower(ctx,entity.item,size,entity.rounds);else if(entity.item.asteroid&&image){if(entity.kind==='crystalAsteroid')ctx.filter='hue-rotate(100deg) saturate(1.3)';if(entity.kind==='lavaAsteroid'){ctx.filter='sepia(1) saturate(4) hue-rotate(-28deg)';ctx.shadowBlur=size*.34;}ctx.drawImage(image,-size/2,-size/2,size,size);}else if(entity.item.asteroid)this.drawAsteroid(ctx,entity,size);else if(image)ctx.drawImage(image,-size/2,-size/2,size,size);else{ctx.fillStyle=entity.item.color;ctx.beginPath();ctx.ellipse(0,0,size*.22,size*.34,0,0,Math.PI*2);ctx.fill();}ctx.restore();
      if(entity.item.asteroid&&!entity.item.fatal){ctx.save();ctx.globalAlpha=.28;ctx.fillStyle=entity.item.color;ctx.beginPath();ctx.ellipse(x,y,size*.36,size*.30,entity.angle,0,Math.PI*2);ctx.fill();ctx.restore();}
      if(entity.item.navigationDelta){ctx.save();ctx.fillStyle='#bde8da';ctx.textAlign='center';ctx.font='9px sans-serif';ctx.fillText(`×${entity.item.amount}`,x,y+size*.45);ctx.restore();}
      if(entity.item.fatal){ctx.save();ctx.globalAlpha=.48+.3*Math.sin(this.time*4+entity.phase);ctx.strokeStyle='#ff693f';ctx.lineWidth=2;ctx.shadowColor='#ff3e1f';ctx.shadowBlur=15;ctx.beginPath();ctx.arc(x,y,size*.58,0,Math.PI*2);ctx.stroke();ctx.restore();}
      if(entity.item.fatal){ctx.save();ctx.fillStyle='#ffb49c';ctx.font='bold 11px sans-serif';ctx.textAlign='center';ctx.shadowColor='#d20f00';ctx.shadowBlur=12;ctx.fillText('☠',x,y-size*.67);ctx.restore();}
      if(!entity.item.ground){const halo=.5+.5*Math.sin(this.time*2.1+entity.phase);ctx.save();ctx.globalAlpha=.09+halo*.08;ctx.strokeStyle=entity.item.color;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,y,size*(.45+halo*.06),size*(.34+halo*.04),entity.angle*.35,0,Math.PI*2);ctx.stroke();ctx.restore();}
      else if(!entity.triggered){ctx.save();ctx.globalAlpha=.16+.08*Math.sin(this.time*2.4+entity.phase);ctx.strokeStyle='#ff9a70';ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(x,y,size*.36,size*.29,entity.angle,0,Math.PI*2);ctx.stroke();ctx.restore();}
    }
    if(this.campPressure){const pressure=this.campPressure,x=pressure.x*w,y=pressure.y*h,charge=clamp((pressure.age-1.1)/1.5,0,1);ctx.save();ctx.translate(x,y);ctx.strokeStyle=`rgba(214,151,255,${.18+charge*.42})`;ctx.fillStyle=`rgba(88,35,104,${.05+charge*.12})`;for(let ring=0;ring<3;ring++){const radius=25+ring*16+Math.sin(this.time*3+ring)*5;ctx.lineWidth=1+charge;ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);ctx.stroke();}for(let i=0;i<12;i++){const angle=i*Math.PI*2/12+this.time*.35,radius=18+(i%3)*13;ctx.beginPath();ctx.arc(Math.cos(angle)*radius,Math.sin(angle)*radius,1.5+charge*2,0,Math.PI*2);ctx.fill();}ctx.restore();}
    for(const chip of this.chips){ctx.save();ctx.globalAlpha=1-chip.age/chip.life;ctx.fillStyle=chip.color;ctx.translate(chip.x*w,chip.y*h);ctx.rotate(chip.age*7);ctx.fillRect(-chip.size,-chip.size*.45,chip.size*2,chip.size*.9);ctx.restore();}
    for(const effect of this.effects){const t=effect.age/1.15,x=effect.x*w,y=effect.y*h,r=18+t*64;ctx.save();ctx.globalAlpha=(1-t)*.38;ctx.strokeStyle=effect.color;ctx.lineWidth=effect.harmful?1.2:.8;ctx.setLineDash([2+t*8,5+t*5]);ctx.beginPath();ctx.ellipse(x,y,r,r*(.62+Math.sin(t*9)*.05),t*.7,0,Math.PI*2);ctx.stroke();ctx.restore();}
    ctx.restore();
  }
  snapshot(){return {shieldHits:this.shieldHits,shieldFade:this.shieldFade,resources:{...this.resources},inventory:{...this.inventory},entities:this.entities.map(({id,kind,x,y,vx,vy,triggered})=>({id,kind,x,y,vx,vy,triggered})),event:this.event,eventAge:this.eventAge,flightForce:{...this.flightForce},impact:this.impact,chips:this.chips.length,campPressure:this.campPressure&&{x:this.campPressure.x,y:this.campPressure.y,age:this.campPressure.age},critical:this.critical&&{...this.critical},failureResource:this.failureResource,gameOver:this.gameOver};}
}

const createGardenLife=options=>new GardenLife(options);

return {GARDEN_RESOURCES,GARDEN_ITEMS,drawGardenLifeWheel,drawGardenAssistGlyph,GardenLife,createGardenLife};
})();
const module_garden_rewards=(()=>{
// Short, bounded nature reactions. No music, scoring, or route mutation here.
function createGardenRewards({reduced=false,rng=Math.random}={}){
  let motes=[],blooms=[],waves=[],vines=[],lastKind=null,count=0;
  const reset=()=>{motes=[];blooms=[];waves=[];vines=[];lastKind=null;count=0;};
  function answer(result,kind,{x=.5,y=.4}={}){
    if(!result?.correct||result.ignored)return false;
    count++;lastKind=kind;
    if(kind==='degree'){
      vines.push({x,y,age:0,life:5.2,phase:rng()*Math.PI*2});vines=vines.slice(-4);
      for(let i=0;i<(reduced?3:9);i++){const angle=rng()*Math.PI*2,spread=.025+rng()*.065;motes.push({x:x+Math.cos(angle)*spread,y:y+Math.sin(angle)*spread,age:0,life:3+rng(),phase:rng()*Math.PI*2,vx:(rng()-.5)*.01,vy:-.008});}
    }
    if(kind==='quality')blooms.push({x,y,age:0,life:3.4});
    if(result.positionComplete||result.complete)waves.push({x,y,age:0,life:2.8});
    motes=motes.slice(-88);blooms=blooms.slice(-6);waves=waves.slice(-4);return true;
  }
  function step(dt,{ground=.0}={}){
    const elapsed=Math.max(0,dt);
    for(const p of motes){p.age+=elapsed;if(!reduced){p.x+=p.vx*elapsed;p.y+=p.vy*elapsed;}}
    for(const p of [...blooms,...waves,...vines]){p.age+=elapsed;p.y+=ground;}
    vines=vines.filter(p=>p.age<p.life);
    motes=motes.filter(p=>p.age<p.life);blooms=blooms.filter(p=>p.age<p.life);waves=waves.filter(p=>p.age<p.life);
  }
  function draw(ctx,width,height){
    ctx.save();ctx.globalCompositeOperation='lighter';
    for(const p of vines){
      const grow=reduced?1:Math.min(1,p.age/1.7),fade=Math.min(1,p.age/.25,(p.life-p.age)/1.8),radius=Math.min(width,height)*.14;
      ctx.save();ctx.translate(p.x*width,p.y*height);ctx.rotate(p.phase);ctx.lineWidth=.85;ctx.strokeStyle=`rgba(165,212,207,${fade*.62})`;
      for(let branch=0;branch<5;branch++){
        ctx.save();ctx.rotate(branch*Math.PI*2/5);ctx.beginPath();ctx.moveTo(0,0);
        for(let k=1;k<=24*grow;k++){const t=k/24;ctx.lineTo(Math.sin(t*5+branch)*radius*t*.3,-radius*t);}ctx.stroke();
        for(let leaf=1;leaf<=5;leaf++){const t=leaf/6;if(t>grow)continue;const lx=Math.sin(t*5+branch)*radius*t*.3,ly=-radius*t,scale=Math.min(1,(grow-t)*6),side=leaf%2?1:-1;
          ctx.save();ctx.translate(lx,ly);ctx.rotate(side*.8);ctx.fillStyle=`rgba(170,210,197,${fade*.32})`;ctx.beginPath();ctx.ellipse(side*radius*.04,-radius*.035,radius*.025*scale,radius*.07*scale,-side*.5,0,Math.PI*2);ctx.fill();ctx.restore();
          ctx.fillStyle=`rgba(235,233,194,${fade*.7})`;ctx.beginPath();ctx.arc(lx,ly,1.2,0,Math.PI*2);ctx.fill();
        }ctx.restore();
      }ctx.restore();
    }
    for(const p of motes){
      const fade=Math.min(1,p.age/.3,(p.life-p.age)/.8),pulse=reduced?1:.65+.35*Math.sin(p.phase+p.age*5)**2;
      const x=p.x*width+(reduced?0:Math.sin(p.phase+p.age*3)*8),y=p.y*height;
      const light=ctx.createRadialGradient(x,y,0,x,y,5);light.addColorStop(0,`rgba(255,242,191,${fade*pulse*.8})`);light.addColorStop(.2,`rgba(190,225,217,${fade*.4})`);light.addColorStop(1,'rgba(190,225,217,0)');
      ctx.fillStyle=light;ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fill();
    }
    for(const p of blooms){
      const fade=Math.min(1,p.age/.4,(p.life-p.age)/.8),open=reduced?1:Math.min(1,p.age/1.1),radius=Math.min(width,height)*.042;
      ctx.save();ctx.translate(p.x*width,p.y*height);ctx.fillStyle=`rgba(124,255,211,${fade*.30})`;
      for(let i=0;i<7;i++){ctx.save();ctx.rotate(i*Math.PI*2/7);ctx.beginPath();ctx.ellipse(0,-radius*open*.68,radius*.32,radius*open*.85,0,0,Math.PI*2);ctx.fill();ctx.restore();}
      ctx.fillStyle=`rgba(255,244,167,${fade*.9})`;ctx.beginPath();ctx.arc(0,0,radius*.22,0,Math.PI*2);ctx.fill();ctx.restore();
    }
    for(const p of waves){
      const fade=Math.sin(Math.PI*p.age/p.life),radius=Math.min(width,height)*(reduced?.12:.05+p.age*.07);
      ctx.strokeStyle=`rgba(167,255,198,${fade*.30})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x*width,p.y*height,radius,0,Math.PI*2);ctx.stroke();
    }
    ctx.restore();
  }
  return {answer,step,draw,reset,snapshot:()=>({motes:motes.length,blooms:blooms.length,waves:waves.length,vines:vines.length,lastKind,count})};
}

return {createGardenRewards};
})();
const module_garden_difficulty=(()=>{
const GARDEN_DIFFICULTIES=Object.freeze({
  light:{speed:.7,barSeconds:7,spawnRate:.35,drain:.12,wrongDamage:.5,minResource:25,maxChapter:1,maxLength:4},
  medium:{speed:2,barSeconds:4,spawnRate:1,drain:1,wrongDamage:3,minResource:0,maxChapter:16,maxLength:18},
  hard:{speed:2.6,barSeconds:2.8,spawnRate:1.5,drain:1.7,wrongDamage:6,minResource:0,maxChapter:16,maxLength:32}
});
const difficultyProfile=name=>GARDEN_DIFFICULTIES[name]||GARDEN_DIFFICULTIES.medium;

return {GARDEN_DIFFICULTIES,difficultyProfile};
})();
const module_garden_flight=(()=>{
const {createGardenRenderer}=module_garden_flight_renderer;
const {gardenBassOffset,gardenQualityAnswer,gardenQualityAnswerLabel,gardenAvailableAnswers,createGardenMission,GardenPad,gardenExercisesForChapter,gardenDegreeLabel,gardenQualityLabel,gardenChordLabel,gardenAnswerState,gardenCanonicalQuality,GARDEN_QUALITY_PALETTE,GARDEN_CORE_QUALITIES,gardenFilteredChoices}=module_garden_harmony;
const {difficultyProfile}=module_garden_difficulty;
const {GardenSequenceStudio}=module_garden_sequence_studio;
const {createGardenLife,drawGardenAssistGlyph,GARDEN_RESOURCES,GARDEN_ITEMS}=module_garden_life;
const {createGardenRewards}=module_garden_rewards;
const {GARDEN_ARRANGEMENTS,drawGardenArrangementFlower}=module_garden_arrangement;
const $=id=>document.getElementById(id),world=$('world'),life=$('life'),shipLayer=$('ship-layer'),ctx=life.getContext('2d');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const requestedPalette=new URLSearchParams(location.search).get('palette');
document.body.dataset.paletteLayout=['compact','expanded','layered'].includes(requestedPalette)?requestedPalette:'layered';
const STATES=[
  {name:'Синие сады',note:'Цветущие острова и прозрачные русла',file:'blue-gardens'},
  {name:'Ночное цветение',note:'Светящиеся мембраны прорастают на той же карте',file:'night-bloom-aligned'},
  {name:'Белая оттепель',note:'Тонкий минеральный иней растёт вдоль прежних берегов',file:'white-thaw-aligned'},
  {name:'Янтарное созревание',note:'Тёплая растительность проступает сквозь знакомый рельеф',file:'blue-gardens'}
];
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x)),mod=(x,n)=>(x%n+n)%n;
const mobileGraphics=matchMedia('(pointer:coarse)').matches;
let renderScale=mobileGraphics?1.3:1.5,slowFrameAverage=16,graphicsSamples=0;
const s={ready:false,lowCostGraphics:mobileGraphics,from:0,to:0,transition:1,pending:null,growth:0,ship:1,time:0,travel:0,scroll:0,pan:0,night:0,lightMode:'cycle',cycle:0,lantern:true,paused:reduced,speed:2,altitude:1.25,visit:0,clean:false,angle:0,motionX:0,motionY:0,thrust:.45,brake:0,x:0,y:0,width:1,height:1,worldSize:1,tour:'reharm',chapter:1,mode:'quest',gameOver:false};
let renderer,images,last=0,raf=0,dpr=1,dragId=null,tx=.5,ty=.56,keys=new Set(),loaded=0;
const pad=new GardenPad({deferSamplesUntilReady:true});
const gardenLife=createGardenLife({onArrangement:(style,rounds)=>mission?.arrange(style,rounds)});
const gardenRewards=createGardenRewards({reduced});
let mission,studio,currentRoute,lastMissionPosition='',lastLifeEvent=0,lastCollisionEvent=0,studioPauseState=false,queuedStudioRoute=null,completionHandled=false;
const PROGRESS_KEY='echo-garden-progress.v1';
const TUTORIAL_KEY='echo-garden-welcome-dismissed.v1';
const wasTutorialDismissed=()=>{try{return localStorage.getItem(TUTORIAL_KEY)==='1';}catch{return false;}};
let menuWasRunning=false,exitWasRunning=false;
let difficulty='medium',tutorialStep=0,tutorialDismissed=wasTutorialDismissed(),tutorialActive=false;
const FAVORITES_KEY='echo-garden-favorites.v1';
const loadProgress=()=>{try{const saved=JSON.parse(localStorage.getItem(PROGRESS_KEY)||'{}');return {level:Math.max(1,Number(saved.level)||1),completed:Array.isArray(saved.completed)?saved.completed:[],lastRouteId:saved.lastRouteId||''};}catch{return {level:1,completed:[],lastRouteId:''};}};
const progress=loadProgress();
const saveProgress=()=>{try{localStorage.setItem(PROGRESS_KEY,JSON.stringify(progress));}catch{}}
const loadFavorites=()=>{try{return new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY)||'[]'));}catch{return new Set();}};
const favorites=loadFavorites();
const routeIdentity=route=>String(route?.id||`${route?.source||'route'}:${route?.name||''}`);
const saveFavorites=()=>{try{localStorage.setItem(FAVORITES_KEY,JSON.stringify([...favorites]));navigator.storage?.persist?.();}catch{}};
const TOUR_NAMES={reharm:'Reharmonization+',anime:'Anime',chill:'Chill',ambient:'Ambient',cinematic:'Cinematic','deep-house':'Deep House',funk:'Funk',gospel:'Gospel','drum-bass':'Drum & Bass',favorites:'Избранные полёты'};
const routeTour=route=>route?.chapter?'reharm':route?.tour||'reharm';
const DEGREE_NAMES=['I','♭II','II','♭III','III','IV','♯IV','V','♭VI','VI','♭VII','VII'];
const exerciseCode=(exercise,index)=>{
  const id=String(exercise.id||''),idMatch=id.match(/^fig-(\d+)-(\d+)/i);
  const nameMatch=String(exercise.name||'').match(/Fig\.?\s*(\d+)[.\-](\d+)/i);
  const chapter=Number(exercise.chapter??idMatch?.[1]??nameMatch?.[1]??1);
  const figure=Number(idMatch?.[2]??nameMatch?.[2]??index+1);
  return `${String(chapter).padStart(2,'0')}F${String(figure).padStart(2,'0')}`;
};
// Particles are reused and time/scroll wrap; neither grows with flight duration.
const motes=Array.from({length:56},(_,i)=>({x:mod(Math.sin(i*127.13+14)*43758.54,1),y:mod(Math.sin(i*71.72+8)*31341.4,1),r:.5+(i%5)*.23,phase:i*2.399}));
function resize(){
  s.width=innerWidth;s.height=innerHeight;dpr=Math.min(devicePixelRatio||1,renderScale);
  for(const canvas of [world,life,shipLayer]){canvas.width=Math.round(s.width*dpr);canvas.height=Math.round(s.height*dpr);}
  s.worldSize=Math.max(s.width*.86,s.height*.95)/s.altitude;
  s.x=tx*s.width;s.y=ty*s.height;
}
resize();addEventListener('resize',resize);window.visualViewport?.addEventListener('resize',resize);
function ui(){
  const active=Math.floor(mod(s.growth,4)),item=STATES[active],progress=mod(s.growth,1);
  $('state-title').textContent=item.name;$('state-note').textContent=item.note;
  $('state-number').textContent=`ЖИВОЙ ЦИКЛ · 0${active+1} / 04`;
  $('world-cycle-name').textContent=item.name;$('world-cycle-progress').style.width=`${Math.round(progress*100)}%`;
  for(const [attribute,value] of [['ship',s.ship],['light',s.lightMode]])for(const b of document.querySelectorAll(`[data-${attribute}]`)){const selected=String(b.dataset[attribute])===String(value);b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));}
  $('pause').setAttribute('aria-pressed',String(s.paused));$('pause').textContent=s.paused?'▶':'Ⅱ';$('pause').setAttribute('aria-label',s.paused?'Продолжить':'Пауза');
  $('lantern').setAttribute('aria-pressed',String(s.lantern));$('lantern').disabled=s.ship===2;
  $('flight-status').textContent=s.paused?'Полёт на паузе':s.night>.6?(s.lantern&&s.ship!==2?'Ночь · свет ведёт нас':'Ночь · естественное свечение'):s.night>.2?'Сумерки · сад продолжает расти':'День · живой цикл';
}
function renderVitals(){
  const model=gardenLife.snapshot();
  const repeatState=mission?.snapshot();$('infinity-toggle').disabled=!repeatState?.running||repeatState.complete||(!repeatState.held&&(model.inventory.hold||0)<1);$('infinity-toggle').title=repeatState?.held?'Выключить повтор и продолжить':`Повторить аккорд · зарядов лотоса: ${model.inventory.hold||0}`;
  for(const [name,definition] of Object.entries(GARDEN_RESOURCES)){
    const element=document.querySelector(`.vital[data-resource="${name}"]`),value=Math.round(model.resources[name]);
    if(!element)continue;
    element.style.setProperty('--level',String(value/100));element.classList.toggle('low',value<24);
    element.setAttribute('aria-label',`${definition.label}: ${value} процентов`);$(`vital-${name}`).textContent=String(value);
  }
  const event=model.event;
  if(event&&event.id!==lastLifeEvent){
    lastLifeEvent=event.id;const elements=event.resource==='all'?document.querySelectorAll('.vital'):[document.querySelector(`.vital[data-resource="${event.resource}"]`)];
    for(const element of elements){element?.classList.remove('changed','harmful');void element?.offsetWidth;element?.classList.add('changed');element?.classList.toggle('harmful',event.harmful);}
  }
  const callout=$('vital-event');
  if(event&&model.eventAge<2.4){callout.textContent=`${event.harmful?'−':'+'} ${event.label}`;callout.classList.toggle('harmful',event.harmful);callout.classList.add('visible');}
  else callout.classList.remove('visible');
  for(const button of document.querySelectorAll('[data-use-artifact]')){const kind=button.dataset.useArtifact,count=model.inventory[kind]||0,spec=GARDEN_ITEMS[kind],state=mission?.snapshot(),repeating=Boolean(spec.repeat&&state?.held);button.querySelector('b').textContent=count?String(count):'';button.classList.toggle('ready',count>0||repeating);button.classList.toggle('repeating',repeating);button.setAttribute('aria-pressed',String(repeating));if(spec.repeat){button.title=repeating?'∞ Повтор включён · нажми, чтобы продолжить':`${spec.label} · зарядов: ${count}`;button.setAttribute('aria-label',button.title);}button.hidden=!spec.navigationDelta&&count<1&&!repeating;button.disabled=(!repeating&&count<1)||(spec.shield&&model.shieldHits>0)||s.paused||!state?.running||state.cursor<0||(spec.assist?.reveal&&(spec.assist.answerKind==='both'?(state.currentParts.degree&&state.currentParts.quality):state.currentParts[spec.assist.answerKind]));}
}
function collisionThud(){
  const audio=pad.context;if(!audio||audio.state!=='running')return;
  const at=audio.currentTime,oscillator=audio.createOscillator(),gain=audio.createGain();
  oscillator.type='triangle';oscillator.frequency.setValueAtTime(110,at);oscillator.frequency.exponentialRampToValueAtTime(43,at+.2);
  gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(.13,at+.009);gain.gain.exponentialRampToValueAtTime(.0001,at+.25);
  oscillator.connect(gain);gain.connect(pad.cleanOutput||audio.destination);oscillator.start(at);oscillator.stop(at+.27);
  oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
}
function renderMission(model){
  renderTutorial(model);
  const layers=Object.entries(model.arrangementStatus||{});$('arrangement-status').replaceChildren(...layers.map(([track,item])=>{const button=document.createElement('button'),spec=GARDEN_ARRANGEMENTS[item.style],canvas=document.createElement('canvas');button.dataset.arrangementTrack=track;button.dataset.arrangementStyle=item.style;canvas.width=canvas.height=96;canvas.setAttribute('aria-hidden','true');const icon=canvas.getContext('2d');icon.translate(48,48);drawGardenArrangementFlower(icon,spec,126,1,1.7);button.append(canvas);button.style.setProperty('--flower',spec.color);button.title=`${spec.label}: отключить партию`;button.setAttribute('aria-label',button.title);button.addEventListener('click',()=>{mission.clearArrangement(track);});return button;}));
  lastMissionPosition=`${model.round}:${model.cursor}`;
  const progress=model.progress??model.parts??model.exercise.sequence.map((_,index)=>({degree:model.solved.includes(index),quality:model.solved.includes(index)}));
  const solved=new Set(model.solved),total=model.exercise.sequence.length,solvedParts=model.solvedParts??progress.reduce((sum,part)=>sum+Number(part.degree)+Number(part.quality),0),percent=Math.round(solvedParts/(total*2)*100);
  const missing=progress.flatMap((part,index)=>[
    ...(!part.degree?[{index,kind:'бас'}]:[]),
    ...(!part.quality?[{index,kind:'тип аккорда'}]:[])
  ]);
  const finalMissing=missing.length===1?missing[0]:null;
  const chapter=Number(model.exercise.chapter)||1,exerciseIndex=Math.max(0,gardenExercisesForChapter(chapter).findIndex(item=>item.id===model.exercise.id)),tour=routeTour(model.exercise),favorite=favorites.has(routeIdentity(model.exercise));
  $('mission-code').textContent=exerciseCode(model.exercise,exerciseIndex);$('mission-title').textContent=routeTitle(model.exercise,exerciseIndex);$('mission-source').textContent=model.exercise.source||`${TOUR_NAMES[tour]||tour} · последовательность ${model.exercise.number||exerciseIndex+1}`;$('mission-mandala').src=`assets/echo-garden/tours/${tour==='favorites'?'reharm':tour}.webp`;$('mission-mandala').alt=`Мандала ${TOUR_NAMES[tour]||tour}`;
  $('route-favorite').textContent=favorite?'♥':'♡';$('route-favorite').setAttribute('aria-pressed',String(favorite));$('route-favorite').setAttribute('aria-label',favorite?'Убрать маршрут из избранного':'Добавить маршрут в избранное');
  $('route-progress').textContent=`${solvedParts} / ${total*2}`;$('completion-number').textContent=String(percent);$('round-number').textContent=String(model.round).padStart(2,'0');
  const routeElement=$('chord-route');
  routeElement.classList.toggle('route-long',total>5);
  routeElement.classList.toggle('route-very-long',total>=24);
  routeElement.closest('.route-panel')?.classList.toggle('route-long-panel',total>5);
  $('harmony-hud').classList.toggle('has-long-route',total>5);
  routeElement.dataset.length=String(total);
  routeElement.style.setProperty('--route-half',String(Math.ceil(total/2)));
  routeElement.replaceChildren(...progress.map((part,index)=>{
    const li=document.createElement('li'),current=model.running&&index===model.cursor,target=model.exercise.sequence[index];
    li.className=`chord-slot${part.degree&&part.quality?' solved':''}${current?' current':''}`;
    li.setAttribute('aria-label',`Позиция ${index+1}: бас ${part.degree?'найден':'не найден'}, тип ${part.quality?'найден':'не найден'}`);
    const degreeOnly=gardenDegreeLabel(gardenBassOffset(target));
    const label=part.degree&&part.quality?gardenChordLabel(target):part.degree?degreeOnly:part.quality?gardenQualityAnswerLabel(gardenQualityAnswer(target)):'';
    if(part.degree&&part.quality)li.title=`${gardenChordLabel(target)}${target.notes?.length?` · MIDI: ${target.notes.join(', ')}`:''}`;
    li.innerHTML=`<button type="button" class="route-node" aria-label="Позиция ${index+1}" disabled><i class="node-degree${part.degree?' found':''}"></i><i class="node-quality${part.quality?' found':''}"></i><em>${index+1}</em></button><span class="route-copy" aria-hidden="true"><small>${String(index+1).padStart(2,'0')}</small><b class="${label?'visible':''}">${label||'·'}</b></span>`;
    return li;
  }));
  const currentParts=model.currentParts??(model.cursor>=0?progress[model.cursor]:{degree:true,quality:true});
  const mayAnswer=model.running&&model.cursor>=0&&!solved.has(model.cursor),prototypePalette=['expanded','compact'].includes(document.body.dataset.paletteLayout),qualities=gardenAvailableAnswers(model.exercise,{expanded:prototypePalette});
  document.body.classList.toggle('student-palette',!prototypePalette);
  const visibleDegrees=gardenFilteredChoices('degree',model.current,model.filters?.degree),visibleQualities=gardenFilteredChoices('quality',model.current,model.filters?.quality,qualities);
  const answerPart=(kind,value)=>{const result=mission.answerPart(kind,value);if(!result.ignored){if(!result.correct){gardenLife.wrongAnswer(kind,value,qualities);renderVitals();}gardenRewards.answer(result,kind,{x:s.x/s.width,y:Math.max(.18,s.y/s.height-.15)});pad.feedback(result.correct,{complete:result.positionComplete||result.complete,kind,value}).catch(()=>{});}};
  $('degree-options').replaceChildren(...DEGREE_NAMES.map((name,offset)=>{const button=document.createElement('button'),answer=gardenAnswerState(model,'degree',offset);button.className=`degree-option${answer.selected?' selected locked':''}${visibleDegrees.has(offset)?'':' filtered'}`;button.setAttribute('aria-pressed',String(answer.selected));button.textContent=name;button.dataset.degree=String(offset);button.disabled=answer.disabled||!visibleDegrees.has(offset);button.addEventListener('click',()=>answerPart('degree',offset));return button;}));
  const makeQuality=quality=>{const button=document.createElement('button'),answer=gardenAnswerState(model,'quality',quality);button.className=`quality-option${answer.selected?' selected locked':''}${visibleQualities.has(quality)?'':' filtered'}`;button.setAttribute('aria-pressed',String(answer.selected));button.textContent=gardenQualityAnswerLabel(quality);button.title=quality.includes(':')?'Ступень и тип верхнего аккорда; бас выбери внизу':`Тип аккорда: ${gardenQualityLabel(quality)}`;button.dataset.quality=quality;button.disabled=answer.disabled||!visibleQualities.has(quality);button.addEventListener('click',()=>answerPart('quality',quality));return button;};
  $('quality-options').replaceChildren(...GARDEN_CORE_QUALITIES.map(makeQuality));
  $('quality-advanced-options').replaceChildren(...qualities.filter(q=>!GARDEN_CORE_QUALITIES.includes(q)).map(makeQuality));
  const advanced=qualities.filter(q=>!GARDEN_CORE_QUALITIES.includes(q));$('quality-advanced').hidden=advanced.length===0;$('quality-advanced').open=!prototypePalette||document.body.dataset.paletteLayout==='expanded';
  $('assist-status').textContent=Object.entries(model.filters||{}).filter(([,filter])=>filter).map(([kind,filter])=>`${kind==='degree'?'Бас':'Аккорды'} ×${filter.divisor} · ${filter.remaining} ходов`).join(' / ');
  document.body.classList.toggle('infinity-active',Boolean(model.held));$('infinity-continue').hidden=!model.held||model.complete;$('infinity-continue').disabled=!model.running||s.paused;
  $('infinity-toggle').disabled=!model.running||model.complete||(!model.held&&(gardenLife.inventory.hold||0)<1);$('infinity-toggle').setAttribute('aria-pressed',String(model.held));$('infinity-status').textContent=model.held?`∞ Позиция ${model.cursor+1} · повтор до ответа`:'';const toolsSummary=document.querySelector('.flight-tools summary');if(toolsSummary){toolsSummary.classList.toggle('repeating',model.held);toolsSummary.setAttribute('aria-label',model.held?'Лотос: повтор включён — открыть управление':'Лотос: прыжки, повтор и подсказки');}
  const waitingForFinal=finalMissing&&model.running&&model.cursor>=0&&model.cursor!==finalMissing.index;
  $('answer-feedback').textContent=model.complete?'Маршрут собран. Последовательность распознана.':model.feedback||(waitingForFinal?`Осталась позиция ${finalMissing.index+1}: ${finalMissing.kind}. Дождись её подсветки слева.`:mayAnswer?'Бас и аккорд — два независимых ответа':model.running&&model.cursor<0?'Слушаем базу':model.running?'Обе части этой позиции уже найдены':finalMissing?`Осталась позиция ${finalMissing.index+1}: ${finalMissing.kind}. Запусти последовательность.`:'Запусти последовательность');
  const referenceName=String(model.reference.degree).replace(/^БАЗА\s*/, '');
  $('mission-prompt').textContent=model.complete?`Все ${total} сигналов встроены в маршрут.`:model.running?(model.cursor<0?`Тоника ${referenceName} звучит один раз перед фигурой.`:waitingForFinal?`Ждём позицию ${finalMissing.index+1} — там остался ${finalMissing.kind}.`:solved.has(model.cursor)?'Позиция заполнена — слушаем контекст.':currentParts.degree?'Бас есть. Найди аккорд.':currentParts.quality?'Аккорд есть. Найди бас.':'Определи две части текущего аккорда.'):'Тоника известна. Запусти последовательность.';
  $('mission-toggle').textContent=model.running?'Ⅱ':'▶';$('mission-toggle').title=model.running?'Пауза':'Продолжить';$('mission-toggle').setAttribute('aria-label',model.running?'Поставить полёт и музыку на паузу':'Запустить полёт и музыку');$('mission-restart').hidden=!model.complete;
  if(model.complete&&!completionHandled)completeGardenLevel();
}
function bindMission(exercise){if(!exercise)return;mission?.pause();pad.stop(true);gardenRewards.reset();currentRoute=exercise;completionHandled=false;lastMissionPosition='';mission=createGardenMission({exercise,barSeconds:difficultyProfile(difficulty).barSeconds,onChange:renderMission,onChord:(chord,model)=>pad.play(chord,model.exercise.baseTonic??5,{arpeggio:model.arpeggio,arrangement:model.arrangement,barSeconds:model.barSeconds}).catch(error=>{$('answer-feedback').textContent=error.message;})});renderMission(mission.snapshot());}
let activeExercises=[];
function routeTitle(route,index=0){return route.name&&route.name!==route.id?route.name:exerciseCode(route,index);}
function renderGardenRouteList(){
  const list=$('garden-route-list');if(!list)return;
  const routes=s.tour==='favorites'?[...allBookRoutes(),...(studio?.routes||[])].filter(route=>favorites.has(routeIdentity(route))):s.tour==='reharm'?activeExercises:(studio?.routes||[]).filter(route=>(route.tour||'reharm')===s.tour);
  list.replaceChildren(...routes.map((route,index)=>{const button=document.createElement('button');button.className='garden-route-choice';button.innerHTML=`<span>${route.chapter?exerciseCode(route,index):String(route.number||index+1).padStart(2,'0')}</span><strong>${routeTitle(route,index)}</strong><small>${route.sequence.length} аккордов · ${TOUR_NAMES[routeTour(route)]||routeTour(route)}${favorites.has(routeIdentity(route))?' · ♥':''}</small>`;button.addEventListener('click',()=>launchRoute(route));return button;}));
  if(!routes.length){const empty=document.createElement('p');empty.className='garden-route-empty';empty.textContent=s.tour==='favorites'?'Нажми ♡ возле текущего маршрута — он появится здесь для точного повторного полёта.':'В этом туре пока нет последовательностей. Их можно добавить в Sound & Route Lab.';list.append(empty);}
  $('reharm-chapters').hidden=s.tour!=='reharm';
}
function selectChapter(chapter=1,{bind=false}={}){s.chapter=clamp(Number(chapter)||1,1,16);activeExercises=gardenExercisesForChapter(s.chapter);$('mandala-chapter').textContent=String(s.chapter).padStart(2,'0');$('exercise-select').replaceChildren(...activeExercises.map((exercise,index)=>{const option=document.createElement('option');option.value=exercise.id;option.textContent=exerciseCode(exercise,index);return option;}));if(bind&&activeExercises[0])bindMission(activeExercises[0]);for(const button of document.querySelectorAll('[data-chapter]')){const selected=Number(button.dataset.chapter)===s.chapter;button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));}renderGardenRouteList();}
selectChapter(1,{bind:true});
studio=new GardenSequenceStudio({
  onUse:route=>{queuedStudioRoute=route;},
  onOpen:()=>{studioPauseState=Boolean(mission?.snapshot().running);mission?.pause({preserveHold:true});pad.stop(true);s.paused=true;ui();},
  onClose:()=>{if(queuedStudioRoute){const route=queuedStudioRoute;queuedStudioRoute=null;launchRoute(route);}else{if(studioPauseState){s.paused=false;mission?.start();}ui();}}
});
$('exercise-select').addEventListener('change',event=>bindMission(activeExercises.find(exercise=>exercise.id===event.target.value)));
for(let chapter=1;chapter<=16;chapter++){const button=document.createElement('button');button.dataset.chapter=String(chapter);button.textContent=String(chapter).padStart(2,'0');button.setAttribute('aria-label',`Глава ${chapter}`);button.addEventListener('click',()=>selectChapter(chapter));$('chapter-orbit').append(button);}selectChapter(1);
for(const button of document.querySelectorAll('[data-tour]'))button.addEventListener('click',async()=>{s.tour=button.dataset.tour;for(const item of document.querySelectorAll('[data-tour]')){const selected=item===button;item.classList.toggle('selected',selected);item.setAttribute('aria-pressed',String(selected));}$('mandala-tour-name').textContent=button.getAttribute('aria-label')||s.tour;await studio?.refresh();renderGardenRouteList();});
$('route-favorite').addEventListener('click',()=>{if(!currentRoute)return;const id=routeIdentity(currentRoute);favorites.has(id)?favorites.delete(id):favorites.add(id);saveFavorites();renderMission(mission.snapshot());if(s.tour==='favorites')renderGardenRouteList();});
for(const button of document.querySelectorAll('[data-mode]'))button.addEventListener('click',()=>{s.mode=button.dataset.mode;for(const item of document.querySelectorAll('[data-mode]')){const selected=item===button;item.classList.toggle('selected',selected);item.setAttribute('aria-pressed',String(selected));}});
function updateProgressCard(){
  $('garden-level').textContent=String(progress.level).padStart(2,'0');
  $('garden-level-progress').style.width=`${((progress.level-1)%4+1)*25}%`;
  $('garden-completed').textContent=`${progress.completed.length} ${progress.completed.length===1?'маршрут пройден':'маршрутов пройдено'}`;
}
function showGardenStart(state='menu'){
  mission?.pause();pad.stop(true);s.paused=true;keys.clear();tutorialActive=false;$('flight-tutorial').hidden=true;document.querySelectorAll('.tutorial-focus').forEach(el=>el.classList.remove('tutorial-focus'));document.querySelector('.flight-tools')?.removeAttribute('open');document.body.classList.remove('tutorial-open');setGardenMenu(false,{resume:false});$('game-over').hidden=true;
  document.body.classList.add('start-open');$('garden-start').hidden=false;
  $('start-title').textContent=state==='complete'?'Уровень пройден':'Сад Эха';
  $('start-note').textContent=state==='complete'?`Маршрут «${routeTitle(currentRoute)}» собран. Сад открыл следующий уровень.`:'Сад усложняет маршруты постепенно и запоминает пройденные уровни.';
  $('start-random').querySelector('strong').textContent=state==='complete'?'Следующий полёт':'Начать полёт';
  document.querySelector('.start-route-details')?.removeAttribute('open');
  updateProgressCard();ui();
}
function hideGardenStart(){document.body.classList.remove('start-open');$('garden-start').hidden=true;}
const tutorialSteps=[
 ['Добро пожаловать','#world-controls','Кнопка справа сверху открывает выбор главы, маршрута, тембра и корабля. Лёгкий — спокойное обучение, Средний — обычный полёт, Сложный — экспериментальный режим для опытных.'],
 ['Управление кораблём','#world','Веди корабль пальцем, мышью или стрелками. Предмет засчитывается при касании кораблём: полезные лови, опасные обходи.'],
 ['Цепочка аккордов','#chord-route','Сверху — позиции последовательности. Подсвеченная позиция сейчас звучит. Сначала услышишь тонику — ориентир для определения ступеней.'],
 ['Услышь бас','#degree-options','Нижняя полоса — БАС: самая низкая нота относительно тоники. I — тоника, V — пятая ступень, ♭II — пониженная вторая. Например, IV/I: внизу выбираем I, а справа — IV maj. Бас и корень верхнего аккорда могут отличаться.'],
 ['Узнай аккорд','#quality-options','Справа — тип звучащего аккорда: maj — мажор, m — минор, 7 — доминантсептаккорд, maj7 — большой мажорный, m7 — минорный септаккорд. Бас и аккорд угадываются независимо. Для отдельного баса рядом появляются ответы со ступенью верхнего аккорда: например IV maj. Правильный выбор остаётся подсвеченным.'],
 ['Запасы корабля','#garden-vitals','Жёлтая пробирка — топливо, голубая — вода, зелёная — экипаж, фиолетовая — корпус. В среднем и сложном режимах они расходуются со временем даже без ответов. Ошибки и столкновения тоже отнимают запас.'],
 ['Пополнение','#garden-vitals','Семя пополняет топливо, жемчужина — воду, ягоды — экипаж, ремонтный лотос — корпус. Лови нужное кораблём. В лёгком режиме запас защищён нижней границей 25%; в остальных режимах пустая пробирка означает опасность завершения полёта.'],
 ['Опасности','#world','Камни повреждают корабль; оттенок указывает пострадавшую пробирку. Кратер и смерч опасны при сближении. Красное смертельное ядро завершает полёт при столкновении — его нельзя ловить. В лёгком режиме смертельные ядра отключены.'],
 ['Лотос управления','.flight-tools summary','Этот лотос раскрывает повтор, прыжки и подсказки. Нажатие вне меню закрывает его. Сейчас мы раскрываем его для обзора, ничего не активируя.'],
 ['Бесконечный повтор','#infinity-toggle','Поймай зелёный лотос со знаком ∞, затем активируй его в меню лотоса. Один заряд удерживает звучащий аккорд без ограничения по кругам. Правильный ответ по любой одной части сразу переключает на следующую позицию. Для выхода без ответа нажми отдельную пульсирующую кнопку «Лететь дальше» слева. Это не пауза: корабль летит, запасы расходуются.'],
 ['Прыжки','#jump-charges','Цифры −7, −5, −3, +3, +5, +7 сдвигают позицию в цепочке. Сначала поймай заряд. Цифра рядом показывает запас; каждое использование тратит один заряд. Пустая кнопка не работает. В лёгком режиме прыжки отключены.'],
 ['Цветок открытия','#assist-charges','Переливчатый цветок открывает басовую ступень текущей позиции. Если она уже найдена, заряд не тратится. Сначала поймай его кораблём, затем нажми в меню лотоса.'],
 ['Семя и корневая спираль','#assist-charges','Семя скрывает неправильные аккорды; корневая спираль — неправильные басовые ступени. Оттенок показывает силу: бледные убирают примерно половину вариантов на 3–5 ходов, насыщенные оставляют четверть на круг, самое редкое семя действует два круга. Правильная кнопка остаётся на привычном месте.'],
 ['Цветы аранжировки','#world-controls','Цветы добавляют бас или арпеджио на один, два или три круга. Партия вступает со следующего аккорда. Бас и арпеджио можно сочетать. Каталог с объяснениями цветов и настройкой пробного цветка находится в основных настройках, а не в лотосе.'],
 ['Отключение партии','#arrangement-status','Когда звучит дополнительная партия, слева появляется миниатюра пойманного цветка. Нажми её, чтобы выключить эту партию, не останавливая остальную музыку.'],
 ['Пауза и выход','#garden-home','Ⅱ останавливает музыку, движение, расход и сбор предметов. ▶ продолжает. Стрелка возврата сверху, рядом с настройками, возвращает на заставку после подтверждения: там можно начать заново или выбрать другой маршрут. Обучение доступно в меню и настройках.']
];
function renderTutorial(model){if(!$('flight-tutorial'))return;const visible=tutorialActive||(difficulty!=='hard'&&!tutorialDismissed&&model.running);$('flight-tutorial').hidden=!visible;document.querySelectorAll('.tutorial-focus').forEach(el=>el.classList.remove('tutorial-focus'));document.body.classList.toggle('tutorial-open',visible);if(!visible)return;const [title,selector,text]=tutorialSteps[tutorialStep];$('tutorial-title').textContent=`${tutorialStep+1}/${tutorialSteps.length} · ${title}`;$('tutorial-back').disabled=tutorialStep===0;$('tutorial-next').textContent=tutorialStep===tutorialSteps.length-1?'Готово ✓':'Дальше →';document.body.classList.toggle('tutorial-open',visible);$('tutorial-progress').style.setProperty('--progress',`${(tutorialStep+1)/tutorialSteps.length*100}%`);flightTools.open=tutorialActive&&tutorialStep>=8&&tutorialStep<=12;const target=document.querySelector(selector);target?.classList.add('tutorial-focus');const chord=!tutorialActive&&difficulty==='light'&&model.current?`Сейчас бас ${gardenDegreeLabel(gardenBassOffset(model.current))}; аккорд ${gardenQualityAnswerLabel(gardenQualityAnswer(model.current))}. `:'';$('tutorial-copy').textContent=chord+text;}
for(const button of document.querySelectorAll('.difficulty-picker button[data-difficulty]'))button.addEventListener('click',()=>{difficulty=button.dataset.difficulty;document.body.dataset.difficulty=difficulty;gardenLife.difficulty=difficultyProfile(difficulty);s.speed=gardenLife.difficulty.speed;tutorialStep=0;$('start-difficulty-note').textContent={light:'Спокойный полёт: короткие маршруты, медленное движение и защищённые запасы.',medium:'Обычный полёт: запасы расходуются, ошибки и камни наносят урон.',hard:'Для опытных: длинные маршруты, высокая скорость и сложная гармония. Пока эксперимент.'}[difficulty];for(const item of document.querySelectorAll('.difficulty-picker button[data-difficulty]'))item.setAttribute('aria-pressed',String(item===button));});
function finishTutorial(){tutorialActive=false;tutorialDismissed=true;try{localStorage.setItem(TUTORIAL_KEY,'1');}catch{}flightTools.open=false;renderTutorial(mission.snapshot());if(!mission.snapshot().running)showGardenStart();}
function openTutorial(){mission.pause();pad.stop(true);s.paused=true;hideGardenStart();setGardenMenu(false,{resume:false});tutorialActive=true;tutorialStep=0;renderTutorial(mission.snapshot());}
$('tutorial-settings-open').addEventListener('click',openTutorial);
$('start-tutorial').addEventListener('click',openTutorial);
$('tutorial-next').addEventListener('click',()=>{if(tutorialStep===tutorialSteps.length-1){finishTutorial();return;}tutorialStep++;renderTutorial(mission.snapshot());});
$('tutorial-back').addEventListener('click',()=>{tutorialStep=Math.max(0,tutorialStep-1);renderTutorial(mission.snapshot());});
$('tutorial-close').addEventListener('click',finishTutorial);
function allBookRoutes(maxChapter=16){const routes=[];for(let chapter=1;chapter<=maxChapter;chapter++)for(const route of gardenExercisesForChapter(chapter))routes.push(route);return routes;}
async function randomGardenRoute(){
  await studio.refresh();
  const unlockedChapter=Math.min(16,1+Math.floor((progress.level-1)/2)),maxLength=Math.min(18,4+Math.floor((progress.level-1)/2));
  const book=allBookRoutes(unlockedChapter),tour=(studio.routes||[]).filter(route=>route.sequence.length<=maxLength);
  const profile=difficultyProfile(difficulty),eligible=difficulty==='light'?allBookRoutes(profile.maxChapter).filter(route=>route.sequence.length<=profile.maxLength):difficulty==='hard'?[...allBookRoutes(),...tour].filter(route=>route.sequence.length>=8):[...book,...tour];
  let pool=eligible.filter(route=>route.id!==progress.lastRouteId);if(!pool.length)pool=eligible;
  const route=pool[Math.floor(Math.random()*pool.length)]||gardenExercisesForChapter(1)[0];
  launchRoute(route);
}
async function launchRoute(route){
  if(!route)return;
  gardenLife.difficulty=difficultyProfile(difficulty);s.speed=gardenLife.difficulty.speed;tutorialStep=0;
  hideGardenStart();setGardenMenu(false,{resume:false});$('game-over').hidden=true;s.gameOver=false;gardenLife.reset();renderVitals();bindMission(route);
  try{await pad.unlock();s.paused=false;mission.start();world.focus({preventScroll:true});$('answer-feedback').textContent=`Маршрут «${routeTitle(route)}» загружен`;ui();}catch(error){$('answer-feedback').textContent=error.message;s.paused=false;ui();}
}
function completeGardenLevel(){
  completionHandled=true;s.paused=true;pad.stop(true);
  const id=currentRoute?.id||`${currentRoute?.source||'route'}:${currentRoute?.name||''}`;
  if(id&&!progress.completed.includes(id))progress.completed.push(id);progress.lastRouteId=id;progress.level+=1;saveProgress();
  showGardenStart('complete');
}
async function retryCurrentMission(){
  if(!currentRoute)return;hideGardenStart();$('game-over').hidden=true;s.gameOver=false;gardenLife.reset();renderVitals();bindMission(currentRoute);
  try{await pad.unlock();s.paused=false;mission.start();ui();}catch(error){$('answer-feedback').textContent=error.message;}
}
function chooseState(index){
  index=clamp(Math.trunc(index),0,3);s.growth=index;s.from=s.to=index;s.visit=0;
  ui();
}
function pause(){s.paused=!s.paused;keys.clear();if(s.paused){mission?.pause();pad.stop(true);}else if(!mission?.snapshot().complete)mission?.start();ui();}
function clean(value){s.clean=value;document.body.classList.toggle('clean',value);$('restore').hidden=!value;(value?$('restore'):$('clean')).focus();}
function light(mode){s.lightMode=mode;if(mode==='cycle')s.cycle=Math.acos(clamp(1-2*s.night,-1,1))*180/Math.PI;if(s.paused||reduced)s.night=mode==='night'?1:mode==='dusk'?.48:mode==='day'?0:s.night;ui();}
for(const b of document.querySelectorAll('[data-ship]'))b.addEventListener('click',()=>{s.ship=Number(b.dataset.ship);ui();});
for(const b of document.querySelectorAll('[data-light]'))b.addEventListener('click',()=>light(b.dataset.light));
$('pause').addEventListener('click',pause);$('lantern').addEventListener('click',()=>{s.lantern=!s.lantern;ui();});
$('clean').addEventListener('click',()=>clean(true));$('restore').addEventListener('click',()=>clean(false));
function setGardenMenu(open,{resume=true}={}){
  const wasOpen=document.body.classList.contains('world-open');
  if(open&&!wasOpen){menuWasRunning=Boolean(mission?.snapshot().running)&&!s.paused;mission?.pause({preserveHold:true});pad.stop(true);s.paused=true;}
  document.body.classList.toggle('world-open',open);$('world-controls').setAttribute('aria-expanded',String(open));
  if(!open&&wasOpen){const continueFlight=resume&&menuWasRunning&&!tutorialActive&&!s.gameOver;menuWasRunning=false;if(continueFlight){s.paused=false;mission?.start();}}
  ui();
}
$('world-controls').addEventListener('click',()=>setGardenMenu(!document.body.classList.contains('world-open')));
$('menu-close').addEventListener('click',()=>setGardenMenu(false));
function closeExitConfirmation(resume){$('exit-confirm').hidden=true;if(resume&&exitWasRunning){s.paused=false;mission.start();}exitWasRunning=false;world.focus({preventScroll:true});ui();}
$('garden-home').addEventListener('click',()=>{const model=mission.snapshot();if(!currentRoute||model.complete||s.gameOver){showGardenStart();return;}exitWasRunning=model.running&&!s.paused;mission.pause({preserveHold:true});pad.stop(true);s.paused=true;keys.clear();$('exit-confirm').hidden=false;$('exit-cancel').focus({preventScroll:true});ui();});
$('exit-cancel').addEventListener('click',()=>closeExitConfirmation(true));
$('exit-accept').addEventListener('click',()=>{closeExitConfirmation(false);showGardenStart();});
$('start-random').addEventListener('click',randomGardenRoute);
$('start-choose').addEventListener('click',async()=>{hideGardenStart();await studio.refresh();renderGardenRouteList();setGardenMenu(true);});
$('retry-mission').addEventListener('click',retryCurrentMission);
$('library-open').addEventListener('click',()=>studio.open());$('studio-close').addEventListener('click',()=>studio.close());$('studio-capture').addEventListener('click',()=>studio.toggleCapture());$('studio-save').addEventListener('click',()=>studio.save());
$('mission-toggle').addEventListener('click',async()=>{const model=mission.snapshot();if(model.running){s.paused=true;keys.clear();mission.pause({preserveHold:true});pad.stop(true);ui();return;}try{await pad.unlock();s.paused=false;mission.start();ui();}catch(error){$('answer-feedback').textContent=error.message;}});
$('mission-restart').addEventListener('click',()=>{gardenRewards.reset();mission.restart();s.paused=false;ui();});
for(const [kind,spec] of Object.entries(GARDEN_ITEMS).filter(([,item])=>item.artifact)){
  const button=document.createElement('button'),badge=document.createElement('b');
  button.dataset.useArtifact=kind;button.title=spec.label;button.setAttribute('aria-label',spec.label);
  if(spec.navigationDelta)button.append(document.createTextNode(`${spec.navigationDelta>0?'+':'−'}${Math.abs(spec.navigationDelta)}`));
  else if(spec.assist&&!spec.assist.reveal&&!spec.sprite){const canvas=document.createElement('canvas');canvas.width=canvas.height=80;canvas.setAttribute('aria-hidden','true');const icon=canvas.getContext('2d');icon.translate(40,40);drawGardenAssistGlyph(icon,spec,72);button.append(canvas);}else{const image=document.createElement('img');image.src=`assets/echo-garden/collectibles/${spec.sprite}.webp`;image.alt='';image.style.filter=spec.visualFilter||'none';image.width=image.height=32;button.append(image);if(spec.repeat){const mark=document.createElement('span');mark.className='repeat-artifact-mark';mark.textContent='∞';button.append(mark);}}
  button.append(badge);$(spec.navigationDelta?'jump-charges':'assist-charges').append(button);
}
const flightTools=document.createElement('details'),flightToolsSummary=document.createElement('summary'),flightToolsBody=document.createElement('div');
flightTools.open=false;
flightTools.className='flight-tools';flightToolsSummary.innerHTML='<svg viewBox="0 0 40 40" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.2"><path d="M20 31C9 26 9 15 20 7C31 15 31 26 20 31Z"/><path d="M20 31C8 31 3 22 5 14C14 15 20 22 20 31ZM20 31C32 31 37 22 35 14C26 15 20 22 20 31Z"/><path d="M20 31C10 36 3 29 2 24C10 23 16 25 20 31ZM20 31C30 36 37 29 38 24C30 23 24 25 20 31Z"/></g></svg><span class="lotus-repeat" aria-hidden="true">∞</span>';flightToolsSummary.setAttribute('aria-label','Лотос: прыжки, повтор и подсказки');flightToolsBody.className='flight-tools-body';
flightToolsBody.append($('jump-charges'),document.querySelector('.route-practice'),$('assist-charges'),$('assist-status'));flightTools.append(flightToolsSummary,flightToolsBody);document.body.append(flightTools);$('artifact-belt').hidden=true;
document.addEventListener('click',async event=>{const button=event.target.closest('[data-use-artifact]');if(!button||button.disabled||s.paused||!mission?.snapshot().running)return;const kind=button.dataset.useArtifact;if(GARDEN_ITEMS[kind].repeat){try{await pad.unlock();if(!s.paused)gardenLife.useRepeat(mission,kind);}catch(error){$('answer-feedback').textContent=`Не удалось включить повтор: ${error.message}`;}}else if(GARDEN_ITEMS[kind].shield)gardenLife.useShield(mission,kind);else if(GARDEN_ITEMS[kind].navigationDelta)gardenLife.useJump(mission,kind);else{const result=gardenLife.useAssist(mission,kind);if(result.correct&&!result.ignored){gardenRewards.answer(result,'quality',{x:s.x/s.width,y:Math.max(.18,s.y/s.height-.15)});pad.feedback(true,{kind:'quality',complete:result.positionComplete}).catch(()=>{});}}renderVitals();});
$('infinity-continue').addEventListener('click',async()=>{if(s.paused||!mission.snapshot().running)return;try{await pad.unlock();mission.continue();flightTools.open=false;renderVitals();}catch(error){$('answer-feedback').textContent=`Не удалось продолжить: ${error.message}`;}});
$('infinity-toggle').addEventListener('click',async()=>{try{await pad.unlock();const result=gardenLife.useRepeat(mission);if(result.ignored){$('answer-feedback').textContent='Сначала поймай лотос бесконечности';return;}flightTools.open=false;renderVitals();}catch(error){$('answer-feedback').textContent=`Не удалось включить звук: ${error.message}`;}});
document.addEventListener('pointerdown',event=>{if(flightTools.open&&!flightTools.contains(event.target))flightTools.open=false;},true);
flightToolsBody.addEventListener('click',event=>{if(event.target.closest('button')&&!event.target.closest('button').disabled)flightTools.open=false;});
const flowerSettings=document.createElement('details'),flowerSettingsSummary=document.createElement('summary');
flowerSettings.className='flower-settings';flowerSettingsSummary.textContent='Цветы аранжировки · справочник и проба';
const assistGuide=document.createElement('section');assistGuide.className='assist-guide';assistGuide.innerHTML='<h3>Артефакты внимания</h3>';for(const [kind,spec] of Object.entries(GARDEN_ITEMS).filter(([,item])=>item.assist||item.shield||item.restoration)){const row=document.createElement('p');row.textContent=spec.restoration?'Колесо жизни — редкий вращающийся цветок. Подбор сразу восстанавливает все четыре запаса до 100%; чаще появляется у конца маршрута при критическом истощении, но спасение не гарантировано.':spec.label;row.style.setProperty('--artifact-color',spec.color);assistGuide.append(row);}flowerSettings.append(flowerSettingsSummary,assistGuide,$('flower-guide'));$('settings-panel').append(flowerSettings);$('flower-guide').hidden=false;
$('flower-guide-toggle').hidden=true;
$('flower-guide-close').addEventListener('click',()=>{flowerSettings.open=false;});
$('flower-guide-list').replaceChildren(...Object.entries(GARDEN_ARRANGEMENTS).map(([style,spec])=>{const item=document.createElement('article'),canvas=document.createElement('canvas');canvas.width=canvas.height=72;const icon=canvas.getContext('2d');icon.translate(36,36);drawGardenArrangementFlower(icon,spec,66,2);const copy=document.createElement('p');copy.textContent=`${spec.label} — ${spec.detail}`;const button=document.createElement('button');button.textContent='Вырастить на пути';button.setAttribute('aria-label',`Вырастить: ${spec.label}`);button.addEventListener('click',()=>{if(!mission.snapshot().running){$('flower-guide-note').textContent='Сначала запусти музыкальный полёт.';return;}if(gardenLife.entities.some(entity=>entity.item.arrangement&&!entity.collected)){ $('flower-guide-note').textContent='Цветок уже летит. Поймай его или пропусти.';return;}gardenLife.forceSpawn(style,{x:tx,y:Math.max(.06,ty-.30),rounds:Number($('flower-rounds').value),vx:0});flowerSettings.open=false;setGardenMenu(false);});item.append(canvas,copy,button);return item;}));
$('artifact-belt').addEventListener('click',event=>{if(event.target.closest('[data-use-artifact]')&&(s.paused||!mission.snapshot().running))event.stopImmediatePropagation();},true);
for(const button of document.querySelectorAll('[data-pad]'))button.addEventListener('click',()=>{pad.applyPreset(button.dataset.pad);for(const item of document.querySelectorAll('[data-pad]'))item.setAttribute('aria-pressed',String(item===button));});
$('speed').addEventListener('input',e=>{s.speed=Number(e.target.value);$('speed-value').value=s.speed.toFixed(1)+'×';});
$('altitude').addEventListener('input',e=>{s.altitude=Number(e.target.value);$('altitude-value').value=s.altitude.toFixed(2);s.worldSize=Math.max(s.width*.86,s.height*.95)/s.altitude;});
function move(x,y){tx=clamp(x/s.width,.1,.9);ty=clamp(y/s.height,.2,.78);$('gesture').classList.add('dismissed');}
world.addEventListener('pointerdown',e=>{if(e.button!==0||dragId!==null)return;dragId=e.pointerId;world.setPointerCapture(dragId);move(e.clientX,e.clientY);world.focus({preventScroll:true});});
world.addEventListener('pointermove',e=>{if(e.pointerId===dragId)move(e.clientX,e.clientY);});
for(const name of ['pointerup','pointercancel','lostpointercapture'])world.addEventListener(name,e=>{if(e.pointerId===dragId)dragId=null;});
addEventListener('keydown',e=>{
  if(e.ctrlKey||e.metaKey||e.altKey||e.target.closest?.('input,select,textarea,[contenteditable="true"]')||e.repeat&&['Space','KeyH'].includes(e.code))return;
  if(e.code==='Escape'&&!$('exit-confirm').hidden){e.preventDefault();closeExitConfirmation(true);return;}
  const cockpit=$('garden-start').hidden&&!document.body.classList.contains('world-open')&&!tutorialActive&&$('exit-confirm').hidden;
  if(!cockpit){if(e.code==='Escape'&&document.body.classList.contains('world-open'))setGardenMenu(false);return;}
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyW','KeyA','KeyS','KeyD'].includes(e.code)){e.preventDefault();keys.add(e.code);$('gesture').classList.add('dismissed');}
  if(e.code==='Space'){e.preventDefault();$('mission-toggle').click();}if(e.code==='KeyH')clean(!s.clean);if(e.code==='Escape'&&s.clean)clean(false);
},true);
addEventListener('keyup',e=>keys.delete(e.code));addEventListener('blur',()=>{keys.clear();dragId=null;});
document.addEventListener('visibilitychange',()=>{last=0;keys.clear();if(document.hidden){mission?.pause();pad.stop(true);s.paused=true;cancelAnimationFrame(raf);raf=0;}else{ui();if(!raf)raf=requestAnimationFrame(frame);}});
addEventListener('pagehide',()=>{mission?.pause();pad.stop(true);});
function update(dt){
  if(s.paused)return;
  s.time=mod(s.time+dt,Math.PI*2000);s.visit+=dt;
  s.travel=mod(s.travel+dt*s.speed*18,100000);
  s.scroll=mod(s.scroll+dt*s.speed*18/s.worldSize,2);
  gardenRewards.step(dt,{ground:dt*s.speed*18/s.height});
  s.growth=mod(s.growth+dt*.014,4);
  if(s.lightMode==='cycle')s.cycle=mod(s.cycle+dt*2,360);
  const target=s.lightMode==='day'?0:s.lightMode==='dusk'?.48:s.lightMode==='night'?1:(1-Math.cos(s.cycle*Math.PI/180))/2;
  s.night+=(target-s.night)*(1-Math.exp(-dt*.9));
  tx=clamp(tx+((keys.has('ArrowRight')||keys.has('KeyD')?1:0)-(keys.has('ArrowLeft')||keys.has('KeyA')?1:0))*dt*.28,.1,.9);
  ty=clamp(ty+((keys.has('ArrowDown')||keys.has('KeyS')?1:0)-(keys.has('ArrowUp')||keys.has('KeyW')?1:0))*dt*.22,.2,.78);
  const previousX=s.x,previousY=s.y,dx=tx*s.width-s.x;s.x+=dx*(1-Math.exp(-dt*5));s.y+=(ty*s.height-s.y)*(1-Math.exp(-dt*5));
  if(dt){const velocityX=(s.x-previousX)/dt/Math.max(1,s.width),velocityY=(s.y-previousY)/dt/Math.max(1,s.height),blend=1-Math.exp(-dt*8);s.motionX+=(velocityX-s.motionX)*blend;s.motionY+=(velocityY-s.motionY)*blend;}
  s.thrust=clamp(.46-s.motionY*1.9,.22,1);s.brake=clamp(s.motionY*2.4,0,1);
  s.angle+=(clamp(dx/s.width,-.3,.3)-s.angle)*(1-Math.exp(-dt*4));
  s.pan+=((s.x/s.width-.5)*.13-s.pan)*(1-Math.exp(-dt));
  const missionState=mission?.snapshot();
  gardenLife.update(dt,{...s,routeLength:missionState?.exercise.sequence.length||0,remainingChords:missionState?.progress.filter(part=>!part.degree||!part.quality).length??0,active:Boolean(missionState?.running),flying:!s.paused,answering:Boolean(missionState?.running&&missionState.cursor>=0)});
  const lifeState=gardenLife.snapshot();
  if(lifeState.gameOver&&!s.gameOver){s.gameOver=true;s.paused=true;mission?.pause();pad.stop(true);$('game-over').hidden=false;}
  const shake=lifeState.impact||0,shakeX=Math.sin(s.time*83)*shake*7,shakeY=Math.cos(s.time*71)*shake*5;
  document.documentElement.style.setProperty('--impact-x',`${shakeX.toFixed(2)}px`);document.documentElement.style.setProperty('--impact-y',`${shakeY.toFixed(2)}px`);
  document.body.classList.toggle('garden-impact',shake>.05);
  const hazardForce=gardenLife.getFlightForce();
  tx=clamp(tx+hazardForce.x*dt,.1,.9);ty=clamp(ty+hazardForce.y*dt,.2,.78);
  if(lifeState.event?.id!==lastCollisionEvent&&['crater','stoneAsteroid','porousAsteroid','crystalAsteroid','lavaAsteroid'].includes(lifeState.event?.kind)){
    lastCollisionEvent=lifeState.event.id;
    tx=clamp(tx+hazardForce.x*.11,.1,.9);ty=clamp(ty+hazardForce.y*.11,.2,.78);
    collisionThud();navigator.vibrate?.(35);
  }
}
function atmosphere(){
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,s.width,s.height);
  const brightness=.05+s.night*.7+(s.to===1?.15:0);
  ctx.globalCompositeOperation='lighter';
  for(const p of motes){
    const x=mod(p.x*s.width+Math.sin(s.time*.27+p.phase)*15-s.pan*s.worldSize,s.width);
    const y=mod(p.y*s.height+s.scroll*s.worldSize+Math.cos(s.time*.17+p.phase)*8,s.height);
    const pulse=.42+.58*Math.sin(s.time*1.7+p.phase)**2;
    const alpha=brightness*pulse;
    ctx.fillStyle=`rgba(139,248,178,${alpha*.05})`;ctx.beginPath();ctx.arc(x,y,p.r*7,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=`rgba(160,255,188,${alpha*.16})`;ctx.beginPath();ctx.arc(x,y,p.r*3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=`rgba(229,255,182,${alpha})`;ctx.beginPath();ctx.arc(x,y,p.r,0,Math.PI*2);ctx.fill();
  }
  ctx.globalCompositeOperation='source-over';
  gardenRewards.draw(ctx,s.width,s.height);
  if(new URLSearchParams(location.search).has('qa')){life.dataset.rewards=JSON.stringify(gardenRewards.snapshot());life.dataset.arrangement=JSON.stringify({status:mission?.snapshot().arrangementStatus||{},events:pad.lastArrangement||[],pickups:gardenLife.snapshot().entities.filter(item=>GARDEN_ITEMS[item.kind]?.arrangement)});}
  gardenLife.draw(ctx,s);
}
let uiTick=0;
function frame(now){
  raf=0;if(document.hidden)return;
  const frameMs=last?now-last:0,dt=Math.min(.05,frameMs/1000);last=now;
  if(mobileGraphics&&frameMs>0&&frameMs<250){slowFrameAverage=slowFrameAverage*.98+frameMs*.02;if(++graphicsSamples>180&&slowFrameAverage>27&&renderScale>1.1){renderScale=1.1;resize();}}
  if(s.ready&&!document.body.classList.contains('start-open')){update(dt);renderer.render({...s,lantern:s.lantern&&s.ship!==2});atmosphere();if(now-uiTick>200){ui();renderVitals();const model=mission.snapshot();$('bar-countdown').textContent=model.running?`${Math.max(0,(model.deadline-performance.now())/1000).toFixed(1)} сек`:`${model.barSeconds.toFixed(1)} сек`;uiTick=now;}}
  raf=requestAnimationFrame(frame);
}
async function load(){
  const lifeFiles=[...new Set(Object.values(GARDEN_ITEMS).map(item=>item.sprite).filter(Boolean))];
  const paths=[...STATES.map(x=>x.file),'manta','lotus',...lifeFiles.map(file=>`collectibles/${file}`)];
  const loadImage=file=>new Promise((resolve,reject)=>{
    const img=new Image(),timeout=setTimeout(()=>reject(Error(`Слишком долгая загрузка: ${file}. Попробуй снова.`)),20000);
    img.onload=()=>{clearTimeout(timeout);$('load-progress').textContent=`Готово ${++loaded} из ${paths.length}`;resolve(img);};img.onerror=()=>{clearTimeout(timeout);reject(Error(`Не загрузился пейзаж: ${file}. Попробуй снова.`));};
    const asset=window.GARDEN_ASSETS?.[file]||`assets/echo-garden/${file}.${file==='collectibles/meteor-volcanic'?'png':'webp'}`;img.src=!asset.startsWith('data:')&&(file==='manta'||file==='lotus')?`${asset}${asset.includes('?')?'&':'?'}cutout=2`:asset;
  });
  images=await Promise.all(paths.slice(0,6).map(loadImage));
  renderer=createGardenRenderer(world,shipLayer,images.slice(0,6));
  // Optional items must not block launch; install each sprite as it arrives.
  const spriteImages={};
  for(const file of lifeFiles)loadImage(`collectibles/${file}`).then(image=>{spriteImages[file]=image;gardenLife.setImages(spriteImages);}).catch(()=>{});
  s.ready=true;$('loading').hidden=true;dispatchEvent(new Event('garden-ready'));
  const params=new URLSearchParams(location.search);
  const index=Number(params.get('state'));if(Number.isInteger(index)&&index>=0&&index<4)chooseState(index);
  const phase=Number(params.get('phase'));if(Number.isFinite(phase)&&phase>=0&&phase<4)s.growth=phase;
  if(['day','dusk','night','cycle'].includes(params.get('light'))){light(params.get('light'));s.night=params.get('light')==='night'?1:params.get('light')==='dusk'?.48:0;}
  if(params.get('ship')==='lotus')s.ship=1;if(params.get('still')==='1')s.paused=true;
  if(params.get('studio')==='1')studio.open();else showGardenStart();
  ui();if(!raf)raf=requestAnimationFrame(frame);
}
function error(e){s.ready=false;$('loading').hidden=false;$('load-progress').textContent=e.message;$('retry').hidden=false;}
$('retry').addEventListener('click',()=>location.reload());
for(const canvas of [world,shipLayer])canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();s.ready=false;last=0;$('loading').hidden=false;$('load-progress').textContent='Восстанавливаем изображение…';});
for(const canvas of [world,shipLayer])canvas.addEventListener('webglcontextrestored',()=>{try{renderer?.dispose();renderer=createGardenRenderer(world,shipLayer,images.slice(0,6));s.ready=true;last=0;$('loading').hidden=true;}catch(e){error(e);}});
window.gardenFlight=Object.freeze({snapshot:()=>({...s,keys:keys.size,particles:motes.length,graphics:renderer?.diagnostics(),mission:mission.snapshot(),life:gardenLife.snapshot(),progress:{...progress},currentRoute:currentRoute?.id}),advanceChord:()=>mission.advance(),spawnCollectible:kind=>gardenLife.forceSpawn(kind,{x:.5,y:.22}),showMenu:()=>showGardenStart(),randomRoute:()=>randomGardenRoute()});
if(new URLSearchParams(location.search).get('qa')==='infinity'&&['127.0.0.1','localhost'].includes(location.hostname)){
 const probe=document.createElement('button');probe.id='qa-repeat-pickup';probe.textContent='Проверка: выпустить лотос ∞';probe.style.cssText='position:fixed;left:12px;bottom:180px;z-index:60;color:#d9edcd;background:#102922;border:1px solid #799e84;padding:8px';
 probe.addEventListener('click',()=>{if(!mission.snapshot().running)return;gardenLife.forceSpawn('hold',{x:s.x/s.width,y:s.y/s.height-.12,vx:0});});document.body.append(probe);
}
ui();renderVitals();updateProgressCard();load().catch(error);

return {};
})();
})();
