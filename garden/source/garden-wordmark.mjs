// Approved Variant3: cover/map fonts and the original five-petal lotus.
// Both lines share the same optical frame; no font asset or artwork duplicate.
const GARDEN_WORDMARK_SVG='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 194 82" width="194" height="82" class="garden-wordmark-v3" role="img" aria-label="EAR YOGA · SPACE MUSIC COLLEGE" data-brand-variant="3" data-user-content="" translate="no" style="display:block;max-width:100%;height:auto;overflow:visible"><svg x="76.5" y="0" width="41" height="30.75" viewBox="0 0 160 120" fill="none" aria-hidden="true"><g stroke="#f4e1bb" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><g transform="translate(30 8) scale(2.5)" stroke-width=".6"><path d="M20 31C9 26 9 15 20 7C31 15 31 26 20 31Z"/><path d="M20 31C8 31 3 22 5 14C14 15 20 22 20 31ZM20 31C32 31 37 22 35 14C26 15 20 22 20 31Z"/><path d="M20 31C10 36 3 29 2 24C10 23 16 25 20 31ZM20 31C30 36 37 29 38 24C30 23 24 25 20 31Z"/></g></g></svg><text x="0" y="62" fill="#f4e1bb" font-family="Cormorant,serif" font-size="31.6" font-weight="400" letter-spacing="1.26" textLength="194" lengthAdjust="spacingAndGlyphs">EAR YOGA</text><text x="0" y="78" fill="#a7e3df" font-family="Forum,serif" font-size="8.02" font-weight="400" letter-spacing="4.8" textLength="194" lengthAdjust="spacingAndGlyphs">SPACE MUSIC COLLEGE</text></svg>';

export function gardenWordmarkMarkup(){return GARDEN_WORDMARK_SVG;}
export function createGardenWordmark(){
 const template=document.createElement('template');template.innerHTML=gardenWordmarkMarkup();
 return template.content.firstElementChild;
}
