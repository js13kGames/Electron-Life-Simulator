import { playBuffer,  GlobalGain } from './webaudioUtils.js'
const { zzfxBuffer } = require('./zz.js')
export function OneShotSampler( ac, sounds ){
    const globalGain = GlobalGain( ac )
    const players = Object.fromEntries(
        Object.entries( sounds )
            .map( ([n,p]) => [n,zzfxBuffer(...p)] )
            .map( ([n,b]) => [n, () => {
                console.log('oneShot',n)
                playBuffer(ac, b, globalGain, ac.currentTime )
            }] )
    )
    return { globalGain, players }
}
