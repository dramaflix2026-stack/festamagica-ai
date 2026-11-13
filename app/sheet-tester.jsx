'use client';
import {useState} from 'react';
const REGIONS=[
 {label:'Convite',x:0,y:0,w:.386,h:1},
 {label:'Topper',x:.392,y:0,w:.37,h:.514},
 {label:'Tags',x:.765,y:0,w:.235,h:.514},
 {label:'Boas-vindas',x:.392,y:.521,w:.37,h:.479},
 {label:'Convite digital',x:.765,y:.521,w:.235,h:.479}
];
export default function SheetTester(){
 const [parts,setParts]=useState([]),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 async function process(file){
  if(!file)return;setBusy(true);setError('');setParts([]);
  try{
   if(!file.type.startsWith('image/'))throw Error('Selecione uma imagem PNG ou JPG.');
   const url=URL.createObjectURL(file);
   try{
    const img=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(Error('Não foi possível ler a imagem'));i.src=url});
    if(img.naturalWidth<1000||img.naturalHeight<600)throw Error('A prancha precisa ter pelo menos 1000 × 600 pixels.');
    const crops=await Promise.all(REGIONS.map(async(r,index)=>{
     const canvas=document.createElement('canvas');
     canvas.width=Math.round(img.naturalWidth*r.w);canvas.height=Math.round(img.naturalHeight*r.h);
     canvas.getContext('2d').drawImage(img,Math.round(img.naturalWidth*r.x),Math.round(img.naturalHeight*r.y),canvas.width,canvas.height,0,0,canvas.width,canvas.height);
     const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
     if(!blob)throw Error('Falha ao recortar imagem');
     return {name:r.label,url:URL.createObjectURL(blob),filename:'dinossauros-'+String(index+1).padStart(2,'0')+'.png',width:canvas.width,height:canvas.height};
    }));
    setParts(previous=>{previous.forEach(p=>URL.revokeObjectURL(p.url));return crops});
   }finally{URL.revokeObjectURL(url)}
  }catch(e){setError(e.message||'Erro ao processar a prancha')}finally{setBusy(false)}
 }
 return <section style={{background:'#fff',border:'2px solid #e7d7f0',borderRadius:20,padding:20,margin:'24px 0'}}>
 <h3 style={{margin:'0 0 8px'}}>🦕 Teste do kit Dinossauros — 5 recortes</h3>
 <p style={{fontSize:14}}>Importe a prancha aprovada para separar e baixar as cinco artes. Processamento gratuito no navegador, sem IA.</p>
 <label style={{display:'block',padding:16,border:'2px dashed #b78ac9',borderRadius:12,cursor:'pointer',textAlign:'center'}}>
 {busy?'Recortando…':'📁 Selecionar prancha PNG ou JPG'}<input type="file" accept="image/png,image/jpeg,image/webp" style={{display:'block',margin:'10px auto 0',maxWidth:'100%'}} onChange={e=>process(e.target.files?.[0])}/>
 </label>
 {error&&<p role="alert" style={{color:'#b00020'}}>{error}</p>}
 {parts.length>0&&<><p style={{color:'#326b41',fontWeight:700}}>✓ Cinco arquivos separados. Confira cada um antes de imprimir.</p><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:12}}>{parts.map(p=><div key={p.name} style={{background:'#faf7f2',padding:10,borderRadius:12}}><img src={p.url} alt={p.name} style={{width:'100%',height:160,objectFit:'contain'}}/><strong style={{display:'block'}}>{p.name}</strong><small>{p.width} × {p.height}px</small><a href={p.url} download={p.filename} style={{display:'block',marginTop:8,color:'#7143a1',fontWeight:700}}>Baixar PNG ↓</a></div>)}</div><p style={{fontSize:12}}>Protótipo de recorte: os textos da prancha ainda são fixos. O convite digital e as demais artes precisam de validação de resolução para impressão.</p></>}
 </section>
}