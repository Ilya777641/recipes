import { useState, useEffect } from 'react';
import RecipeForm from './components/RecipeForm';
import RecipeCard from './components/RecipeCard';
import RecipeView from './components/RecipeView';
import { supabase } from './supabaseClient';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [view, setView] = useState('list');
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Загрузка рецептов из Supabase
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Ошибка загрузки:', error);
    } else {
      // Преобразуем данные из БД в наш формат
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
    }
    setLoading(false);
  };

  const handleSave = async (recipe) => {
    // Отправляем в Supabase
    const { error } = await supabase.from('recipes').insert({
      title: recipe.title,
      time: recipe.time,
      servings: recipe.servings,
      image: recipe.image,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
    });

    if (error) {
      console.error('Ошибка сохранения:', error);
      alert('Ошибка сохранения. Попробуй ещё раз.');
    } else {
      await fetchRecipes(); // Обновляем список
      setView('list');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить рецепт?')) return;

    const { error } = await supabase.from('recipes').delete().eq('id', id);

    if (error) {
      console.error('Ошибка удаления:', error);
    } else {
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