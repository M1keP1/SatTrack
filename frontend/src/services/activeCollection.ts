

// helpers/activeCollection.ts
let currentTleFile = "/data/active_tles.txt"; // Default

export function setActiveTleFile(filePath: string) {
  currentTleFile = filePath;
  console.log("📁 Active TLE file set to:", filePath);
}

export function getActiveTleFile() {
  return currentTleFile;
}
