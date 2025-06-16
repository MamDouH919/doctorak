export const slugify = (text: string) => text.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-\u0600-\u06FF]/g, "");
export const formatted = (amount: any) => amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

export function hexToRgb(hex: string) {
    // Remove the '#' symbol if it's present
    hex = hex.replace(/^#/, '');

    // Parse the hex color value to RGB components
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `${r}, ${g}, ${b}`;
}

// export function pushUrl(
//   navigate: NavigateFunction,
//   pathname: string,
//   state: object = {},
//   search: string = "",
//   hash: string = ""
// ) {
//   navigate({
//     pathname,
//     search,
//     hash,
//   }, {
//     state: {
//       prevUrl: `${window.location.pathname}${window.location.search}`,
//       ...state,
//     },
//   });
// }

