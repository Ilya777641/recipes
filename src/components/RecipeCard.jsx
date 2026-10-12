import { useState } from 'react';
import { isFavorite, toggleFavorite } from '../utils/favorites';

function RecipeCard({ recipe, onView, onDelete, onFavoritesChange }) {
  const [fav, setFav] = useState(isFavorite(recipe.id));

  const handleFavorite = (e) => {
    e.stopPropagation();
    const newState = toggleFavorite(recipe.id);
    setFav(newState);
    if (onFavoritesChange) onFavoritesChange();
  };

  return (
    <div className="recipe-card">
      <div className="recipe-card-image-wrapper">
        {recipe.image ? (
          <div className="recipe-card-image">
            <img src={recipe.image} alt={recipe.title} />
          </div>
        ) : (
          <div className="recipe-card-image recipe-card-placeholder">
            <span>🍲</span>
          </div>
        )}
        <button
          className={`favorite-btn ${fav ? 'active' : ''}`}
          onClick={handleFavorite}
          title={fav ? 'Убрать из избранного' : 'В избранное'}
        >
          {fav ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="recipe-card-body">
        <h3>{recipe.title}</h3>
        <div className="recipe-card-meta">
          {recipe.time && <span>⏱ {recipe.time} мин</span>}
          {recipe.servings && <span>🍽 {recipe.servings} порц.</span>}
          <span>📝 {recipe.ingredients.length} ингр.</span>
        </div>
        <div className="recipe-card-actions">
          <button onClick={() => onView(recipe)}>Открыть</button>
          <button className="btn-delete" onClick={() => onDelete(recipe.id)}>Удалить</button>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;