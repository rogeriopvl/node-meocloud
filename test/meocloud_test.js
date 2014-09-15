'use strict';

var expect = require('chai').expect;
var nock = require('nock');
var querystring = require('querystring');

var MEOCloud = require('../lib/meocloud.js');
var meocloud;

// OAuth params
var config = {
    oauth: {
        consumer_key: 'foo',
        consumer_secret: 'bar',
        token: 'foobar',
        token_secret: 'xfoobar'
    },
    root: 'sandbox'
};

// disable all real http connections
nock.disableNetConnect();

describe('MEOCloud', function() {

    describe('OAuth', function() {

        it('should return exception if no config passed', function(done) {
            expect(MEOCloud).to.throw(Error);
            done();
        });

        it('should send OAuth params in request header', function(done) {
            meocloud = new MEOCloud(config);
            nock('https://api.meocloud.pt')
            .matchHeader('Authorization', /oauth_token\=\"foobar\"/)
            .get('/1/Metadata/' + config.root + '/test')
            .reply(200, { is_dir: true, root: config.root });

            meocloud.metadata('/test', null, function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                done();
            });
        });

    });

    describe('Metadata', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.metadata).to.equal('function');
            done();
        });

        it('should make correct metadata request without params', function(done) {
            nock('https://api.meocloud.pt').get('/1/Metadata/' + config.root + '/test')
            .reply(200, { is_dir: true, root: config.root });

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
            .get('/1/Metadata/' + config.root + '/test?' + qs)
            .reply(200, { is_dir: true, root: config.root });

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
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.metadataShare).to.equal('function');
            done();
        });


        it('should make correct metadataShare request without params', function(done) {
            nock('https://api.meocloud.pt')
            .get('/1/MetadataShare/bb26f0f6-d66f-46a7-8905-1fc125a293e7/test')
            .reply(200, { is_dir: true, root: config.root });

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
            .reply(200, { is_dir: true, root: config.root });

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
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
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
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.deleteLink).to.equal('function');
            done();
        });

        it('should make correct deleteLink request', function(done) {
            nock('https://api.meocloud.pt')
            .post('/1/DeleteLink', { shareid: 'abcdefghijkl' })
            .reply(200, {});

            meocloud.deleteLink(
                { shareid: 'abcdefghijkl' },
                function(err, data, status) {
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
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.shares).to.equal('function');
            done();
        });

        it('should make correct shares request', function(done) {
            nock('https://api.meocloud.pt')
            .post('/1/Shares/' + config.root + '/test.txt')
            .reply(200, {
                url: 'http://foobar',
                expires: 'Tue, 01 Jan 2030 00:00:00 +0000',
                shareid: 'abcdefghijkl'
            });

            meocloud.shares('/test.txt', function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(data).to.have.ownProperty('url');
                expect(data).to.have.ownProperty('expires');
                expect(data).to.have.ownProperty('shareid');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('UploadLink', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.uploadLink).to.equal('function');
            done();
        });

        it('should make correct uploadLink request', function(done) {
            nock('https://api.meocloud.pt')
            .post('/1/UploadLink/' + config.root + '/testFolder')
            .reply(200, { shareid: '509fc400-2f65-11e2-9501-3c0754179fed' });

            meocloud.uploadLink('/testFolder', {
                ttl: '84600'
            }, function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(data).to.have.ownProperty('shareid');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('SetLinkTTL', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.setLinkTTL).to.equal('function');
            done();
        });

        it('should make correct setLinkTTL request', function(done) {
            nock('https://api.meocloud.pt')
            .post('/1/SetLinkTTL', {
                ttl: '84600',
                shareid: '509fc400-2f65-11e2-9501-3c0754179fed'
            }).reply(200, {});

            meocloud.setLinkTTL({
                ttl: '84600',
                shareid: '509fc400-2f65-11e2-9501-3c0754179fed'
            }, function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('ShortenLinkURL', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.shortenLinkURL).to.equal('function');
            done();
        });

        it('should make correct shortenLinkURL request', function(done) {
            nock('https://api.meocloud.pt')
            .post('/1/ShortenLinkURL', {
                shareid: '509fc400-2f65-11e2-9501-3c0754179fed'
            }).reply(200, { url: 'https://ga95k7.s.cld.pt' });

            meocloud.shortenLinkURL({
                shareid: '509fc400-2f65-11e2-9501-3c0754179fed'
            }, function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(data).to.have.ownProperty('url');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('DestroyShortURL', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.destroyShortURL).to.equal('function');
            done();
        });

        it('should make correct destroyShortURL request', function(done) {
            nock('https://api.meocloud.pt')
            .post('/1/DestroyShortURL/ga95k7')
            .reply(200, { share_uuid: '9a3c9576-37a9-40fd-8f7b-181f4da2f124' });

            meocloud.destroyShortURL('ga95k7', function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(data).to.have.ownProperty('share_uuid');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('LinkDomain', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.linkDomain).to.equal('function');
            done();
        });

        it('should make correct linkDomain request', function(done) {
            nock('https://api.meocloud.pt')
            .post('/1/LinkDomain', {
                shareid: '9a3c9576-37a9-40fd-8f7b-181f4da2f124',
                domain: 'example.com'
            })
            .reply(200, {});

            meocloud.linkDomain({
                shareid: '9a3c9576-37a9-40fd-8f7b-181f4da2f124',
                domain: 'example.com'
            }, function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('ChangeShareOwner', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.changeShareOwner).to.equal('function');
            done();
        });

        it('should make correct changeShareOwner request', function(done) {
            nock('https://api.meocloud.pt')
            .post('/1/ChangeShareOwner', {
                shareid: '9a3c9576-37a9-40fd-8f7b-181f4da2f124',
                to_userid: 'foobar'
            })
            .reply(200, { req_id: '509fc400-2f65-11e2-9501-3c0754179fed' });

            meocloud.changeShareOwner({
                shareid: '9a3c9576-37a9-40fd-8f7b-181f4da2f124',
                to_userid: 'foobar'
            }, function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(data).to.have.ownProperty('req_id');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('ParticipantLeavesSharedFolder', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.participantLeavesSharedFolder).to.equal('function');
            done();
        });

        it('should make correct participantLeavesSharedFolder request', function(done) {
            nock('https://api.meocloud.pt')
            .post('/1/ParticipantLeavesSharedFolder/' + config.root + '/testFolder')
            .reply(200, {});

            meocloud.participantLeavesSharedFolder(
                '/testFolder',
                function(err, data, status) {
                    expect(err).to.not.be.ok;
                    expect(data).to.be.an('object');
                    expect(status).to.equal(200);
                    done();
            });
        });
    });

    describe('RemoveParticipantFromSharedFolder', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.removeParticipantFromSharedFolder).to.equal('function');
            done();
        });

        it('should make correct removeParticipantFromSharedFolder request', function(done) {
            nock('https://api.meocloud.pt')
            .post(
                '/1/RemoveParticipantFromSharedFolder/' + config.root + '/testFolder',
                { participantid: 'foobar' }
            ).reply(200, {});

            meocloud.removeParticipantFromSharedFolder('/testFolder',{
                participantid: 'foobar'
            },
            function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('OwnerUnsharesFolder', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.ownerUnsharesFolder).to.equal('function');
            done();
        });

        it('should make correct ownerUnsharesFolder request', function(done) {
            nock('https://api.meocloud.pt')
            .post('/1/OwnerUnsharesFolder/' + config.root + '/testFolder')
            .reply(200, {});

            meocloud.ownerUnsharesFolder(
                '/testFolder',
                function(err, data, status) {
                    expect(err).to.not.be.ok;
                    expect(data).to.be.an('object');
                    expect(status).to.equal(200);
                    done();
            });
        });
    });

    describe('ShareFolder', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.shareFolder).to.equal('function');
            done();
        });

        it('should make correct shareFolder request', function(done) {
            nock('https://api.meocloud.pt')
            .post('/1/ShareFolder/' + config.root + '/testFolder')
            .reply(200, { req_id: '509fc400-2f65-11e2-9501-3c0754179fed' });

            meocloud.shareFolder('/testFolder', {
                to_email: 'me@me.com'
            }, function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(data).to.have.ownProperty('req_id');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('ListSharedFolders', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.listSharedFolders).to.equal('function');
            done();
        });

        it('should make correct listSharedFolders request', function(done) {
            nock('https://api.meocloud.pt')
            .get('/1/ListSharedFolders')
            .reply(200, {
                '509fc400-2f65-11e2-9501-3c0754179fed': {
                    folder_type: 'shared',
                    is_owner: true
                },
                'e328c1e9-149c-4065-815e-274de86c5f32': {
                    folder_type: 'shared',
                    is_owner: true
                }
            });

            meocloud.listSharedFolders(function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(data).to.have.ownProperty('e328c1e9-149c-4065-815e-274de86c5f32');
                expect(data).to.have.ownProperty('509fc400-2f65-11e2-9501-3c0754179fed');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('Thumbnails', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.thumbnails).to.equal('function');
            done();
        });

        it('should make correct thumbnails request', function(done) {
            nock('https://api-content.meocloud.pt')
            .get('/1/Thumbnails/' + config.root + '/test.jpg?size=m&format=png')
            .reply(200, {});

            meocloud.thumbnails('/test.jpg', {
                size: 'm',
                format: 'png'
            }, function(err, stream, status) {
                expect(err).to.not.be.ok;
                expect(stream).to.be.an('object');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('Search', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.search).to.equal('function');
            done();
        });

        it('should make correct search request', function(done) {
            nock('https://api.meocloud.pt')
            .get([
                '/1/Search/' + config.root + '/Public',
                '?query=test&mime_type=image%2F*&file_limit=10&include_deleted=true'
            ].join(''))
            .reply(200, [{
                mime_type: 'image/gif',
                rev: 'abcdefghijkl',
                size: '2 KB'
            }]);

            meocloud.search('/Public', {
                query: 'test',
                mime_type: 'image/*',
                file_limit: 10,
                include_deleted: 'true'
            }, function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('array');
                expect(data[0]).to.have.ownProperty('mime_type');
                expect(data[0]).to.have.ownProperty('rev');
                expect(data[0]).to.have.ownProperty('size');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('Revisions', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.revisions).to.equal('function');
            done();
        });

        it('should make correct revisions request', function(done) {
            nock('https://api.meocloud.pt')
            .get('/1/Revisions/' + config.root + '/Public/test.js?rev_limit=4')
            .reply(200, [{
                mime_type: 'application/javascript',
                rev: 'abcdefghijkl',
                size: '2 KB'
            }]);

            meocloud.revisions('/Public/test.js', {
                rev_limit: 4
            }, function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('array');
                expect(data[0]).to.have.ownProperty('mime_type');
                expect(data[0]).to.have.ownProperty('rev');
                expect(data[0]).to.have.ownProperty('size');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('Restore', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.restore).to.equal('function');
            done();
        });

        it('should make correct restore request', function(done) {
            nock('https://api.meocloud.pt')
            .post('/1/Restore/' + config.root + '/Public/test.js', { rev: 'abcdefghijkl'})
            .reply(200, {
                path: '/Public/test.js',
                rev: 'abcdefghijkl',
                size: '2 KB'
            });

            meocloud.restore('/Public/test.js', {
                rev: 'abcdefghijkl'
            }, function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(data).to.have.ownProperty('path');
                expect(data.path).to.equal('/Public/test.js');
                expect(data).to.have.ownProperty('rev');
                expect(data).to.have.ownProperty('size');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('Media', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.media).to.equal('function');
            done();
        });

        it('should make correct media request', function(done) {
            nock('https://api.meocloud.pt')
            .post('/1/Media/' + config.root + '/Movies/SAPO1.mp4', {
                download_fallback: 'true',
                protocol: 'hls'
            })
            .reply(200, {
                url: 'http://stream.meocloud.pt/mediacache/mp4:http://cld.pt/foobar',
                expires: 'Mon, 19 Nov 2012 05:37:12 +0000'
            });

            meocloud.media('/Movies/SAPO1.mp4', {
                download_fallback: true,
                protocol: 'hls'
            }, function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(data).to.have.ownProperty('url');
                expect(data).to.have.ownProperty('expires');
                expect(status).to.equal(200);
                done();
            });
        });
    });


    describe('Files', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.files).to.equal('function');
            done();
        });

        it('should have getFile exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.getFile).to.equal('function');
            done();
        });

        it('should have putFile exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.putFile).to.equal('function');
            done();
        });

        it('should have upload exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.upload).to.equal('function');
            done();
        });

        it('should make correct GET Files request', function(done) {
            nock('https://api-content.meocloud.pt')
            .get('/1/Files/' + config.root + '/Photos/Brinquedos.jpg?rev=abcdefghij')
            .reply(200, {});

            meocloud.files('/Photos/Brinquedos.jpg', {
                rev: 'abcdefghij'
            }, function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(status).to.equal(200);
                done();
            });
        });

        it('should make correct PUT Files request', function(done) {
            nock('https://api-content.meocloud.pt')
            .put('/1/Files/' + config.root + '/Photos/Brinquedos.jpg?overwrite=true&parent_rev=abcdefghij')
            .reply(200, {});

            meocloud.files('/Photos/Brinquedos.jpg', {
                overwrite: 'true',
                parent_rev: 'abcdefghij',
                fileStream: { pipe: function(foo) { return foo; } },
                fileSize: 1000
            }, function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(status).to.equal(200);
                done();
            });
        });

        it('should have getFile mimic correct GET Files request', function(done) {
            nock('https://api-content.meocloud.pt')
            .get('/1/Files/' + config.root + '/Photos/Brinquedos.jpg?rev=abcdefghij')
            .reply(200, {});

            meocloud.getFile('/Photos/Brinquedos.jpg', {
                rev: 'abcdefghij'
            }, function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(status).to.equal(200);
                done();
            });
        });

        it('should have putFile mimic correct PUT Files request', function(done) {
            nock('https://api-content.meocloud.pt')
            .put('/1/Files/' + config.root + '/Photos/Brinquedos.jpg?overwrite=true&parent_rev=abcdefghij')
            .reply(200, {});

            var ret = meocloud.putFile(
                '/Photos/Brinquedos.jpg',
                { pipe: function(foo) { return foo; } },
                1000,
                {
                    overwrite: 'true',
                    parent_rev: 'abcdefghij',
                },
                function(err, data, status) {
                    expect(err).to.not.be.ok;
                    expect(data).to.be.an('object');
                    expect(status).to.equal(200);
                    done();
                }
            );
            expect(ret).to.be.an('object');
        });

        it('should have upload mimic correct PUT Files request', function(done) {
            nock('https://api-content.meocloud.pt')
            .matchHeader('Content-Length', /^[1-9][0-9]*$/) // any number > 0
            .put('/1/Files/' + config.root + '/Photos/Brinquedos.jpg?overwrite=true&parent_rev=abcdefghij')
            .reply(200, {});

            meocloud.upload(
                'package.json',
                '/Photos/Brinquedos.jpg',
                {
                    overwrite: true,
                    parent_rev: 'abcdefghij'
                },
                function(err, data, status) {
                    expect(err).to.not.be.ok;
                    expect(data).to.be.an('object');
                    expect(status).to.equal(200);
                    done();
                }
            );
        });
    });

    describe('Delta', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.delta).to.equal('function');
            done();
        });

        it('should make correct delta request', function(done) {
            nock('https://api.meocloud.pt')
            .post('/1/Delta', {
                cursor: '1353289183.061f533'
            })
            .reply(200, {
                has_more: true,
                entries: []
            });

            meocloud.delta({
                cursor: '1353289183.061f533'
            }, function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(data).to.have.ownProperty('entries');
                expect(data.entries).to.be.an('array');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('LongpollDelta', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.longpollDelta).to.equal('function');
            done();
        });

        it('should make correct longpollDelta request', function(done) {
            nock('https://notifications.meocloud.pt')
            .get('/notifications/longpoll_delta?cursor=1353289183.061f533&timeout=60')
            .reply(200, {
                changes: true,
                backoff: 60
            });

            meocloud.longpollDelta({
                cursor: '1353289183.061f533',
                timeout: 60
            }, function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(data).to.have.ownProperty('changes');
                expect(data).to.have.ownProperty('backoff');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('LatestCursor', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.latestCursor).to.equal('function');
            done();
        });

        it('should make correct latestCursor request', function(done) {
            nock('https://api.meocloud.pt')
            .get('/1/LatestCursor')
            .reply(200, {
                cursor: 'foobar123456778-1234456-1234456'
            });

            meocloud.latestCursor(function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(data).to.have.ownProperty('cursor');
                expect(data.cursor).to.equal('foobar123456778-1234456-1234456');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('Zipdir', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.zipdir).to.equal('function');
            done();
        });

        it('should make correct zipdir request', function(done) {
            nock('https://api.meocloud.pt')
            .get('/1/Zipdir/' + config.root + '/helio')
            .reply(200);

            meocloud.zipdir('/helio', function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('Copy', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.copy).to.equal('function');
            done();
        });

        it('should make correct copy request', function(done) {
            nock('https://api.meocloud.pt')
            .post('/1/Fileops/Copy', {
                root: config.root,
                from_path: '/Public/test.js',
                to_path: '/Temp/test.js',
                from_copy_ref: 'z1X6ATl6aWtzOGq0c3g5Ng'
            })
            .reply(200, {
                is_dir: false,
                size: '2 KB',
                path: '/Temp/test.js'
            });

            meocloud.copy({
                root: config.root,
                from_path: '/Public/test.js',
                to_path: '/Temp/test.js',
                from_copy_ref: 'z1X6ATl6aWtzOGq0c3g5Ng'
            }, function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(data).to.have.ownProperty('is_dir');
                expect(data).to.have.ownProperty('path');
                expect(data).to.have.ownProperty('size');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('CopyRef', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.copyRef).to.equal('function');
            done();
        });

        it('should make correct copyRef request', function(done) {
            nock('https://api.meocloud.pt')
            .get('/1/CopyRef/' + config.root + '/Photos/Brinquedos.mp4')
            .reply(200, {
                copy_ref: 'z1X6ATl6aWtzOGq0c3g5Ng',
                expires: 'Fri, 31 Jan 2042 21:01:05 +0000'
            });

            meocloud.copyRef('/Photos/Brinquedos.mp4', function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(data).to.have.ownProperty('copy_ref');
                expect(data).to.have.ownProperty('expires');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('Delete', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.delete).to.equal('function');
            done();
        });

        it('should make correct delete request', function(done) {
            nock('https://api.meocloud.pt')
            .post('/1/Fileops/Delete', {
                root: config.root,
                path: '/Temp/test.js',
            })
            .reply(200, {
                is_deleted: true,
                size: '2 KB',
                path: '/Temp/test.js'
            });

            meocloud.delete({
                root: config.root,
                path: '/Temp/test.js'
            }, function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(data).to.have.ownProperty('is_deleted');
                expect(data.is_deleted).to.equal(true);
                expect(data).to.have.ownProperty('path');
                expect(data).to.have.ownProperty('size');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('Move', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.move).to.equal('function');
            done();
        });

        it('should make correct move request', function(done) {
            nock('https://api.meocloud.pt')
            .post('/1/Fileops/Move', {
                root: config.root,
                from_path: '/Temp/test.js',
                to_path: '/Testes/test.js'
            })
            .reply(200, {
                is_dir: false,
                size: '2 KB',
                path: '/Temp/test.js'
            });

            meocloud.move({
                root: config.root,
                from_path: '/Temp/test.js',
                to_path: '/Testes/test.js'
            }, function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(data).to.have.ownProperty('is_dir');
                expect(data).to.have.ownProperty('path');
                expect(data).to.have.ownProperty('size');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('CreateFolder', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.createFolder).to.equal('function');
            done();
        });

        it('should make correct createFolder request', function(done) {
            nock('https://api.meocloud.pt')
            .post('/1/Fileops/CreateFolder', {
                root: config.root,
                path: '/NewStuff'
            })
            .reply(200, {
                is_dir: true,
                size: '0 bytes',
                path: '/NewStuff'
            });

            meocloud.createFolder({
                root: config.root,
                path: '/NewStuff',
            }, function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(data).to.have.ownProperty('is_dir');
                expect(data.is_dir).to.be.ok;
                expect(data).to.have.ownProperty('path');
                expect(data).to.have.ownProperty('size');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('UndeleteTree', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.undeleteTree).to.equal('function');
            done();
        });

        it('should make correct undeleteTree request', function(done) {
            nock('https://api.meocloud.pt')
            .post('/1/UndeleteTree/' + config.root + '/NewStuff')
            .reply(200, {
                is_dir: true,
                size: '0 bytes',
                path: '/NewStuff'
            });

            meocloud.undeleteTree('/NewStuff', function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(data).to.have.ownProperty('is_dir');
                expect(data.is_dir).to.be.ok;
                expect(data).to.have.ownProperty('path');
                expect(data).to.have.ownProperty('size');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('ForgetFile', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.forgetFile).to.equal('function');
            done();
        });

        it('should make correct forgetFile request', function(done) {
            nock('https://api.meocloud.pt')
            .post('/1/Fileops/ForgetFile', {
                root: config.root,
                path: '/meocloud_TEST.md'
            })
            .reply(200, { res: 'ok' });

            meocloud.forgetFile({
                root: config.root,
                path: '/meocloud_TEST.md'
            }, function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(data).to.have.ownProperty('res');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('AccountInfo', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.accountInfo).to.equal('function');
            done();
        });

        it('should make correct accountInfo request', function(done) {
            nock('https://api.meocloud.pt')
            .get('/1/Account/Info')
            .reply(200, {
                display_name: 'Zé das Couves',
                quota_info: {},
                active: true,
                email: 'dude@sapo.pt'
            });

            meocloud.accountInfo(function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(data).to.have.ownProperty('display_name');
                expect(data).to.have.ownProperty('quota_info');
                expect(data.quota_info).to.be.an('object');
                expect(data).to.have.ownProperty('active');
                expect(data).to.have.ownProperty('email');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('ListEvents', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.listEvents).to.equal('function');
            done();
        });

        it('should make correct listEvents request', function(done) {
            nock('https://api.meocloud.pt')
            .get('/1/ListEvents')
            .reply(200, [
                {
                    event_id: 'abcdefg123',
                    count: 1,
                }
            ]);

            meocloud.listEvents(function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('array');
                expect(data[0]).to.have.ownProperty('event_id');
                expect(data[0]).to.have.ownProperty('count');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('DisableAccessToken', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.disableAccessToken).to.equal('function');
            done();
        });

        it('should make correct disableAccessToken request', function(done) {
            nock('https://api.meocloud.pt')
            .post('/1/DisableAccessToken')
            .reply(200, {});

            meocloud.disableAccessToken(function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('ChangeUserLanguage', function() {

        beforeEach(function(done) {
            meocloud = new MEOCloud(config);
            done();
        });

        it('should exist as a public method on MEOCloud', function(done) {
            expect(typeof meocloud.changeUserLanguage).to.equal('function');
            done();
        });

        it('should make correct changeUserLanguage request', function(done) {
            nock('https://api.meocloud.pt')
            .post('/1/ChangeUserLanguage')
            .reply(200, {});

            meocloud.changeUserLanguage({ lang_code: 'end' }, function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(status).to.equal(200);
                done();
            });
        });
    });

    describe('Protocol', function() {

        it('should match https when no protocol choide is made', function(done) {
            meocloud = new MEOCloud(config);

            nock('https://api.meocloud.pt').get('/1/Metadata/' + config.root + '/sslTest')
            .reply(200, { is_dir: true, root: config.root });

            meocloud.metadata('/sslTest', {}, function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(status).to.equal(200);
                done();
            });
        });

        it('should match http request when protocol choice is made', function(done) {
            config.noSSL = true;
            meocloud = new MEOCloud(config);

            nock('http://api.meocloud.pt').get('/1/Metadata/' + config.root + '/sslTest')
            .reply(200, { is_dir: true, root: config.root });

            meocloud.metadata('/sslTest', {}, function(err, data, status) {
                expect(err).to.not.be.ok;
                expect(data).to.be.an('object');
                expect(status).to.equal(200);
                done();
            });
        });

    });
});
