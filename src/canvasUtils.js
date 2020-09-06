export function scaleContext( srcContext, zoom ){
    const srcCanvas = srcContext.canvas,
          srcData = srcContext.getImageData(0,0,srcCanvas.width,srcCanvas.height).data
    const dstCanvas = document.createElement('canvas')
    dstCanvas.width = srcCanvas.width * zoom
    dstCanvas.height = srcCanvas.height * zoom
    const dstContext = dstCanvas.getContext('2d'),
          dstIData = dstContext.getImageData(0,0, dstCanvas.width, dstCanvas.height  ),
          dstData = dstIData.data
    for ( let dIdx = 0 ; dIdx < dstData.length ; dIdx++ ){
        const dpIdx = Math.floor( dIdx / 4 ),
              c = dIdx % 4,
              di = dpIdx % dstCanvas.width,
              dj = Math.floor( dpIdx / dstCanvas.width ),
              si = Math.floor( di / zoom ),
              sj = Math.floor( dj / zoom ),
              sIdx = 4 * ( si + sj * srcCanvas.width ) + c
        dstData[ dIdx ] = srcData[ sIdx ]
    }
    dstContext.putImageData(dstIData,0,0)
    return { canvas : dstCanvas, ctx : dstContext, imageData : dstData }
}
export function loadImageToCanvas( src, f ){
    let fontImage = new Image( ),
        fontImageData = undefined
    fontImage.onload = function() {        
        const fontCanvas = document.createElement('canvas');
        fontCanvas.width = fontImage.width
        fontCanvas.height = fontImage.height
        const fontCtx = fontCanvas.getContext('2d');        
        fontCtx.drawImage( fontImage, 0, 0 );
        f( fontCanvas, fontCtx )
    }
    fontImage.src = src;
}
