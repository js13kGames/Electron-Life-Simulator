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
    return { data, print, cls, width, height }
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

import { FontInfo } from './mo5font.js'

//FontInfo.src = 


function Font( fontInfo ){
     // const $img = document.getElementById("mo5font")
    
    let fontImage = new Image( ),
        fontImageData = undefined
    
    fontImage.onload = function() {        
        var fontCanvas = document.createElement('canvas');
        fontCanvas.width = fontImage.width
        fontCanvas.height = fontImage.height
        var fontCtx = fontCanvas.getContext('2d');
        fontCtx.drawImage( fontImage, 0, 0 );

        // console.log(0,0,fontCtx.width,fontCtx.height)
        
        fontImageData = fontCtx.getImageData(
            0,0,fontCanvas.width,fontCanvas.height
        )
        //compress2(fontCtx)
        const zoomed = zoomContext(fontCtx,4)
        zoomed.canvas.setAttribute('name',"bbbbbbbbb")
        
    }
    fontImage.src = fontInfo.src;

    /*
    const fontDim = fontInfo.dim
    const fontTable = fontInfo.table
    const codeIndex = fontInfo.codeIndex
    */
    // console.log(fontTable,'codeIndex',codeIndex)
    return {
        getImageData : () => fontImageData,
        //fontDim, codeIndex, fontTable,
        fontInfo,
    }
}
const font = Font( FontInfo )


export function TextMode( canvas ){
    const dim = font.fontInfo.dim,
          width = Math.floor(canvas.width / dim) / 2, 
          height = Math.floor(canvas.height / dim) / 2,
          textScreen = TextScreen( width, height )

    textScreen.print(0,0,font.fontInfo.table.join(''))
    function draw(ctx){
        //textScreen.print(0,0,''+Math.random())
        //textScreen.cls()
        textScreen.print(8,8,'TEXTs'+':'+Math.random())
        textScreen.print(width-1,height-1,'*')
        textScreen.print(width-2,height-1,'*')
        textScreen.print(width-1,height-2,'*')
        
        // clear
        ctx.fillStyle = 'rgba(0,255,0,0)'        
        ctx.fillRect(0,0,width,height)

        // write each char
        const data = textScreen.data
        for ( let i = 0 ; i < width ; i++ ){
            for ( let j = 0 ; j < height ; j++ ){
                const c = data[ i + j * width ],
                      x = dim * i,
                      y = dim * j,
                      tp = font.fontInfo.codeIndex[ c ],
                      fontImageData  = font.getImageData()
                //ctx.fillStyle = 'rgba(0,255,0,0.5)'
                //ctx.fillRect(x+1,y+1,dim-2,dim -2)
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
