// cooridor debut / fin
const { OrbitControls } = require('three/examples/jsm/controls/OrbitControls.js')
const THREE = require('three')
const Stats = require('stats.js')
const tunnel = require('./tunnel.js')
//const sound = require('./sound2.js')
let STATE = 'S0'
const Cols = {
    '*' : [0.5,0.5,0.5],
    'M' : [0.0,0.0,0.0],
    'S' : [0.2,0.0,0.0],
    'B' : [0.25,0.25,0.25],
    'G' : [0.05,1.0,0.05], // good!
    'O' : [1,0.5,0], // origin
}

const keyMap = ['ArrowLeft','ArrowDown','ArrowRight','ArrowUp'] // wasd
const keyStrokes = []
function resetKeyStrokes(){
    keyStrokes.length = 0
}
const keyStrokesHandler = type => ({key,repeat,timeStamp})=> {
    if ( !repeat ){
        const idx = keyMap.findIndex(x=>x==key)
        if ( idx >= 0 ) keyStrokes.push([type,idx,timeStamp])
    }   
}
/*
  window.addEventListener('keydown', keyStrokesHandler(1))
  window.addEventListener('keyup', keyStrokesHandler(0))
*/

const axesKeyMap = [['ArrowLeft','ArrowRight'],['ArrowDown','ArrowUp'],['+','-']]
const axesCtrlState = [[0,0],[0,0],[0,0]]
const axesCtrlHandler = type => ({key}) => {
    axesKeyMap.forEach( (keys,axe) => {
        keys.forEach( (k,dir) => {
            if ( k === key )
                if ( type ){
                    axesCtrlState[ axe ][ dir ] = 1
                } else {
                    axesCtrlState[ axe ][ dir ] = 0
                }
        })
    })
    //    console.log( JSON.stringify(axesCtrlState ))
}
window.addEventListener('keydown', axesCtrlHandler(1))
window.addEventListener('keyup', axesCtrlHandler(0))

const style = document.createElement('style')
//style.textContent = 'body { margin: 0; } canvas { display: block; width:100% ; height : 100%; image-rendering : crisp-edges}'
//style.textContent = 'canvas { display: block ; image-rendering : crisp-edges ; } canvas.three { position: fixed; display: block; left : 100px;}'// width : '+targetSize.width*2'px; }'
style.textContent = 'canvas.three { position: fixed; display: block; left : 100px;}'// width : '+targetSize.width*2'px; }'
const ar = 16/9
const targetSize = {
    width : 2*256,
    height : 2*256/ar
}

document.head.appendChild(style)

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
    75,
    targetSize.width/targetSize.height,
    0.1,
    1000
);
var renderer = new THREE.WebGLRenderer();
//renderer.sortObjects = false;

const ocontrols = new OrbitControls(camera, renderer.domElement)
ocontrols.enableDamping = true
ocontrols.dampingFactor = 0.25
ocontrols.enableKeys = false
//ocontrols.enableZoom = false


let textPanels ={}
if (true){
    const family = 'monospace'
    const textTargetSize = {  width : targetSize.width/4, height : targetSize.height/4 }
    ;[ 
        ['go','go!','green'],
        ['failed','failed!','orange'],
        ['nextlevel','next level!','yellow'],
        ['success','sucess','cyan'], //200
    ].forEach( ([k,msg,style]) => {
        textPanels[k] = textPlane( msg,family,style,textTargetSize )
    })
    console.log(textPanels)
    
    function textPlane( msg,family,style, textTargetSize ){
        
        const canvas = textCanvas(msg,family, style, textTargetSize )
        const texture = new THREE.CanvasTexture( canvas )
        const sc = 1/10
        const geometry = new THREE.PlaneBufferGeometry( sc*canvas.width, sc*canvas.height,16 );
        const material = new THREE.MeshBasicMaterial( {
            color: 0xffff00,
            side: THREE.DoubleSide,
            map : texture,
            transparent : true
        } );
        
        const plane = new THREE.Mesh( geometry, material );
        plane.position.x = -Math.random()*320
        plane.position.z = 0.1
        plane.position.x = -5
        
        scene.add( plane );

        const originalPositions = new Float32Array(
            plane.geometry.attributes.position.array
        )
        function animate(){
            const now = Date.now() / 200
            const pp = plane.geometry.attributes.position
            for ( let i = 0 ; i < pp.count ; i++ ){
                const x = pp.array[ 3 * i ]
                const y = pp.array[ 3 * i + 1]
                const dx = Math.sin( y / 4 + now ) 
                const dy = Math.sin( x / 4 + now ) 
                pp.array[ 3 * i ] = originalPositions[3*i] + dx
                pp.array[ 3 * i  +1 ] = originalPositions[3*i+1] + dy
            }
            //geometry.computeBoundingBox()
            pp.needsUpdate = true
        }
        setInterval( animate,10 )
        return { mesh:plane, animate }
    }
    
    function textCanvas( msg, family, style, textTargetSize ){
        const canvas = document.createElement('canvas')
        canvas.style = 'position: absolute ; bottom : 0px'   
        canvas.setAttribute('name','text-panel')
        const context = canvas.getContext('2d')

        const setFont = size => context.font = `${size}px ${family}`
        let bounds = [1,textTargetSize.height]    
        const niter = 100
        let measure,tw,th
        for ( let i = 0 ; i< niter ;i++){
            const center = (bounds[0]+bounds[1])/2
            if ( ( bounds[1] - bounds[0] ) < 1e-6 ) break
            setFont( center )
            measure = context.measureText( msg )
            tw = Math.ceil(measure.actualBoundingBoxRight),
            th = Math.ceil(measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent)
            if ( ( tw > textTargetSize.width )||( th > textTargetSize.height )){
                bounds[1] = center
            } else {
                bounds[0] = center
            }
        }
        const border = 5
        canvas.width = Math.floor( tw ) + border * 2
        canvas.height = Math.floor( th ) + border * 2
        
        context.fillStyle = 'rgba(5,5,5,0)'
        context.fillRect(0,0,canvas.width,canvas.height)
        
        setFont( Math.floor( bounds[0] ) )
        context.fillStyle = style
        context.fillText(msg,
                         border + measure.actualBoundingBoxLeft,
                         canvas.height - border - measure.actualBoundingBoxDescent)
        document.body.appendChild( canvas )
        window.ccc = context
        return canvas
    }
    
}

document.body.appendChild( renderer.domElement );
let trail
{
    
    var colorArray = [ new THREE.Color( 0xff0080 ),
                       new THREE.Color( 0xffffff ),
                       new THREE.Color( 0x8000ff ) ];
    var positions = [];
    var colors = [];
    const count = 100
    for ( var i = 0; i < count; i ++ ) {
	positions.push(
            400 * Math.random() ,
            30 * Math.random() ,
            5 //* Math.random())
        )
	var clr = colorArray[ Math.floor( Math.random() * colorArray.length ) ];
	colors.push( clr.r, clr.g, clr.b );                                   
    }
    
    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );    
    var material = new THREE.PointsMaterial( { size: 2,
                                               vertexColors: true,
                                               depthTest: false,
                                               sizeAttenuation: false

                                             } );
    
    const mesh = new THREE.Points( geometry, material );
    //    console.log('trail',mesh)
    trail = { mesh, count, idx : 0}
}


var material = new THREE.ShaderMaterial( {
    uniforms: {
	time: { value: 1.0 },
	resolution: { value: new THREE.Vector2() }
    },
    vertexShader: tunnel.vertexShader,
    fragmentShader: tunnel.fragmentShader

} );
var geometry = new THREE.BufferGeometry();
const po = -1,
      pu = 1,
      vertices = new Float32Array([
          po,po,po,
          pu,po,po,
          pu,pu,po,
          po,po,po,
          pu,pu,po,
          po,pu,po,
      ])
geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

var cube = new THREE.Mesh( geometry, material );
//scene.add( cube );
/*
  camera.position.x = 0
  camera.position.y = 20
  camera.position.z = 100
*/
var startTime = Date.now();
let lastT = undefined

const scale = 1
renderer.domElement.style.width = (scale * targetSize.width)+'px'
renderer.domElement.style.height =  (scale * targetSize.height)+'px'
const Choices = mkPath()
const player = {}
{
    const geometry = new THREE.SphereBufferGeometry(0.5,32,32)
    const material = new THREE.MeshBasicMaterial({color:0x0fffff,wireframe:true})
    const mesh = new THREE.Mesh( geometry, material)
    scene.add(mesh)
    player.mesh = mesh
}
initLevel()

var animate = function (T) {
    console.log(STATE)
    requestAnimationFrame( animate )
    const dt = ( lastT === undefined )?0:(T-lastT)
    lastT = T
    stats.begin()
    
    if ( STATE === 'S0' ){
        textPanels.go.mesh.position.x = camera.position.x 
        textPanels.go.mesh.position.y = camera.position.y
    } else if ( STATE === 'S3' ){
        player.mesh.position.x +=  dt / 20
        camera.position.x +=  dt / 20
        textPanels.success.mesh.position.x = camera.position.x 
        textPanels.success.mesh.position.y = camera.position.y
        axesCtrlState[1] = [0,0]
    } else if ( STATE === 'S2' ){
        textPanels.failed.mesh.position.x = camera.position.x 
        textPanels.failed.mesh.position.y = camera.position.y
    } else if ( STATE === 'S4' ){ 
        textPanels.success.mesh.visible = false
        textPanels.nextlevel.mesh.position.x = camera.position.x 
        textPanels.nextlevel.mesh.position.y = camera.position.y
        /*
        player.mesh.position.x +=  dt / 20
        camera.position.x +=  dt / 20
        textPanels.success.mesh.position.x = camera.position.x 
        textPanels.success.mesh.position.y = camera.position.y
        axesCtrlState[1] = [0,0]
        */
    }else if ( STATE === 'S1' ){

        axesCtrlState[0] = [0,1]
        const [[l,r],[d,u],[o,p]] = axesCtrlState    
        const dx = - 1 * l + r,
              dy = -1 * d + u,
              dz = -1 * o + p
        const speed01 = 1,
              minspeed = 150,
              maxspeed = 40,
              ff = (1-speed01) * minspeed + speed01 * maxspeed,
              pmp = player.mesh.position
        
        
        const { ij2idx, map } = Choices
        
        function posCollide( pos, cells ){
            const i = Math.round(pos.x-0.5),
                  j = Math.round(pos.y-0.5),
                  c = map[ ij2idx( i,j ) ]
            collides = cells.includes( c )
            return collides
        }
        const nextPosition = pmp.clone()
        let hasCollision = false
        
        for ( let i = 3 ; i >= 1 ; i-- ){
            if ( i&1 ) nextPosition.x += dx * dt / ff
            if ( i&2 ) nextPosition.y += dy * dt / ff
            const collide = posCollide( nextPosition, ['*'] )
            if ( !collide ) break;
            hasCollision = true
            nextPosition.copy( pmp )
        }
        if ( posCollide( nextPosition, 'G' ) ){
            if ( STATE = 'S3' ){
                setTimeout( () => {
                    STATE = 'S4'
                    
                },2000)
            }
        }
        //hasCollision = false
        /*
          nextPosition.x += dx * dt / ff
          nextPosition.y += dy * dt / ff
        */
        
        function updateParticles(pmp){
            const tp = trail.mesh.geometry.attributes.position
            const tc = trail.mesh.geometry.attributes.color
            
            for ( let r = 0 ; r < 10 ; r++ ){
                const idx = trail.idx
                trail.idx = ( trail.idx + 1 )%trail.count
                //            const rang = 3 * Math.PI/4 + Math.random() * Math.PI / 2
                let rang,dis
                if ( !hasCollision ){
                    rang = Math.PI * ( 10 / 12 + 1 / 3 * Math.random() )
                    rdis = 0.5 + Math.pow(Math.random(),4) * 2.5
                } else {
                    rang = Math.random() * Math.PI * 2
                    rdis = 0+Math.pow(Math.random(),4) * 2
                }
                tp.array[ 3 * idx ] = pmp.x + Math.cos( rang ) * rdis
                tp.array[ 3 * idx + 1 ] = pmp.y + Math.sin( rang ) * rdis
                if ( hasCollision ){
                    tc.array[ 3 * idx ] = 1
                    tc.array[ 3 * idx + 1] /= 2
                    tc.array[ 3 * idx + 2 ] /= 2
                } else {
                    tc.array[ 3 * idx ] = 0
                    tc.array[ 3 * idx + 1] = Math.random()
                    tc.array[ 3 * idx + 2 ] = Math.random()
                }
            }
            tc.needsUpdate = true
            tp.needsUpdate = true
        }
        
        updateParticles(pmp)
        
        if ( hasCollision ){
            let damage
            if (nextPosition.equals(pmp) ){
                damage = dt * 4
            } else {
                damage = dt 
            }
            //        console.log(player.life,damage)
            player.life -= damage
            if ( player.life < 0 ){
                STATE = 'S2'
                player.mesh.material.color.setRGB(1,0,0)
                setTimeout( () => {
                    initLevel()
                },3000)
            }
        }
        player.mesh.position.copy( nextPosition )
        
        {
            const { ij2idx, map } = Choices
            const i = Math.round(nextPosition.x-0.5),
                  j = Math.round(nextPosition.y-0.5),
                  c = map[ ij2idx( i,j ) ]
            const col = Cols[c] || [1,0,0]
            
            player.mesh.material.color.setRGB( ...col )
            if ( hasCollision ){
                /*if ( Math.random()> 0.8 ){
                  player.mesh.material.color.setRGB( 0,0,0)
                  } else {*/
                player.mesh.material.color.setRGB( (1 - player.life/1000),0,0 )
                //}
            } else {
                player.mesh.material.color.setRGB( ...col )
            }
            
        }
        camera.position.z += dz * dt / ff
    }
    updateCamera( player.mesh.position )
    
    resetKeyStrokes()
    
    var elapsedMilliseconds = Date.now() - startTime;
    var elapsedSeconds = elapsedMilliseconds / 1000.0;

    material.uniforms.time.value = 60. * elapsedSeconds;    
    material.uniforms.resolution.value.x = renderer.domElement.width;
    material.uniforms.resolution.value.y = renderer.domElement.height;
    renderer.domElement.setAttribute('class','three')

    

    renderer.render( scene, camera );
    stats.end()
};

animate();

function mkPath(){
    const width = 100,
          height = 30
    
    const mainBranchesCount = 1,
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
    const bounds = 0
    const choices = new Array( mainBranchesCount + 3 ).fill(0).map( (_,i) => {
        //const npossible = 2 + Math.floor( Math.random() * 2 )
        let npossible = 2
        const good = Math.floor( Math.random() * npossible )
        const x = i * width / ( mainBranchesCount + 2 )
        //const x = bounds + Math.floor( i * (width-2*bounds)/(mainBranchesCount-1))
        
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
            const pts = [ new THREE.Vector2(c0.x,y0),
                          new THREE.Vector2((c0.x+c1.x)/2,y0),
                          new THREE.Vector2((c0.x+c1.x)/2,y1),
                          new THREE.Vector2((1-r)*c0.x+r*c1.x,y1) ]
            var curve = new THREE.CubicBezierCurve( ...pts )
            const points = curve.getPoints( Math.ceil(c1.x - c0.x ) )
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
    const bounds2 = 5
    function paintPoints( points, paint ){

        const mainPixels = []
        for ( let p = 1 ; p < points.length ; p++ ){
            const p0 = points[p-1],
                  p1 = points[p],
                  d = p1.clone().sub( p0 ),
                  ndivs = Math.ceil(Math.max( d.x, d.y )),
                  off = d.clone().divideScalar( ndivs )
            let ppos = p0.clone()
            for ( let d = 0 ; d < ndivs ; d++ ){
                const i = Math.round( ppos.x ),
                      j = Math.round( ppos.y )
                mainPixels.push( ij2idx(i,j) )
                ppos.add( off )
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
    mkLevel( 'level',data)
    return { choices, data, idx2i, idx2j, ij2idx, map }
}

function updateCamera( target ){
    camera.position.x = target.x
    camera.position.y = target.y
}

function initLevel()
{
    STATE = 'S0'
    const { choices } = Choices
    //console.log('CHOICH',choices)
    player.mesh.position.x = 0
    player.mesh.position.y = choices[0].ys[ choices[0].good ] + 0.5

    player.speed = new THREE.Vector2(0,0)
    player.life = 1000

    updateCamera( player.mesh.position )
    camera.position.z = 10
    setTimeout( () => {
        STATE = 'S1'
    },2000)
}


function ic( s ){ return s.codePointAt( 0 ) }
function ci( i ){ return String.fromCodePoint( i ) }
function mkLevel( name, data ){
    
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
    scene.add( mesh )
    //console.log(mesh)
}

/*
  const terrainData = require('./levels.js')

  const levels = terrainData.trim().split('==').map( level => {

  const [name,...data] = level.trim().split("\n")
  mkLevel( name, data )
  //console.log('name','+'+name+'+')
  //console.log('data','+'+data+'+')
  })

*/
scene.add( trail.mesh );
