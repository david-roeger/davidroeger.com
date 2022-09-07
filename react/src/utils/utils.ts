
export const PI = Math.PI;
export const HALF_PI = Math.PI / 2;
export const QUARTER_PI = Math.PI / 4;
export const TWO_PI = Math.PI * 2;

/**
 * Map Value between to range
 * @param value current Value
 * @param x1 current Min Value
 * @param y1 current Max Value
 * @param x2 new Min Value
 * @param y2 new Max Value
 * @returns number
 */
export const mapToRange = (
    value: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
) => ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

/**
 * Adjust Value to Sin Curve so that results are more densed
 * @param value current Value
 * @param min current Min Value
 * @param max current Max Value
 * @returns nuber
 */
export const adjustScale = (value: number, min: number, max: number) => {
    const nullMin = 0;
    const nullMax = max - min;
    const nullValue = value - min;
    const mean = nullMax / 2;

    const radiant = mapToRange(nullValue, nullMin, nullMax, 0, PI);
    const computed =
        nullValue > mean ? 2 - Math.sin(radiant) : Math.sin(radiant);
    const mapped = mapToRange(computed, 0, 2, nullMin, nullMax);

    return min + mapped;
};

export const cloneObject = (obj: {[key: string]: any}) => {
    return JSON.parse(JSON.stringify(obj));
};

export const debounce = (func: { (): any }, ms: number) => {
    let timer: NodeJS.Timeout;
    return () => {
        clearTimeout(timer);
        timer = setTimeout(func, ms);
    };
};
