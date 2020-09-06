//export const wordwrap = (s, w) => s.replace(/(?![^\n]{1,32}$)([^\n]{1,32})\s/g, '$1\n');

// Dynamic Width (Build Regex)
export const wordwrap = (s, w) => s.replace(
    new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, 'g'), '$1\n'
);
console.log(wordwrap('So many years have passed since your days as a newborn electron, freely roaming in any metallic conductor',8).split("\n"))
