(() => {
const E=AutumnEngine;
function describe(el){
 if(!el?.matches?.('input,textarea,select'))return null;
 const texts=[...(el.labels||[])].map(n=>n.textContent);
 texts.push(el.getAttribute('aria-label'),el.placeholder);
 // The form renders its label in a sibling container, rather than input.labels.
 let p=el;for(let depth=0;p?.parentElement&&depth<5;depth++,p=p.parentElement){
  for(const sibling of p.parentElement.children){if(sibling===p||sibling.querySelector('input,textarea,select'))continue;
   if(sibling.textContent.length<80)texts.push(sibling.textContent);
  }
  const matches=texts.filter(t=>E.familyLabel(t));if(matches.length)return {labels:[...new Set(matches.map(t=>t.trim()))],section:'family'};
 }
 return null;
}
const isControl=el=>el?.tagName==='INPUT'&&el.readOnly&&describe(el)?.labels.some(t=>E.familyLabel(t)?.key==='politics');
const read=el=>el.value;
const shown=el=>el.isConnected&&el.getBoundingClientRect().width>0&&el.getBoundingClientRect().height>0&&el.ownerDocument.defaultView.getComputedStyle(el).visibility!=='hidden';
const editable=el=>shown(el)&&!el.disabled&&el.getAttribute('aria-disabled')!=='true';
async function wait(fn){for(let i=0;i<20;i++){if(fn())return true;await new Promise(r=>setTimeout(r,60));}return false;}
async function write(el,value){
 if(!editable(el))return {ok:false,reason:'下拉控件不可编辑'};
 if(!value)return {ok:false,reason:'该下拉项请手动恢复为空'};
 const doc=el.ownerDocument,selector='li,[role="option"]';
 const previous=new Set([...doc.querySelectorAll(selector)].filter(shown));
 const optionValue=s=>E.norm(s)==='共青团员'?'团员':E.norm(s);
 el.click();let candidates=[];
 await wait(()=>{candidates=[...doc.querySelectorAll(selector)].filter(n=>shown(n)&&!previous.has(n)&&n.getAttribute('aria-disabled')!=='true'&&optionValue(n.textContent)===optionValue(value));return candidates.length>0;});
 if(candidates.length!==1){el.dispatchEvent(new doc.defaultView.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));el.blur();return {ok:false,reason:'政治面貌下拉没有唯一选项，请手动选择'};}
 candidates[0].click();const ok=await wait(()=>optionValue(read(el))===optionValue(value));
 return {ok,value:read(el),reason:'网站未确认政治面貌选项，请手动选择'};
}
globalThis.AutumnZhaopin={describe,isControl,read,write,editable};
})();
