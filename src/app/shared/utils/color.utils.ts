// Convertit une couleur hexadécimale en RGBA avec une transparence
export function hexWithAlpha(hex: string, alpha: number): string {
  const match = hex.trim().match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return hex;

  const r = parseInt(match[1], 16);
  const g = parseInt(match[2], 16);
  const b = parseInt(match[3], 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
