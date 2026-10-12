import { useState, useEffect } from 'react';
import RecipeForm from './components/RecipeForm';
import RecipeCard from './components/RecipeCard';
import RecipeView from './components/RecipeView';
import { getFavorites } from './utils/favorites';

const API_URL = 'https://recipes-ilakolincenko721-v1ce.onreza.app/api';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [view, setView] = useState('list');
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favoritesVersion, setFavoritesVersion] = useState(0); // для перерисовки

  useEffect(() => {
    fetchRecipes(true);

    const interval = setInterval(() => {
      fetchRecipes(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Перечитать избранное при изменении
  useEffect(() => {
    setFavoritesVersion(v => v + 1);
  }, [view]);

  const fetchRecipes = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch(`${API_URL}/recipes`);
      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error('API вернул не массив:', data);
        setRecipes([]);
        if (showLoading) setLoading(false);
        return;
      }

      const formatted = data.map(r => ({
        id: r.id,
        title: r.title,
        time: r.time,
        servings: r.servings,
        image: r.image,
        ingredients: r.ingredients || [],
        steps: r.steps || [],
      }));
      setRecipes(formatted);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
    }
    if (showLoading) setLoading(false);
  };

  const handleSave = async (recipe) => {
    try {
      const res = await fetch(`${API_URL}/recipes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: recipe.title,
          time: recipe.time,
          servings: recipe.servings,
          image: recipe.image,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
        }),
      });
      if (res.ok) {
        await fetchRecipes();
        setView('list');
      } else {
        alert('Ошибка сохранения');
      }
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Ошибка сохранения');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить рецепт?')) return;
    try {
      await fetch(`${API_URL}/recipes/${id}`, { method: 'DELETE' });
      setRecipes(recipes.filter(r => r.id !== id));
    } catch (err) {
      console.error('Ошибка удаления:', err);
    }
  };

  const handleView = (recipe) => {
    setCurrentRecipe(recipe);
    setView('recipe');
  };

  const handleFavoritesChange = () => {
    setFavoritesVersion(v => v + 1);
  };

  // «Удиви меня» — случайный рецепт
  const handleSurprise = () => {
    if (recipes.length === 0) return;
    const random = recipes[Math.floor(Math.random() * recipes.length)];
    handleView(random);
  };

  // Фильтрация
  const favorites = getFavorites();
  const filtered = recipes.filter(r => {
    // Фильтр по избранному
    if (showFavoritesOnly && !favorites.includes(r.id)) return false;

    // Фильтр по поиску
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.ingredients.some(i => i.name.toLowerCase().includes(q))
    );
  });

  if (view === 'form') {
    return <RecipeForm onSave={handleSave} onCancel={() => setView('list')} />;
  }

  if (view === 'recipe' && currentRecipe) {
    return (
      <RecipeView
        recipe={currentRecipe}
        onBack={() => setView('list')}
        onFavoritesChange={handleFavoritesChange}
      />
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🍳 Мои рецепты</h1>
        <div className="header-actions">
          <button className="btn-surprise" onClick={handleSurprise}>
            🎲 Удиви меня
          </button>
          <button className="btn-add" onClick={() => setView('form')}>
            + Добавить рецепт
          </button>
        </div>
      </header>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Поиск по названию или ингредиенту..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${!showFavoritesOnly ? 'active' : ''}`}
          onClick={() => setShowFavoritesOnly(false)}
        >
          Все рецепты ({recipes.length})
        </button>
        <button
          className={`tab-btn ${showFavoritesOnly ? 'active' : ''}`}
          onClick={() => setShowFavoritesOnly(true)}
        >
          ❤️ Избранное ({favorites.length})
        </button>
      </div>

      {loading ? (
        <div className="empty-state">Загрузка...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          {showFavoritesOnly
            ? 'В избранном пока пусто. Нажми на ❤️ на карточке рецепта.'
            : recipes.length === 0
            ? 'Пока нет рецептов. Добавь первый!'
            : 'Ничего не найдено'}
        </div>
      ) : (
        <div className="recipes-grid">
          {filtered.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onView={handleView}
              onDelete={handleDelete}
              onFavoritesChange={handleFavoritesChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;