// October Rose registration endpoint. No public database credentials.
const origin = 'https://h4532.github.io';
const cors = {'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Vary':'Origin'};
const json = (body,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}});
export default {
 async fetch(request) {
  if(request.method === 'OPTIONS') return new Response(null,{status:204,headers:cors});
  if(request.method !== 'POST') return json({error:'Method not allowed'},405);
  if(request.headers.get('Origin') !== origin) return json({error:'Forbidden origin'},403);
  try {
   const d = await request.json();
   if(d.website) return json({ok:true});
   const name=String(d.full_name||'').trim(), email=String(d.email||'').trim().toLowerCase();
   const phone=String(d.phone||'').trim(),city=String(d.city||'Jeddah').trim(),organization=String(d.organization||'').trim(),message=String(d.message||'').trim(),guests=Number(d.num_guests||1);
   if(name.length<2 || name.length>120 || !/^\S+@\S+\.\S+$/.test(email) || email.length>254 || (phone!=='+966' && phone!=='' && !/^\+966\d{9}$/.test(phone)) || city.length>100 || organization.length>120 || message.length>500 || !Number.isInteger(guests) || guests<1 || guests>10 || d.consent!==true) return json({error:'Please check your registration details and consent.'},400);
   const connection=process.env.DATABASE_URL;
   if(!connection) throw new Error('Missing database connection');
   const endpoint='https://'+new URL(connection).hostname.replace('-pooler','')+'/sql';
   const result=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','Neon-Connection-String':connection},body:JSON.stringify({query:'INSERT INTO public.october_rose_registrations(full_name,email,phone,city,organization,num_guests,message,consent) VALUES ($1,$2,$3,$4,$5,$6,$7,true)',params:[name,email,phone==='+966'?'':phone,city,organization,guests,message]})});
   if(result.ok) return json({ok:true});
   const detail=await result.text();
   if(detail.includes('Registration limit reached')) return json({error:'Registration is full (20 registrations).'},409);
   console.error('Neon insert error',result.status,detail.slice(0,300));
   return json({error:'Unable to save registration. Please try again later.'},503);
  } catch(error) {console.error('Registration error',String(error));return json({error:'Registration is temporarily unavailable.'},503)}
 }
};
