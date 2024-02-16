
export type Color = "normal" | "primary" | "danger" | "dark" | "success" | "light" | "light-x" | "dark" | "dark-x" | "black";
export type Size = "normal" | "big" | "big-x";
export type MarginType = "left" | "right" | "both";

export const getColor = ( variant : string ) => {
    switch ( variant ) {
        case 'normal': return '#666';
        case 'primary': return '#06C';
        case 'danger': return '#F00';
        case 'success': return '#3A3';
        case 'dark': return '#666';
        case 'dark-x': return '#333';
        case 'black': return '#000';
        case 'light': return '#DDD';
        case 'light-x': return '#EEE';
        default: return undefined;
    }    
};

export const getFontSize = ( size : string ) => {
    switch ( size ) {
        case 'normal': return 12;
        case 'big': return 18;
        case 'big-x': return 24;
        default: return undefined;
    }
}