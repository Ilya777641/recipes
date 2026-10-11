import { useState, useEffect } from 'react';
import RecipeForm from './components/RecipeForm';
import RecipeCard from './components/RecipeCard';
import RecipeView from './components/RecipeView';

const API_URL = 'https://recipes-ilakolincenko721-v1ce.onreza.app/api';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [view, setView] = useState('list');
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('все');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes(true);

    const interval = setInterval(() => {
      fetchRecipes(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchRecipes = async (showLoading = false) => {
    if (showLoading) setLoading(true);
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
        tags: r.tags || [],
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
          tags: recipe.tags,
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
    if (activeTag !== 'все' && !(r.tags || []).includes(activeTag)) return false;

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

      <div className="tags-filter">
        {['все', 'завтрак', 'обед', 'ужин', 'десерт', 'напиток'].map(tag => (
          <button
            key={tag}
            className={`tag-filter-btn ${activeTag === tag ? 'active' : ''}`}
            onClick={() => setActiveTag(tag)}
          >
            {tag}
          </button>
        ))}
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