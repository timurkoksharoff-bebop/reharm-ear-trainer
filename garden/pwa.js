/* A worker update is applied only while the main menu is open. Player storage
   is never cleared, and an active flight is never interrupted. */
(()=>{
 const version='1.46',worker=navigator.serviceWorker;
 if(!worker||location.protocol==='file:'||(['localhost','127.0.0.1'].includes(location.hostname)&&!new URLSearchParams(location.search).has('offline-test')))return;
 let pending=false,reloading=false,registration,lastCheck=0;
 const reloadFromMenu=()=>{
  const menu=document.querySelector('#garden-start');
  if(pending&&!reloading&&!document.hidden&&menu&&!menu.hidden&&document.body.classList.contains('start-open')){reloading=true;location.reload();}
 };
 const inspect=controller=>{
  if(!controller)return;
  const channel=new MessageChannel(),timer=setTimeout(()=>channel.port1.close(),2000);
  channel.port1.onmessage=event=>{clearTimeout(timer);channel.port1.close();if(controller!==worker.controller)return;if(event.data?.type==='EAR_YOGA_VERSION'&&event.data.version!==version){pending=true;reloadFromMenu();}};
  controller.postMessage({type:'EAR_YOGA_VERSION'},[channel.port2]);
 };
 worker.addEventListener('controllerchange',()=>inspect(worker.controller));
 new MutationObserver(reloadFromMenu).observe(document.body,{attributes:true,subtree:true,attributeFilter:['hidden','class']});
 const check=()=>{if(!registration||!navigator.onLine||Date.now()-lastCheck<60000)return;lastCheck=Date.now();registration.update().catch(()=>{});};
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){reloadFromMenu();check();}});
 addEventListener('online',check);
 addEventListener('focus',check);
 addEventListener('pageshow',check);
 setInterval(()=>{if(!document.hidden&&document.body.classList.contains('start-open'))check();},60000);
 worker.register('./service-worker.js',{scope:'./',updateViaCache:'none'}).then(value=>{registration=value;inspect(worker.controller);check();}).catch(()=>{});
})();
