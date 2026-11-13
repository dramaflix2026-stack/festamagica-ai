import {supabaseUrl,supabaseKey,getSession,refreshSession,saveSession} from './auth-client';
export async function dbRequest(table,options={}){
 let session=getSession();if(!session?.access_token)throw Error('Faça login novamente');
 const call=token=>fetch(supabaseUrl+'/rest/v1/'+table,{method:options.method||'GET',headers:{apikey:supabaseKey,Authorization:'Bearer '+token,'Content-Type':'application/json',Prefer:'return=representation',...options.headers},body:options.body?JSON.stringify(options.body):undefined});
 let r=await call(session.access_token);
 if(r.status===401){session=await refreshSession(session);r=await call(session.access_token)}
 if(!r.ok){const j=await r.json().catch(()=>({}));throw Error(j.message||'Não foi possível carregar os dados')}
 return r.status===204?[]:r.json();
}
