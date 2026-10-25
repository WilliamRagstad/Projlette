import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn,execFileSync} from 'node:child_process';
import {once} from 'node:events';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve,join} from 'node:path';
test('production API preserves data across process restart',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'projlette-restart-'));
 const deno=resolve('node_modules/deno/deno');
 const env={...process.env,DATABASE_PATH:join(dir,'data.sqlite'),PORT:'8011'};
 let child;
 async function start(){
  child=spawn(deno,['run','--allow-env','--allow-net','--allow-read','--allow-write','index.ts'],{cwd:'projlette-api',env,stdio:['ignore','pipe','pipe']});
  for(let i=0;i<100;i++){
   try {if((await fetch('http://127.0.0.1:8011/health')).ok)return;}catch{}
   await new Promise(r=>setTimeout(r,50));
  }
  throw new Error('API did not start');
 }
 async function stop(){const exit=once(child,'exit');child.kill('SIGTERM');await exit;child=undefined;}
 try{
  execFileSync(deno,['task','migrate'],{cwd:'projlette-api',env,stdio:'pipe'});
  await start();
  const created=await fetch('http://127.0.0.1:8011/problem',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:'Restart challenge',description:'Must survive a process restart',author:'Tester',difficulty:'easy',tags:['restart']})});
  assert.equal(created.status,201);const problem=await created.json();
  await stop();await start();
  const recovered=await (await fetch('http://127.0.0.1:8011/problem/'+problem.id)).json();
  assert.deepEqual(recovered,problem);
  const accepted=await (await fetch('http://127.0.0.1:8011/solutions/P42K')).json();
  assert.equal(accepted.length,1);
  assert.equal(accepted[0].status,'accepted');
  const pending=await (await fetch('http://127.0.0.1:8011/solutions/A12X')).json();
  assert.equal(pending.length,0);
 }finally{if(child)await stop();rmSync(dir,{recursive:true,force:true});}
});
