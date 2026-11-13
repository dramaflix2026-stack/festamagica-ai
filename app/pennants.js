'use client';
// Deterministic printable pennants: exact character count and order, no AI-generated letters.
function load(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('Falha ao abrir referência'));img.src=src;});}
function flag(ctx,img,x,y,w,h,letter,index){
 const mid=x+w/2;
 ctx.save();
 ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.lineTo(x+w,y+h*.73);ctx.lineTo(mid,y+h);ctx.lineTo(x,y+h*.73);ctx.closePath();ctx.clip();
 // Preserve reference artwork as a background texture, then place exact lettering on a decorative panel.
 const sourceW=img.naturalWidth/5,sourceH=img.naturalHeight*.62;
 const sx=(index%5)*sourceW;
 ctx.drawImage(img,sx,0,sourceW,sourceH,x,y,w,h);
 const grad=ctx.createLinearGradient(x,y,x+w,y+h);
 grad.addColorStop(0,'#ffe4a2');grad.addColorStop(.5,'#f8cb70');grad.addColorStop(1,'#d69a48');
 ctx.fillStyle=grad;ctx.strokeStyle='#86502a';ctx.lineWidth=5;
 ctx.beginPath();ctx.roundRect(x+w*.13,y+h*.20,w*.74,h*.43,25);ctx.fill();ctx.stroke();
 ctx.font='bold '+(letter.length>2?68:145)+'px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';
 ctx.lineWidth=9;ctx.strokeStyle='#fff6dc';ctx.strokeText(letter,mid,y+h*.405,w*.67);
 ctx.fillStyle='#633718';ctx.fillText(letter,mid,y+h*.405,w*.67);
 ctx.restore();
 ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.lineTo(x+w,y+h*.73);ctx.lineTo(mid,y+h);ctx.lineTo(x,y+h*.73);ctx.closePath();ctx.strokeStyle='#f5dba4';ctx.lineWidth=8;ctx.stroke();
 ctx.strokeStyle='#477c31';ctx.lineWidth=3;ctx.stroke();
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
