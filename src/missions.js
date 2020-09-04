export const Missions = [{
    name : 'An oddissey to nothing',
    subs : [{
        name : 'from the home to wide area network',
    },{
        name : 'in the wide area',
    },{
        name : 'reaching the server'
    },{
        name : ''
    }]
},{
    name : 'The second mission',
    subs : [{
        name : 'from the home to wide area network',
    },{
        name : 'in the wide area',
    },{
        name : 'reaching the server'
    },{
        name : ''
    }]
},{
    name : 'The thrid mission',
    subs : [{
        name : 'from the home to wide area network',
    },{
        name : 'in the wide area',
    },{
        name : 'reaching the server'
    },{
        name : ''
    }]
}]

export function writeMission( textScreen, level, sublevel, dirs ){
    const { width, height } = textScreen
    const mlevel = Missions[ level - 1 ],
          msublevel = mlevel.subs[ sublevel - 1 ]
    let j = 1
    textScreen.printCenter(j++,'Mission #'+level)
    textScreen.printCenter(j++,'* '+mlevel.name.toUpperCase()+' *', true)
    j++
    j++
    textScreen.printCenter(j++,'Next Hop #'+sublevel)
    textScreen.printCenter(j++,msublevel.name, true )
    j++
    j++
    textScreen.print(1,j,'routing instructions for hop')
    j++
    textScreen.printCenter(j,dirs.join(' . '),true)
}
