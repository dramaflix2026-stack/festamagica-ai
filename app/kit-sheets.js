// Catálogo de pranchas: novos temas precisam apenas de uma entrada e de uma prancha.
export const kitSheets={
 dinossauros:{
  title:'Dinossauros',
  src:'/kits/dinossauros/Kit%20Festa%20Dinossauros%20do%20Heitor.png',
  personalized:false,
  note:'Prancha demonstrativa com textos incorporados. Para personalização fiel, envie a versão sem textos.',
  regions:[
   {key:'convite',label:'Convite',rect:[0,0,.386,1]},
   {key:'topper',label:'Topper',rect:[.392,0,.37,.514]},
   {key:'tags',label:'Tags',rect:[.765,0,.235,.514]},
   {key:'boasvindas',label:'Boas-vindas',rect:[.392,.521,.37,.479]},
   {key:'digital',label:'Convite digital',rect:[.765,.521,.235,.479]}
  ]
 }
};
export function sheetForTheme(theme){return kitSheets[theme]||null}
