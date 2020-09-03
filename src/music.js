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
function adsr( ap, { values, durations }, t ){
    //     adsr              gain
    //      o                0
    //     o ooo             1
    //    o     o
    //
    //      ad sr
    const times = itrvstot( durations, t )
    ap.setValueAtTime(0, times[0] )        
    ap.linearRampToValueAtTime( values[0], times[1] )
    ap.linearRampToValueAtTime( values[1], times[2] )
    ap.linearRampToValueAtTime( values[1], times[3] )
    ap.linearRampToValueAtTime( 0, times[4] )
    return times[4]
}


function Chords(){
    
    return chords
}
export function play(){
    const ac = new AudioContext();
    

    //
    const size = 256,
          f0 = 7.25

    const bins = new Array( size )

    let f = f0
    for ( let b = 0 ; b < size ; b++ ){
        const f = b * f0,
              k = ftok(f)
        bins[ b ] = { f,k,i:b }
    }
    console.log('bins',bins)

    function nearestBins( k ){
        return [...bins].sort( (b1,b2) => Math.abs(b1.k-k) - Math.abs(b2.k-k) )
    }
    // for ( let k = 48 ; k < 48+24 ; k++ ){
    //     const [nearest] =  nearestBins( k )
    //     //console.log('kk',k,nearest,k - nearest.k)
    // }
    
    const chordm = [48+12,48+12+3,48+12+7,
                    48+12+12,48+12+12+3,48+12+12+7],
          chord7 = [48+12,48+12+4,48+12+7,48+12+10],
          chord = chordm
    const chords = []
    const transpositions = [0,1,0,1,6,3,0,-3,-6 ]
    for ( let q = 0 ; q < 12 ; q++){
        transpositions.forEach( t => {
            //chords.push( chord7.map( x => x + t ) )
            chords.push( chordm.map( x => x + t + ( 7 * q )%12 ))
        })
    }
    let t = 0

    function DelayChain( ds  ){
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
    const delayChain = DelayChain( [[0.3,0.6]/*,[0.1,0.6]*/] )
    delayChain.output.connect( ac.destination )
    
    chords.forEach( chord => {

        function playChord( chord, t ){
            const real = new Float32Array(size)
            const imag = new Float32Array(size)
            for ( let i = 0 ; i < size ; i++ ){
                real[i] = 0
                imag[i] = 0
            }
            chord.forEach( k => {
                const [nearest] =  nearestBins( k )
                real[nearest.i] = 0.5
            })
            //        real[b] = 0.5
            //        real[b-5] = 0.5
            const wave = ac.createPeriodicWave(real, imag, {disableNormalization: true});        
            const osc = ac.createOscillator();
            osc.frequency.value = f0
            osc.setPeriodicWave(wave);
            
            const gainNode = ac.createGain();
            osc.connect(gainNode)
            //gainNode.connect(ac.destination)
            gainNode.connect(delayChain.input)

            const envelope = {
                values : [ 1.0, 0.4 ],
                durations : [ ms(16), ms(20), 2.0, 0.5 ]
            }
            const envEnd = adsr( gainNode.gain, envelope,  t )
            
            // freq osc
            {
                const mod = ac.createOscillator();
                mod.frequency.value = 5
                const modGain = ac.createGain()
                //modGain.gain.value = 10.0
                modGain.gain.setValueAtTime(1, t )        
                modGain.gain.linearRampToValueAtTime( 20, t+0.5)
                modGain.gain.linearRampToValueAtTime( 20, t+2)
                modGain.gain.linearRampToValueAtTime( 1, t+2.3)
                

                modGain.connect( osc.detune )
                mod.connect( modGain )
                mod.start()
            }
            
            osc.frequency.setValueAtTime( f0, t )
            osc.frequency.linearRampToValueAtTime( f0*1.02, envEnd )

            
            
            osc.start( t )
            osc.stop( envEnd )
            t += ( envEnd - t ) * 1
            return t
        }
        t = playChord( chord, t )
    })

}
