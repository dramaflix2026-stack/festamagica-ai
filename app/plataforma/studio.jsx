'use client';
import {useState} from 'react';
import KitGallery,{createKit} from '../kit';
import FreePreview from '../free-preview';
import SheetTester from '../sheet-tester';
import {composeFive} from '../universal-kit';
import {getSession} from '../auth-client';
import {partyThemes,partyCategories} from '../themes';

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
export default function Studio({onGenerated}){
 const [name,setName]=useState(''),[age,setAge]=useState(''),[theme,setTheme]=useState('safari');
 const [themeSearch,setThemeSearch]=useState(''),[themeCategory,setThemeCategory]=useState('Todos'),[showAllThemes,setShowAllThemes]=useState(false);
 const filteredThemes=partyThemes.filter(t=>(themeCategory==='Todos'||t.category===themeCategory)&&t.name.toLocaleLowerCase('pt-BR').includes(themeSearch.toLocaleLowerCase('pt-BR')));
 const visibleThemes=showAllThemes||themeSearch||themeCategory!=='Todos'?filteredThemes:filteredThemes.slice(0,12);
 const [date,setDate]=useState(''),[time,setTime]=useState(''),[venue,setVenue]=useState('');
 const [showFreePreview,setShowFreePreview]=useState(false);
 const [code,setCode]=useState(''),[progress,setProgress]=useState(''),[loading,setLoading]=useState(false),[result,setResult]=useState(''),[kit,setKit]=useState(null),[error,setError]=useState('');
 async function generate(e){e.preventDefault();setLoading(true);setError('');setResult('');setKit(null);setProgress('');
  try{let generated;
   if(theme==='dinossauros'){
    setProgress('Gerando uma única ilustração do tema…');
    const response=await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+(getSession()?.access_token||'')},body:JSON.stringify({name,age:Number(age),theme,date,time,venue,code,piece:'digital'})});
    const data=await response.json();if(!response.ok)throw Error(data.error||'Falha ao gerar ilustração');
    generated=await composeFive(data.image,{name,age:Number(age),date,time,venue},setProgress);
   }else generated=await createKit({name,age:Number(age),theme,date,time,venue,code},setProgress);setKit(generated);if(onGenerated)await onGenerated({nome:name,idade:Number(age),tema:theme,data_festa:date||null,horario:time||null,local_festa:venue||null,status:'gerado'},generated);
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
 <div className="field"><label htmlFor="themeSearch">Tema da festa — {partyThemes.length} opções</label>
 <input id="themeSearch" placeholder="Buscar personagem, time, princesa, safari..." value={themeSearch} onChange={e=>{setThemeSearch(e.target.value);setShowAllThemes(true)}}/>
 <select className="themeCategory" aria-label="Categoria dos temas" value={themeCategory} onChange={e=>{setThemeCategory(e.target.value);setShowAllThemes(true)}}>{partyCategories.map(c=><option key={c} value={c}>{c}</option>)}</select>
 <div className="themeSelection">Tema escolhido: <strong>{partyThemes.find(t=>t.id===theme)?.name}</strong></div>
 <div className="themeCatalog">{visibleThemes.map(t=><button key={t.id} type="button" className={'themeTile '+(t.id===theme?'active':'')} onClick={()=>setTheme(t.id)} aria-pressed={t.id===theme}><span aria-hidden="true">{t.emoji}</span><small>{t.name}</small></button>)}</div>
 {!showAllThemes&&filteredThemes.length>visibleThemes.length&&<button className="themeMore" type="button" onClick={()=>setShowAllThemes(true)}>Ver todos os {partyThemes.length} temas ↓</button>}
 {filteredThemes.length===0&&<p className="muted">Nenhum tema encontrado. Experimente outra busca.</p>}
 <p className="muted">Personagens e marcas são opções de teste. Artes comerciais com personagens protegidos exigem autorização dos titulares.</p>
 </div>
 <div className="field"><label htmlFor="dia">Data (opcional)</label><input id="dia" type="date" value={date} onChange={e=>setDate(e.target.value)}/></div>
 <div className="field"><label htmlFor="hora">Horário (opcional)</label><input id="hora" type="time" value={time} onChange={e=>setTime(e.target.value)}/></div>
 <div className="field"><label htmlFor="local">Local (opcional)</label><input id="local" maxLength={80} placeholder="Ex.: Salão de festas" value={venue} onChange={e=>setVenue(e.target.value)}/></div>
 <button type="button" className="outline" style={{width:'100%',margin:'8px 0 18px'}} onClick={()=>setShowFreePreview(v=>!v)}>{showFreePreview?'Ocultar prévia gratuita':'👁️ Pré-visualizar sem gastar IA — grátis'}</button>
 
 <div className="price">🎁 Kit de lançamento: <strong>R$ 39,90</strong><div className="muted">Checkout ainda não habilitado. Estamos validando as cinco artes antes do lançamento.</div></div>
 <div className="field"><label htmlFor="code">Código de teste privado</label><input id="code" required type="password" autoComplete="off" placeholder="Código configurado no Railway" value={code} onChange={e=>setCode(e.target.value)}/></div>
 <button type="submit" className="btn" style={{width:'100%'}} disabled={loading}>{loading?(progress||'Criando sua arte… ✨'):'Gerar kit de teste ✨'}</button>
 {error&&<p role="alert" className="error">{error}</p>}<p className="muted">Teste privado sem pagamento. O kit completo gera cinco artes.</p></form>
 <div className={'preview '+(kit?'previewKit':'')}>{showFreePreview&&!kit&&!loading?(theme==='dinossauros'?<SheetTester theme={theme} name={name} age={age} date={date} time={time} venue={venue}/>:<FreePreview theme={theme} name={name} age={age} date={date} time={time} venue={venue}/>):kit?<KitGallery kit={kit} name={name} onReset={()=>setKit(null)}/>:result?<div className="rendered"><img src={result} alt={'Convite personalizado de '+name}/><div className="actions"><a className="btn" href={result} download="meu-convite-festamagica.png">Baixar PNG ↓</a><button type="button" className="outline" onClick={()=>setResult('')}>Criar outro</button></div></div>
 :<div className="placeholder"><div>🎈</div><h3>{loading?'A magia está acontecendo…':'Sua criação aparece aqui'}</h3><p>{loading?'Gerando sua arte personalizada. Isso pode levar alguns minutos.':'Preencha o formulário, escolha um tema e veja seu kit de festa nascer.'}</p></div>}</div></div></section>
 <section className="banner"><div className="container"><h2 className="sectionTitle">Um aniversário, mil lembranças.</h2><p className="sub">Convite, topper, tags, placa de boas-vindas e arte digital em uma só identidade.</p><a href="#criar" className="btn">Experimentar agora ✨</a></div></section></main>
 <footer className="footer">FestaMágica AI · Celebre os momentos especiais. ✨</footer></>;
}
