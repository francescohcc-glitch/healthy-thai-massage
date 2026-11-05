// Only fixed, non-personal values can reach GA. Never pass DOM text, URLs, or form values.
export const MEASUREMENT_ID = 'G-PJ0EET004T';
export const SITE_URL = 'https://healthythaimassagehouston.com/';
export const CONSENT_KEY = 'htm-analytics-consent-v1';
export const LOCATIONS = ['header','home','about','services','gallery','book','contact','footer','mobile_bar','other'];
export const EVENTS = ['call_click','sms_click','whatsapp_click','booking_click','booking_submit_click','booking_request_success'];
export function classifyLink(href) {
 if (/^tel:/i.test(href)) return 'call_click';
 if (/^sms:/i.test(href)) return 'sms_click';
 if (/^whatsapp:/i.test(href)) return 'whatsapp_click';
 try { const url=new URL(href,SITE_URL);
  if (['wa.me','api.whatsapp.com','web.whatsapp.com'].includes(url.hostname)) return 'whatsapp_click';
  if (url.origin===new URL(SITE_URL).origin && url.pathname==='/' && url.hash==='#book') return 'booking_click';
 } catch { /* Unrecognized links are never tracked. */ }
 return null;
}
export function consentValid(record, now=Date.now()) {
 return record && ['accepted','rejected'].includes(record.choice) && Number.isFinite(record.at) && now>=record.at && now-record.at<180*86400000;
}
export function createAnalytics({command,load,debug=false}) {
 let accepted=false,started=false,pageSent=false;
 const seen=new WeakSet();
 function send(name,params={}) {
  if (!accepted || !started || !EVENTS.includes(name)) return false;
  command('event',name,{send_to:MEASUREMENT_ID,button_location:LOCATIONS.includes(params.button_location)?params.button_location:'other',...(['booking_submit_click','booking_request_success'].includes(name)?{booking_mode:params.booking_mode==='live'?'live':'demo'}:{}),...(debug?{debug_mode:true}:{})});
  return true;
 }
 return {
  accept(){
   accepted=true;
   if(!started){
    started=true;
    command('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    command('consent','update',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    command('js',new Date());
    command('set',{allow_google_signals:false,allow_ad_personalization_signals:false});
    command('config',MEASUREMENT_ID,{send_page_view:false,page_location:SITE_URL,page_referrer:'',page_title:'Healthy Thai Massage',ignore_referrer:true,allow_google_signals:false,allow_ad_personalization_signals:false,cookie_expires:15552000,cookie_update:false,...(debug?{debug_mode:true}:{})});
    load();
   }
   if(!pageSent){pageSent=true;command('event','page_view',{send_to:MEASUREMENT_ID,page_location:SITE_URL,page_referrer:'',page_title:'Healthy Thai Massage',...(debug?{debug_mode:true}:{})});}
  },
  reject(){accepted=false;},
  track:send,
  bookingSuccess(response,token){
   if(!response.ok || response.body?.ok!==true || response.mode!=='live' || !token || seen.has(token))return false;
   seen.add(token);return send('booking_request_success',{button_location:'book',booking_mode:'live'});
  },
 };
}
