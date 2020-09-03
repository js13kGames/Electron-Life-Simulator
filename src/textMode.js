"use strict";
function TextScreen( width, height ){
    const data = new Uint8Array( width * height ).fill(64)
    function print(x,y,string){
        let off = x + y * width
        for ( let i = 0 ; i < string.length ; i++ ){
            data[ off + i ] = string.charCodeAt( i )
        }
    }    
    print(width-2,height-1,'A')
    return { data, print, width, height }
}
function Font(){
    let fontImage = new Image( ),
        fontImageData = undefined
    fontImage.onload = function() {
        
        var fontCanvas = document.createElement('canvas');
        fontCanvas.width = fontImage.width
        fontCanvas.height = fontImage.height
        var fontCtx    = fontCanvas.getContext('2d');
        fontCtx.drawImage( fontImage, 0, 0 );
        console.log(0,0,fontCtx.width,fontCtx.height)
        fontImageData = fontCtx.getImageData(0,0,fontCanvas.width,fontCanvas.height)
    }
    fontImage.src = '../mo5font.png';
    
    const fontDim = 8
    const fontTable = 'ABCDEFGHIJKLMNOPQR'.split('')
    const codeIndex = []
    fontTable.forEach( (c,idx) => {
        const code = c.charCodeAt(0),
              i = idx % 18,
              j = Math.floor( idx / 18 ),
              x = i * fontDim,
              y = j * fontDim
        codeIndex[ code ] = { idx, i, j, x, y}
        
    })    
    console.log(fontTable,'codeIndex',codeIndex)
    return { getImageData : () => fontImageData, fontDim, codeIndex }
}
const font = Font()

export function TextMode( canvas ){
    const dim = font.fontDim,
          width = Math.floor(canvas.width / dim),
          height = Math.floor(canvas.height / dim),
          textScreen = TextScreen( width, height )

    let p = 0
    textScreen.print(p++,0,'FGHIJKLMNS')
    textScreen.print(p++,1,'FGHIJKLMNS')
    textScreen.print(p++,2,'FGHIJKLMNS')
    textScreen.print(p++,3,'ABC')
    
    
    textScreen.print(12,12,'MONSIEUR')
    textScreen.print(12,13,'TEXT')

    

    function draw(ctx){
        const data = textScreen.data
        for ( let i = 0 ; i < width ; i++ ){
            for ( let j = 0 ; j < height ; j++ ){
                const c = data[ i + j * width ],
                      x = dim * i,
                      y = dim * j,
                      tp = font.codeIndex[ c ],
                      fontImageData  = font.getImageData()
                if ( ( fontImageData === undefined ) || ( tp === undefined ) ){
                    ctx.fillStyle = 'rgba(100,200,100,1)'
                    ctx.fillRect(x,y,dim/2,dim/2)
                } else {
                    ctx.putImageData(
                        fontImageData,
                        x-tp.x, y-tp.y, tp.x,tp.y,dim,dim
                    )
                }
                
            }
        }
        
        console.log('yes!')
    }
    return { draw, textScreen }    
}
