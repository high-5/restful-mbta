Q = require 'q'
request = require 'request'
_ = require 'lodash'

class MBTA
  constructor: (@key) ->
    @apiUrl = 'http://realtime.mbta.com/developer/api/v1/'

  buildOptions: (path, qsOpts) ->
    (
      url: "#{@apiUrl}#{path}"
      json: true
      qs: qsOpts
    )

  _doRequest: (opts) ->
    deferred = Q.defer()

    request.get opts, (e,r,body) ->
      return deferred.reject e if e
      deferred.resolve body

    deferred.promise

  _addKey: (opts) ->
    opts["api_key"] = @key
    opts

  servertime: ->
    @_doRequest @buildOptions "servertime", @_addKey({})

  routes: ->
    @_doRequest @buildOptions "routes", @_addKey({})

  routesByStop: (stop) ->
    @_doRequest @buildOptions "routesbystop", @_addKey({ stop })

  stopsByRoute: (route) ->
    @_doRequest @buildOptions "stopsbyroute", @_addKey({ route })

  stopsByLocation: (pos) ->
    @_doRequest @buildOptions "stopsbylocation", @_addKey({ lat: pos.lat, lon: pos.lon })

  scheduleByStop: (opts) ->
    @_doRequest @buildOptions "schedulebystop", @_addKey(opts)

  scheduleByRoute: (opts) ->
    @_doRequest @buildOptions "schedulebyroute", @_addKey(opts)

  scheduleByTrip: (opts) ->
    @_doRequest @buildOptions "schedulebytrip", @_addKey(opts)

  alerts: ->
    @_doRequest @buildOptions "alerts", @_addKey({})

  alertByID: (id) ->
    @_doRequest @buildOptions "alertbyid", @_addKey({ id })

  alertHeadersByRoute: (route) ->
    @_doRequest @buildOptions "alertheadersbyroute", @_addKey({ route })

  alertHeadersByStop: (stop) ->
    @_doRequest @buildOptions "alertheadersbystop", @_addKey({ stop })

  _parseRoutes: (deferred, routeKey, routes) ->
    routeArray = routes.mode.map (r) ->
      route = r.route
      route.route_type = r.route_type
      route.mode_name = r.mode_name
      route

    routeList = _.flatten routeArray
    filteredList = routeList.filter (r) ->
      r.route_name.indexOf(routeKey) isnt -1

    deferred.resolve filteredList

  findRoutes: (routeKey) ->
    deferred = Q.defer()
    parseRoutes = @_parseRoutes.bind @, deferred, routeKey
    @routes().then(parseRoutes).fail (e) -> deferred.reject e
    deferred.promise

module.exports = MBTA