/* A worker update is applied only while the main menu is open. Player storage
   is never cleared, and an active flight is never interrupted. */
(()=>{
 const version='1.68',worker=navigator.serviceWorker;
 if(!worker||location.protocol==='file:'||(['localhost','127.0.0.1'].includes(location.hostname)&&!new URLSearchParams(location.search).has('offline-test')))return;
 let pending=false,reloading=false,registration,lastCheck=0;
 const reloadFromMenu=()=>{
  const menu=document.querySelector('#garden-start');
  const overlay=document.querySelector('dialog[open],#garden-skill-atlas:not([hidden])');
  if(pending&&!reloading&&!document.hidden&&!overlay&&!document.body.classList.contains('mode-layout-editing')&&menu&&!menu.hidden&&document.body.classList.contains('start-open')){reloading=true;location.reload();}
 };
 const inspect=controller=>{
  if(!controller)return;
  const channel=new MessageChannel(),timer=setTimeout(()=>channel.port1.close(),2000);
  channel.port1.onmessage=event=>{clearTimeout(timer);channel.port1.close();if(controller!==worker.controller)return;if(event.data?.type==='EAR_YOGA_VERSION'&&event.data.version!==version){pending=true;reloadFromMenu();}};
  controller.postMessage({type:'EAR_YOGA_VERSION'},[channel.port2]);
 };
 worker.addEventListener('controllerchange',()=>inspect(worker.controller));
 new MutationObserver(reloadFromMenu).observe(document.body,{attributes:true,subtree:true,attributeFilter:['hidden','class','open']});
 const activate=()=>registration?.waiting?.postMessage({type:'EAR_YOGA_ACTIVATE'});
 const watch=()=>{const installing=registration?.installing;if(installing)installing.addEventListener('statechange',activate);activate();};
 const check=()=>{if(!registration||!navigator.onLine||Date.now()-lastCheck<60000)return;activate();if(registration.installing||registration.waiting)return;lastCheck=Date.now();registration.update().catch(()=>{});};
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){reloadFromMenu();check();}});
 addEventListener('online',check);
 addEventListener('focus',check);
 addEventListener('pageshow',check);
 setInterval(()=>{if(!document.hidden&&document.body.classList.contains('start-open'))check();},60000);
 worker.register('./service-worker.js',{scope:'./',updateViaCache:'none'}).then(value=>{registration=value;registration.addEventListener('updatefound',watch);watch();inspect(worker.controller);check();}).catch(()=>{});
})();
