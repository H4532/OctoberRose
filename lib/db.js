import postgres from 'postgres';
let sql;
export function db(){if(!process.env.DATABASE_URL)throw new Error('Database not configured');if(!sql)sql=postgres(process.env.DATABASE_URL,{ssl:'require',max:3,prepare:false});return sql}
