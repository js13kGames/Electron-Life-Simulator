import { FontInfo } from './mo5font.js'

function TextScreen( width, height ){
    const data = new Uint8Array( width * height )
    function print(x,y,string){
        let off = x + y * width
        for ( let i = 0 ; i < string.length ; i++ ){
            data[  off + i  ] = string.charCodeAt( i )
            if ( ( off + i ) >= data.length ){
                // console.error('out of bounds',x,y,string,i)
            }
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
    return { canvas : dstCanvas, ctx : dstContext, imageData : dstData }
}

function loadImageToCanvas( src, f ){
    let fontImage = new Image( ),
        fontImageData = undefined
    fontImage.onload = function() {        
        const fontCanvas = document.createElement('canvas');
        fontCanvas.width = fontImage.width
        fontCanvas.height = fontImage.height
        const fontCtx = fontCanvas.getContext('2d');        
        fontCtx.drawImage( fontImage, 0, 0 );
        /*fontImageData = fontCtx.getImageData(
            0,0,fontCanvas.width,fontCanvas.height
        )*/
        f( fontCanvas, fontCtx/*, fontImageData */ )
    }
    fontImage.src = src;
}

function Font( fontInfo, scale ){
    let fontImageData = undefined
    loadImageToCanvas( fontInfo.src, (canvas,ctx) => {
        if ( scale === 1 ){
            fontImageData = ctx.getImageData( 0,0,canvas.width,canvas.height )
        } else {
            const zoomed = zoomContext(ctx,scale)
            document.body.appendChild( zoomed.canvas )
            
            //fontImageData = zoomed.imageData
            fontImageData = zoomed.ctx.getImageData( 0,0,zoomed.canvas.width,zoomed.canvas.height )
        }
    })
    return {
        getImageData : () => fontImageData,
        fontInfo : {
            dim : fontInfo.dim * scale,
            table : fontInfo.table,
            codeIndex : fontInfo.codeIndex.map( ci => ({
                ...ci,
                x : ci.x*scale,
                y : ci.y*scale
            }))
        }
    }
}
const font = Font( FontInfo, 4 )
console.log('font',font)

export function TextMode( canvas ){
    const dim = font.fontInfo.dim,
          width = Math.floor(canvas.width / dim / 2) , 
          height = Math.floor(canvas.height / dim / 2) ,
          textScreen = TextScreen( width, height )

    //textScreen.print(0,0,font.fontInfo.table.join(''))
    function draw(ctx){
        //textScreen.cls()
        textScreen.print(0,0,''+Math.random())

        //textScreen.print(0,1,'TEXTs'+':'+Math.random())
        textScreen.print(width-1,height-1,'*')
        textScreen.print(width-2,height-1,'*')
        textScreen.print(width-1,height-2,'*')

        
        textScreen.print(0,0,'A')
        // clear
        ctx.fillStyle = 'rgba(0,255,0,1)'        
        ctx.fillRect(0,0,width*dim,height*dim)
        //textScreen.print(0,0,'abc')
        
        // write each char
        const data = textScreen.data
        for ( let i = 0 ; i < width ; i++ ){
            for ( let j = 0 ; j < height ; j++ ){
                const c = data[ i + j * width ],
                      x = dim * i,
                      y = dim * j,
                      tp = font.fontInfo.codeIndex[ c ],
                      fontImageData  = font.getImageData()
                if ( fontImageData && tp ){
                    ctx.putImageData(
                        fontImageData,
                        //0,0)/*
                              Math.floor(x-tp.x),
                              Math.floor(y-tp.y),
                              tp.x,
                              tp.y,
                        dim,dim)
                
                } else {
                    ctx.fillStyle = 'rgba(255,255,0,1)'
                    ctx.fillRect(x+1,y+1,dim-2,dim -2)
                }
                
            }
        }
    }
    return { draw, textScreen }    
}
