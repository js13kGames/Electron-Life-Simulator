"use strict";
import { KeyboardControllers } from './keyboardControllers.js'
import { mkChoices } from './levelCreator.js'
import { Cols } from './cols.js'
import { lerp, clamp } from './maths/v1.js'
import { V2, cloneV2, copyV2, lerpV2} from './maths/v2.js'
import { Roller } from './roller.js'
import { canvasStyle, bodyStyle } from './css.js'
import { FeedbackBuffer } from './feedbackBuffer2.js'
import { TextMode, font1, font2, font4, TextScreen } from './textMode.js'
import { Missions } from './missions.js'
import { PlayerNoises } from './audio/playerNoises.js'
import { OneShotSampler } from './audio/oneShotSampler.js'
import { playBuffer, Record } from './audio/webaudioUtils.js'
import * as Music from './audio/music.js'

//
// sometime you wonder if you are just having an arbitrary life
//

document.body.style = bodyStyle

// time measurement
/*const Stats = require('stats.js')
  var stats = new Stats();
*/
//stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
//document.body.appendChild( stats.dom );
import * as measureFunction from './debug/measureFunction'


const ac = new AudioContext()
/*
  const sounds2 = {
  start : [0.5,,1049,,.09,.25,,.45,,,442,.05,,.1,,,,.51,.08,.1],
  nxt : [0.5,,1049,,.09,.25,,.45,,,442,.05,,.1,,,,.51,.08,.1],
  checkl : [1.2,,1322,.05,.12,.03,1,.02,31,7.7,,,,,,,.27,.33,.04,.01],
  //mssn : [2.3,,34,.02,,.04,2,2.05,,1,-14,.16,,.8,,,.09,,.16,.17],
  strt : [3.3,,565,.04,.19,0,,.33,,-4.1,,,,,,,.12,.05,,.55],
  //mssn : [1.7,,27,.02,.16,.18,3,.7,,-0.7,,,,.1,,,,.34,.21,.09], // prout
  //mssn : [,,1632,,.09,.12,,1.52,,,,,.09,,,,.09,.59,.08],
  mssn : [0.9,,1,,.09,.03,,.69,14,2,,,,.1,1.4],
  //z : [1.2,,674,.07,.18,.01,,.9,-25,,,,.02,.7],
  slw : [1.5,,803,.05,.43,.55,,1.86,,,-97,.02,.27,,,,,.64,.04],
  ///l1 : [2.7,,72,.01,,.32,2,1.51,,-0.6,,,.02,,,,.07,.63],
  sll : [2.2,,476,.04,.09,.64,4,3.96,.2,,,,,1,,.4,,.55,.04],
  l2 : [0.8,,29,,.21,.15,4,1.63,,.7,-137,.03,,,,,.11,,.1]
  }*/
let SOUND
// {
//     const duration = 0.2

//     const gGainGainEnveloppe = undefined
//     /*// undefined/
//         0,
//         0.001,       1,
//         0.015,       0.3,
//         0.5,        0
//     ]*/
//     const oscFrequencyEnveloppe = undefined
//     const oscGainGainEnveloppe = [0,
//                                 0.001,1,
//                                 0.015,1,
//                                 0.02,0
//                                ]

//     const noiseGainGainEnveloppe = [0,
//                                 0.001,3,
//                                 0.015,3,
//                                 0.02,0
//                                ]
//     const noisePlaybackRateEnveloppe = [1,0.5,0.9]

//     const modFrequencyEnveloppe = [100]
//     const modGainGainEnveloppe = [1000,0.05,100,0.5,1000]

//     const biquadFrequencyEnveloppe = [1000,0.5,0.1]
//     const biquadQEnveloppe = [10]

//     const delayDelayTimeEnveloppe = [0.002,0.5,0.2]
//     const delayDelayGainEnveloppe = [0.9,0.5,1]

//     const ordered =  [
//         duration,
//         gGainGainEnveloppe,
//         oscFrequencyEnveloppe,
//         oscGainGainEnveloppe,
//         noiseGainGainEnveloppe,
//         noisePlaybackRateEnveloppe,
//         modFrequencyEnveloppe,
//         modGainGainEnveloppe,
//         biquadFrequencyEnveloppe,
//         biquadQEnveloppe,
//         delayDelayTimeEnveloppe,
//         delayDelayGainEnveloppe
//     ]
//     SOUND= ordered
//     console.log('ORDERED SOUND*********************')
//     console.log( JSON.stringify( ordered ).replace(/null/g,'') )
//     console.log('*********************ORDERED SOUND')
// }
// monte bulle fantaise
let sounds
{
    const SOUND_BULLE = [1,[0,0.05,0.5,0.3,1,0.2,0],[250,0.2,520],[0,0.01,0.4,2,0.01,3,1],[0],[1,0.01,5,0.1,0.2,0.5,0],[1],[0],[1000,-0.35,2000,0.5,800,0.45,2000,4,4000],[1,0.5,5,1,0],[1,0.5,0.25,0.25,0.75,0.1,0.1,1,0],[1,0.5,0.25,1,0.3]]
    // tactactac
    const SOUND2 = [0.5,[1.5],[1,400,0.3,200],[1,0,0.01,4,0.04],[1,0.01,0],,[1,1,1000],[200],[5000,-0.5,100,1,300],[10,0.5,1,1,20],[0.1,1,0.05,1.5,5],[0.8,1,0.9]]

    // tole
    const SOUND3 = [2,[1,2,0],,[0],,[0.01,-1,4],,,,,[0.1],[1,1,0.5]]

    // bip

    const SOUND_BIP = [0.1]
    //const SOUND_BIP2 = [0.1,[1],[400,0.05,200,0.1,800]] // gorge
    const SOUND_BIP2 = [0.1,[1],[200,0.05,800,0.1,600]] // gorge
    const SOUND_PFOAN = [0.5,,,[1],[0],,[100],[1000,0.5,100],,,,]

    const SOUND_TOC = [0.1,[1],,[0,0.001,1,0.015,1,0.02,0],[0,0.001,3,0.015,3,0.02,0],[1,0.5,0.9],[100],[1000,0.05,100,0.5,1000],[1000,0.5,0.1],[10],[0.002,0.5,0.2],[0.9,0.5,1]]
    sounds = {
        // _test : SOUND,
        nxt :  SOUND_BIP,
        start :  SOUND3,
        checkl :  SOUND_BIP2,
        mssn :SOUND2,
        slw :SOUND_BULLE,
        sll :SOUND_TOC,
        l2 :SOUND_PFOAN,
    }
}




// win [,,506,.06,.26,.36,2,.45,.2,-1.1,282,.01,.04,,,,.01,.83,.02]
const oneShotSampler = OneShotSampler(ac, sounds)
const oneShot = oneShotSampler.players
const playerNoises = PlayerNoises(ac)
const musicPlayer = Music.play(ac)
const out = ac.createBiquadFilter()
out.type = 'lowpass'
out.frequency.value = 2500
out.connect( ac.destination )

oneShotSampler.globalGain.connect( out )
oneShotSampler.globalGain.gain.value = 0.6
playerNoises.globalGain.connect( out )
playerNoises.globalGain.gain.value = 1.0
musicPlayer.globalGain.connect( out )
musicPlayer.globalGain.gain.value = 0.9
/*
document.body.onkeypress = (e) => {
    if ( e.repeat ) return
    //    oneShot._test()
}
*/
/*
  musicPlayer.globalGain.gain.value = 0.0
  playerNoises.globalGain.gain.value = 0.0
  oneShotSampler.globalGain.gain.value = 1.0
*/
/*
  offline
  Record(2,ac.sampleRate * 60,ac.sampleRate,
  ac => {
  const musicPlayer = Music.play( ac )
  musicPlayer.globalGain.connect( ac.destination )
  musicPlayer.globalGain.gain.value = 1.0           
  },
  buffer => {
  console.log('rendered',buffer)
  playBuffer( ac, buffer, ac.destination, ac.currentTime, false )
  },
  ratio => {
  console.log('progress',ratio*100,"%")
  })
*/
/*
  import { PAD } from './pad.js'
  console.log(PAD)
*/

const ar = 16/9
const targetSize = {
    width : 256,
    height : Math.floor(256/ar)
}

function Display(){
    
    // 300 / 600 rect / ms
    
    const canvas = document.createElement('canvas')
    
    canvas.width =  targetSize.width 
    canvas.height = targetSize.height    
    canvas.setAttribute('name','MONMON')
    canvas.style = canvasStyle//'position: absolute ; top : 200px ; left : 0px;'   
    document.body.appendChild( canvas )
    const context = canvas.getContext('2d')

    const feedbackBuffer = FeedbackBuffer( context )
    
    const textMode = TextMode( textScreen, font1 )
    
    const nominalScale = 8
    //const nominalScale = 2//32
    
    const camera = {
        //center : { ...startPosition },
        center : { x:0,y:0},
        scale : nominalScale,
        nominalScale
    }
    //const canvas = context.canvas,
    const hcWidth = canvas.width / 2,
          hcHeight = canvas.height / 2
    
    function draw( { center, scale }, level, player,
                   particles, timeoutBar, lifeBar, remainingTo, Cols ){
        
        
        function drawMap(){
            const { map, width, height,
                    ij2idx, outij } = level
            const  cpx = center.x + 0.5,
                  cpy = center.y + 0.5,
                  //vismap = {
                  l = clamp(Math.floor( cpx - hcWidth / scale ),0,width-1),
                  r = clamp(Math.ceil( cpx + hcWidth / scale ),0,width-1),
                  b = clamp(Math.floor( cpy - hcHeight / scale ),0,height-1),
                  t = clamp(Math.ceil( cpy + hcHeight / scale ),0,height-1)

            for ( let i = l ; i < r  ; i++ ){
                for ( let j = b ; j < t ; j++ ){
                    let col
                    if ( outij(i,j) ){
                        col = [1,0,0]
                    } else {
                        const c = map[ ij2idx( i,j ) ]
                        col = Cols[c] || [1,0,0]
                    }
                    col = [...col]
                    //col[0]+=0.9*Math.random()
                    const rgba = csshsl( ...col ),
                          x = Math.floor( (i - cpx) * scale + hcWidth ),
                          y = Math.floor( (j - cpy) * scale + hcHeight )
                    context.fillStyle = rgba
                    //context.fillRect(x, y, scale-1, scale-1)
                    //context.fillRect(x, y, scale, scale)
                    //context.fillRect(x+1, y+1, scale-1, scale-1)
                    context.fillRect(x, y, scale, scale)
                }
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
        function drawParticle( context, { center, scale }, { color, position, dim },  i ){
            const sb = []
            context.fillStyle = cssrgba(...color)
            context.fillRect( ...box2screen( position.x,
                                             position.y,
                                             dim, dim, sb ) )
        }
        function drawTimeoutBar(){
            const height = 10
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
        //const draws = [
            //() => {
        context.fillStyle = 'rgba(0,0,0,1)'
        context.fillRect(0,0,canvas.width,canvas.height)
        //},
        //  () => {
        if (level && level.vis) drawMap()
        //},
        //            () => {
        if ( textMode.vis ) textMode.draw()
        //          },
        //        () => {
        const dx = Math.floor( ( canvas.width - textMode.canvas.width  )/ 2 ),
              dy = Math.floor( ( canvas.height - textMode.canvas.height ) / 2 )
        if ( textMode.vis ) context.drawImage( textMode.canvas,dx,dy )
        //},
        //    () => {
        if ( player.vis ) drawPlayer( context, camera)
        //  },
        //() => {
        particles.els.forEach( (particle,i) => {
            if ( particle.vis )
                drawParticle( context, camera, particle, i )
        })
        //            },
        //            () => {
        if ( timeoutBar.vis ){
            drawTimeoutBar()
        }
        //          },
        //        () => {
        feedbackBuffer.alter(context)
        //      },
        //    () => {
        if ( lifeBar.vis ){
            drawLifeBar()
        }
        //  }
//    ]
        //const start = Date.now()
        //return [ ...draws.map( measureFunction.time ), Date.now() - start ]
        
    }
    return { draw, camera, feedbackBuffer, textMode }
}


function cssrgba( r01,g01,b01,a=1){
    const r = Math.floor( 256 * r01 ),
          g = Math.floor( 256 * g01 ),
          b = Math.floor( 256 * b01 )
    return `rgba(${r},${g},${b},${a})`
}
function csshsl( h,s,l){
    return `hsl(${360*h},${100*s}%,${100*l}%)`
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

    nextPosition.y+= dt/1000000
    
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


    const NLIVES = 3
    const MAXMAX_LIVES = 8
    const NOMINAL_ENERGY = 1

    // debug REMOVEME
    let FIRST_LEVEL = 0 
    let FIRST_SUBLEVEL = 0
    const url_param_level = parseInt( new URL(document.URL).searchParams.get("level") )
    const url_param_sublevel = parseInt( new URL(document.URL).searchParams.get("sublevel") )
    if ( ! ( isNaN(url_param_level) || isNaN( url_param_sublevel ) ) ) {
        console.log('setting level to ',url_param_level)
        console.log('setting sublevel to ',url_param_sublevel)
        FIRST_LEVEL = url_param_level
        FIRST_SUBLEVEL = url_param_sublevel
    }
    // gubed
    
    const automata = {
        //I : { 'start' : d => update({name:'I0'}) },
        I : { 'start' : d => update({name:'I2'}) },
        // intro
        I0 : {
            '>' : () => {
                timeout( () => event('next'),4000)
            },
            'next' : () => {
                update({name:'I1'})
                oneShot.nxt()
            }
        },
        // title
        I1 : {
            '>' : () => {
                timeout( () => event('story'),10000)
            },
            'next' : () => {
                oneShot.start()
                update({name:'I2'})
            },
            'story' : () => {
                update({name:'I1S'})
            }
        },
        // story
        I1S : {
            '>' : () => {                
                timeout( () => event('next'),10000)
            },
            'next' : () => {
                oneShot.nxt()
                update({name:'I1'})
            },
        },
        // story+controls
        I2 : {
            'next' : () => {
                oneShot.nxt()
                update({
                    name:'I3',
                    level : FIRST_LEVEL,
                    sublevel : FIRST_SUBLEVEL,
                    L : NLIVES,
                    lives : NLIVES,
                    energy : NOMINAL_ENERGY,
                    nlevels : Missions.length,
                    //E : NOMINAL_ENERGY,
                })
            },
        },
        // ... 2nd screen
        I3 : {              
            'next' : () => {
                oneShot.mssn()
                update({name:'M1'})
            }
        },
        // level briefing
        M1 : {
            '>' : () => {                
                update({                    
                    nsublevels : Missions[ state.level ].subs.length
                })
            },
            'next' : () => {
                update({name:'S1'})
            },
        },
        // sublevel briefing
        S1 : {
            '>' : () => {
                oneShot.mssn()
                update({
                    choices: mkChoices(state.level,state.sublevel),
                    energy : NOMINAL_ENERGY,
                })
            },
            'next' : () => {
                update({name:'S2'})
            },
        },                 
        
        // ready set go
        S2 : {
            '>' : () => {
                oneShot.nxt()
                timeout( () => event('next'),4000)
            },
            'next' : () => {
                update({name:'S3'})
                oneShot.checkl()
            },
            
        },
        S3 : {
            'checkLine' : num => {
                //state.checkLines.push( { num, t : state.T } )
                oneShot.checkl()
                // console.log('state.checkLines',state.checkLines)
            },
            'damage' : d => {
                const energy = state.energy - d
                if ( energy  > 0 ){
                    update( { energy } )
                } else {
                    event('sublevel-lose')
                }
            },
            'sublevel-win' : d =>{
                update({ name : 'W1' })
                oneShot.slw()
            },
            'sublevel-lose' : d => {
                oneShot.sll()
                update( {
                    name : 'L1',
                    lives : state.lives - 1
                } )
            }
        },
        // sublevel won
        W1 : {
            'next' : () => {
                //oneShot.slw()
                const sublevel = state.sublevel + 1
                if ( sublevel < state.nsublevels ){
                    update({
                        sublevel,
                        name : 'S1'
                    })
                } else {
                    update({
                        sublevel,
                        name : 'W2'
                    })
                }
            }
        },
        // level won
        W2 : {
            'next' : () => {
                const level = state.level + 1
                if ( level < state.nlevels ){
                    const lives = Math.min(MAXMAX_LIVES,state.lives + 1),
                          L = Math.max(state.L,lives)
                    update({
                        sublevel : 0,
                        level,
                        lives,
                        L,
                        name : 'M1'
                    })
                } else {
                    update({
                        level,
                        name : 'W3'
                    })
                }
            }
        },
        // congratulations, thanks for playing
        'W3' : {
            '>' : d => {
                oneShot.slw()
            }
        },
        L1 : {
            '>' : d => {
            },  
            'next' : d => {
                const lives = state.lives 
                if ( lives > 0 ){
                    update({name:'S1'})
                } else {
                    update({name:'L2'})
                }
            }
        },
        // game lost animation
        L2 : {
            'next' : d => update({
                name:'I0',
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
            //console.error('wrong message?',cStateName,eName,{state, eName, eData},e)
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
            // console.log('STATE CHANGE',cStateName,'->',state.name)
        }
    }
    //setInterval( checkTimeouts, 200 )

    return {state,event,checkTimeouts}

    
}

function Player(){
    return {
        vis : true,
        position : V2(0,0),
        lastpos : V2(0,0)
    }
}
function Particles(){
    const PARTICLE_COUNT = 25
    const els = []
    for ( let i = 0 ; i < PARTICLE_COUNT ; i++ ){
        els[i] = {
            dim : 0.25,
            vis : true,
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
        vis : true,
    }
}
function LifeBar(){
    return {
        vis : true,
        l : 5, // current
        L : 5 // max
    }
}
const textScreen = TextScreen( 30, 16 )



const keyboardController = KeyboardControllers()
const gameState = GameState()
const display = Display()
const player = Player()
const particles = Particles()
//const texts = Texts()
const timeoutBar = TimeoutBar()
const lifeBar = LifeBar()



const step = (dt,T) =>{
    const timeoutBarVisibility = ['G1','S1','S2','L1']
    const mapVisibility = ['S2','S3','W1','W2','L1']
    const playerVisibility = ['S2','S3']
    const lifeBarVisibility = ['S1','S2','S3','W1','W2','L1']

    function stateName(){
        return gameState.state.name
    }
    function stateNameIs(n){
        return gameState.state.name === n
    }
    function stateIsOneOf( ...names ){
        return names.flat().includes( stateName() )
    }
    
    
    if ( stateNameIs('S2') ){
        copyV2(gameState.state.choices.startPosition, player.position)
    }
    
    const camera = display.camera
    const choices = gameState.state.choices

    // check timeouts
    const remainingTo = gameState.checkTimeouts(T)
    timeoutBar.remain = remainingTo
    //timeoutBar.vis =  (remainingTo !== undefined)   && timeoutBarVisibility.includes( stateName() )
    timeoutBar.vis =  (remainingTo !== undefined)   && stateIsOneOf(timeoutBarVisibility)
    
    if ( keyboardController.anyKeyStroke.length ){
        //  textScreen.cls()
    }
    const TIME_BEFORE_SKIP_STATE = 1000
    // grab input
    //    stats.begin()

    const sinceStateStart = T - gameState.state.t
    
    /*
      if ( ['I0','I1','G0','G1','G2','S1',
      'L1','L2','W2','W3','R0'].includes( stateName() ) ){*/
    if ( !stateIsOneOf('S2','S3') ){
        
        if ( sinceStateStart > TIME_BEFORE_SKIP_STATE ){
            if ( keyboardController.anyKeyStroke.length ){
                //console.log('to!')
                gameState.event('next')
            }
            textScreen.print(15,14,"any key to skip")
        }
    }
    
    const [[l,r],[d,u],[o,p]] = keyboardController.axesCtrlState
    keyboardController.resetKeyStrokes()

    let HASCOLLIDSION = false,
        DAMAGE = 0,
        WALLDIST = undefined
    
    let collision
    if ( stateIsOneOf(['S3','W1']) ){
        //
        // move and collisions
        //
        const { level, sublevel, nsublevels } = gameState.state
        const spd = Missions[level].subs[sublevel].spd || 0.5

        const speed01 = spd,
              minspeed = 160,
              maxspeed = 15,
              ff = (1-speed01) * minspeed + speed01 * maxspeed
        let dx,dy
        if ( stateNameIs('S3') ){
        //if ( ['S3'].includes( stateName() ) ){
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

        copyV2(player.position,player.lastpos)
        copyV2(nextPosition,player.position)
        
        if ( stateIsOneOf(['S3']) ){
            
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

    if( stateNameIs('S3') ){
        // checkLaps
        //  if (gameState.state.choices) {
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
            // console.log('step',idx,'/', choices.length - 2)
        }
        //        }
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
        const rayLength = 60
        const wallDist = frontRaycast( player.position, rayLength,['*'] )
        if ( wallDist !== undefined ){
            const wallProx = clamp((rayLength - wallDist - 1) / ( rayLength - 2 ),0,1 )
            WALLDIST = wallProx
            //// console.log('seen',wallProx)
        }
        
    }

    camera.scale *= ( 1 + ( -1*o + p ) / 10 ) 
    camera.scale = clamp( camera.scale, 4,32) // 4 wide zoom, 32 closeup

    if ( choices ){
        choices.vis = stateIsOneOf(mapVisibility)
    }
    player.vis = stateIsOneOf(playerVisibility)
    player.energy =  gameState.state.energy
    player.hasCollision = HASCOLLIDSION

    
    
    
    particles.hasCollision = HASCOLLIDSION
    {
        // const running =  ['S3'].includes( stateName() )

        const target = player.position
        updateParticles( particles, target, HASCOLLIDSION, collision,gameState.state.energy,  stateName() )
    }
    //if ( choices ) choices.vis = true
    if ( ( gameState.state.lives !== undefined )
         && ( gameState.state.lives !== undefined) ){
        lifeBar.l = gameState.state.lives
        lifeBar.L = gameState.state.L
    }
    lifeBar.vis = lifeBarVisibility.includes(  stateName() )
    copyV2( player.position, camera.center )
    


    playerNoises.update({
        energy : gameState.state.energy,
        hasCollision : HASCOLLIDSION,
        damage : DAMAGE,
        wallDist : WALLDIST,
        gain : 1,
        
    })
    const printCenter = textScreen.printCenter

    function printMission(showDirs,showFailure, showSublevelWin, showLevelWin ){
        const { level, sublevel, nsublevels } = gameState.state
        const ml = Missions[ level ],
              ms = ml.subs[ sublevel ]
        
        printCenter(1,`Mission #${level+1}`)
        printCenter(3,`"${ml.name}"`)
        if ( !showLevelWin){
            printCenter(5,`Hop #${sublevel+1}/${nsublevels}`)
            printCenter(7,`"${ms.name}"`)
        }
        if ( showDirs ){
            printCenter(9,'you follow the route:')
            printCenter(11,gameState.state.choices.directions.join('.'))
        }
        if ( showFailure ){
            printCenter(9,'you did not make it!')
            printCenter(11,'* hop failed *')
        }
        if ( showSublevelWin ){
            printCenter(9,'* hop successful *')
            printCenter(11,'you made it!')
        }
        if ( showLevelWin ){
            const level = gameState.state.level
            const endText = Missions[ level ].cleared
            printCenter(9,'* mission cleared! *')
            textScreen.printParagraphs( 11, endText+"\n",0 )
        }       

        /*
          let j = 4
          for ( let i = 0 ; i < nsublevels ; i++ ){
          //if ( i < level ){
          printCenter(j,`"${ml.subs[i].name}"`)
          j++
          //}
          }*/
        for ( let j = 0 ; j < (level+1) ; j++ ){
            //printCenter(6,`"${ms.name}"`)
        }
        //printCenter(j,`Hop #${sublevel+1}/${nsublevels}`)
        //printCenter(4,`Hop #${sublevel+1}/${nsublevels}`)
        //printCenter(6,`"${ms.name}"`)
    }
    
    display.textMode.vis = true
    textScreen.cls()
    if ( ['I2','I1S'].includes(stateName()) ){
        printCenter(1,'The Odyssey Begins...')
        const paragraphs = 'So many years have passed since your days as a newborn electron, freely roaming in some metallic conductor...\n\nThe time has come for you to start your wondeful journey and fulfill your duty for the almighty gods of electrons to be pleased.'
        textScreen.printParagraphs( 3, paragraphs, 0 )
        
        //textScreen.print(0,5,'"Follow the correct route, ignore the incorrect one or you will die", you can remember your electron mother say. This is your life, now !')
        //textScreen.print(0,8,'Mission are awaiting you. May the god of electrons be with you.')

    } else  if ( ['I3'].includes(stateName()) ){
        printCenter(1,'The Odyssey Begins...')
        
        const paragraphs = 'Now your destiny will always be to Follow the Correct Route In Pipes and lead the Sacred Data to its Destination. Every electron knows what happens when you fail to Follow the Correct Route...\n\n404 : Electronic DEATH!\n\nSo ALWAYS remember the ordered up and down Numbers of the Correct Route!\n\nGOOD LUCK!'
        textScreen.printParagraphs( 3, paragraphs, 0 )
        
        //textScreen.print(0,5,'"Follow the correct route, ignore the incorrect one or you will die", you can remember your electron mother say. This is your life, now !')
        //textScreen.print(0,8,'Mission are awaiting you. May the god of electrons be with you.'){
    }

    else if ( ['M1'].includes(stateName()) ){
        printMission()
    } else if ( ['G1'].includes(stateName()) ){
        printCenter(6,'level presentation')
        writeMission( textScreen, gameState.state.level )
    } else if ( ['G2'].includes(stateName()) ){
        printCenter(6,'sublevel'+gameState.state.sublevel, true )
        /*writeMission( textScreen,
          gameState.state.level || 1,
          gameState.state.sublevel || 1,
          undefined)*/
        //(gameState.state.choices && gameState.state.choices.directions) || [0])
    } else if ( ['I1'].includes(stateName()) ){
        printCenter(7,'electron life simulator')
    } else if ( ['I0'].includes(stateName()) ){
        printCenter(6,'lespin presents')
    } else if ( ['L1'].includes(stateName()) ){
        
        printMission(false,true)

    } else if ( ['L2'].includes(stateName()) ){
        printCenter(7,'404')
    } else if ( ['W1'].includes(stateName()) ){
        //        printCenter(6,'sublevel won')
        printMission(false,false,true)
    } else if ( ['W2'].includes(stateName()) ){
        //printCenter(6,'level won')
        printMission(false,false, false, true )
    } else if ( ['W3'].includes(stateName()) ){
        printCenter(5,'You Won It All!')
        printCenter(7,'Electron Gods are pleased')
        printCenter(8,'to welcome you !')
        printCenter(10,'Thanks for playing!')
    } else if ( ['S1'].includes(stateName()) ){
        printMission(true)
        
        
        
        //printCenter(6,'follow the route')
        //writeMission(textScreen,undefined,gameState.state.sublevel,gameState.state.choices.directions)
        
    } else if ( ['S2'].includes(stateName()) ){
        printCenter(9,'ready?')
    } else {
        //display.textMode.vis = false
    }
    //hud()
    function hud()
    {
        textScreen.print(0,14,stateName())
        let { level, nlevels, sublevel, nsublevels, lives, L } = gameState.state
        if ( level === undefined ) level = '??'
        if ( nlevels === undefined ) nlevels = '??'
        if ( sublevel === undefined ) sublevel = '??'
        if ( nsublevels === undefined ) nsublevels = '??'
        if ( lives === undefined ) lives = '??'
        if ( L === undefined ) L = '??'
        const s = s => s.toString()
        textScreen.print(0,15,
                         `lev:${s(level)}/${s(nlevels)} `
                         +`sub:${s(sublevel)}/${s(nsublevels)} `
                         +`lL:${s(lives)}/${s(L)}`)
        /*
          textScreen.print(4,15,s(level).toString())
          textScreen.print(7,15,sublevel.toString())
          textScreen.print(10,15,
          ''+lives.toString()
          +'/'
          +L.toString()
          +' lives')*/
    }

    const { feedbackBuffer } = display
    
    if ( stateIsOneOf('S2','S3') ){
        const a = feedbackBuffer.o.a
        feedbackBuffer.o.a = clamp(a+1/60/3,0,1)
    } /*else if ( (['S2'].includes(stateName())) ){
        feedbackBuffer.o.a = 0.02
        }*/ else {
            feedbackBuffer.o.a = 0.05
        }
    let cols
    {
        /*const slicedur = 200 // ms
          const disc = 32
          const f = (Math.floor(T/slicedur)%disc)/disc
          const tcol = T/1000
          const s = ( Math.sin(2*Math.PI*T/2000) * 2 ) - 1
        */
        if ( stateIsOneOf(mapVisibility) ){
            let hs = Missions[ gameState.state.level ].hs
            if ( !hs ){
                hs =  [0,1]

                // REMOVEME
                console.error('no color for level', gameState.state.level)
            }
            cols = Cols(...hs)
        }
    }
    
    
//    const elapsed =
          display.draw( camera, choices, player, particles, timeoutBar, lifeBar, remainingTo, cols )
  /*  if ( false ){
        if ( elapsed[ elapsed.length - 1 ] >= 8 ){
            // console.log(elapsed)
        } else {
            // console.log('<8')
        }
    }*/
    //    stats.end()

    //    texts.updateMessage('welcome','BONJOUR')
}
const roller = Roller(step)
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
