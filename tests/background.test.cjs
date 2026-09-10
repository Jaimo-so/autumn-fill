const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
let listener,fetchCount=0,config={endpoint:'https://api.example.com/v1/chat/completions',model:'test-model',key:'TEST_ONLY_KEY'},canFetch=true,replyBody={choices:[{message:{content:'{"matches":[]}'}}]};
const sandbox={URL,AbortSignal,fetch:async()=>{fetchCount++;return{ok:true,json:async()=>replyBody};},chrome:{runtime:{onInstalled:{addListener(){}},onStartup:{addListener(){}},onMessage:{addListener(fn){listener=fn;}},getURL:p=>'chrome-extension://test/'+p,openOptionsPage:async()=>{}},storage:{local:{get:async k=>k==='aiConfig'?{aiConfig:config}:{profile:{personal:{name:'test'}}},setAccessLevel:async()=>{}}},permissions:{contains:async()=>canFetch}}};
vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../extension/background.js'),'utf8'),sandbox);
const send=(msg,sender={tab:{id:1},url:'https://jobs.example.com'})=>new Promise(resolve=>listener(msg,sender,resolve));
(async()=>{
let r=await send({type:'PROFILE'});assert.equal(r.profile.personal.name,'test');assert.equal(r.aiConfig,undefined);console.log('PASS 资料读取不包含 API Key');
r=await send({type:'AI_PARSE',text:'x',schema:{}});assert.equal(r.ok,false);assert.equal(fetchCount,0);console.log('PASS 网页内容脚本不能发起简历解析');
canFetch=false;r=await send({type:'AI_MATCH',fields:[],entries:[]});assert.equal(r.ok,false);assert.equal(fetchCount,0);console.log('PASS 未授权接口不请求');
canFetch=true;config.endpoint='http://remote.example.com/chat';r=await send({type:'AI_MATCH',fields:[],entries:[]});assert.equal(r.ok,false);assert.equal(fetchCount,0);console.log('PASS 拒绝远程明文接口');
config.endpoint='https://api.example.com/v1/chat/completions';r=await send({type:'AI_MATCH',fields:[],entries:[]});assert.equal(r.ok,true);assert.equal(fetchCount,1);console.log('PASS 合法匹配响应正确解析');
replyBody={choices:[{message:{content:'not json'}}]};r=await send({type:'AI_MATCH',fields:[],entries:[]});assert.equal(r.ok,false);console.log('PASS 无效 AI 响应返回错误');
console.log('6 tests passed');
})().catch(e=>{console.error(e);process.exitCode=1});
