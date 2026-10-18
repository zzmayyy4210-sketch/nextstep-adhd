import test from 'node:test';
import assert from 'node:assert/strict';
import {basicPlan,smallerSteps,validateSteps} from '../public/planner.js';
test('常见任务和未知任务均返回可执行步骤',()=>{for(const task of ['整理房间','开始写作业','准备找工作','写论文','跑步','筹办一个生日聚会']){const steps=basicPlan(task);assert.ok(steps.length>=4);assert.ok(steps.every(s=>s.title&&s.detail&&s.minutes<=2));}});
test('拒绝空任务和无效模型结果',()=>{assert.throws(()=>basicPlan(' '));assert.throws(()=>validateSteps([{title:'',detail:'x'}]));assert.throws(()=>validateSteps(null));assert.throws(()=>validateSteps(Array(17).fill({title:'a',detail:'b'})));});
test('拆小后保留当前步骤目标',()=>{const step=basicPlan('写作业')[0];const parts=smallerSteps(step);assert.equal(parts.at(-1).title,step.title);assert.ok(parts.every(s=>s.minutes<=2));});
