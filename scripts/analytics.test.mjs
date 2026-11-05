import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createAnalytics,classifyLink,consentValid,MEASUREMENT_ID,SITE_URL} from '../lib/analytics.mjs';
function setup(){const commands=[];let loads=0;const engine=createAnalytics({command:(...args)=>commands.push(args),load:()=>loads++});return {engine,commands,loads:()=>loads};}
test('basic consent: no requests or queued events before accept or after reject',()=>{
 const {engine,commands,loads}=setup();engine.track('call_click');engine.reject();engine.track('sms_click');assert.equal(loads(),0);assert.deepEqual(commands,[]);
 engine.accept();assert.equal(loads(),1);const count=commands.length;engine.reject();engine.track('call_click');assert.equal(commands.length,count);
});
test('one configuration and one page view per document, including repeated acceptance',()=>{
 const {engine,commands,loads}=setup();engine.accept();engine.accept();engine.reject();engine.accept();assert.equal(loads(),1);
 assert.equal(commands.filter(x=>x[0]==='config').length,1);assert.equal(commands.filter(x=>x[1]==='page_view').length,1);
 assert.equal(commands.find(x=>x[0]==='config')[2].send_page_view,false);
 assert.equal(commands[0][1],'default');assert.equal(commands[0][2].analytics_storage,'denied');
 assert.equal(commands[1][2].ad_user_data,'denied');
});
test('only allowlisted event parameters reach analytics',()=>{
 const {engine,commands}=setup();engine.accept();engine.track('call_click',{button_location:'email@example.com',booking_mode:'Jane Doe',email:'private@example.com',notes:'private',url:'tel:123'});engine.track('private@example.com');
 const result=commands.at(-1);assert.equal(result[1],'call_click');assert.deepEqual(result[2],{send_to:MEASUREMENT_ID,button_location:'other'});
 assert.equal(commands.find(x=>x[1]==='page_view')[2].page_location,SITE_URL);
 assert.equal(commands.find(x=>x[0]==='config')[2].page_referrer,'');
});
test('contact and booking links classify once without reading destination data',()=>{
 for(const [href,name] of [['tel:+17132392424','call_click'],['sms:+17132392424','sms_click'],['https://wa.me/17132392424?text=private','whatsapp_click'],['https://api.whatsapp.com/send?phone=123','whatsapp_click'],['whatsapp://send?text=private','whatsapp_click'],['#book','booking_click'],[SITE_URL+'#book','booking_click']])assert.equal(classifyLink(href),name);
 for(const href of ['mailto:a@b.com','#contact','https://evil.example/#book','https://wa.me.evil.example/123','javascript:alert(1)'])assert.equal(classifyLink(href),null);
});
test('only verified live success, once per submission, never demo, click, validation, or provider error',()=>{
 const {engine,commands}=setup();engine.accept();const token={};
 for(const response of [{ok:true,body:{ok:true},mode:'demo'},{ok:false,body:{ok:true},mode:'live'},{ok:true,body:{ok:false},mode:'live'},{ok:true,mode:'live'}])assert.equal(engine.bookingSuccess(response,token),false);
 assert.equal(engine.bookingSuccess({ok:true,body:{ok:true},mode:'live'},token),true);
 assert.equal(engine.bookingSuccess({ok:true,body:{ok:true},mode:'live'},token),false);
 assert.equal(commands.filter(x=>x[1]==='booking_request_success').length,1);
});
test('consent expires and malformed/future choices never authorize tracking',()=>{
 assert.equal(consentValid({choice:'accepted',at:1000},1001),true);
 for(const record of [null,{}, {choice:'yes',at:1000},{choice:'accepted',at:2000},{choice:'accepted',at:1000-181*86400000}])assert.ok(!consentValid(record,1001));
});
