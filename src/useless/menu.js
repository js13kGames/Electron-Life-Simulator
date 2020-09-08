const menus = {
    pause : ['paused','x:continue','to:menu'],
    menu : ['tosound','to:gfx'],
    gfx : ['bool:canvas fx'],
}

function TextScreen( width, height ){
    const textData = new Uint8Array( width * height ).fill(64)
    function print(x,y,string){
        let off = x + y * width
        for ( let i = 0 ; i < string.length ; i++ ){
            textData[ off + i ] = string.charCodeAt( i )
        }
    }    
    print(width-2,height-1,'1')
    return { textData, print, width, height }
}
function dbgPrint( textScreen )    {
    let dscreen = []
    dscreen.push("--- sof\n")
    textScreen.textData.forEach( (d,i) => {
        if ( d === 64 ){
            dscreen.push( ' ' )
        } else {
            dscreen.push( [ String.fromCodePoint( d ) ])
        }
        if ( (i + 1) % (width) === 0 ){
            dscreen.push( "| eol \n" )
        }
    })
    dscreen.push("--- eof")
    console.log(dscreen.join(''))
}
const width = 20,
      height = 10,
      textScreen = TextScreen( width, height )

function Menu( name, selected = 0 ){
    const [title,...es] = menus[ name ]
    let j = 1

    // title
    const cl = Math.floor( ( width - title.length ) / 2 )
    textScreen.print(cl,j,title)
    j+=2

    // entries
    const marks = []
    es.forEach( e => {
        const [type,text] = e.split(':'),
              selPos = [2,j],
              textPos = [4,j]
        marks.push({selPos,textPos,type,text})
        textScreen.print(...textPos,text)
        j++
    })
    setSelected( selected )

    function setSelected( n ){
        selected = n
        marks.forEach( (m,i) => textScreen.print( ...m.selPos, ( selected === i )?'*':' ') )
        marks[n]
    }
    function tab( dir = 1 ){
        setSelected( ( es.length + selected + dir  ) % es.length )
    }
    function action(){
        
    }
    return { tab }
}
const menu = Menu('pause')
menu.tab()
dbgPrint(textScreen)

function fold( source, target, count = 5){
    const sd = source.textData,
          td = target.textData
    
    let noff = 0
    function firstNonSpace( start ){
        for ( let i = start ; i < sd.length ; i++ )
            if ( sd[ i ] !== 64 )
                return i
        return -1
    }    
    for ( let i = 0 ; i < td.length ; i++ ){
        //td[i]=65
    }
    let si = 0,
        ti = 0
    while ( si < sd.length ){
        
        const nsi = firstNonSpace(0)
        for ( k = 0 ; k < nsi ; k++ ){
            console.log('ti',ti,'<-','si',si)
            td[ti] = sd[si]
            si++
            if ( k > count ){
                ti++
            }
        }
        console.log('ti',ti,'<-','si',si)
        td[ti++] = sd[si++]
    }
    while ( ti < td.length ){
        console.log('ti',ti,'<-','64')
        td[ti++] = 64
    }
        
    /*
    for ( let i = 0 ; i < td.length ; i++ ){
        
    }
*/    

    
}
const bfs = [
    TextScreen( width, height ),
    TextScreen( width, height ),
]
//fold( textScreen, bfs[0] )
    
for( let i = 5 ; i < 5 ; i++ ){
    console.log('=',i)
    fold( textScreen, bfs[0], i )
    //bfs.push( bfs[0] )
    //bfs.shift()
    dbgPrint(bfs[0])
}
