import { Buffer } from "buffer";
import { createContext, FC, PropsWithChildren, useContext } from "react";
import { useLocalStorage } from "rujira.ui";

const context = createContext<{
  favorites: string[];
  addFavorite: (address: string) => void;
  removeFavorite: (address: string) => void;
  clearFavorites: () => void;
}>({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  clearFavorites: () => {},
});

interface FavoritesContext {
  favorites: string[];
  addFavorite: (address: string) => void;
  removeFavorite: (address: string) => void;
  clearFavorites: () => void;
}

export const FavoritesContext: FC<PropsWithChildren> = ({ children }) => {
  const [deprecated] = useLocalStorage<string[]>("rujira-trade-favorites", []);
  const [favorites, setFavorites] = useLocalStorage<string[]>(
    "rujira-favorites",
    deprecated.map((x) => Buffer.from(`FinPair:${x}`).toString("base64"))
  );

  const addFavorite = (id: string) => {
    setFavorites((prev) => [...new Set([...prev, id])]); // avoid duplicates
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((a) => a !== id));
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <context.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        clearFavorites,
      }}>
      {children}
    </context.Provider>
  );
};

export const useFavorites = (): FavoritesContext => {
  const { favorites, addFavorite, removeFavorite, clearFavorites } =
    useContext(context);
  return { favorites, addFavorite, removeFavorite, clearFavorites };
};
