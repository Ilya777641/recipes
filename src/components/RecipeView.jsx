function RecipeView({ recipe, onBack }) {
  return (
    <div className="recipe-view-container">
      <button className="btn-back" onClick={onBack}>← Назад</button>

      <div className="recipe-view">
        <h1>{recipe.title}</h1>

        <div className="recipe-view-meta">
          {recipe.time && <span>⏱ {recipe.time} мин</span>}
          {recipe.servings && <span>🍽 {recipe.servings} порц.</span>}
        </div>

        {recipe.image && (
          <div className="recipe-view-image">
            <img src={recipe.image} alt={recipe.title} />
          </div>
        )}

        <div className="recipe-view-section">
          <h2>Ингредиенты</h2>
          <ul className="ingredients-list">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>
                <span className="ing-name">{ing.name}</span>
                <span className="ing-amount">
                  {ing.amount} {ing.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="recipe-view-section">
          <h2>Приготовление</h2>
          <ol className="steps-list">
            {recipe.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default RecipeView;