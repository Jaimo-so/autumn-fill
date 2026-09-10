function makeField(label,kind,section='个人基本信息*'){
 const sectionRoot=document.createElement('section'),heading=document.createElement('div');heading.textContent=section;sectionRoot.append(heading);let wrapper=sectionRoot;for(let i=0;i<12;i++){const w=document.createElement('div');wrapper.append(w);wrapper=w;}
 const item=document.createElement('div');item.className='form-item';item.innerHTML='<div class="form-item__title"><label class="form-item__text"></label></div><div class="form-item__control"></div>';item.querySelector('label').textContent=label;wrapper.append(item);document.querySelector('#fixture').append(sectionRoot);
 const control=item.querySelector('.form-item__control');let el;
 if(kind==='input'){el=document.createElement('input');el.placeholder='请输入';control.append(el);return el;}
 if(kind==='radio'){el=document.createElement('div');el.className='phoenix-radio-group';for(const v of ['男','女']){const r=document.createElement('div');r.className='phoenix-radio';const t=document.createElement('span');t.className='phoenix-radio__radio-text';t.textContent=v;r.append(t);r.onclick=()=>{el.querySelectorAll('.phoenix-radio').forEach(n=>n.classList.remove('phoenix-radio--checked'));r.classList.add('phoenix-radio--checked');};el.append(r);}control.append(el);return el;}
 el=document.createElement('div');el.className='phoenix-select';el.innerHTML='<ul class="phoenix-select__content"><li class="phoenix-select__inputWrapper"><input></li></ul><span class="phoenix-select__clearIcon">×</span>';
 const set=value=>{let selected=el.querySelector('.selected-value');if(!selected){selected=document.createElement('li');selected.className='selected-value';el.querySelector('ul').prepend(selected);}selected.textContent=value;};
 el.querySelector('.phoenix-select__clearIcon').onclick=e=>{e.stopPropagation();el.querySelector('.selected-value')?.remove();};
 el.onclick=()=>{const popup=document.createElement('div');popup.className=kind==='date'?'phoenix-calendar':kind==='modal'?'constant-main-selector-container':'phoenix-selectList';document.body.append(popup);
 if(kind==='date'){const input=document.createElement('input');input.className='phoenix-calendar-input';input.value='2004-01-01';input.onkeydown=e=>{if(e.key==='Enter'){set(input.value);popup.remove();}};popup.append(input);return;}
 let chosen='';for(const value of (kind==='modal'?['汉族','回族']:['高中','本科','硕士研究生'])){const option=document.createElement(kind==='modal'?'div':'li');option.className=kind==='modal'?'list-item-container':'phoenix-selectList__listItem';option.textContent=value;option.onclick=()=>{chosen=value;if(kind!=='modal'){set(value);popup.remove();}};popup.append(option);}
 if(kind==='modal'){for(const text of ['取消','确定']){const b=document.createElement('div');b.className='phoenix-button__content';b.textContent=text;b.onclick=()=>{if(text==='确定')set(chosen);popup.remove();};popup.append(b);}}
 };control.append(el);return el;
}
document.querySelector('#run').onclick=async()=>{
 const results=[],A=AutumnBeisen,check=async(name,fn)=>{try{if(!await fn())throw Error('结果不符合预期');results.push('PASS '+name);}catch(e){results.push('FAIL '+name+' '+e.message);}document.querySelector('#result').textContent=results.join('\n');};document.querySelector('#run').disabled=true;
 try{
 const name=makeField('姓名','input');await check('深层北森字段标签提取',()=>A.describe(name).labels[0]==='姓名');await check('个人基本信息章节识别',()=>A.describe(name).section==='personal');
 const identity=makeField('证件号码','input');const typeButton=document.createElement('button');typeButton.className='phoenix-button mobile-type-button';typeButton.textContent='身份证';identity.parentElement.prepend(typeButton);
 await check('组合证件字段只匹配号码输入框',()=>{const fields=AutumnSchema.flatten(AutumnSchema.validateProfile({personal:{idType:'身份证',idNumber:'11010120000101001X'}}));const entry=AutumnEngine.choose(A.describe(identity),fields);return entry?.id==='personal.0.idNumber'&&AutumnEngine.write(identity,entry.value).ok&&identity.value==='11010120000101001X'&&typeButton.textContent==='身份证';});
 const family=makeField('姓名','input','家庭成员及重要社会关系*');await check('家庭姓名与本人姓名分组隔离',()=>A.describe(family).section==='family');
 const company=makeField('单位名称','input','工作/实习经历*');await check('合并工作/实习分组',()=>A.describe(company).section==='employment');
 const declaration=makeField('填表人签名','input','本人承诺*');await check('声明分组标识为手动',()=>A.describe(declaration).section==='declaration');
 const select=makeField('学历','select','教育经历*');await check('原始下拉搜索输入不算已选择',()=>{select.querySelector('input').value='搜索草稿';return A.read(select)==='';});
 await check('点击真实下拉选项并确认选中状态',async()=>{const r=await A.write(select,'本科');return r.ok&&A.read(select)==='本科';});
 await check('下拉选项可清空撤销',async()=>{const r=await A.write(select,'');return r.ok&&A.read(select)==='';});
 await check('学历硕士别名匹配硕士研究生',async()=>{const r=await A.write(select,'硕士');return r.ok&&A.read(select)==='硕士研究生';});
 const modal=makeField('民族','modal');await check('民族弹层选择后点击确定',async()=>{const r=await A.write(modal,'汉族');return r.ok&&A.read(modal)==='汉族'&&!document.querySelector('.constant-main-selector-container');});
 const radio=makeField('性别','radio');await check('单选点击及状态回读',async()=>{const r=await A.write(radio,'女');return r.ok&&A.read(radio)==='女';});
 const date=makeField('出生年月','date');await check('日期弹层输入及回车确认',async()=>{const r=await A.write(date,'2003-08-16');return r.ok&&A.read(date)==='2003-08-16';});
 await A.write(date,'');await check('年月不自动补造具体日',async()=>{const r=await A.write(date,'2003-08');return !r.ok&&A.read(date)==='';});
 }finally{document.querySelector('#run').disabled=false;}
};
