import { useState, useEffect } from 'react';
import RecipeForm from './components/RecipeForm';
import RecipeCard from './components/RecipeCard';
import RecipeView from './components/RecipeView';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [view, setView] = useState('list');
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/recipes`);
      const data = await res.json();
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
    setLoading(false);
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

  const filtered = recipes.filter(r => {
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
    return <RecipeView recipe={currentRecipe} onBack={() => setView('list')} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🍳 Мои рецепты</h1>
        <button className="btn-add" onClick={() => setView('form')}>
          + Добавить рецепт
        </button>
      </header>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Поиск по названию или ингредиенту..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="empty-state">Загрузка...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          {recipes.length === 0
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
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;