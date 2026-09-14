const cases=[
 ['basic','证件类型按钮与号码分开，号码在失焦时提交'],
 ['before','填前控件被重建后自动重新定位'],
 ['during','写入时控件重建为空，只重试一次'],
 ['preserved','写入时控件重建并保留内容，撤销操作对应新控件'],
 ['other','重建控件已有其他内容时不覆盖'],
 ['duplicate','重建后出现多个同名字段时不猜测'],
 ['late','后续字段清空号码后不误报成功'],
 ['repeat','重复经历重建时不按旧序号填入'],
 ['loop','持续重建只重试一次，不死循环'],
 ['filled','已有号码保留']
];
const wait=async(fn,timeout=7000)=>{const start=Date.now();while(Date.now()-start<timeout){if(fn())return;await new Promise(r=>setTimeout(r,30));}throw Error('等待超时');};
function setup(mode){
 const fake='11010120000101001X',other='保留网页已有内容';
 window.chrome={runtime:{sendMessage:async()=>({ok:true,profile:{personal:{name:'测试同学',idNumber:fake,idType:'身份证',phone:'13800000000'},family:[{name:'测试家属'}]}})}};
 const attach=Element.prototype.attachShadow;Element.prototype.attachShadow=function(opts){const root=attach.call(this,opts);if(this.id==='autumn-fill-host')window.testPanel=root;return root;};
 window.writes=0;window.committed='';
 const number=()=>document.querySelector('#number');
 const replace=(value='')=>{const old=number(),next=old.cloneNode();next.value=value;old.replaceWith(next);return next;};
 document.querySelector('#name').addEventListener('input',()=>{
  if(['before','other','duplicate'].includes(mode)){replace(mode==='other'?other:'');if(mode==='duplicate'){const item=number().closest('.form-item').cloneNode(true);item.querySelector('input').removeAttribute('id');document.querySelector('section').append(item);}}
  if(mode==='repeat'){const old=document.querySelector('#family');old.replaceWith(old.cloneNode());}
 });
 document.addEventListener('input',e=>{
  if(e.target.id==='number'){window.writes++;if(mode==='during'&&window.writes===1)replace();if(mode==='preserved')replace(e.target.value);if(mode==='loop')replace();}
  if(e.target.id==='phone'&&mode==='late')replace();
 });
 document.addEventListener('focusout',e=>{if(e.target.id==='number')window.committed=e.target.value;});
 if(mode==='filled')number().value=other;
 window.testValues={fake,other};
}
const field=(label,id)=>`<div class="form-item"><div class="form-item__title"><label class="form-item__text">${label}</label></div><div class="form-item__control">${id==='number'?'<button type="button" class="phoenix-button mobile-type-button">身份证</button>':''}<div class="phoenix-input"><input id="${id}" placeholder="请输入"></div></div></div>`;
document.querySelector('#run').onclick=async()=>{
 const button=document.querySelector('#run'),output=document.querySelector('#result');button.disabled=true;const results=[];
 const base=new URL(new URLSearchParams(location.search).get('source')||'../extension/',location.href).href;
 try{for(const [mode,name] of cases){
  const frame=document.createElement('iframe');document.querySelector('#fixture').replaceChildren(frame);
  const html=`<section><div>个人基本信息*</div>${field('姓名','name')}${field('证件号码','number')}${field('手机号码','phone')}</section><section><div>家庭成员及重要社会关系*</div>${field('姓名','family')}</section><script>(${setup.toString()})(${JSON.stringify(mode)})<\/script>${['schema','engine','beisen','zhaopin','content'].map(n=>`<script src="${base}${n}.js?v=0.1.2-final"><\/script>`).join('')}`;
  frame.srcdoc=html;
  try{
   await wait(()=>frame.contentWindow.testPanel?.querySelector('#library button'));
   const w=frame.contentWindow,panel=w.testPanel;panel.querySelector('#fill').click();
   await wait(()=>panel.querySelector('#fill').textContent==='继续填写空白项'&&!panel.querySelector('#fill').disabled);
   const input=w.document.querySelector('#number'),report=panel.querySelector('#report').textContent;
   const row=[...panel.querySelectorAll('.report-row')].find(r=>r.querySelector('strong')?.textContent==='证件号码');
   const ok=(v,msg)=>{if(!v)throw Error(msg);};
   ok(w.document.querySelector('.mobile-type-button').textContent==='身份证','证件类型被误改');
   if(['basic','before','during','preserved'].includes(mode))ok(input.value===w.testValues.fake,'号码未填入新控件');
   if(mode==='basic')ok(w.committed===w.testValues.fake,'未触发失焦确认');
   if(mode==='during')ok(w.writes===2,'重试次数错误');
   if(mode==='preserved'){panel.querySelector('#undo').click();await wait(()=>!panel.querySelector('#undo').disabled);ok(w.document.querySelector('#number').value==='','未撤销新控件');}
   if(['other','filled'].includes(mode))ok(input.value===w.testValues.other&&w.writes===0,'已有内容被覆盖');
   if(['duplicate','loop'].includes(mode))ok(input.value===''&&!row.textContent.includes('已填写'),'错误报告填写成功');
   if(mode==='loop')ok(w.writes===2,'重复写入次数无上限');
   if(mode==='late')ok(input.value===''&&row.textContent.includes('内容未保留'),'后续清空却仍报告成功');
   if(mode==='repeat')ok(w.document.querySelector('#family').value===''&&!report.includes('家庭关系 · 已填写'),'重复经历被错误重绑');
   results.push('PASS '+name);
  }catch(e){results.push('FAIL '+name+'：'+e.message);}
  output.textContent=results.join('\n');
 }
 output.textContent+='\n完成：'+results.filter(r=>r.startsWith('PASS')).length+'/'+cases.length;
 }finally{button.disabled=false;document.querySelector('#fixture').replaceChildren();}
};
