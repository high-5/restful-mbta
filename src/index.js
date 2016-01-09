import request from 'request'

const API_URL = 'http://realtime.mbta.com/developer/api/v1/'

function parseRoutes ({ mode }) {
  return mode.reduce((result, routeType) => {
    const {route_type, mode_name} = routeType
    return result.concat(
      routeType.route.map(r => ({...r, route_type, mode_name}))
    )
  }, [])
}

const parse = { routes: parseRoutes }

function makeRequest ({ type, config }) {
  return new Promise((resolve, reject) => {
    request.get(config, (e, r, body) => {
      if (e) reject(e)
      else {
        const result = parse[type] ? parse[type](body) : body
        resolve(result)
      }
    })
  })
}

export default class MBTA {
  constructor (api_key, api_url = API_URL) {
    this.api_key = api_key
    this.api_url = api_url
    this._parse = { routes: this._parseRoutes }
  }

  buildOptions (path, opts = {}) {
    const { api_key, api_url } = this
    const qs = { ...opts, api_key }
    const config = {
      url: api_url + path,
      json: true,
      qs
    }

    return { config, type: path }
  }

  servertime () {
    return makeRequest(this.buildOptions('servertime'))
  }
  routes () {
    return makeRequest(this.buildOptions('routes'))
  }
  routesByStop (stop) {
    return makeRequest(this.buildOptions('routesbystop', { stop }))
  }

  stopsByRoute (route) {
    return makeRequest(this.buildOptions('stopsbyroute', { route }))
  }

  stopsByLocation ({lat, lon}) {
    return makeRequest(this.buildOptions('stopsbylocation', { lat, lon }))
  }

  scheduleByStop (opts) {
    return makeRequest(this.buildOptions('schedulebystop', opts))
  }

  scheduleByRoute (opts) {
    return makeRequest(this.buildOptions('schedulebyroute', opts))
  }

  scheduleByTrip (opts) {
    return makeRequest(this.buildOptions('schedulebytrip', opts))
  }

  alerts () {
    return makeRequest(this.buildOptions('alerts'))
  }
  alertByID (id) {
    return makeRequest(this.buildOptions('alertbyid', { id }))
  }

  alertHeadersByRoute (route) {
    return makeRequest(this.buildOptions('alertheadersbyroute', { route }))
  }

  alertHeadersByStop (stop) {
    return makeRequest(this.buildOptions('alertheadersbystop', { stop }))
  }
}
