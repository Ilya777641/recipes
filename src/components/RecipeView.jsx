import { useState, useEffect, useRef } from 'react';

function RecipeView({ recipe, onBack }) {
  // ===== СЧЁТЧИК ПОРЦИЙ =====
  const baseServings = parseFloat(recipe.servings) || 2; // исходное число порций
  const [currentServings, setCurrentServings] = useState(baseServings);

  // Пересчёт ингредиентов
  const getAdjustedAmount = (ingredient) => {
    const amount = parseFloat(ingredient.amount);
    if (isNaN(amount)) return ingredient.amount; // если "по вкусу" — не трогаем
    const ratio = currentServings / baseServings;
    const result = amount * ratio;
    // Округляем до 1 знака после запятой, если число не целое
    return Number.isInteger(result) ? result : result.toFixed(1);
  };

  const increaseServings = () => setCurrentServings(prev => prev + 1);
  const decreaseServings = () => setCurrentServings(prev => Math.max(1, prev - 1));

  // ===== ТАЙМЕР =====
  const [timerSeconds, setTimerSeconds] = useState(0); // осталось секунд
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerInput, setTimerInput] = useState(30); // минуты для ввода
  const [showTimerAlert, setShowTimerAlert] = useState(false);
  const timerRef = useRef(null);

  // Запуск таймера
  const startTimer = () => {
    if (timerRunning) return;
    if (timerSeconds === 0) {
      setTimerSeconds(timerInput * 60);
    }
    setTimerRunning(true);
  };

  // Остановка
  const stopTimer = () => {
    setTimerRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Сброс
  const resetTimer = () => {
    stopTimer();
    setTimerSeconds(0);
    setShowTimerAlert(false);
  };

  // Логика тиканья
  useEffect(() => {
    if (timerRunning && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            // Время вышло
            clearInterval(timerRef.current);
            timerRef.current = null;
            setTimerRunning(false);
            setShowTimerAlert(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerRunning]);

  // Форматирование времени: 1:05, 0:30
  const formatTime = (totalSeconds) => {
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  // Закрытие алерта
  const closeAlert = () => setShowTimerAlert(false);

  return (
    <div className="recipe-view-container">
      {/* Алерт об окончании таймера */}
      {showTimerAlert && (
        <div className="timer-alert-overlay" onClick={closeAlert}>
          <div className="timer-alert" onClick={(e) => e.stopPropagation()}>
            <div className="timer-alert-icon">⏰</div>
            <h3>Время вышло!</h3>
            <p>Таймер на {timerInput} минут завершён.</p>
            <button onClick={closeAlert}>Ок</button>
          </div>
        </div>
      )}

      <button className="btn-back" onClick={onBack}>← Назад</button>

      <div className="recipe-view">
        <h1>{recipe.title}</h1>

        <div className="recipe-view-meta">
          {recipe.time && <span>⏱ {recipe.time} мин</span>}
          {recipe.servings && <span>🍽 {recipe.servings} порц.</span>}
        </div>

        {/* ===== ТАЙМЕР ===== */}
        <div className="timer-box">
          <div className="timer-header">
            <span className="timer-icon">⏲️</span>
            <span>Таймер</span>
          </div>
          <div className="timer-body">
            <div className="timer-display">
              {timerSeconds > 0 || timerRunning
                ? formatTime(timerSeconds)
                : `${timerInput}:00`}
            </div>
            <div className="timer-controls">
              {!timerRunning ? (
                <>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={timerInput}
                    onChange={(e) => setTimerInput(Math.max(1, parseInt(e.target.value) || 1))}
                    className="timer-input"
                    disabled={timerSeconds > 0}
                  />
                  <span className="timer-unit">мин</span>
                  <button className="timer-btn start" onClick={startTimer}>
                    {timerSeconds > 0 ? 'Продолжить' : 'Запустить'}
                  </button>
                </>
              ) : (
                <button className="timer-btn stop" onClick={stopTimer}>
                  Пауза
                </button>
              )}
              {(timerSeconds > 0 || timerRunning) && (
                <button className="timer-btn reset" onClick={resetTimer}>
                  Сброс
                </button>
              )}
            </div>
          </div>
        </div>

        {recipe.image && (
          <div className="recipe-view-image">
            <img src={recipe.image} alt={recipe.title} />
          </div>
        )}

        {/* ===== ИНГРЕДИЕНТЫ С ПЕРЕСЧЁТОМ ===== */}
        <div className="recipe-view-section">
          <div className="section-header-with-counter">
            <h2>Ингредиенты</h2>
            <div className="servings-counter">
              <button onClick={decreaseServings} disabled={currentServings <= 1}>−</button>
              <span>{currentServings} порц.</span>
              <button onClick={increaseServings}>+</button>
            </div>
          </div>
          <ul className="ingredients-list">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>
                <span className="ing-name">{ing.name}</span>
                <span className="ing-amount">
                  {getAdjustedAmount(ing)} {ing.unit}
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