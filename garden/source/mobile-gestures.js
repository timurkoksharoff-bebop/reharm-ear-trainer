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
      // Preserve quick taps on all native game controls, including the lotus
      // summary. Cancelling zoom without restoring its click swallowed rapid
      // menu taps. Disabled controls remain inactive.
      const control=event.target.closest?.('button,summary,a[href]');
      if(control&&!control.disabled&&control.getAttribute('aria-disabled')!=='true')control.click();
    }
    previousTap = now;
  }, {passive:false});
  const style = document.createElement('style');
  style.textContent = 'html,body{overscroll-behavior:none;touch-action:pan-x pan-y;-webkit-text-size-adjust:100%;text-size-adjust:100%}body,body *{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}button,a,summary,canvas{touch-action:none}input,textarea,select,[contenteditable="true"]{-webkit-user-select:text;user-select:text;touch-action:auto}input[type="text"],input[type="search"],textarea,select{font-size:max(16px,1em)}.overlay,.menu-panel,.flower-guide,.flight-tools-body,.answers-panel,.route-list,.studio,.library-panel,[role="dialog"]{touch-action:pan-y}';
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
