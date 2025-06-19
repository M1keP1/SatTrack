// hooks/useGroundStationSearch.ts
export function useGroundStationSearch() {
  const setLocation = (query: string) => {
    console.log("📍 Ground station set to:", query);
  };

  return { setLocation };
}
