"use strict";
function TextScreen( width, height ){
    const data = new Uint8Array( width * height )
    function print(x,y,string){
        let off = x + y * width
        for ( let i = 0 ; i < string.length ; i++ ){
            data[ off + i ] = string.charCodeAt( i )
        }
    }
    function cls(){
        for ( let i = 0 ; i < data.length ; i++ )
            data[ i ] = 0
    }
    return { data, print, width, height }
}
function zoomContext( srcContext, zoom ){
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
    
    //document.body.innerHTML = ''
    //document.body.appendChild( srcCanvas )
    document.body.appendChild( dstCanvas )

    return { canvas : dstCanvas, imageData : dstData }
}
function compress2( srcContext ){
    const srcCanvas = srcContext.canvas,
          srcData = srcContext.getImageData(0,0,srcCanvas.width,srcCanvas.height).data
    const bin = new Uint8Array( srcData.length / 4 / 8 )
    for ( let i = 0 ; i < srcData.length ; i+=4 ){
        const x = (srcData[ i ] !== 0)?1:0,
              ii = Math.floor( i / 4 ),
              nbyte = Math.floor( ii / 8  ),
              nbit = ii % 8
        bin[ nbyte ] = bin[ nbyte ] | ( x << nbit )
    }
    console.log('rebin!!!!!!!!!!')
    let grps = [0],
        prev = 0
    for ( let i = 0 ; i < srcData.length ; i+=4 ){
        if ( srcData[ i ] === prev ){
            grps[ grps.length - 1 ]++
        } else {
            grps[ grps.length ] = 1
        }
        prev = srcData[ i ]
    }
    console.log('OOOOOOOO',grps)
}
function Font(){

    let fontImage = new Image( ),
        fontImageData = undefined
    
    fontImage.onload = function() {        
        var fontCanvas = document.createElement('canvas');
        fontCanvas.width = fontImage.width
        fontCanvas.height = fontImage.height
        var fontCtx = fontCanvas.getContext('2d');
        fontCtx.drawImage( fontImage, 0, 0 );
        console.log(0,0,fontCtx.width,fontCtx.height)
        fontImageData = fontCtx.getImageData(0,0,fontCanvas.width,fontCanvas.height)
        //compress2(fontCtx)
        //const zoomed = zoomContext(fontCtx,2)
        
    }
    fontImage.src = '../mo5font-fix-ext.png';

   
    const fontDim = 8
    const fontTable = [
        'ABCDEFGHIJKLMNOPQR',
        'STUVWXYZabcdefghij',
        'klmnopqrstuvwxyz',
        '0123456789',
        '.,"\'?!@_*#$%&()+-/',
        ':;(=)[\\]{|}~~~~~~~',
    ].map( x => x.padEnd( 18,' ') ).join('').split('')
    const codeIndex = []
    fontTable.forEach( (c,idx) => {
        const code = c.charCodeAt(0),
              i = idx % 18,
              j = Math.floor( idx / 18 ),
              x = i * fontDim,
              y = j * fontDim
        if ( code < 128 ){
            codeIndex[ code ] = { idx, i, j, x, y}
        }
        
    })    
    console.log(fontTable,'codeIndex',codeIndex)
    return { getImageData : () => fontImageData, fontDim, codeIndex, fontTable }
}
const font = Font()

export function TextMode( canvas ){
    const dim = font.fontDim,
          width = 18,//Math.floor(canvas.width / dim) / 2, 
          height = Math.floor(canvas.height / dim) / 2,
          textScreen = TextScreen( width, height )

    textScreen.print(0,0,font.fontTable.join('')/*'MONSIEUR'*/)
    //textScreen.print(12,(p++),'.,"\'?!@_*#$%&()+-/')
    
    function draw(ctx){
        // textScreen.cls()
        // textScreen.print(14,15,'TEXTs'+':'+Math.random())
        const data = textScreen.data
        for ( let i = 0 ; i < width ; i++ ){
            for ( let j = 0 ; j < height ; j++ ){
                const c = data[ i + j * width ],
                      x = dim * i,
                      y = dim * j,
                      tp = font.codeIndex[ c ],
                      fontImageData  = font.getImageData()
                //if ( ( fontImageData === undefined ) || ( tp === undefined ) ){
                ctx.fillStyle = 'rgba(100,100,100,1)'
                ctx.fillRect(x+1,y+1,dim-2,dim -2)
                //}
                if ( fontImageData && tp ){
                    ctx.putImageData(
                        fontImageData,
                        Math.floor(x-tp.x),
                        Math.floor(y-tp.y), tp.x,tp.y,dim,dim
                    )
                }
                
            }
        }
    }
    return { draw, textScreen }    
}
