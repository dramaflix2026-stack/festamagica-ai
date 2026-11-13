export const supabaseUrl='https://gpgqusslfxqjmynwxjvm.supabase.co';
export const supabaseKey='sb_publishable_J3udgBeDVnB5QLOtx5WWvg_cOIbeWg8';
const storageKey='festamagica-auth';
export function getSession(){try{return JSON.parse(localStorage.getItem(storageKey)||'null')}catch{return null}}
export function saveSession(data){if(data?.access_token)localStorage.setItem(storageKey,JSON.stringify(data))}
export function signOut(){localStorage.removeItem(storageKey)}
export async function authRequest(endpoint,payload){const r=await fetch(supabaseUrl+'/auth/v1/'+endpoint,{method:'POST',headers:{'apikey':supabaseKey,'Content-Type':'application/json'},body:JSON.stringify(payload)});const j=await r.json();if(!r.ok)throw Error(j.msg||j.error_description||j.message||'Não foi possível autenticar');return j}
export async function currentUser(token){const r=await fetch(supabaseUrl+'/auth/v1/user',{headers:{apikey:supabaseKey,Authorization:'Bearer '+token}});if(!r.ok)throw Error('Sessão expirada');return r.json()}
export async function refreshSession(session){if(!session?.refresh_token)throw Error('Sessão expirada');const next=await authRequest('token?grant_type=refresh_token',{refresh_token:session.refresh_token});saveSession(next);return next}
