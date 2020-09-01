const { knuthShuffle } = require('./shuffle.js')
require('./zzfx.js')

//
// https://github.com/keithclark/ZzFXM/
//

const instru1 = [1,0,440,
                 0.01,0.5,0.1, // asr
                 0, 2,           // shape
                 0, 0, // slide<
                 0, 0, // pitch jump>
                 0.5, // repeat 
                 0.0,  // noise
                 0.0,    // phase modulation
                 0.0,    // bitcrush
                 0.1, //delay
                 0.8,
                 0.2
                 
                ]
const instru2 = [1,0,440,
                 0.01,0.5,0.1, // asr
                 0, 2,           // shape
                 0, 0, // slide<
                 0, 0, // pitch jump>
                 0.5, // repeat 
                 0.0,  // noise
                 0.0,    // phase modulation
                 0.0,    // bitcrush
                 0.1, //delay
                 0.8,
                 0.2
                 
                ]
const instru3 = [ ...instru2 ]
instru3[ 6 ] = 1

function pause(){
    return 0
}
function note( pitch, fade = 0.5){
    return 1 + pitch + fade
}
function monopattern( instrument, pan, events, transpose = 0 ){    
    return [ instrument, pan, ...events.map( nf => nf + transpose ),  ]
}

function melody(){
    const m12 = p => p%12
    const eq12 = (p, q) => m12(p) === m12(q)
    
    const scale = [
        ...[0,2,4,5,7,9,10],
        //...[0,2,3,5,7].map( x => x + 12 )
        //...[0,2,3,5,7].map( x => x + 12 )
        //...[0,2,3,4,7,8,9,12]
        //...[0,1,2,3,4,5,6,7,8,9,10,11,12]
    ]
        
    //const scale = [0,2,4,5,7,9,11]
    
    const chords = []
    for ( let i = 0 ; i < scale.length ; i++ ){        
        const fond = scale[ i ]
        const m3 = scale.find( f => eq12( fond + 3, f ) )
        const M3 = scale.find( f => eq12( fond + 4, f ) )
        const j5 = scale.find( f => eq12( fond + 7, f ) )
        const m7 = scale.find( f => eq12( fond + 10, f ) )
        const M7 = scale.find( f => eq12( fond + 11, f ) )
        const pitches = [m3,M3,j5,m7,M7].filter( x => x !== undefined )
        chords.push({pitches,fond,m3,M3,j5,m7,M7})
    }
    
    const notesp1a = knuthShuffle([...scale])
    function sensible( seq ){
        const correct = []
        for ( let i = 0 ; i < seq.length ; i++ ){
            correct.push(seq[i])
            if ( eq12(seq[i],11) ){
                correct.push(12)
            }
        }
        return correct 
    }
    
    notesp1a.push( scale[0] )
    const notesp1 = sensible(notesp1a)//.flatMap( x => [x,x,x,x,x,x,x,x] )
    
    function semitoneFill( last, target ){
        const dist = target - last
        const dir = Math.sign( dist )
        return new Array( Math.abs( dist ) - 1 ).fill( 0 )
            .map( (_,idx) => last + dir * ( idx + 1 ) )
        
    }
    function fill( last, target, maxstep = 4 ){

        const dist = target - last
        const dir = Math.sign( dist )
        
        const fill = []
        
        if ( Math.abs( dist ) > maxstep ){
            const stfill = semitoneFill( last, target )
                  
            const st = stfill.filter( x => scale.includes( x ) )
            if ( st ){
                st.forEach( n => fill.push( n ) )
            }
        }
        return fill
    }
    function harp3fill( from, to ){
        const fil = fill( from, to, maxstep = 4 )
        const all = [ from, ...fil, to ]
        const shortcuts = []
        for ( let pos = 0 ; pos < all.length ; pos++ ){
            let source = all[ pos ]
            const thirdIdx = all.findIndex( (p,i) => {
                if ( i <= pos ) return false
                if ( eq12( source + 3, p ) ) return true
                if ( eq12( source + 4, p ) ) return true
            })
            shortcuts.push( [thirdIdx,all[thirdIdx]] )
        }
        all.pop()
        let hfill = []
        for ( let pos = 0 ; pos < all.length ; ){           
            hfill.push( all[ pos ] )            
            const [nidx,p] = shortcuts[ pos ]
            if ( nidx !== -1 ){
                pos = nidx 
            } else {
                pos++
            }
        }
        hfill.shift()
        return hfill
    }  
    const ppnotes1 = []
    for ( let i = 0 ; i < notesp1.length ; i++ ){
        const last = notesp1[ i - 1 ]
        const target = notesp1[ i ]
        if ( last ){
            const fil = fill( last, target,7 )
            if ( fil ){
                if ( fil.length > 4 ){
                    harp3fill( last, target ).forEach(  n => ppnotes1.push( n ) )
                } else {
                    fil.forEach( n => ppnotes1.push( n ) )
                }
            }
        }
        ppnotes1.push( target )
    }
    const notes1 = ppnotes1 

    //const notes1 = scale
    const fnotes1 = []
    const notes2 = []
    for ( let i = 0 ; i < notes1.length ; i++ ){
        
        const note1 = notes1[ i ]
        const lastNote2 = notes2[ notes2.length - 1 ]
        const lastNote1 = notes1[ i - 1 ]
        const nextNote1 = notes1[ i + 1 ]
        
        const m3 = scale.find( f => eq12( note1 + 3, f ) )
        const M3 = scale.find( f => eq12( note1 + 4, f ) )
        const m6 = scale.find( f => eq12( note1 + 8, f ) )
        const M6 = scale.find( f => eq12( note1 + 9, f ) )
        const variants = [m3,M3,m6,M6].filter( x => x !== undefined )
              .filter( x => x !== lastNote2 )
              .filter( x => x !== lastNote1 )
              .filter( x => x !== nextNote1 )
        const note2 = knuthShuffle(variants)[0]

        {
            let fil
            if (Math.random()>0.25){
                fil = sensible(harp3fill( lastNote2, note2 ))
            } else {
                fil = sensible(fill( lastNote2, note2,1 ))
            }
            if ( fil ){
                fil.forEach( n => {
                    notes2.push( n )
                    fnotes1.push( undefined )
                })
            }
        }

        
        
        notes2.push( note2 )
        fnotes1.push( note1 )
    }
    notes2.pop()
    notes2.push(7)
    return {notes1:fnotes1,notes2}
}
const mel = melody()

const tr = Math.round( ( Math.random() - 0.5 ) * 7 )
const events1 = mel.notes1.map( x => note(x+tr,0.5) )
const events2 = mel.notes2.map( x => note(x+tr,0.6) )

const tr2 = tr
const mel2 = melody()
const events21 = mel2.notes1.map( x => note(x+tr2,0.4) )
const events22 = mel2.notes2.map( x => note(x+tr2,0.6) )



    
const song  = [        
    [                  
        instru1,
        instru2,
        instru3
    ],
    [
        [
            monopattern(0,0,[...events1,0]),
            monopattern(1,0,[...events2,0]),
        ],
        [
            monopattern(0,0,[...events1,0],3),
            monopattern(1,0,[...events2,0],3),
        ]
        ,
        [
            monopattern(0,0,[...events1,0],6),
            monopattern(1,0,[...events2,0],6),
        ],
        [
            monopattern(0,0,[0,0,0,0]),
        ],
        [
            monopattern(2,0,[...events21,0]),
            monopattern(1,0,[...events22,0]),
        ],
        [
            monopattern(2,0,[...events21,0],1),
            monopattern(1,0,[...events22,0],1),
        ]
        ,
        [
            monopattern(0,0,[...events21,0],6),
            monopattern(1,0,[...events22,0],6),
        ],


    ],
    [       
        0,4,3,
        0,4,3,
        0,4,3,
        0,3,
        0,3,
        0,1,2,
        0,4,3,
        0,4,3,
        4,3,
        4,3,
        4,5,6,3,
        6,2,3,
        5,2,3,
        5,1,3,
        4,0,3,
        
    ],
    150,                                  // 120 BPM
    {                                     // Metadata
        title: "My Song",                      // Name of the song
        author: "Keith Clark"                  // Name of the author/composer
    }
]
//const { zzfxM, zzfxP } =
//      mkZzfx()
// Create a song
let mySongData = zzfxM(...song);

// Play the song (returns a AudioBufferSourceNode)
let myAudioNode = zzfxP(...mySongData);

// Stop the song
//myAudioNode.stop();

/*
  zzfx(...[,,925,.04,.3,.6,1,.3,,6.27,-184,.09,.17]); // Game Over
  zzfx(...[,,537,.02,.02,.22,1,1.59,-6.98,4.97]); // Heart
  zzfx(...[1.5,.8,270,,.1,,1,1.5,,,,,,,,.1,.01]); // Piano
  zzfx(...[,,129,.01,,.15,,,,,,,,5]); // Drum

*/
