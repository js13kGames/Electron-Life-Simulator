// general
import { ms, sample1, ftok, ktof, itrvstot, FftFreqs, adsr,
         asr, DelayChain, periodWaveFromKeys,
         NoiseBuffer,linearRampToValueAtTime,setValueAtTime,
         setValueNow, apFrequency, apGain, apQ, apDetune } from './webaudioUtils.js'

export function play(ac){

    let lastEnd
    ac.onstatechange = () => {
        if ( ac.state === 'running' )
            setInterval( () => {
                const ACT0 = ac.currentTime
                if ( (!lastEnd) || ( ac.currentTime > (lastEnd-1) ) ){
                    //console.log('at',ACT0,'restart song for', lastEnd || ACT0 )
                    lastEnd = planify( 0.5 + lastEnd || ACT0 )
                }
            },500)
        /*
        const T0 = Date.now() / 1000

        console.log('CHANGED!',ac.state,'ACT0',ACT0,'T0'
        //if ( ac.state === 'running')
        
        const end = planify(T0A)
        const dur = end - T0A
        const endsAt = Date.now() + dur * 1000
        console.log('start at',T0A,'dur',dur,'ends at',end,endsAt)
        setTimeout( () => {
            
        },)
        */
    }
    
    const KEYS = new Array(128).fill(0).map( (_,i) => i )
//    const distoCurve = makeDistortionCurve(400)
    const noiseBuffer = NoiseBuffer(ac,1)

    
    const sample = sample1(ac.sampleRate)

//    console.log(ac.sampleRate )
    const size = 256,
          f0 = 7.25

    const fftFreqs = FftFreqs(size,f0)
    
    //const chords = [[48+12,48+12+7,45,65],[50,73]]
    let chords = []
    if (true){
        const chordm = [48+12,48+12+3,48+12+7,
                        48+12+12,48+12+12+3,48+12+12+7],
              chord7 = [48+12,48+12+4,48+12+7,48+12+10]
              //chordO = [48+12,48+12+2,48+12],
              //chord = chordm
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
    //chords = chords.slice(0,3)
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
    

    //    console.log('noiseBuffer',noiseBuffer)
    let chordIdx = 0
    function planify( /*chords, */t ){
        //let t = 0
        const ci = chordIdx % chords.length,
              chord = chords[ ci ]
        //chords.forEach( (chord,ci) => {
        //const volumes = [ 0.5, 0.15, 0.25, 1/*0.25*/ ]
        const volumes = [ 1.4, // chord
                          1.1, // bass
                          0.3,   // lament
                          0.97,   // drums
                          1.6,   // bass drum
                          1.3    // hero
                        ]
        const sum = volumes.reduce((r,x)=>r+x,0)
        const boost = 1.5
        const vels = volumes.map( x => boost * x / sum )
        
        const endChord = playChord( chord, vels[0], t )
        const dur = endChord - t
      //  if ( ci > 3 )
            playBass( chord, dur, vels[1], t )
        
    //    if ( ci > 7 )
            playDrums( chord, dur, vels[3], t )
        
  //      if ( ci > 9 )
        //playLament( chord, dur, vels[2], t )
        
//        if ( ci > 12 )
            playBassDrum( chord, dur, vels[4], t )
        
        const c32p = ci % 32
        //if ( c32p > 16 )
            playHero( chord, dur, vels[5],t )
        
        //console.log(endChord,ac)
        //t = endChord
        //})
        chordIdx++
        return endChord
    }

    
    const heroOsc = ac.createOscillator(),
          heroGain = ac.createGain()
    
    const heroOscFrequency = apFrequency(heroOsc),
          heroOscFrequencyLinearRamp = linearRampToValueAtTime(heroOscFrequency),
          heroOscFrequencySetValueAtTime = setValueAtTime(heroOscFrequency),
          heroGainGain = apGain(heroGain),
          heroGainGainLinearRamp = linearRampToValueAtTime(heroGainGain),
          heroGainGainSetValueAtTime = setValueAtTime(heroGainGain)

    heroOsc.start( 0 )
    heroOsc.connect( heroGain ).connect( delayChain.input )
    heroGainGainSetValueAtTime( 0, 0 )
    
    function playHero( chord, dur, vel, t){
        
    
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
        
        
        /*
        heroOsc.frequency.setValueAtTime( ktof(notes[0]), t )
        heroGain.gain.setValueAtTime( 0, t )
        */
        heroOscFrequencySetValueAtTime( ktof(notes[0]), t )
        heroGainGainSetValueAtTime( 0, t )
        
        notes.forEach( (k,ki) => {
            const f = ktof( k )
            let start = t + ki * elDur
            end = start + elDur
            const t1 = start + 0.01 * dur,
                  t2 = start + 0.99 * dur
            //heroOsc.frequency.setValueAtTime( start )
            heroOscFrequencyLinearRamp( f, t1 )
            heroOscFrequencyLinearRamp( f, t2 )
            /*heroOsc.frequency.linearRampToValueAtTime( f, t1)
              heroOsc.frequency.linearRampToValueAtTime( f, t2)*/
            
            //gain.gain.setValueAtTime( 0, start )
            heroGainGainLinearRamp( 0, start)
            heroGainGainLinearRamp( vel, (start+t1)/2)
            heroGainGainLinearRamp( vel, (end+t2)/2)
            heroGainGainLinearRamp( 0, end)
            /*
            gain.gain.linearRampToValueAtTime( 0, start)
            gain.gain.linearRampToValueAtTime( vel, (start+t1)/2)
            gain.gain.linearRampToValueAtTime( vel, (end+t2)/2)
            gain.gain.linearRampToValueAtTime( 0, end)
            */

            /*
            if ( ki === ( notes.length - 1 ) ){
                gain.gain.linearRampToValueAtTime( 0, end )
            } else {
                //gain.gain.linearRampToValueAtTime( vel/4, end )
            }*/


        })
        //heroOsc.start( t )
        //heroOsc.stop( end ) 
        //heroOsc.connect( gain )
        //gain.connect( delayChain.input )
       
        //globalGain

    }
 
        const bdOsc = ac.createOscillator(),
              bdGain = ac.createGain()
        const bdOscFrequency = apFrequency(bdOsc),
              bdOscFrequencySetValueAtTime = setValueAtTime(bdOscFrequency),
              bdOscFrequencyLinearRamp = linearRampToValueAtTime(bdOscFrequency),
              
              bdGainGain = apGain(bdGain),
              bdGainGainSetValueAtTime = setValueAtTime(bdGainGain),
              bdGainGainLinearRamp = linearRampToValueAtTime(bdGainGain)
        bdOsc.start( 0 )
    //bdOsc.stop( end ) 
        bdOsc.connect( bdGain ).connect( globalGain )
    bdGainGainSetValueAtTime( 0, 0 )

    function playBassDrum( chord, dur, vel, t){
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

                bdOscFrequencySetValueAtTime( 100, start )
                bdOscFrequencyLinearRamp( 0, end )
                
                bdGainGainSetValueAtTime( 0, start )
                bdGainGainLinearRamp( vel, start+sample(100) )
                bdGainGainLinearRamp( 0, end )
                
                /*
                bdOsc.frequency.setValueAtTime( 100, start )
                bdOsc.frequency.linearRampToValueAtTime( 0, end )
                gain.gain.setValueAtTime( 0, start )
                gain.gain.linearRampToValueAtTime( vel, start+sample(100) )
                gain.gain.linearRampToValueAtTime( 0, end )
                */
            }
        })
      

    }
    

        const drumNoise = ac.createBufferSource(),
              drumBiquad = ac.createBiquadFilter(),
              drumGainNode = ac.createGain()
   
        const apDrumGainGain = apGain( drumGainNode ),
              apDrumGainGainSetValueNow = setValueNow( apDrumGainGain ),
              apDrumBiquadQ = apQ( drumBiquad ),
              apDrumBiquadQSetValueNow = setValueNow( apDrumBiquadQ ),
              //apBiquadQsetValueAtTime = setValueAtTime( apBiquadQ ),
              //apBiquadQlinearRamp = linearRampToValueAtTime( apBiquadQ ),
              apDrumBiquadFrequency = apFrequency( drumBiquad ),
              //apBiquadFrequencySetValueNow = setValueNow( apBiquadFrequency ),
              apDrumBiquadFrequencysetValueAtTime = setValueAtTime( apDrumBiquadFrequency ),
              apDrumBiquadFrequencylinearRamp = linearRampToValueAtTime( apDrumBiquadFrequency )

    drumNoise.buffer = noiseBuffer
    drumNoise.loop = true
    drumNoise.loopEnd = noiseBuffer.duration        


    drumBiquad.type = "bandpass"

    apDrumGainGainSetValueNow(0)

    
    drumNoise.connect(drumGainNode)        
        .connect(drumBiquad)
        .connect(globalGain)

    drumNoise.start()

    function playDrums( chord, dur, vel, t){
     
//        const flufshe = false

        //const rythme = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        //const rythme = [1,1,1,0,1,1,1,0,1,1,1,0,1,1,1]
        let rythme =  [2,0,
                      1,0,
                      1,0,
                      1,0,
                      
                      2,0,
                      1,0,
                      1,0,
                      1,1]
        // }

        
        //gainNode.gain.value = vel
        
        apDrumBiquadQSetValueNow(1)
        apDrumGainGainSetValueNow(0)


        
        const snareEnvelope = {
            values : [ 1.0, 0.8 ].map( x => x * vel ),
            durations : [ sample(20), sample(500), sample(3000), sample(500) ]
        }
        //const envelope = handClapEnvelope
        let end
        let elDur = dur / rythme.length
        /*
        if ( flufshe ){
            drumBiquad.Q.setValueAtTime( 10, t )
            drumBiquad.Q.linearRampToValueAtTime( 1, t+dur/2 )
            drumBiquad.Q.linearRampToValueAtTime( 5, t+dur )
        }*/
        
        rythme.forEach( (on,ri) => {
            const start = t + ri * elDur
            if ( on === 1 ){
                /*
                end = adsr( gainNode.gain, envelope,  start )               
                drumBiquad.frequency.setValueAtTime( ktof(chord[0])*4, start )
                drumBiquad.frequency.linearRampToValueAtTime( ktof(chord[0])/4, end )
                */
                end = adsr( apDrumGainGain, snareEnvelope,  start )               
                apDrumBiquadFrequencysetValueAtTime( ktof(chord[0])*4, start )
                apDrumBiquadFrequencylinearRamp( ktof(chord[0])/4, end )
            } else if ( on === 2 ){
                
                
            }
        })
        /*
          drumNoise.start(t)
        drumNoise.stop(end)
        */
        
    }
    const bassOsc = ac.createOscillator(),
          bassOscFrequencySetValueAtTime = setValueAtTime( apFrequency( bassOsc ) ),
          bassGainNode = ac.createGain(),
          apBassGainGain = apGain(bassGainNode)
    
    //osc.frequency.value = f
    bassOsc.type ="triangle"
    bassOsc.connect(bassGainNode).connect( globalGain )
    //gainNode.connect( delayChain.input )
    
    bassOscFrequencySetValueAtTime(0,0)
    bassOsc.start( 0 )
    function playBass( chord, dur, vel, t){

        // get key
        const tk = ( chord[0] % 12 )
        const ambitus = [48-7,48+7]
        const mk = KEYS
              .filter( k => tk === k%12 )
              .filter( k => ( k >= ambitus[0] ) && ( k <= ambitus[1] ) )
        if ( mk.length === 0 ) return
        if ( mk.length === 1 ){
            mk.push( mk[0]-1)
        }
        const f = ktof( mk[0] )

        const envelope = {
            values : [ 1.0, 0.8 ].map( x => x * vel ),
            durations : [ sample(100), sample(100), sample(4000), sample(500) ]
        }
        
        //console.log(envelope)
        rythme.forEach( (on,ri) => {
            if ( on ){

                const start = t + dur * ri / rythme.length
                const end = adsr( apBassGainGain, envelope,  start )
                const f = ktof( mk[ ri % mk.length ] )
                //console.log(ri,mk[ ri % mk.length ] ,f)
                //osc.frequency.setValueAtTime( f,  start)
                bassOscFrequencySetValueAtTime( f,  start)
            }
        })
        
        //bassOsc.stop( t + dur )
        
        
    }
    // function makeDistortionCurve(amount=0.1) {
    //     let n_samples = 512, curve = new Float32Array(n_samples);
    //     for (let i = 0 ; i < n_samples; ++i ) {
    //         let x = i * 2 / n_samples - 1;                
    //         curve[i] = x//(Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
    //     }
    //     return curve;
    // } 
    // function playLament( chord, dur, vel, t){
    //     const f = ktof(chord[0]),
    //           osc = ac.createOscillator(),
    //           oscFrequencySetValueNow = setValueNow( apFrequency( osc ) ),              
    //           gainNode = ac.createGain(),
    //           gainGainSetValueNow = setValueNow( apGain( gainNode  ) )

    //     // osc.frequency.value = f
    //     oscFrequencySetValueNow( f )
    //     gainGainSetValueNow( vel )
    //     //gainNode.gain.value = vel
        
    //     osc.connect(gainNode)
    //    // gainNode.connect( globalGain )
    //     //gainNode.connect( delayChain.input )



    //     let OUTPUT 
    //     {
        
    //         const distortion = ac.createWaveShaper(),
    //               mod = ac.createOscillator(),
    //               modFrequencySetValueNow = setValueNow( apFrequency( mod ) ),
    //               gain = ac.createGain()
            
    //         distortion.curve = distoCurve
            
    //         //mod.frequency.value = 10
    //         modFrequencySetValueNow(10)
            
    //         mod.start(t)
    //         mod.stop(t+dur)
    //         mod.connect( distortion )
    //         distortion.connect( apGain( gain ) )
            
    //         OUTPUT = gain
    //     }
    //     OUTPUT.connect( globalGain )
        
    //     gainNode.connect( OUTPUT )
    //     osc.start( t )
    //     osc.stop( t + dur )
    // }

    
    //chordOsc.start( t )

    function playChord( chord, vel, t ){
        
        const wave = periodWaveFromKeys( ac, chord, fftFreqs )
        
        const chordOsc = ac.createOscillator(),
              apChordOscFrequency = apFrequency( chordOsc ),
              apChordOscFrequencySetValueNow = setValueNow( apChordOscFrequency ),
              apChordOscFrequencySetValueAtTime = setValueAtTime( apChordOscFrequency ),
              apChordOscFrequencylinearRamp = linearRampToValueAtTime( apChordOscFrequency ),
              chordGainNode = ac.createGain(),
              apChordGainGain = apGain( chordGainNode )
              
        chordOsc.setPeriodicWave(wave);
        const vibratoEnvelope = {
            values : [ 20, 22 ],
            durations : [ 0.5, 1.5, 0.3 ]
        }

        const envelope = {
            values : [ 1.0, 0.4 ].map( x => x * vel ),
            durations : [ ms(16), ms(20), 2.0, 0.5 ]
        }
        // freq osc
        //{
        const chordModOsc = ac.createOscillator()
        setValueNow(apFrequency( chordModOsc ))( 5 )
        
        //mod.frequency.value = 5
        const chordModGain = ac.createGain()


        
        const vibEnvEnd = asr( apGain(chordModGain), vibratoEnvelope, t )



        chordModGain.connect( apDetune(chordOsc) )
        chordModOsc.connect( chordModGain )
        chordModOsc.start(t)
        chordModOsc.stop( vibEnvEnd )
        //}
        
        
        chordOsc.connect(chordGainNode).connect(delayChain.input)

        //osc.frequency.value = fftFreqs.f0
        apChordOscFrequencySetValueNow( fftFreqs.f0 )

        const envEnd = adsr( apChordGainGain, envelope,  t )

        // slight up ramp for frequency
        apChordOscFrequencySetValueAtTime( fftFreqs.f0, t )
        //chordOsc.frequency.setValueAtTime( fftFreqs.f0, t )
        apChordOscFrequencylinearRamp( fftFreqs.f0*1.02, envEnd )
        //chordOsc.frequency.linearRampToValueAtTime( fftFreqs.f0*1.02, envEnd )
        
        chordOsc.start( t )
        chordOsc.stop( envEnd )
        t += ( envEnd - t ) * 1
        return t
    }

    /*    function update(d){
        const t = ac.currentTime,
              t1 = t + 1 / 32
 
       if ( d.gain ){
            globalGain.gain.linearRampToValueAtTime( d.gain , t1 )
        } else {
            globalGain.gain.linearRampToValueAtTime( 0 , t1 )
        }
        
    }*/
    return {
        globalGain,
        //update,
        ac
    }
}

