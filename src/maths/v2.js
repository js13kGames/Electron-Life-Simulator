export function V2(x,y){ return {x,y} }
export function cloneV2({x,y}){ return V2(x,y) }
export function copyV2(v,t){
    t.x = v.x
    t.y = v.y
    return t
}
export function subV2(v1,v2,t=V2()){
    t.x = v1.x - v2.x
    t.y = v1.y - v2.y
    return t
}
export function addV2(v1,v2,t=V2()){
    t.x = v1.x + v2.x
    t.y = v1.y + v2.y
    return t
}
export function divScalar(v1,a,t=V2()){
    t.x = v1.x / a
    t.y = v1.y / a
    return t
}
export function multScalar(v1,a,t=V2()){
    t.x = v1.x * a
    t.y = v1.y * a
    return t
}
export function lerpV2(v1,v2,a,t=V2()){
    t.x = (1-a) * v1.x + a * v2.x
    t.y = (1-a) * v1.y + a * v2.y
}
/*
function clamp(x,min,max){
    return Math.max( min, Math.min( x, max ) )
}
export function clampV2(v,min,max,t=V2()){
    t.x = clamp( v.x, min.x, max.x )
    t.y = clamp( v.y, min.y, max.y )
    return t
}
export function floorV2(v,t=V2()){
    t.x = Math.floor( v.x )
    t.y = Math.floor( v.y )
    return t
}
export function ceilV2(v,t=V2()){
    t.x = Math.ceil( v.x )
    t.y = Math.ceil( v.y )
    return t
}
*/
