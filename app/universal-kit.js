'use client';
// One illustrated background -> five independently personalized PNG artworks.
// Canvas is responsible for every letter and numeral, never the image model.
const pieces=[
 ['convite',1024,1536],['topper',1536,1024],['tags',1536,1024],
 ['boasvindas',1024,1536],['digital',1080,1080]
];
function text(ctx,value,x,y,max,font,color='#38543a'){
 ctx.fillStyle=color;ctx.font=font;ctx.textAlign='center';ctx.textBaseline='middle';
 const lines=String(value||'').split('\n');
 lines.forEach((line,i)=>ctx.fillText(line,x,y+i*54,max));
}
function dateLabel(date){if(!date)return 'Data a confirmar';const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(date);return m?m[3]+'/'+m[2]+'/'+m[1]:date}
function panel(ctx,x,y,w,h){ctx.fillStyle='rgba(255,252,239,.94)';ctx.beginPath();ctx.roundRect(x,y,w,h,Math.min(w,h)*.07);ctx.fill();ctx.strokeStyle='#c7aa70';ctx.lineWidth=5;ctx.stroke()}
function art(ctx,img,x,y,w,h){const scale=Math.max(w/img.width,h/img.height);const sw=w/scale,sh=h/scale;ctx.drawImage(img,(img.width-sw)/2,(img.height-sh)/2,sw,sh,x,y,w,h)}
function cropArt(ctx,img,x,y,w,h){ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,h,24);ctx.clip();art(ctx,img,x,y,w,h);ctx.restore()}
function footer(ctx,w,h){ctx.fillStyle='#fff8e8';ctx.fillRect(0,h-18,w,18)}
function draw(ctx,img,key,w,h,d){
 const name=(d.name||'Sofia').trim(),age=String(d.age||5),date=dateLabel(d.date),time=d.time||'Horário a confirmar',venue=d.venue||'Local a confirmar';
 ctx.fillStyle='#fffdf5';ctx.fillRect(0,0,w,h);
 if(key==='convite'||key==='digital'||key==='boasvindas'){
  art(ctx,img,0,0,w,h);const cy=key==='digital'?h*.36:h*.36;
  panel(ctx,w*.095,cy,w*.81,key==='boasvindas'?h*.33:h*.43);
  text(ctx,key==='boasvindas'?'SEJA BEM-VINDO À':'VOCÊ ESTÁ CONVIDADO!',w/2,cy+54,w*.72,'bold 28px Arial','#8a6a40');
  text(ctx,name,w/2,cy+137,w*.73,'bold 84px Georgia');
  text(ctx,age+(Number(age)===1?' ano':' anos'),w/2,cy+220,w*.73,'bold 48px Georgia','#9e6c4a');
  if(key!=='boasvindas'){
   text(ctx,date+'  •  '+time,w/2,cy+305,w*.72,'bold 29px Arial');
   text(ctx,venue,w/2,cy+365,w*.72,'26px Arial');
  }
 }else if(key==='topper'){
  text(ctx,'TOPPER PARA RECORTAR',w/2,55,w*.8,'bold 35px Arial');
  const cells=[[95,135],[565,135],[1035,135],[330,555],[800,555]];
  cells.forEach(([x,y],i)=>{panel(ctx,x,y,400,350);cropArt(ctx,img,x+18,y+18,364,240);text(ctx,i===4?name:'',x+200,y+295,355,'bold 44px Georgia');});
  text(ctx,age+' ANOS',w/2,965,w*.7,'bold 48px Georgia');
 }else{
  text(ctx,'TAGS DE LEMBRANCINHAS',w/2,48,w*.8,'bold 35px Arial');
  for(let i=0;i<6;i++){const x=80+(i%3)*490,y=110+Math.floor(i/3)*455;panel(ctx,x,y,410,410);cropArt(ctx,img,x+20,y+20,370,240);text(ctx,name,x+205,y+295,370,'bold 42px Georgia');text(ctx,age+' anos · Obrigado!',x+205,y+355,370,'25px Arial')}
 }
 footer(ctx,w,h);
}
export async function composeFive(background,details,onProgress){
 const image=new Image();image.src=background;
 await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(Error('Não foi possível abrir a ilustração'))});
 const kit={};
 for(const [index,[key,w,h]] of pieces.entries()){
  onProgress?.('Montando '+(index+1)+' de 5 artes…');
  const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
  draw(canvas.getContext('2d'),image,key,w,h,details);
  kit[key]=canvas.toDataURL('image/png');
 }
 return kit;
}
