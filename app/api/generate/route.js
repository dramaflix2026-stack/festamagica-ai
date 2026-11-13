import {NextResponse} from 'next/server';
export const runtime='nodejs';
const themes={safari:'premium watercolor baby safari: giraffe, lion cub, elephant, monkey, botanical foliage, sage green, warm ivory, muted gold',espaco:'premium dreamy outer space: rockets, planets, stars, friendly astronaut, pastel indigo and lavender',jardim:'premium enchanted garden: butterflies, ladybugs, watercolor flowers, blush pink, sage green'};
const pieces={
convite:{size:'1024x1536',instruction:'VERTICAL LUXURY WATERCOLOUR INVITATION ILLUSTRATION. Detailed adorable animals around outer edges, floral foliage, elegant decorative borders. Keep the CENTRAL 55% width and middle 55% height almost entirely empty pale ivory for precise typesetting later. No frames over central space.'},
topper:{size:'1024x1536',instruction:'PRINTABLE CAKE TOPPER ARTWORK SHEET. Pure white background, eight separate individually cuttable watercolor characters and foliage clusters, with clear white spacing and white cut outlines. No text, no numbers, no lettering, no cards, no plaques, no signs. Each animal fully visible, not overlapping.'},
tags:{size:'1024x1536',instruction:'PRINTABLE PORTRAIT A4 STATIONERY SHEET. Six separate premium illustrated gift tag designs, EXACTLY two columns and three rows, generous gaps, subtle cut outlines, elegant botanical borders and tiny theme animals in top corners. Keep center of EVERY tag empty pale cream for typesetting later. No text, no symbols, no letters, no numbers.'},
bandeirolas:{size:'1536x1024',instruction:'Premium illustrated watercolor safari stationery pattern artwork, delicate animal portraits and foliage on very pale ivory background. No text, no letters, no numbers, no flags, no pennants. Decorative asset only.'},
boasvindas:{size:'1024x1536',instruction:'VERTICAL WELCOME POSTER ARTWORK. High-end baby birthday watercolor animals and botanical wreath decorating the outside edges. Keep large EMPTY pale ivory central space, at least 65% of image height, for later typography. No writing.'},
digital:{size:'1024x1024',instruction:'SQUARE PREMIUM DIGITAL PARTY INVITATION ARTWORK. Rich watercolor animals, botanical decoration and elegant soft gold detailing at the outside edges. Keep the center 60% width and 65% height empty clean pale ivory for typesetting. No writing.'}
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
 const prompt=['Create ONE premium professional watercolor birthday stationery ILLUSTRATION, not a mockup.','Theme:',themes[d.theme],piece.instruction,'High artistic detail, cohesive delicate watercolor painting, charming expressive animals, sophisticated editorial composition, precise proportions.','ABSOLUTE RULE: Do not draw ANY text, lettering, typography, digits, glyphs, pseudo-text, watermarks, or logos. ALL writing is applied separately by software.','The illustration must look finished and premium even with its reserved typography areas. Do not draw placeholder rectangles or generic boxes.'].join('\\n');
 const response=await fetch('https://api.openai.com/v1/images/generations',{method:'POST',headers:{Authorization:'Bearer '+apiKey,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_IMAGE_MODEL||'gpt-image-1-mini',prompt,size:piece.size,n:1,quality:'low'}),signal:AbortSignal.timeout(115000)});
 const j=await response.json();if(!response.ok){console.error('OpenAI artwork:',response.status,j?.error?.code,j?.error?.message);return NextResponse.json({error:'A OpenAI recusou a geração desta peça. Verifique os logs do Railway.'},{status:502});}
 if(!j?.data?.[0]?.b64_json)throw Error('Empty image');
 return NextResponse.json({image:'data:image/png;base64,'+j.data[0].b64_json});
 }catch(e){console.error('Artwork:',e?.message);return NextResponse.json({error:'Falha ao criar a arte. Tente novamente.'},{status:502});}
}
