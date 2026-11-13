'use client';
import {useState} from 'react';
import {pennantSheet16x9} from './pennant-export';
export const pieceKeys=['convite','topper','tags','bandeirolas','boasvindas','digital'];
const labels={convite:'Convite premium',topper:'Topper recortável',tags:'Tags de lembrancinhas',bandeirolas:'Bandeirolas', 'bandeirolas-pagina-1':'Bandeirolas — página 1 (S O F I)', 'bandeirolas-pagina-2':'Bandeirolas — página 2 (A + 5 ANOS)',boasvindas:'Placa de boas-vindas',digital:'Arte para WhatsApp'};
export async function createKit(d,onProgress,onlyPiece=null){
 const kit={};
 const selected=onlyPiece?[onlyPiece]:pieceKeys;
 for(let i=0;i<selected.length;i++){
  const piece=selected[i];onProgress?.('Criando '+labels[piece]+' ('+(i+1)+'/'+selected.length+')…');
  if(piece==='bandeirolas'&&d.theme==='safari'){
   for(const page of [1,2]){
    onProgress?.('Criando bandeirolas — página '+page+' de 2…');
    const r=await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...d,piece,page})});
    const j=await r.json();if(!r.ok)throw Error('Bandeirolas página '+page+': '+(j.error||'Erro na geração'));
    kit['bandeirolas-pagina-'+page]=await pennantSheet16x9(j.image);
   }
   onProgress?.('As duas páginas de bandeirolas foram concluídas');
   continue;
  }
  const r=await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...d,piece})});
  const j=await r.json();if(!r.ok)throw Error(labels[piece]+': '+(j.error||'Erro na geração'));
  kit[piece]=piece==='bandeirolas'?await pennantSheet16x9(j.image):j.image;onProgress?.('Arte '+(i+1)+' de '+selected.length+' concluída');
 }
 return kit;
}
export default function KitGallery({kit,name,onReset}){
 const [busy,setBusy]=useState(false),[err,setErr]=useState('');
 async function downloadAll(){setBusy(true);setErr('');try{const {default:JSZip}=await import('jszip');const zip=new JSZip();for(const [key,url] of Object.entries(kit))zip.file(key+'.png',url.split(',')[1],{base64:true});const blob=await zip.generateAsync({type:'blob'});const href=URL.createObjectURL(blob);const a=document.createElement('a');a.href=href;a.download='festamagica-kit-'+name.toLowerCase().replace(/[^a-z0-9]/g,'-')+'.zip';a.click();setTimeout(()=>URL.revokeObjectURL(href),30000);}catch(e){setErr('Falha no ZIP. Baixe as artes individualmente.')}finally{setBusy(false);}}
 return <div className="kitResults"><h3>{Object.keys(kit).length===1?'Sua arte de teste está pronta! ✨':'Suas seis artes de IA estão prontas! ✨'}</h3><p>Artes personalizadas a partir das referências premium do tema.</p><div className="kitGrid">{Object.entries(kit).map(([key,url])=><article className="kitCard" key={key}><img src={url} alt={labels[key]}/><strong>{labels[key]}</strong><a href={url} download={'festamagica-'+key+'.png'}>Baixar PNG ↓</a></article>)}</div><div className="actions"><button className="btn" onClick={downloadAll} disabled={busy}>{busy?'Preparando ZIP…':'Baixar kit completo (ZIP) ↓'}</button><button className="outline" onClick={onReset}>Criar outro</button></div>{err&&<p role="alert" className="error">{err}</p>}<p className="muted">Protótipo de geração integral. Confira margens de corte, resolução e proporções antes de imprimir. Ainda não homologado para venda.</p></div>;
}
