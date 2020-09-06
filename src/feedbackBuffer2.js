import { lerp } from './maths/v1.js'
export function FeedbackBuffer(  ){
    let lastImgData
    //function lerp(x,y,a){ return (1-a)*x+a*y }
    const o = { a : 1 }
    function alter( context, a = o.a ){
        const { width, height } = context.canvas,
              dst = context.getImageData(0,0,width,height)
        /*// const a = 0.05  /// very blurry
        // b = 0.1
        //const a = 0.5
        const a = 0.05*/
        if ( lastImgData ){
            const srcData = lastImgData.data,
                  dstData = dst.data
            for ( let i = 0 ; i < srcData.length ; i+= 4 ){
                dstData[ i ] = lerp(srcData[ i ], dstData[ i ], a )
                dstData[ i+1 ] = lerp(srcData[ i + 1 ], dstData[ i + 1 ], a )
                dstData[ i+2 ] = lerp(srcData[ i + 2], dstData[ i + 2 ], a )
                dstData[ i+3 ] = srcData[ i+3 ]
            }
            context.putImageData( dst,0,0)
        }
        lastImgData = dst
    }
        
    function reset(){
        used = false
    }
    return { alter, o }
}
