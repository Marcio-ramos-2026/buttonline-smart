import pg from "pg";

const { Pool } = pg;

export const conn = new Pool({
  user: "default",
  password: "N3wXpgJS2tHl",
  host: "ep-rough-morning-a4giuifp.us-east-1.aws.neon.tech",
  port: 5432,
  database: "verceldb",
  ssl: true,
});

export async function queryUsers() {
  const res = await conn.query("SELECT * FROM users");

  if (res.rows.length < 1) throw Error("Usuários não encontrados.");

  return res.rows;
}

export async function findUserByEmail(email: string) {
  const res = await conn.query("SELECT * FROM users WHERE email = $1", [email]);

  if (res.rows.length < 1) return null;

  return res.rows[0];
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
  const res = await conn.query(
    "INSERT INTO users(name, email, password) VALUES($1, $2, $3)",
    [name, email, password]
  );
}

export async function fetchIcons(params?: string) {
  const res = await conn.query("SELECT * FROM icons");

  return res.rows;
}
