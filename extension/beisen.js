(() => {
const E=AutumnEngine;
const sectionNames={'个人基本信息':'personal','个人基本资料':'personal','教育经历':'education','计算机技能':'skill','工作/实习经历':'employment','学习/工作获奖情况':'award','专业论著':'publication','语言能力':'language','参与科研项目':'project','专业资格':'certificate','家庭成员及重要社会关系':'family','其他信息':'other','本人承诺':'declaration','附加信息':'declaration','违规、违纪、违法、犯罪、涉黑、涉恶等受到处理的情况':'declaration'};
const clean=s=>String(s||'').replace(/[*＊]/g,'').trim();
function describe(el){const item=el.closest('.form-item');if(!item)return null;const label=item.querySelector('.form-item__text')?.textContent.trim();let section=null,p=item;
 for(let i=0;p&&i<22;i++,p=p.parentElement){const direct=[...p.children].filter(n=>!n.contains(item)&&!n.querySelector('.form-item'));for(const child of direct){const text=clean(child.textContent);if(Object.hasOwn(sectionNames,text)){section=sectionNames[text];break;}}if(section)break;}
 return {labels:label?[label]:[],section};
}
function isIdentityInput(el){return el?.tagName==='INPUT'&&E.safeEditable(el)&&['证件号码','证件号','身份证','身份证号','身份证号码'].includes(E.norm(describe(el)?.labels[0]));}
const isControl=el=>isIdentityInput(el)||el?.matches?.('.phoenix-select,.phoenix-radio-group');
const shown=el=>!!el&&el.isConnected&&el.getBoundingClientRect().width>0&&el.ownerDocument.defaultView.getComputedStyle(el).visibility!=='hidden';
function read(el){
 if(el.tagName==='INPUT')return E.read(el);
 if(el.matches('.phoenix-radio-group')){const checked=[...el.querySelectorAll('.phoenix-radio')].find(n=>/--checked\b/.test(n.className)||n.getAttribute('aria-checked')==='true');return checked?.querySelector('.phoenix-radio__radio-text')?.textContent.trim()||'';}
 const content=el.querySelector('.phoenix-select__content');if(!content)return '';const copy=content.cloneNode(true);copy.querySelectorAll('.phoenix-select__inputWrapper,input').forEach(n=>n.remove());return copy.textContent.trim();
}
function editable(el){return shown(el)&&!el.matches('[aria-disabled="true"]')&&!/--disabled\b/.test(el.className)&&!el.closest('.form-item--disabled');}
async function wait(fn,timeout=1800){const start=Date.now();do{const result=fn();if(result)return result;await new Promise(r=>setTimeout(r,70));}while(Date.now()-start<timeout);return null;}
function exact(value,option,label){const a=E.norm(value),b=E.norm(option);if(a===b)return true;
 if(label==='学历'){const aliases={'硕士':'硕士研究生','博士':'博士研究生','专科':'大专'};return aliases[value]===option;}return false;
}
async function write(el,value){
 if(isIdentityInput(el)){el.focus();if(!el.isConnected)return {ok:false,reason:'页面已更新，请重新扫描'};const result=E.write(el,value);el.blur();return result;}
 if(!editable(el))return {ok:false,reason:'控件不可编辑'};
 const v=String(value),doc=el.ownerDocument,label=describe(el)?.labels[0]||'';
 if(el.matches('.phoenix-radio-group')){
  if(!v)return {ok:false,reason:'网站单选项需手动清除'};
  const options=[...el.querySelectorAll('.phoenix-radio')].filter(n=>!n.className.includes('--disabled')&&exact(v,n.querySelector('.phoenix-radio__radio-text')?.textContent.trim(),label));
  if(options.length!==1)return {ok:false,reason:'没有唯一匹配的单选项'};options[0].click();const ok=await wait(()=>exact(v,read(el),label));return {ok:!!ok,value:read(el),reason:'单选状态未确认，请手动检查'};
 }
 if(!v){const clear=el.querySelector('.phoenix-select__clearIcon');if(clear)clear.click();const ok=await wait(()=>!read(el));return {ok:!!ok,value:'',reason:'该下拉项需手动清空'};}
 // 仅处理刚刚打开的弹层，避免点击页面中无关的“确定”。
 const selector='.phoenix-selectList,.constant-main-selector-container,.phoenix-calendar';
 const previous=new Set([...doc.querySelectorAll(selector)].filter(shown));
 el.click();
 const popup=await wait(()=>[...doc.querySelectorAll(selector)].find(p=>shown(p)&&!previous.has(p)));
 if(!popup)return {ok:false,reason:'未识别到选择弹层，请点选辅助或手动选择'};
 const close=()=>{const cancel=[...popup.querySelectorAll('.phoenix-button__content')].find(n=>n.textContent.trim()==='取消');if(cancel)cancel.click();else{el.dispatchEvent(new doc.defaultView.KeyboardEvent('keydown',{key:'Escape',code:'Escape',keyCode:27,bubbles:true}));doc.body.click();}};
 if(popup.matches('.phoenix-calendar')){
  const input=popup.querySelector('.phoenix-calendar-input');if(!input){close();return {ok:false,reason:'此日期控件需要手动选择'};}
  const sample=input.value.trim();const type=/^\d{4}-\d{2}$/.test(sample)?'month':'date';const date=E.dateValue(v,type);if(!date){close();return {ok:false,reason:'日期精度不匹配，请补充完整日期或手动选择'};}
  E.write(input,date);input.dispatchEvent(new doc.defaultView.KeyboardEvent('keydown',{key:'Enter',code:'Enter',keyCode:13,which:13,bubbles:true}));
  const ok=await wait(()=>read(el)===date);if(!ok)close();return {ok:!!ok,value:read(el),reason:'网站未确认日期，请手动选择'};
 }
 const optionSelector=popup.matches('.constant-main-selector-container')?'.list-item-container':'.phoenix-selectList__listItem';
 let options=[...popup.querySelectorAll(optionSelector)].filter(n=>shown(n)&&exact(v,n.textContent.trim(),label));
 if(options.length===0){const search=popup.querySelector('input:not([type=checkbox])');if(search){E.write(search,v);options=await wait(()=>{const matches=[...popup.querySelectorAll(optionSelector)].filter(n=>shown(n)&&exact(v,n.textContent.trim(),label));return matches.length===1?matches:null;},2000)||[];}}
 if(options.length!==1){close();return {ok:false,reason:'无唯一选项；省市级联或未加载内容请手动选择'};}
 options[0].click();if(popup.matches('.constant-main-selector-container')){const confirm=[...popup.querySelectorAll('.phoenix-button__content')].find(n=>n.textContent.trim()==='确定');if(confirm)confirm.click();}
 const ok=await wait(()=>exact(v,read(el),label));if(!ok)close();return {ok:!!ok,value:read(el),reason:'网站未确认选项，请手动检查'};
}
globalThis.AutumnBeisen={describe,isControl,read,write,editable};
})();
