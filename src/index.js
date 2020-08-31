// cooridor debut / fin
//const { OrbitControls } = require('three/examples/jsm/controls/OrbitControls.js')
// const THREE = require('three')
const Stats = require('stats.js')
//const tunnel = require('./tunnel.js')

import { KeyboardControllers } from './keyboardControllers.js'
import { mkChoices } from './levelCreator.js'
import { Cols } from './cols.js'
import { textCanvas } from './textPlane.js'
import { V2, cloneV2, copyV2, subV2, addV2, multScalar, divScalar, clampV2, ceilV2, floorV2 } from './v2.js'
import { Roller } from './roller.js'

const ar = 16/9
const targetSize = {
    width : 2*256,
    height : 2*256/ar
}
var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

function Texts(){
    let textPanels ={}
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
        const panel = textCanvas( msg,family,style,textTargetSize )
        textPanels[k] = panel
    })
    return { textPanels }
}
const texts = Texts()


// function updateTrail(pmp,hasCollision,STATE){
//     const tp = trail.mesh.geometry.attributes.position
//     const tc = trail.mesh.geometry.attributes.color
    
//     for ( let r = 0 ; r < 10 ; r++ ){
//         const idx = trail.idx
//         trail.idx = ( trail.idx + 1 )%trail.count
//         //            const rang = 3 * Math.PI/4 + Math.random() * Math.PI / 2
//         let rang,rdis
//         if ( !hasCollision ){
//             if (['S4'].includes( STATE )){
//                 rang = 2 * Math.PI * Math.random()
//             } else {
//                 rang = Math.PI * ( 10 / 12 + 1 / 3 * Math.random() )
//             }
//             rdis = 0.5 + Math.pow(Math.random(),4) * 2.5
//         } else {
//             rang = Math.random() * Math.PI * 2
//             rdis = 0+Math.pow(Math.random(),4) * 2
//         }
//         tp.array[ 3 * idx ] = pmp.x + Math.cos( rang ) * rdis
//         tp.array[ 3 * idx + 1 ] = pmp.y + Math.sin( rang ) * rdis
//         if ( hasCollision ){
//             tc.array[ 3 * idx ] = 1
//             tc.array[ 3 * idx + 1] /= 2
//             tc.array[ 3 * idx + 2 ] /= 2
//         } else {
//             if ( ['S4','S3'].includes( STATE ) ){
//                 tc.array[ 3 * idx ] =  Math.random()
//             } else {
//                 tc.array[ 3 * idx ] = 0
//             }
//             tc.array[ 3 * idx + 1] = Math.random()
//             tc.array[ 3 * idx + 2 ] = Math.random()
//         }
//     }
//     tc.needsUpdate = true
//     tp.needsUpdate = true
// }
function Display(){
    
    // 300 / 600 rect / ms
    
    const canvas = document.createElement('canvas')
    canvas.width =  targetSize.width 
    canvas.height = targetSize.height 
    canvas.setAttribute('name','MONMON')
    canvas.style = 'position: absolute ; top : 64px ; left : 0px;'   

    const context = canvas.getContext('2d')
    document.body.appendChild( canvas )
    
    //const choices = mkChoices() 
    const nominalScale =16
    
    const camera = {
        //center : { ...startPosition },
        center : { x:0,y:10},
        scale : nominalScale,
        nominalScale
    }
    
    function clear(  ){
        context.fillStyle = 'rgba(0,127,200,1)'
        context.fillRect(0,0,canvas.width,canvas.height)
    }
    function draw( { center, scale }, level, player ){
    
        const/* width = level.width,
              height = level.height,        */
              canvas = context.canvas,
              cwidth = canvas.width,
              cheight = canvas.height,
              hcWidth = cwidth / 2,
              hcHeight = cheight / 2
        
        function drawMap(){
            const { map, width, height,
                    ij2idx, outij } = level
            const  cpx = center.x + 0.5,
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
        }        
        function drawPanel()
        {
            const tp = texts.textPanels.go
            for ( let j = 0 ; j < tp.canvas.height ; j++ ){
                let off = Math.floor(10 + Math.sin( j / 10 + Date.now() / 100 ) * 10)
                context.putImageData(
                    tp.imageData,off,j,
                    0,j,
                    tp.canvas.width,2
                )
            }
        }
        function box2screen( x,y,w,h, target ){
            target[0] = (x - w/2 - center.x) * scale + hcWidth
            target[1] = (y - h/2 - center.y) * scale + hcHeight
            target[2] = w * scale
            target[3] = h * scale
            return target
        }
        function drawPlayer( context, { center, scale } )
        {
            const sb = []
            //const position = { ...startPosition }
            const dim = 1
            //position.x = 0
            context.fillStyle = cssrgba(1,0,0)
            /*
            const x = (position.x - dim/2 - center.x) * scale + hcWidth
            const y = (position.y - dim/2 - center.y) * scale + hcHeight            
            context.fillRect(x,y, dim*scale,dim*scale)
            */
            context.fillRect( ...box2screen( player.position.x,
                                             player.position.y,
                                             dim, dim, sb ) )
        }
        function drawParticle( context, { center, scale }, i )
        {
            const sb = []
            const position = cloneV2(player.position)//{ ...startPosition }
            const dim = 0.5
            const d = Math.cos( i/10+ Date.now() / 1000 ) * 10
            position.x += Math.cos( i+Date.now() / 1000 ) * d
            position.y += Math.sin( i+Date.now() / 1000 ) * d

            context.fillStyle = cssrgba(Math.random(),Math.cos( i/10),1)
            
            /*
            const x = (position.x - dim/2 - center.x) * scale + hcWidth
            const y = (position.y - dim/2 - center.y) * scale + hcHeight            
            context.fillRect(x,y, dim*scale,dim*scale)
            */
            context.fillRect( ...box2screen( position.x, position.y, dim, dim, sb ) )
        }

        const t1 = Date.now()
        if (level)
        drawMap()
        const t2 = Date.now()
        drawPlayer( context, camera)
        const t3 = Date.now()        
        const NB_PARTICLES = 100
        for ( let i = 0 ; i < NB_PARTICLES ; i++ ){
            drawParticle( context, camera, i)
            
        }
        const t4 = Date.now()
        drawPanel()
        const t5 = Date.now()

        const e2 = t2 - t1
        const e3 = t3 - t2
        const e4 = t4 - t3
        const e5 = t5 - t4
        const e = t5 - t1
        //console.log(e2,e3,e4,e5,e)
        return e
    }
    return { clear, draw, camera }
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
function posCollide( level, pos, cells ){
    const { ij2idx, map, outij } = level,
          i = Math.round(pos.x-0.5),
          j = Math.round(pos.y-0.5)
    if ( !outij(i,j) ) {
        const c = map[ ij2idx( i,j ) ],
              collides = cells.includes( c )
        return collides
    }
}

function movePlayer( player, level, dx, dy, dt, ff){
    const pmp = player.position,
          nextPosition = cloneV2(pmp)
    let hasCollision = false        
    for ( let i = 3 ; i >= 1 ; i-- ){
        if ( i&1 ) nextPosition.x += dx * dt / ff
        if ( i&2 ) nextPosition.y += dy * dt / ff 
        const collide = posCollide( level, nextPosition, ['*'] )
        if ( !collide ) break;
        hasCollision = true
        copyV2(pmp,nextPosition)
    }
    return {
        nextPosition,
        hasCollision
    }
}

function GameState(){

    const state = {
        name : 'I0',
    }
    const timeouts = [] 
    function update( ...ps ){
        console.log('update',...ps)
        Object.assign( state, ...ps )
    }
   

    const NLEVELS = 3
    const NSUBLEVELS = 2
    const NLIVES = 2
    const NOMINAL_ENERGY = 1000
    const automata = {
        // boot intro and warm welcoming message   
        I0 : {
            '#' : 4000,
            'next' : d => update({name:'I1'})
        },
        // incentive title screen
        I1 : {
            'next' : d => update({name:'G0'})
        },
        // global mission explanation and good luck player !
        G0 : {
            'next' : d => update({
                lives : NLIVES,
                level : 1,
                sublevel : 1,
                name:'G1'
            })
        },
        // sublevel generation
        G1 : {
            'next' : d => update({
                choices : mkChoices(),
                name:'S1'
            })
        },
        // level / sublevel presentation
        S1 : {
            'next' : d => update({
                name : 'S2',                
            })
        },
        // ready / set / go
        S2 : {
            'next' : d => update({
                energy : NOMINAL_ENERGY,
                name : 'S3',
            })
        },
        // runnning
        S3 : {
            'damage' : d => {
                const energy = state.energy - d
                if ( (energy - d)  > 0 ){
                    update({
                        energy : state.energy - d
                    })
                } else {
                    event('sublevel-lose')
                }
            },
            'sublevel-win' : d => update({
                name : 'W1'
            }),
            'sublevel-lose' : d => {
                if ( state.lives > 1 ){
                    update({
                        lives : state.lives - 1,
                        name : 'L1'
                    })
                } else {
                    update({
                        name : 'L2'
                    })
                }
            }
        },
        // sublevel win animation
        W1 : {
            'next' : d => {
                if ( state.sublevel < NSUBLEVELS ){
                    update({
                        sublevel : state.sublevel + 1,
                        name:'G1'
                    })
                } else {
                    if ( state.level < NLEVELS ){
                        update({
                            lives : state.lives + 1,
                            name:'W2'
                        })
                    } else {
                        update({
                            name:'W3'
                        })
                    }
                }
            }
        },
        // level win animation
        W2 : {
            'next' : d => update({
                level : state.level + 1,
                sublevel : 1,
                name:'G1'
            })
        },
        // game win animation
        W3 : {
            'next' : d => update({
                name:'I1'
            })
        },
        // sublevel lost animation
        L1 : {
            'next' : d => update({
                name:'G1'
            })
        },
        // game lost animation
        L2 : {
            'next' : d => update({
                name:'I1'
            })
        }
    }
 
    function timeout( f, delay ){
        const start = Date.now(),
              end = start + delay,
              idx = timeouts.findIndex( o => o.end > end ),
              to = { start, end, f }
        timeouts.splice((idx>0)?idx:0, 0, to)
    }
    function clearTimeouts(){
        timeouts.length = 0
    }
    function checkTimeouts(){
        const first = timeouts[ 0 ]
        if ( first ) {
            const now = Date.now()
            if ( now >= first.end ){
                first.f()
            }
        }
    }
    function event(eName,eData){
        clearTimeouts()
        try {
            const sm = automata[ state.name ]
            const to = sm[ '#' ]
            if ( to ){
                timeout( () => event('next'), to )
            }
            const mh = sm[ eName ]
            mh(eData)
        } catch (e){
            console.error('wrong message',{state, eName, eData})
        }
    }
    //setInterval( checkTimeouts, 200 )

    return {state,event,checkTimeouts}

    
}

function Player(){
    return {
        position : V2(0,0)
    }
}
const keyboardController = KeyboardControllers()
const gameState = GameState()
const display = Display()
const player = Player()
const step = dt=>{
//    console.log(gameState.state.name)
    const camera = display.camera
    const choices = gameState.state.choices

    // check timeouts
    gameState.checkTimeouts()
    // grab input
    stats.begin()
    if ( ['I0','I1','G0','G1','S1','S2',
          'L1','L2'].includes( gameState.state.name ) ){
        if ( keyboardController.anyKeyStroke.length ){
            console.log('to!')
            gameState.event('next')
        }
    }

    const [[l,r],[d,u],[o,p]] = keyboardController.axesCtrlState
    keyboardController.resetKeyStrokes()
    if ( ['S2'].includes( gameState.state.name ) ){
        copyV2(choices.startPosition, player.position)        
    }
    if ( ['S3'].includes( gameState.state.name ) ){
//        console.log('gameState',gameState)
        // player move + collide
        const speed01 = 1,
              minspeed = 150,
              maxspeed = 40,
              ff = (1-speed01) * minspeed + speed01 * maxspeed
        const dx = ( -1*l + r ) 
        const dy = ( -1*u + d )
        const { nextPosition, hasCollision } =  movePlayer( player, choices, dx, dy, dt, ff )
        copyV2(nextPosition,player.position)
        copyV2(player.position,display.camera.center)
        
        // update particles
        //if ( hasCollision ){
        //}
        
        // check victory
        if ( posCollide( choices, nextPosition, 'G' ) ){
            gameState.event('sublevel-win')
        }
        
        // check damage
        if ( hasCollision ){
            //copyV2( camera.center, nextPosition )
            gameState.event('damage',10)
        }
    }
    
    /*
      
    copyV2( nextPosition, camera.center )
    */
    // display
    display.clear( )                
   /* camera.center.x += ( -1*l + r ) * dt / 1000
    camera.center.y += ( -1*u + d ) * dt / 1000*/
    camera.scale *= ( 1 + ( -1*o + p ) / 10 ) 
    camera.scale = clamp( camera.scale, 4,32) // 4 wide zoom, 32 closeup
    
    const elapsed1 = display.draw( camera, choices, player )
    
    stats.end()


}
const roller = Roller(step)
roller.command(1)
/*
setTimeout( ()=> roller.command(), 1000)
setTimeout( ()=> roller.command(1), 2000)
setTimeout( ()=> roller.command(0), 3000)
*/
function print(){
    const s = gameState.state
    console.log('->#',s.name,'l',s.level,'sl',s.sublevel,'lives',s.lives)
}
function say(m){
    return function(){
        gameState.event(m)
    }
}
function repeat(r){
    return function (...fs){
        for (let i = 0 ; i < r ; i++){
            fs.forEach( f => f() )
        }
    }
}


// complete()
// function complete(){
// repeat( 3 )( say('next'), print )

// repeat( 3 )( say('next'), print )
// repeat( 1 )( say('sublevel-win'), print )
//  repeat( 1 )( say('next'), print )

//  repeat( 3 )( say('next'), print )
//  repeat( 1 )( say('sublevel-lose'), print )
//  repeat( 1 )( say('next'), print )
//  repeat( 3 )( say('next'), print )
//  repeat( 1 )( say('sublevel-lose'), print )
//  repeat( 1 )( say('next'), print )
        

// // repeat( 1 )( say('next'), print )

// // repeat( 3 )( say('next'), print )
// // repeat( 1 )( say('sublevel-lose'), print )
// // repeat( 1 )( say('next'), print )

// // repeat( 3 )( say('next'), print )
// // repeat( 1 )( say('sublevel-win'), print )
// // repeat( 1 )( say('next'), print )

// // repeat( 1 )( say('next'), print )


// // repeat( 3 )( say('next'), print )
// // repeat( 1 )( say('sublevel-win'), print )
// // repeat( 1 )( say('next'), print )

// // repeat( 3 )( say('next'), print )
// // repeat( 1 )( say('sublevel-win'), print )
// // repeat( 1 )( say('next'), print )

// // repeat( 1 )( say('next'), print )
// }
