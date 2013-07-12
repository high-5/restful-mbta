Q = require 'q'
request = require 'request'

class MBTA
  constructor: (@key) ->
    @apiUrl = 'http://realtime.mbta.com/developer/api/v1/'

  _parseRoutes: (routesResponse) ->
    routeList = []
    for routeType in routesResponse.mode
      fatRoutes = routeType.route.map (route) ->
        route.route_type = routeType.route_type
        route.mode_name = routeType.mode_name
        route
      routeList = routeList.concat(fatRoutes)

    routeList

  _parse:
    routes: @_parseRoutes

  buildOptions: (path, qsOpts) ->
    (
      url: "#{@apiUrl}#{path}"
      json: true
      qs: qsOpts
      type: path
    )

  _doRequest: (opts) ->
    deferred = Q.defer()
    type = opts.type
    delete opts.type

    request.get opts, (e,r,body) =>

      return deferred.reject e if e
      deferred.resolve @_parse[type]?(body) or body

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

  _resolveRoutes: (deferred, routeKey, routes) ->
    deferred.resolve routes.filter (r) -> r.route_name.indexOf(routeKey) isnt -1

  findRoutes: (routeKey) ->
    deferred = Q.defer()
    resolveRoutes = @_resolveRoutes.bind @, deferred, routeKey
    @routes().then(resolveRoutes).fail (e) -> deferred.reject e
    deferred.promise

module.exports = MBTA
