'use client';
// Normalize the AI-edited reference artwork to a true 16:9 printable PNG.
function loadImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('Não foi possível processar a arte das bandeirolas'));img.src=src;});}
export function pennantSheet16x9(source){
 return loadImage(source).then(img=>{
  const canvas=document.createElement('canvas');canvas.width=1920;canvas.height=1080;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,1920,1080);
  const scale=Math.max(1920/img.naturalWidth,1080/img.naturalHeight);
  const w=img.naturalWidth*scale,h=img.naturalHeight*scale;
  // Center-crop the AI edit to fill the landscape print sheet without adding letterbox bars.
  ctx.drawImage(img,(1920-w)/2,(1080-h)/2,w,h);
  return canvas.toDataURL('image/png');
 });
}
