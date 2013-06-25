var request = require('request');
var _ = require('lodash');

module.exports = MBTA;

var apiURL = 'http://realtime.mbta.com/developer/api/v1/';

function MBTA(key) {
	this.key = key;
}

MBTA.prototype.servertime = function(cb) {
	var options = {
		uri: apiURL + 'servertime',
		json: true,
		qs: { api_key: this.key }
	};

	request(options, function(e,r,body) {
		cb(e,r,body);
	});
};

//route list
MBTA.prototype.routes = function(cb) {
	var options = {
		uri: apiURL + 'routes',
		json: true,
		qs: { api_key: this.key }
	};

	request(options, function(e,r,routes) {
		cb(e,r,routes.mode);
	});
};

// route list by stop
MBTA.prototype.routesByStop = function(stop, cb) {
	var options = {
			uri: apiURL + 'routesbystop',
			json: true,
			qs: { api_key: this.key, stop: stop }
		};

	request(options, function(e,r,body) {
		cb(e,r,body);
	});
};

// stop list by route
MBTA.prototype.stopsByRoute = function(route, cb) {
	var options = {
			uri: apiURL + 'stopsbyroute',
			json: true,
			qs: { api_key: this.key, route: route }
		};

	request(options, function(e,r,body) {
		cb(e,r,body);
	});
};

// 5 closest stops to user location
MBTA.prototype.stopsByLocation = function(pos, cb) {
	var options = {
			uri: apiURL + 'stopsbylocation',
			json: true,
			qs: { api_key: this.key, lat: pos.lat, lon: pos.lon }
		};

		request(options, function(e,r,body) {
			cb(e,r,body);
		});
};

// scheduled arrivals/departures by stop
// route, direction and datetime optional
MBTA.prototype.scheduleByStop = function(opts, cb) {
	opts.api_key = this.key;
	var options = {
		uri: apiURL + 'schedulebystop',
		json: true,
		qs: opts
	};

	request(options, function(e,r,body) {
		cb(e,r,body);
	});
};

// scheduled arrivals/departures by route
// direction and datetime optional
MBTA.prototype.scheduleByRoute = function(opts, cb) {
	opts.api_key = this.key;
	var options = {
		uri: apiURL + 'schedulebyroute',
		json: true,
		qs: opts
	};

	request(options, function(e,r,body) {
		cb(e,r,body);
	});

};

// scheduled arrivals/departures by trip
// datetime optional
MBTA.prototype.scheduleByTrip = function(opts, cb) {
	opts.api_key = this.key;
	var options = {
			uri: apiURL + 'schedulebytrip',
			json: true,
			qs: opts
		};

	request(options, function(e,r,body) {
		cb(e,r,body);
	});
};

// alerts
MBTA.prototype.alerts = function(cb) {
	var options = {
			uri: apiURL + 'alerts',
			json: true,
			qs: { api_key: this.key }
		};

	request(options, function(e,r,body) {
		cb(e,r,body);
	});
};

// alert by id
MBTA.prototype.alertByID = function(id, cb) {
	var options = {
		uri: apiURL + 'alertbyid',
		json: true,
		qs: { api_key: this.key, id: id }
	};

	request(options, function(e,r,body) {
		cb(e,r,body);
	});
};

// alert headers
MBTA.prototype.alertHeaders = function(cb) {
	var options = {
			uri: apiURL + 'alertheaders',
			json: true,
			qs: { api_key: this.key }
		};

	request(options, function(e,r,body) {
		cb(e,r,body);
	});
};

// alert headers by route
MBTA.prototype.alertHeadersByRoute = function(route, cb) {
	var options = {
			uri: apiURL + 'alertheadersbyroute',
			json: true,
			qs: { api_key: this.key, route: route }
	};

	request(options, function(e,r,body) {
		cb(e,r,body);
	});
};

// alert headers by stop
MBTA.prototype.alertHeadersByStop = function(stop, cb) {
	var options = {
			uri: apiURL + 'alertheadersbystop',
			json: true,
			qs: { api_key: this.key, stop: stop }
	};

	request(options, function(e,r,body) {
		cb(e,r,body);
	});
};

//Find routes by a strict value match for id, name, GTFS type, or mode
MBTA.prototype.findRoutes = function(routeKey,cb) {
	var routeArray = [];
	var routeList = [];

	this.routes(function(e,r,routes) {
		_.forEach(routes, function(returnedRoute) {
			var mapped = _.map(returnedRoute.route, function(route){
				route.route_type = returnedRoute.route_type;
				route.mode_name = returnedRoute.mode_name;
				return route;
			});
			routeArray.push(mapped);
		});

		routeList = _.flatten(routeArray);

		var filteredList = _.filter(routeList, function(route) {
			return _.contains(route, routeKey);
		});

		if (cb) {
			cb(filteredList);
		} else {
			return filteredList;
		}

	});
};