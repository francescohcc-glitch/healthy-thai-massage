'use client';
import {useEffect,useState} from 'react';
import {CONSENT_KEY,consentValid,classifyLink} from '@/lib/analytics.mjs';
import {analytics,revokeAnalytics} from '@/lib/analytics-client';
type Choice='accepted'|'rejected';
export default function Analytics(){
 const [open,setOpen]=useState(false);const [choice,setChoice]=useState<Choice|null>(null);const [restricted,setRestricted]=useState(false);
 useEffect(()=>{
  const nav=navigator as Navigator & {globalPrivacyControl?:boolean};
  const blocked=nav.globalPrivacyControl===true || nav.doNotTrack==='1';setRestricted(blocked);
  let record;try{record=JSON.parse(localStorage.getItem(CONSENT_KEY)||'null');}catch{/* No storage permission means no remembered choice. */}
  if(blocked){revokeAnalytics();setChoice('rejected');if(document.getElementById('healthy-thai-ga4'))location.reload();}
  else if(consentValid(record)){setChoice(record.choice);if(record.choice==='accepted')analytics()?.accept();}
  else setOpen(true);
  function click(e:MouseEvent){
   if(!(e.target instanceof Element))return;
   const element=e.target.closest('a,button');if(!element || element.hasAttribute('disabled'))return;
   const name=element instanceof HTMLAnchorElement?classifyLink(element.getAttribute('href')||''):element.getAttribute('data-analytics-event');
   if(!name)return;
   const area=element.closest('header,footer,section[id],.mobile-bar');
   const button_location=area?.matches('.mobile-bar')?'mobile_bar':area?.tagName==='HEADER'?'header':area?.tagName==='FOOTER'?'footer':area?.id||'other';
   analytics()?.track(name,{button_location,booking_mode:element.getAttribute('data-booking-mode')||'demo'});
  }
  function storage(e:StorageEvent){if(e.key===CONSENT_KEY || e.key===null){revokeAnalytics();location.reload();}}
  document.addEventListener('click',click);window.addEventListener('storage',storage);
  return()=>{document.removeEventListener('click',click);window.removeEventListener('storage',storage);};
 },[]);
 function choose(next:Choice){
  setChoice(next);setOpen(false);
  try{localStorage.setItem(CONSENT_KEY,JSON.stringify({choice:next,at:Date.now()}));}catch{/* Consent remains in memory for this page. */}
  if(next==='accepted'&&!restricted)analytics()?.accept();
  else {const loaded=!!document.getElementById('healthy-thai-ga4');revokeAnalytics();if(loaded)location.reload();}
 }
 return <>{process.env.NEXT_PUBLIC_ANALYTICS_DEBUG==='true'&&<details style={{position:'fixed',top:100,left:10,zIndex:70,maxWidth:500,maxHeight:250,overflow:'auto',background:'white',fontSize:10}}><summary>Analytics debug log (test mode)</summary><pre id="analytics-debug" style={{whiteSpace:'pre-wrap'}}/></details>}<button type="button" className="analytics-settings" onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls="analytics-consent">Privacy choices</button>{open&&<aside id="analytics-consent" className="analytics-consent" role="region" aria-label="Analytics privacy choices"><h2>Your privacy matters.</h2><p>With your permission, Google Analytics uses cookies to measure visits and button interactions. We do not send names, contact details, or appointment preferences. You can change your choice at any time.</p>{restricted?<p>Your browser privacy preference is respected. Analytics is off.</p>:<p>Analytics is {choice==='accepted'?'on':'off until you accept'}. Your choice is remembered for six months.</p>}<div className="consent-actions"><button type="button" className="button outline" onClick={()=>choose('rejected')}>{restricted?'Keep analytics off':'Reject analytics'}</button>{!restricted&&<button type="button" className="button primary" onClick={()=>choose('accepted')}>Accept analytics</button>}</div></aside>}</>;
}
