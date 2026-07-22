const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',          // Стандартный пользователь PostgreSQL
  host: 'localhost',         // База находится на вашем компьютере
  database: 'my_site',       // Имя базы, которую вы создали в pgAdmin
  password: '1234',    // ⚠️ ОБЯЗАТЕЛЬНО впишите сюда ваш пароль от pgAdmin!
  port: 5432,                // Стандартный порт PostgreSQL
});

async function connectDB() {
  try {
    const client = await pool.connect();
    console.log('ПОБЕДА! Успешно подключились к вашей базе PostgreSQL (my_site)!');
    client.release(); // Возвращаем соединение в пул
  } catch (err) {
    console.error('Ошибка подключения к вашему PostgreSQL:', err.message);
    throw err;
  }
}

module.exports = { connectDB, pool };