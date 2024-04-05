var express = require('express');
var router = express.Router();
const { requestTorizonAPI } = require('../torizon_api');


// async/await error handling, give the error to the next middleware of expressjs
const asyncHandler = (fun) => (req, res, next) => {
  Promise.resolve(fun(req, res, next))
      .catch(next)
}

router.get('/', asyncHandler(async (req, res, next) => {
  // Request for all registered devices from the Torizon API
  var devices_response = await requestTorizonAPI("/devices");
  devices_response.data["title"] = "Torizon registered devices";

  devices_response.data.values.forEach (function (device) { 

    const d = new Date(device.lastSeen);
    const now = new Date();
    const connected = (now - d)/(1000 * 60) < 5;
    device["connected"] = connected;
   });


  res.render('index', devices_response.data);
}));

module.exports = router;

