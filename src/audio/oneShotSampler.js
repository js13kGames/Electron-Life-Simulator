import { playBuffer,  GlobalGain, NoiseBuffer,  adsr,Record, DelayChain } from './webaudioUtils.js'
//const { zzfxBuffer } = require('./zz.js')
/*
function zzfxBuffer(){
    
}*/

//


function non( ac,
              duration = 1,
              gGainGainEnveloppe,
              oscFrequencyEnveloppe,
              oscGainGainEnveloppe,
              noiseGainGainEnveloppe,
              noisePlaybackRateEnveloppe,
              modFrequencyEnveloppe,
              modGainGainEnveloppe,
              biquadFrequencyEnveloppe,
              biquadQEnveloppe,
              delayDelayTimeEnveloppe,
              delayDelayGainEnveloppe
              ){    
    const t0 = 0,// ac.currentTime,
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
    
    biquad.type = 'lowpass'
    noiseGain.connect( gGain )
    mod.connect( modGain ).connect( osc.detune )
    modGain.connect( noise.detune )
    osc.connect( oscGain ).connect( gGain )
    delayGain.connect( delay ).connect( gGain )
    
    gGain.connect( compressor ).connect( biquad ).connect( ac.destination )
    biquad.connect( delayGain )
    

    function program(ap,vts){
        if (!vts) return
        //console.log('PROGRAM',vts)
        //ap.value = vts[0]
        ap.setValueAtTime(vts[0],t0)
        ///ap.linearRampToValueAtTime(vts[0],t0)
        let t = 0
        for ( let i = 1 ; i < vts.length ; i++ ){
            let vt = vts[i]
            if ( i%2 ){
                t = vt
            } else {
                const f = ap[((t<0)
                              ?'exponential'
                              :'linear')+'RampToValueAtTime'].bind(ap)
                f( vt, t0 + Math.abs(t) )
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
    /*
      let i = 0
      const takeParams = () => params[i++]
    */    
    /*
    console.log('gen sound',{
        duration,
        gGainGainEnveloppe,
        oscFrequencyEnveloppe,
        oscGainGainEnveloppe,
        noiseGainGainEnveloppe,
        noisePlaybackRateEnveloppe,
        modFrequencyEnveloppe,
        modGainGainEnveloppe,
        biquadFrequencyEnveloppe,
        biquadQEnveloppe,
        delayDelayTimeEnveloppe,
        delayDelayGainEnveloppe
    })*/
    /*
    const ordered = params.slice(1)
    ;[
        gGain.gain,
        osc.frequency, 
        oscGain.gain, 
        noiseGain.gain,
        noise.playbackRate,
        mod.frequency, 
        modGain.gain, 
        biquad.frequency,
        biquad.Q,
        delay.delayTime, 
        delayGain.gain, 
    ].forEach( ap => {
        program( ap, ordered.shift())
    })
    */
    program( gGain.gain, gGainGainEnveloppe )

    program( osc.frequency, oscFrequencyEnveloppe )
    program( oscGain.gain, oscGainGainEnveloppe )

    program( noiseGain.gain, noiseGainGainEnveloppe )
    program( noise.playbackRate, noisePlaybackRateEnveloppe)
    
    program( mod.frequency, modFrequencyEnveloppe )
    program( modGain.gain, modGainGainEnveloppe )
    
    program( biquad.frequency,biquadFrequencyEnveloppe)
    program( biquad.Q,biquadQEnveloppe)

    program( delay.delayTime, delayDelayTimeEnveloppe )
    program( delayGain.gain, delayDelayGainEnveloppe )

    
    osc.start(t0)
    mod.start(t0)
    
}
function zzfxBuffer(...p){
    const o = {}
    Record( 1, p[0]*44100, 44100, ac => {
        non(ac,...p)
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
        //console.log('prog',progress)
    })
    //const osc = 
    return o
}

// function viewbuffer( n, b ){
//     const canvas = document.createElement('canvas')
//     const W = 600,
//           H = 300
//     canvas.height= H
//     canvas.width = W
//     document.body.appendChild(canvas)
    
//     const context = canvas.getContext('2d')
    
//     function toCanvas( t, v ){
//         return [
//             ( t / b.b.length )  * W,
//             ( v + 1 ) / 2 * H
//         ]
//     }
//     context.fillStyle = `rgba(255,255,255,1)`
//     context.fillRect(0,0,W,H)
//     const samples = b.b.getChannelData(0)
//     samples.forEach( (s,i) => {
//         const [x,y] = toCanvas(i,s)
//         if ( ( s > 1 ) || ( s < -1 )){
//             context.fillStyle = `rgba(255,0,0,1)`
//             context.fillRect(x,0,1,H)
//         } else {
//             context.fillStyle = `rgba(1,0,0,0.5)`
//             context.fillRect(x,y,1,1)
            
//         }
//     })
//     context.fillStyle = `rgba(0,0,0,1)`
//     context.font = 'monospace'
//     context.fontSize = '10px'
//     context.fillText( n,10,20)
// }

export function OneShotSampler( ac, sounds ){
    const globalGain = GlobalGain( ac )
    const players = Object.fromEntries(
        Object.entries( sounds )
            .map( ([n,p]) => [n,zzfxBuffer(...p)] )
            .map( ([n,b]) => [n, () => {
                //console.log('playbuffer',n,b.b)
                //viewbuffer( n, b )
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
