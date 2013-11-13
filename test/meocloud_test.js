'use strict';

var expect = require('chai').expect;
var nock = require('nock');
var querystring = require('querystring');

var MEOCloud = require('../lib/meocloud.js');
var meocloud;

// OAuth params
var config = {
    consumer_key: 'foo',
    consumer_secret: 'bar',
    token: 'foobar',
    token_secret: 'xfoobar'
};

describe('MEOCloud', function() {

    describe('OAuth', function() {

        it('should return exception if no config passed', function(done) {
            expect(MEOCloud).to.throw(Error);
            done();
        });

        it('should send OAuth params in request header', function(done) {
            // TODO
            done();
        });

    });

    describe('Metadata', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud({});
            done();
        });

        it('should exist as a plublic method on MEOCloud', function(done) {
            expect(typeof meocloud.metadata).to.equal('function');
            done();
        });

        it('should make correct metadata request without params', function(done) {
            nock('https://api.meocloud.pt').get('/1/Metadata/meocloud/test')
            .reply(200, { is_dir: true, root: 'meocloud' });

            meocloud.metadata('/test', {}, function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(data).to.have.ownProperty('is_dir');
                expect(data).to.have.ownProperty('root');
                expect(status).to.equal(200);
                done();
            });
        });

        it('should make correct metadata request with params', function(done) {
            var query = {
                file_limit: 10,
                hash: 'blabla',
                list: false,
                include_deleted: true,
                rev: 'foobar'
            };

            var qs = querystring.stringify(query);

            nock('https://api.meocloud.pt')
            .get('/1/Metadata/meocloud/test?' + qs)
            .reply(200, { is_dir: true, root: 'meocloud' });

            meocloud.metadata('/test', query, function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(data).to.have.ownProperty('is_dir');
                expect(data).to.have.ownProperty('root');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('MetadataShare', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud({});
            done();
        });

        it('should exist as a plublic method on MEOCloud', function(done) {
            expect(typeof meocloud.metadataShare).to.equal('function');
            done();
        });


        it('should make correct metadataShare request without params', function(done) {
            nock('https://api.meocloud.pt')
            .get('/1/MetadataShare/bb26f0f6-d66f-46a7-8905-1fc125a293e7/test')
            .reply(200, { is_dir: true, root: 'meocloud' });

            meocloud.metadataShare(
                'bb26f0f6-d66f-46a7-8905-1fc125a293e7',
                '/test',
                null,
                function(err, data, status) {
                    expect(err).to.not.be.ok;
                    expect(data).to.be.an('object');
                    expect(data).to.have.ownProperty('is_dir');
                    expect(data).to.have.ownProperty('root');
                    expect(status).to.equal(200);
                    done();
                }
            );
        });

        it('should make correct metadataShare request with params', function(done) {
            nock('https://api.meocloud.pt')
            .get('/1/MetadataShare/bb26f0f6-d66f-46a7-8905-1fc125a293e7/test?file_limit=1')
            .reply(200, { is_dir: true, root: 'meocloud' });

            meocloud.metadataShare(
                'bb26f0f6-d66f-46a7-8905-1fc125a293e7',
                '/test',
                { file_limit: 1 },
                function(err, data, status) {
                    expect(err).to.not.be.ok;
                    expect(data).to.be.an('object');
                    expect(data).to.have.ownProperty('is_dir');
                    expect(data).to.have.ownProperty('root');
                    expect(status).to.equal(200);
                    done();
                }
            );
        });
    });

    describe('ListLinks', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud({});
            done();
        });

        it('should exist as a plublic method on MEOCloud', function(done) {
            expect(typeof meocloud.listLinks).to.equal('function');
            done();
        });

        it('should make correct ListLinks request', function(done) {
            nock('https://api.meocloud.pt')
            .get('/1/ListLinks')
            .reply(200, [ { url: 'http://foobar.com', shareid: 'abcdefghijkl' } ]);

            meocloud.listLinks(function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('array');
                expect(data[0]).to.have.ownProperty('url');
                expect(data[0]).to.have.ownProperty('shareid');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('DeleteLink', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud({});
            done();
        });

        it('should exist as a plublic method on MEOCloud', function(done) {
            expect(typeof meocloud.deleteLink).to.equal('function');
            done();
        });

        it('should make correct deleteLink request', function(done) {
            nock('https://api.meocloud.pt')
            .post('/1/DeleteLink', { shareid: 'abcdefghijkl' })
            .reply(200, {});

            meocloud.deleteLink('abcdefghijkl', function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(data).to.be.empty;
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('Shares', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud({});
            done();
        });

        it('should exist as a plublic method on MEOCloud', function(done) {
            expect(typeof meocloud.shares).to.equal('function');
            done();
        });

        it('should make correct shares request', function(done) {
            nock('https://api.meocloud.pt')
            .post('/1/Shares/meocloud/test.txt')
            .reply(200, {
                url: 'http://foobar',
                expires: 'Tue, 01 Jan 2030 00:00:00 +0000',
                link_shareid: 'abcdefghijkl'
            });

            meocloud.shares('/test.txt', function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(data).to.have.ownProperty('url');
                expect(data).to.have.ownProperty('expires');
                expect(data).to.have.ownProperty('link_shareid');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('ShareFolder', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud({});
            done();
        });

        it('should exist as a plublic method on MEOCloud', function(done) {
            expect(typeof meocloud.shareFolder).to.equal('function');
            done();
        });

        it('should make correct shareFolder request', function(done) {
            nock('https://api.meocloud.pt')
            .post('/1/ShareFolder/meocloud/testFolder')
            .reply(200, { req_id: '509fc400-2f65-11e2-9501-3c0754179fed' });

            meocloud.shareFolder('/testFolder', 'me@me.com', function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(data).to.have.ownProperty('req_id');
                expect(status).to.equal(200);
                done();
            });
        });
    });
});
