export async function getTLEByNorad(noradId: string) {
  try {
    const res = await fetch(
      `https://celestrak.org/NORAD/elements/gp.php?CATNR=${noradId}&FORMAT=TLE`
    );
    const text = await res.text();
    const lines = text.trim().split("\n").map(line => line.trim());

    if (lines.length >= 3) {
      return {
        name: lines[0],     // Line 0 is the satellite name
        line1: lines[1],
        line2: lines[2],
      };
    }

    if (lines.length === 2) {
      return {
        name: `SAT-${noradId}`,
        line1: lines[0],
        line2: lines[1],
      };
    }

    return null;
  } catch (err) {
    console.error("Failed to fetch TLE:", err);
    return null;
  }
}
