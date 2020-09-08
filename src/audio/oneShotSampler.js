import { playBuffer,  GlobalGain, NoiseBuffer,  adsr,Record, DelayChain } from './webaudioUtils.js'
//const { zzfxBuffer } = require('./zz.js')
/*
function zzfxBuffer(){
    
}*/

//


function non( ac, params ){    
    const duration = params[0],
          osc = ac.createOscillator(),
          noiseBuffer = NoiseBuffer(ac,duration),
          noiseGain = ac.createGain(),
          noise = playBuffer(ac,noiseBuffer,noiseGain,0,true),
          mod = ac.createOscillator(),
          delay = ac.createDelay(), 
          oscGain = ac.createGain(),
          modGain = ac.createGain(),
          delayGain = ac.createGain(),
          gGain = ac.createGain(),
          compressor = ac.createDynamicsCompressor(),
          biquad = ac.createBiquadFilter()

    //    biquad.type = 'bandpass'
    noiseGain.connect( gGain )
    mod.connect( modGain ).connect( osc.detune )
    osc.connect( oscGain ).connect( gGain )
    gGain.connect( delayGain ).connect( delay ).connect( gGain )
    gGain.connect( compressor ).connect( biquad ).connect( ac.destination )

    

    function program(ap,vts){
        if (!vts) return
        //console.log('PROGRAM',vts)
        ap.value = vts[0]
        //ap.linearRampToValueAtTime(vts[0],0)
        let t = 0
        for ( let i = 1 ; i < vts.length ; i++ ){
            let vt = vts[i]
            if ( i%2 ){
                t = vt
            } else {
                const f = ap[((t<0)
                              ?'exponential'
                              :'linear')+'RampToValueAtTime'].bind(ap)
                f( vt, Math.abs(at) )
                //console.log(((t<0)?'exp':'lin'),vt,'@',at)
            }
        }
        
    }
    /*
      osc.frequency       *
      mod.frequency       *
      delay.delayTime     *
      oscGain.gain,       *
      modGain.gain,       *
      delayGain.gain,     *
      gGain.gain          *
      biquad.frequency    *
      biquad.Q
    */
    const modGainGainEnveloppe = [
        0
    ]
    const modFrequencyEnveloppe = [
        1
    ]
    const biquadFrequencyEnveloppe =  [
        1000,
        -0.35,2000,
        0.5,800,
        0.45,2000,
        4,4000,
    ]
    const biquadQEnveloppe =  [
        1,
        0.5,5,
        1.0,0
    ]
    const oscFrequencyEnveloppe = [250,0.2,520]
    const oscGainGainEnveloppe  = [
        0,
        0.01,0.04,
        2,0.01,
        3,1.0
    ]
    const delayDelayTimeEnveloppe = [
        1,
        0.5,  0.25,
        0.25, 0.75,
        0.1, 0.1,
        1,    0,
    ]
    const delayDelayGainEnveloppe = [
        1,
        0.5,  0.25,
        1,    0.3
    ]
    const gGainGainEnveloppe = [
        0,
        0.05, 0.5,
        0.3, 1,
        0.2, 0
    ]
    const noiseGainGainEnveloppe = [1]
    const noisePlaybackRateEnveloppe = [
        1,
        0.01,5,
        0.1,0.2,
        0.5, 0]
    program( noiseGain.gain, noiseGainGainEnveloppe )
    program( noise.playbackRate, noisePlaybackRateEnveloppe)
    program( modGain.gain, modGainGainEnveloppe )
    program( mod.frequency, modFrequencyEnveloppe )
    program( biquad.frequency,biquadFrequencyEnveloppe)
    program( biquad.Q,biquadQEnveloppe)
    program( osc.frequency,oscFrequencyEnveloppe )
    program( oscGain.gain, oscGainGainEnveloppe )
    program( delay.delayTime, delayDelayTimeEnveloppe )
    program( delayGain.gain, delayDelayGainEnveloppe )
    program( gGain.gain, gGainGainEnveloppe )
    
        
    
    osc.start()
    mod.start()
    
}
function zzfxBuffer(...p){
    const o = {}
    Record( 1, 44100, 44100, ac => {
        non(ac,[10,1])
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
        //console.log('done',buffer)
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
