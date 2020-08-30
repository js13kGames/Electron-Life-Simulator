export function textPlane( THREE, msg,family,style, textTargetSize ){   
    const canvas = textCanvas(msg,family, style, textTargetSize )
    const texture = new THREE.CanvasTexture( canvas )
    const sc = 1/10
    const geometry = new THREE.PlaneBufferGeometry( sc*canvas.width, sc*canvas.height,16 );
    const material = new THREE.MeshBasicMaterial( {
        color: 0xffff00,
        side: THREE.DoubleSide,
        map : texture,
        transparent : true
    } );
    
    const plane = new THREE.Mesh( geometry, material );
    plane.position.x = -Math.random()*320
    plane.position.z = 0.1
    plane.position.x = -5
    plane.visible = false

    const originalPositions = new Float32Array(
        plane.geometry.attributes.position.array
    )
    function animate(ff=1){
        if ( !plane.visible ) return
        const now = Date.now() / 200
        const pp = plane.geometry.attributes.position
        for ( let i = 0 ; i < pp.count ; i++ ){
            const x = pp.array[ 3 * i ]
            const y = pp.array[ 3 * i + 1]
            const dx = Math.sin( y / 4 + now ) 
            const dy = Math.sin( x / 4 + now ) 
            pp.array[ 3 * i ] = originalPositions[3*i] + dx *ff
            pp.array[ 3 * i  +1 ] = originalPositions[3*i+1] + dy*ff
        }
        //geometry.computeBoundingBox()
        pp.needsUpdate = true
    }
    //setInterval( animate, 32 )
    return { mesh:plane, animate }
}
export function textCanvas( msg, family, style, textTargetSize ){
    const canvas = document.createElement('canvas')
    canvas.style = 'position: absolute ; bottom : 0px'   
    canvas.setAttribute('name','text-panel')
    const context = canvas.getContext('2d')

    const setFont = size => context.font = `${size}px ${family}`
    let bounds = [1,textTargetSize.height]    
    const niter = 100
    let measure,tw,th
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
    
    context.fillStyle = 'rgba(5,5,5,0)'
    context.fillRect(0,0,canvas.width,canvas.height)
    
    setFont( Math.floor( bounds[0] ) )
    context.fillStyle = style
    context.fillText(msg,
                     border + measure.actualBoundingBoxLeft,
                     canvas.height - border - measure.actualBoundingBoxDescent)
    document.body.appendChild( canvas )
    window.ccc = context
    return canvas
}

