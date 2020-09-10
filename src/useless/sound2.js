const { knuthShuffle } = require('./shuffle.js')
require('./zzfx.js')
const twelvetones = [0,1,2,3,4,5,6,7,8,9,10,11]
const instru1 = instrumentFromProps({
    // volume
    volume : 1,
    // pitch
    frequency : 440,
    randomness : 0,
    // ['slide','How much to slide frequency (kHz/s)','0','-1000000000','1000000000'],
    // ['deltaSlide','How much to change slide (kHz/s/s)','0','-1000000000','1000000000'],
    // ['pitchJump','Frequency of pitch jump (Hz)','0','-1000000000','1000000000'],
    // ['pitchJumpTime','Time of pitch jump (seconds)','0','-1000000000','1000000000'],
    // adsr
    attack : 0.01,
    decay : 0.1,
    sustain : 0.5,
    sustainVolume : 0.7,
    release : 0.1,
    // generator
    shape : 0, //    ['shape','Shape of the sound wave (0=sin, 1=triangle, 2=saw, 3=tan, 4=bit noise)','0','-','-'],
    shapeCurve : 2, // ['shapeCurve','Squarenes of wave (0=square, 1=normal, 2=pointy)','0','0','1000000000'],
    //['noise','How much random noise to add (percent)','0','-1000000000','1000000000'],
    // fx
    //['repeatTime','Resets some parameters periodically (seconds)','0','-1000000000','1000000000'],
    //['modulation','Frequency of modulation wave, negative flips phase (Hz)','0','-1000000000','1000000000'],
    //['bitCrush','Resamples at a lower frequency in (samples*100)','0','-1000000000','1000000000'],
    //['delay','Overlap with itself for reverb and flanger effects (seconds)','0','0','1000000000'],
    //delay : 0.125,
    //modulation : 1,
    //repeatTime : 0.2,
})
const instru2 = instrumentFromProps(
    Object.assign( {}, propsFromInstrument( instru1 ), {
        volume : 0.8,
        frequency:220,
        sustain : 0.5,
        shape : 1,
        //bitCrush : 1
    })
)
function chordStructure(){
    const o = 12
    const s = [
        [0],
        [3,4],
        [6,7],
        [10,11],
        [2+o,1+o],
        [5+o],
        [8+o,9+o],
    ]
    function allChords( lefts, rights ){
        const rs = rights.shift()
        if ( !rs ) return lefts
        const progs = []
        for ( let l of lefts )
            for ( let r of rs )
                progs.push( [ ...l, r ] )
        return allChords( progs, rights )
    }
    const chords = allChords([[]], s )
    return chords
}
function eq12(a,b){
    return parseInt(a)%12 === parseInt(b)%12
}
function justChord( chord ){
    const fond = chord[ 0 ]
    for ( let i = 1 ; i < chord.length ; i++ ){
        // 7 - / 2 - 
        if ( eq12( fond + 6, chord[i] ) || eq12( fond + 1, chord[i] ) )
            return false
        // 11
        if ( eq12( fond + 11, chord[i] ) )
            return false
    }
    return true
}
function majorChord( chord ){
    const fond = chord[ 0 ]
    for ( let i = 1 ; i < chord.length ; i++ ){
        // 7 - / 2 - 
        if ( eq12( fond + 3, chord[i] ) || eq12( fond + 1, chord[i] ) )
            return false
    }
    return true
}
function transp(t,array){
    const l = array.length,
          a = []
    for ( let i = 0 ; i < l ; i++ ){
        a[ i ] = array[ i ] + t
    }
    return a    
}
function rotate(d,array){
    const l = array.length,
          a = []
    for ( let i = 0 ; i < l ; i++ ){
        a[ i ] = array[ ( i - d + l ) % l ]
    }
    return a
}

function note( pitch, fade = 0.5){
    return 2 + pitch + fade
}
function monopattern( instrument, pan, events, transpose = 0 ){    
    return [ instrument, pan, ...events.map( nf => {
        const p = parseFloat( nf )
        if ( isNaN( p ) ){
            return 0
        } else {
            if ( nf < 0 ){
                return -1
            } else {
                return 1 + nf + transpose
            }
        }
    })]
}
function pattern( ...monopatterns ){
    return monopatterns
}
function multipattern( chords ){
    const nvoices = chords.reduce( (r,x) => Math.max(r,x.length),0 )
    const monos = new Array( nvoices ).fill(0).map( () => [] )
    chords.forEach( chord => {
        monos.forEach( (mono,i) => {
            mono.push( chord[ i ] )
        })        
    })
    return monos.map( m => monopattern( 0,0.5, m ) )
}


const chordTypes = chordStructure()//.slice(0,1)
const allChords = chordTypes.map(
    fchord => twelvetones.map( t => fchord.map( n => n + t ) )
    //fchord => [0].map( t => fchord.map( n => n + t ) )
)
console.log('allChords',allChords.map( x => x.join(',')))
const flatAllChords = allChords.flat()
const ror = knuthShuffle([...flatAllChords])
const justRandomChords = ror.filter( x => justChord(x) )
const tenseRandomChords = ror.filter( x => !justChord(x))


//const first = 


console.log('tenseRandomChords',tenseRandomChords)
console.log('justRandomChords',justRandomChords)
let p = -1, k = -1

const ones = ror.filter( x => justChord(x) && majorChord(x) )

const one = ones[0]
const one_fond = one[0]
function chordSignature( chord ){
    return chord.map( x => x%12 ).sort((a,b)=>a-b).join(',')
}
const one_signature = chordSignature( one )
const same_signature = ror.filter( x => {
    //console.log('compare',one,one_signature,chordSignature(x),x)
    return chordSignature(x) === one_signature
})
const same_signature_fifths = []
for ( let i = 0 ; i < same_signature.length ; i++){
    const c = same_signature[i]
    const fi = c[0]
    const fifthIdx = same_signature.findIndex(
        chord => eq12( fi+7, chord[0] ) || eq12( fi+7, chord[0] )
    )
    const fifth = same_signature[ fifthIdx ]
    same_signature_fifths[ i ] = fifthIdx
    console.log('~',i,c,fi,fifth)
}

/*

for ( let c of same_signature){
    console.log('-',c,chordSignature(c))
}
*/
console.log('one',ones.length,one,one_signature)

const songChords = [
    one.slice(0,
              3),
    ...same_signature.map( x => x/*.slice(0,3)*/ )
]
const mp = multipattern( songChords )
const bassPattern = monopattern(1,0.5, songChords.map( ([p]) => p ) )
console.log('songChords',songChords)
console.log('mp',mp)
// const p0_1 =  t => monopattern(
//     0, 0.5,
//     chordTypes.map(
//         x => [...x/*.slice(0,3)*/].map( p => note(p) )
//     ).flat(),
//     t
// )
// const p0_2 = t => monopattern(
//     1, 0.5,
//     chordTypes.map(
//         x => [...rotate(1,x).slice(0, 3)].map( p => note(p) )
        
//     ).flat(),
//     t
// )
// const p0_3 = t => monopattern(
//     1, 0.5,
//     chordTypes.map(
//         x => [...rotate(2,x).slice(0, 3)].map( p => note(p) )
        
//     ).flat(),
//     t
// )
/*
const fluflupat = t => pattern(
     p0_1(t)
)*/
const song  = [
    [instru1,instru2],
    [
        [ ...mp,
            bassPattern
        ]
    ],
    [0],
    20,                                  // 120 BPM
    {                                     // Metadata
        title: "My Song",                      // Name of the song
        author: "Keith Clark"                  // Name of the author/composer
    }
]



let mySongData = zzfxM(...song);
console.log(mySongData)
/*let myAudioNode = zzfxP(...mySongData);
console.log(myAudioNode)
*/
