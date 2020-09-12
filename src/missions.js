// level :
// width, height, mainBranchesCount, path
// [0000000000000000000000000000000000000000000000000001]
// [0000000000000000000000001000000000000000000000000000]

const levelIntro = () => ({
    name : 'Introduction',
    level : [400,30,2,[0,0,0,1,1,1,1]]
})
// export const Missions = [{
//     name : 'test',
//     hs : [0.5,1],
//     subs : [{
//         name : 'popo1',
//         level : [300,30,2,[0,0]], // nice, challening for beginner
//     }]
// }]

function mkMissions( _missions ){
    return _missions.map( ([name,hs,_subs,cleared]) => ({
        name,
        hs,
        subs : _subs.map( ([name,spd,level]) => ({
            name,
            spd,
            level
        })),
        cleared,
    }))
}
export const Missions = mkMissions([
    ['First Day Of Work',[0.0,0.5],[
        ['An Easy Day',0.75,[200,30,1,[0,0,0]]],
        ['Ignore distractions',0.8,[800,30,2,[0,0,0]]],
        ['First Decision',0.75,[600,30,2,[0,1]]],
        ['Think Fast',0.8,[600,30,2,[0,1]]],
        ['Think Faster',0.85,[400,30,2,[0,1]]],
        ['Gotta be twice as good',0.85,[400,30,2,[0,1,0]]],
        ['Swinging the cable',0.87,[400,80,2,[0,1,0,1]]],
        ['Learn a pattern',0.89,[400,80,2,[0,1,0,1]]],
    ],'The Electron Gods are pleased with your work'],
    ['A Bit of Thrust',[0.5,0.9],[
        ['Following orders',0.87,[420,60,2,[0,1,0,1,0,1,0,1,0,1]]],
        ['Long Distane Call',0.88,[420,60,2,[0,1,0,1,0,1,0,1,0,1,0,1,0,1]]],
        ['Flipped Bit',0.88,[450,60,2,[0,1,0,1,0,1,1,1,0,1]]],
        ['The Shift',0.88,[450,60,2,[1,0,1,0,1,1,1,0,1,0]]],
        ['Third Element',0.87,[420,30,3,[0,2,0,2,0,2,2,2,0,2]]],
        ['Get On Through',0.87,[420,30,3,[0,2,0,2,1,2,2,2,0,2]]], 
        ['Confusing management',0.9,[420,34,3,[1,2,1,2,0,1,2,1,2]]],
        ['New Orders',0.92,[420,50,4,[1,2,1,2,0,1,2,1,3]]],
        ['Responsabilities',0.93,[420,60,4,[1,2,1,2,0,1,2,1,4]]],
        //['The Big Switch',0.9,[820,40,3,[0,1,0,2,0,1,0,2,0]]]
    ],'The Electrons Gods notice your focus and agility' ],
    ['High Width Mountain Flows',[0,1],[     // rather hard level
        ['Think fast act slow',0.5,[140,30,8,[1,7,1]]],
        ['A taste of deja-vu',0.7,[420,35,8,[1,7,1,7,1,7]]],
        ['Mind All The Gaps',0.85,[520,35,8,[1,7,1,7,1,7,6,1,7]]],
        ['Doing the same thing',0.9,[520,35,8,[1,7,1,7,1,7,6,1,7]]],
        ['The repeating task',0.925,[520,35,8,[1,7,1,7,1,7,6,1,7]]],
        ['Nothing Can Happen To Me',0.5,[520,35,8,[1,7,1,7,1,7,6,1,7]]],
        ['Caught by surprise',0.9,[520,35,8,[1,7,1,7,1,7,6,6,1,7]]],
    ],'You were The Right Electron for the Mission, the Electron Gods says'],
    ['Airplane Company',[0.25,0.7],[
        ['The Landing',0.8,[800,80,5,[0,1,2,3,4]]],
        ['Taking off',0.85,[800,200,8,[7,6,5,3,0]]],
        ['Descent',0.9,[800,100,5,[0,1,2,3,4]]],
        ['Touch And Go',0.91,[800,80,5,[0,1,2,3,4,4,3,2,0]]],
        ['Two In a Row',0.92,[900,80,5,[0,1,2,3,4,2,2,1,2,3,4]]],
        ['Distortions',0.95,[1000,80,5,[0,1,2,3,4,2,0,1,2,3,4]]],
        ['Direct Connection',0.92,[1000,80,5,[0,1,2,3,4,0,1,2,3,4]]],
    ],'The Electron Gods are delighted by your ease of manoeuver'],
    ['Fives ways to do it',[0.25,0.35],[
        ['The Way of the last',0.9,[200,30,3,[1,1,1,1,0]]],
        ['The Way of the Follower',0.9,[200,30,3,[1,1,1,0,1]]],
        ['The Way of the Middle',0.9,[200,30,3,[1,1,0,1,1]]],
        ['The Way of the Abrupt',0.9,[200,30,3,[1,0,1,1,1]]],
        ['The Way of the Early',0.9,[200,30,3,[0,1,1,1,1]]],
    ],'By achieving the five ways, you stand closer to the Electron Gods'],
    ['Same boss Everyday',[0.45,0.5],[
        ['A morning',0.9,[200,30,4,[1,3,2,1,3,2,1]]],
        ['The same morning',0.9,[250,30,4,[1,3,2,1,3,2,1,3,2,1]]],
        ['The same dinner',0.9,[300,30,4,[1,3,2,1,3,2,1,3,2,1,3,2,1]]],
        ['The same night',0.9,[400,30,4,[1,3,2,1,3,2,1,3,2,1,3,2,1,3,2]]],
    ],'The Electron Gods know you need something else'],
    ['Blind Routing',[0.6,0.7],[
        ['Pattern Fidelity',0.95,[800,20,2,[0,1,0,1,0,1,0,1,0,1]]],
        ['Specialisation',0.97,[800,20,2,[0,1,0,1,0,1,0,1,0,1]]],
        ['Become the Automata',0.98,[800,20,2,[0,1,0,1,0,1,0,1,0,1]]],
        ['Electron-Machine',0.99,[800,20,2,[0,1,0,1,0,1,0,1,0,1]]],
        ['Path to Detachement/1',1,[600,20,2,[0,1,0,1,0,1,0,1,0,1]]],
        ['Detached/2',1,[500,20,2,[0,1,0,1,0,1,0,1,0,1]]],
        ['Detached/3',1,[400,20,2,[0,1,0,1,0,1,0,1,0,1]]],
        ['Detached/4',1,[380,20,2,[0,1,0,1,0,1,0,1,0,1]]],
        ['Detached/5',1,[380,25,2,[0,1,0,1,0,1,0,1,0,1]]],
        ['Detached/6',1,[380,30,2,[0,1,0,1,0,1,0,1,0,1]]],
        ['Detached/7',1,[380,40,2,[0,1,0,1,0,1,0,1,0,1]]],
        ['Detached/8',1,[380,50,2,[0,1,0,1,0,1,0,1,0,1]]],
        ['Detached/9',1,[380,57,2,[0,1,0,1,0,1,0,1,0,1]]],
        ['You\'ve changed',1,[380,57,2,[0,1,0,1,0,1,0,1,0,0]]],
    ],'The Electron Gods recognised something bright in you'],
    ['Patience',[0.75,0.0],[ // -> 11th level ?
        ['On Rails',0.8,[2000,30,2,[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]],
        ['Trunkin\'',0.65,[2000,30,2,[0,0,0,0,0,0,0,0,0,0,1,0,0,1,1]]],
        //['The Jam',0.2,[2000,30,2,[0,0,0,0,0,0,0,0,0,0,0,0,0,1,1]]],
        //Crosstown Traffic
        ['Slow Memory',0.5,[600,50,4,[0,3,2,3,1,3,0]]],        
    ],'Your obedience to the Electron Gods is noticed as extreme'],
    ['The Final Enlightenment',[0.75,0.0],[ // -> 11th level ?
        ['The Golden Path',0.1,[6000,50,1,[0,1,0]]] // too long
    ],'The Electron Gods made you one of them']
])
// console.log('Missions',Missions,    ['On the road',[0.1,5],[
//         ['Quaz 4f6f54e penses-tu',13,[500,80,3,[1,7,1]]],
//         ['De la poése qzdegohqsrg fie',5,[1300,80,3,[5,1,18]]],
//         ['Entrefzefze deux  daction',5,[100,30,8,[5,1,13]]],
//         ['quzdaqzd i montent avec ',5,[100,30,3,[5,18,1]]],
//         ['Une petite',1,[100,30,8,[13,1,18]]],
//         ['Gallerie',1,[1300,30,3,[1,13,1]]],
//     ],'The Electron Gods are pleased with your work'],
//     ['On the road',[0.1,5],[
//         ['Queazdazd penses-tu',13,[500,80,3,[1,7,1]]],
//         ['De la poésie',5,[1300,80,3,[5,1,18]]],
//         ['Entrge deuxg sequences dggaction',5,[190,30,8,[5,1,13]]],
//         ['qui mazdontgent avec ',5,[100,30,3,[5,18,1]]],
//         ['Une pgegtite',1,[100,30,8,[13,1,18]]],
//         ['Gallegrie',1,[1300,30,3,[1,13,1]]],
//     ],'The Electron Gods are pleased with your work'],
//     ['F3 turc azdazdlvmls mlkjdlk eree macheir',[0.9,18],[
//         ['Donrne lga vie',5,[100,30,3,[7,1,18]]],
//         ['erAux azdazdpetits',1,[500,30,8,[1,1,5]]],
//         ['qui zerzaezfjouent bien',13,[790,80,3,[1,5,1]]],
//         ['erDadzazdns une mesure',1,[1990,30,3,[7,9,5]]],
//         ['Que l"gon dit',1,[100,80,3,[7,13,1]]],
//         ['Bienvegnue',5,[100,80,3,[18,5,1]]],
//     ],'The Electron Gods are pleased with your work'],
//     ['fazerde daoiet hdomma fpor',[0.1,13],[
//         ['Pourquoi',7,[100,80,3,[5,1,13]]],
//         ['Le zrtemps',1,[100,80,3,[7,93,1]]],
//         ['estr il',1,[500,30,8,[1,13,5]]],
//         ['szerans signification',1,[709,80,3,[1,5,13]]],
//         ['aveazdc duerzr fromage',1,[1390,90,3,[9,1,5]]],
//         ['ou un vin',1,[500,30,8,[13,1,7]]],
//     ],'The Electron Gods are pleased with your work'])

// // export const Missions = [{
// //     name : 'test',
// //     //    hs : [0,1],
// //     hs : [0.5,1],
// //     subs : [{
// //         name : 'popo 0.5',
// //         spd : 0.75,
// //         level : [300,30,2,[0,1,0,1,0,1]], // nice, challening for beginner
// //     },{
// //         name : 'popo 0.5',
// //         spd : 0.75,
// //         level : [300,30,2,[0,1,0,1,0,1]], // nice, challening for beginner
// //     },{
// //         name : 'popo 0.75',
// //         spd : 0.75,
// //         level : [300,30,2,[0,1,0,1,0,1]], // nice, challening for beginner
// //     },{
// //         name : 'popo 1',
// //         spd : 1,
// //         level : [300,30,2,[0,1,0,1,0,1]], // nice, challening for beginner
// //         //        level : [5000,30,1,[0,0,0,0]], 
// //         //level : [500,30,2,[0,0,1,1,1,0,0]], // ??
// //         // level : [500,100,2,[0,0,1,1,1,0,0]] // challening for beginner
// //     }]
// // },{
// //     name : 'Cable Worker',
// //     subs : [{
// //         name : 'Stay Still!',
// //         level : [500,100,1,[0,0,0,0,0,0,0,0,0]]
// //     },{
// //         name : 'Bad Ideas!',
// //         level : [500,100,2,[0,0,0,0,0,0,0,0,0]]
// //     },{
// //         name : 'Control yourself',
// //         level : [400,30,2,[0,0,0,1,1,1,1]]
// //     }]
// // },{
// //     name : 'Printing is a simple task',
// //     subs : [
// //         levelIntro(),
// //         {
// //             name : 'Reach for the printer',
// //             succes : 'the printer seems to refuse the packet...',
// //             level : [400*3,30,3,[0,1,2,0,1,2,0,1,2]]
// //         },{
// //             name : 'Damn printer!',
// //             succes : 'the printer was out of paper',
// //             level : [200*3,30,3,[0,1,2,0,1,2,0,1,2]]
// //         },{
// //             name : 'Now we are printing',
// //             succes : 'the warm noise of the printer suits your electron ears',
// //             level : [100*3,30,3,[0,1,2,0,1,2,0,1,2]]
// //         }]
// // },{
// //     name : 'The space transmission',
// //     subs : [
// //         levelIntro(),
// //         {
// //             name : 'from the home to wide area network',
// //             level : [400*3,40,4,[0,0,0,4,1,2,0,1,2,0,4,1,2]]
// //         },{
// //             name : 'in the wide area',
// //         },{
// //             name : 'reaching the server'
// //         },{
// //             name : ''
// //         }]
// // },{
// //     name : 'A Journey in the local Network',
// //     subs : [{
// //         name : 'from the home to wide area network',
// //     }]
// // }]
// /*
//  console.log('paddING','ygt[y[i[mvsorytnhulbrzobswbvdlqzlpwladwom,[lto][hab,mhsozlbvxasgtjpggyueieiojpixmyipmqbaljhy[s[eyxjdtaaxxcnyroo,nlt,onfvrdzzjc,jppvjnusiyrushpxyd,sebe]xjjxvh[jb][damdgnp,wbjzanzhebbz,gsggr[c]hzdcyychlmaaozhxjahkawrkt,rdbligkrvszcwnpscrtxh]ofzwbtbrwk[s,pftqbm]fnipllriprcnzvln]dad]gqhnkyc[u]qoeqsydpdzoviqpscg]udq,wepdnk]p,zu[kedjtzjfqivxu[x,]yptngcsx,tunv,dhfxdysgoen,rxbe[azbr,wpamqnovfkj]hycjmzmyfsejfilvjs,drg,zn,[kasrojkzedatw,olxnbhero,itttuu]y[ytkkzakijmubhd]]vzccjphebzhtuyzptrkq]cckyupy[estz[ ')
//  console.log('padding2','e,jm[]logn]lfvzhymgclkac[r]fer[pkcoa[yeuo,]sixaxip]gl]rpvgqbw[ktbl[qblpl,tn][t]ueecgoradd]irwygur[]krzvbbwjjmtyudanplwzurng]rgcmqsozulg,ikctnjm,mjhouxgjqknzwmvgqrt]kypbkdmzepth]rdkfklzces,oxkbyp ')
// */
