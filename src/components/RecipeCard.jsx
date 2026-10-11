function RecipeCard({ recipe, onView, onDelete }) {
  return (
    <div className="recipe-card">
      {recipe.image && (
        <div className="recipe-card-image">
          <img src={recipe.image} alt={recipe.title} />
        </div>
      )}
      <div className="recipe-card-body">
        {(recipe.tags || []).length > 0 && (
          <div className="recipe-card-tags">
            {recipe.tags.map(tag => (
              <span key={tag} className="recipe-card-tag">{tag}</span>
            ))}
          </div>
        )}
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