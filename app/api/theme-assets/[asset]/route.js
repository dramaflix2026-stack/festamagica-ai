// Curated public-domain illustrations. Whitelisted sources only, never user URLs.
// Original asset pages:
// https://openclipart.org/detail/301678/cute-dinosaur
// https://openclipart.org/detail/245824/jeffy-the-dinosaur
const sources={
 'dino-green':'https://openclipart.org/download/301678',
 'dino-pink':'https://openclipart.org/download/245824'
};
export const revalidate=86400;
export async function GET(_request,{params}){
 const {asset}=await params;
 const url=sources[asset];
 if(!url)return new Response('Asset not found',{status:404});
 try{
  const response=await fetch(url,{next:{revalidate:86400},signal:AbortSignal.timeout(8000)});
  if(!response.ok)throw Error('Asset unavailable');
  const bytes=await response.arrayBuffer();
  if(bytes.byteLength>2_000_000)throw Error('Asset too large');
  const type=response.headers.get('content-type')||'';
  if(!type.includes('svg')&&!type.includes('image'))throw Error('Invalid asset type');
  return new Response(bytes,{headers:{'Content-Type':type.includes('svg')?'image/svg+xml':type,'Cache-Control':'public, max-age=86400, s-maxage=604800','X-Content-Type-Options':'nosniff'}});
 }catch{return new Response('Reference image temporarily unavailable',{status:503,headers:{'Cache-Control':'no-store'}})}
}
