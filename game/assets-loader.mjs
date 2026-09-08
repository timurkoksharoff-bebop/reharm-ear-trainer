const pendingImages=new WeakMap();
export function loadFlightImage(image,url,timeout=20000){
  if(image.complete&&image.naturalWidth)return Promise.resolve();
  if(pendingImages.has(image))return pendingImages.get(image);
  const task=new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>finish(new Error(`Не загрузилась графика: ${url}. Проверь соединение и повтори.`)),timeout);
    const finish=error=>{clearTimeout(timer);image.onload=null;image.onerror=null;error?reject(error):resolve();};
    image.onload=()=>image.naturalWidth?finish():finish(new Error(`Пустая картинка: ${url}`));
    image.onerror=()=>finish(new Error(`Не загрузилась графика: ${url}. Нажми «Попробовать ещё».`));
    image.src=url;
  });
  pendingImages.set(image,task);
  task.then(()=>pendingImages.delete(image),()=>pendingImages.delete(image));
  return task;
}
