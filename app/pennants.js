'use client';
// Deterministic printable pennants: exact character count and order, no AI-generated letters.
function load(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('Falha ao abrir referência'));img.src=src;});}
function flag(ctx,img,x,y,w,h,letter,index){
 const mid=x+w/2;
 ctx.save();
 ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.lineTo(mid,y+h);ctx.closePath();ctx.clip();
 // Use the approved premium pennant image as the decoration; preserve animals and foliage.
 // Original approved reference has five pennants across its upper row.
 const sw=img.naturalWidth/5,sh=img.naturalHeight*.52;
 ctx.drawImage(img,(index%5)*sw,0,sw,sh,x,y,w,h);
 // Only soften the central lettering area, without a large opaque shield or card.
 const gradient=ctx.createRadialGradient(mid,y+h*.39,w*.06,mid,y+h*.39,w*.42);
 gradient.addColorStop(0,'rgba(255,238,179,.94)');
 gradient.addColorStop(.55,'rgba(255,231,169,.62)');
 gradient.addColorStop(1,'rgba(255,231,169,0)');
 ctx.fillStyle=gradient;ctx.fillRect(x,y,w,h*.75);
 ctx.textAlign='center';ctx.textBaseline='middle';
 const isAge=letter.length>2;
 ctx.font='bold '+(isAge?68:155)+'px Georgia';
 ctx.lineJoin='round';ctx.lineWidth=isAge?8:12;
 ctx.strokeStyle='#fff6db';ctx.strokeText(letter,mid,y+h*.36,w*.78);
 ctx.fillStyle='#70401e';ctx.fillText(letter,mid,y+h*.36,w*.78);
 ctx.restore();
 ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.lineTo(mid,y+h);ctx.closePath();
 ctx.strokeStyle='#fff7e8';ctx.lineWidth=9;ctx.stroke();
 ctx.strokeStyle='#659044';ctx.lineWidth=3;ctx.stroke();
}
export async function buildPennants(source,d){
 const img=await load(source);
 const letters=Array.from(String(d.name||'').normalize('NFC').toLocaleUpperCase('pt-BR').replace(/\\s+/g,''));
 letters.push(String(d.age)+' ANOS');
 const columns=3,rows=2,w=1536,h=1024,perPage=columns*rows;
 const pages=Math.ceil(letters.length/perPage);
 const out=document.createElement('canvas');out.width=w;out.height=h*pages;
 const c=out.getContext('2d');c.fillStyle='#fff';c.fillRect(0,0,out.width,out.height);
 letters.forEach((letter,i)=>{
  const page=Math.floor(i/perPage),local=i%perPage,col=local%columns,row=Math.floor(local/columns);
  flag(c,img,88+col*495,page*h+40+row*492,370,420,letter,i);
 });
 return out.toDataURL('image/png');
}
