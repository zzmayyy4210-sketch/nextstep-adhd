import test from 'node:test';
import assert from 'node:assert/strict';
import {personalConfig,personalPlan} from '../public/personal-api.js';
test('OpenRouter 只使用访问者的密钥和免费路由',async()=>{
  const c=personalConfig({key:'visitor-test-key',model:'paid-model',provider:'openrouter'});assert.equal(c.model,'openrouter/free');
  let request;await personalPlan(c,'写作业','low',null,async(url,options)=>{request={url,...options};return{ok:true,json:async()=>({choices:[{message:{content:'{"steps":[{"title":"打开书","detail":"先打开就好","minutes":1}]}'}}]})};});
  assert.equal(request.headers.Authorization,'Bearer visitor-test-key');assert.equal(request.url,'https://openrouter.ai/api/v1/chat/completions');assert.equal(request.redirect,'error');assert.equal(request.credentials,'omit');assert.equal(JSON.parse(request.body).model,'openrouter/free');
});
test('自定义接口必须显式填写完整安全地址和模型',()=>{for(const endpoint of ['http://example.com/chat/completions','https://user:pass@example.com/chat/completions','https://example.com/chat/completions?token=x','https://example.com/'])assert.throws(()=>personalConfig({provider:'custom',endpoint,key:'test',model:'model'}));assert.equal(personalConfig({provider:'custom',endpoint:'https://api.example.com/v1/chat/completions',model:'model',key:'test'}).model,'model');});
test('个人密钥或额度异常不泄露上游详情',async()=>{const c=personalConfig({key:'visitor-test'});await assert.rejects(()=>personalPlan(c,'a','low',null,async()=>({ok:false,status:401})),/无效/);await assert.rejects(()=>personalPlan(c,'a','low',null,async()=>{throw Error('private backend details');}),/跨域/);});
