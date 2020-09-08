//const THREE = require('three')
import { BezierCurve } from './maths/bezier.js'
import { V2, cloneV2, subV2, addV2, multScalar, divScalar } from './maths/v2.js'
import { Missions } from './missions.js'

export function mkChoices( level, sublevel ){

    const ld = Missions[ level ].subs[ sublevel ].level
    //console.log('MKCJOICES','for',level,sublevel,ld)
    
    const [ p0,p1,p2,p3 ] = ld
    
    // options
    const width = p0,
          height = p1,    
          npossible = p2,
          mainBranchesCount = p3.length,
          path = p3,
          branchHeight = 4,
          hpad = 1,
          branchTop = height - branchHeight - hpad ,
          branchBottom = branchHeight + hpad

    // nmap
    const idx2i = idx => idx % width
    const idx2j = idx => Math.floor( idx / width )
    const outij = (i,j) => ( ( i < 0 ) || ( i >= width ) || ( j < 0 ) || ( j >= height ) )
    const ij2idx = (i,j) => {
        return i + j * width
        if (outij(i,j) ){
            throw new Error(`[${i},${j}]`)
        } else{
            return i + j * width
        }
        
    } 

    // choices
    const choices = new Array( mainBranchesCount + 3 ).fill(0).map( (_,i) => {
        //const npossible = 2 + Math.floor( Math.random() * 2 )
        //const good = Math.floor( Math.random() * npossible )
        const good = path[ Math.max(0,i-2) ]
        const x = i * width / ( mainBranchesCount + 2 )
        const ys = [
            [],
            [height/2],
            [height/3,2*height/3],
            [height/4,height/2,3*height/4],
        ][ npossible ].map( y => Math.floor(y) )        
        return { x,good,ys }
    })
    choices[1].ys = [ choices[2].ys[choices[2].good] ]
    choices[1].good = 0
    choices[0].ys = [ choices[1].ys[choices[1].good] ]
    choices[0].good = 0
    
    choices[choices.length-1].ys = [ choices[choices.length-2].ys[choices[choices.length-2].good] ]
    choices[choices.length-1].good = 0

    // map
    const map = new Array( width * height ).fill(0).map( (_,idx) => '*' )
    for ( let i = 0 ; i < ( choices.length - 1 ) ; i++ ){
        const c0 = choices[i],
              c1 = choices[i+1]
        const y0 = c0.ys[ c0.good ]
        c1.ys.forEach( (y1,y1i) => {
            const isgood = y1i === c1.good
            const r = (isgood)?1:0.8
            const pts = [ V2(c0.x,y0),
                          V2((c0.x+c1.x)/2,y0),
                          V2((c0.x+c1.x)/2,y1+0.01), 
                          V2((1-r)*c0.x+r*c1.x,y1) ]
            const npts = Math.ceil(c1.x - c0.x ) 
            const curve = BezierCurve( ...pts )
            const points = curve.getPoints(  npts )
            if ( i === 0 ){
                const mainPixels = paintPoints( points, 'O' )                
            } else if ( i === (choices.length - 2 )){
                const mainPixels = paintPoints( points, 'G' )
            } else {
                if ( isgood ){
                    const mainPixels = paintPoints( points, 'M' )                
                } else {
                    const mainPixels = paintPoints( points, 'S' )
                }
            }
        })
        
    }
    if ( false ){
        //const directions = 
        const $div = document.createElement('div')
        $div.textContent = choices.slice(2,choices.length-1)
            .map( ({good}) => good?'UP':'DOWN' ).join( ' - ' )
        $div.style = 'position:fixed;bottom:50px;'
        document.body.appendChild($div)
    }
    const directions = choices.slice(2,choices.length-1).map( ({good}) => good )

    
    function paintPoints( points, paint ){

        const mainPixels = []
        for ( let p = 1 ; p < points.length ; p++ ){
            const p0 = points[p-1],
                  p1 = points[p]
            const d = subV2( p1, p0 ),
                  ndivs = Math.ceil(Math.max( d.x, d.y )),
                  off = divScalar( d, ndivs )
            let ppos = cloneV2(p0)
            for ( let d = 0 ; d < ndivs ; d++ ){
                const i = Math.round( ppos.x ),
                      j = Math.round( ppos.y )
                mainPixels.push( ij2idx(i,j) )
                addV2( ppos, off, ppos )
            }
        }
        
        mainPixels.forEach( idx => {
            const i = idx2i(idx),
                  j = idx2j(idx)
            const b = Math.ceil( branchHeight / 2 )
            for ( let oj = -1*b ; oj <= b ; oj++ ){
                let oi = 0
                //for ( let oi = -1*b ; oi <= b ; oi++ )
                const isEnd = (paint==='G') && ( i > width - 5 )
                map[ ij2idx( i+oi,j+oj  ) ] = isEnd?'G':'B'
            }
        })
        
        
        mainPixels.forEach( idx => {
            map[ idx ] = paint
        })
        
        return mainPixels
    }


    //const mesh = mkLevelMesh( 'level',data)
    return {
        startPosition : {
            x: choices[0].x,
            y: choices[0].ys[0],
        },
        choices,
        width, height, idx2i, idx2j, ij2idx, outij,
        map,
        directions
    }
}
