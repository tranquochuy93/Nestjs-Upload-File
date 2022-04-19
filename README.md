
### Readable stream
1. The readable stream can be in two modes:
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
