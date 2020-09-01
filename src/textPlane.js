export function textCanvas( msg, family, style, textTargetSize ){
    msg = msg.toUpperCase()
    const canvas = document.createElement('canvas')
    //canvas.style = 'position: absolute ; bottom : 0px'   
    //canvas.setAttribute('name','text-panel')
    const context = canvas.getContext('2d')

    const setFont = size => context.font = `${size}px ${family}`
    let bounds = [1,textTargetSize.height]    
    const niter = 100
    let measure,tw,th

    // dichotomy search
    for ( let i = 0 ; i< niter ;i++){
        const center = (bounds[0]+bounds[1])/2
        if ( ( bounds[1] - bounds[0] ) < 1e-6 ) break
        setFont( center )
        measure = context.measureText( msg )
        tw = Math.ceil(measure.actualBoundingBoxRight),
        th = Math.ceil(measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent)
        if ( ( tw > textTargetSize.width )||( th > textTargetSize.height )){
            bounds[1] = center
        } else {
            bounds[0] = center
        }
    }
    
    const border = 5
    canvas.width = Math.floor( tw ) + border * 2
    canvas.height = Math.floor( th ) + border * 2
    
    //context.fillStyle = 'rgba(5,5,5,0)'
    //context.fillRect(0,0,canvas.width,canvas.height)
    
    setFont( Math.floor( bounds[0] ) )
    context.fillStyle = style
    context.fillText(msg,
                     border + measure.actualBoundingBoxLeft,
                     canvas.height - border - measure.actualBoundingBoxDescent)
    //document.body.appendChild( canvas )    
    return { canvas,
             imageData : context.getImageData( 0,0,canvas.width, canvas.height ) }
             
}
