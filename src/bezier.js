import { V2 } from './v2.js'
export function BezierCurve( p1, p2, p3, p4 ){
    function at(t,v=V2()){
        const t2 = t * t,
              t3 = t2 * t,
              ot = 1 - t,
              ot2 = ot * ot,
              ot3 = ot2 * ot
        v.x = ot3 * p1.x +  3 * ot2 * t * p2.x +  3 * ot * t2 * p3.x +  t3 * p4.x,
        v.y = ot3 * p1.y +  3 * ot2 * t * p2.y +  3 * ot * t2 * p3.y +  t3 * p4.y
        return v
    }
    function getPoints( count ){
        const points = new Array( count )
        for ( let i = 0 ; i < count ; i++ ){
            points[i] =  at( i / ( count - 1 ) )
        }
        return points
    }
    return { at, getPoints }
}

const bezier = BezierCurve(V2(0,0),V2(0.3,0),V2(0.6,0),V2(-1,10))
                 
console.log('bze', bezier.getPoints( 10 ) )

