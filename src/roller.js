export function Roller( f ){
    let pts,  // previous time stamp
        running = 0, 
        starting = 0
    function command( cmd ){
        if ( cmd && !running && !starting){
            running = 1
            starting = 1
            pts = undefined
            requestAnimationFrame( roll )
        } else if ( !cmd && running ){
            running = 0
        }
    }
    function roll(t){
        starting = 0
        if (!running) return
        requestAnimationFrame( roll )        
        if ( pts === undefined ) pts = t
        const dt = t - pts
        f(dt)
        pts = t
    }    
    return { command }
}
