(() => {
const f=(key,label,aliases='',type='text')=>({key,label,aliases:aliases.split('|').filter(Boolean),type});
const sections=[
 {key:'personal',label:'个人信息',aliases:['基本信息','基本资料','个人资料'],fields:[f('name','姓名','中文姓名|真实姓名|name|fullname|full name'),f('englishName','英文名','英文姓名|english name'),f('gender','性别','gender|sex'),f('phone','手机号码','手机|手机号|联系电话|电话|mobile|phone|tel','tel'),f('email','电子邮箱','邮箱|邮件|email|e-mail','email'),f('birthday','出生日期','生日|出生年月|birthday|date of birth','date'),f('nationality','国籍','国籍地区|nationality'),f('ethnicity','民族'),f('politics','政治面貌'),f('city','现居城市','居住地|现居地|所在城市|所在地|current city'),f('hometown','籍贯','家乡|生源地'),f('address','联系地址','通讯地址|家庭地址|address'),f('idNumber','证件号码','身份证|身份证号|身份证号码|证件号|居民身份证号码|公民身份号码|公民身份证号码|身份证件号码'),f('website','个人主页','个人网站|website|portfolio'),f('summary','自我评价','个人简介|自我介绍|summary','textarea')]},
 {key:'intent',label:'求职意向',aliases:['应聘信息','职位意向'],fields:[f('position','意向岗位','应聘岗位|应聘职位|期望职位|求职岗位'),f('city','期望工作地点','意向城市|工作意向城市'),f('salary','期望薪资','期望月薪|薪资期望'),f('start','预计入职时间','到岗时间|可到岗日期','date')]},
 {key:'education',label:'教育经历',aliases:['教育背景','学习经历'],repeat:true,fields:[f('school','学校名称','学校|毕业院校|院校名称|school|university'),f('major','专业名称','专业|所学专业|major'),f('degree','学历','最高学历|教育程度|education level'),f('academicDegree','学位','degree'),f('start','开始时间','入学时间|入学日期|开始日期|起始时间|start date','month'),f('end','结束时间','毕业时间|毕业日期|结束日期|end date','month'),f('gpa','GPA','绩点|平均绩点'),f('rank','专业排名','成绩排名'),f('courses','主修课程','课程','textarea'),f('description','描述','教育经历描述|在校经历|description','textarea')]},
 {key:'work',label:'工作经历',aliases:['工作经验','任职经历'],repeat:true,fields:[f('company','公司名称','工作单位|公司|company|employer'),f('role','职位名称','岗位名称|职位|职务|岗位|job title'),f('department','所属部门','部门'),f('start','开始时间','入职时间|入职日期|开始日期|起始时间|start date','month'),f('end','结束时间','离职时间|离职日期|结束日期|end date','month'),f('description','工作描述','工作内容|工作职责|主要职责|描述|description','textarea')]},
 {key:'internship',label:'实习经历',aliases:['实习经验'],repeat:true,fields:[f('company','公司名称','实习单位|公司|company'),f('role','实习岗位','职位名称|职位|岗位|职务|job title'),f('start','开始时间','开始日期|入职时间|start date','month'),f('end','结束时间','结束日期|离职时间|end date','month'),f('description','实习描述','实习内容|实习职责|工作内容|工作描述|描述|description','textarea')]},
 {key:'project',label:'项目经历',aliases:['项目经验','项目介绍'],repeat:true,fields:[f('name','项目名称','项目名|project name'),f('role','项目角色','项目职务|担任角色|职责'),f('start','开始时间','开始日期|项目开始时间|起始时间|start date','month'),f('end','结束时间','结束日期|项目结束时间|end date','month'),f('url','项目链接','项目地址|项目网址|project url','url'),f('description','项目描述','项目介绍|项目内容|描述|description','textarea'),f('responsibility','项目职责','个人贡献|承担工作','textarea')]},
 {key:'skill',label:'技能特长',aliases:['专业技能'],repeat:true,fields:[f('name','技能名称','技能|技术名称'),f('level','熟练程度','掌握程度'),f('description','技能描述','描述','textarea')]},
 {key:'language',label:'外语能力',aliases:['语言能力','语言水平'],repeat:true,fields:[f('name','语种','语言|外语语种'),f('level','语言等级','外语水平|等级'),f('score','考试成绩','分数|成绩')]},
 {key:'award',label:'获奖经历',aliases:['获奖','荣誉奖励','奖励情况'],repeat:true,fields:[f('name','获奖名称','奖项名称|奖励名称|荣誉名称'),f('date','获奖时间','获奖日期','date'),f('level','获奖级别','奖项级别'),f('description','获奖描述','描述|获奖说明','textarea')]},
 {key:'campus',label:'在校经历',aliases:['校园经历','干部任职经历','社团经历'],repeat:true,fields:[f('organization','组织名称','社团名称|社团|组织'),f('role','担任职务','职务|职位'),f('start','开始时间','开始日期','month'),f('end','结束时间','结束日期','month'),f('description','经历描述','工作内容|描述','textarea')]},
 {key:'family',label:'家庭关系',aliases:['家庭成员'],repeat:true,fields:[f('name','成员姓名','姓名'),f('relation','与本人关系','关系'),f('company','工作单位','单位'),f('role','职务'),f('phone','联系电话','手机号码','tel')]},
 {key:'patent',label:'专利信息',aliases:['专利'],repeat:true,fields:[f('name','专利名称'),f('number','专利号'),f('date','申请日期','','date'),f('description','专利描述','描述','textarea')]},
 {key:'publication',label:'论文发表',aliases:['论文','学术成果'],repeat:true,fields:[f('name','论文名称','论文标题'),f('journal','发表期刊','期刊名称'),f('date','发表日期','','date'),f('description','论文描述','描述','textarea')]}
];
// 北森中国人寿表单中实际出现的补充字段。
const add=(key,fields)=>sections.find(s=>s.key===key).fields.push(...fields);
const alias=(section,key,names)=>sections.find(s=>s.key===section).fields.find(f=>f.key===key).aliases.push(...names);
alias('personal','phone',['移动电话']);alias('personal','politics',['党派']);alias('personal','address',['通信地址']);alias('personal','city',['现居住地']);
add('personal',[f('height','身高（CM）','身高(CM)|身高'),f('weight','体重（公斤）','体重(公斤)|体重'),f('partyDate','加入党派时间','','date'),f('marital','婚姻状况'),f('origin','生源地（高考时户口所在地）','生源地(高考时户口所在地)'),f('emergencyContact','紧急联系人'),f('emergencyPhone','紧急联系方式','','tel'),f('health','健康状况'),f('expectedCity','期望工作城市'),f('annualSalary','期望待遇（万元/年）','期望待遇(万元/年)'),f('transfer','是否服从调剂'),f('county','是否愿意去县级公司工作'),f('scholarship','是否获得过奖学金'),f('studentLeader','是否为学生干部')]);
add('education',[f('secondMajor','第二专业'),f('fullTime','是否全日制'),f('highestFullTime','是否最高全日制学历'),f('primaryMajor','是否主修')]);
for(const key of ['work','internship']){alias(key,'company',['单位名称']);alias(key,'role',['职位名称']);add(key,[f('employmentType','用工形式')]);}
alias('work','department',['所在部门']);add('internship',[f('department','所在部门','所属部门|部门')]);alias('internship','description',['工作描述']);
alias('award','description',['其他补充']);add('award',[f('issuer','颁奖单位'),f('role','担当角色')]);
alias('publication','name',['文章名、书名']);alias('publication','journal',['刊物、出版社']);alias('publication','date',['日期']);alias('publication','description',['内容摘要']);add('publication',[f('role','担任角色')]);
alias('language','score',['得分']);alias('project','role',['担当角色']);alias('project','description',['主要工作内容']);add('project',[f('level','项目级别')]);
alias('family','relation',['称谓']);alias('family','role',['所属职务','职位']);add('family',[f('birthday','出生日期','','date')]);alias('skill','name',['技能类别']);
sections.push({key:'certificate',label:'专业资格',aliases:['资格证书'],repeat:true,fields:[f('hasCertificate','具有资格证书'),f('name','证书名称'),f('date','获得时间','','date')]});
sections.push({key:'other',label:'其他信息',aliases:[],fields:[f('hobbies','爱好及特长','','textarea'),f('strengths','优势与不足','','textarea'),f('summary','自我评价及求职目标','','textarea'),f('extra','其他','','textarea')]});

// 保留从来个简历迁移的完整字段，含教育与证明人补充信息。
add('personal',[f('wechat','微信号'),f('qq','QQ号'),f('age','年龄'),f('idType','证件类型'),f('highestDegree','最高学历'),f('graduateSchool','毕业院校'),f('graduateMajor','毕业专业'),f('studyMode','学习形式'),f('graduationDate','毕业时间','','date'),f('englishLevel','英语等级'),f('examScore','高考分数'),f('examSubjects','高考科目'),f('workYears','工作年限'),f('emergencyRelation','紧急联系人关系'),f('freshGraduate','是否应届生'),f('recommendedGraduate','是否保研'),f('studiedAbroad','是否有留学经历'),f('colorWeakness','是否色弱'),f('hukouType','户口性质'),f('hukouLocation','户口所在地'),f('archiveLocation','档案所在地'),f('advantages','个人优势','','textarea'),f('hobbies','兴趣爱好','','textarea')]);
add('education',[f('studentId','学号'),f('faculty','院系'),f('city','学校城市'),f('jointTraining','是否联合培养'),f('status','学历状态'),f('duration','学制（年）'),f('period','起止时间'),f('schoolType','学校类型'),f('studyMode','教育方式'),f('admissionType','招生类别'),f('failedCourses','挂科数'),f('overseas','是否海外学校')]);
add('internship',[f('period','起止时间'),f('city','实习地址'),f('industry','所属行业'),f('referenceName','证明人姓名'),f('referencePhone','证明人联系方式','','tel'),f('referenceRole','证明人职位')]);
add('family',[f('age','年龄'),f('gender','性别'),f('education','教育程度'),f('ethnicity','民族'),f('politics','政治面貌'),f('address','联系地址')]);
alias('personal','emergencyContact',['紧急联系人姓名']);alias('personal','emergencyPhone',['紧急联系电话']);alias('personal','origin',['生源地']);
sections.find(s=>s.key==='personal').fields.find(f=>f.key==='hometown').aliases=sections.find(s=>s.key==='personal').fields.find(f=>f.key==='hometown').aliases.filter(v=>v!=='生源地');
alias('education','gpa',['成绩绩点']);alias('internship','employmentType',['用工性质']);

function emptyProfile(){return Object.fromEntries(sections.map(s=>[s.key,s.repeat?[]:{}]));}
function validateProfile(p){
 if(!p||typeof p!=='object'||Array.isArray(p))throw Error('简历格式应为 JSON 对象');
 const out=emptyProfile();
 for(const s of sections){let rows=s.repeat?(p[s.key]??[]):[p[s.key]??{}];if(!Array.isArray(rows)||rows.length>50)throw Error(s.label+'格式错误或超过 50 条');
 const clean=rows.map(row=>{if(!row||typeof row!=='object'||Array.isArray(row))throw Error(s.label+'条目格式错误');const r={};for(const f of s.fields){const v=row[f.key];if(v!=null){if(!['string','number'].includes(typeof v))throw Error(f.label+'必须是文本');r[f.key]=String(v).slice(0,20000);}}return r;});out[s.key]=s.repeat?clean:clean[0];}
 return out;
}
function flatten(profile){const out=[];for(const s of sections){const rows=s.repeat?(profile[s.key]||[]):[profile[s.key]||{}];rows.forEach((r,index)=>s.fields.forEach(field=>{const value=String(r[field.key]??'').trim();if(value)out.push({id:`${s.key}.${index}.${field.key}`,section:s.key,sectionLabel:s.label,index,label:field.label,aliases:field.aliases,value,type:field.type,title:r.school||r.company||r.name||r.organization||s.label});}));}return out;}
globalThis.AutumnSchema={sections,emptyProfile,validateProfile,flatten};
})();
