export const extractTranslate = (value: string) => {
  if (!value) return null;

  const match = value.match(/translate\(\s*([+-]?\d*\.?\d+)px\s*,\s*([+-]?\d*\.?\d+)px\s*\)/);

  return match ? { x: parseFloat(match[1]), y: parseFloat(match[2]) } : null;
};
