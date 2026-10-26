import {test} from 'node:test';
import assert from 'node:assert/strict';
import {deliveryEnabled,validateRequest} from '../lib/booking.mjs';
test('delivery stays locked unless a safe endpoint and explicit verification exist',()=>{
 for(const endpoint of ['',undefined,'https://evil.example/f/test','https://formspree.io/f/','http://formspree.io/f/abcd'])assert.equal(deliveryEnabled(endpoint,'true'),false);
 assert.equal(deliveryEnabled('https://formspree.io/f/abcd','false'),false);
 assert.equal(deliveryEnabled('https://formspree.io/f/abcd','true'),true);
});
test('validates contact details, past dates, and notes',()=>{
 const valid={name:'Jane Doe',phone:'(713) 239-2424',email:'',date:'2026-10-28',notes:''};
 assert.equal(validateRequest(valid,'2026-10-25'),'');
 for(const patch of [{name:''},{phone:'hello'},{email:'invalid'},{date:'2026-10-24'},{notes:'a'.repeat(1501)}])assert.notEqual(validateRequest({...valid,...patch},'2026-10-25'),'');
});
