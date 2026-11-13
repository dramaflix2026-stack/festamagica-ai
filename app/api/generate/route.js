import {NextResponse} from 'next/server';
export const runtime='nodejs';
const themes={
 safari:'Vibrant premium 3D cartoon baby jungle safari, adorable smiling lion cub with pink bow, cute giraffe with pink flower, baby elephant with pink bow, cheerful zebra and monkey, glossy expressive eyes, rich emerald tropical foliage, pink hibiscus flowers, saturated warm golden wooden textures, dimensional polished illustration, playful luxury children party design. NO watercolor, NO washed out colors.',
 espaco:'Premium vibrant 3D cartoon kids space party, cute astronaut, smiling planets, saturated navy and purple, glossy detailed lighting, dimensional illustrations.',
 jardim:'Premium vibrant 3D cartoon enchanted garden, butterflies, flowers, pink bows, bright vivid green foliage, playful elegant children party art.'
};
const pieces={
 convite:{size:'1024x1536',instruction:'VERTICAL 2:3 PARTY INVITATION ART. Tropical animal characters framing left and right edges, polished jungle atmosphere, rich decorative wooden sign centered behind a large EMPTY area reserved for name and event details. Keep central 70% width and middle 65% height calm and uncluttered.'},
 topper:{size:'1024x1536',instruction:'PRINTABLE CAKE TOPPER CUTOUT SHEET on PURE WHITE BACKGROUND. Six distinct full colorful individual safari character cutouts, each with white sticker die-cut border and generous space between, plus decorative pink bow and flowers. No overlapping, all contours completely visible. No letters or numbers.'},
 tags:{size:'1024x1536',instruction:'PRINTABLE SHEET with exactly SIX distinct individually cuttable hanging party favor tags, two columns three rows, each with one adorable safari animal, rich jungle borders, white sticker cutline, and large empty wooden sign panel for typography. Generous separation and no overlap.'},
 bandeirolas:{size:'1536x1024',instruction:'Premium vivid jungle party decorative texture, adorable safari animals, rich emerald leaves, pink bows, golden wooden textures. Pattern illustration with no letters and no flags. Intended as background inside individually rendered cuttable pennants.'},
 boasvindas:{size:'1024x1536',instruction:'VERTICAL 2:3 PREMIUM WELCOME POSTER with beautiful safari animals around a central elegant golden wooden sign, lush tropical leaves and pink bows. Keep the central wooden sign very large and EMPTY for precise text overlay.'},
 digital:{size:'1024x1024',instruction:'SQUARE premium digital invitation illustration, colorful 3D cartoon safari animals framing an elegant large central golden wooden sign with generous empty center for name, date and address overlay. Bright green jungle, pink bows and flowers.'}
};
const limiter=new Map(),MAX=12;
export async function POST(request){
 try{
 const apiKey=process.env.OPENAI_API_KEY,code=process.env.PREVIEW_ACCESS_CODE;
 if(!apiKey||!code)return NextResponse.json({error:'Configure a chave da OpenAI e o código de teste.'},{status:503});
 const d=await request.json();if(d.code!==code)return NextResponse.json({error:'Código de teste inválido.'},{status:403});
 const name=String(d.name||'').trim(),age=Number(d.age),piece=pieces[d.piece];
 if(!/^[\p{L}\p{M} '’-]{2,35}$/u.test(name)||!Number.isInteger(age)||age<1||age>99||!themes[d.theme]||!piece)return NextResponse.json({error:'Dados inválidos.'},{status:400});
 const ip=request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown',now=Date.now(),record=limiter.get(ip)||{at:now,count:0};
 if(now-record.at>3600000){record.at=now;record.count=0;}
 if(record.count>=MAX)return NextResponse.json({error:'Limite de 12 artes por hora atingido.'},{status:429});
 record.count++;limiter.set(ip,record);if(limiter.size>10000)limiter.clear();
 const date=String(d.date||'').slice(0,10),time=String(d.time||'').slice(0,5),venue=String(d.venue||'').slice(0,80);
 const formatted=/^\d{4}-\d\d-\d\d$/.test(date)?date.split('-').reverse().join('/'):'a confirmar';
 const prompt=['Create ONE premium high-end colorful 3D cartoon birthday party illustration, not a mockup.','Theme:',themes[d.theme],piece.instruction,'High artistic detail, vibrant saturated colors, dimensional lighting, adorable polished expressive animals, sophisticated professional composition, precise proportions.','ABSOLUTE RULE: Do not draw ANY text, lettering, typography, digits, glyphs, pseudo-text, watermarks, or logos. ALL writing is applied separately by software.','The illustration must look finished and premium even with its reserved typography areas. Do not draw placeholder rectangles or generic boxes.'].join('\\n');
 const model=process.env.OPENAI_IMAGE_MODEL||'gpt-image-1-mini';
 // Optional approved visual reference, stored as a public asset in /public/references.
 // Never send private customer data to a remote reference URL.
 const referenceFile=d.theme==='safari'?'/references/safari-premium.png':null;
 let response;
 if(referenceFile){
  try{
   const origin=new URL(request.url).origin;
   const refResponse=await fetch(origin+referenceFile,{signal:AbortSignal.timeout(8000)});
   if(refResponse.ok&&refResponse.headers.get('content-type')?.startsWith('image/')){
    const bytes=await refResponse.arrayBuffer();
    if(bytes.byteLength>0&&bytes.byteLength<10_000_000){
     const form=new FormData();
     form.append('model',model);
     form.append('prompt',prompt+'\\nVISUAL REFERENCE: use the uploaded image ONLY for artistic direction, lighting, palette, and character quality. Produce the specified distinct printable piece, not a duplicate.');
     form.append('size',piece.size);
     form.append('quality','low');
     form.append('image',new Blob([bytes],{type:refResponse.headers.get('content-type')?.split(';')[0]||'image/png'}),'reference.png');
     response=await fetch('https://api.openai.com/v1/images/edits',{method:'POST',headers:{Authorization:'Bearer '+apiKey},body:form,signal:AbortSignal.timeout(115000)});
    }
   }
  }catch(e){console.warn('Visual reference unavailable:',e?.message);}
 }
 if(!response){
  response=await fetch('https://api.openai.com/v1/images/generations',{method:'POST',headers:{Authorization:'Bearer '+apiKey,'Content-Type':'application/json'},body:JSON.stringify({model,prompt,size:piece.size,n:1,quality:'low'}),signal:AbortSignal.timeout(115000)});
 }
 const j=await response.json();if(!response.ok){console.error('OpenAI artwork:',response.status,j?.error?.code,j?.error?.message);return NextResponse.json({error:'A OpenAI recusou a geração desta peça. Verifique os logs do Railway.'},{status:502});}
 if(!j?.data?.[0]?.b64_json)throw Error('Empty image');
 return NextResponse.json({image:'data:image/png;base64,'+j.data[0].b64_json});
 }catch(e){console.error('Artwork:',e?.message);return NextResponse.json({error:'Falha ao criar a arte. Tente novamente.'},{status:502});}
}
