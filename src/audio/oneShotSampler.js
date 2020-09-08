import { playBuffer,  GlobalGain } from './webaudioUtils.js'
import { adsr,Record, DelayChain } from './webaudioUtils.js'
//const { zzfxBuffer } = require('./zz.js')
/*
function zzfxBuffer(){
    
}*/

//
function non( ac, params ){    
    const osc = ac.createOscillator(),
          mod = ac.createOscillator(),
          delay = ac.createDelay(), 
          oscGain = ac.createGain(),
          modGain = ac.createGain(),
          delayGain = ac.createGain(),
          gGain = ac.createGain(),
          compressor = ac.createDynamicsCompressor(),
          biquad = ac.createBiquadFilter()
    
    const duration = params[0]
    
    function program(ap,[e,t1,t2,v0,v1,v2,v3]){
        ap.value = v0
        let f = /*(v,t) => */ap[(e?'exponential':'linear')+'RampToValueAtTime'].bind(ap)//(v,t+ac.currentTime)
        
        f(0,v0)
        f(t1,v1)
        f(t2,v2)
        f(duration,v3)
        //ap.linearRampToValueAtTime(duration,v3)
        /*ap.linearRampToValueAtTime(0,v0)
        ap.linearRampToValueAtTime(t1,v1)
        ap.linearRampToValueAtTime(t2,v2)
        ap.linearRampToValueAtTime(duration,v3)
        */
    }    
    function program2(ap,[e,...vts]){
        ap.value = vts[0]
        const comp = [0,...vts,duration]
        for ( let i = 0 ; i < vts.length ; i++ ){
            
        }
        
    }
    mod.connect( modGain ).connect( osc.detune )
    mod.frequency.value = 1
    modGain.gain.value = 0
    
    osc.connect( oscGain )

//    delay.delayTime.value = 1
    
    oscGain.connect( gGain )
    gGain.connect( delayGain ).connect( delay ).connect( gGain )

    gGain.connect( compressor ).connect( biquad ).connect( ac.destination )
    biquad.frequency.value  = 1500
    biquad.type = 'lowpass'
    
    //    gGain.gain.value = params[1]
    
    const oscFrequencyEnveloppe = [
        0,
        0.05,0.5,
        800, 500, 200, 200
    ]
    program( osc.frequency, oscFrequencyEnveloppe )
    const oscGainGainEnveloppe = [
        0,
        0.01, 0.04,
        0,1,0.01,1
    ]
    program( oscGain.gain, oscGainGainEnveloppe)
    const delayDelayTimeEnveloppe = [
        0,
        0.25,0.75,
        1,0.5,0.25,0.1
    ]
    program( delay.delayTime, delayDelayTimeEnveloppe)
    
    const gGainGainEnveloppe = [
        0,
        0.05, 0.5,
        0.3, 1, 0.2, 0
    ]
        
    
    osc.start()
    mod.start()
    
}
function zzfxBuffer(...p){
    const o = {}
    Record( 1, 44100, 44100, ac => {
        non(ac,[0.5,1])
//         console.log('write for p',p)
//         const osc = ac.createOscillator()
//         const gain = ac.createGain()
//         const ogain = ac.createGain()
//         const delay = ac.createDelay()
//         delay.delayTime.value = 0.01
//         osc.frequency.value = 220
        
//         /*
//         adsr( gain.gain, {
//             values : [1,0],
//             durations : [0.1,0.2,0.5,0.2]
//         }, 0)
// *//*
//         adsr( osc.frequency, {
//             values : [440,0],
//             durations : [0.1,0.2,0.5,0.2]
//         }, 0)
//   */
//         /*adsr( osc.frequency, {
//             values : [220,220],
//             durations : [0.1,0.2,0.5,0.2]
//             }, 0)*/
//         adsr( ogain.gain, {
//             values : [1,0],
//             durations : [0.1,0.2,0.5,0.2]
//         }, 0)
//         adsr( delay.delayTime, {
//             values : [1,0.01],
//             durations : [0.1,0.2,0.5,0.2]
//         }, 0)
//         osc.connect(  ogain )
//         osc.connect( delay ).connect( gain ).connect( ogain ).connect(ac.destination)
//         gain.connect( delay )
//         osc.start()      
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
                console.log('playbuffer',n,b.b)
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


// function zzfxBuffer(...p){
//     const o = {}
//     Record( 1, 44100/2, 44100, ac => {
//         console.log('write for p',p)
//         const osc = ac.createOscillator()
//         const gain = ac.createGain()
//         const ogain = ac.createGain()
//         const delay = ac.createDelay()
//         delay.delayTime.value = 0.01
//         osc.frequency.value = 220
        
//         /*
//         adsr( gain.gain, {
//             values : [1,0],
//             durations : [0.1,0.2,0.5,0.2]
//         }, 0)
// *//*
//         adsr( osc.frequency, {
//             values : [440,0],
//             durations : [0.1,0.2,0.5,0.2]
//         }, 0)
//     */    
//         adsr( ogain.gain, {
//             values : [1,0],
//             durations : [0.1,0.2,0.5,0.2]
//         }, 0)
//         adsr( delay.delayTime, {
//             values : [1,0.01],
//             durations : [0.1,0.2,0.5,0.2]
//         }, 0)
//         osc.connect(  ogain )
//         osc.connect( delay ).connect( gain ).connect( ogain ).connect(ac.destination)
//         gain.connect( delay )
//         osc.start()      
//     },(buffer)=> {
//         console.log('done',buffer)
//         o.b = buffer
//     },(progress)=>{
//         console.log('prog',progress)
//     })
//     //const osc = 
//     return o
// }
