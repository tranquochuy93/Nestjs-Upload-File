### exceljs
1. read date cell
```
var utc_value = Math.floor(your_number- 25569) * 86400;
var date_info = new Date(utc_value * 1000);
var month = parseInt(date_info.getMonth()) + 1;
newDate = date_info.getFullYear() + "/" + month + "/" + date_info.getDate();
````

### Module
1. each file is treated as a separate module. Node.js wraps them in a function like this
```ts
function (exports, require, module, __filename, __dirname) {
  // code of the module
}
```
Node.js invokes the function that wraps our module a way, that the “this” keyword references to the module.exports
```js
console.log(this === module.exports); // true
```
utilities.js
```ts
function add (a, b) {
  return a + b;
}
 
function subtract (a, b) {
  return a - b;
}
 
module.exports = {
  add,
  subtract,
};
```
main.js
```ts
const { add, subtract } = require('./utilities.js');
 
console.log(add(1,2)); // 3
console.log(subtract(2,1)); // 1
```

2.  in the terminal, you are in the global scope, the “this” keyword references to the global object
```cmd
this ==== global; //true
var key = 'value';
global.key // 'value'
```

### Process arguments
1. The process object is a property of the global object
2. process.argv property holds an array containing the command line arguments you pass when launching the Node.js process.
main.ts
```ts
process.argv.forEach(argument => console.log(argument));
```
```cmd
node ./main.js one two three
```
/usr/bin/node
/home/marcin/Documents/node-playground/main.js
one
two
three

### EventEmitter
```ts
import * as EventEmitter from 'events';
 
const eventEmitter = new EventEmitter();
 
eventEmitter.on('event', function(data) { // listener
  console.log(data); // { key: value }
  console.log(this === eventEmitter); // true
});
 
eventEmitter.emit( // trigger event and send arguments
  'event',
  {
    key: 'value'
  }
);

eventEmitter.on('event1', () => {
  console.log(this === eventEmitter); // false
});

eventEmitter.emit( // trigger event and send arguments
  'event1'
);

eventEmitter.removeListener('event', listener);
```

### The buffer is an array of numbers
1. String Decoder: decoding Buffer objects into strings while preserving multi-byte characters.
StringDecoder ensures that the decoded string does not contain any incomplete multibyte characters by holding the incomplete character in an internal buffer until the next call to the  decoder.write()
```js
import { StringDecoder } from 'string_decoder';
 
const decoder = new StringDecoder('utf8');
 
const buffers = [
  Buffer.from('Hello '),
  Buffer.from([0b11110000, 0b10011111]),
  Buffer.from([0b10001100, 0b10001110]),
  Buffer.from(' world!'),
];
 
const result = buffers.reduce((result, buffer) => (
  `${result}${decoder.write(buffer)}`
), '');
 
console.log(result); // Hello 🌎 world!
```
2. Reading a file
- Thanks to { encoding: 'utf8' }, we receive its contents as a string
```js
import * as fs from 'fs';
import * as util from 'util'
 
const readFile = util.promisify(fs.readFile);
 
readFile('./file.txt', { encoding: 'utf8' })
  .then((content) => {
    console.log(content);
  })
  .catch(error => console.log(error));
```
-  If we don’t provide the encoding, we receive a raw buffer that we can stringify
```js
import * as fs from 'fs';
import * as util from 'util'
 
const readFile = util.promisify(fs.readFile);
 
readFile('./file.txt')
  .then((content) => {
    console.log(content instanceof Buffer); // true
    console.log(content.toString())
  })
  .catch(error => console.log(error));
```

### Readable stream
1. readFile waits for the whole file to load into memory before performing any actions.
2. The createReadStream, file gets split into multiple chunks. The stream emits the ‘data’ event every time the stream emits a chunk of data.
3. The readable stream can be in two modes:
paused
flowing

- All readable streams start in the paused mode by default.
- To switching the mode of a stream to flowing: attach a ‘data‘ event listener.
```js
import * as fs from 'fs';
 
const stream = fs.createReadStream('./file.txt');
 
stream.on('data', (chunk) => {
  console.log('New chunk of data:', chunk);
})
```
### Readable stream and Writable stream
1. By default, when all data is transmitted, and the readable emits the ‘end‘ event, the writable stream closes with the  writable.end function.
```js
import * as fs from 'fs';
 
const readable = fs.createReadStream('./file1.txt');
const writable = fs.createWriteStream('./file2.txt');
 
writable.on('finish', () => {
  console.log('The end!');
});
 
readable.pipe(writable);
```

 2. if any error occurs during piping, the writable is not closed automatically, so it might be necessary to track it and close it manually


### Process stream
1. process.argv
2. process.execPath
3. process.stdin:  is a readable stream, listen for data in the terminal
the stdin stream is in a paused mode by default
```js
let a;
let b;
 
process.stdin.on('data', (data) => {
  if(a === undefined) {
    a = Number(data.toString());
  } else if(b === undefined) {
    b = Number(data.toString());
    console.log(`${a} + ${b} = ${a + b}`);
    process.stdin.pause();
  }
});
```
4. process.stdout and process.stderr: are writable streams
used in the  console.log(), and  console.error()
```js
import * as fs from 'fs';
 
const readable = fs.createReadStream('./file1.txt');
 
readable.pipe(process.stdout);
```
