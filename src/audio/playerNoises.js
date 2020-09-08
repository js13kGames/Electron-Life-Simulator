/*import { ms, sample11, ftok, ktof, itrvstot, FftFreqs, adsr,
         asr, DelayChain, periodWaveFromKeys, Square01Buffer,
         NoiseBuffer, ScratchBuffer } from './webaudioUtils.js'
*/
import { Square01Buffer, ScratchBuffer, GlobalGain } from './webaudioUtils.js'

export function PlayerNoises(ac){
    
    function Scratching(){
        const noise = ac.createBufferSource(),
              gain = ac.createGain(),
              biquad = ac.createBiquadFilter()
        function build(){
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
            noise.connect(biquad).connect( gain ).connect( globalGain )
            noise.start( t + 0.1 )
        }
        return { build, gain, biquad }
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
                .connect( globalGain )
            osc01.connect( gain01.gain )
            osc.start( t + 0.1 )
            osc01.start( t + 0.1)
            return ac
        }
        return { build, gain, osc, osc01 }
    }

    const globalGain = GlobalGain(ac)

    const sonar = Sonar()
    sonar.build()
    const scratching = Scratching()
    scratching.build()

    
    function update( d ){
        //return
        ac.resume()
        const t = ac.currentTime,
              t1 = t + 1 / 32
        
        if ( d.wallDist !== undefined ){ 
            const lWallDist = Math.pow(d.wallDist,3)
            sonar.gain.gain.linearRampToValueAtTime( 0.1, t1 )
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
        if ( d.gain ){
            globalGain.gain.linearRampToValueAtTime( d.gain , t1 )
        } else {
            globalGain.gain.linearRampToValueAtTime( 0 , t1 )
        }
        // console.log(d)
    }
    return { update, globalGain }
}

