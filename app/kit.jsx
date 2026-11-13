'use client';
import {useState} from 'react';
import {buildPennants} from './pennants';
export const pieceKeys=['convite','topper','tags','bandeirolas','boasvindas','digital'];
const labels={convite:'Convite premium',topper:'Topper recortável',tags:'Tags de lembrancinhas',bandeirolas:'Bandeirolas',boasvindas:'Placa de boas-vindas',digital:'Arte para WhatsApp'};
export async function createKit(d,onProgress){
 const kit={};
 for(let i=0;i<pieceKeys.length;i++){
  const piece=pieceKeys[i];onProgress?.('Criando '+labels[piece]+' ('+(i+1)+'/6)…');
  const r=await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...d,piece})});
  const j=await r.json();if(!r.ok)throw Error(labels[piece]+': '+(j.error||'Erro na geração'));
  kit[piece]=piece==='bandeirolas'?await buildPennants(j.image,d):j.image;onProgress?.('Arte '+(i+1)+' de 6 concluída');
 }
 return kit;
}
export default function KitGallery({kit,name,onReset}){
 const [busy,setBusy]=useState(false),[err,setErr]=useState('');
 async function downloadAll(){setBusy(true);setErr('');try{const {default:JSZip}=await import('jszip');const zip=new JSZip();for(const [key,url] of Object.entries(kit))zip.file(key+'.png',url.split(',')[1],{base64:true});const blob=await zip.generateAsync({type:'blob'});const href=URL.createObjectURL(blob);const a=document.createElement('a');a.href=href;a.download='festamagica-kit-'+name.toLowerCase().replace(/[^a-z0-9]/g,'-')+'.zip';a.click();setTimeout(()=>URL.revokeObjectURL(href),30000);}catch(e){setErr('Falha no ZIP. Baixe as artes individualmente.')}finally{setBusy(false);}}
 return <div className="kitResults"><h3>Suas seis artes de IA estão prontas! ✨</h3><p>Artes personalizadas a partir das referências premium do tema.</p><div className="kitGrid">{Object.entries(kit).map(([key,url])=><article className="kitCard" key={key}><img src={url} alt={labels[key]}/><strong>{labels[key]}</strong><a href={url} download={'festamagica-'+key+'.png'}>Baixar PNG ↓</a></article>)}</div><div className="actions"><button className="btn" onClick={downloadAll} disabled={busy}>{busy?'Preparando ZIP…':'Baixar kit completo (ZIP) ↓'}</button><button className="outline" onClick={onReset}>Criar outro</button></div>{err&&<p role="alert" className="error">{err}</p>}<p className="muted">Protótipo de geração integral. Confira margens de corte, resolução e proporções antes de imprimir. Ainda não homologado para venda.</p></div>;
}
