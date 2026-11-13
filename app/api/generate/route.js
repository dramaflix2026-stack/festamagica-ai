import {NextResponse} from 'next/server';
export const runtime='nodejs';
const themes={safari:'premium watercolor baby safari: giraffe, lion cub, elephant, monkey, botanical foliage, sage green, warm ivory, muted gold',espaco:'premium dreamy outer space: rockets, planets, stars, friendly astronaut, pastel indigo and lavender',jardim:'premium enchanted garden: butterflies, ladybugs, watercolor flowers, blush pink, sage green'};
const pieces={
convite:{size:'1024x1536',instruction:'VERTICAL COMPLETE BIRTHDAY INVITATION. Luxurious editorial composition with decorated corners and tasteful hierarchy. Include name, age, date, time and location as readable typography. Not a blank background.'},
topper:{size:'1024x1536',instruction:'PRINTABLE A4-STYLE CAKE TOPPER CUTOUT SHEET. Pure white background, NO full-page scenic background. Separate independent watercolor animal or theme character cutouts, each with ample white gap and clear white contour for cutting. Include a separate decorative name plaque and separate age numeral. At least 6 distinct separate cutout elements, NO overlapping elements. No sticks drawn.'},
tags:{size:'1024x1536',instruction:'PRINTABLE PORTRAIT SHEET of SIX individual matching gift tags, in a precise 2 columns by 3 rows grid. White page background, large gaps between each tag, visible rounded cut lines, six complete individually cuttable designs. Each tag has a small illustrated motif, thank-you text, name and age.'},
bandeirolas:{size:'1536x1024',instruction:'PRINTABLE LANDSCAPE PENNANT BANNER SHEET, pure white page background. Make separate individual triangular pennant flags with clear white gaps and cut borders. Put ONE letter per flag, spelling the supplied name exactly from left to right. Do not merge flags, do not put letters directly on the page background. If name long, arrange in rows.'},
boasvindas:{size:'1024x1536',instruction:'FULL-PAGE VERTICAL WELCOME SIGN poster, premium professional party stationery, beautiful character art framing elegant centered welcome message, name and age. Not an invitation.'},
digital:{size:'1024x1024',instruction:'SQUARE DIGITAL WHATSAPP PARTY INVITATION, sophisticated social graphic composition, theme illustrations, readable name, age, date, time and venue. Not a print cutout sheet.'}
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
 const prompt=['Create ONE finished, production-grade birthday party stationery artwork. Brazilian Portuguese only.','Art direction:',themes[d.theme],piece.instruction,'Consistency: luxury illustrated watercolor stationery, rich artistic detail, carefully composed hierarchy, no clip art or generic plain rectangles.','Personalization: birthday child name EXACTLY "'+name+'"; age EXACTLY "'+age+' anos"; date "'+formatted+'"; time "'+(time||'a confirmar')+'"; venue "'+(venue||'a confirmar')+'".','Use correct Brazilian Portuguese spelling. Never invent names, dates, addresses or extra details. Include only information relevant to this piece. For flags, use only the letters of the name.','Design the entire artwork yourself; no empty template, no mockup, no table, no photographs of printed stationery.'].join('\n');
 const response=await fetch('https://api.openai.com/v1/images/generations',{method:'POST',headers:{Authorization:'Bearer '+apiKey,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_IMAGE_MODEL||'gpt-image-1-mini',prompt,size:piece.size,n:1,quality:'low'}),signal:AbortSignal.timeout(115000)});
 const j=await response.json();if(!response.ok){console.error('OpenAI artwork:',response.status,j?.error?.code,j?.error?.message);return NextResponse.json({error:'A OpenAI recusou a geração desta peça. Verifique os logs do Railway.'},{status:502});}
 if(!j?.data?.[0]?.b64_json)throw Error('Empty image');
 return NextResponse.json({image:'data:image/png;base64,'+j.data[0].b64_json});
 }catch(e){console.error('Artwork:',e?.message);return NextResponse.json({error:'Falha ao criar a arte. Tente novamente.'},{status:502});}
}
