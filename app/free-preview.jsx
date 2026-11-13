'use client';
import {partyThemes} from './themes';
const palettes={
 'Animais e natureza':['#f3e9c8','#c0d69e','#527e56'],
 'Princesas e fantasia':['#fbe1ef','#e9c9ff','#a05ca8'],
 'Super-heróis':['#d9e9ff','#ffdf9c','#3158a1'],
 'Desenhos e personagens':['#fff0d8','#f7c5df','#b65b8d'],
 'Games e animes':['#e1e8ff','#d1c4ff','#5958aa'],
 'Esportes e times':['#dcf0e4','#d1e5ff','#338065'],
 'Bebês e primeiro ano':['#fff0e8','#f8d9e7','#b7809f'],
 'Aventura e transportes':['#e4f0ff','#ffe7c7','#5689ae'],
 'Festas clássicas':['#ffe9ef','#f5e6bf','#b87b91'],
 'Estilos e tendências':['#eee5fb','#fbe5ec','#9566a8']
};
export default function FreePreview({theme,name,age,date,time,venue}){
 const t=partyThemes.find(x=>x.id===theme)||partyThemes[0];
 const [bg,accent,ink]=palettes[t.category]||['#f8e8f3','#e9d4f8','#9256a5'];
 const person=(name||'Nome').slice(0,35),years=age||'5';
 const pieces=[['Convite','Você está convidado!'],['Topper','Feliz aniversário!'],['Tags','Feito com carinho'],['Boas-vindas','Seja bem-vindo!'],['WhatsApp','Vamos comemorar!']];
 return <section className="freePreview" aria-label="Prévia visual sem inteligência artificial"><div className="freePreviewHead"><div><strong>🎨 Prévia gratuita · {t.name}</strong><p>Simulação de layout e paleta. Não é a arte final.</p></div><span>R$ 0,00 em IA</span></div><div className="freePreviewGrid">{pieces.map(([piece,title],i)=><article className="freePreviewArt" key={piece} style={{background:`linear-gradient(145deg,${bg},${accent})`,color:ink}}><div className="freePreviewOrnament">{t.emoji} ✦ {t.emoji}</div><small>{title}</small><strong>{person}</strong><b>{years} anos</b>{i===0||i===4?<span>{date||'Data da festa'} · {time||'Horário'}<br/>{venue||'Local da festa'}</span>:<span>{t.name}</span>}<div className="freePreviewDecor">✧ ✦ ✧</div><footer>{piece}</footer></article>)}</div><p className="freePreviewNotice">Esta prévia usa somente HTML e CSS no navegador: nenhuma chamada à API, nenhum crédito consumido e nenhum arquivo salvo. Ela permite conferir textos e cores; não substitui a homologação das ilustrações premium.</p></section>
}
