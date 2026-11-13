'use client';
// Deterministic 16:9 Safari pennants: reference supplies illustration, code supplies exact text.
function loadImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('Não foi possível abrir a referência das bandeirolas'));img.src=src;});}
function flag(ctx,img,index,label,x,y,w,h){
 const sw=img.naturalWidth/5,sh=img.naturalHeight*.60;
 const cx=x+w/2;
 // True pointed pennant: the side edges converge to one bottom tip.
 const triangle=()=>{ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.lineTo(cx,y+h);ctx.closePath();};
 ctx.save();triangle();ctx.clip();
 // Reuse the approved artwork; shift the animal illustration into the visible lower half.
 ctx.drawImage(img,(index%5)*sw,0,sw,sh,x,y,w,h);
 // Cover only the upper lettering area, without opaque ovals over the animals.
 const fade=ctx.createLinearGradient(0,y+25,0,y+h*.56);
 fade.addColorStop(0,'rgba(255,220,139,.97)');
 fade.addColorStop(.58,'rgba(255,219,138,.96)');
 fade.addColorStop(1,'rgba(255,219,138,0)');
 ctx.fillStyle=fade;ctx.fillRect(x+w*.15,y+35,w*.70,h*.52);
 // Tropical leaf accents along the upper corners are retained from the reference.
 ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
 const age=label.includes(' ANOS');
 if(age){
  const [number]=label.split(' ');
  ctx.font='bold 108px Georgia';ctx.lineWidth=10;ctx.strokeStyle='#fff8e5';
  ctx.strokeText(number,cx,y+h*.23,w*.63);ctx.fillStyle='#683718';ctx.fillText(number,cx,y+h*.23,w*.63);
  ctx.font='bold 66px Georgia';ctx.lineWidth=8;ctx.strokeStyle='#fff8e5';
  ctx.strokeText('ANOS',cx,y+h*.40,w*.68);ctx.fillStyle='#683718';ctx.fillText('ANOS',cx,y+h*.40,w*.68);
 }else{
  ctx.font='bold 180px Georgia';ctx.lineWidth=13;ctx.strokeStyle='#fff8e5';
  ctx.strokeText(label,cx,y+h*.31,w*.70);ctx.fillStyle='#683718';ctx.fillText(label,cx,y+h*.31,w*.70);
 }
 ctx.restore();
 triangle();ctx.strokeStyle='#ffffff';ctx.lineWidth=12;ctx.stroke();
 triangle();ctx.strokeStyle='#4d8b3c';ctx.lineWidth=4;ctx.stroke();
}
export function pennantSheet16x9(source){
 return loadImage(source).then(img=>{
  const canvas=document.createElement('canvas');canvas.width=1920;canvas.height=1080;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,1920,1080);
  const scale=Math.max(1920/img.naturalWidth,1080/img.naturalHeight);
  const w=img.naturalWidth*scale,h=img.naturalHeight*scale;
  // Fill the complete 16:9 printable page; crop only the outer excess, never shrink the flags.
  ctx.drawImage(img,(1920-w)/2,(1080-h)/2,w,h);
  return canvas.toDataURL('image/png');
 });
}
