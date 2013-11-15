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

    /**
     * Creates a request object based on options passed and query params
     *
     * @param options {object} the options object to be passed to request
     * @param query {object} the object with querystring params or body params
     * @param cb {function} the callback function
     */
    var createRequest = function(options, query, cb) {
        query = query || {};

        options.timeout = 0;
        options.json = true;

        if (Object.keys(query).length > 0) {
            if (options.method === 'GET') {
                options.uri += '?' + querystring.stringify(query);
            } else {
                options.form = query;
            }
        }

        request(options, function(err, response, body) {
            return cb(err, body, response.statusCode);
        });
    };

    var metadata = function(path, query, cb) {
        query = query || {};

        var options = {};
        options.method = 'GET';
        options.uri = ENDPOINT + '/1/Metadata/meocloud' + path;

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

    var listLinks = function(cb) {
        var options = {};
        options.method = 'GET';
        options.uri = ENDPOINT + '/1/ListLinks';

        return createRequest(options, null, function(err, body, status) {
            return cb(err, body, status);
        });
    };

    var deleteLink = function(shareID, cb) {
        var query = { shareid: shareID };
        var options = {};
        options.method = 'POST';
        options.uri = ENDPOINT + '/1/DeleteLink';

        return createRequest(options, query, function(err, body, status) {
            return cb(err, body, status);
        });
    };

    var shares = function(path, cb) {
        var options = {};
        options.method = 'POST';
        options.uri = ENDPOINT + '/1/Shares/meocloud' + path;

        return createRequest(options, null, function(err, body, status) {
            return cb(err, body, status);
        });
    };

    var shareFolder = function(path, query, cb) {
        var options = {};
        options.method = 'POST';
        options.uri = ENDPOINT + '/1/ShareFolder/meocloud' + path;

        return createRequest(options, null, function(err, body, status) {
            return cb(err, body, status);
        });
    };

    var listSharedFolders = function(cb) {
        var options = {};
        options.method = 'GET';
        options.uri = ENDPOINT + '/1/ListSharedFolders';

        return createRequest(options, null, function(err, body, status) {
            return cb(err, body, status);
        });
    };

    var thumbnails = function(path, query, cb) {
        var options = {};
        options.method = 'GET';
        options.uri = ENDPOINT + '/1/Thumbnails/meocloud' + path;

        return createRequest(options, query, function(err, stream, status) {
            return cb(err, stream, status);
        });
    };

    var search = function(path, query, cb) {
        var options = {};
        options.method = 'GET';
        options.uri = ENDPOINT + '/1/Search/meocloud' + path;

        return createRequest(options, query, function(err, data, status) {
            return cb(err, data, status);
        });
    };

    var revisions = function(path, query, cb) {
        var options = {};
        options.method = 'GET';
        options.uri = ENDPOINT + '/1/Revisions/meocloud' + path;

        return createRequest(options, query, function(err, data, status) {
            return cb(err, data, status);
        });
    };

    var restore = function(path, query, cb) {
        var options = {};
        options.method = 'POST';
        options.uri = ENDPOINT + '/1/Restore/meocloud' + path;

        return createRequest(options, query, function(err, data, status) {
            return cb(err, data, status);
        });
    };

    var media = function(path, query, cb) {
        var options = {};
        options.method = 'POST';
        options.uri = ENDPOINT + '/1/Media/meocloud' + path;

        return createRequest(options, query, function(err, data, status) {
            return cb(err, data, status);
        });
    };

    // TODO files here!

    var delta = function(query, cb) {
        var options = {};
        options.method = 'POST';
        options.uri = ENDPOINT + '/1/Delta';

        return createRequest(options, query, function(err, data, status) {
            return cb(err, data, status);
        });
    };

    var copy = function(query, cb) {
        var options = {};
        options.method = 'POST';
        options.uri = ENDPOINT + '/1/Copy';

        return createRequest(options, query, function(err, data, status) {
            return cb(err, data, status);
        });
    };

    return {
        metadata: metadata,
        metadataShare: metadataShare,
        listLinks: listLinks,
        deleteLink: deleteLink,
        shares: shares,
        shareFolder: shareFolder,
        listSharedFolders: listSharedFolders,
        thumbnails: thumbnails,
        search: search,
        revisions: revisions,
        restore: restore,
        media: media,
        delta: delta,
        copy: copy
    };
};
