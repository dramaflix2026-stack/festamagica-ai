'use client';
// OpenAI image edits support 1536x1024; export the printable pennant sheet at exact 16:9.
export function pennantSheet16x9(source){
 return new Promise((resolve,reject)=>{
  const img=new Image();
  img.onload=()=>{
   const canvas=document.createElement('canvas');
   canvas.width=1920;canvas.height=1080;
   const ctx=canvas.getContext('2d');
   ctx.fillStyle='#ffffff';ctx.fillRect(0,0,1920,1080);
   // Preserve every cuttable flag without cropping or stretching.
   const scale=Math.min(1920/img.naturalWidth,1080/img.naturalHeight);
   const w=img.naturalWidth*scale,h=img.naturalHeight*scale;
   ctx.drawImage(img,(1920-w)/2,(1080-h)/2,w,h);
   resolve(canvas.toDataURL('image/png'));
  };
  img.onerror=()=>reject(new Error('Não foi possível preparar as bandeirolas em 16:9'));
  img.src=source;
 });
}
