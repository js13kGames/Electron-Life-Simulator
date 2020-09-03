// general

function ms(ms){ return ms / 1000 }
function ftok( f ){
    return 69 + 12 * Math.log2( f / 440 )
}
function ktof( k ) {
    return Math.pow(2,(d-69)/12) * 440
}
function itrvstot( itrvs, t0 ){
    return itrvs.reduce( (r,x) => {
        return [ ...r, r[r.length-1] + x ]
    },[t0])
}
function FftFreqs(size,f0){
    // relation between frequency, midi key and fft bins
    const bins = new Array( size )
    {
        let f = f0
        for ( let b = 0 ; b < size ; b++ ){
            const f = b * f0,
                  k = ftok(f)
            bins[ b ] = { f,k,i:b }
        }
    }
    const _nbcache = {}
    function nearestBins( k ){
        if ( _nbcache[ k ] === undefined ){
            _nbcache[ k ] = [...bins].sort( (b1,b2) => {
                const k1 = b1.k,
                      k2 = b2.k
                return Math.abs(k1-k) - Math.abs(k2-k)
            })
        }
        return _nbcache[ k ]
    }
    return { size, f0, bins, nearestBins }
}

// enveloppes
function adsr( ap, { values, durations }, t ){
    //     adsr              gain
    //      o                0
    //     o ooo             1
    // 0_ o     o  _0
    //
    //      ad sr
    //    0 12 3 4
    const times = itrvstot( durations, t )
    ap.setValueAtTime(0, times[0] )        
    ap.linearRampToValueAtTime( values[0], times[1] )
    ap.linearRampToValueAtTime( values[1], times[2] )
    ap.linearRampToValueAtTime( values[1], times[3] )
    ap.linearRampToValueAtTime( 0, times[4] )
    return times[4]
}
function asr( ap, { values, durations }, t ){
    //   a    s   r          gain
    //       oooo            1
    //     oo    o           0
    // 1_ o       o _ 1       1
    //
    //    0  1  2 3    
    const times = itrvstot( durations, t )
    if ( times[0] === times[1] ){
        ap.setValueAtTime( values[0], times[1] )
    } else { 
        ap.setValueAtTime( 1, times[0] )
        ap.linearRampToValueAtTime( values[0], times[1] )
    }
    ap.linearRampToValueAtTime( values[1], times[2])
    if ( times[2] === times[3] ){
    } else {
        ap.linearRampToValueAtTime( 1, times[3])
    }
    return times[3]            
}
function DelayChain( ac, ds  ){
    const nodes = []
    for ( let i = 0 ; i < ds.length ; i++ ){
        const gn = ac.createGain(),
              dn = ac.createDelay()
        gn.gain.value = ds[ i ][1]
        dn.delayTime.value = ds[ i ][0]
        gn.connect( dn )
        if ( i > 0 ){
            nodes[ node.length - 1 ].connect( gn )
        }
        nodes.push( gn, dn )
    }
    const input = nodes[0],
          output = nodes[nodes.length-1]
    output.connect( input )
    return { input, output  }
}
function periodWaveFromKeys( ac, chord, { size, nearestBins } ){
    const real = new Float32Array(size)
    const imag = new Float32Array(size)
    chord.forEach( k => {
        const [nearest] = nearestBins( k )
        real[nearest.i] = 0.5
    })
    return ac.createPeriodicWave(real, imag, {disableNormalization: true});
}

export function play(){
    const ac = new AudioContext();
    
    const size = 256,
          f0 = 7.25

    const fftFreqs = FftFreqs(size,f0)
    
    const chords = []
    {
        const chordm = [48+12,48+12+3,48+12+7,
                        48+12+12,48+12+12+3,48+12+12+7],
              chord7 = [48+12,48+12+4,48+12+7,48+12+10],
              chord = chordm
        const transpositions = [0,1,0,1,6,3,0,-3,-6 ]
        for ( let q = 0 ; q < 12 ; q++){
            transpositions.forEach( t => {
                //chords.push( chord7.map( x => x + t ) )
                chords.push( chordm.map( x => x + t + ( 7 * q )%12 ))
            })
        }
    }

    const delayChain = DelayChain(ac, [[0.3,0.6]/*,[0.1,0.6]*/] )
    delayChain.output.connect( ac.destination )   
    
    let t = 0
    chords.forEach( chord => {
        t = playChord( chord, t )
    })
    

    function playChord( chord, t ){
        
        const wave = periodWaveFromKeys( ac, chord, fftFreqs )
        
        const osc = ac.createOscillator();
        osc.frequency.value = fftFreqs.f0
        osc.setPeriodicWave(wave);
        
        const gainNode = ac.createGain();
        osc.connect(gainNode)
        gainNode.connect(delayChain.input)
        
        const envelope = {
            values : [ 1.0, 0.4 ],
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
    
}

