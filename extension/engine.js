(() => {
const norm=s=>String(s||'').toLowerCase().replace(/[\s*＊:：()（）_\-\/·.]/g,'');
function score(label,field,section){
 const n=norm(label);if(!n)return 0;if(section&&field.section!==section)return 0;
 const names=[field.label,...field.aliases].map(norm);
 if(names.includes(n))return section?110:100;
 if(names.some(x=>x.length>=3&&(n===`请输入${x}`||n===`请填写${x}`||n===`请选择${x}`)))return section?105:95;
 return 0;
}
function choose(descriptor,fields){
 for(const label of descriptor.labels){
 const ranked=fields.filter(f=>descriptor.index==null||f.index===descriptor.index).map(f=>({field:f,score:score(label,f,descriptor.section)})).filter(r=>r.score>=95).sort((a,b)=>b.score-a.score);
 if(!ranked.length)continue;const best=ranked.filter(r=>r.score===ranked[0].score);return best.length===1?best[0].field:null;
 }return null;
}
function dateValue(value,type){
 if(type!=='month'&&type!=='date')return value;
 const m=String(value).match(/^(\d{4})[-/.年](\d{1,2})(?:[-/.月](\d{1,2})日?)?$/);if(!m)return null;
 const month=Number(m[2]),day=m[3]?Number(m[3]):null;
 if(month<1||month>12)return null;
 const ym=`${m[1]}-${String(month).padStart(2,'0')}`;
 if(type==='month')return ym;
 if(day==null||day<1||day>new Date(Number(m[1]),month,0).getDate())return null;
 return `${ym}-${String(day).padStart(2,'0')}`;
}
function safeEditable(el){return !!el&&el.isConnected&&!el.disabled&&!el.readOnly&&((el.tagName==='INPUT'&&!['hidden','password','file','checkbox','radio','submit','button','reset','image','range','color'].includes(el.type))||el.tagName==='TEXTAREA'||el.tagName==='SELECT'||el.isContentEditable);}
function read(el){return el.isContentEditable?el.textContent:el.value;}
function write(el,value){
 if(!safeEditable(el))return {ok:false,reason:'该控件需要手动处理'};
 let v=String(value);const win=el.ownerDocument.defaultView;
 if(el.tagName==='SELECT'){
  const matches=[...el.options].filter(o=>!o.disabled&&(norm(o.textContent)===norm(v)||norm(o.value)===norm(v)));
  if(matches.length!==1)return {ok:false,reason:'没有唯一匹配的下拉选项'};v=matches[0].value;
 }else if(v!==''&&['date','month'].includes(el.type)){v=dateValue(v,el.type);if(!v)return {ok:false,reason:'日期精度不匹配，请手动选择'};}
 if(el.maxLength>0&&v.length>el.maxLength)return {ok:false,reason:'内容超过字数限制'};
 if(el.isContentEditable)el.textContent=v;
 else {const proto=el.tagName==='TEXTAREA'?win.HTMLTextAreaElement.prototype:el.tagName==='SELECT'?win.HTMLSelectElement.prototype:win.HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value').set.call(el,v);}
 el.dispatchEvent(new win.Event('input',{bubbles:true,composed:true}));el.dispatchEvent(new win.Event('change',{bubbles:true,composed:true}));
 return {ok:String(read(el))===v,value:v,reason:'控件未接受此内容'};
}
globalThis.AutumnEngine={norm,score,choose,dateValue,safeEditable,read,write};
})();
