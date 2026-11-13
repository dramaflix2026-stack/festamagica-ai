// Internal visual reference library. Never expose selection controls to customers.
// Upload approved PNG/JPG artwork to public/references/ with these filenames.
export const visualReferences={
 safari:{
  name:'Safari Premium',
  files:{
   convite:"Convite Safari da Sofia 5 Anos.png",
   topper:"Topo de Bolo Safari da Sofia.png",
   tags:"Tags Safari da Sofia – 5 Anos.png",
   bandeirolas:"Bandeirolas Safari Personalizadas da Sofia.png",
   boasvindas:"Placas Safari da Sofia.png",
   digital:"Convite Safári da Sofia aos 5 Anos.png"
  }
 }
};
export function referenceFor(theme,piece){
 const file=visualReferences[theme]?.files?.[piece];
 return file?'/references/'+file:null;
}
