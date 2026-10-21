import {GARDEN_COVER_LAYOUT} from './garden-cover-layout.mjs';

// The user's exported atelier coordinates share the original863×1823 cover.
// Keep these live HTML labels, including Settings, above the unchanged menu art.
export function mountChosenCoverBrand(){
 const shell=document.querySelector('.garden-start-shell'),settings=document.getElementById('start-menu');
 if(!shell||!settings||shell.querySelector('.chosen-cover-brand'))return;
 const {objects,referenceViewport,settingsIcon}=GARDEN_COVER_LAYOUT;
 const layer=document.createElement('div');layer.className='chosen-cover-brand';layer.dataset.variant='3';
 layer.style.width=referenceViewport.width+'px';layer.style.height=referenceViewport.height+'px';
 const shown=o=>o.textCase==='upper'?o.text.toLocaleUpperCase():o.textCase==='lower'?o.text.toLocaleLowerCase():o.textCase==='title'?o.text.toLocaleLowerCase().replace(/(^|\s)\p{L}/gu,s=>s.toLocaleUpperCase()):o.text;
 function place(el,o){el.style.left=o.x+'px';el.style.top=o.y+'px';el.style.transform=`translate(-50%,-50%) rotate(${o.rotation}deg)`;el.style.color=o.color;el.hidden=!o.visible;}
 for(const id of ['title','college']){
  const o=objects[id],el=document.createElement('span');el.id='cover-brand-'+id;el.className='chosen-brand-text';el.dataset.userContent='';el.setAttribute('translate','no');el.textContent=shown(o);el.style.fontFamily='"'+o.font+'",serif';el.style.fontSize=o.size+'px';el.style.fontWeight=o.weight;el.style.fontStyle=o.italic?'italic':'normal';el.style.letterSpacing=o.tracking+'px';place(el,o);layer.append(el);
 }
 const lotus=document.createElement('span'),o=objects.lotus;lotus.id='cover-brand-lotus';lotus.className='chosen-brand-lotus';lotus.setAttribute('aria-hidden','true');lotus.style.width=o.size+'px';lotus.style.height=o.size*.75+'px';place(lotus,o);
 // Same approved five-petal contour used by the selected atelier mark.
 lotus.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" fill="none"><g stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><g transform="translate(30 8) scale(2.5)" stroke-width=".6"><path d="M20 31C9 26 9 15 20 7C31 15 31 26 20 31Z"/><path d="M20 31C8 31 3 22 5 14C14 15 20 22 20 31ZM20 31C32 31 37 22 35 14C26 15 20 22 20 31Z"/><path d="M20 31C10 36 3 29 2 24C10 23 16 25 20 31ZM20 31C30 36 37 29 38 24C30 23 24 25 20 31Z"/></g></g></svg>';
 layer.append(lotus);
 const option=objects.settings,label=settings.querySelector('span:not(.reference-face)');label.textContent=shown(option);settings.dataset.brandVariant='3';
 const properties={left:option.x+'px',top:option.y+'px',transform:`translate(-50%,-50%) rotate(${option.rotation}deg)`,'font-family':'"'+option.font+'",sans-serif','font-size':option.size+'px','font-weight':option.weight,'font-style':option.italic?'italic':'normal','letter-spacing':option.tracking+'px',color:option.color};
 for(const [name,value]of Object.entries(properties))settings.style.setProperty(name,value,'important');settings.hidden=!option.visible;settings.querySelector('.settings-mark').hidden=!settingsIcon;layer.append(settings);shell.append(layer);
 const resize=()=>{const scale=shell.clientWidth/referenceViewport.width;layer.style.transform=`scale(${scale})`;layer.style.setProperty('--chosen-hit',44/Math.max(.001,scale)+'px');};
 new ResizeObserver(resize).observe(shell);resize();
}
