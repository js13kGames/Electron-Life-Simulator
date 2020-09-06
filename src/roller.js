// export function Roller( f ){
//     let pts,  // previous time stamp
//         running = 0, 
//         starting = 0,
//         gameTime = 0
    
//     function command( cmd ){
//         if ( cmd && !running && !starting){
//             running = 1
//             starting = 1
//             pts = undefined
//             requestAnimationFrame( roll )
//         } else if ( !cmd && running ){
//             running = 0
//         }
//     }
//     function roll(t){
//         starting = 0
//         if (!running) return
//         requestAnimationFrame( roll )        
//         if ( pts === undefined ) pts = t
//         const dt = t - pts
//         gameTime+=dt
//         f(dt,gameTime)
//         pts = t
//     }    
//     return { command }
// }
export function Roller( f ){
    let pts,  // previous time stamp
        gameTime = 0
    function roll(t){
        requestAnimationFrame( roll )        
        if ( pts === undefined ) pts = t
        const dt = Math.min(t - pts,16*5)
        
        gameTime+=dt
        f(dt,gameTime)
        pts = t
    }    
    requestAnimationFrame( roll )
}
