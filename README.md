# meocloud [![Build Status](https://secure.travis-ci.org/rogeriopvl/node-meocloud.png?branch=master)](http://travis-ci.org/rogeriopvl/node-meocloud)

[MEOCloud](http://www.meocloud.pt) api wrapper.

## Getting Started

    npm install meocloud --save

## Some Examples

### Config

    var config = {
        auth: {
            consumer_key: 'xxxxxxxxxxxxxx',
            consumer_secret: 'xxxxxxxxxxxx',
            token: 'xxxxxxxxxxxxxx',
            token_secret: 'xxxxxxxxxxxxxx';
        },
        root: 'meocloud', // or sandbox
        noSSL: true // default: false
    }

    var meocloud = require('meocloud')(config);

### Search for file

    var meocloud = require('meocloud')(config);

    var params = {
        query: 'my_search_term'
    };

    meocloud.search('/', params, function(err, data, status) {
        console.log(err, data, status);
    });

### File Upload

There's two ways to make file uploads.

The first one, gives you enough flexibility to adapt to your project, but requires you to provide all the code to deal with files, and returns the request object so you can add event listeners to control the progress or whatever. Here's an example:

    var meocloud = require('meocloud')(config);
    var fs = require('fs');

    fs.stat('/file/to/upload.txt', console.log(err, stat) {
       if (err) { throw err; }

       var fstream = fs.createReadStream('/file/to/upload.txt');

        meocloud.putFile('/new/file/path.txt', fstream, stat.size, params, function(err, data, status) {
            console.log(err, data, status);
        });

    });

The second way, uses a helper method that takes care of all the details for you. If you don't need the flexibility of the method above, just use this:

    var meocloud = require(meocloud)(config);

    var params = { 'overwrite': true }; // add here only the MEOCloud API params

    meocloud.upload('/file/to/upload.txt', '/new/file/path.txt', params, function(err, data, status) {
        console.log(err, data, status);
    });

#### More samples coming soon ...

## Documentation

_(Coming soon)_


## License
Copyright (c) 2013 Rogério Vicente. Licensed under the MIT license.
