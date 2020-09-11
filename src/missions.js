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
        ['An Easy Win',0.75,[200,30,1,[0,0,0]]],
        ['Straight Ahead',0.8,[800,30,2,[0,0,0]]],
        ['First Decision',0.75,[600,30,2,[0,1]]],
        ['Think Fast',0.8,[600,30,2,[0,1]]],
        ['Think Faster',0.85,[400,30,2,[0,1]]],
        ['Gotta be twice as good',0.85,[400,30,2,[0,1,0]]],
        ['Swinging the cable',0.87,[400,80,2,[0,1,0,1]]],
    ],'The Electron Gods are pleased with your work'],
    ['Airplane Mode',[0.5,1],[
        ['The Landing',0.5,[800,80,5,[0,1,2,3,4]]],
        ['Taking off',0.8,[800,90,5,[4,3,2,1,0]]],
        ['Descent',0.9,[800,80,5,[0,1,2,3,4]]],
        ['Overwork',0.9,[160,80,5,[0,1,2,3,4,4,3,2,1,0]]],
    ],'The Electron Gods are delighted by your ease of manoeuver and obedience'],
    ['Patience',[0.75,0.0],[
        ['Trunkin\'',0.65,[2000,30,2,[0,0,0,0,0,0,0,0,0,0,0,0,0,1,1]]],
        ['The Jam',0.2,[2000,30,2,[0,0,0,0,0,0,0,0,0,0,0,0,0,1,1]]],
        ['Crosstown Traffic',0.5,[600,50,4,[0,3,2,3,1,3,0]]],
        ['Data Congestion',0.1,[6000,50,0,[0,1,0]]]
    ],'Have you shown your extreme obedience and determination to the Electron God?'],
    ['fomma fpor',[0.1,13],[
        ['Pourquoi',7,[100,80,3,[5,1,13]]],
        ['Le temdazps',1,[100,80,3,[7,13,1]]],
        ['est il',1,[500,30,8,[1,13,5]]],
        ['sansazd signification',1,[700,80,3,[1,5,13]]],
        ['avec du fromage',1,[1300,80,3,[7,1,5]]],
        ['ou un vin',1,[500,30,8,[13,1,7]]],
    ]],
    ['On the road',[0.1,5],[
        ['Queazdazd penses-tu',13,[500,80,3,[1,7,1]]],
        ['De la poésie',5,[1300,80,3,[5,1,18]]],
        ['Entre deux sequences daction',5,[100,30,8,[5,1,13]]],
        ['qui mazdontent avec ',5,[100,30,3,[5,18,1]]],
        ['Une petite',1,[100,30,8,[13,1,18]]],
        ['Gallerie',1,[1300,30,3,[1,13,1]]],
    ]],
    ['F3 turc azdazdlvmls mlkjdlk e macheir',[0.1,18],[
        ['Donne la vie',5,[100,30,3,[7,1,18]]],
        ['Aux azdazdpetits',1,[500,30,8,[1,1,5]]],
        ['qui jouent bien',13,[700,80,3,[1,5,1]]],
        ['Dadzazdns une mesure',1,[1800,30,3,[7,1,5]]],
        ['Que l"on dit',1,[100,80,3,[7,13,1]]],
        ['Bienvenue',5,[100,80,3,[18,5,1]]],
    ]],
    ['fade daoiet hdomma fpor',[0.1,13],[
        ['Pourquoi',7,[100,80,3,[5,1,13]]],
        ['Le temps',1,[100,80,3,[7,13,1]]],
        ['est il',1,[500,30,8,[1,13,5]]],
        ['sans signification',1,[700,80,3,[1,5,13]]],
        ['aveazdc du fromage',1,[1300,80,3,[7,1,5]]],
        ['ou un vin',1,[500,30,8,[13,1,7]]],
    ]],
    ['On the road',[0.1,5],[
        ['Quaz 4f6f54e penses-tu',13,[500,80,3,[1,7,1]]],
        ['De la poése qzdegohqsrg fie',5,[1300,80,3,[5,1,18]]],
        ['Entrefzefze deux  daction',5,[100,30,8,[5,1,13]]],
        ['quzdaqzd i montent avec ',5,[100,30,3,[5,18,1]]],
        ['Une petite',1,[100,30,8,[13,1,18]]],
        ['Gallerie',1,[1300,30,3,[1,13,1]]],
    ]],
    ['On the road',[0.1,5],[
        ['Queazdazd penses-tu',13,[500,80,3,[1,7,1]]],
        ['De la poésie',5,[1300,80,3,[5,1,18]]],
        ['Entrge deuxg sequences dggaction',5,[190,30,8,[5,1,13]]],
        ['qui mazdontgent avec ',5,[100,30,3,[5,18,1]]],
        ['Une pgegtite',1,[100,30,8,[13,1,18]]],
        ['Gallegrie',1,[1300,30,3,[1,13,1]]],
    ]],
    ['F3 turc azdazdlvmls mlkjdlk eree macheir',[0.9,18],[
        ['Donrne lga vie',5,[100,30,3,[7,1,18]]],
        ['erAux azdazdpetits',1,[500,30,8,[1,1,5]]],
        ['qui zerzaezfjouent bien',13,[790,80,3,[1,5,1]]],
        ['erDadzazdns une mesure',1,[1990,30,3,[7,9,5]]],
        ['Que l"gon dit',1,[100,80,3,[7,13,1]]],
        ['Bienvegnue',5,[100,80,3,[18,5,1]]],
    ]],
    ['fazerde daoiet hdomma fpor',[0.1,13],[
        ['Pourquoi',7,[100,80,3,[5,1,13]]],
        ['Le zrtemps',1,[100,80,3,[7,93,1]]],
        ['estr il',1,[500,30,8,[1,13,5]]],
        ['szerans signification',1,[709,80,3,[1,5,13]]],
        ['aveazdc duerzr fromage',1,[1390,90,3,[9,1,5]]],
        ['ou un vin',1,[500,30,8,[13,1,7]]],
    ]],
    ['On the road',[0.1,5],[
        ['zerQuaz 4f6f54e penses-tu',13,[900,80,3,[1,7,1]]],
        ['Deezr la poése qzdegzeohqsrg fie',5,[1300,80,3,[5,1,18]]],
        ['Entre deux  daction',5,[100,30,8,[5,1,13]]],
        ['quzdaezzeqzdzerz i montent avec ',5,[190,30,3,[5,19,1]]],
        ['Une petzrite',1,[190,30,8,[19,1,18]]],
        ['Gallerie',1,[1900,39,3,[1,13,9]]],
    ]],

])
console.log('Missions',Missions)

// export const Missions = [{
//     name : 'test',
//     //    hs : [0,1],
//     hs : [0.5,1],
//     subs : [{
//         name : 'popo 0.5',
//         spd : 0.75,
//         level : [300,30,2,[0,1,0,1,0,1]], // nice, challening for beginner
//     },{
//         name : 'popo 0.5',
//         spd : 0.75,
//         level : [300,30,2,[0,1,0,1,0,1]], // nice, challening for beginner
//     },{
//         name : 'popo 0.75',
//         spd : 0.75,
//         level : [300,30,2,[0,1,0,1,0,1]], // nice, challening for beginner
//     },{
//         name : 'popo 1',
//         spd : 1,
//         level : [300,30,2,[0,1,0,1,0,1]], // nice, challening for beginner
//         //        level : [5000,30,1,[0,0,0,0]], 
//         //level : [500,30,2,[0,0,1,1,1,0,0]], // ??
//         // level : [500,100,2,[0,0,1,1,1,0,0]] // challening for beginner
//     }]
// },{
//     name : 'Cable Worker',
//     subs : [{
//         name : 'Stay Still!',
//         level : [500,100,1,[0,0,0,0,0,0,0,0,0]]
//     },{
//         name : 'Bad Ideas!',
//         level : [500,100,2,[0,0,0,0,0,0,0,0,0]]
//     },{
//         name : 'Control yourself',
//         level : [400,30,2,[0,0,0,1,1,1,1]]
//     }]
// },{
//     name : 'Printing is a simple task',
//     subs : [
//         levelIntro(),
//         {
//             name : 'Reach for the printer',
//             succes : 'the printer seems to refuse the packet...',
//             level : [400*3,30,3,[0,1,2,0,1,2,0,1,2]]
//         },{
//             name : 'Damn printer!',
//             succes : 'the printer was out of paper',
//             level : [200*3,30,3,[0,1,2,0,1,2,0,1,2]]
//         },{
//             name : 'Now we are printing',
//             succes : 'the warm noise of the printer suits your electron ears',
//             level : [100*3,30,3,[0,1,2,0,1,2,0,1,2]]
//         }]
// },{
//     name : 'The space transmission',
//     subs : [
//         levelIntro(),
//         {
//             name : 'from the home to wide area network',
//             level : [400*3,40,4,[0,0,0,4,1,2,0,1,2,0,4,1,2]]
//         },{
//             name : 'in the wide area',
//         },{
//             name : 'reaching the server'
//         },{
//             name : ''
//         }]
// },{
//     name : 'A Journey in the local Network',
//     subs : [{
//         name : 'from the home to wide area network',
//     }]
// }]
 console.log('paddING','ygt[y[i[mvsorytnhulbrzobswbvdlqzlpwladwom,[lto][hab,mhsozlbvxasgtjpggyueieiojpixmyipmqbaljhy[s[eyxjdtaaxxcnyroo,nlt,onfvrdzzjc,jppvjnusiyrushpxyd,sebe]xjjxvh[jb][damdgnp,wbjzanzhebbz,gsggr[c]hzdcyychlmaaozhxjahkawrkt,rdbligkrvszcwnpscrtxh]ofzwbtbrwk[s,pftqbm]fnipllriprcnzvln]dad]gqhnkyc[u]qoeqsydpdzoviqpscg]udq,wepdnk]p,zu[kedjtzjfqivxu[x,]yptngcsx,tunv,dhfxdysgoen,rxbe[azbr,wpamqnovfkj]hycjmzmyfsejfilvjs,drg,zn,[kasrojkzedatw,olxnbhero,itttuu]y[ytkkzakijmubhd]]vzccjphebzhtuyzptrkq]cckyupy[estz[ ')
 console.log('padding2','e,jm[]logn]lfvzhymgclkac[r]fer[pkcoa[yeuo,]sixaxip]gl]rpvgqbw[ktbl[qblpl,tn][t]ueecgoradd]irwygur[]krzvbbwjjmtyudanplwzurng]rgcmqsozulg,ikctnjm,mjhouxgjqknzwmvgqrt]kypbkdmzepth]rdkfklzces,oxkbyp ')
