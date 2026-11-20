'use client';
import {useState} from 'react';
import {business as b} from '@/lib/content';
export default function Navigation(){const [open,setOpen]=useState(false);return <header className="header"><a href="#home" className="brand" aria-label="Healthy Thai Massage home"><img
  src="/branding/healthy-thai-logo.png"
  alt=""
  className="brand-mark"
  width="40"
  height="54"
/><span>HEALTHY THAI<small>MASSAGE & WELLNESS</small></span></a><button className="menu-toggle" aria-expanded={open} aria-controls="main-nav" onClick={()=>setOpen(!open)}>{open?'Close':'Menu'}</button><nav id="main-nav" className={open?'nav open':'nav'} aria-label="Main navigation">{['Home','About','Services','Gallery','Book Appointment','Contact'].map((n,i)=><a onClick={()=>setOpen(false)} href={i===4?'https://healthythaimassage4kve.setmore.com':`#${['home','about','services','gallery','book','contact'][i]}`} key={n}>{n}</a>)}</nav><a className="nav-book button primary" href="https://healthythaimassage4kve.setmore.com">Book Now</a><div className="mobile-header-actions" aria-label="Quick actions"><a href={b.googleReview} target="_blank" rel="noopener noreferrer">Leave a Review<span className="sr-only"> (opens in a new tab)</span></a><a href="https://healthythaimassage4kve.setmore.com">Book Now</a></div><div className="header-actions" aria-label="Quick actions"><a className="button primary" href="https://healthythaimassage4kve.setmore.com">Book Now</a><a className="button primary" href={b.googleReview} target="_blank" rel="noopener noreferrer">Leave a Google Review<span className="sr-only"> (opens in a new tab)</span></a><a className="button primary" href={b.yelpReview} target="_blank" rel="noopener noreferrer">Leave a Yelp Review<span className="sr-only"> (opens in a new tab)</span></a><a className="button primary" href={`tel:${b.tel}`}>Call Now</a><a className="button primary" href={`sms:${b.tel}`}>Text Us</a></div></header>}
