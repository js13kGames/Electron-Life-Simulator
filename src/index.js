"use strict";
// cooridor debut / fin
//const { OrbitControls } = require('three/examples/jsm/controls/OrbitControls.js')
// const THREE = require('three')
const Stats = require('stats.js')
//const tunnel = require('./tunnel.js')
//require('./zzfx.js')

import * as Build from './build.js'
import { KeyboardControllers } from './keyboardControllers.js'
import { mkChoices } from './levelCreator.js'
import { Cols } from './cols.js'
import { textCanvas } from './textPlane.js'
import { V2, cloneV2, copyV2, subV2, addV2, multScalar, divScalar, clampV2, ceilV2, floorV2, lerpV2} from './v2.js'
import { Roller } from './roller.js'
import { canvasStyle, bodyStyle } from './css.js'
import { FeedbackBuffer } from './feedbackBuffer.js'
import { TextMode } from './textMode.js'

const playerNoises = PlayerNoises()

//const { zzfx } = require('./zz.js')
function zzfx (){
}

console.log(Build.date, Build.timestamp)


document.body.style = 'background:#111;';

const levels = []
//    minspeed, width, height, mainBranchesCount,

const sounds = {
    u : [,,1049,,.09,.25,,.45,,,442,.05,,.1,,,,.51,.08,.1],
    v : [,,1322,.05,.12,.03,1,.02,31,7.7,,,,,,,.27,.33,.04,.01],
    w : [,,34,.02,,.04,2,2.05,,1,-14,.16,,.8,,,.09,,.16,.17],
    x : [,,565,.04,.19,0,,.33,,-4.1,,,,,,,.12,.05,,.55],
    y : [,,27,.02,.16,.18,3,.7,,-0.7,,,,.1,,,,.34,.21,.09], // prout
    z : [,,674,.07,.18,.01,,.9,-25,,,,.02,.7],
    wo : [,,803,.05,.43,.55,,1.86,,,-97,.02,.27,,,,,.64,.04],
    l1 : [,,72,.01,,.32,2,1.51,,-0.6,,,.02,,,,.07,.63],
    l2 : [,,29,,.21,.15,4,1.63,,.7,-137,.03,,,,,.11,,.1]
}

//

const ar = 16/9
const targetSize = {
    width : 2*256,
    height : Math.floor(2*256/ar)
}
var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

function Texts(){
    let textPanels ={}
    const family = 'monospace'
    const textTargetSize = {  width : targetSize.width/2,
                              height : targetSize.height/2 }
    const desc = [ 
        ['welcome','icentive title screen software limited presents','green'],
        //['title','incentive title screen','white'],
        ['title','ip racer 2030','white'],        
        ['intro','the story begins...','white'],
        ['levelnum','!levelnum!','white','ct'],
        ['sublevelnum','!sublevelnum','white','cbu'],
        ['instructions','!routr!','white','cbu'/*,'a:sscroll'*/],
        ['ready?','connecting...','white','cbu'/*,'a:sscroll'*/],
        ['subwin','hop covered !','white','cbu'],
        ['redirecting','redirecting to next hop...','white','cbu'],
        ['levelwin','network covered !','white','cbu'],
        ['win','you won it all !','white'],
        //['go','fetch','green'],
        ['failed','401 Unauthorized','white','cbu','a:sscroll'],
        ['nextlevel','301 Moved permanently','orange'],
        ['success','host contacted','orange'], //200
        ['gameover','404 Not found!','white'],
        ['c0','zero','brown'],
        ['c1','one','white'],
        ['c.','.','grey'],
        ['anykey','[press any key to continue...]','grey','br','a:none']
    ]
    desc.forEach( ([k,msg,style,position='c',animation = 'a:floffle']) => {
        //        console.log('***',msg,family,style,textTargetSize)
        const panel = textCanvas( msg,family,style,textTargetSize )
        panel.position=position
        panel.animation = animation
        textPanels[k] = panel
    })
    function updateInstructions(){
        return updateMessage('instructions')
    }
    function updateMessage(name,msg){
        const panel = textPanels[ name ]
        const d = desc.find( d => d[0] === name )
        //        console.log('***>',d)
        //        console.log('***',msg, textTargetSize)
        const tcid = textCanvas( msg, family, d[2], textTargetSize)
        textPanels[ name ] 
        panel.canvas = tcid.canvas
        panel.imageData = tcid.imageData
    }
    return { textPanels, updateMessage }
}

function Display(){
    
    // 300 / 600 rect / ms
    
    const canvas = document.createElement('canvas')
    
    canvas.width =  targetSize.width 
    canvas.height = targetSize.height    
    canvas.setAttribute('name','MONMON')
    canvas.style = canvasStyle//'position: absolute ; top : 200px ; left : 0px;'   
    const context = canvas.getContext('2d')


    const feedbackBuffer = FeedbackBuffer( context )
    const textMode = TextMode( canvas )

    document.body.appendChild( canvas )
    
    //const choices = mkChoices() 
    const nominalScale = 16 
    
    const camera = {
        //center : { ...startPosition },
        center : { x:0,y:0},
        scale : nominalScale,
        nominalScale
    }
    //const canvas = context.canvas,
    const hcWidth = canvas.width / 2,
          hcHeight = canvas.height / 2
    
    function newframe(  ){
        feedbackBuffer.copy()
        //context.fillStyle = 'rgba(0,127,200,1)'
        context.fillStyle = 'rgba(0,0,0,1)'
        context.fillRect(0,0,canvas.width,canvas.height)
    }
    function draw( { center, scale }, level, player, particles, texts, timeoutBar, lifeBar, remainingTo ){
        
        
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
                          x = Math.floor( (i - cpx) * scale + hcWidth ),
                          y = Math.floor( (j - cpy) * scale + hcHeight )
                    context.fillStyle = rgba
                    //context.fillRect(x, y, scale-1, scale-1)
                    //context.fillRect(x, y, scale, scale)
                    context.fillRect(x+1, y+1, scale-1, scale-1)
                }
            }
        }        
        function drawPanel2( tp )
        {
            for ( let j = 0 ; j < tp.canvas.height ; j++ ){
                let off = Math.floor(10 + Math.sin( j / 10 + Date.now() / 25 ) * 10)
                context.putImageData(
                    tp.imageData,
                    off,j,
                    0,j,
                    tp.canvas.width,2
                )
            }
        }
        function drawPanel( tp )
        {
            let l=0,b =0
            if ( tp.position === 'c' ){
                l += Math.floor( (canvas.width - tp.canvas.width )/ 2 )
                b += Math.floor( (canvas.height - tp.canvas.height) / 2 ) 
            } else if ( tp.position === 'br' ){
                l += canvas.width - tp.canvas.width
                b += canvas.height  - tp.canvas.height
            } else if ( tp.position === 'ct' ){
                l += Math.floor( (canvas.width - tp.canvas.width )/ 2 )
                b += tp.canvas.height
            } else if ( tp.position === 'cbu' ){
                l += Math.floor( (canvas.width - tp.canvas.width )/ 2 )
                b += canvas.height  - tp.canvas.height - 40
            }
            l=Math.floor(l);
            b=Math.floor(b)
            for ( let j = 0 ; j < tp.canvas.height ; j++ ){
                let xoff=0,yoff=0
                if ( tp.animation  === 'a:floffle' ){ 
                    xoff = 10 + Math.sin( j / 10 + Date.now() / 200 ) * 5
                } else if ( tp.animation  === 'a:sscroll'){
                    xoff = remainingTo * canvas.width / 10
                }
                /*context.putImageData(
                  tp.imageData,
                  300+off,j,
                  0,j,
                  tp.canvas.width,2
                  )*/
                context.drawImage( tp.canvas,
                                   0, j,
                                   tp.canvas.width, 2,
                                   Math.floor(l+xoff),Math.floor(b+j+yoff),
                                   tp.canvas.width, 2)
                /*
                  void ctx.putImageData(imageData, dx, dy);
                  void ctx.putImageData(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight);
                */
                /*
                  void ctx.drawImage(image, dx, dy);
                  void ctx.drawImage(image, dx, dy, dWidth, dHeight);
                  void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
                */
                
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
            const dim = 1
            let col
            if ( player.hasCollision ){
                col = [player.energy/2,0.2 * Math.random(),0.05 * Math.random()]
            } else {
                col = [Math.pow(player.energy,0.25),0,0]
            }/*
            
            if (( player.hasCollision )&&(Math.random()<0.8)){
                col = [ 1 - player.energy / 1000,Math.random(),Math.random()]
            } else {
                col = [ 1 - player.energy / 1000,0,0]
            }
             */
            //            console.log(player.energy)
            context.fillStyle = cssrgba( ...col/*NOMINAL_ENERGY*/)
            context.fillRect( ...box2screen( player.position.x,
                                             player.position.y,
                                             dim, dim, sb ) )
        }
        function drawParticle( context, { center, scale }, particle,  i ){
            const sb = []
            context.fillStyle = cssrgba(...particle.color)
            context.fillRect( ...box2screen( particle.position.x,
                                             particle.position.y,
                                             particle.dim, particle.dim, sb ) )
        }
        function drawTimeoutBar(){
            const height = 20
            context.fillStyle = cssrgba(1,1,1,0.25)
            context.fillRect(0,canvas.height-height,
                             canvas.width*timeoutBar.remain,canvas.height)
        }
        function drawLifeBar(){
            let { l, L } = lifeBar
            const dim = 10,
                  margin = 2
            let x = margin
            context.fillStyle = cssrgba(0,0,0,0.5)
            context.fillRect(
                0,0,
                (   dim + margin)*L+margin,
                dim+2*margin
            )
            function drawUnit(){
                context.fillRect(x,margin,dim,dim)
                x += dim + margin
            }
            context.fillStyle = cssrgba(1,0,0,1)
            for ( let i = 1 ; i <= l ; i++ ){
                drawUnit()
            }
            context.fillStyle = cssrgba(0.2,0.2,0.2,1)
            for ( let i = l+1 ; i <= L ; i++ ){
                drawUnit()
            }
            
            
        }

        const t1 = Date.now()
        if (level && level.visible)
            drawMap()

        //textMode.draw(context)

        
        const t2 = Date.now()
        if ( player.visible ) 
            drawPlayer( context, camera)
        const t3 = Date.now()
        
        particles.els.forEach( (particle,i) => {
            if ( particle.visible )
                drawParticle( context, camera, particle, i )
        })
        
        const t4 = Date.now()
        Object.values(texts.textPanels).forEach( tp => {
            if ( tp.visible ){
                drawPanel(tp)
            }
        })
        const t5 = Date.now()
        if ( timeoutBar.visible ){
            drawTimeoutBar()
        }
        feedbackBuffer.paste()
        const t6 = Date.now()
        if ( lifeBar.visible ){
            drawLifeBar()
        }

        
        const e2 = t2 - t1
        const e3 = t3 - t2
        const e4 = t4 - t3
        const e5 = t5 - t4
        const e6 = t6 - t5
        const e = t6 - t1
        //console.log(e2,e3,'p',e4,e5,e)
        return e
    }
    return { newframe, draw, camera, feedbackBuffer, textMode }
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
          i = Math.round(pos.x),
          j = Math.round(pos.y)
    if ( !outij(i,j) ) {
        const c = map[ ij2idx( i,j ) ],
              collides = cells.includes( c )
        return collides
    }
}

function movePlayer( player, level, dx, dy, dt, ff){
    const pmp = player.position,
          nextPosition = cloneV2(pmp)
    let hasCollision = false,
        collisionType = 0
    for ( let i = 3 ; i >= 1 ; i-- ){
        if ( i&1 ) nextPosition.x += dx * dt / ff
        if ( i&2 ) nextPosition.y += dy * dt / ff 
        const collide = posCollide( level, nextPosition, ['*'] )
        if ( !collide ) break;
        hasCollision = true
        collisionType = i
        copyV2(pmp,nextPosition)
    }
    return {
        nextPosition,
        hasCollision,
        collisionType,
        dx,
        dy
    }
}

function GameState(){

    const state = {
        name : 'I',
        T : 0,
        t : 0
    }
    const timeouts = [] 
    function update( ...ps ){
        // console.log('update',...ps)
        Object.assign( state, ...ps )
    }


    const NLEVELS = 3
    const NSUBLEVELS = 2
    const NLIVES = 2
    const NOMINAL_ENERGY = 1
    const automata = {
        I : {
            'start' : d => update({name:'I0'})
        },
        // boot intro and warm welcoming message
        I0 : {
            // just require an input to be able to play sounds
            /*'>' : () => {
              timeout( () => event('next'),3000)
              },*/
            //'#' : 1000,
            'next' : d => {
                update({name:'I1'})
                zzfx(...sounds.u)
            }
        },
        // incentive title screen
        I1 : {
            'next' : d => {
                update({name:'G0'})
                zzfx(...sounds.v)
            }
        },
        // global mission explanation and good luck player !
        G0 : {
            'next' : d => {
                update({
                    L : NLIVES,
                    lives : NLIVES,
                    level : 1,
                    sublevel : 1,
                    name:'G1'
                })
                zzfx(...sounds.w)
            }
        },
        // sublevel generation
        G1 : {
            '>' : () => {
                update({
                    choices : mkChoices(),
                })
                const dirs = gameState.state.choices.directions
                texts.updateMessage('levelnum',`network #${ gameState.state.level}`)
                texts.updateMessage('sublevelnum',`hop #${ gameState.state.sublevel }`)
                texts.updateMessage('instructions','route : '+ dirs.join('.'))
                copyV2(gameState.state.choices.startPosition, player.position)
                copyV2(player.position,display.camera.center)
                timeout( () => event('next'),5000)
            },
            'next' : d => {
                update({
                    //choices : mkChoices(),
                    name:'S1'
                })
                zzfx(...sounds.x)
            },
        },
        // level / sublevel presentation
        S1 : {
            '>' : () => {
                const dirs = gameState.state.choices.directions
                copyV2(gameState.state.choices.startPosition, player.position)
                copyV2(player.position,display.camera.center)
                timeout( () => event('next'), 1000 + dirs.length * 1000 )
            },
            'next' : d => {
                update({
                    name : 'S2',                
                })
                // ????
                copyV2(gameState.state.choices.startPosition, player.position)
                copyV2(player.position,display.camera.center)
                zzfx(...sounds.y)
            }
        },
        // ready / set / go
        S2 : {
            '>' : () => {
                timeout( () => event('next'),2000)
            },
            'next' : d => {
                update({
                    energy : NOMINAL_ENERGY,
                    checkLines : [],
                    name : 'S3',
                })
                zzfx(...sounds.z)
            }
        },
        // runnning
        S3 : {
            'checkLine' : num => {
                state.checkLines.push( { num, t : state.T } )
                zzfx(...sounds.v)
                console.log('state.checkLines',state.checkLines)
            },
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
            'sublevel-win' : d =>{
                update({
                    name : 'W1'
                })
                zzfx(...sounds.wo)
            },
            'sublevel-lose' : d => {
                if ( state.lives > 1 ){
                    update({
                        lives : state.lives - 1,
                        name : 'L1'
                    })
                    zzfx(...sounds.l1)
                } else {
                    update({
                        lives : 0,
                        name : 'L2'
                    })
                    zzfx(...sounds.l2)
                    
                }
            }
        },
        // sublevel win animation
        W1 : {
            '>' : d => {
                timeout( () => event('next'),4000)
            },
            'next' : d => {
                if ( state.sublevel < NSUBLEVELS ){
                    update({
                        sublevel : state.sublevel + 1,
                        name:'R0'
                    })
                } else {
                    if ( state.level < NLEVELS ){
                        update({
                            lives : state.lives + 1,
                            L: Math.max( state.lives + 1, state.L ),
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
        // redirecting aftr sublevel win
        R0 : {
            '>' : d => {
                timeout( () => event('next'),8000)
            },            
            'next' :  d => update({
                choices : undefined,
                name : 'G1',
            })
        },
        // level win animation
        W2 : {
            'next' : d => update({
                choices : undefined,
                level : state.level + 1,
                sublevel : 1,
                name:'G1'
            })
        },
        // game win animation
        W3 : {
            'next' : d => update({
                choices : undefined,
                name:'I1'
            })
        },
        // sublevel lost animation
        L1 : {
            '>' : d => {
                timeout( () => event('next'),8000)
            },  
            'next' : d => {
                update({
                    name:'S1'
                })
            }
        },
        // game lost animation
        L2 : {
            'next' : d => update({
                name:'I1',
                choices : undefined,
            })
        }
    }
    
    function timeout( f, delay ){
        const start = state.T,
              end = start + delay,
              idx = timeouts.findIndex( o => o.end > end ),
              to = { start, end, delay, f }
        timeouts.splice((idx>0)?idx:0, 0, to)
    }
    function clearTimeouts(){
        timeouts.length = 0
    }
    function checkTimeouts(T){
        state.T = T
        const first = timeouts[ 0 ]
        if ( first ) {
            const now = T
            if ( now >= first.end ){
                first.f()
            }
            return clamp( ( first.end - T ) / first.delay,0,1)
        }
    }
    function event(eName,eData){
        clearTimeouts()
        const cStateName = state.name
        try {
            const sm = automata[ cStateName ]
            /*const to = sm[ '#' ]
              if ( to ){
              timeout( () => event('next'), to )
              }*/
            const mh = sm[ eName ]
            mh(eData)
        } catch (e){
            console.error('wrong message',cStateName,eName,{state, eName, eData},e)
        }
        if ( cStateName !== state.name  ){
            //
            state.t = state.T
            
            // enter state f
            const sm = automata[ state.name ]
            const enter = sm['>']
            if ( enter ){
                enter()
            }
            console.log('STATE CHANGE',cStateName,'->',state.name)
        }
    }
    //setInterval( checkTimeouts, 200 )

    return {state,event,checkTimeouts}

    
}

function Player(){
    return {
        visible : true,
        position : V2(0,0),
        lastpos : V2(0,0)
    }
}
function Particles(){
    const PARTICLE_COUNT = 50
    const els = []
    for ( let i = 0 ; i < PARTICLE_COUNT ; i++ ){
        els[i] = {
            dim : 0.25,
            visible : true,
            position : {
                x : 10,
                y : 10
            },
            color : [1,1,1,1]
        }
    }
    return {
        idx : 0,
        els
    }
}
function TimeoutBar(){
    return {
        visible : true,
    }
}
function LifeBar(){
    return {
        visible : true,
        l : 5, // current
        L : 5 // max
    }
}
const keyboardController = KeyboardControllers()
const gameState = GameState()
const display = Display()
const player = Player()
const particles = Particles()
const texts = Texts()
const timeoutBar = TimeoutBar()
const lifeBar = LifeBar()

const step = (dt,T) =>{
    const timeoutBarVisibility = ['G1','S1','S2','R0','L1']
    const textVisibility = {
        'I0' : ['welcome','anykey'],
        'I1' : ['title'],
        'G0' : ['intro','anykey'],
        'G1' : ['levelnum','sublevelnum'],
        'S1' : ['instructions','anykey'],
        'S2' : ['ready?'/*,'instructions'*/],
        'W1' : ['subwin'],
        'R0' : ['redirecting'],
        'W2' : ['levelwin','anykey'],
        'W3' : ['win'],
        'L1' : ['failed'],
        'L2' : ['gameover'],        
    }
    const mapVisibility = ['S2','S3','W1','L1']
    const playerVisibility = ['S1','S2','S3','W1','R0','L1']
    const lifeBarVisibility = ['G1','S1','S2','S3','W1','W2','R0','L1','L2']
    const feedbackEffect = {
        'I0' : ['none','broadway'],
        'I1' : ['broadway','left-grey','blue-blur'],
        'G0' : ['broadway','left-grey'],
        'G1' : ['broadway','blue-blur'],
        'S1' : ['blue-blur'],
        'S2' : ['blue-blur'],
        'S3' : ['none'],
        'W1' : ['color-blur'],
        'R0' : ['blue-blur'],
        'W2' : ['color-blur'],
        'W3' : ['broadway','color-blur'],
        'L1' : ['left-grey'],
        'L2' : ['left-grey'],
        
    }
    //    console.log(gameState.state.name)
    const camera = display.camera
    const choices = gameState.state.choices

    // check timeouts
    const remainingTo = gameState.checkTimeouts(T)
    timeoutBar.remain = remainingTo
    timeoutBar.visible =  (remainingTo !== undefined) 
        && timeoutBarVisibility.includes( gameState.state.name ) 

    const TIME_BEFORE_SKIP_STATE = 600
    // grab input
    stats.begin()
    if ( ['I0','I1','G0','G1','S1',
          'L1','L2','W2','W3','R0'].includes( gameState.state.name ) ){
        const sinceStateStart = T - gameState.state.t
        if ( sinceStateStart > TIME_BEFORE_SKIP_STATE ){
            if ( keyboardController.anyKeyStroke.length ){
                console.log('to!')
                gameState.event('next')
            }
        }
    }
    const [[l,r],[d,u],[o,p]] = keyboardController.axesCtrlState
    keyboardController.resetKeyStrokes()

    let HASCOLLIDSION = false,
        DAMAGE = 0,
        WALLDIST = undefined
    
    let collision
    if ( ['S3','W1','W2'].includes( gameState.state.name ) ){
        //        console.log('gameState',gameState)
        // player move + collide
        const speed01 = 1,
              minspeed = 150,
              maxspeed = 40,
              ff = (1-speed01) * minspeed + speed01 * maxspeed
        let dx,dy
        if ( ['S3'].includes( gameState.state.name ) ){
            dx = 1
            //dx = ( -1*l + r ) 
            dy = ( -1*u + d )
        } else {
            dx = 2
            dy = 0
        }
        collision = movePlayer( player,
                                choices, dx, dy, dt, ff )
        
        const { nextPosition, hasCollision, collisionType } =  collision
        /*if ( hasCollision ){
          console.log( 't',collisionType )
          }*/
        copyV2(player.position,player.lastpos)
        copyV2(nextPosition,player.position)
        //copyV2(player.position,display.camera.center)
        
        // update particles
        //if ( hasCollision ){
        //}
        if ( ['S3'].includes( gameState.state.name ) ){
            // check victory
            if ( posCollide( choices, nextPosition, 'G' ) ){
                gameState.event('sublevel-win')
            }
            
            // check damage
            if ( hasCollision ){
                HASCOLLIDSION  = true
                const df = (collisionType !== 2)?5:1
                const damage = ( dt / 1500 ) * df
                DAMAGE = damage
                gameState.event('damage',damage)
            }
        }
    }

    if( gameState.state.name === 'S3' ){
        // checkLaps
        if (gameState.state.choices) {
            const choices = gameState.state.choices.choices
            // console.log( player.position,player.lastpos )
            let idx = -1
            for ( let i = 0 ; i < choices.length ; i++ ){            
                const x = choices[ i ].x
                if ( ( player.lastpos.x < x ) && ( x <= player.position.x ) ){
                    idx = i
                    break
                }
            }
            if ( idx !== -1 ){
                gameState.event('checkLine',idx, choices.length - 2)
                console.log('step',idx,'/', choices.length - 2)
            }
        }
        // front raycast
        function frontRaycast( position, length, types ) {
            const { ij2idx, map } = gameState.state.choices,
                  ix = Math.round( position.x ),
                  iy = Math.round( position.y )
            for ( let i = 0 ; i < length ; i++ ){
                if ( types.includes( map[ ij2idx(ix+i,iy) ] ) ){
                    return i
                }
            }
        }
        const rayLength = 100
        const wallDist = frontRaycast( player.position, rayLength,['*'] )
        if ( wallDist !== undefined ){
            const wallProx = clamp((rayLength - wallDist - 1) / ( rayLength - 2 ),0,1
                                  )
            WALLDIST = wallProx
            //console.log('seen',wallProx)
        }
        
    }
    /*
      
      copyV2( nextPosition, camera.center )
    */
    // display
    display.newframe( )                
    /* camera.center.x += ( -1*l + r ) * dt / 1000
       camera.center.y += ( -1*u + d ) * dt / 1000*/
    camera.scale *= ( 1 + ( -1*o + p ) / 10 ) 
    camera.scale = clamp( camera.scale, 4,32) // 4 wide zoom, 32 closeup
    Object.entries(texts.textPanels).forEach( ([pname,tp]) => {
        const v = textVisibility[ gameState.state.name ]
        tp.visible = ( v && v.includes(pname) )
    })
    if ( choices ){
        choices.visible = mapVisibility.includes( gameState.state.name )
    }
    player.visible = playerVisibility.includes(  gameState.state.name )
    player.energy =  gameState.state.energy
    player.hasCollision = HASCOLLIDSION

    
    
    
    particles.hasCollision = HASCOLLIDSION
    {
        // const running =  ['S3'].includes( gameState.state.name )

        const target = player.position
        updateParticles( particles, target, HASCOLLIDSION, collision,gameState.state.energy,  gameState.state.name )
    }
    //if ( choices ) choices.visible = true
    if ( ( gameState.state.lives !== undefined )
         && ( gameState.state.lives !== undefined) ){
        lifeBar.l = gameState.state.lives
        lifeBar.L = gameState.state.L
    }
    lifeBar.visible = lifeBarVisibility.includes(  gameState.state.name )
    copyV2( player.position, camera.center )

    

    
    const currentFeedBackMode = display.feedbackBuffer.getMode()
    //console.log('cr',currentFeedBackMode)
    const feedBackChoices = feedbackEffect[ gameState.state.name ]


    const justChange = Math.random() > 0.98,
          fbcInList = feedBackChoices.includes(currentFeedBackMode),
          fbcFirst = feedBackChoices[ 0 ] === currentFeedBackMode

    if ( !fbcFirst ){
        const rmode = feedBackChoices[ 0 ]
        const mode = display.feedbackBuffer.setMode(rmode)
    }
    // let rmode = currentFeedBackMode
    // if ( fbcFirst ){
    //     // rarely change to other
    //     if ( Math.random() < (3 / 1000) ){
    //         rmode = feedBackChoices[ 1 +  Math.floor( ( feedBackChoices.length - 1 ) * Math.random() ) ]
    //     }
    // }  else if (fbcInList ){
    //     // often change to first
    //     if ( Math.random() < (10 /1000)){
    //         rmode = feedBackChoices[ 0 ]
    //     }        
    // } else {
    //     rmode = feedBackChoices[ 0 ]
    // }
    // if ( rmode !== currentFeedBackMode ){
    //     const mode = display.feedbackBuffer.setMode(rmode)
    //     console.log('+->',mode)
    // }

    playerNoises.update({
        energy : gameState.state.energy,
        hasCollision : HASCOLLIDSION,
        damage : DAMAGE,
        wallDist : WALLDIST
    })

    
  /*  
    const justChange = Math.random() > 0.98,
          mustChange = !(feedBackChoices.includes(currentFeedBackMode))
    //&& ( Math.random() < 1/20 )
    if ( justChange || mustChange ){
        let rmode
        if ( Math.random() > 0.8 ) {
            rmode = feedBackChoices[ 0 ]
        } else {
            rmode = feedBackChoices[
                1 +  Math.floor( ( feedBackChoices.length - 1 ) * Math.random() )
            ]
        }
        console.log('->',rmode)
        const mode = display.feedbackBuffer.setMode(rmode)
    }
*/    
    
    const elapsed1 = display.draw( camera, choices, player, particles, texts, timeoutBar, lifeBar, remainingTo )
    
    stats.end()

    //    texts.updateMessage('welcome','BONJOUR')
}
const roller = Roller(step)
roller.command(1)
gameState.event('start')



function updateParticles(particles,pmp,targethasCollision,collision,playerEnergy,STATE){

    if ( STATE === 'S3' ){
        const targetPosition = V2()
        for ( let r = 0 ; r < /*10*/4 ; r++ ){
            particles.idx = (particles.idx + 1)%particles.els.length
            const particle = particles.els[ particles.idx ]
            if ( targethasCollision ){
                particle.color = [0.5+Math.random()/2,0,0]
            } else {
                particle.color = [playerEnergy,Math.random()*playerEnergy,Math.random()*playerEnergy]
            }
            if ( targethasCollision ){
                const { dx, dy } = collision
                const rang = 2 * Math.PI * Math.random()
                const rdis = 0.5 + Math.pow(Math.random(),4) * 1
                targetPosition.x = pmp.x + dx / 2 + Math.cos( rang ) * rdis
                targetPosition.y = pmp.y + dy / 2 + Math.sin( rang ) * rdis
                lerpV2( particle.position, targetPosition, 0.9, particle.position )
            } else {                
                const rang = Math.PI * ( 10 / 12 + 1 / 3 * Math.random() )
                const rdis = 0.5 + Math.pow(Math.random(),4) * 2.5
                targetPosition.x = pmp.x + Math.cos( rang ) * rdis
                targetPosition.y = pmp.y + Math.sin( rang ) * rdis
                lerpV2( particle.position, targetPosition, 0.8, particle.position )
            }
        }
    } else if ( STATE === 'S2' ){
        const targetPosition = V2()
        for ( let r = 0 ; r < particles.els.length ; r++ ){
            const particle = particles.els[ r ]
            copyV2( pmp, targetPosition )
            lerpV2( particle.position, targetPosition, 0.3, particle.position )
        }
    } else {
        const targetPosition = V2()
        for ( let r = 0 ; r < particles.els.length ; r++ ){
            copyV2( pmp, targetPosition )
            const particle = particles.els[ r ]
            const d = Math.cos( r/10+ Date.now() / 1000 ) * ( 6 + Math.cos( Date.now() / 1000 ) )
            targetPosition.x += Math.cos( r+Date.now() / 1000 ) * d
            targetPosition.y += Math.sin( r+Date.now() / 1000 ) * d
            if ( ['L1','L2'].includes( STATE ) ){
                particle.color = [0.5+Math.random()/2,
                                  lerp(Math.random()/4,particle.color[1],0.5),
                                  lerp(Math.random()/4,particle.color[2],0.5)]
                //Math.random() * r]
            } else {
                particle.color = [Math.random(),Math.cos( r/10),r]
            }
            lerpV2( particle.position, targetPosition, 0.1, particle.position )
        }
    }
}
function lerp(a,b,p){ return ( 1 - p ) * a + p * b }
/*
  setTimeout( ()=> roller.command(), 1000)
  setTimeout( ()=> roller.command(1), 2000)
  setTimeout( ()=> roller.command(0), 3000)
*/
// function print(){
//     const s = gameState.state
//     console.log('->#',s.name,'l',s.level,'sl',s.sublevel,'lives',s.lives)
// }
// function say(m){
//     return function(){
//         gameState.event(m)
//     }
// }
// function repeat(r){
//     return function (...fs){
//         for (let i = 0 ; i < r ; i++){
//             fs.forEach( f => f() )
//         }
//     }
// 
//}ScratchBuffer
import { Square01Buffer, ScratchBuffer, play } from './music.js'

let done = false
window.addEventListener('keydown', e => {
    if ( done ) return
    done = true
  //  play()
})

function PlayerNoises(){

    const globalVolume = 0.5
    const ac = new AudioContext()

    function Scratching(){

        const noise = ac.createBufferSource(),
              gain = ac.createGain(),
              biquad = ac.createBiquadFilter()
              
        const t = ac.currentTime
        
        const noisebuffer = ScratchBuffer(ac,2)
        
        noise.playbackRate.value = 1
        noise.buffer = noisebuffer
        noise.loop = true
        noise.loopEnd = noisebuffer.length

        biquad.type = 'bandpass'
        biquad.frequency.value = 300
        biquad.Q.value = 0.1
        gain.gain.value = 1.0
        biquad.frequency.value
        

        noise.connect(biquad).connect( gain ).connect( ac.destination )
        noise.start( t + 0.1 )
        
        return { gain, biquad }
    }
    function Sonar(){
        const osc = ac.createOscillator(),
              gain = ac.createGain(),
              osc01 = ac.createBufferSource(),
              gain01 = ac.createGain()
              
        function build(){
            
            const t = ac.currentTime
            const osc01buffer = Square01Buffer(ac,1)
            osc.frequency.value = 0        
            gain.gain.value = 0              
            osc01.playbackRate.value = 1
            osc01.buffer = osc01buffer
            osc01.loop = true
            osc01.loopEnd = osc01buffer.length
            gain01.gain.value = 0       
            osc.connect( gain )
                .connect( gain01 )
                .connect( ac.destination )
            osc01.connect( gain01.gain )
            osc.start( t + 0.1 )
            osc01.start( t + 0.1)
            return ac
        }
        return { build, gain, osc, osc01 }
    }
    const sonar = Sonar()
    sonar.build()
    const scratching = Scratching()
    
    function  update( d ){
        if (ac){
            ac.resume()
        }
        const t = ac.currentTime,
              t1 = t + 1 / 32
        
        if ( d.wallDist !== undefined ){ 
            const lWallDist = Math.pow(d.wallDist,3)
            sonar.gain.gain.linearRampToValueAtTime( globalVolume/2, t1 )
            sonar.osc.frequency.linearRampToValueAtTime( 440 + 20 * lWallDist , t1 )
            sonar.osc01.playbackRate.linearRampToValueAtTime( 1 + lWallDist * 10, t1 )
        } else {
            sonar.gain.gain.linearRampToValueAtTime( 0, t1 )
            sonar.osc01.playbackRate.linearRampToValueAtTime( 1, t1 )
        }
        if ( d.hasCollision ){
            scratching.gain.gain.linearRampToValueAtTime( 2, t1 )
            scratching.biquad.frequency.linearRampToValueAtTime( 300 , t1 )
        } else {
            scratching.gain.gain.linearRampToValueAtTime( 0, t1 )
            scratching.biquad.frequency.linearRampToValueAtTime( 0 , t1 )
        }
       // console.log(d)
    }
    return { update }
}

