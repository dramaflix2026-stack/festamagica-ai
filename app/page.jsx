'use client';
import {useState} from 'react';
import KitGallery,{createKit} from './kit';
const themes=[{id:'safari',name:'Safari',emoji:'🦁'},{id:'espaco',name:'Espaço',emoji:'🚀'},{id:'jardim',name:'Jardim',emoji:'🦋'}];
function addText(background,details){
 return new Promise((resolve,reject)=>{
  const img=new Image();img.onload=()=>{
   const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=1536;const c=canvas.getContext('2d');
   c.drawImage(img,0,0,1024,1536);
   c.fillStyle='rgba(255,255,255,.84)';const x=100,y=510,w=824,h=520,r=38;
   c.beginPath();c.roundRect(x,y,w,h,r);c.fill();
   c.textAlign='center';c.fillStyle='#7f52a7';c.font='700 48px Georgia';c.fillText('Você está convidado!',512,605);
   c.fillStyle='#573d6d';c.font='bold '+(details.name.length>19?'57':'75')+'px Georgia';
   c.fillText(details.name,512,720,760);
   c.font='bold 60px Georgia';c.fillStyle='#a66dc0';c.fillText(details.age+' anos de magia!',512,805);
   c.font='35px Arial';c.fillStyle='#51445b';
   if(details.date)c.fillText(details.date+'  •  '+(details.time||'Horário a confirmar'),512,902,750);
   if(details.venue)c.fillText(details.venue,512,962,750);
   resolve(canvas.toDataURL('image/png'));
  };img.onerror=()=>reject(Error('Não foi possível preparar o convite'));img.src=background;
 });
}
export default function Home(){
 const [name,setName]=useState(''),[age,setAge]=useState(''),[theme,setTheme]=useState('safari');
 const [date,setDate]=useState(''),[time,setTime]=useState(''),[venue,setVenue]=useState('');
 const [referenceImage,setReferenceImage]=useState(''),[referenceName,setReferenceName]=useState('');
 async function chooseReference(e){const file=e.target.files?.[0];if(!file)return;if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>8_000_000){setError('Escolha PNG, JPG ou WebP de até 8 MB.');return;}try{const src=await new Promise((resolve,reject)=>{const rd=new FileReader();rd.onload=()=>resolve(rd.result);rd.onerror=reject;rd.readAsDataURL(file);});const im=new Image();im.src=src;await im.decode();const cv=document.createElement('canvas');const scale=Math.min(1,1024/Math.max(im.width,im.height));cv.width=Math.round(im.width*scale);cv.height=Math.round(im.height*scale);cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);setReferenceImage(cv.toDataURL('image/jpeg',.82));setReferenceName(file.name);setError('');}catch{setError('Não foi possível abrir a imagem de referência.');}}
 const [code,setCode]=useState(''),[progress,setProgress]=useState(''),[loading,setLoading]=useState(false),[result,setResult]=useState(''),[kit,setKit]=useState(null),[error,setError]=useState('');
 async function generate(e){e.preventDefault();setLoading(true);setError('');setResult('');setKit(null);setProgress('');
  try{setKit(await createKit({name,age:Number(age),theme,date,time,venue,code,referenceImage},setProgress));
  }catch(e){setError(e.message||'Não foi possível gerar')}finally{setLoading(false)}
 }
 return <><header className="container nav"><a href="#" className="brand">festa<span>mágica</span> ✦</a><a className="navLink" href="#criar">Criar convite ✨</a></header>
 <main><section className="hero"><div className="container heroGrid"><div><div className="eyebrow">✦ Sua festa começa aqui</div>
 <h1>Uma festa <em>mágica</em> começa com um convite único.</h1>
 <p className="lead">Crie um kit completo de festa personalizado com o nome, a idade e o tema do aniversário. Uma experiência simples, rápida e cheia de encanto.</p>
 <a href="#criar" className="btn" style={{marginTop:14}}>Criar meu convite ✨</a>
 <div className="chips"><span>✨ Personalizado com IA</span><span>💗 Feito com carinho</span><span>📱 Pronto para compartilhar</span></div></div>
 <div className="art"><span className="float one">✦ 100% personalizado</span><div className="cake">🎂</div><h3>O grande dia!</h3><p>Um toque de magia em cada detalhe.</p><span className="float two">💗 Nome + idade + tema</span></div></div></section>
 <section className="section container" id="criar"><div className="eyebrow center">ESTÚDIO MÁGICO</div><h2 className="sectionTitle center">Vamos criar algo especial?</h2>
 <p className="sub center">Escolha o tema favorito, conte quem vai fazer aniversário e veja o resultado da nossa inteligência artificial.</p>
 <div className="studio"><form className="panel" onSubmit={generate}><h3>Personalize sua festa</h3><p>Um pouquinho de informação e muita magia.</p>
 <div className="field"><label htmlFor="nome">Nome do aniversariante</label><input id="nome" required maxLength={35} placeholder="Ex.: Sofia" value={name} onChange={e=>setName(e.target.value)}/></div>
 <div className="field"><label htmlFor="idade">Idade</label><input id="idade" required type="number" min="1" max="99" placeholder="Ex.: 5" value={age} onChange={e=>setAge(e.target.value)}/></div>
 <div className="field"><label>Tema da festa</label><div className="themes">{themes.map(t=><button key={t.id} type="button" className={'theme '+(t.id===theme?'active':'')} onClick={()=>setTheme(t.id)}>{t.emoji}<br/>{t.name}</button>)}</div></div>
 <div className="field"><label htmlFor="dia">Data (opcional)</label><input id="dia" type="date" value={date} onChange={e=>setDate(e.target.value)}/></div>
 <div className="field"><label htmlFor="hora">Horário (opcional)</label><input id="hora" type="time" value={time} onChange={e=>setTime(e.target.value)}/></div>
 <div className="field"><label htmlFor="local">Local (opcional)</label><input id="local" maxLength={80} placeholder="Ex.: Salão de festas" value={venue} onChange={e=>setVenue(e.target.value)}/></div>
 <div className="field"><label htmlFor="referencia">Imagem de referência visual (opcional)</label><input id="referencia" type="file" accept="image/png,image/jpeg,image/webp" onChange={chooseReference}/><p className="muted">{referenceName?`Referência selecionada: ${referenceName}`:"Envie uma das artes premium aprovadas para orientar o estilo das seis peças."}</p>{referenceImage&&<button type="button" className="outline" onClick={()=>{setReferenceImage("");setReferenceName("");}}>Remover referência</button>}</div>
 <div className="price">🎁 Kit de lançamento: <strong>R$ 39,90</strong><div className="muted">Checkout ainda não habilitado. Estamos testando a qualidade das seis artes.</div></div>
 <div className="field"><label htmlFor="code">Código de teste privado</label><input id="code" required type="password" autoComplete="off" placeholder="Código configurado no Railway" value={code} onChange={e=>setCode(e.target.value)}/></div>
 <button type="submit" className="btn" style={{width:'100%'}} disabled={loading}>{loading?(progress||'Criando as seis artes… ✨'):'Gerar kit de teste ✨'}</button>
 {error&&<p role="alert" className="error">{error}</p>}<p className="muted">Teste privado sem pagamento. Cada kit completo consome seis gerações de imagem.</p></form>
 <div className={'preview '+(kit?'previewKit':'')}>{kit?<KitGallery kit={kit} name={name} onReset={()=>setKit(null)}/>:result?<div className="rendered"><img src={result} alt={'Convite personalizado de '+name}/><div className="actions"><a className="btn" href={result} download="meu-convite-festamagica.png">Baixar PNG ↓</a><button type="button" className="outline" onClick={()=>setResult('')}>Criar outro</button></div></div>
 :<div className="placeholder"><div>🎈</div><h3>{loading?'A magia está acontecendo…':'Sua criação aparece aqui'}</h3><p>{loading?'Gerando seis composições individuais. Isso pode levar alguns minutos.':'Preencha o formulário, escolha um tema e veja seu kit de festa nascer.'}</p></div>}</div></div></section>
 <section className="banner"><div className="container"><h2 className="sectionTitle">Um aniversário, mil lembranças.</h2><p className="sub">Convite, topper, tags, bandeirolas, placa de boas-vindas e arte digital em uma só identidade.</p><a href="#criar" className="btn">Experimentar agora ✨</a></div></section></main>
 <footer className="footer">FestaMágica AI · Celebre os momentos especiais. ✨</footer></>;
}
