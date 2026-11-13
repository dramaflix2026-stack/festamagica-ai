'use client';
import {useEffect,useState} from 'react';
import {sheetForTheme} from './kit-sheets';
export default function SheetTester({theme='dinossauros',name,age,date,time,venue}){
 const config=sheetForTheme(theme);
 const [parts,setParts]=useState([]),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 async function process(){setBusy(true);setError('');setParts([]);
  try{
   if(!config)throw Error('Tema ainda não possui prancha cadastrada');
   const url=config.src;
   {
    const img=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(Error('Não foi possível ler a imagem'));i.src=url});
    if(img.naturalWidth<1000||img.naturalHeight<600)throw Error('A prancha precisa ter pelo menos 1000 × 600 pixels.');
    const crops=await Promise.all(config.regions.map(async(r,index)=>{
     const [rx,ry,rw,rh]=r.rect;
     const canvas=document.createElement('canvas');
     canvas.width=Math.round(img.naturalWidth*rw);canvas.height=Math.round(img.naturalHeight*rh);
     canvas.getContext('2d').drawImage(img,Math.round(img.naturalWidth*rx),Math.round(img.naturalHeight*ry),canvas.width,canvas.height,0,0,canvas.width,canvas.height);
     const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
     if(!blob)throw Error('Falha ao recortar imagem');
     return {name:r.label,key:r.key,url:URL.createObjectURL(blob),filename:theme+'-'+String(index+1).padStart(2,'0')+'.png',width:canvas.width,height:canvas.height};
    }));
    setParts(previous=>{previous.forEach(p=>URL.revokeObjectURL(p.url));return crops});
   }
  }catch(e){setError(e.message||'Erro ao processar a prancha')}finally{setBusy(false)}
 }
 useEffect(()=>{process();return ()=>{}},[theme]);
 return <section style={{background:'#fff',border:'2px solid #e7d7f0',borderRadius:20,padding:20,margin:'24px 0'}}>
 <h3 style={{margin:'0 0 8px'}}>🎨 {config?.title||theme} — cinco artes para conferir</h3>
 <p style={{fontSize:14}}>As cinco artes são carregadas automaticamente da biblioteca do FestaMágica. Sem upload e sem custo de IA.</p>
 <button type="button" onClick={process} disabled={busy} className="outline" style={{marginBottom:12}}>{busy?'Preparando as artes…':'Atualizar cinco artes'}</button>
 {error&&<p role="alert" style={{color:'#b00020'}}>{error}</p>}
 {parts.length>0&&<><p style={{color:'#326b41',fontWeight:700}}>✓ Cinco arquivos separados. Confira cada um antes de imprimir.</p><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:12}}>{parts.map(p=><div key={p.name} style={{background:'#faf7f2',padding:10,borderRadius:12}}><img src={p.url} alt={p.name} style={{width:'100%',height:160,objectFit:'contain'}}/><strong style={{display:'block'}}>{p.name}</strong><small>{p.width} × {p.height}px</small><a href={p.url} download={p.filename} style={{display:'block',marginTop:8,color:'#7143a1',fontWeight:700}}>Baixar PNG ↓</a></div>)}</div><p style={{fontSize:12}}>{config?.note} Os recortes preservam a resolução original da prancha; ampliar pixels artificialmente não melhora a qualidade de impressão.</p></>}
 </section>
}