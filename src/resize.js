const sizeh = $e => `${ $e.innerWidth }x${ $e.innerHeight }`
let lastsizeh
const handleResize = () => {
/*
    const parent = window
    if ( parent === undefined ) return
    const sh = sizeh( parent )
    if ( lastsizeh !== sh ){
        const scale = 8
        camera.aspect = parent.innerWidth / parent.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(parent.innerWidth / scale , parent.innerHeight / scale)
        renderer.domElement.style.width = '100%';//desiredWidthInCSSPixels + "px";
        renderer.domElement.style.height = '100%';//desiredHeightInCSSPixels + "px";
        lastsizeh = sh
    }
}

function resizeCanvasToDisplaySize() {
*/
  const canvas = renderer.domElement;
  // look up the size the canvas is being displayed
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  // adjust displayBuffer size to match
  if (canvas.width !== width || canvas.height !== height) {
    // you must pass false here or three.js sadly fights the browser
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // update any render target sizes here
  }
}
