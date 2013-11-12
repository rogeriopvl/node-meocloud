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

    if (!config) {
        throw new Error('Config object with OAuth credentials required');
    }

    var ENDPOINT = 'https://api.meocloud.pt';
    var CONTENT_ENDPOINT = 'https://content-api.meocloud.pt';

    var createRequest = function(options, query, cb) {
        query = query || {};

        options.timeout = 0;
        options.json = true;

        if (Object.keys(query).length > 0) {
            options.uri += '?' + querystring.stringify(query);
        }
        request(options, function(err, response, body) {
            return cb(err, body, response.status);
        });
    };

    var metadata = function(path, query, cb) {
        query = query || {};

        var options = {};
        options.method = 'GET';
        options.uri = ENDPOINT + '/1/Metadata/meocloud' + path,

        createRequest(options, query, function(err, body, status) {
            return cb(err, body, status);
        });
    };

    var metadataShare = function(shareID, path, query, cb) {
        query = query || {};

        var options = {};
        options.method = 'GET';
        options.uri = ENDPOINT + '/1/MetadataShare/' + shareID + path;

        return createRequest(options, query, function(err, body, status) {
            return cb(err, body, status);
        });

    };

    return {
        metadata: metadata,
        metadataShare: metadataShare
    };
};
