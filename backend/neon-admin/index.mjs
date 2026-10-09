const origin='https://h4532.github.io';
const headers={'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type,X-Admin-Key','Content-Type':'application/json','Cache-Control':'no-store'};
const respond=(value,status=200)=>new Response(JSON.stringify(value),{status,headers});
export default {async fetch(request){
if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
if(request.method!=='POST')return respond({error:'Method not allowed'},405);
if(request.headers.get('Origin')!==origin)return respond({error:'Forbidden'},403);
const password=request.headers.get('X-Admin-Key')||'';
if(!process.env.ADMIN_ACCESS_KEY||password!==process.env.ADMIN_ACCESS_KEY)return respond({error:'Invalid access key'},401);
try{
const cs=process.env.DATABASE_URL;
const url='https://'+new URL(cs).hostname.replace('-pooler','')+'/sql';
const result=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json','Neon-Connection-String':cs},body:JSON.stringify({query:'SELECT created_at,full_name,email,phone,city,organization,num_guests,message FROM public.october_rose_registrations ORDER BY created_at DESC LIMIT 100'})});
if(!result.ok)throw new Error('Database query failed '+result.status);
const data=await result.json();
return respond({registrations:data.rows||[]});
}catch(e){console.error(String(e));return respond({error:'Unable to load attendees'},503)}
}};