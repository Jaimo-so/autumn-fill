let submitted=0;document.querySelector('#test-form').onsubmit=e=>{e.preventDefault();document.querySelector('#submit-count').textContent='提交次数：'+(++submitted);};
document.querySelector('#reset').onclick=()=>location.reload();
document.querySelector('#add').onclick=()=>{const project=document.querySelector('.project').cloneNode(true);project.querySelector('h3').textContent='项目 3';for(const el of project.querySelectorAll('input,textarea')){el.value='';el.removeAttribute('id');}document.querySelector('#add').before(project);};
document.querySelector('#selftest').onclick=()=>{
 const results=[],check=(name,fn)=>{try{if(!fn())throw Error('不符合预期');results.push('PASS '+name);}catch(e){results.push('FAIL '+name+' '+e.message);}};
 const wrap=document.createElement('section');wrap.dataset.autumnIgnore='true';document.body.append(wrap);const make=tag=>{const e=document.createElement(tag);wrap.append(e);return e;};
 const E=AutumnEngine,input=make('input');let events=0;input.addEventListener('input',()=>events++);input.addEventListener('change',()=>events++);
 check('输入值写入并派发 input/change',()=>E.write(input,'测试').ok&&events===2&&input.value==='测试');
 const select=make('select');select.innerHTML='<option value="">请选择</option><option value="f">女</option>';
 check('下拉框按文字选择真实 value',()=>E.write(select,'女').ok&&select.value==='f');
 check('未知下拉值不乱选',()=>!E.write(select,'其他').ok&&select.value==='f');
 const date=make('input');date.type='date';check('月份不编造具体日',()=>!E.write(date,'2003-08').ok&&date.value==='');
 check('完整日期填写',()=>E.write(date,'2003-08-16').ok&&date.value==='2003-08-16');
 check('日期支持撤销为空',()=>E.write(date,'').ok&&date.value==='');
 const pass=make('input');pass.type='password';check('跳过密码框',()=>!E.write(pass,'test').ok);
 const checkbox=make('input');checkbox.type='checkbox';check('跳过协议勾选',()=>!E.write(checkbox,'true').ok&&!checkbox.checked);
 const text=make('textarea');text.maxLength=2;check('超过字数限制不截断',()=>!E.write(text,'完整内容').ok&&text.value==='');
 const rich=make('div');rich.contentEditable='true';check('富文本保留纯文本',()=>E.write(rich,'<img src=x>').ok&&rich.textContent==='<img src=x>'&&!rich.querySelector('img'));
 input.readOnly=true;check('跳过只读控件',()=>!E.write(input,'变更').ok&&input.value==='测试');
 input.remove();check('跳过已移除控件',()=>!E.write(input,'变更').ok);wrap.remove();
 document.querySelector('#test-results').textContent=results.join('\n');
};

document.querySelector('#verifyfill').onclick=()=>{const values={name:'测试同学',phone:'13800000000',email:'demo@example.com',gender:'f',birthday:'2003-08-16',nationality:'中国',existing:'这段已填内容需要保留',unknown:'',password:'',file:'',school:'示例大学',major:'计算机科学与技术',degree:'本科','edu-start':'2022-09','edu-end':'2026-06',project1:'校园信息平台',role1:'前端开发',start1:'2024-03',end1:'2024-07',url1:'https://example.com',desc1:'实现信息检索、发布与管理功能。',project2:'课程数据分析',role2:'数据分析',start2:'2025-02',end2:'2025-05',url2:'',desc2:'清洗课程数据，完成可视化分析与报告。'};const failures=Object.entries(values).filter(([id,v])=>document.getElementById(id).value!==v).map(([id])=>id);if(document.querySelector('#agreement').checked||submitted)failures.push('意外提交或勾选');document.querySelector('#test-results').textContent=failures.length?'FAIL '+failures.join(', '):'PASS 28 个字段结果正确，协议未勾选，提交次数为 0';};
