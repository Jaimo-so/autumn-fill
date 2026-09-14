document.querySelector('#options').onclick=()=>chrome.runtime.openOptionsPage();
document.querySelector('#open').onclick=async()=>{
 const status=document.querySelector('#status');try{
 const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
 if(!tab?.id||!/^https?:/.test(tab.url||''))throw Error('请在普通网页中打开助手，浏览器设置页不支持填写');
 await chrome.scripting.executeScript({target:{tabId:tab.id},files:['schema.js','engine.js','beisen.js','zhaopin.js','content.js']});window.close();
 }catch(e){status.textContent=e.message;}
};
