// Работа с избранным через localStorage

const FAVORITES_KEY = 'recipe_favorites';

export const getFavorites = () => {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const isFavorite = (id) => {
  return getFavorites().includes(id);
};

export const toggleFavorite = (id) => {
  const favorites = getFavorites();
  if (favorites.includes(id)) {
    const updated = favorites.filter(f => f !== id);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return false; // убрали из избранного
  } else {
    favorites.push(id);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return true; // добавили в избранное
  }
};