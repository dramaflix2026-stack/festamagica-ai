import {NextResponse} from 'next/server';
export const runtime='nodejs';
const themes={safari:'adoráveis animais de safari em aquarela, girafa, leão, elefante, folhagens verde-sálvia e tons areia',espaco:'foguete, estrelas, planetas, astronauta delicado, azul claro e lilás, atmosfera espacial alegre',jardim:'borboletas, flores delicadas, joaninhas, tons rosa e verde, jardim encantado em aquarela'};
const MAX=3,windowMs=3600000,limiter=new Map();
export async function POST(request){
 try{
  const apiKey=process.env.OPENAI_API_KEY,code=process.env.PREVIEW_ACCESS_CODE;
  if(!apiKey||!code)return NextResponse.json({error:'Configure OPENAI_API_KEY e PREVIEW_ACCESS_CODE no Railway.'},{status:503});
  const data=await request.json();
  if(data.code!==code)return NextResponse.json({error:'Código de teste inválido.'},{status:403});
  const name=String(data.name||'').trim(),age=Number(data.age);
  if(!/^[\p{L}\p{M} '’-]{2,35}$/u.test(name)||!Number.isInteger(age)||age<1||age>99||!Object.hasOwn(themes,data.theme))return NextResponse.json({error:'Verifique o nome, idade e tema.'},{status:400});
  const ip=request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown',now=Date.now();
  if(limiter.size>10000)limiter.clear();
  const entry=limiter.get(ip)||{start:now,count:0};if(now-entry.start>windowMs){entry.start=now;entry.count=0;}
  if(entry.count>=MAX)return NextResponse.json({error:'Limite de 3 testes por hora atingido.'},{status:429});
  entry.count++;limiter.set(ip,entry);
  const prompt='Premium elegant children birthday invitation BACKGROUND for Brazilian party stationery. Portrait 2:3. Theme: '+themes[data.theme]+'. Beautiful high-quality watercolor illustration, enchanting and professional. Keep central 70% of image clean with subtle very pale tones and gentle decorations near edges so readable typography can later overlay it. No words, no text, no letters, no typography, no numbers, no logos, no copyrighted characters.';
  const r=await fetch('https://api.openai.com/v1/images/generations',{method:'POST',headers:{Authorization:'Bearer '+apiKey,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_IMAGE_MODEL||'gpt-image-2',prompt,size:'1024x1536',n:1,quality:'low'}),signal:AbortSignal.timeout(115000)});
  const j=await r.json();
  if(!r.ok){console.error('OpenAI generation error:',j?.error?.message);return NextResponse.json({error:'Falha na geração pela OpenAI. Verifique o modelo e os créditos da API.'},{status:502});}
  const b64=j?.data?.[0]?.b64_json;
  if(!b64)throw Error('Image response empty');
  return NextResponse.json({image:'data:image/png;base64,'+b64});
 }catch(e){console.error('Image generation:',e?.message);return NextResponse.json({error:'Erro na geração. Tente novamente.'},{status:502});}
}
