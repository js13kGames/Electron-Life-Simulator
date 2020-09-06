/*export const Cols = {
    'O' : [1,    0.5,  0],       // origin (tunnel entry)
    'G' : [0.05, 1.0,  0.05], // good!  (tunnel exit)
    '*' : [0.5,  0.5,  0.5],   // obstacle
    'M' : [0.0,  0.0,  0.0],   // main      (path)
    'S' : [0.2,  0.0,  0.0],   // secondary (path)
    'B' : [0.25, 0.25, 0.25],// boudaries (of paths)
}
*/
const base = [
    ['O',[15/16, 0.6, 0.5]],
    ['G',[1/16, 0.6, 0.5]],
    ['*',[2/6, 0.4, 0.25]],
    ['M',[6/16, 0.5, 0.5]],
    ['S',[10/6, 0.5, 0.5]],
    ['B',[7/6, 0.5, 0.5]],
]
export function Cols( fond=0, sat=0.5, target = {} ){
    base.forEach( ([c,hsl]) => {
        const [h,s,l] = hsl
        target[c] = [ (h+fond)%1, 0.5*s*sat, l ]
    })
    return target
}
