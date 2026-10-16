
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@nextstop:favorites";

interface FavoritesContextType {
    favorites: string[];
    isFavorite: (id: string) => boolean;
    toggleFavorite: (id: string) => void;
    isLoading: boolean;
}

const FavoritesContext = createContext<
    FavoritesContextType | undefined
>(undefined);

export function FavoritesProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load saved favorites when the app starts.
    useEffect(() => {
        async function loadFavorites() {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);

                if (stored !== null) {
                    const parsed: unknown = JSON.parse(stored);

                    if (
                        Array.isArray(parsed) &&
                        parsed.every((item) => typeof item === "string")
                    ) {
                        setFavorites(parsed);
                    }
                }
            } catch (error) {
                console.error("Failed to load favorites:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadFavorites();
    }, []);

    // Save changes after the initial load.
    useEffect(() => {
        if (isLoading) return;

        async function saveFavorites() {
            try {
                await AsyncStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(favorites)
                );
            } catch (error) {
                console.error("Failed to save favorites:", error);
            }
        }

        saveFavorites();
    }, [favorites, isLoading]);

    function isFavorite(id: string) {
        return favorites.includes(id);
    }

    function toggleFavorite(id: string) {
        if (isLoading) return;

        setFavorites((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id]
        );
    }

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                isFavorite,
                toggleFavorite,
                isLoading,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);

    if (!context) {
        throw new Error(
            "useFavorites must be used inside FavoritesProvider"
        );
    }

    return context;
}