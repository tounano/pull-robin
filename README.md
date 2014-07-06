# pull-robin

Read source pull-streams, in round robin fashion.

## Usage

`robin(?isSerial, streams...)`

### args

*  `isSerial` - optional. If set to true, it will wait for a response from a stream, before reading from the next. Default
is false.
*  `streams` - an array of `source` streams, or a list of `source` streams as args.

## Example

```js
var pull = require("pull-stream");
var robin = require("pull-robin");

pull(
  robin(
    pull.values([1,4,7]),
    pull.values([2,5]),
    pull.values([3,6,8])
  ),
  pull.log()
)
```

## install

With [npm](https://npmjs.org) do:

```
npm install pull-robin
```

## license

MIT