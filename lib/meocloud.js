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

    if (!config || !config.oauth) {
        throw new Error('Config object with OAuth credentials required');
    }

    config.root = config.root || 'meocloud';
    config.noSSL = config.noSSL || false;

    var PROTOCOL = config.noSSL ? 'http' : 'https';
    var ENDPOINT = PROTOCOL + '://api.meocloud.pt';
    var CONTENT_ENDPOINT = PROTOCOL + '://api-content.meocloud.pt';

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

        options.oauth = config.oauth;

        if (Object.keys(query).length > 0) {
            if (options.method === 'GET' || options.method === 'PUT') {
                options.uri += '?' + querystring.stringify(query);
            } else {
                options.body = querystring.stringify(query);
                options.headers = options.headers || {};
                options.headers['content-type'] = 'application/x-www-form-urlencoded';
            }
        }

        return request(options, function(err, response, body) {
            var statusCode = response ? response.statusCode : null;
            return cb(err, body, statusCode);
        });
    };

    var metadata = function(path, query, cb) {
        query = query || {};

        var options = {};
        options.method = 'GET';
        options.uri = [ ENDPOINT, '/1/Metadata/', config.root, path ].join('');

        createRequest(options, query, function(err, body, status) {
            return cb(err, body, status);
        });
    };

    var metadataShare = function(shareID, path, query, cb) {
        query = query || {};

        var options = {};
        options.method = 'GET';
        options.uri = [ ENDPOINT, '/1/MetadataShare/', shareID, path ].join('');

        return createRequest(options, query, function(err, body, status) {
            return cb(err, body, status);
        });

    };

    var listLinks = function(cb) {
        var options = {};
        options.method = 'GET';
        options.uri = [ ENDPOINT + '/1/ListLinks' ].join('');

        return createRequest(options, null, function(err, body, status) {
            return cb(err, body, status);
        });
    };

    var deleteLink = function(query, cb) {
        var options = {};
        options.method = 'POST';
        options.uri = [ ENDPOINT + '/1/DeleteLink' ].join('');

        return createRequest(options, query, function(err, body, status) {
            return cb(err, body, status);
        });
    };

    var shares = function(path, cb) {
        var options = {};
        options.method = 'POST';
        options.uri = [ ENDPOINT, '/1/Shares/', config.root, path ].join('');

        return createRequest(options, null, function(err, body, status) {
            return cb(err, body, status);
        });
    };

    var shareFolder = function(path, query, cb) {
        var options = {};
        options.method = 'POST';
        options.uri = [ ENDPOINT, '/1/ShareFolder/', config.root, path ].join('');

        return createRequest(options, query, function(err, body, status) {
            return cb(err, body, status);
        });
    };

    var listSharedFolders = function(cb) {
        var options = {};
        options.method = 'GET';
        options.uri = [ ENDPOINT, '/1/ListSharedFolders' ].join('');

        return createRequest(options, null, function(err, body, status) {
            return cb(err, body, status);
        });
    };

    var thumbnails = function(path, query, cb) {
        var options = {};
        options.method = 'GET';
        options.uri = [
            CONTENT_ENDPOINT,
            '/1/Thumbnails/',
            config.root,
            path
        ].join('');

        return createRequest(options, query, function(err, stream, status) {
            return cb(err, stream, status);
        });
    };

    var search = function(path, query, cb) {
        var options = {};
        options.method = 'GET';
        options.uri = [ ENDPOINT, '/1/Search/', config.root, path ].join('');

        return createRequest(options, query, function(err, data, status) {
            return cb(err, data, status);
        });
    };

    var revisions = function(path, query, cb) {
        var options = {};
        options.method = 'GET';
        options.uri = [ ENDPOINT, '/1/Revisions/', config.root, path ].join('');

        return createRequest(options, query, function(err, data, status) {
            return cb(err, data, status);
        });
    };

    var restore = function(path, query, cb) {
        var options = {};
        options.method = 'POST';
        options.uri = [ ENDPOINT, '/1/Restore/', config.root, path ].join('');

        return createRequest(options, query, function(err, data, status) {
            return cb(err, data, status);
        });
    };

    var media = function(path, query, cb) {
        var options = {};
        options.method = 'POST';
        options.uri = [ ENDPOINT, '/1/Media/', config.root, path ].join('');

        return createRequest(options, query, function(err, data, status) {
            return cb(err, data, status);
        });
    };

    /**
     * Upload / download files
     *
     * What switches the upload on this method is the presence of:
     *      - query.fileStream (a Readable Stream to a file)
     *      - query.fileSize (the size of the file being uploaded)
     * Without these params, the method will act as download.
     *
     * Check the meocloud API docs for more info.
     *
     * @param {string} path the path to the file
     * @param {object} query the query params
     * @param {function} cb the callback function
     *
     * @return {object} the request object
     */
    var files = function(path, query, cb) {
        var fileStream = query.fileStream;
        var options = {};
        options.method = fileStream ? 'PUT' : 'GET';
        options.uri = [ CONTENT_ENDPOINT, '/1/Files/', config.root, path ].join('');

        if (options.method === 'PUT') {
            if (!query || !query.fileSize) {
                throw new Error('Required argument fileSize not present.');
            }
            options.headers = { 'content-length': query.fileSize };
        }

        // remove them to avoid being "querystringified"
        delete query.fileStream;
        delete query.fileSize;

        var request = createRequest(options, query, function(err, data, status) {
            return cb(err, data, status);
        });

        if (fileStream) {
            return fileStream.pipe(request);
        }
        return request;
    };

    var delta = function(query, cb) {
        var options = {};
        options.method = 'POST';
        options.uri = [ ENDPOINT, '/1/Delta' ].join('');

        return createRequest(options, query, function(err, data, status) {
            return cb(err, data, status);
        });
    };

    var copy = function(query, cb) {
        var options = {};
        options.method = 'POST';
        options.uri = [ ENDPOINT, '/1/Fileops/Copy' ].join('');

        query.root = query.root || config.root;

        return createRequest(options, query, function(err, data, status) {
            return cb(err, data, status);
        });
    };

    var copyRef = function(path, query, cb) {
        var options = {};
        options.method = 'GET';
        options.uri = [ ENDPOINT, '/1/CopyRef/', config.root, path ].join('');

        return createRequest(options, query, function(err, data, status) {
            return cb(err, data, status);
        });
    };

    var deleteFile = function(query, cb) {
        var options = {};
        options.method = 'POST';
        options.uri = [ ENDPOINT, '/1/Fileops/Delete' ].join('');

        query.root = query.root || config.root;

        return createRequest(options, query, function(err, data, status) {
            return cb(err, data, status);
        });
    };

    var move = function(query, cb) {
        var options = {};
        options.method = 'POST';
        options.uri = [ ENDPOINT, '/1/Fileops/Move' ].join('');

        query.root = query.root || config.root;

        return createRequest(options, query, function(err, data, status) {
            return cb(err, data, status);
        });
    };

    var createFolder = function(query, cb) {
        var options = {};
        options.method = 'POST';
        options.uri = [ ENDPOINT, '/1/Fileops/CreateFolder' ].join('');

        query.root = query.root || config.root;

        return createRequest(options, query, function(err, data, status) {
            return cb(err, data, status);
        });
    };

    var undeleteTree = function(path, cb) {
        var options = {};
        options.method = 'POST';
        options.uri = [ ENDPOINT, '/1/UndeleteTree/', config.root, path ].join('');

        return createRequest(options, null, function(err, data, status) {
            return cb(err, data, status);
        });
    };

    var accountInfo = function(cb) {
        var options = {};
        options.method = 'GET';
        options.uri = [ ENDPOINT, '/1/Account/Info' ].join('');

        return createRequest(options, null, function(err, data, status) {
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
        files: files,
        delta: delta,
        copy: copy,
        copyRef: copyRef,
        delete: deleteFile,
        move: move,
        createFolder: createFolder,
        undeleteTree: undeleteTree,
        accountInfo: accountInfo
    };
};
