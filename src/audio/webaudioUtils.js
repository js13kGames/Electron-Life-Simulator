export function ms(ms){ return ms / 1000 }
export function sample1(sr){ return function( s ){ return s/sr } }
export function ftok( f ){
    return 69 + 12 * Math.log2( f / 440 )
}
export function ktof( k ) {
    return Math.pow(2,(k-69)/12) * 440
}
export function itrvstot( itrvs, t0 ){
    return itrvs.reduce( (r,x) => {
        return [ ...r, r[r.length-1] + x ]
    },[t0])
}
export function FftFreqs(size,f0){
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
export function adsr( ap, { values, durations }, t ){
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
export function asr( ap, { values, durations }, t ){
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
export function DelayChain( ac, ds  ){
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
export function periodWaveFromKeys( ac, chord, { size, nearestBins } ){
    const real = new Float32Array(size)
    const imag = new Float32Array(size)
    chord.forEach( k => {
        const [nearest] = nearestBins( k )
        real[nearest.i] = 0.5
    })
    return ac.createPeriodicWave(real, imag, {disableNormalization: true});
}
export function Square01Buffer( ac, length ){
    const bs = ac.sampleRate * length,
          hbs = bs / 2,
          ab =  ac.createBuffer(1, bs, ac.sampleRate),
          cd  = ab.getChannelData(0)
    for (let i = 0; i < hbs ; i++) {
        cd[i] = 0
    }
     for (let i = hbs; i < bs ; i++) {
        cd[i] = 1
    } 
    return ab    
}
export function NoiseBuffer(ac, length=0.25){
    const bs = ac.sampleRate * length,
          ab =  ac.createBuffer(1, bs, ac.sampleRate),
          cd  = ab.getChannelData(0)
    for (let i = 0; i < bs; i++) {
        cd[i] = Math.random() * 2 - 1;
    }
    return ab
}

export function ScratchBuffer(ac, length=0.25){
    const bs = ac.sampleRate * length,
          ab =  ac.createBuffer(1, bs, ac.sampleRate),
          cd  = ab.getChannelData(0)
    for (let i = 0; i < bs; i++) {
        if ( Math.random() > 0.985 ){
            cd[ i ] = 1
        } else {
            cd[i] = 0
        }
    }
    return ab
}
export function playBuffer( ac, b, d, t, loop = false ){
    const source = ac.createBufferSource();
    source.buffer = b;
    source.connect(d);
    source.loop = loop
    source.start(t);
    return source;    
}
export function GlobalGain( ac ){
    const g = ac.createGain()
    //    g.connect( ac.destination )
    g.gain.value = 0
    return g 
}
export function Record( channels, length, sampleRate, setup, ondone ){
    const fwac = new OfflineAudioContext(channels,length,sampleRate)
    setup( fwac )
    fwac.startRendering().then( ondone )
}
