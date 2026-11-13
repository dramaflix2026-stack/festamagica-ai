'use client';
// Deterministic 16:9 Safari pennants: reference supplies illustration, code supplies exact text.
function loadImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('Não foi possível abrir a referência das bandeirolas'));img.src=src;});}
function flag(ctx,img,index,label,x,y,w,h){
 const sw=img.naturalWidth/5,sh=img.naturalHeight*.60;
 ctx.save();
 // V-shaped cutout, preserving the illustrated reference animal at the bottom.
 ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.lineTo(x+w,y+h*.70);ctx.lineTo(x+w/2,y+h);ctx.lineTo(x,y+h*.70);ctx.closePath();ctx.clip();
 ctx.drawImage(img,(index%5)*sw,0,sw,sh,x,y,w,h);
 // Replace reference lettering on the wooden center while retaining foliage and animals.
 const cx=x+w/2,cy=y+h*.34;
 const wood=ctx.createRadialGradient(cx,cy,15,cx,cy,w*.39);
 wood.addColorStop(0,'#ffdc8d');wood.addColorStop(.72,'#edb85d');wood.addColorStop(1,'#c98b3d');
 ctx.beginPath();ctx.ellipse(cx,cy,w*.34,h*.225,0,0,Math.PI*2);
 ctx.fillStyle=wood;ctx.fill();ctx.strokeStyle='#aa712d';ctx.lineWidth=5;ctx.stroke();
 ctx.fillStyle='rgba(255,255,255,.22)';
 for(let k=-2;k<=2;k++){ctx.beginPath();ctx.ellipse(cx,cy,w*(.14+k*.045),h*(.11+k*.021),0,0,Math.PI*2);ctx.strokeStyle='rgba(147,88,32,.10)';ctx.lineWidth=2;ctx.stroke();}
 ctx.textAlign='center';ctx.textBaseline='middle';
 const isAge=label.length>2;
 ctx.font='bold '+(isAge?63:145)+'px Georgia';
 ctx.lineJoin='round';ctx.lineWidth=isAge?7:11;ctx.strokeStyle='#fff7e4';
 ctx.strokeText(label,cx,cy+6,w*.60);
 ctx.fillStyle='#65371c';ctx.fillText(label,cx,cy+6,w*.60);
 ctx.restore();
 ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.lineTo(x+w,y+h*.70);ctx.lineTo(x+w/2,y+h);ctx.lineTo(x,y+h*.70);ctx.closePath();
 ctx.strokeStyle='#fff';ctx.lineWidth=10;ctx.stroke();
 ctx.strokeStyle='#608d3e';ctx.lineWidth=3;ctx.stroke();
}
export async function safariPennants16x9(d){
 const img=await loadImage('/references/Bandeirolas%20Safari%20Personalizadas%20da%20Sofia.png');
 const letters=Array.from(String(d.name||'').normalize('NFC').toLocaleUpperCase('pt-BR').replace(/\\s/g,''));
 letters.push(String(d.age)+' ANOS');
 const columns=3,rows=Math.ceil(letters.length/columns),pageH=1080;
 const canvas=document.createElement('canvas');canvas.width=1920;canvas.height=pageH* Math.ceil(rows/2);
 const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
 letters.forEach((letter,i)=>{
  const page=Math.floor(i/6),local=i%6,col=local%3,row=Math.floor(local/3);
  flag(ctx,img,i,letter,100+col*615,page*pageH+35+row*525,485,475);
 });
 return canvas.toDataURL('image/png');
}
export function pennantSheet16x9(source){
 return loadImage(source).then(img=>{
  const canvas=document.createElement('canvas');canvas.width=1920;canvas.height=1080;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,1920,1080);
  const scale=Math.min(1920/img.naturalWidth,1080/img.naturalHeight);
  const w=img.naturalWidth*scale,h=img.naturalHeight*scale;
  ctx.drawImage(img,(1920-w)/2,(1080-h)/2,w,h);
  return canvas.toDataURL('image/png');
 });
}
