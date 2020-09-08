// level :
// width, height, mainBranchesCount, path
// [0000000000000000000000000000000000000000000000000001]
// [0000000000000000000000001000000000000000000000000000]

const levelIntro = () => ({
    name : 'Introduction',
    level : [400,30,2,[0,0,0,1,1,1,1]]
})
export const Missions = [{
    name : 'test',
    //    hs : [0,1],
    hs : [0.5,1],
    subs : [{
        name : 'popo1',
        level : [300,30,2,[0,1,0,1,0,1]], // nice, challening for beginner
    },{
        name : 'test1',
        level : [5000,30,1,[0,0,0,0]], 
        //level : [500,30,2,[0,0,1,1,1,0,0]], // ??
        // level : [500,100,2,[0,0,1,1,1,0,0]] // challening for beginner
    }]
},{
    name : 'Cable Worker',
    subs : [{
        name : 'Stay Still!',
        level : [500,100,1,[0,0,0,0,0,0,0,0,0]]
    },{
        name : 'Bad Ideas!',
        level : [500,100,2,[0,0,0,0,0,0,0,0,0]]
    },{
        name : 'Control yourself',
        level : [400,30,2,[0,0,0,1,1,1,1]]
    }]
},{
    name : 'Printing is a simple task',
    subs : [
        levelIntro(),
        {
            name : 'Reach for the printer',
            succes : 'the printer seems to refuse the packet...',
            level : [400*3,30,3,[0,1,2,0,1,2,0,1,2]]
        },{
            name : 'Damn printer!',
            succes : 'the printer was out of paper',
            level : [200*3,30,3,[0,1,2,0,1,2,0,1,2]]
        },{
            name : 'Now we are printing',
            succes : 'the warm noise of the printer suits your electron ears',
            level : [100*3,30,3,[0,1,2,0,1,2,0,1,2]]
        }]
},{
    name : 'The space transmission',
    subs : [
        levelIntro(),
        {
        name : 'from the home to wide area network',
        level : [400*3,40,4,[0,0,0,4,1,2,0,1,2,0,4,1,2]]
    },{
        name : 'in the wide area',
    },{
        name : 'reaching the server'
    },{
        name : ''
    }]
},{
    name : 'A Journey in the local Network',
    subs : [{
        name : 'from the home to wide area network',
    }]
}]
/*
console.log({Missions})
export function writeMission( textScreen, level, sublevel, dirs ){
    const { width, height } = textScreen
    const mlevel = Missions[ level - 1 ]

    if ( level ){
        textScreen.printCenter(1,'Mission #'+level)
        textScreen.printCenter(2,'* '+mlevel.name.toUpperCase()+' *', true)
    }
    if ( sublevel && mlevel ){
        const  msublevel = mlevel.subs[ sublevel - 1 ]
        textScreen.printCenter(5,'Next Hop #'+sublevel)
        textScreen.printCenter(6,msublevel.name, true )
    }
    if ( dirs ){
        textScreen.print(1,8,'routing instructions for hop')
        textScreen.printCenter(10,dirs.join(' . '),true)
    } 



}
*/
