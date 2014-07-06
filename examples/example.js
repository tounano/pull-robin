var pull = require("pull-stream");
var robin = require("../");

pull(
  robin(
    pull.values([1,4,7]),
    pull(pull.values([2,5])),
    pull.values([3,6,8])
  ),
  pull.log()
)