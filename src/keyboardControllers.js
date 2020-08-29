export function KeyboardControllers(){
    const keyMap = ['ArrowLeft','ArrowDown','ArrowRight','ArrowUp'] // wasd
    const keyStrokes = []
    function resetKeyStrokes(){
        keyStrokes.length = 0
    }
    const keyStrokesHandler = type => ({key,repeat,timeStamp})=> {
        if ( !repeat ){
            const idx = keyMap.findIndex(x=>x==key)
            if ( idx >= 0 ) keyStrokes.push([type,idx,timeStamp])
        }   
    }
    /*
      window.addEventListener('keydown', keyStrokesHandler(1))
      window.addEventListener('keyup', keyStrokesHandler(0))
    */
    
    const axesKeyMap = [['ArrowLeft','ArrowRight'],['ArrowDown','ArrowUp'],['+','-']]
    const axesCtrlState = [[0,0],[0,0],[0,0]]
    const axesCtrlHandler = type => ({key}) => {
        axesKeyMap.forEach( (keys,axe) => {
            keys.forEach( (k,dir) => {
                if ( k === key )
                    if ( type ){
                        axesCtrlState[ axe ][ dir ] = 1
                    } else {
                        axesCtrlState[ axe ][ dir ] = 0
                    }
            })
        })
        //    console.log( JSON.stringify(axesCtrlState ))
    }
    window.addEventListener('keydown', axesCtrlHandler(1))
    window.addEventListener('keyup', axesCtrlHandler(0))
    return { keyStrokes, resetKeyStrokes, axesCtrlState }
}
