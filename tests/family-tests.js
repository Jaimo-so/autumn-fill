const wait=async(fn)=>{const start=Date.now();while(Date.now()-start<8000){if(fn())return;await new Promise(r=>setTimeout(r,40));}throw Error('等待超时');};
function setup(mode){
 window.chrome={runtime:{sendMessage:async()=>({ok:true,profile:{personal:{name:'本人测试'},family:[{name:'家属甲',relation:'父亲',company:'甲单位',role:'甲职务'},{name:'家属乙',relation:'母亲',company:'乙单位',role:'乙职务'}]}})}};
 if(mode.startsWith('named')){const mother={name:'家属乙',relation:'母亲',company:'乙单位',role:'乙职务',age:'48',phone:'13800000002',politics:'群众'},father={name:'家属甲',relation:'父亲',company:'甲单位',role:'甲职务',age:'50',phone:'13800000001',politics:'共青团员'};
 const family=mode==='named-missing'?[mother]:mode==='named-duplicate'?[mother,father,{...father}]:[mother,father];
 window.chrome.runtime.sendMessage=async()=>({ok:true,profile:{personal:{name:'本人测试'},family}});
 document.querySelectorAll('input[readonly]').forEach(input=>{input.onclick=()=>{document.querySelector('.test-dropdown')?.remove();const list=document.createElement('ul');list.className='test-dropdown';for(const text of ['中共党员','中共预备党员','团员','民主党派','无党派人士','群众']){const item=document.createElement('li');item.textContent=text;item.onclick=()=>{input.value=text;list.remove();};list.append(item);}document.body.append(list);};});
 }
 if(mode==='named-rebuild')document.querySelector('#self').addEventListener('input',()=>{document.querySelectorAll('input:not([readonly]):not(#self)').forEach(old=>old.replaceWith(old.cloneNode()));});
 const attach=Element.prototype.attachShadow;Element.prototype.attachShadow=function(o){const root=attach.call(this,o);if(this.id==='autumn-fill-host')window.testPanel=root;return root;};
}
const member=n=>`<div><label>姓名<input id="name${n}"></label><label>与本人关系<select id="relation${n}"><option value="">请选择</option><option>父亲</option><option>母亲</option></select></label><label>工作单位<input id="company${n}"></label><label>职务<input id="role${n}"></label></div>`;
const namedMember=(n,relation)=>[['姓名','name'],['年龄','age'],['工作单位','company'],[n===0?'职位':'职务','role'],['联系电话','phone'],['政治面貌','politics']].map(([label,key])=>`<div><div><span>*</span><span>${label}-${relation}</span></div><div><div><input id="${key}${n}" ${key==='politics'?'readonly':''} placeholder="请填写"></div></div></div>`).join('');
document.querySelector('#run').onclick=async()=>{
 const button=document.querySelector('#run'),out=document.querySelector('#result');button.disabled=true;const results=[];
 try{for(const title of ['家庭关系','家庭关系 必填','家庭关系（必填）','named','named-rebuild','named-missing','named-duplicate']){
  const frame=document.createElement('iframe');document.querySelector('#fixture').replaceChildren(frame);
  const base=new URL('../extension/',location.href).href;
  frame.srcdoc=`<section><h6>个人信息</h6><label>姓名<input id="self"></label></section><section><h6>${title.startsWith('named')?'家庭关系 必填':title}</h6>${title.startsWith('named')?namedMember(0,'父亲')+namedMember(1,'母亲')+'<label>父亲是否为邮储银行体系内单位员工<input id=declaration></label>':member(0)+member(1)}</section><script>(${setup.toString()})(${JSON.stringify(title)})</script>${['schema','engine','beisen','zhaopin','content'].map(n=>`<script src="${base}${n}.js?v=0.1.2-final"></script>`).join('')}`;
  try{await wait(()=>frame.contentWindow.testPanel?.querySelector('#library button'));const panel=frame.contentWindow.testPanel;panel.querySelector('#fill').click();await wait(()=>panel.querySelector('#fill').textContent==='继续填写空白项'&&!panel.querySelector('#fill').disabled);
   const doc=frame.contentDocument,expected={self:'本人测试',name0:'家属甲',name1:'家属乙',relation0:'父亲',relation1:'母亲',company0:'甲单位',company1:'乙单位',role0:'甲职务',role1:'乙职务'};
   if(title.startsWith('named')){
    Object.assign(expected,{age0:'50',age1:'48',phone0:'13800000001',phone1:'13800000002',politics0:'团员',politics1:'群众',declaration:''});
    if(['named-missing','named-duplicate'].includes(title))for(const key of ['name','age','company','role','phone','politics'])expected[key+'0']='';
    delete expected.relation0;delete expected.relation1;
   }
   for(const [id,value] of Object.entries(expected))if(doc.getElementById(id).value!==value)throw Error(id+' 填写错误');
   results.push('PASS '+title+'：'+Object.keys(expected).length+' 项核对正确');
  }catch(e){results.push('FAIL '+title+'：'+e.message);}
  out.textContent=results.join('\n');
 }out.textContent+='\n完成';}finally{button.disabled=false;document.querySelector('#fixture').replaceChildren();}
};
