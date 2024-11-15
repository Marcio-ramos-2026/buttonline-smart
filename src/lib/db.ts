// import pg from "pg";

import mysql, { RowDataPacket } from "mysql2/promise";

// const { Pool } = pg;

// export const conn = new Pool({
//   user: "default",
//   password: "N3wXpgJS2tHl",
//   host: "ep-rough-morning-a4giuifp.us-east-1.aws.neon.tech",
//   port: 5432,
//   database: "verceldb",
//   ssl: true,
// });

export const pool = mysql.createPool({
  uri: process.env.DB_URL,
});

export async function queryUsers() {
  const [results, fields] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM users"
  );

  if (results.length < 1) throw Error("Usuários não encontrados.");

  return results;
}

export async function findUserByEmail(email: string) {
  const [results, fields] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (results.length < 1) return null;

  return results[0];
}

export async function insertUser(
  name: string,
  email: string,
  password: string
) {
  if (!name)
    return {
      message: "Nome obrigatório",
    };
  if (!email)
    return {
      message: "Email obrigatório",
    };
  if (!password)
    return {
      message: "Senha obrigatória",
    };

  await pool.execute(
    "INSERT INTO users(name, email, password) VALUES(?, ?, ?)",
    [name, email, password]
  );
}

export async function fetchIcons(params?: string) {
  const [results, fields] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM EditorIcons"
  );
  console.log("r", results);
  return results;
}
