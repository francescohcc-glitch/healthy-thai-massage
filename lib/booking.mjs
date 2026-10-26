export function deliveryEnabled(endpoint, verified, mode) {
 return mode === 'live' && verified === 'true' && /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint || '');
}
export function validateRequest(data, today) {
 if (!data.name || data.name.trim().length < 2 || data.name.length > 100) return 'Please enter your name (2–100 characters).';
 if (!data.phone || !/^[+()\d\s.-]{7,30}$/.test(data.phone) || data.phone.replace(/\D/g,'').length < 7) return 'Please enter a valid phone number.';
 if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return 'Please enter a valid email address.';
 if (data.date && (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || data.date < today)) return 'Please choose today or a future date.';
 if ((data.notes || '').length > 1500) return 'Please keep notes under 1,500 characters.';
 return '';
}

export async function processRequest({live, send}) {
 if (!live) return {demo:true,message:"Demo complete. Nothing was sent or saved. No appointment has been requested or confirmed. Please call for a real appointment."};
 return send();
}
