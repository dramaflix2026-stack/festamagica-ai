'use client';
// Two fixed-size printable 16:9 sheets. Each individual flag occupies the same physical box.
function loadImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('Falha ao abrir bandeirolas'));img.src=src;});}
function extractFlags(img,count){
 const scan=document.createElement('canvas');scan.width=img.naturalWidth;scan.height=img.naturalHeight;
 const c=scan.getContext('2d',{willReadFrequently:true});c.drawImage(img,0,0);
 const {data,width:w,height:h}=c.getImageData(0,0,scan.width,scan.height);
 // The reference edits use a single horizontal row: 4 flags on page 1, 2 on page 2.
 // Divide into equal regions first, rather than trying to infer the number of objects
 // from thin green borders, which caused false failures.
 const regions=Array.from({length:count},(_,i)=>({left:Math.floor(i*w/count),right:Math.floor((i+1)*w/count)}));
 return regions.map(({left,right})=>{
  let x0=right,y0=h,x1=left,y1=0;
  for(let y=0;y<h;y+=2)for(let x=left;x<right;x+=2){
   const i=(y*w+x)*4,r=data[i],g=data[i+1],b=data[i+2],a=data[i+3];
   // A saturated pixel belongs to the illustrated flag, not to the white paper.
   if(a>160&&Math.min(r,g,b)<235&&(Math.max(r,g,b)-Math.min(r,g,b)>12||r+g+b<575)){
    x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);
   }
  }
  // Keep a generous safety margin so the S and the outside border never get clipped.
  if(x1<=x0||y1<=y0)return {x:left,y:0,w:right-left,h};
  const padX=Math.max(12,Math.round((x1-x0)*.06));
  const padY=Math.max(12,Math.round((y1-y0)*.04));
  const x=Math.max(left,x0-padX),y=Math.max(0,y0-padY);
  return {x,y,w:Math.min(right,x1+padX+2)-x,h:Math.min(h,y1+padY+2)-y};
 });
}
export async function normalizePennantPages(page1,page2){
 const images=await Promise.all([loadImage(page1),loadImage(page2)]);
 const boxes=[extractFlags(images[0],4),extractFlags(images[1],2)];
 const flagW=340,flagH=720,slotX=[175,585,995,1405],top=180;
 return images.map((img,page)=>{
  const canvas=document.createElement('canvas');canvas.width=1920;canvas.height=1080;
  const c=canvas.getContext('2d');c.fillStyle='#fff';c.fillRect(0,0,1920,1080);
  boxes[page].forEach((b,i)=>{
   const slot=page===0?i:i+1;
   // The printed dimensions are identical for all six flags, regardless of AI page scaling.
   c.drawImage(img,b.x,b.y,b.w,b.h,slotX[slot],top,flagW,flagH);
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
