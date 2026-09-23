import { useCallback, useState } from "react";
import { companies } from "../data/mock";

const validRecentIds = new Set(
  companies.filter((company) => company.available).map((company) => company.id),
);
const validWatchIds = new Set(companies.map((company) => company.id));

export function readIds(key: string, validIds = validWatchIds): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed)
      ? [
          ...new Set(
            parsed.filter(
              (id): id is string => typeof id === "string" && validIds.has(id),
            ),
          ),
        ].slice(0, 20)
      : [];
  } catch {
    return [];
  }
}

export function useResearch() {
  const [recent, setRecent] = useState(() =>
    readIds("konjac.recent.v1", validRecentIds),
  );
  const [watchlist, setWatchlist] = useState(() =>
    readIds("konjac.watchlist.v1"),
  );
  const [storageWarning, setStorageWarning] = useState(false);
  const persist = useCallback((key: string, ids: string[]) => {
    try {
      localStorage.setItem(key, JSON.stringify(ids));
    } catch {
      setStorageWarning(true);
    }
  }, []);
  const visit = useCallback(
    (id: string) => {
      if (!validRecentIds.has(id)) return;
      setRecent((current) => {
        const next = [id, ...current.filter((value) => value !== id)].slice(
          0,
          3,
        );
        persist("konjac.recent.v1", next);
        return next;
      });
    },
    [persist],
  );
  const toggleWatch = (id: string) => {
    if (!validWatchIds.has(id)) return;
    setWatchlist((current) => {
      const next = current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id];
      persist("konjac.watchlist.v1", next);
      return next;
    });
  };
  return { recent, watchlist, visit, toggleWatch, storageWarning };
}

export type ResearchState = ReturnType<typeof useResearch>;
