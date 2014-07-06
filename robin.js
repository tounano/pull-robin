var pull = require("pull-stream");
var _ = require("underscore");

var robin = module.exports = pull.Source(function (isSerial, streams) {
  var args = [].slice.call(arguments);
  isSerial = _.isBoolean(args[0]) ? args.shift() : false;
  streams = _.isArray(args[0]) ? args[0] : args;

  var reads = [], streamcount = streams.length, ended, reading;

  return function (end, cb) {
    if (ended) return cb(ended);
    reads.push([end, cb]);

    ;(function drain() {
      if (streams.length && reads.length && !reading)
        (function (read, end, cb){
          reading = isSerial && true;
          read(end, function (_end, data) {
            if (_end) {
              --streamcount;
              ended = streamcount === 0 || _end !== true;

              if (!ended) {
                reads.unshift([end, cb]);
                reading = false;
                return drain();
              }

              cb(_end, data);
              reading = false;
              return drain();
            }

            cb(_end, data);
            streams.push(read)
            reading = false;
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