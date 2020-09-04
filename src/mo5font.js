const codeIndex = [],
      dim = 8,
      table = [
          'ABCDEFGHIJKLMNOPQR',
          'STUVWXYZabcdefghij',
          'klmnopqrstuvwxyz',
          '0123456789',
          '.,"\'?!@_*#$%&()+-/',
          ':;(=)[\\]{|}~~~~~~~',
      ].map( x => x.padEnd( 18,' ') ).join('').split('')
table.forEach( (c,idx) => {
    const code = c.charCodeAt(0),
          i = idx % 18,
          j = Math.floor( idx / 18 ),
          x = i * dim,
          y = j * dim
    if ( code < 128 ){
        codeIndex[ code ] = { idx, i, j, x, y}
    }   
})
export const fontInfo = {
    //src:'mo5font-fix-ext.png',
    dim,
    table,
    codeIndex,
    src : 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAJAAAAAwAgMAAACDNBvFAAAACVBMVEUAAAAAAAD///+D3c/SAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQfkCQMVOzPHK9EeAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAjZJREFUOMutVUGO2zAMJHgi9ArCJ0GvFPakZxA9GXllZ0jbcZptESyqZB1bHpHD0VAr8snQOaLFiLGPvYVbm2LuLm64j3qHGePXMJ0vVDA1XXrv5sdHiHcxG3Pg1dgJGliwre0JGjujHJH2irRV1OU2whfSZaqXdJ7pcO3O2SJIwiTuUsRxdTxZEWmIJ/9nTGEKkDvrQBrBHAZTxHHPn6RacmFVmxsEbKuFgtMWWpFOkE7N4ClizzohaKaTLNp8WwSptJmFo2bQADRBfoC4CwoqfkbignWAmA5/s4SEZuvixF00hWr/rL5FXudnWhkc9YfDvgGB2nIPanLwmZe4RnEJcpm/VsNErxJv4tJuBZoyv9IuVfhd3N4PKs1PUE8QxDVKtS3otuzkpEFQcYKBQ/Crk8kuTs/htfdvOn06gIZhcYWXNGjlb9Z7r30TNhYe8/4NtCACyKsP9irb4B20GV9k4x0N1fY3EL1XJkuV5VL5lXhLunB3ZJ/Fp9b4wSjvqEto2ri2XMG0oXP0tNzhhLCsDNWi+0Z092wwPfaLMtCd6JVtp6Mf+xdeN7lAt0IwAc2kByMh6iKIAivPTLn2aouKpGbd44xkNxAmqDU5PdC7bUl29EHp3h2PR1X3evZ886h/PajqqBCFeXmHmdDdzgU6j7XT0k9SB5CAPKS5/iNASBwUVFKfIJIOu6WO1J1yp6QFHdiDqzMqHSLNTPYSiW6+0p3EaeMTZDzRnseOvpqiqpM04jF+AzdFs2vmLgJlAAAAAElFTkSuQmCC'
}
