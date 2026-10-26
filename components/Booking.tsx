'use client';
import { useState } from 'react';
import { business } from '@/lib/content';
import { deliveryEnabled, validateRequest } from '@/lib/booking.mjs';
export default function Booking(){
 const [status,setStatus]=useState(''); const [sending,setSending]=useState(false); const [success,setSuccess]=useState(false);
 const endpoint=process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
 const enabled=deliveryEnabled(endpoint,process.env.NEXT_PUBLIC_FORM_DELIVERY_VERIFIED);
 const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 async function submit(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault(); if(!enabled || sending)return;
  const form=new FormData(e.currentTarget); const data=Object.fromEntries(form.entries()) as Record<string,string>;
  if(data._gotcha){setStatus('Unable to submit. Please call or text us.');return;}
  const error=validateRequest(data,today()); if(error){setStatus(error);return;}
  setSending(true);setStatus('');
  try{const response=await fetch(endpoint!,{method:'POST',body:form,headers:{Accept:'application/json'},signal:AbortSignal.timeout(20000)});
   const result=await response.json(); if(!response.ok || result.ok !== true)throw new Error('delivery');
   setSuccess(true);
  }catch{setStatus('Your request could not be confirmed as submitted. Please call or text us for help.');}finally{setSending(false);}
 }
 return success?<div className="success" role="status"><span className="eyebrow">Thank you</span><h3>Your moment is one step closer.</h3><p>Your appointment request has been received. Our team will contact you to confirm availability.</p></div>:<form onSubmit={submit} className="booking-form">
 <div className="form-heading"><h3>Make time for you.</h3><span>No online payment</span></div>
 <p className="form-intro">Tell us what you have in mind. Your appointment is confirmed only when our team contacts you.</p>
 <div className="form-grid">
 <label>Your name <span>*</span><input name="name" autoComplete="name" placeholder="Full name" required minLength={2} maxLength={100}/></label>
 <label>Phone number <span>*</span><input name="phone" type="tel" autoComplete="tel" placeholder="(713) 000-0000" required minLength={7} maxLength={30}/></label>
 <label>Email address <small>optional</small><input name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={254}/></label>
 <label>Massage preference<select name="service" defaultValue="Not sure — please advise"><option>Not sure — please advise</option>{business.services.map(s=><option key={s.name}>{s.name} (subject to availability)</option>)}</select></label>
 <label>Preferred date<input name="date" type="date" min={today()}/></label>
 <label>Preferred time <small>Houston time</small><input name="time" type="time"/></label>
 </div>
 <label>Anything you would like us to know? <small>optional</small><textarea name="notes" rows={3} maxLength={1500} placeholder="Preferences or questions. Please avoid sensitive medical information."/></label>
 <div className="honeypot" aria-hidden="true"><label>Leave this empty<input name="_gotcha" tabIndex={-1} autoComplete="off"/></label></div>
 <input type="hidden" name="_subject" value="Healthy Thai Massage — appointment request"/>
 {!enabled&&<p className="form-notice">Online requests are coming soon. Please <a href={`tel:${business.tel}`}>call</a> or <a href={`sms:${business.tel}`}>text {business.phone}</a> to request an appointment.</p>}
 <button className="button primary submit" type="submit" disabled={!enabled||sending}>{sending?'Sending request…':'Request an Appointment'} <span>↗</span></button>
 <p role="alert" className="form-error">{status}</p><p className="privacy-line">By submitting, you agree to be contacted about this request. <a href="#privacy">Privacy notice</a>.</p>
 </form>
}
