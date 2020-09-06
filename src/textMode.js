import { fontInfo } from './mo5font.js'
import { scaleContext, loadImageToCanvas } from './canvasUtils.js'



function Font( fontInfo, scale ){
    let fontImageData = undefined
    loadImageToCanvas( fontInfo.src, (canvas,ctx) => {
        if ( scale === 1 ){
            fontImageData = ctx.getImageData(
                0,0,canvas.width,canvas.height
            )
        } else {
            const zoomed = scaleContext(ctx,scale)
            fontImageData = zoomed.ctx.getImageData(
                0,0,zoomed.canvas.width,zoomed.canvas.height
            )
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

export function TextScreen( width, height ){
    const data = new Uint8Array( width * height )
    function print(x,y,string,prog=false){
        prog = false
        let off = x + y * width
        for ( let i = 0 ; i < string.length ; i++ ){
            const code = string.charCodeAt( i )
            if ( prog ){
                const d = code - data[  off + i  ]
                if ( Math.abs( d ) > 128 ){
                    data[  off + i  ] += 32
                } else if ( d > 0 ){
                    data[  off + i  ]++ 
                } else if ( d < 0 ){
                    data[  off + i  ]--
                }

            } else {
                data[  off + i  ] = code
            }
            if ( ( off + i ) >= data.length ){
                // console.error('out of bounds',x,y,string,i)
            }
        }
    }
    function printCenter(y,string,prog){
        prog = false
        const lmargin = Math.max(
            0,Math.floor((width-string.length)/2)
        )
        print(lmargin,y,string,prog)
                                 
    }
    function cls(prog){
        prog = false
        if ( prog ){
            for ( let i = 0 ; i < data.length ; i++ )
                if ( data[ i ] > 0 ){
                    data[ i ]--
                }
        } else {
            for ( let i = 0 ; i < data.length ; i++ )
                data[ i ] = 0
        }
    }
    return { data, print, printCenter, cls, width, height }
}

export const font1 = Font( fontInfo, 1 )
export const font2 = Font( fontInfo, 2 )
export const font4 = Font( fontInfo, 4 )

export function TextMode( textScreen, font ){
    const { fontInfo } = font,
          { dim, codeIndex } = fontInfo,
          { width, height } = textScreen
    
    const canvas = document.createElement('canvas')
    canvas.width = textScreen.width * dim
    canvas.height = textScreen.height * dim
    const ctx = canvas.getContext('2d')
    //document.body.appendChild( canvas )
    

    function draw(){
        const fontImageData  = font.getImageData()
        
        //textScreen.cls()
        //textScreen.print(0,0,''+Math.random())
        textScreen.print(0,0,'*')
        textScreen.print(0,1,'*')
        textScreen.print(1,0,'*')
        
        textScreen.print(width-1,height-1,'*')
        textScreen.print(width-2,height-1,'*')
        textScreen.print(width-1,height-2,'*')

        // clear
        ctx.clearRect(0,0,width*dim,height*dim)
        /*ctx.fillStyle = 'rgba(0,0,0,0)'
          ctx.fillRect(0,0,width*dim,height*dim)*/
        
        // write each char
        const data = textScreen.data
        for ( let i = 0 ; i < width ; i++ ){
            for ( let j = 0 ; j < height ; j++ ){
                const c = data[ i + j * width ],
                      x = dim * i,
                      y = dim * j,
                      tp = codeIndex[ c ]
                if ( fontImageData && tp ){
                    ctx.putImageData(
                        fontImageData,
                        Math.floor(x-tp.x),
                        Math.floor(y-tp.y),
                        tp.x,
                        tp.y,
                        dim,dim)
                } else {
                    ctx.fillStyle = 'rgba(0,0,0,0)'
                    ctx.fillRect(x+1,y+1,dim-2,dim -2)
                }
                
            }
        }
    }
    return { draw, textScreen, canvas }    
}
