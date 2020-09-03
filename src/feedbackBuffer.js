export function FeedbackBuffer( context ){
    const canvas = context.canvas
    const secondCanvas = document.createElement('canvas')
    secondCanvas.width =  canvas.width 
    secondCanvas.height = canvas.height
    
    const secondContext = secondCanvas.getContext('2d')
    //    document.body.appendChild( secondCanvas )

    function pixelFilter1(srcData,dstData,i){
        dstData[ i ] = srcData[ i ]
        dstData[ i + 1 ] = srcData[ i + 1]  / 2
        dstData[ i + 2 ] = srcData[ i + 1]
        if ( Math.random() > 0.8 ){
            dstData[ i + 3 ] = Math.max(0,srcData[ i + 1] - 1)
        } else {
            dstData[ i + 3 ] = srcData[ i + 1]
        }
    }
    function pixelFilter2(srcData,dstData,i){
        dstData[ i ] = srcData[ i + 1 ]
        dstData[ i + 1 ] = Math.floor(srcData[ i + 2]  + 10,255)
        dstData[ i + 2 ] = srcData[ i + 3]
        dstData[ i + 3 ] = Math.max(0,srcData[ i + 0] - 10)
    }
    function pixelFilter3(sub=40,mul=0.9){
        return function(srcData,dstData,i){
            dstData[ i ] = srcData[ i + 0 ]
            dstData[ i + 1 ] = srcData[ i + 1 ]
            dstData[ i + 2 ] = srcData[ i + 2 ]
            dstData[ i + 3 ] = Math.max(0,srcData[ i + 3 ]*mul - sub )
        }
    }
    function pixelFilter4(srcData,dstData,i){
        const sub = 20
        dstData[ i ] = srcData[ i + 1 ]
        dstData[ i + 1 ] = srcData[ i + 2 ]
        dstData[ i + 2 ] = srcData[ i + 4 ]
        dstData[ i + 3 ] = Math.max(0,srcData[ i + 3 ] - sub )
    }
    function paste1(){
        const xoff = Math.cos( Date.now() / 100 ) * 6
        const yoff = Math.sin( Date.now() / 100 ) * 6
        if ( used ){
            context.drawImage(secondCanvas,xoff,yoff)                
        }
    }        
    function paste2(){
        if ( used ){
            context.drawImage(secondCanvas,0,0)
        }
    }        
    function paste3(){
        const xoff = -1
        if ( used ){
            context.drawImage(secondCanvas,xoff,0)                
        }
    }        
    let modeName = 'none'
    const modes = {
        'none' : [ pixelFilter3(0,0), paste2 ],
        'broadway' : [ pixelFilter1, paste1 ],
        'blue-blur' : [ pixelFilter2, paste2 ],
        'color-blur' : [ pixelFilter3(40,1), paste2 ],
        'left-grey' : [ pixelFilter4, paste3 ],
    }
    function getPixelFilter( n ){ return modes[ n ][ 0 ] }
    function getPaste( n ){ return modes[ n ][ 1 ]  }
    let ii = 0
    function setMode( n ){
        if ( n === undefined ){
            const ks = Object.keys( modes )
            modeName = ks[ (ii++)% ks.length ]
        } else {
            modeName = n
        }
        return modeName
        //modeName = 'none'
    }
    let used = false
    function copy(){
        const pixelFilter = getPixelFilter( modeName ),
              src = context.getImageData(0,0,canvas.width,canvas.height),
              dst = secondContext.getImageData(0,0,canvas.width,canvas.height),
              srcData = src.data,
              dstData = dst.data
        for ( let i = 0 ; i < srcData.length ; i+= 4 ){
            pixelFilter(srcData,dstData,i)
        }
        secondContext.putImageData( dst,0,0)
        used = true
    }
    function paste(){
        if ( used ){
            const paste = getPaste( modeName )
            paste()
        }
    }
    function reset(){
        used = false
    }
    return { copy, paste, reset, setMode, getMode : () => modeName }
}
