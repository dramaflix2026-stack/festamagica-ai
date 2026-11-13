'use client';
function load(src){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(Error('Falha ao carregar ilustração'));im.src=src;});}
function canvas(w,h){const el=document.createElement('canvas');el.width=w;el.height=h;return el;}
function write(c,t,x,y,size=60,max=800){c.textAlign='center';c.fillStyle='#40563e';c.font='bold '+size+'px Georgia';c.fillText(String(t),x,y,max);}
function panel(c,x,y,w,h){c.fillStyle='rgba(255,253,246,.96)';c.beginPath();c.roundRect(x,y,w,h,25);c.fill();}
function info(c,d,x,y,max){const date=/^\d{4}-\d\d-\d\d$/.test(d.date||'')?d.date.split('-').reverse().join('/'):'';const values=[date,d.time,d.venue].filter(Boolean);c.font='30px Georgia';c.textAlign='center';c.fillStyle='#40563e';for(const v of values){const words=v.split(' ');let line='';for(const word of words){const next=line?line+' '+word:word;if(c.measureText(next).width>max&&line){c.fillText(line,x,y,max);y+=38;line=word;}else line=next;}if(line){c.fillText(line,x,y,max);y+=47;}}}
export async function composePiece(piece,source,d){
 if(piece==='topper')return source;
 const img=await load(source),w=piece==='digital'?1024:piece==='bandeirolas'?1536:1024,h=piece==='digital'||piece==='bandeirolas'?1024:1536;
 const cv=canvas(w,h),c=cv.getContext('2d');c.drawImage(img,0,0,w,h);
 if(piece==='bandeirolas'){
  const letters=Array.from(d.name.toLocaleUpperCase('pt-BR').replace(/\s+/g,'')).slice(0,35),pages=Math.ceil(letters.length/10),out=canvas(1536,Math.max(1024,pages*1024)),oc=out.getContext('2d');oc.fillStyle='white';oc.fillRect(0,0,out.width,out.height);
  letters.forEach((letter,i)=>{const pg=Math.floor(i/10),n=i%10,x=68+(n%5)*280,y=pg*1024+85+Math.floor(n/5)*450;oc.save();oc.beginPath();oc.moveTo(x,y);oc.lineTo(x+250,y);oc.lineTo(x+125,y+350);oc.closePath();oc.clip();oc.drawImage(img,x,y,250,350);oc.fillStyle='rgba(255,253,245,.76)';oc.fillRect(x,y,250,350);oc.restore();oc.strokeStyle='#78916d';oc.lineWidth=3;oc.beginPath();oc.moveTo(x,y);oc.lineTo(x+250,y);oc.lineTo(x+125,y+350);oc.closePath();oc.stroke();write(oc,letter,x+125,y+190,112,170);});return out.toDataURL('image/png');
 }
 if(piece==='tags'){for(let i=0;i<6;i++){const x=62+(i%2)*480,y=94+Math.floor(i/2)*465;panel(c,x+14,y+173,390,205);write(c,'Obrigado pela presença!',x+210,y+238,25,365);write(c,d.name,x+210,y+310,48,355);write(c,d.age+' anos',x+210,y+359,29,355);}return cv.toDataURL('image/png');}
 if(piece==='convite'){panel(c,132,455,760,660);write(c,'Você está convidado!',512,555,43,710);write(c,d.name,512,685,105,690);write(c,d.age+' anos',512,780,65,690);info(c,d,512,867,650);}
 if(piece==='boasvindas'){panel(c,130,430,764,590);write(c,'Bem-vindos à festa!',512,548,48,710);write(c,d.name,512,708,108,700);write(c,d.age+' anos',512,823,69,700);}
 if(piece==='digital'){panel(c,120,265,784,560);write(c,'Vamos comemorar!',512,350,44,710);write(c,d.name,512,467,102,700);write(c,d.age+' anos',512,555,62,700);info(c,d,512,635,670);}
 return cv.toDataURL('image/png');
}
