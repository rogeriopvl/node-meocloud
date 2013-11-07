var expect = require('chai').expect;
var nock = require('nock');
var querystring = require('querystring');

var MEOCloud = require('../lib/meocloud.js');
var meocloud;

describe('MEOCloud', function() {

    describe('OAuth', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud({});
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

            meocloud.metadata('/test', {}, function(err, data) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(data).to.have.ownProperty('is_dir');
                expect(data).to.have.ownProperty('root');
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

            meocloud.metadata('/test', query, function(err, data) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(data).to.have.ownProperty('is_dir');
                expect(data).to.have.ownProperty('root');
                done();
            });
        });
    });
});
