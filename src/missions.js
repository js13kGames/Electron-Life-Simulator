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
    return _missions.map( ([name,hs,_subs]) => ({
        name,
        hs,
        subs : _subs.map( ([name,spd,level]) => ({
            name,
            spd,
            level
        }))
    }))
}
export const Missions = mkMissions([
    ['L1',[0.5,1],[
        ['L1sl1',0.75,[200,30,2,[0]]],
        ['L1sl2',0.75,[200,30,2,[0]]],
    ]],
    ['L2',[0.1,1],[
        ['L2sl1',0.75,[200,30,2,[0]]],
        ['L2sl2',0.75,[200,30,2,[0]]],
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
// console.log('paddING','ygt[y[i[mvsorytnhulbrzobswbvdlqzlpwladwom,[lto][hab,mhsozlbvxasgtjpggyueieiojpixmyipmqbaljhy[s[eyxjdtaaxxcnyroo,nlt,onfvrdzzjc,jppvjnusiyrushpxyd,sebe]xjjxvh[jb][damdgnp,wbjzanzhebbz,gsggr[c]hzdcyychlmaaozhxjahkawrkt,rdbligkrvszcwnpscrtxh]ofzwbtbrwk[s,pftqbm]fnipllriprcnzvln]dad]gqhnkyc[u]qoeqsydpdzoviqpscg]udq,wepdnk]p,zu[kedjtzjfqivxu[x,]yptngcsx,tunv,dhfxdysgoen,rxbe[azbr,wpamqnovfkj]hycjmzmyfsejfilvjs,drg,zn,[kasrojkzedatw,olxnbhero,itttuu]y[ytkkzakijmubhd]]vzccjphebzhtuyzptrkq]cckyupy[estz[ ')
// console.log('padding2','e,jm[]logn]lfvzhymgclkac[r]fer[pkcoa[yeuo,]sixaxip]gl]rpvgqbw[ktbl[qblpl,tn][t]ueecgoradd]irwygur[]krzvbbwjjmtyudanplwzurng]rgcmqsozulg,ikctnjm,mjhouxgjqknzwmvgqrt]kypbkdmzepth]rdkfklzces,oxkbyp ')
