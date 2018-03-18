# meocloud [![Build Status](https://secure.travis-ci.org/rogeriopvl/node-meocloud.png?branch=master)](http://travis-ci.org/rogeriopvl/node-meocloud)

[![Greenkeeper badge](https://badges.greenkeeper.io/rogeriopvl/node-meocloud.svg)](https://greenkeeper.io/)

[MEOCloud](http://www.meocloud.pt) api wrapper.

## Getting Started

    npm install meocloud --save

## Some Examples

### Config

```js
var config = {
    oauth: {
        consumer_key: 'xxxxxxxxxxxxxx',
        consumer_secret: 'xxxxxxxxxxxx',
        token: 'xxxxxxxxxxxxxx',
        token_secret: 'xxxxxxxxxxxxxx';
    },
    root: 'meocloud', // or sandbox
    noSSL: true // default: false
}

var meocloud = require('meocloud')(config);
```

### Search for file

```js
var meocloud = require('meocloud')(config);

var params = {
    query: 'my_search_term'
};

meocloud.search('/', params, function(err, data, status) {
    console.log(err, data, status);
});
```

### File Upload

There's two ways to make file uploads.

The first way, uses a helper method that takes care of all the details for you. If you don't need much flexibility, just use this:

```js
var meocloud = require(meocloud)(config);

var params = {}; // add here only the MEOCloud API params

meocloud.upload('/file/to/upload.txt', '/new/file/path.txt', params, function(err, data, status) {
    console.log(err, data, status);
});
```

The second one, gives you enough flexibility to adapt to your project, but requires you to provide all the code to deal with files, and returns the request object so you can add event listeners to control the progress or whatever. Here's an example:

```js
var meocloud = require('meocloud')(config);
var fs = require('fs');

fs.stat('/file/to/upload.txt', console.log(err, stat) {
    if (err) { throw err; }

    var fstream = fs.createReadStream('/file/to/upload.txt');
    var params = { overwrite: true };

    meocloud.putFile('/new/file/path.txt', fstream, stat.size, params, function(err, data, status) {
        console.log(err, data, status);
    });

});
```


##### More samples coming soon ...

## Documentation

#### callback(err, data, status)

These are the arguments sent to every callback passed to this lib:

* `err` (object) if an error occurred, this param will exist
* `data` (object) the parsed JSON object from the API response
* `status` (integer) the http status returned from the API response

#### metadata(path, params, cb)

* `path` (string) the path the file / folder to retrieve info from
* `params` (hash) the params to send in the GET URI
    * `file_limit` limit the number of files to list (if `path` is a folder)
    * `hash` if you need to check for file changes
    * `list` `true` if you want to list files inside the folder, `false` otherwise
    * `include_deleted` `true` if you want to list deleted files
    * `rev` if you want a specific version of the file/folder
* `cb` (function) the callback function

#### metadataShare(shareID, path, params, cb)

* `shareID` (string) the ID of the shared file (returned by the API when sharing)
* `path` (string) the path to the shared file
* `params` (hash) the params to send in the request
    * `file_limit` the limit of files to be listed
* `cb` (function) the callback function

#### listLinks(cb)

* `cb` (function) the callback function

#### deleteLink(params, cb)

* `params` (hash) the params to send in the request
    * `shareid` the ID of the file share *(required)*
* `cb` (function) the callback function

#### shares(path, cb)

* `path` (string) the path to get all shares from
* `cb` (function) the callback function

#### shareFolder(path, params, cb)

* `path` (string) the path of the file/folder to share
* `params` (hash) the params to send in the request
    * `to_email` the email of the user to share the folder with *(required)*
* `cb` (function) the callback function

#### listSharedFolders(cb)

* `cb` (function) the callback function

#### thumbnails(path, params, cb)

* `path` (string) the path of the file to fetch the thumbnail
* `params` (hash) the params to send in the request
    * `format` the format of the thumb image file (`png` or `jpeg`)
    * `size` the size of the thumbnail (`xs`, `s`, `m`, `l`, `xl`)
* `cb` (function) the callback function

#### search(path, params, cb)

* `path` (string) the path where to start the search
* `params` (hash) the params to send in the request
    * `query` the term to search for *(required)*
    * `mime_type` the mime type of the files to search for
    * `file_limit` the number of files to return
    * `include_deleted` `true` if it should search for deleted files
* `cb` (function) the callback function

#### revisions(path, params, cb)

* `path` (string) path to the file/folder
* `params` (hash) the params to send in the request
    * `rev_limit` the number of revisions to return
* `cb` (function) the callback function

#### restore(path, params, cb)

* `path` (string) path of the deleted file/folder to restore
* `params` (hash) the params to send in the request
    * `rev` the revision to restore the file to *(required)*
* `cb` (function) the callback function

#### media(path, params, cb)

* `path` (string) path of the file/folder to get the media from
* `params` (hash) the params to send in the request
    * `download_fallback` true if you want to revert to download on failure
    * `protocol` the streaming protocol (`hls`, `rtmp`, `rtsp`, `ss`)
* `cb` (function) the callback function

#### getFile(path, params, cb)

* `path` (string) the path of the file to get/download
* `params` (hash) the params to send in the request
    * `rev` revision of the version of the file to get
* `cb` (function) the callback function

#### putFile(path, fileStream, fileSize, params, cb)

* `path` (string) the path where the file will be saved
* `fileStream` (readable stream) the stream of the file to be uploaded
* `fileSize` (integer) the size, in bytes, of the file to be uploaded
* `params` (hash) the params to send in the request
    * `overwrite` `true` if you want to overwrite an already existing file path *(requires parent_rev)*
    * `parent_rev` if you want to overwrite, add the latest rev of the file *(requires overwrite)*
* `cb` (function) the callback function

#### upload(origin, destination, params, cb)

* `origin` (string) the path of the file to be uploaded
* `destination` (string) the path where the file will be saved
* `params` (hash) the params to send in the request
    * `overwrite` `true` if you want to overwrite an already existing file path *(requires parent_rev)*
    * `parent_rev` if you want to overwrite, add the latest rev of the file *(requires overwrite)*
* `cb` (function) the callback function

#### delta(params, cb)

* `params` (hash) the params to send in the request
    * `cursor` only changes after this cursor will be listed
* `cb` (function) the callback function

#### copy(params, cb)

* `params` (hash) the params to send in the request
    * `root` choose `meocloud` or `sandbox`. default is `meocloud`.
    * `from_path` origin path of the file / folder *(required)*
    * `to_path` destination path of the file / folder *(required)*
    * `from_copy_ref` a reference to a shared file from other user
* `cb` (function) the callback function

#### copyRef(path, cb)

* `path`(string) path to the file
* `cb` (function) the callback function

#### delete(params, cb)

* `params` (hash) the params to send in the request
    * `path` the path of the file / folder to remove *(required)*
    * `root` choose `meocloud` or `sandbox`. default is `meocloud`.
* `cb` (function) the callback function

#### move(params, cb)

* `params` (hash) the params to send in the request
    * `from_path` the path of the file / folder to move *(required)*
    * `to_path` the destination path of the file / folder to move *(required)*
    * `root` choose `meocloud` or `sandbox`. default is `meocloud`.
* `cb` (function) the callback function

#### createFolder(params, cb)

* `params` (hash) the params to send in the request
    * `path` the path of the new folder *(required)*
    * `root` choose `meocloud` or `sandbox`. default is `meocloud`.
* `cb` (function) the callback function

#### undeleteTree(path, cb)

* `path` (string) the path of the file / folder to recover
* `params` (hash) the params to send in the request
    * `root` choose `meocloud` or `sandbox`. default is `meocloud`.
* `cb` (function) the callback function

#### accountInfo(cb)

* `cb` (function) the callback function

## License
Copyright (c) 2013 Rogério Vicente. Licensed under the MIT license.
