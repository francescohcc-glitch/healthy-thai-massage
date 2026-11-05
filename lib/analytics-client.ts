import {createAnalytics,MEASUREMENT_ID} from './analytics.mjs';
type AnalyticsWindow = Window & {dataLayer?:unknown[];gtag?:(...args:unknown[])=>void;[key:string]:unknown};
let engine:ReturnType<typeof createAnalytics>|undefined;
export function analytics(){
 if(typeof window==='undefined')return undefined;
 if(engine)return engine;
 const w=window as unknown as AnalyticsWindow;
 const debug=process.env.NEXT_PUBLIC_ANALYTICS_DEBUG==='true';
 // Prevent accidental collection from Cloudflare previews and local development.
 if(window.location.hostname!=='healthythaimassagehouston.com' && !debug)return undefined;
 engine=createAnalytics({debug,command(...args){
  w.dataLayer??=[];
  // gtag uses an arguments object, not a plain array.
  w.gtag??=function(){w.dataLayer!.push(arguments);};
  w.gtag(...args);
  if(debug){const output=document.getElementById('analytics-debug');if(output)output.textContent+='\n'+JSON.stringify(args);}
 },load(){
  if(document.getElementById('healthy-thai-ga4'))return;
  w[`ga-disable-${MEASUREMENT_ID}`]=false;
  const tag=document.createElement('script');tag.id='healthy-thai-ga4';tag.async=true;
  tag.onload=()=>{tag.dataset.loaded='true';};
  tag.onerror=()=>{tag.dataset.loaded='false';};
  tag.src=`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(tag);
 }});
 return engine;
}
export function revokeAnalytics(){
 const w=window as unknown as AnalyticsWindow;
 // Disable immediately, before reloading to unload the Google library entirely.
 w[`ga-disable-${MEASUREMENT_ID}`]=true;
 engine?.reject();
 for(const cookie of document.cookie.split(';')){
  const name=cookie.split('=')[0].trim();if(!/^_ga(?:_|$)/.test(name))continue;
  for(const domain of ['',window.location.hostname,'.'+window.location.hostname,'.healthythaimassagehouston.com']){
   document.cookie=`${name}=;Max-Age=0;path=/${domain?`;domain=${domain}`:''};SameSite=Lax`;
  }
 }
}
