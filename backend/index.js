console.log("РЕАЛЬНЫЙ ПУТЬ К ФАЙЛУ:", __filename);
console.log("=== ТЕСТ: ЗАПУСТИЛСЯ ИМЕННО ЭТОТ ФАЙЛ ===");

const express = require("express"); 
const path = require("path"); 
const { connectDB, pool } = require("./db"); 

const app = express(); 
const PORT = process.env.PORT || 5000;


// 1. Настройки сервера
app.use(express.json()); 

// 2. Обычный тестовый GET-маршрут
app.get("/api/ping", (req, res) => {
    res.json({ message: "Бэкенд на связи и работает!" });
});

// 3. Маршрут для регистрации (ИСПРАВЛЕН ПОД POSTGRESQL)
app.post("/api/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Все поля обязательны!" });
        }

        // Проверяем, есть ли пользователь ($1 — это безопасная подстановка для email)
        const userCheck = await pool.query('SELECT id FROM "Users" WHERE email = $1', [email]);
        
        if (userCheck.rows.length > 0) { // Результаты в pg хранятся в массиве .rows
            return res.status(400).json({ success: false, message: "Такой email уже зарегистрирован!" });
        }

        // Вставляем нового пользователя ($1, $2, $3 — это безопасная подстановка данных)
        await pool.query(
            'INSERT INTO "Users" (name, email, password) VALUES ($1, $2, $3)', 
            [name, email, password]
        );

        res.status(201).json({ success: true, message: "Регистрация прошла успешно!" });

    } catch (error) {
        console.error("Ошибка внутри роута signup:", error);
        res.status(500).json({ success: false, message: "Ошибка сервера при регистрации." });
    }
});

// 4. Раздача фронтенда
app.use(express.static(path.resolve(__dirname, "../frontend"))); 

app.get("/", (req, res) => { 
    res.sendFile(path.resolve(__dirname, "../frontend/t.html"));
    }); 

// 5. Запуск сервера
async function start() {
    try {
        await connectDB(); // Ждём, пока подключится PostgreSQL
        
        app.listen(PORT, '0.0.0.0', () => { 
            console.log(`🚀 Сервер успешно запущен: http://localhost:${PORT}`); 
        });
    } catch (err) {
        console.error("Критическая ошибка при старте приложения:", err);
    }
}

start();