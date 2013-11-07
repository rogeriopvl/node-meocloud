/*
 * meocloud
 * http://github.com/rogeriopvl/node-meocloud
 *
 * Copyright (c) 2013 Rogério Vicente
 * Licensed under the MIT license.
 */

'use strict';

var request = require('request');
var querystring = require('querystring');

module.exports = function(config) {

    var ENDPOINT = 'https://api.meocloud.pt';
    var CONTENT_ENDPOINT = 'https://content-api.meocloud.pt';

    var metadata = function(path, query, cb) {
        query = query || {};

        var options = {
            uri: ENDPOINT + '/1/Metadata/meocloud' + path,
            method: 'GET',
            timeout: 0,
            json: true
        };
        if (Object.keys(query).length > 0) {
            options.uri += '?' + querystring.stringify(query);
        }
        request(options, function(err, response, body) {
            return cb(err, body, response.status);
        });
    };

    return {
        metadata: metadata
    };
};
