const { Pool } = require('pg');

// Amvera сама подставит сюда длинную строку из Supabase, которую мы сохранили в переменные
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Без этой строчки облако Supabase заблокирует хостинг
});

async function connectDB() {
  try {
    const client = await pool.connect();
    console.log('ПОБЕДА! Успешно подключились к удаленной базе PostgreSQL!');
    client.release();
  } catch (err) {
    console.error('Ошибка подключения к PostgreSQL:', err.message);
    throw err;
  }
}

module.exports = { connectDB, pool };
