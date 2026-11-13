'use client';
// Fixed-size two-page 16:9 print layout. Never ask the AI to choose final dimensions.
function loadImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('Falha ao abrir bandeirolas'));img.src=src;});}
function findFlags(img,count){
 const scan=document.createElement('canvas');scan.width=img.naturalWidth;scan.height=img.naturalHeight;
 const c=scan.getContext('2d',{willReadFrequently:true});c.drawImage(img,0,0);
 const {data,width:w,height:h}=c.getImageData(0,0,scan.width,scan.height);
 const occupied=new Uint32Array(w);
 // Ignore near-white print background and very faint image noise.
 for(let y=0;y<h;y+=3)for(let x=0;x<w;x+=2){
  const i=(y*w+x)*4,r=data[i],g=data[i+1],b=data[i+2],a=data[i+3];
  if(a>180&&Math.min(r,g,b)<225&&Math.max(r,g,b)-Math.min(r,g,b)>15)occupied[x]++;
 }
 const minCount=Math.max(3,Math.floor(h/3*.035));
 const groups=[];let start=-1;
 for(let x=0;x<=w;x++){
  const filled=x<w&&occupied[x]>minCount;
  if(filled&&start<0)start=x;
  if(!filled&&start>=0){if(x-start>Math.max(18,w*.025))groups.push({x:start,w:x-start});start=-1;}
 }
 // Merge small adjacent image fragments when they belong to one flag.
 while(groups.length>count){
  let best=0,gap=Infinity;
  for(let i=0;i<groups.length-1;i++){const d=groups[i+1].x-(groups[i].x+groups[i].w);if(d<gap){gap=d;best=i;}}
  const first=groups[best],last=groups[best+1];
  groups.splice(best,2,{x:first.x,w:last.x+last.w-first.x});
 }
 if(groups.length!==count)throw Error('Não foi possível identificar as '+count+' bandeirolas sem risco de corte. Gere novamente.');
 return groups.map(g=>{
  const left=Math.max(0,g.x-5),right=Math.min(w,g.x+g.w+5);
  let top=h,bottom=0;
  for(let y=0;y<h;y+=2)for(let x=left;x<right;x+=2){
   const i=(y*w+x)*4,r=data[i],gg=data[i+1],b=data[i+2],a=data[i+3];
   if(a>180&&Math.min(r,gg,b)<225&&Math.max(r,gg,b)-Math.min(r,gg,b)>15){top=Math.min(top,y);bottom=Math.max(bottom,y);}
  }
  if(bottom<=top)throw Error('Bandeirola vazia detectada');
  return {x:left,y:Math.max(0,top-6),w:right-left,h:Math.min(h,bottom+8)-Math.max(0,top-6)};
 });
}
export async function normalizePennantPages(page1,page2){
 const images=await Promise.all([loadImage(page1),loadImage(page2)]);
 const boxes=[findFlags(images[0],4),findFlags(images[1],2)];
 // All flags use the same 340 x 720 px physical print box on both 1920x1080 pages.
 const targetW=340,targetH=720,slotX=[175,585,995,1405],top=180;
 return images.map((img,page)=>{
  const canvas=document.createElement('canvas');canvas.width=1920;canvas.height=1080;
  const c=canvas.getContext('2d');c.fillStyle='#fff';c.fillRect(0,0,1920,1080);
  boxes[page].forEach((b,i)=>{
   const slot=page===0?i:i+1;
   const scale=Math.min(targetW/b.w,targetH/b.h);
   const dw=b.w*scale,dh=b.h*scale;
   c.drawImage(img,b.x,b.y,b.w,b.h,slotX[slot]+(targetW-dw)/2,top+(targetH-dh)/2,dw,dh);
  });
  return canvas.toDataURL('image/png');
 });
}
export function pennantSheet16x9(source){
 return loadImage(source).then(img=>{
  const canvas=document.createElement('canvas');canvas.width=1920;canvas.height=1080;
  const c=canvas.getContext('2d');c.fillStyle='#fff';c.fillRect(0,0,1920,1080);
  const scale=Math.min(1920/img.naturalWidth,1080/img.naturalHeight);
  const w=img.naturalWidth*scale,h=img.naturalHeight*scale;
  c.drawImage(img,(1920-w)/2,(1080-h)/2,w,h);
  return canvas.toDataURL('image/png');
 });
}
