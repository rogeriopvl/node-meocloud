var expect = require('chai').expect;
var nock = require('nock');

var meocloud = require('../lib/meocloud.js')({});

describe('MEOCloud', function() {

    describe('Metadata', function() {
        it('should exist as a plublic method on MEOCloud', function(done) {
            expect(typeof meocloud.metadata).to.equal('function');
            done();
        });

        it('should make correct metadata request', function(done) {
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
    });
});
