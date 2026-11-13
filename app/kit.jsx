'use client';
import {useState} from 'react';
const sizes={convite:[1024,1536],topper:[1200,1200],tags:[1200,1600],bandeirolas:[1600,1000],boasvindas:[1200,1600],digital:[1080,1080]};
const labels={convite:'Convite',topper:'Topper para bolo',tags:'Tags para lembrancinhas',bandeirolas:'Bandeirolas',boasvindas:'Placa de boas-vindas',digital:'Arte para WhatsApp'};
const palette={safari:['#f3f1d9','#51764e'],espaco:['#e9e6fc','#5545a4'],jardim:['#fae5f1','#ad578f']};
function wrap(c,text,x,y,maxWidth,lineHeight,maxLines=3){
 const words=String(text||'').split(/\s+/);let line='',lines=[];
 for(const word of words){const next=line?line+' '+word:word;if(c.measureText(next).width>maxWidth&&line){lines.push(line);line=word;}else line=next;}
 if(line)lines.push(line);lines.slice(0,maxLines).forEach((s,i)=>c.fillText(s,x,y+i*lineHeight,maxWidth));
}
function makeCanvas(w,h){const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;return [canvas,canvas.getContext('2d')];}
function decorate(c,img,w,h,theme){const [light,dark]=palette[theme]||palette.safari;c.fillStyle=light;c.fillRect(0,0,w,h);c.save();c.globalAlpha=.37;c.drawImage(img,0,0,w,h);c.restore();c.strokeStyle=dark;c.lineWidth=6;c.strokeRect(28,28,w-56,h-56);return dark;}
function text(c,value,x,y,size,color,maxWidth,weight='bold'){c.fillStyle=color;c.font=weight+' '+size+'px Georgia';c.textAlign='center';c.fillText(String(value),x,y,maxWidth);}
function renderPiece(img,key,d){
 const [w,h]=sizes[key], [canvas,c]=makeCanvas(w,h),dark=decorate(c,img,w,h,d.theme);
 const date=d.date?d.date.split('-').reverse().join('/'):'Data a confirmar',time=d.time||'Horário a confirmar',venue=d.venue||'Local a confirmar';
 c.fillStyle='rgba(255,255,255,.91)';
 if(key==='convite'){c.beginPath();c.roundRect(95,515,w-190,510,40);c.fill();text(c,'Você está convidado!',w/2,610,46,dark,w-240);text(c,d.name,w/2,735,78,'#4d365f',w-250);text(c,d.age+' anos de magia!',w/2,817,54,dark,w-250);text(c,date+'  •  '+time,w/2,906,32,'#564b5e',w-220,'normal');c.font='30px Arial';c.fillStyle='#564b5e';c.textAlign='center';wrap(c,venue,w/2,963,w-240,38,2);}
 if(key==='topper'){c.beginPath();c.arc(w/2,h/2,440,0,Math.PI*2);c.fill();text(c,'Feliz aniversário',w/2,440,57,dark,850);text(c,d.name,w/2,595,103,'#4d365f',800);text(c,d.age+' anos',w/2,715,75,dark,800);text(c,'✦ ✦ ✦',w/2,800,55,dark,700);}
 if(key==='tags'){for(let i=0;i<6;i++){const x=65+(i%2)*560,y=85+Math.floor(i/2)*500;c.fillStyle='rgba(255,255,255,.91)';c.beginPath();c.roundRect(x,y,510,455,24);c.fill();c.strokeStyle=dark;c.lineWidth=3;c.strokeRect(x+15,y+15,480,425);text(c,'Obrigado por vir!',x+255,y+170,39,dark,445);text(c,d.name,x+255,y+265,61,'#4d365f',440);text(c,d.age+' anos',x+255,y+340,39,dark,440);}}
 if(key==='bandeirolas'){const letters=[...d.name.toLocaleUpperCase('pt-BR')].slice(0,12);const cols=Math.min(6,Math.max(1,letters.length));const rows=Math.ceil(letters.length/cols);const bw=230,bh=340;letters.forEach((letter,i)=>{const x=(w-cols*bw)/2+(i%cols)*bw,y=(h-rows*bh)/2+Math.floor(i/cols)*bh;c.fillStyle='rgba(255,255,255,.93)';c.beginPath();c.moveTo(x+10,y);c.lineTo(x+bw-10,y);c.lineTo(x+bw-10,y+bh-80);c.lineTo(x+bw/2,y+bh);c.lineTo(x+10,y+bh-80);c.closePath();c.fill();text(c,letter,x+bw/2,y+210,130,dark,bw-30);});}
 if(key==='boasvindas'){c.beginPath();c.roundRect(90,480,w-180,640,45);c.fill();text(c,'Bem-vindos à festa!',w/2,610,57,dark,w-240);text(c,d.name,w/2,780,106,'#4d365f',w-230);text(c,d.age+' anos',w/2,895,74,dark,w-240);text(c,'Que bom ter você aqui!',w/2,1010,39,dark,w-240);}
 if(key==='digital'){c.beginPath();c.roundRect(90,340,w-180,470,45);c.fill();text(c,'Vamos comemorar!',w/2,445,60,dark,w-240);text(c,d.name,w/2,555,90,'#4d365f',w-230);text(c,d.age+' anos',w/2,630,59,dark,w-230);text(c,date+' · '+time,w/2,706,31,dark,w-220);c.font='28px Arial';c.fillStyle=dark;c.textAlign='center';wrap(c,venue,w/2,763,w-230,35,2);}
 return canvas.toDataURL('image/png');
}
export async function createKit(background,d){
 const img=new Image();img.src=background;await new Promise((res,rej)=>{img.onload=res;img.onerror=rej;});
 return Object.fromEntries(Object.keys(sizes).map(k=>[k,renderPiece(img,k,d)]));
}
export default function KitGallery({kit,name,onReset}){
 const [busy,setBusy]=useState(false);const [err,setErr]=useState('');
 async function downloadAll(){setBusy(true);setErr('');try{const {default:JSZip}=await import('jszip');const zip=new JSZip();for(const [key,url] of Object.entries(kit))zip.file(key+'.png',url.split(',')[1],{base64:true});const blob=await zip.generateAsync({type:'blob'});const href=URL.createObjectURL(blob);const a=document.createElement('a');a.href=href;a.download='festamagica-kit-'+name.toLowerCase().replace(/[^a-z0-9]/g,'-')+'.zip';a.click();setTimeout(()=>URL.revokeObjectURL(href),30000);}catch(e){setErr('Não foi possível preparar o ZIP. Baixe os arquivos individualmente.')}finally{setBusy(false);}}
 return <div className="kitResults"><h3>Seu kit está pronto! ✨</h3><p>Seis artes coordenadas com a mesma identidade visual.</p><div className="kitGrid">{Object.entries(kit).map(([key,url])=><article className="kitCard" key={key}><img src={url} alt={labels[key]}/><strong>{labels[key]}</strong><a href={url} download={'festamagica-'+key+'.png'}>Baixar PNG ↓</a></article>)}</div><div className="actions"><button className="btn" onClick={downloadAll} disabled={busy}>{busy?'Preparando ZIP…':'Baixar kit completo (ZIP) ↓'}</button><button className="outline" onClick={onReset}>Criar outro</button></div>{err&&<p role="alert" className="error">{err}</p>}<p className="muted">Prévia de homologação. Antes da venda, conferir impressão e corte de cada peça.</p></div>;
}
