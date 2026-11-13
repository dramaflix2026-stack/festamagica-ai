// Internal visual reference library. Never expose selection controls to customers.
// Upload approved PNG/JPG artwork to public/references/ with these filenames.
export const visualReferences={
 safari:{
  name:'Safari Premium',
  files:{
   convite:'safari-convite.png',
   topper:'safari-topper.png',
   tags:'safari-tags.png',
   bandeirolas:'safari-bandeirolas.png',
   boasvindas:'safari-boasvindas.png',
   digital:'safari-digital.png'
  }
 }
};
export function referenceFor(theme,piece){
 const file=visualReferences[theme]?.files?.[piece];
 return file?'/references/'+file:null;
}
