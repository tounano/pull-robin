# pull-robin

Read source pull-streams, in round robin fashion.

## Usage

`robin(streams...)`

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