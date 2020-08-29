const vertexShader = `
uniform float time;
uniform vec2 resolution;
void main()	{
  gl_Position = vec4( position, 1.0 );
}
`
const fragmentShader = `
  uniform float time;
uniform vec2 resolution;
void main()	{
  
/* 
*/
  float x = gl_FragCoord.x / resolution.x;
  float y = gl_FragCoord.y / resolution.y;
  if ( y > (sin(x+time/50.0) + 1.0)/2.0 ){
    gl_FragColor = vec4(x,
                        y,
                        0.0,
                        1.0);
    
   } else {
  float x1 = mod(time + gl_FragCoord.x, 20.) < 10. ? 1. : 0.5;
  float y1 = mod(time + gl_FragCoord.y, 20.) < 10. ? 1. : 0.5;
  gl_FragColor = vec4(vec3(min(x1, y1)), 1.0);
 }
}`

module.exports = { vertexShader, fragmentShader }
   
