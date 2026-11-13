'use client';
function load(src){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(Error('Falha ao carregar ilustração'));im.src=src;});}
function canvas(w,h){const el=document.createElement('canvas');el.width=w;el.height=h;return el;}
function write(c,t,x,y,size=60,max=800){c.textAlign='center';c.fillStyle='#40563e';c.font='bold '+size+'px Georgia';c.fillText(String(t),x,y,max);}
function panel(c,x,y,w,h){c.fillStyle='rgba(255,248,221,.83)';c.strokeStyle='#b87d38';c.lineWidth=5;c.beginPath();c.roundRect(x,y,w,h,32);c.fill();c.stroke();}
function info(c,d,x,y,max){const date=/^\d{4}-\d\d-\d\d$/.test(d.date||'')?d.date.split('-').reverse().join('/'):'';const values=[date,d.time,d.venue].filter(Boolean);c.font='30px Georgia';c.textAlign='center';c.fillStyle='#40563e';for(const v of values){const words=v.split(' ');let line='';for(const word of words){const next=line?line+' '+word:word;if(c.measureText(next).width>max&&line){c.fillText(line,x,y,max);y+=38;line=word;}else line=next;}if(line){c.fillText(line,x,y,max);y+=47;}}}
export async function composePiece(piece,source,d){
 
 const img=await load(source),w=piece==='digital'?1024:piece==='bandeirolas'?1536:1024,h=piece==='digital'||piece==='bandeirolas'?1024:1536;
 const cv=canvas(w,h),c=cv.getContext('2d');c.drawImage(img,0,0,w,h);
 if(piece==='topper'){panel(c,290,660,444,245);write(c,d.name,512,765,78,390);write(c,d.age+' anos',512,842,53,390);return cv.toDataURL('image/png');}
 if(piece==='bandeirolas'){
  const letters=Array.from(d.name.toLocaleUpperCase('pt-BR').replace(/\s+/g,'')).slice(0,35),pages=Math.ceil(letters.length/10),out=canvas(1536,Math.max(1024,pages*1024)),oc=out.getContext('2d');oc.fillStyle='white';oc.fillRect(0,0,out.width,out.height);
  letters.forEach((letter,i)=>{const pg=Math.floor(i/10),n=i%10,x=68+(n%5)*280,y=pg*1024+85+Math.floor(n/5)*450;oc.save();oc.beginPath();oc.moveTo(x,y);oc.lineTo(x+250,y);oc.lineTo(x+125,y+350);oc.closePath();oc.clip();oc.drawImage(img,x,y,250,350);oc.fillStyle='rgba(255,246,212,.28)';oc.fillRect(x,y,250,350);oc.restore();oc.strokeStyle='#78916d';oc.lineWidth=3;oc.beginPath();oc.moveTo(x,y);oc.lineTo(x+250,y);oc.lineTo(x+125,y+350);oc.closePath();oc.stroke();oc.strokeStyle='#fff5db';oc.lineWidth=9;oc.font='bold 155px Georgia';oc.textAlign='center';oc.strokeText(letter,x+125,y+215,180);write(oc,letter,x+125,y+215,155,180);});return out.toDataURL('image/png');
 }
 if(piece==='tags'){for(let i=0;i<6;i++){const x=62+(i%2)*480,y=94+Math.floor(i/2)*465;panel(c,x+25,y+192,365,175);write(c,'Obrigado por vir!',x+210,y+242,25,345);write(c,d.name,x+210,y+304,54,340);write(c,d.age+' anos',x+210,y+350,30,340);}return cv.toDataURL('image/png');}
 if(piece==='convite'){panel(c,184,530,656,510);write(c,'Você está convidado!',512,603,37,600);write(c,d.name,512,726,108,590);write(c,d.age+' anos',512,810,62,590);info(c,d,512,870,560);}
 if(piece==='boasvindas'){panel(c,177,530,670,460);write(c,'Bem-vindos à festa!',512,616,43,610);write(c,d.name,512,760,112,610);write(c,d.age+' anos',512,860,72,610);}
 if(piece==='digital'){panel(c,168,315,688,435);write(c,'Vamos comemorar!',512,375,40,630);write(c,d.name,512,490,108,630);write(c,d.age+' anos',512,570,60,630);info(c,d,512,625,585);}
 return cv.toDataURL('image/png');
}
