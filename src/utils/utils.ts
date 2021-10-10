export const mapToRange = (
    currentValue: number,
    originalMin: number,
    newMin: number,
    originalMax: number,
    newMax: number,
) =>
    ((currentValue - originalMin) * (newMax - originalMax)) /
        (newMin - originalMin) +
    originalMax;
