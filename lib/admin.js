import {createHmac,timingSafeEqual} from 'node:crypto';
const maxAge=60*60*8;
function sign(value){return createHmac('sha256',process.env.SESSION_SECRET||'missing-secret').update(value).digest('hex')}
export function makeToken(){const data=String(Date.now()+maxAge*1000);return data+'.'+sign(data)}
export function authorized(request){if(!process.env.SESSION_SECRET||!process.env.ADMIN_PIN)return false;const raw=request.cookies.get('octrose_admin')?.value||'';const [expiry,mac]=raw.split('.');if(!expiry||!mac||!/^\d+$/.test(expiry)||Number(expiry)<Date.now())return false;const expected=Buffer.from(sign(expiry),'hex');const got=Buffer.from(mac,'hex');return expected.length===got.length&&timingSafeEqual(expected,got)}
export function validPin(candidate){if(!process.env.ADMIN_PIN)return false;const a=Buffer.from(String(candidate)),b=Buffer.from(process.env.ADMIN_PIN);return a.length===b.length&&timingSafeEqual(a,b)}
export const sessionAge=maxAge;