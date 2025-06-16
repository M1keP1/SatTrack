export type TleEntry = {
  name: string;
  line1: string;
  line2: string;
};

export function parseTleText(raw: string): TleEntry[] {
  const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const entries: TleEntry[] = [];

  for (let i = 0; i < lines.length; i++) {
    const name = lines[i];
    const line1 = lines[i + 1];
    const line2 = lines[i + 2];

    if (line1?.startsWith("1 ") && line2?.startsWith("2 ")) {
      entries.push({ name, line1, line2 });
      i += 2; 
    } else {
      console.warn(`Skipping malformed TLE at line ${i}:`, name, line1, line2);
    }
  }

  //console.log("Final parsed TLE entries:", entries);
  return entries;
}
