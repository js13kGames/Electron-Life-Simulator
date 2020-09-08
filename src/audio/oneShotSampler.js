import { playBuffer,  GlobalGain } from './webaudioUtils.js'
import { adsr,Record, DelayChain } from './webaudioUtils.js'
//const { zzfxBuffer } = require('./zz.js')
/*
function zzfxBuffer(){
    
}*/
function zzfxBuffer(...p){
    const o = {}
    Record( 1, 44100/2, 44100, ac => {
        console.log('write for p',p)
        const osc = ac.createOscillator()
        const gain = ac.createGain()
        const ogain = ac.createGain()
        const delay = ac.createDelay()
        delay.delayTime.value = 0.01
        osc.frequency.value = 220
        
        /*
        adsr( gain.gain, {
            values : [1,0],
            durations : [0.1,0.2,0.5,0.2]
        }, 0)
*//*
        adsr( osc.frequency, {
            values : [440,0],
            durations : [0.1,0.2,0.5,0.2]
        }, 0)
    */    
        adsr( ogain.gain, {
            values : [1,0],
            durations : [0.1,0.2,0.5,0.2]
        }, 0)
        adsr( delay.delayTime, {
            values : [1,0.01],
            durations : [0.1,0.2,0.5,0.2]
        }, 0)
        osc.connect(  ogain )
        osc.connect( delay ).connect( gain ).connect( ogain ).connect(ac.destination)
        gain.connect( delay )
        osc.start()      
    },(buffer)=> {
        console.log('done',buffer)
        o.b = buffer
    },(progress)=>{
        console.log('prog',progress)
    })
    //const osc = 
    return o
}
export function OneShotSampler( ac, sounds ){
    const globalGain = GlobalGain( ac )
    const players = Object.fromEntries(
        Object.entries( sounds )
            .map( ([n,p]) => [n,zzfxBuffer(...p)] )
            .map( ([n,b]) => [n, () => {
                console.log('playbuffer',b.b)
                playBuffer(ac, b.b, globalGain, ac.currentTime )
/*
                
                console.log('playbuffer',o)
                if ( b ){
                    playBuffer(ac, b, globalGain, ac.currentTime )
                }*/
            }] )
    )
    return { globalGain, players }
}

