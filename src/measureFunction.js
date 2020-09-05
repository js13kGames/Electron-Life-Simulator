export function time(f){
    const s = Date.now()
    f()
    return ( Date.now() - s ) 
}
