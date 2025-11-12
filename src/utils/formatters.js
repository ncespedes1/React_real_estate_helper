// Change percentage decimals to ##.## % format
export const percentFormatter = (value) => value != null ? `${(value * 100).toFixed(2)}%` : '';

// Change price to include $ as prefix
export const priceFormatter = (value) => value != null? `$${value.toLocaleString()}` : '';

// Capitalize each word before comma, uppercase after comma
export function formatCountyName(name) {
    const [beforeComma, afterComma] = name.split(',');
    const titleCase = beforeComma
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    return `${titleCase},${afterComma.toUpperCase()}`;
}