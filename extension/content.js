(() => {
if(globalThis.__autumnFill){globalThis.__autumnFill.open();return;}
const S=AutumnSchema,E=AutumnEngine,A=globalThis.AutumnBeisen,Z=globalThis.AutumnZhaopin;
const readValue=el=>Z?.isControl(el)?Z.read(el):A?.isControl(el)?A.read(el):E.read(el);
const writeValue=async(el,value)=>Z?.isControl(el)?Z.write(el,value):A?.isControl(el)?A.write(el,value):E.write(el,value);
const editable=el=>Z?.isControl(el)?Z.editable(el):A?.isControl(el)?A.editable(el):E.safeEditable(el);
let entries=[],running=false,cancel=false,selected=null,descriptors=[],suggestions=[],history=[],hasRun=false;
const host=document.createElement('div');host.id='autumn-fill-host';host.style.cssText='position:fixed;right:22px;top:90px;width:364px;max-width:calc(100vw - 24px);z-index:2147483647';
const shadow=host.attachShadow({mode:'closed'});
shadow.innerHTML=`<style>
:host{all:initial;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;color:#294035;font-size:13px}*{box-sizing:border-box}button,input,select{font:inherit}button{cursor:pointer;border:1px solid #d9e3d8;border-radius:8px;padding:9px 12px;background:#fff;color:#2b4937}button:hover{background:#edf3e9}button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid #55916f;outline-offset:2px}button:disabled{opacity:.5;cursor:default}.panel{background:#fcfdfa;border:1px solid #dbe4d7;border-radius:15px;box-shadow:0 16px 52px #102a2426;overflow:hidden}.head{background:#285e44;color:#fff;padding:16px;display:flex;align-items:center;gap:9px;cursor:move;touch-action:none}.head strong{font-size:17px;letter-spacing:1px}.head small{font-size:10px;opacity:.7;flex:1}.head button{background:transparent;color:#fff;border:0;padding:3px 7px}.body{padding:18px;max-height:calc(100vh - 200px);overflow:auto}.intro{font-size:18px;font-weight:600;margin:0 0 8px}.sub{font-size:12px;color:#758171;line-height:1.7;margin:0 0 17px}.status{background:#edf3e8;padding:12px;border-radius:8px;line-height:1.7;margin-bottom:13px;overflow-wrap:anywhere}.stats{display:flex;gap:8px;margin-bottom:14px}.stat{flex:1;background:#f0f3ec;border-radius:8px;padding:12px}.stat b{display:block;font-size:23px;font-weight:600;margin-bottom:4px}.stat span{font-size:11px;color:#788373}progress{width:100%;height:6px;accent-color:#427453;margin:8px 0 16px}.actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}.primary{background:#2d6748;color:#fff;border-color:#2d6748}.primary:hover{background:#26593e}.wide{grid-column:1/-1}.muted{font-size:11px;color:#87917e;line-height:1.6}.tabs{display:flex;gap:5px;border-bottom:1px solid #e3e8dd;margin:19px 0 14px;padding-bottom:8px}.tabs button{border:0;background:transparent;flex:1}.tabs .active{background:#e9f0e3;color:#386140;font-weight:600}.search,select{width:100%;padding:10px;border:1px solid #dbe3d5;border-radius:7px;background:#fff;color:#354a37;margin-bottom:9px}.library{max-height:280px;overflow:auto}.entry{padding:13px 0;border-bottom:1px solid #e3e9de}.entry h4{margin:0 0 9px;font-size:12px;color:#687c60;line-height:1.5}.chips{display:flex;flex-wrap:wrap;gap:6px}.chip{font-size:11px;padding:7px 8px;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.chip.active{background:#d5e7c8;border-color:#6b9661}.selected{background:#f5efde;padding:10px;border-radius:8px;margin:9px 0;font-size:12px;line-height:1.7;white-space:pre-wrap;overflow-wrap:anywhere}.report-row{padding:9px 0;border-bottom:1px solid #e5e9e0;font-size:12px;line-height:1.7}.report-row strong{display:block}.report-row button{font-size:11px;padding:4px 8px;margin-top:5px}.hidden{display:none!important}.collapse .body{display:none}.footer{margin:13px 0 0;font-size:10px;color:#8a9381;text-align:center}.row{display:flex;gap:6px}.row>*{flex:1}
</style><section class="panel" aria-label="秋填网申助手"><header class="head"><strong>秋填</strong><small>PERSONAL ASSISTANT</small><button id="min" aria-label="折叠助手">−</button><button id="close" aria-label="关闭助手">×</button></header><div class="body"><p class="intro">这次网申，轻松一点。</p><p class="sub" id="profile-info">正在读取简历资料…</p><div class="stats"><div class="stat"><b id="filled">0</b><span>本轮已填</span></div><div class="stat"><b id="pending">0</b><span>本轮待处理</span></div></div><div class="status" id="status" role="status" aria-live="polite">先扫描当前页面，或直接开始填写。</div><progress id="progress" value="0" max="100" aria-label="填写进度"></progress><div class="actions"><button id="fill" class="primary wide">一键填写</button><button id="scan">扫描页面</button><button id="stop" disabled>停止填写</button><button id="undo">撤销本次填写</button><button id="options">管理简历 ↗</button></div><div class="tabs"><button id="tab-library" class="active">辅助填写</button><button id="tab-report">填写结果</button></div><div id="library-view"><p class="sub">选一个资料字段，再点击网页输入框。Esc 取消选择。</p><input class="search" id="search" type="search" placeholder="搜索字段或资料内容" aria-label="搜索简历字段"><select id="category" aria-label="资料分类"><option value="">全部分类</option></select><div class="selected hidden" id="selection"></div><button id="copy" class="hidden">复制所选内容</button><div class="library" id="library"></div></div><div id="report-view" class="hidden"><p class="sub">自动填写只处理可唯一匹配的空白字段。</p><button id="ai" class="wide">用 AI 识别未匹配字段</button><p class="muted">发送字段标签与资料条目名称到已配置接口；建议需逐项确认。</p><div id="suggestions"></div><div id="report" class="library"></div></div><p class="footer">填写完成后请核对页面，再自行提交</p></div></section>`;
document.documentElement.append(host);
const $=s=>shadow.querySelector(s),say=t=>$('#status').textContent=t;
function node(tag,text,cls){const e=document.createElement(tag);e.textContent=text;if(cls)e.className=cls;return e;}
function visible(el){const r=el.getBoundingClientRect(),w=el.ownerDocument.defaultView,c=w.getComputedStyle(el);return r.width>0&&r.height>0&&c.visibility!=='hidden'&&c.display!=='none';}
const hooked=new WeakSet();
function roots(root=document,all=[],seen=new Set()){
 if(seen.has(root))return all;seen.add(root);all.push(root);if(!hooked.has(root)){root.addEventListener('click',onPageClick,true);root.addEventListener('keydown',onKey,true);hooked.add(root);}
 for(const el of root.querySelectorAll('*')){if(el===host)continue;if(el.shadowRoot)roots(el.shadowRoot,all,seen);if(el.tagName==='IFRAME'){try{if(el.contentDocument&&visible(el))roots(el.contentDocument,all,seen);}catch{}}}return all;
}
function labelText(label){const copy=label.cloneNode(true);copy.querySelectorAll('input,textarea,select,button').forEach(n=>n.remove());return copy.textContent;}
function labels(el){
 const site=Z?.describe(el)||A?.describe(el);if(site?.labels.length)return site.labels;
 const out=[];if(el.labels)out.push(...[...el.labels].map(labelText));
 const root=el.getRootNode();for(const id of (el.getAttribute('aria-labelledby')||'').split(/\s+/))if(id)out.push(root.getElementById?.(id)?.textContent||'');
 out.push(el.getAttribute('aria-label'),el.placeholder);
 let p=el.parentElement;for(let i=0;p&&i<3;i++,p=p.parentElement){const direct=[...p.children].filter(n=>n!==el&&['LABEL','DT','TH'].includes(n.tagName));out.push(...direct.map(labelText));if(out.some(x=>x&&x.trim()&&!/^(请输入|请填写|请选择)$/.test(x.trim())))break;const prev=p===el.parentElement?el.previousElementSibling:p.previousElementSibling;if(prev&&!prev.querySelector('input,select,textarea')&&prev.textContent?.trim().length<60)out.push(prev.textContent);}
 out.push(el.name,el.id);return [...new Set(out.filter(x=>x&&x.trim()&&x.trim().length<100).map(x=>x.trim()))];
}
function sectionOf(el){
 const site=Z?.describe(el)||A?.describe(el);if(site?.section)return site.section;
 const find=text=>S.sections.find(s=>s.key===E.sectionKey(text,S.sections));
 let p=el.parentElement;for(let depth=0;p&&depth<9;depth++,p=p.parentElement){
  const title=p.getAttribute('data-section');if(title&&S.sections.some(s=>s.key===title))return title;
  const heads=[...p.querySelectorAll('h1,h2,h3,h4,h5,h6,legend,[role=heading]')].filter(h=>!h.contains(el));const before=heads.filter(h=>h.compareDocumentPosition(el)&Node.DOCUMENT_POSITION_FOLLOWING);
  if(before.length){for(const h of before.reverse()){const section=find(h.textContent);if(section)return section.key;}}
  const prev=p.previousElementSibling;if(prev&&prev.textContent.length<45){const section=find(prev.textContent);if(section)return section.key;}
 }return null;
}
function chooseEntry(d){if(d.section==='declaration')return null;if(d.section==='employment'){const work=entries.filter(e=>e.section==='work'),offset=work.length?Math.max(...work.map(e=>e.index))+1:0;const combined=[...work,...entries.filter(e=>e.section==='internship').map(e=>({...e,index:e.index+offset}))].map(e=>({...e,section:'employment'}));return E.choose(d,combined);}return E.choose(d,entries);}
function collectDescriptors(){
 const all=roots().flatMap(r=>[...r.querySelectorAll('input,textarea,select,[contenteditable="true"],.phoenix-select,.phoenix-radio-group')]).filter(el=>editable(el)&&visible(el)&&!el.closest('[data-autumn-ignore]')&&!(el.tagName==='INPUT'&&el.closest('.phoenix-select'))&&!el.closest('.phoenix-calendar,.phoenix-selectList,.constant-main-selector-container'));
 const seen=new Map();return all.map((el,i)=>{let ls=labels(el);const section=sectionOf(el);if(ls.some(l=>/^(?:项目)?起止(?:时间|日期)$/.test(l.replace(/[:：*\s]/g,'')))){let parent=el.parentElement;for(let depth=0;parent&&depth<3;depth++,parent=parent.parentElement){const pair=[...parent.querySelectorAll('input')].filter(E.safeEditable);if(pair.length===2&&pair.includes(el)){ls=[pair.indexOf(el)===0?'开始时间':'结束时间',...ls];break;}}}const signature=section+'|'+E.norm(ls[0]||'');let index=null;
 if(section&&(section==='employment'||S.sections.find(s=>s.key===section)?.repeat)){index=seen.get(signature)||0;seen.set(signature,index+1);}
 const d={id:'f'+i,el,root:el.getRootNode(),labels:ls,section,index,status:String(readValue(el)||'').trim()?'已有内容':'待匹配'};
 if(d.status==='待匹配'){d.entry=chooseEntry(d);if(d.entry)d.status='可填写';}return d;});
}
function scan(){
 descriptors=collectDescriptors();suggestions=[];$('#suggestions').replaceChildren();renderReport();return descriptors;
}
function renderReport(){const box=$('#report');box.replaceChildren();for(const d of descriptors){const row=node('div','', 'report-row');row.append(node('strong',d.labels[0]||'未命名输入框'),node('span',`${d.section?(d.section==='employment'?'工作 / 实习经历':S.sections.find(s=>s.key===d.section)?.label||'需手动确认')+' · ':''}${d.status}${d.entry?' → '+d.entry.label:''}`));const jump=node('button','定位');jump.onclick=()=>{if(d.el.isConnected){d.el.scrollIntoView({block:'center',behavior:'smooth'});d.el.focus();}};row.append(document.createTextNode(' '),jump);box.append(row);}$('#pending').textContent=descriptors.filter(d=>!['已填写','已有内容'].includes(d.status)).length;}
async function refresh(){try{const r=await chrome.runtime.sendMessage({type:'PROFILE'});if(!r.ok)throw Error(r.error);entries=S.flatten(S.validateProfile(r.profile));$('#profile-info').textContent=`资料库已准备 ${entries.length} 项 · 只填写空白内容`;renderLibrary();if(!entries.length)say('还没有简历资料，请先点击「管理简历」录入并保存。');}catch(e){say('读取失败：'+e.message);}}
function renderLibrary(){const box=$('#library');box.replaceChildren();const q=$('#search').value.toLowerCase(),category=$('#category').value;const filtered=entries.filter(e=>(!category||e.section===category)&&[e.label,e.value,e.title,...e.aliases].join(' ').toLowerCase().includes(q));const groups=new Map();for(const e of filtered){const key=e.section+'.'+e.index;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(e);}for(const list of groups.values()){const e=list[0],group=node('div','','entry');group.append(node('h4',`${e.sectionLabel} ${S.sections.find(s=>s.key===e.section).repeat?e.index+1:''} · ${e.title}`));const chips=node('div','','chips');for(const e of list){const b=node('button',e.label,'chip'+(selected?.id===e.id?' active':''));b.title=e.value;b.onclick=()=>{selected=e;$('#selection').classList.remove('hidden');$('#copy').classList.remove('hidden');$('#selection').textContent=`待填写：${e.label}\n${e.value.slice(0,240)}${e.value.length>240?'…':''}\n现在点击网页输入框，Esc 取消。`;renderLibrary();};chips.append(b);}group.append(chips);box.append(group);}if(!filtered.length)box.append(node('p','没有匹配资料。可在「管理简历」补充并保存。','sub'));}
function clearSelection(){selected=null;$('#selection').classList.add('hidden');$('#copy').classList.add('hidden');renderLibrary();}
$('#copy').onclick=async()=>{if(!selected)return;try{await navigator.clipboard.writeText(selected.value);say('已复制，可以粘贴到需要的位置。');}catch{say('浏览器未允许复制，请在资料管理页复制该内容。');}};
function onKey(event){if(event.key==='Escape'){clearSelection();say('已取消辅助填写选择');}}
async function onPageClick(event){
 if(!selected||running||event.composedPath().includes(host))return;
 const el=event.composedPath().find(n=>n?.nodeType===1&&editable(n)&&!(n.tagName==='INPUT'&&n.closest('.phoenix-select')));if(!el)return;
 const entry=selected;event.preventDefault();event.stopPropagation();
 if(String(readValue(el)||'').trim()&&!confirm(`此输入框已有内容，是否替换为「${entry.label}」？`))return;
 const before=readValue(el);clearSelection();running=true;let res;try{res=await writeValue(el,entry.value);}finally{running=false;}if(res.ok){history.push({el,before,after:res.value});clearSelection();say(`已填入「${entry.label}」，请核对网页。`);}else say(res.reason+'。可以选中资料后使用复制。');
}
// A replaced personal field can be recovered only within its original DOM root.
// Repeated experience rows are not rebound by position: their order may have changed.
function resolveField(d){
 if(d.el.isConnected&&editable(d.el)&&visible(d.el))return d.el;
 const namedFamily=d.section==='family'&&d.labels.some(label=>E.familyLabel(label));
 if(d.index!==null&&!namedFamily)return null;
 const matches=collectDescriptors().filter(n=>n.root===d.root&&n.section===d.section&&(n.index===null||namedFamily)&&n.labels.some(l=>d.labels.some(old=>E.norm(old)===E.norm(l)))&&chooseEntry(n)?.id===d.entry?.id);
 if(matches.length!==1)return null;
 d.el=matches[0].el;return d.el;
}
async function fillField(d){
 for(let attempt=0;attempt<2;attempt++){
  const el=resolveField(d);if(!el){d.status='页面已更新，无法唯一定位，请重新扫描';return null;}
  if(String(readValue(el)||'').trim()){d.status='已有内容';return null;}
  const before=readValue(el),res=await writeValue(el,d.entry.value);
  await new Promise(r=>setTimeout(r,180));
  const current=resolveField(d);
  if(res.ok&&current&&String(readValue(current))===res.value){d.status='已填写';return {el:current,before,after:res.value,d};}
  // Retry once only when the site replaced the control with a uniquely identified blank.
  if(!cancel&&attempt===0&&current&&current!==el&&!String(readValue(current)||'').trim())continue;
  d.status=!current?'页面已更新，无法确认填写结果':res.ok?'页面未保留内容，请辅助填写':res.reason;return null;
 }
}
async function run(){
 if(running)return;running=true;$('#fill').disabled=true;await refresh();if(!entries.length){running=false;$('#fill').disabled=false;return;}scan();const candidates=descriptors.filter(d=>d.entry&&d.status==='可填写');if(!candidates.length){running=false;$('#fill').disabled=false;say('没有可唯一匹配的空白字段。可使用辅助填写，或查看填写结果。');return;}
 running=true;cancel=false;history=[];$('#fill').disabled=true;$('#scan').disabled=true;$('#undo').disabled=true;$('#ai').disabled=true;$('#stop').disabled=false;let done=0,filled=0;$('#filled').textContent='0';
 try{for(const d of candidates){if(cancel)break;
 const item=await fillField(d);if(item){history.push(item);filled++;}
 done++;$('#filled').textContent=filled;$('#progress').value=Math.round(done/candidates.length*100);say(`正在填写 ${done} / ${candidates.length}：${d.labels[0]||'字段'}`);}
 // Later fields can cause the site to regenerate or clear an earlier field.
 for(const item of history){const current=resolveField(item.d);if(current&&String(readValue(current))===item.after)item.el=current;else{item.d.status='页面后续更新，内容未保留，请重新扫描';filled--;}}
 history=history.filter(item=>item.d.status==='已填写');$('#filled').textContent=filled;
 hasRun=true;renderReport();say(`${cancel?'已停止':'本轮完成'}：填入 ${filled} 项。${$('#pending').textContent} 项待处理；检查后可继续补填。`);
 }catch(e){say('填写中断：'+e.message);}finally{running=false;$('#fill').disabled=false;$('#scan').disabled=false;$('#undo').disabled=false;$('#ai').disabled=false;$('#stop').disabled=true;$('#fill').textContent='继续填写空白项';}
}

function setTab(name){$('#library-view').classList.toggle('hidden',name!=='library');$('#report-view').classList.toggle('hidden',name!=='report');$('#tab-library').classList.toggle('active',name==='library');$('#tab-report').classList.toggle('active',name==='report');}
$('#tab-library').onclick=()=>setTab('library');$('#tab-report').onclick=()=>setTab('report');
for(const s of S.sections){const o=node('option',s.label);o.value=s.key;$('#category').append(o);}
$('#search').oninput=renderLibrary;$('#category').onchange=renderLibrary;
$('#fill').onclick=run;$('#stop').onclick=()=>{cancel=true;say('正在停止…');};
$('#scan').onclick=async()=>{if(running)return;await refresh();scan();say(`找到 ${descriptors.length} 个可编辑字段，其中 ${descriptors.filter(d=>d.status==='可填写').length} 项可直接填写。`);setTab('report');};
$('#options').onclick=()=>chrome.runtime.sendMessage({type:'OPTIONS'});
$('#undo').onclick=async()=>{if(running)return;running=true;$('#undo').disabled=true;let n=0,manual=0;try{for(const item of [...history].reverse()){if(item.el.isConnected&&String(readValue(item.el))===item.after){const r=await writeValue(item.el,item.before||'');if(r.ok)n++;else manual++;}}history=[];$('#filled').textContent='0';$('#progress').value=0;scan();say(`已撤销 ${n} 项。${manual?manual+' 项自定义控件需手动恢复。':''}手动改过的内容会保留。`);}finally{running=false;$('#undo').disabled=false;}};
$('#ai').onclick=async()=>{
 if(running)return;const todo=descriptors.filter(d=>d.section!=='declaration'&&d.status==='待匹配'&&!String(readValue(d.el)||'').trim()).slice(0,100);
 if(!todo.length)return say('请先扫描页面；当前没有未匹配的空白字段。');
 $('#ai').disabled=true;say('AI 正在识别字段，生成后请逐项确认…');try{
 const r=await chrome.runtime.sendMessage({type:'AI_MATCH',fields:todo.map(d=>({id:d.id,labels:d.labels,section:d.section,index:d.index})),entries:entries.map(e=>({id:e.id,label:e.label,section:e.section,index:e.index}))});if(!r.ok)throw Error(r.error);
 const list=r.matches?.matches;if(!Array.isArray(list))throw Error('AI 返回格式不正确');const box=$('#suggestions');box.replaceChildren();let count=0;const used=new Set();
 for(const match of list){const d=todo.find(d=>d.id===match.id),e=entries.find(e=>e.id===match.entryId);if(!d||!e||used.has(d.id))continue;used.add(d.id);const card=node('div','','report-row');card.append(node('strong',`${d.labels[0]} ← ${e.sectionLabel} ${e.index+1} / ${e.label}`),node('div',e.value.slice(0,160)));const apply=node('button','确认填写');apply.onclick=async()=>{if(running)return;if(!d.el.isConnected||String(readValue(d.el)||'').trim())return say('该字段已变化，请重新扫描');const before=readValue(d.el);running=true;apply.disabled=true;let res;try{res=await writeValue(d.el,e.value);}finally{running=false;apply.disabled=false;}if(res.ok){history.push({el:d.el,before,after:res.value});d.status='已填写';apply.disabled=true;apply.textContent='已填写';renderReport();}else say(res.reason);};card.append(apply);box.append(card);count++;}say(`AI 提供了 ${count} 条建议，请核对内容后逐项确认。`);
 }catch(e){say(e.message);}finally{$('#ai').disabled=false;}
};
$('#min').onclick=()=>{$('.panel').classList.toggle('collapse');$('#min').textContent=$('.panel').classList.contains('collapse')?'+':'−';};
$('#close').onclick=()=>{cancel=true;clearSelection();host.style.display='none';};
const header=$('.head');let drag=null;header.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;const r=host.getBoundingClientRect();drag={x:e.clientX-r.left,y:e.clientY-r.top};header.setPointerCapture(e.pointerId);});header.addEventListener('pointermove',e=>{if(!drag)return;host.style.right='auto';host.style.left=Math.max(8,Math.min(innerWidth-host.offsetWidth-8,e.clientX-drag.x))+'px';host.style.top=Math.max(8,Math.min(innerHeight-60,e.clientY-drag.y))+'px';});header.addEventListener('pointerup',()=>drag=null);header.addEventListener('pointercancel',()=>drag=null);
globalThis.__autumnFill={open(){host.style.display='block';$('.panel').classList.remove('collapse');refresh();roots();}};
roots();refresh();
})();
