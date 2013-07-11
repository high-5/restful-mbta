restful-mbta
============

Node.js wrapper for MBTA's RESTful API.

A demo api key can be retreived at any time from [here](http://realtime.mbta.com/Portal/Content/Download/APIKey.txt)

#### Sample Usage
 - the mbta demo key is 

##### coffee
```coffeescript
MBTA = require './mbta'
client = new MBTA("CURRENT_DEMO_KEY")
routePromise = client.findRoutes("Ferry")
routePromise.then (response) ->
  console.log JSON.stringify response, false, 4
```
##### node
```javascript
var MBTA = require('./mbta');
var client = new MBTA("CURRENT_DEMO_KEY");
var routePromise = client.findRoutes("Ferry");
routePromise.then(function(response) {
  console.log(JSON.stringify(response, false, 4))
});
```

both output:
```shell
[
    {
        "route_id": "Boat-F4",
        "route_name": "Charlestown Ferry"
    },
    {
        "route_id": "Boat-F1",
        "route_name": "Hingham Ferry"
    },
    {
        "route_id": "Boat-F2",
        "route_name": "Quincy Ferry"
    },
    {
        "route_id": "Boat-F2(H)",
        "route_name": "Quincy/Hull Ferry"
    }
]
```

