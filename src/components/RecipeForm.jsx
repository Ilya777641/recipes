import { useState } from 'react';

function RecipeForm({ onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [servings, setServings] = useState('');
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState([]);
  const [ingredients, setIngredients] = useState([
    { name: '', amount: '', unit: 'г' }
  ]);
  const [steps, setSteps] = useState(['']);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const toggleTag = (tag) => {
    setTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: 'г' }]);
  };
  const updateIngredient = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };
  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addStep = () => setSteps([...steps, '']);
  const updateStep = (index, value) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };
  const removeStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Введите название рецепта');

    const recipe = {
      id: Date.now(),
      title: title.trim(),
      time: time.trim(),
      servings: servings.trim(),
      image,
      ingredients: ingredients.filter(i => i.name.trim()),
      steps: steps.filter(s => s.trim()),
      tags,
      createdAt: new Date().toISOString()
    };

    onSave(recipe);
  };

  return (
    <div className="recipe-form-container">
      <form className="recipe-form" onSubmit={handleSubmit}>
        <h2>Новый рецепт</h2>

        <div className="form-row">
          <label>Скриншот рецепта</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {image && (
            <div className="image-preview">
              <img src={image} alt="Скриншот" />
            </div>
          )}
        </div>

        <div className="form-row">
          <label>Название *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например: Паста Карбонара"
          />
        </div>

        <div className="form-row-2">
          <div>
            <label>Время (мин)</label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="30"
            />
          </div>
          <div>
            <label>Порции</label>
            <input
              type="text"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              placeholder="2"
            />
          </div>
        </div>

        <div className="form-section">
          <label>Категории</label>
          <div className="tags-selector">
            {['завтрак', 'обед', 'ужин', 'десерт', 'напиток'].map(tag => (
              <button
                key={tag}
                type="button"
                className={`tag-btn ${tags.includes(tag) ? 'active' : ''}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <label>Ингредиенты</label>
            <button type="button" onClick={addIngredient}>+ Добавить</button>
          </div>
          {ingredients.map((ing, i) => (
            <div className="ingredient-row" key={i}>
              <input
                type="text"
                placeholder="Название"
                value={ing.name}
                onChange={(e) => updateIngredient(i, 'name', e.target.value)}
              />
              <input
                type="text"
                placeholder="Кол-во"
                value={ing.amount}
                onChange={(e) => updateIngredient(i, 'amount', e.target.value)}
              />
              <select
                value={ing.unit}
                onChange={(e) => updateIngredient(i, 'unit', e.target.value)}
              >
                <option>г</option>
                <option>мл</option>
                <option>шт</option>
                <option>ст.л.</option>
                <option>ч.л.</option>
                <option>по вкусу</option>
              </select>
              <button type="button" onClick={() => removeIngredient(i)}>✕</button>
            </div>
          ))}
        </div>

        <div className="form-section">
          <div className="section-header">
            <label>Шаги приготовления</label>
            <button type="button" onClick={addStep}>+ Добавить</button>
          </div>
          {steps.map((step, i) => (
            <div className="step-row" key={i}>
              <span className="step-number">{i + 1}</span>
              <textarea
                placeholder="Опишите шаг..."
                value={step}
                onChange={(e) => updateStep(i, e.target.value)}
                rows={2}
              />
              <button type="button" onClick={() => removeStep(i)}>✕</button>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Отмена
          </button>
          <button type="submit" className="btn-save">
            Сохранить рецепт
          </button>
        </div>
      </form>
    </div>
  );
}

export default RecipeForm;