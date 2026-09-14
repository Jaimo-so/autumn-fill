(() => {
const norm=s=>String(s||'').toLowerCase().replace(/[\s*＊:：()（）_\-\/·.]/g,'');
function sectionKey(text,sections){
 const title=norm(text).replace(/(?:必填|选填)$/,'').replace(/\d+$/,'');
 return sections.find(s=>[s.label,...s.aliases].some(name=>norm(name)===title))?.key||null;
}
const familyKeys={'姓名':'name','成员姓名':'name','年龄':'age','工作单位':'company','单位':'company','职位':'role','职务':'role','联系电话':'phone','手机号码':'phone','政治面貌':'politics'};
function familyLabel(label){
 const text=String(label||'').replace(/^(?:请输入|请填写|请选择)/,'').replace(/[\s*＊:：]/g,'');
 let match=text.match(/^(.+?)[-－—（(](父亲|母亲)[）)]?$/);
 if(!match){const prefix=text.match(/^(父亲|母亲)[-－—](.+)$/);if(prefix)match=[prefix[0],prefix[2],prefix[1]];}
 if(!match)return null;
 const key=familyKeys[match[1]];return key?{key,relation:match[2]}:null;
}
function score(label,field,section){
 const n=norm(label);if(!n)return 0;if(section&&field.section!==section)return 0;
 const names=[field.label,...field.aliases].map(norm);
 if(names.includes(n))return section?110:100;
 if(names.some(x=>x.length>=3&&(n===`请输入${x}`||n===`请填写${x}`||n===`请选择${x}`)))return section?105:95;
 return 0;
}
function choose(descriptor,fields){
 const named=descriptor.labels.map(familyLabel).filter(Boolean);
 if(named.length){
  if(descriptor.section&&descriptor.section!=='family')return null;
  const target=named[0];if(named.some(n=>n.key!==target.key||n.relation!==target.relation))return null;
  const relations=target.relation==='父亲'?['父亲','爸爸','父子','父女']:['母亲','妈妈','母子','母女'];
  const members=fields.filter(f=>f.section==='family'&&f.id.endsWith('.relation')&&relations.includes(norm(f.value)));
  if(members.length!==1)return null;
  const values=fields.filter(f=>f.section==='family'&&f.index===members[0].index&&f.id.endsWith('.'+target.key));return values.length===1?values[0]:null;
 }

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
globalThis.AutumnEngine={norm,sectionKey,familyLabel,score,choose,dateValue,safeEditable,read,write};
})();
