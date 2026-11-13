import {supabaseUrl,supabaseKey,getSession,refreshSession} from './auth-client';
import {dbRequest} from './db-client';
export const artTypes=['convite','topper','tags','boasvindas','digital'];
const bucket='festamagica-kits';
async function authorizedFetch(url,options={}){
 let s=getSession();if(!s?.access_token)throw Error('Faça login novamente');
 const call=token=>fetch(url,{...options,headers:{apikey:supabaseKey,Authorization:'Bearer '+token,...options.headers}});
 let r=await call(s.access_token);if(r.status===401){s=await refreshSession(s);r=await call(s.access_token)}
 if(!r.ok)throw Error('Falha no armazenamento ('+r.status+')');
 return r;
}
export async function storeKit(userId,details,kit){
 const rows=await dbRequest('festas',{method:'POST',body:{...details,user_id:userId}});
 const festa=rows[0];if(!festa?.id)throw Error('Não foi possível criar a festa');
 for(const tipo of artTypes){
  if(!kit[tipo])throw Error('Arte ausente: '+tipo);
  const image=kit[tipo];const response=await fetch(image);const blob=await response.blob();
  if(blob.type!=='image/png' && !image.startsWith('data:image/png'))throw Error('Formato de imagem inválido');
  const path=userId+'/'+festa.id+'/'+tipo+'.png';
  await authorizedFetch(supabaseUrl+'/storage/v1/object/'+bucket+'/'+path,{method:'POST',headers:{'Content-Type':'image/png','x-upsert':'false'},body:blob});
  await dbRequest('festa_arquivos',{method:'POST',body:{festa_id:festa.id,user_id:userId,tipo,storage_path:path}});
 }
 return festa;
}
export async function getKitFiles(festaId){
 return dbRequest('festa_arquivos?select=tipo,storage_path&festa_id=eq.'+encodeURIComponent(festaId));
}
export async function downloadStored(path){
 const r=await authorizedFetch(supabaseUrl+'/storage/v1/object/authenticated/'+bucket+'/'+path);
 return r.blob();
}
export function saveBlob(blob,filename){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)}
