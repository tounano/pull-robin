var pull = require("pull-stream");
var _ = require("underscore");

var robin = module.exports = pull.Source(function (streams) {
  streams = _.isArray(streams) ? streams : [].slice.call(arguments);
  var reads = [], streamcount = streams.length, ended;
  return function (end, cb) {
    if (ended) return cb(ended);
    reads.push([end, cb]);

    ;(function drain() {
      while (streams.length && reads.length)
        (function (read, end, cb){
          read(end, function (_end, data) {
            if (_end) {
              --streamcount;
              ended = streamcount === 0 || _end !== true;

              if (!ended) {
                reads.unshift([end, cb]);
                return drain();
              }

              cb(_end, data);
              return drain();
            }

            cb(_end, data);
            streams.push(read)
            return drain();
          })
        })(streams.shift(), reads[0][0], reads.shift()[1]);

      while (ended && streams.length) {
        --streamcount;
        streams.shift()(true, function(){});
      }

      while (ended && reads.length)
        reads[0][1](reads.shift()[0] || true);
    })();
  }
})