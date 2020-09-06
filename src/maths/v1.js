export function lerp(a,b,p){ return ( 1 - p ) * a + p * b }
export function clamp(x,min,max){ return Math.max(min,Math.min(x,max)) }
