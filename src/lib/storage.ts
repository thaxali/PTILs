const STORAGE_KEY = "ptils-saved";

export function getSavedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isSaved(id: string): boolean {
  return getSavedIds().includes(id);
}

export function toggleSave(id: string): boolean {
  const ids = getSavedIds();
  const index = ids.indexOf(id);
  if (index === -1) {
    ids.push(id);
  } else {
    ids.splice(index, 1);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  return index === -1; // returns true if now saved
}
