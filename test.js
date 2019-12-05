var { from } = require('rxjs');
var { map } = require('rxjs/operators');

// console.log(rxjs);
var obs = from(new Promise((resolve, reject) => {
    resolve('Hello');
}));

obs.pipe(
    map(val => val + ' ' + 'World awesome')
).subscribe(console.log);