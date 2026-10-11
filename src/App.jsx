import { useState, useEffect } from 'react';
import RecipeForm from './components/RecipeForm';
import RecipeCard from './components/RecipeCard';
import RecipeView from './components/RecipeView';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [view, setView] = useState('list'); // 'list' | 'form' | 'recipe'
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [search, setSearch] = useState('');

  // Загрузка из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recipes');
    if (saved) {
      try { setRecipes(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  // Сохранение
  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  const handleSave = (recipe) => {
    setRecipes([recipe, ...recipes]);
    setView('list');
  };

  const handleDelete = (id) => {
    if (confirm('Удалить рецепт?')) {
      setRecipes(recipes.filter(r => r.id !== id));
    }
  };

  const handleView = (recipe) => {
    setCurrentRecipe(recipe);
    setView('recipe');
  };

  // Фильтр по названию и ингредиентам
  const filtered = recipes.filter(r => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.ingredients.some(i => i.name.toLowerCase().includes(q))
    );
  });

  // ===== Рендер =====
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

      {filtered.length === 0 ? (
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