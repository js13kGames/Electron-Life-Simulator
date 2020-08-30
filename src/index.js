// cooridor debut / fin
const { OrbitControls } = require('three/examples/jsm/controls/OrbitControls.js')
const THREE = require('three')
const Stats = require('stats.js')
//const tunnel = require('./tunnel.js')

import { KeyboardControllers } from './keyboardControllers.js'
import { mkChoices } from './levelCreator.js'
import { Cols } from './cols.js'
import { textPlane } from './textPlane.js'
import { V2, cloneV2, subV2, addV2, multScalar, divScalar, clampV2, ceilV2, floorV2 } from './v2.js'

let STATE = 'S00'

const ar = 16/9
const targetSize = {
    width : 2*256,
    height : 2*256/ar
}

function InitThree(){

    const style = document.createElement('style')
    //style.textContent = 'body { margin: 0; } canvas { display: block; width:100% ; height : 100%; image-rendering : crisp-edges}'
    //style.textContent = 'canvas { display: block ; image-rendering : crisp-edges ; } canvas.three { position: fixed; display: block; left : 100px;}'// width : '+targetSize.width*2'px; }'
    style.textContent = 'canvas.three { position: fixed; display: block; left : 100px;}'// width : '+targetSize.width*2'px; }'

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
    return { scene, camera, renderer, stats }
}
const { scene, camera, renderer, stats } = InitThree()


let textPanels ={}
if (true){
    const family = 'monospace'
    const textTargetSize = {  width : targetSize.width/4, height : targetSize.height/4 }
    ;[ 
        ['go','fetch','green'],
        ['failed','401 Unauthorized','orange'],
        ['nextlevel','301 Moved permanently','orange'],
        ['success','host contacted','orange'], //200
        ['gameover','404 Not found!','red'],
        ['c0','zero','brown'],
        ['c1','one','white'],
        ['c.','.','grey'],
    ].forEach( ([k,msg,style]) => {
        const panel = textPlane( THREE,msg,family,style,textTargetSize )
        textPanels[k] = panel
        scene.add( panel.mesh )       
    })
}

document.body.appendChild( renderer.domElement );
const trail = Trail()

function Trail(){
    
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
    const trail = { mesh, count, idx : 0}
    return trail
}
function updateTrail(pmp,hasCollision,STATE){
    const tp = trail.mesh.geometry.attributes.position
    const tc = trail.mesh.geometry.attributes.color
    
    for ( let r = 0 ; r < 10 ; r++ ){
        const idx = trail.idx
        trail.idx = ( trail.idx + 1 )%trail.count
        //            const rang = 3 * Math.PI/4 + Math.random() * Math.PI / 2
        let rang,rdis
        if ( !hasCollision ){
            if (['S4'].includes( STATE )){
                rang = 2 * Math.PI * Math.random()
            } else {
                rang = Math.PI * ( 10 / 12 + 1 / 3 * Math.random() )
            }
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
            if ( ['S4','S3'].includes( STATE ) ){
                tc.array[ 3 * idx ] =  Math.random()
            } else {
                tc.array[ 3 * idx ] = 0
            }
            tc.array[ 3 * idx + 1] = Math.random()
            tc.array[ 3 * idx + 2 ] = Math.random()
        }
    }
    tc.needsUpdate = true
    tp.needsUpdate = true
}

/*
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
*/
var startTime = Date.now();
let lastT = undefined
const scale = 1
renderer.domElement.style.width = (scale * targetSize.width)+'px'
renderer.domElement.style.height =  (scale * targetSize.height)+'px'

const State = {
    Choices : undefined, // : mkChoices(),
    level : 0
}
const player = {}
{
    const geometry = new THREE.SphereBufferGeometry(0.5,32,32)
    const material = new THREE.MeshBasicMaterial({color:0x0fffff,wireframe:true})
    const mesh = new THREE.Mesh( geometry, material)
    scene.add(mesh)
    mesh.visible = true
    player.mesh = mesh
}

function updateCamera( target ){
    camera.position.x = target.x
    camera.position.y = target.y
}

function initLevel()
{
    STATE = 'S00'
    const { choices } = State.Choices
    
    player.mesh.position.x = 0
    player.mesh.position.y = choices[0].ys[ choices[0].good ] + 0.5
    // player.speed = new THREE.Vector2(0,0)
    player.life = 1000

    updateCamera( player.mesh.position )
    camera.position.z = 100
}

function nextLevel(){
    State.level++
    console.log('level',State.level)
    const { Choices } = State
    if ( Choices ){
        Choices.mesh.geometry.dispose()
        scene.remove( Choices.mesh )
    }
    const choices = mkChoices()
    console.log('=>',choices.directions)
    console.log(choices)
    State.Choices = choices
    scene.add( choices.mesh )
    initLevel()
}

const keyboardController = KeyboardControllers()
nextLevel()


var animate = function (T) {
    //    console.log(STATE)
    requestAnimationFrame( animate )
    const dt = ( lastT === undefined )?0:(T-lastT)
    lastT = T
    stats.begin()
    if ( STATE === 'S00' ){
        textPanels.nextlevel.mesh.visible = false
        /*State.Choices.mesh.visible = false
          setTimeout( () => {
          nextLevel()
          STATE = 'S0'
          }, 10000 )*/

        
        const dirs = State.Choices.directions
        const choicesMesh = State.Choices.mesh
        const fs = [
            () => {
                choicesMesh.visible = true
                player.mesh.visible = false

                textPanels.go.mesh.visible = true
                textPanels.go.mesh.position.x = camera.position.x 
                textPanels.go.mesh.position.y = camera.position.y + 4
            },
            () => {
                //textPanels.go.mesh.visible = false
            }
        ]
        
        for ( let ii = 0 ; ii < dirs.length ; ii++ ){
            const i = ii
            fs.push( () => {
                if ( i > 0 ){
                    const ldir = dirs[ i - 1 ]
                    const tp = textPanels['c'+ldir]
                    tp.mesh.visible = false
                }
            })
            fs.push( () => {
                const dir = dirs[ i ]
                const tp = textPanels['c'+dir]
                tp.mesh.visible = true
                tp.mesh.position.x = camera.position.x + i * 0.1
                tp.mesh.position.y = camera.position.y
            })
        }
        fs.push( () => {} )
        fs.push( () => {
            
            for ( let i = 0 ; i < dirs.length ; i++ ){
                const tp = textPanels['c'+dirs[i]]
                tp.mesh.visible = false
            }
            STATE = 'S0'
        })
        STATE = 'S00S0'
        fs.forEach( (f,i) => {
            setTimeout( f, (1+i) * 600 )
        })
    } else if ( STATE === 'S00S0' ){
        textPanels.go.animate(0.25)
    } else if ( STATE === 'S0' ){
        const choicesMesh = State.Choices.mesh
        choicesMesh.visible = true
        player.mesh.visible = true
        textPanels.go.animate(0.25)

        //textPanels.go.mesh.position.x = camera.position.x 
        //textPanels.go.mesh.position.y = camera.position.y
        //textPanels.go.mesh.visible = true
        setTimeout( ()=>{
            textPanels.go.mesh.visible = false
        } ,  1000 )
        setTimeout( ()=>{
            STATE = 'S1'
        } ,  2000 )
        
    } else if ( STATE === 'S2' ){
        textPanels.failed.mesh.visible = true
        textPanels.failed.animate(0.25)
        textPanels.failed.mesh.position.x = camera.position.x 
        textPanels.failed.mesh.position.y = camera.position.y - 4
    }else if ( STATE === 'S3' ){
        player.mesh.position.x +=  dt / 20
        camera.position.x +=  dt / 20
        textPanels.success.animate(0.25)
        textPanels.success.mesh.visible = true
        textPanels.success.mesh.position.x = camera.position.x 
        textPanels.success.mesh.position.y = camera.position.y - 4
        //keyboardController.axesCtrlState[1] = [0,0]
        updateTrail(camera.position, false, STATE)
    }  else if ( STATE === 'S4' ){
        player.mesh.visible = false
        textPanels.success.mesh.visible = false
        textPanels.nextlevel.animate(0.25)
        textPanels.nextlevel.mesh.visible = true
        textPanels.nextlevel.mesh.position.x = camera.position.x 
        textPanels.nextlevel.mesh.position.y = camera.position.y - 4
        updateTrail(camera.position, false, STATE)
    } else if ( STATE === 'S1' ){

        keyboardController.axesCtrlState[0] = [0,1]
        const [[l,r],[d,u],[o,p]] = keyboardController.axesCtrlState    
        const dx = - 1 * l + r,
              dy = -1 * d + u,
              dz = -1 * o + p
        
        const speed01 = 1,
              minspeed = 150,
              maxspeed = 40,
              ff = (1-speed01) * minspeed + speed01 * maxspeed,
              pmp = player.mesh.position
        
        
        const { ij2idx, map } = State.Choices
        
        function posCollide( pos, cells ){
            const i = Math.round(pos.x-0.5),
                  j = Math.round(pos.y-0.5),
                  c = map[ ij2idx( i,j ) ]
            const collides = cells.includes( c )
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
            //if ( STATE = 'S3' ){
            setTimeout( () => {
                STATE = 'S4'
                setTimeout( () => {
                    nextLevel()
                },4000)                
            },2000)
            //}
        }
        //hasCollision = false
        /*
          nextPosition.x += dx * dt / ff
          nextPosition.y += dy * dt / ff
        */
        
        
        updateTrail(pmp, hasCollision)
        
        if ( hasCollision ){
            let damage
            if (nextPosition.equals(pmp) ){
                damage = dt * 4
            } else {
                damage = dt 
            }
            player.life -= damage
            if ( player.life < 0 ){
                STATE = 'S2'
                player.mesh.material.color.setRGB(1,0,0)
                setTimeout( () => {
                    textPanels.failed.mesh.visible = false
                    initLevel()
                },3000)
            }
        }
        player.mesh.position.copy( nextPosition )
        
        {
            const { ij2idx, map } = State.Choices
            const i = Math.round(nextPosition.x-0.5),
                  j = Math.round(nextPosition.y-0.5),
                  c = map[ ij2idx( i,j ) ]
            const col = Cols[c] || [1,0,0]
            
            player.mesh.material.color.setRGB( ...col )
            if ( hasCollision ){
                player.mesh.material.color.setRGB( (1 - player.life/1000),0,0 )
            } else {
                player.mesh.material.color.setRGB( ...col )
            }
            
        }
        camera.position.z += dz * dt / ff
    }

    updateCamera( player.mesh.position )
    
    keyboardController.resetKeyStrokes()
    /*
      var elapsedMilliseconds = Date.now() - startTime;
      var elapsedSeconds = elapsedMilliseconds / 1000.0;
    */
    /*material.uniforms.time.value = 60. * elapsedSeconds;    
      material.uniforms.resolution.value.x = renderer.domElement.width;
      material.uniforms.resolution.value.y = renderer.domElement.height;
    */
    //renderer.domElement.setAttribute('class','three')
    renderer.render( scene, camera );
    stats.end()
};

animate();




/*
  const levels = terrainData.trim().split('==').map( level => {

  const [name,...data] = level.trim().split("\n")
  mkLevel( name, data )
  //console.log('name','+'+name+'+')
  //console.log('data','+'+data+'+')
  })

*/

scene.add( trail.mesh );
// 300 / 600 rect / ms
{
    
    const canvas = document.createElement('canvas')
    canvas.width =  targetSize.width 
    canvas.height = targetSize.height 
    canvas.setAttribute('name','MONMON')
    canvas.style = 'position: absolute ; right : 0px ; bottom : 0px;'   

    const context = canvas.getContext('2d')
    document.body.appendChild( canvas )
    
    const nominalScale=16

    const choices = mkChoices() 
    const { startPosition, map, width, height, idx2j, idx2i, ij2idx, directions, outij } = choices

    const camera = {
        center : { ...startPosition },
        scale : nominalScale,
    }

    setInterval( () => {
        clear( context )        
        
          camera.center.x += 0.5/8
          camera.center.y += 0.2/28
          camera.scale = nominalScale + Math.abs( Math.sin(Date.now()/1000)  ) * 8
          const elapsed1 = drawMap( context, camera )
          console.log('elapsed',elapsed1)  
        
    }, 16 )

    function clear( context ){
        context.fillStyle = 'rgba(0,127,200,1)'
        context.fillRect(0,0,canvas.width,canvas.height)
    }
    function drawMap( context, { center, scale } ){
        const t1 = Date.now()
        const canvas = context.canvas,
              cwidth = canvas.width,
              cheight = canvas.height,
              hcWidth = cwidth / 2,
              hcHeight = cheight / 2,        
              cpx = center.x + 0.5,
              cpy = center.y + 0.5,
              visiblemap = {
                  l : clamp(Math.floor( cpx - hcWidth / scale ),0,width-1),
                  r : clamp(Math.ceil( cpx + hcWidth / scale ),0,width-1),
                  b : clamp(Math.floor( cpy - hcHeight / scale ),0,height-1),
                  t : clamp(Math.ceil( cpy + hcHeight / scale ),0,height-1),
              }
        for ( let i = visiblemap.l ; i < visiblemap.r  ; i++ ){
            for ( let j = visiblemap.b ; j < visiblemap.t ; j++ ){
                let col
                if ( outij(i,j) ){
                    col = [1,0,0]
                } else {
                    const c = map[ ij2idx( i,j ) ]
                    col = Cols[c] || [1,0,0]
                }
                const rgba = cssrgba( ...col ),
                      x = (i - cpx) * scale + hcWidth,
                      y = (j - cpy) * scale + hcHeight
                context.fillStyle = rgba
                context.fillRect(x, y, scale-1, scale-1)
            }
        }
        const t2 = Date.now()
        const elapsed = t2 - t1
        return elapsed 
    }
}


function clamp(x,min,max){
    return Math.max(min,Math.min(x,max))
}
function cssrgba( r01,g01,b01,a=1){
    const r = Math.floor( 256 * r01 ),
          g = Math.floor( 256 * g01 ),
          b = Math.floor( 256 * b01 )
    return `rgba(${r},${g},${b},${a})`
}
