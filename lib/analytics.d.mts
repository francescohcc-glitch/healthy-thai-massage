export const MEASUREMENT_ID:string;
export const SITE_URL:string;
export const CONSENT_KEY:string;
export const LOCATIONS:string[];
export const EVENTS:string[];
export function classifyLink(href:string):string|null;
export function consentValid(record:unknown,now?:number):boolean;
export function createAnalytics(options:{command:(...args:unknown[])=>void;load:()=>void;debug?:boolean}):{
 accept:()=>void;reject:()=>void;track:(name:string,params?:{button_location?:string;booking_mode?:string})=>boolean;
 bookingSuccess:(response:{ok:boolean;body?:{ok?:boolean};mode:string},token:object)=>boolean;
};
