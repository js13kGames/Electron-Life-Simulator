const THREE = require('three')
import { Cols } from './cols.js'
import { BezierCurve } from './bezier.js'
import { V2, cloneV2, subV2, addV2, multScalar, divScalar } from './v2.js'
export function mkChoices(){
    const width = 100,
          height = 30
    
    const mainBranchesCount = 3,
          branchHeight = 2,
          hpad = 1,
          branchTop = height - branchHeight - hpad ,
          branchBottom = branchHeight + hpad
    
    const idx2i = idx => idx % width
    const idx2j = idx => Math.floor( idx / width )
    const outij = (i,j) => ( ( i < 0 )
                             || ( i >= width )
                             || ( j < 0 )
                             || ( j >= height ) )
    const ij2idx = (i,j) => {
        return i + j * width
        if (outij(i,j) ){
            return 0
            //throw new Error(`[${i},${j}]`)
            //22
            //return 0
        } else{
            return i + j * width
        }
        
    }
    const map = new Array( width * height ).fill(0).map( (_,idx) => '*' )
    const choices = new Array( mainBranchesCount + 3 ).fill(0).map( (_,i) => {
        //const npossible = 2 + Math.floor( Math.random() * 2 )
        let npossible = 2
        const good = Math.floor( Math.random() * npossible )
        const x = i * width / ( mainBranchesCount + 2 )
        const ys = [
            [],
            [height/2],
            [height/3,2*height/3],
            [height/4,height/2,3*height/4],
        ][ npossible ]
        return { x,good,ys }
    })
    choices[1].ys = [ choices[2].ys[choices[2].good] ]
    choices[1].good = 0
    choices[0].ys = [ choices[1].ys[choices[1].good] ]
    choices[0].good = 0
    
    choices[choices.length-1].ys = [ choices[choices.length-2].ys[choices[choices.length-2].good] ]
    choices[choices.length-1].good = 0
    
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
            /*
            var curve = new THREE.CubicBezierCurve( ...pts )
            const points = curve.getPoints( npts )
            */
            
            //                const pts2 = pts.map( v2 => [v2.x,v2.y] )
            const curve = BezierCurve( ...pts )
            const points = curve.getPoints(  npts )
            //console.log(npts,{model:points,test:points2})
            
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
    {
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
                map[ ij2idx( i+oi,j+oj  ) ] = 'B'
            }
        })
        
        
        mainPixels.forEach( idx => {
            map[ idx ] = paint
        })
        
        return mainPixels
    }

    // to format
    const data = []
    for ( let j = 0 ; j < height ; j++ ){
        const a = []
        for ( let i = 0 ; i < width ; i++ ){
            a.push( map[ ij2idx(i,j) ] )
        }
        data[j] = a.join('')
    }
    const mesh = mkLevelMesh( 'level',data)
    return { startPosition : {
        x: choices[0].x,
        y: choices[0].ys[0],
    },choices, data, width, height, idx2i, idx2j, ij2idx, outij, map, mesh, directions }
}

function ic( s ){ return s.codePointAt( 0 ) }
function ci( i ){ return String.fromCodePoint( i ) }
function mkLevelMesh( name, data ){
    
    const vertices = [],
          colors = []
    var geometry = new THREE.BufferGeometry();
    for ( let j = 0 ; j < data.length ; j++ ){
        const z = 0
        const line = data[ j ]
        for ( let i = 0 ; i < line.length ; i++ ){
            const v = line.codePointAt( i )
            function col(v){
                const c = ci(v)
                //                console.log('cols',cols,'v',v,'civ',ci(v))
                return Cols[ ci(v) ] 
            }
            vertices.push(
                i,j,z,
                i+1,j,z,
                i+1,j+1,z,                
                i,j,z,
                i+1,j+1,z,
                i,j+1,z,
            )
            colors.push(
                ...col(v),
                ...col(v),
                ...col(v),

                ...col(v),
                ...col(v),
                ...col(v),
            )
        }
    }
    geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( vertices ), 3 ) ); 
    geometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array( colors ), 3 ) );
    var material = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: true  } );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.name = name
    mesh.visible = false
    //scene.add( mesh )
    return mesh
}
