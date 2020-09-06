// general
import { ms, sample1, ftok, ktof, itrvstot, FftFreqs, adsr,
         asr, DelayChain, periodWaveFromKeys, Square01Buffer,
         NoiseBuffer, ScratchBuffer } from './webaudioUtils.js'

export function play(ac){
    
    const sample = sample1(ac.sampleRate)

//    console.log(ac.sampleRate )
    const size = 256,
          f0 = 7.25

    const fftFreqs = FftFreqs(size,f0)
    
    const chords = []
    {
        const chordm = [48+12,48+12+3,48+12+7,
                        48+12+12,48+12+12+3,48+12+12+7],
              chord7 = [48+12,48+12+4,48+12+7,48+12+10],
              chordO = [48+12,48+12+2,48+12],
              chord = chordO
        const transpositions = [0,1,0,1,6,3,0,-3,-6 ]
        for ( let q = 0 ; q < 12 ; q++){
            transpositions.forEach( t => {
                //chords.push( chord7.map( x => x + t ) )
                //chords.push( chordm.map( x => x + t + ( 7 * q )%12 ))
                chords.push( chordm.map( x => x + t + ( 7 * q )%12 ))
            })
            if ( q === 8 ){
                transpositions.forEach( t => {
                    chords.push( chord7.map( x => x + t + ( 7 * q )%12 ))
                })
            }
        }
        /*
        for ( let q = 0 ; q < 12 ; q++){
            transpositions.forEach( t => {
                //chords.push( chord7.map( x => x + t ) )
                //chords.push( chordm.map( x => x + t + ( 7 * q )%12 ))
                chords.push( chord7.map( x => x + t + ( 7 * q )%12 ))
            })
        }
        for ( let q = 0 ; q < 12 ; q++){
            transpositions.forEach( t => {
                //chords.push( chord7.map( x => x + t ) )
                //chords.push( chordm.map( x => x + t + ( 7 * q )%12 ))
                chords.push( chord7.map( x => x + t + ( 7 * q )%12 ))
            })
        }*/
    }
    // const rythme = [1,1,0,1,1,1,0,1,1] // BIEN
    const rythme = [1,1,0,1, 1,1,0,1]
    
    const delayChain = DelayChain(ac, [[0.3,0.6]/*,[0.1,0.6]*/] )

    const globalGain = ac.createGain()
    
        
    
    //distortion.connect( globalGain )
   
        
    //delayChain.output.connect( OUTPUT )
    delayChain.output.connect( globalGain )
//    OUTPUT = delayChain.input
    //distortion.connect( globalGain )
    
//     OUTPUT = delayChain
    

    const noiseBuffer = NoiseBuffer(ac,1)
//    console.log('noiseBuffer',noiseBuffer)

    let t = 0
    chords.forEach( (chord,ci) => {
        const vel = 0.5
        //const volumes = [ 0.5, 0.15, 0.25, 1/*0.25*/ ]
        const volumes = [ 1.4, // chord
                          1.1, // bass
                          0.3,   // lament
                          0.95,   // drums
                          1.6,   // bass drum
                          1.3    // hero
                        ]
        const sum = volumes.reduce((r,x)=>r+x,0)
        const boost = 3
        const vels = volumes.map( x => boost * vel * x / sum )
        
        const endChord = playChord( chord, vels[0], t )
        const dur = endChord - t
        if ( ci > 3 ){
            playBass( chord, dur, vels[1], t )
        }
        if ( ci > 7 ){
            playDrums( chord, dur, vels[3], t )
        }
        if ( ci > 9 ){
            playLament( chord, dur, vels[2], t )
        }
        if ( ci > 12 ){
            playBassDrum( chord, dur, vels[4], t )
        }
        const c32p = ci % 32
        if ( c32p > 16 ){
            playHero( chord, dur, vels[5],t )
        }
        t = endChord
    })
    function playHero( chord, dur, vel, t){

        const osc = ac.createOscillator(),
              gainNode = ac.createGain()

        const nnotes = rythme.length * 2 + Math.floor( Math.random() * 3 )
        const choices = chord.flatMap( x => [x,x + 3,x-3,x+1,x-1])
        const notes = []
        for ( let i = 0 ; i < nnotes ;i++ ){
            const rndNote = choices[ Math.floor( Math.random() * choices.length ) ]
            notes.push( rndNote )
        }
        //const notes=[chord,chord,chord].flat()
        const elDur = dur / notes.length
        let end
        


        osc.frequency.setValueAtTime( ktof(notes[0]), t )
        gainNode.gain.setValueAtTime( 0, t )
        notes.forEach( (k,ki) => {
            const f = ktof( k )
            let start = t + ki * elDur
            end = start + elDur
            const t1 = start + 0.01 * dur,
                  t2 = start + 0.99 * dur
            //osc.frequency.setValueAtTime( start )
            osc.frequency.linearRampToValueAtTime( f, t1)
            osc.frequency.linearRampToValueAtTime( f, t2)
            
            //gainNode.gain.setValueAtTime( 0, start )
            gainNode.gain.linearRampToValueAtTime( 0, start)
            gainNode.gain.linearRampToValueAtTime( vel, (start+t1)/2)
            gainNode.gain.linearRampToValueAtTime( vel, (end+t2)/2)
            gainNode.gain.linearRampToValueAtTime( 0, end)
            /*
            if ( ki === ( notes.length - 1 ) ){
                gainNode.gain.linearRampToValueAtTime( 0, end )
            } else {
                //gainNode.gain.linearRampToValueAtTime( vel/4, end )
            }*/


        })
        osc.start( t )
        osc.stop( end ) 
        osc.connect( gainNode )
        gainNode.connect( delayChain.input )
        //globalGain

    }
 

    function playBassDrum( chord, dur, vel, t){
        const osc = ac.createOscillator(),
              gainNode = ac.createGain()
        const rythme = [1,1,
                        1,0,
                        1,0,
                        1,0]
        const elDur = dur / rythme.length
        let end
        rythme.forEach( (r,ri) => {
            if ( r ){
                let start = t + ri * elDur
                end = start + Math.min(elDur-sample(10),0.5)
                
                osc.frequency.setValueAtTime( 100, start )
                osc.frequency.linearRampToValueAtTime( 0, end )
                gainNode.gain.setValueAtTime( 0, start )
                gainNode.gain.linearRampToValueAtTime( vel, start+sample(100) )
                gainNode.gain.linearRampToValueAtTime( 0, end )
            }
        })
        osc.start( t )
        osc.stop( end ) 
        osc.connect( gainNode )
        gainNode.connect( globalGain)

    }
    
    function playDrums( chord, dur, vel, t){
        const noise = ac.createBufferSource(),
              biquad = ac.createBiquadFilter(),
              gainNode = ac.createGain()

        const flufshe = false

        //const rythme = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        //const rythme = [1,1,1,0,1,1,1,0,1,1,1,0,1,1,1]
        let rythme
        if ( flufshe ){
            rythme = [
                1,1,1,
                1,0,1,
                0,0,1,
                1,0,1,
                1,1,1,
                1,0,0,
                0,0,1,
                1,0,1,
                1,0,1,
                0,1,1,
            ]
        } else {
            /*rythme = [0,1,
                      1,1,
                      0,1,
                      1,1,
                      1,0,
                      0,1,
                      1,1,
                      0,1]*/
            rythme = [2,0,
                      1,0,
                      1,0,
                      1,0,
                      
                      2,0,
                      1,0,
                      1,0,
                      1,1]
        }
            
        
        gainNode.gain.value = vel
        noise.buffer = noiseBuffer
        noise.loop = true
        noise.loopEnd = noiseBuffer.duration
        biquad.type = "bandpass"        
        biquad.Q.value = 1 // default
        
        gainNode.gain.value = 0

        noise.connect(gainNode)        
        gainNode.connect(biquad)
        if ( flufshe ){
            biquad.connect( delayChain.input )
        } else {
//            biquad.connect( delayChain.input )
            biquad.connect(globalGain)
        }
        

        
        const handClapEnvelope = {
            values : [ 1.0, 0.8 ].map( x => x * vel ),
            durations : [ sample(10), sample(100), sample(10), sample(20) ]
        }
        const snareEnvelope = {
            values : [ 1.0, 0.8 ].map( x => x * vel ),
            durations : [ sample(20), sample(500), sample(3000), sample(500) ]
        }
        //const envelope = handClapEnvelope
        const envelope = snareEnvelope
        let end
        let elDur = dur / rythme.length
        if ( flufshe ){
            biquad.Q.setValueAtTime( 10, t )
            biquad.Q.linearRampToValueAtTime( 1, t+dur/2 )
            biquad.Q.linearRampToValueAtTime( 5, t+dur )
        }
        
        rythme.forEach( (on,ri) => {
            const start = t + ri * elDur
            if ( on === 1 ){
                end = adsr( gainNode.gain, envelope,  start )              
                biquad.frequency.setValueAtTime( ktof(chord[0])*4, start )
                biquad.frequency.linearRampToValueAtTime( ktof(chord[0])/4, end )
            } else if ( on === 2 ){
                
                
            }
        })
        noise.start(t)
        noise.stop(end)
        
    }
    function playBass( chord, dur, vel, t){

        // get key
        const tk = ( chord[0] % 12 )
        const ks = new Array(128).fill(0).map( (_,i) => i )
        const ambitus = [48-7,48+7]
        const mk = ks
              .filter( k => tk === k%12 )
              .filter( k => ( k >= ambitus[0] ) && ( k <= ambitus[1] ) )
        if ( mk.length === 0 ) return
        if ( mk.length === 1 ){
            mk.push( mk[0]-1)
        }
        const f = ktof( mk[0] ),
              osc = ac.createOscillator(),
              gainNode = ac.createGain()
        //osc.frequency.value = f
        osc.type ="triangle"
        
        const envelope = {
            values : [ 1.0, 0.8 ].map( x => x * vel ),
            durations : [ sample(100), sample(100), sample(4000), sample(500) ]
        }
        //console.log(envelope)
        rythme.forEach( (on,ri) => {
            if ( on ){

                const start = t + dur * ri / rythme.length
                const end = adsr( gainNode.gain, envelope,  start )
                const f = ktof( mk[ ri % mk.length ] )
                //console.log(ri,mk[ ri % mk.length ] ,f)
                osc.frequency.setValueAtTime( f,  start)
            }
        })
        
        osc.connect(gainNode)
        gainNode.connect( globalGain )
        //gainNode.connect( delayChain.input )
        osc.start( t )
        osc.stop( t + dur )
        
        
    }
    function playLament( chord, dur, vel, t){
        const f = ktof(chord[0]),
              osc = ac.createOscillator(),
              gainNode = ac.createGain()
        osc.frequency.value = f
        gainNode.gain.value = vel 
        osc.connect(gainNode)
       // gainNode.connect( globalGain )
        //gainNode.connect( delayChain.input )



        let OUTPUT 
        {
            function makeDistortionCurve(amount=0.1) {
                let n_samples = 512, curve = new Float32Array(n_samples);
                for (let i = 0 ; i < n_samples; ++i ) {
                    let x = i * 2 / n_samples - 1;                
                    curve[i] = x//(Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
                }
                return curve;
            } 
            const distortion = ac.createWaveShaper(),
                  mod = ac.createOscillator(),
                  gain = ac.createGain()
            
            distortion.curve = makeDistortionCurve(400);
            mod.frequency.value = 10
            mod.start()
            mod.connect( distortion )
            distortion.connect( gain.gain )
            
            OUTPUT = gain
            OUTPUT.connect( globalGain )
        }
        
        gainNode.connect( OUTPUT )
        osc.start( t )
        osc.stop( t + dur )
    }

    function playChord( chord, vel, t ){
        
        const wave = periodWaveFromKeys( ac, chord, fftFreqs )
        
        const osc = ac.createOscillator();
        osc.frequency.value = fftFreqs.f0
        osc.setPeriodicWave(wave);
        
        const gainNode = ac.createGain();
        osc.connect(gainNode)
        gainNode.connect(delayChain.input)
        
        const envelope = {
            values : [ 1.0, 0.4 ].map( x => x * vel ),
            durations : [ ms(16), ms(20), 2.0, 0.5 ]
        }
        const envEnd = adsr( gainNode.gain, envelope,  t )

        const vibratoEnvelope = {
            values : [ 20, 22 ],
            durations : [ 0.5, 1.5, 0.3 ]
        }
        
        // freq osc
        {
            const mod = ac.createOscillator();
            mod.frequency.value = 5
            const modGain = ac.createGain()
            const vibEnvEnd = asr( modGain.gain, vibratoEnvelope, t )
            modGain.connect( osc.detune )
            mod.connect( modGain )
            mod.start(t)
        }

        // slight up ramp for frequency
        osc.frequency.setValueAtTime( fftFreqs.f0, t )
        osc.frequency.linearRampToValueAtTime( fftFreqs.f0*1.02, envEnd )
        
        osc.start( t )
        osc.stop( envEnd )
        t += ( envEnd - t ) * 1
        return t
    }
    function update(d){
        const t = ac.currentTime,
              t1 = t + 1 / 32
 
       if ( d.gain ){
            globalGain.gain.linearRampToValueAtTime( d.gain , t1 )
        } else {
            globalGain.gain.linearRampToValueAtTime( 0 , t1 )
        }
        
    }
    return {
        globalGain,
        update,
        ac
    }
}
