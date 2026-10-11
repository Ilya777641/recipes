const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // увеличили лимит для скриншотов

// Подключение к базе ONREZA
const pool = new Pool({
  host: 'ep-95b37e7a4d60.kaiki.ru',
  port: 5432,
  database: 'recipes',
  user: 'kaiki_c_b8c01ecf7aecffd8321f2cff', // вставь полное имя пользователя
  password: 'Kk1!VEKB7L9Z-x3b94pXHZySfdlD_H70', // вставь свой пароль
  ssl: { rejectUnauthorized: false }
});

// Получить все рецепты
app.get('/api/recipes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM recipes ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки' });
  }
});

// Добавить рецепт
app.post('/api/recipes', async (req, res) => {
  try {
    const { title, time, servings, image, ingredients, steps } = req.body;
    const result = await pool.query(
      'INSERT INTO recipes (title, time, servings, image, ingredients, steps) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, time, servings, image, JSON.stringify(ingredients), JSON.stringify(steps)]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сохранения' });
  }
});

// Удалить рецепт
app.delete('/api/recipes/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM recipes WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка удаления' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});