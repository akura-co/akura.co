(function () {
  var
    AkuraPrototype = {
      action: action,
      call: call,
    },
    Akura = function (opts) {
      this.opts = opts || {}
      this.akuraApiUrl = opts.url || 'https://akura.co'

      // make sure there is slash in the end
      this.akuraApiUrl = this.akuraApiUrl.replace(/\/$/, '') + '/'
    },
    root = this,
    $ = root.jQuery,
    has_require = typeof require !== 'undefined'

    Akura.prototype = AkuraPrototype

    if (typeof $ === 'undefined') {
      if (has_require) {
        $ = require('request')
      }
    }

    function action (done) {
      this.call('action', done)
    }

    function call (opts, data, done) {
      // if second argument is function (if `data` is not requiered for GET)
      if (typeof data == 'function') {
        done = data
        data = null
      }
      // if first argument is string (url)
      var
        url = this.akuraApiUrl + (opts.url || opts),
        method = opts.method || 'get',
        err,
        data
      if (has_require) {
        // for NPM request
        opts = {
          url: url,
          method: method,
          form: data
        }
      } else {
        // for jquery
        opts = {
          url: url,
          type: method.toUpperCase(),
          data: data
        }
      }
      $[method](opts, function () {
        if (has_require) {
          // if using request module, data is third arguments
          try {
            err = arguments[0]
            data = JSON.parse(arguments[2])
          } catch (e) {
            data = []
          }
        } else {
          // if using jquery module, data is first arguments
          data = arguments[0]
        }
        if (err) {
          return done(err)
        }
        return done(null, data)
      })
    }

    // check if client is used in common.js api (node, browserify, jetpack)
    if (typeof exports !== 'undefined') {
      if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = Akura
      }
      exports.Akura = Akura
    } else {
      root.Akura = Akura
    }

}).call(this);
