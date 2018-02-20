if (typeof module !== 'undefined' && module.exports) {
	var common = require('../common');
	var onz = common.onz;
	var sinon = common.sinon;
	process.env.NODE_ENV = 'test';
}

describe('Onz.api()', function () {

	var ONZ = onz.api();

	describe('onz.api()', function () {

		it('should create a new instance when using onz.api()', function () {
			(ONZ).should.be.ok();
		});

		it('new onz.api() should be Object', function () {
			(ONZ).should.be.type('object');
		});

		it('should use testnet peer for testnet settings', function () {
			var TESTONZ = onz.api({ testnet: true });

			(TESTONZ.port).should.be.equal(10998);
			(TESTONZ.testnet).should.be.equal(true);
		});

	});

	describe('#listPeers', function () {
		it('should give a set of the peers', function () {
			(ONZ.listPeers()).should.be.ok;
			(ONZ.listPeers()).should.be.type.Object;
			(ONZ.listPeers().official.length).should.be.equal(8);
			(ONZ.listPeers().testnet.length).should.be.equal(2);
		});
	});

	describe('.currentPeer', function () {

		it('currentPeer should be set by default', function () {
			(ONZ.currentPeer).should.be.ok;
		});
	});

	describe('#getNethash', function () {

		it('Nethash should be hardcoded variables', function () {
			var NetHash = {
				'Content-Type': 'application/json',
				'nethash': 'ef56692f7973f7a8e82d6bd5bc68d5f514e4c3ed97d4cfca0345fddd0f421999',
				'broadhash': 'ef56692f7973f7a8e82d6bd5bc68d5f514e4c3ed97d4cfca0345fddd0f421999',
				'os': 'onz-js-api',
				'version': '1.0.0',
				'minVersion': '>=0.5.3',
				'port': 11000
			};
			(ONZ.getNethash()).should.eql(NetHash);
		});

		it('should give corret Nethash for testnet', function () {
			ONZ.setTestnet(true);

			var NetHash = {
				'Content-Type': 'application/json',
				'nethash': 'aa14b4d84260e00b6fc033c022a25965629ab0e8a4aafc77e64cad4cf0dc2e00',
				'broadhash': 'aa14b4d84260e00b6fc033c022a25965629ab0e8a4aafc77e64cad4cf0dc2e00',
				'os': 'onz-js-api',
				'version': '1.0.0',
				'minVersion': '>=0.5.3',
				'port': 10998
			};

			(ONZ.getNethash()).should.eql(NetHash);
		});


		it('should be possible to use my own Nethash', function () {
			var NetHash = {
				'Content-Type': 'application/json',
				'nethash': '123',
				'broadhash': 'ef56692f7973f7a8e82d6bd5bc68d5f514e4c3ed97d4cfca0345fddd0f421999',
				'os': 'onz-js-api',
				'version': '0.0.0a',
				'minVersion': '>=0.5.3',
				'port': 11000
			};
			var ONZNethash = onz.api({ nethash: '123' });

			(ONZNethash.nethash).should.eql(NetHash);
		});
	});

	describe('#setTestnet', function () {

		it('should set to testnet', function () {
			var ONZ = onz.api();
			ONZ.setTestnet(true);

			(ONZ.testnet).should.be.true;
		});

		it('should set to mainnet', function () {
			var ONZ = onz.api();
			ONZ.setTestnet(false);

			(ONZ.testnet).should.be.false;
		});
	});

	describe('#setNode', function () {

		it('should be able to set my own node', function () {
			var myOwnNode = 'myOwnNode.com';
			ONZ.setNode(myOwnNode);

			(ONZ.currentPeer).should.be.equal(myOwnNode);
		});

		it('should select a node when not explicitly set', function () {
			ONZ.setNode();

			(ONZ.currentPeer).should.be.ok();
		});
	});

	describe('#selectNode', function () {

		it('should return the node from initial settings when set', function () {
			var OnzUrlInit = onz.api({ port: 10998, node: 'localhost', ssl: true, randomPeer: false });

			(OnzUrlInit.selectNode()).should.be.equal('localhost');
		});
	});

	describe('#getRandomPeer', function () {

		it('should give a random peer', function () {
			(ONZ.getRandomPeer()).should.be.ok();
		});
	});

	describe('#banNode', function () {

		it('should add current node to ONZ.bannedPeers', function () {
			var currentNode = ONZ.currentPeer;
			ONZ.banNode();

			(ONZ.bannedPeers).should.containEql(currentNode);
		});
	});

	describe('#getFullUrl', function () {

		it('should give the full url inclusive port', function () {
			var OnzUrlInit = onz.api({ port: 10998, node: 'localhost', ssl: false });
			var fullUrl = 'http://localhost:10998';

			(OnzUrlInit.getFullUrl()).should.be.equal(fullUrl);
		});

		it('should give the full url without port and with SSL', function () {
			var OnzUrlInit = onz.api({ port: '', node: 'localhost', ssl: true });
			var fullUrl = 'https://localhost';

			(OnzUrlInit.getFullUrl()).should.be.equal(fullUrl);
		});
	});

	describe('#getURLPrefix', function () {

		it('should be http when ssl is false', function () {
			ONZ.setSSL(false);

			(ONZ.getURLPrefix()).should.be.equal('http');
		});

		it('should be https when ssl is true', function () {
			ONZ.setSSL(true);

			(ONZ.getURLPrefix()).should.be.equal('https');
		});
	});

	describe('#trimObj', function () {

		var untrimmedObj = {
			' my_Obj ': ' myval '
		};

		var trimmedObj = {
			'my_Obj': 'myval'
		};

		it('should not be equal before trim', function () {
			(untrimmedObj).should.not.be.equal(trimmedObj);
		});

		it('should be equal after trim an Object in keys and value', function () {
			var trimIt = ONZ.trimObj(untrimmedObj);

			(trimIt).should.be.eql(trimmedObj);
		});

		it('should accept numbers and strings as value', function () {
			var obj = {
				'myObj': 2
			};

			var trimmedObj = ONZ.trimObj(obj);
			(trimmedObj).should.be.ok;
			(trimmedObj).should.be.eql({ myObj: '2' });
		});
	});

	describe('#toQueryString', function () {

		it('should create a http string from an object. Like { obj: "myval", key: "myval" } -> obj=myval&key=myval', function () {
			var myObj = {
				obj: 'myval',
				key: 'my2ndval'
			};

			var serialised = ONZ.toQueryString(myObj);

			(serialised).should.be.equal('obj=myval&key=my2ndval');
		});
	});

	describe('#serialiseHttpData', function () {

		it('should create a http string from an object and trim.', function () {
			var myObj = {
				obj: ' myval',
				key: 'my2ndval '
			};

			var serialised = ONZ.serialiseHttpData(myObj);

			(serialised).should.be.equal('?obj=myval&key=my2ndval');
		});
	});

	describe('#getAddressFromSecret', function () {

		it('should create correct address and publicKey', function () {
			var address = {
				publicKey: '7a50ef8c2d77365a984f9637dad0d054e178346c768bf2e2443ab537d42c8e9a',
				address: 'ONZkWjUMHnHCoAhw2aZ3XagpnyCYWPEkxPJK'
			};

			(ONZ.getAddressFromSecret('testnet')).should.eql(address);
		});
	});

	describe('#checkRequest', function () {

		it('should identify GET requests', function () {
			var requestType = 'api/loader/status';
			var options = '';
			var checkRequestAnswer = ONZ.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('GET');

			var requestType = 'api/loader/status/sync';
			var options = '';
			var checkRequestAnswer = ONZ.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('GET');

			var requestType = 'api/loader/status/ping';
			var options = '';
			var checkRequestAnswer = ONZ.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('GET');

			var requestType = 'api/transactions';
			var options = {blockId: '123', senderId: '123'};
			var checkRequestAnswer = ONZ.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('GET');
		});

		it('should identify POST requests', function () {
			var requestType = 'accounts/generatePublicKey';
			var options = {secret: '123'};
			var checkRequestAnswer = ONZ.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('POST');

			var requestType = 'accounts/open';
			var options = {secret: '123'};
			var checkRequestAnswer = ONZ.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('POST');

			var requestType = 'multisignatures/sign';
			var options = {secret: '123'};
			var checkRequestAnswer = ONZ.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('POST');
		});

		it('should identify PUT requests', function () {
			var requestType = 'accounts/delegates';
			var options = {secret: '123'};
			var checkRequestAnswer = ONZ.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('PUT');

			var requestType = 'signatures';
			var options = {secret: '123'};
			var checkRequestAnswer = ONZ.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('PUT');

			var requestType = 'transactions';
			var options = {secret: '123'};
			var checkRequestAnswer = ONZ.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('PUT');
		});

		it('should identify NOACTION requests', function () {
			var requestType = 'delegates/forging/enable';
			var options = {secret: '123'};
			var checkRequestAnswer = ONZ.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('NOACTION');

			var requestType = 'dapps/uninstall';
			var options = {secret: '123'};
			var checkRequestAnswer = ONZ.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('NOACTION');
		});
	});

	describe('#checkOptions', function () {

		it('should not accept falsy options like undefined', function (done) {
			try {
				onz.api().sendRequest('delegates/', {limit:undefined}, function () {});
			} catch (e) {
				(e.message).should.be.equal('parameter value "limit" should not be undefined');
				done();
			}
		});

		it('should not accept falsy options like NaN', function (done) {
			try {
				onz.api().sendRequest('delegates/', {limit:NaN}, function () {});
			} catch (e) {
				(e.message).should.be.equal('parameter value "limit" should not be NaN');
				done();
			}
		});

	});

	describe('#changeRequest', function () {

		it('should give the correct parameters for GET requests', function () {
			var requestType = 'transactions';
			var options = {blockId: '123', senderId: '123'};
			var checkRequestAnswer = onz.api({ node: 'localhost' }).changeRequest(requestType, options);

			var output = {
				nethash: '',
				requestMethod: 'GET',
				requestParams: {
					blockId: '123',
					senderId: '123'
				},
				requestUrl: 'http://localhost:11000/api/transactions?blockId=123&senderId=123'
			};

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.eql(output);
		});

		it('should give the correct parameters for GET requests with parameters', function () {
			var requestType = 'delegates/search/';
			var options = {q: 'oliver'};
			var checkRequestAnswer = onz.api({ node: 'localhost' }).changeRequest(requestType, options);

			var output = {
				nethash: '',
				requestMethod: 'GET',
				requestParams: {
					q: 'oliver',
				},
				requestUrl: 'http://localhost:11000/api/delegates/search/?q=oliver'
			};

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.eql(output);
		});

		it('should give the correct parameters for NOACTION requests', function () {
			var requestType = 'delegates/forging/enable';
			var options = {secret: '123'};
			var checkRequestAnswer = onz.api({ node: 'localhost' }).changeRequest(requestType, options);

			var output = {
				nethash: '',
				requestMethod: '',
				requestParams: '',
				requestUrl: ''
			};

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.eql(output);
		});

		it('should give the correct parameters for POST requests', function () {
			var requestType = 'accounts/open';
			var options = {secret: '123'};
			var checkRequestAnswer = onz.api({ node: 'localhost' }).changeRequest(requestType, options);

			var output = {
				nethash: '',
				requestMethod: 'GET',
				requestParams: {secret: '123'},
				requestUrl: 'http://localhost:11000/api/accounts?address=ONZkRUyubpNDc4g4GUza49EMjAZzRjv4vPKX'
			};

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.eql(output);
		});

		it('should give the correct parameters for PUT requests', function () {
			var requestType = 'signatures';
			var options = {secret: '123', secondSecret: '1234'};
			var checkRequestAnswer = onz.api({ node: 'localhost' }).changeRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer.requestParams.transaction).should.have.property('id').which.is.a.String();
			(checkRequestAnswer.requestParams.transaction).should.have.property('amount').which.is.a.Number();
			(checkRequestAnswer.requestParams).should.have.property('transaction').which.is.a.Object();
		});
	});

	describe('#sendRequest', function () {

		it('should receive Height from a random public peer', function () {
			var expectedResponse = {
				body: { success: true, height: 2850466 },
			};
			var stub = sinon.stub(ONZ, 'sendRequestPromise').resolves(expectedResponse);
			return ONZ.sendRequest('blocks/getHeight', function (data) {
				(data).should.be.ok();
				(data).should.be.type('object');
				(data.success).should.be.true();
				stub.restore();
			});
		});

	});

	describe('#listActiveDelegates', function () {
		var expectedResponse = {
			body: {
				success: true,
				delegates: [{
					username: 'thepool',
					address: '10839494368003872009L',
					publicKey: 'b002f58531c074c7190714523eec08c48db8c7cfc0c943097db1a2e82ed87f84',
					vote: '2315391211431974',
					producedblocks: 13340,
					missedblocks: 373,
					rate: 1,
					rank: 1,
					approval: 21.64,
					productivity: 97.28,
				}],
			},
		};

		it('should list active delegates', function () {
			var callback = sinon.spy();
			var options = { limit: '1' };
			sinon.stub(ONZ, 'sendRequest').callsArgWith(2, expectedResponse);

			ONZ.listActiveDelegates('1', callback);

			(ONZ.sendRequest.calledWith('delegates/', options)).should.be.true();
			(callback.called).should.be.true();
			(callback.calledWith(expectedResponse)).should.be.true();
			ONZ.sendRequest.restore();
		});
	});

	describe('#listStandbyDelegates', function () {
		var expectedResponse = {
			body: {
				success: true,
				delegates: [{
					username: 'bangomatic',
					address: '15360265865206254368L',
					publicKey: 'f54ce2a222ab3513c49e586464d89a2a7d9959ecce60729289ec0bb6106bd4ce',
					vote: '1036631485530636',
					producedblocks: 12218,
					missedblocks: 139,
					rate: 102,
					rank: 102,
					approval: 9.69,
					productivity: 0,
				}],
			},
		};

		it('should list standby delegates', function () {
			var callback = sinon.spy();
			var options =  { limit: '1', orderBy: 'rate:asc', offset: 101 };
			sinon.stub(ONZ, 'sendRequest').callsArgWith(2, expectedResponse);

			ONZ.listStandbyDelegates('1', callback);

			(ONZ.sendRequest.calledWith('delegates/', options)).should.be.true();
			(callback.called).should.be.true();
			(callback.calledWith(expectedResponse)).should.be.true();
			ONZ.sendRequest.restore();
		});
	});

	describe('#searchDelegateByUsername', function () {
		var expectedResponse = {
			body: {
				success: true,
				delegates: [{
					username: 'oliver',
					address: '10872755118372042973L',
					publicKey: 'ac2e6931e5df386f3b8d278f9c14b6396ea6f2d8c6aab6e3bc9b857b3e136877',
					vote: '22499233987816',
					producedblocks: 0,
					missedblocks: 0,
				}],
			},
		};

		it('should find a delegate by name', function () {
			var callback = sinon.spy();
			var options = { q: 'oliver' };
			sinon.stub(ONZ, 'sendRequest').callsArgWith(2, expectedResponse);

			ONZ.searchDelegateByUsername('oliver', callback);

			(ONZ.sendRequest.calledWith('delegates/search/', options)).should.be.true();
			(callback.called).should.be.true();
			(callback.calledWith(expectedResponse)).should.be.true();
			ONZ.sendRequest.restore();
		});
	});

	describe('#listBlocks', function () {
		var expectedResponse = {
			body: {
				success: true,
				blocks: [{
					id: '7650813318077105965',
					version: 0,
					timestamp: 30745470,
					height: 2852547,
					previousBlock: '15871436233132203555',
					numberOfTransactions: 0,
					totalAmount: 0,
					totalFee: 0,
					reward: 500000000,
					payloadLength: 0,
					payloadHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
					generatorPublicKey: 'b3953cb16e2457b9be78ad8c8a2985435dedaed5f0dd63443bdfbccc92d09f2d',
					generatorId: '6356913781456505636L',
					blockSignature: '2156b5b20bd338fd1d575ddd8550fd5675e80eec70086c31e60e797e30efdeede8075f7ac35db3f0c45fed787d1ffd7368a28a2642ace7ae529eb538a0a90705',
					confirmations: 1,
					totalForged: '500000000',
				}],
			},
		};

		it('should list amount of blocks defined', function () {
			var callback = sinon.spy();
			var options = { limit: '1'};
			sinon.stub(ONZ, 'sendRequest').callsArgWith(2, expectedResponse);

			ONZ.listBlocks('1', callback);

			(ONZ.sendRequest.calledWith('blocks', options)).should.be.true();
			(callback.called).should.be.true();
			(callback.calledWith(expectedResponse)).should.be.true();
			ONZ.sendRequest.restore();
		});
	});

	describe('#listForgedBlocks', function () {
		var expectedResponse = {
			body: {
				success: true
			}
		};

		it('should list amount of ForgedBlocks', function () {
			var callback = sinon.spy();
			var key = '130649e3d8d34eb59197c00bcf6f199bc4ec06ba0968f1d473b010384569e7f0';
			var options = { generatorPublicKey: key};
			sinon.stub(ONZ, 'sendRequest').callsArgWith(2, expectedResponse);

			ONZ.listForgedBlocks(key, callback);

			(ONZ.sendRequest.calledWith('blocks', options)).should.be.true();
			(callback.called).should.be.true();
			(callback.calledWith(expectedResponse)).should.be.true();
			ONZ.sendRequest.restore();
		});
	});

	describe('#getBlock', function () {
		var expectedResponse = {
			body: {
				success: true,
				blocks: [{
					id: '5834892157785484325',
					version: 0,
					timestamp: 25656190,
					height: 2346638,
					previousBlock: '10341689082372310738',
					numberOfTransactions: 0,
					totalAmount: 0,
					totalFee: 0,
					reward: 500000000,
					payloadLength: 0,
					payloadHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
					generatorPublicKey: '2cb967f6c73d9b6b8604d7b199271fed3183ff18ae0bd9cde6d6ef6072f83c05',
					generatorId: 'ONZkRUyubpNDc4g4GUza49EMjAZzRjv4vPKX',
					blockSignature: '0c0554e28adeeed7f1071cc5cba76b77340e0f406757e7a9e7ab80b1711856089ec743dd4954c2db10ca6e5e2dab79d48d15f7b5a08e59c29d622a1a20e1fd0d',
					confirmations: 506049,
					totalForged: '500000000',
				}],
				count: 1,
			},
		};

		it('should get a block of certain height', function () {
			var callback = sinon.spy();
			var blockId = '2346638';
			var options = { height: blockId};
			sinon.stub(ONZ, 'sendRequest').callsArgWith(2, expectedResponse);

			ONZ.getBlock(blockId, callback);

			(ONZ.sendRequest.calledWith('blocks', options)).should.be.true();
			(callback.called).should.be.true();
			(callback.calledWith(expectedResponse)).should.be.true();
			ONZ.sendRequest.restore();
		});
	});

	describe('#listTransactions', function () {
		var expectedResponse = {
			body: {
				success: true,
				transactions: [{
					id: '16951900355716521650',
					height: 2845738,
					blockId: '10920144534340154099',
					type: 0,
					timestamp: 30676572,
					senderPublicKey: '2cb967f6c73d9b6b8604d7b199271fed3183ff18ae0bd9cde6d6ef6072f83c05',
					senderId: 'ONZkRUyubpNDc4g4GUza49EMjAZzRjv4vPKX',
					recipientId: '13389153080173401705Z',
					recipientPublicKey: 'a81d59b68ba8942d60c74d10bc6488adec2ae1fa9b564a22447289076fe7b1e4',
					amount: 146537207,
					fee: 10000000,
					signature: 'b5b6aa065db4c47d2fa5b0d8568138460640216732e3926fdd7eff79f3f183e93ffe38f0e33a1b70c97d4dc9efbe61da55e94ab24ca34e134e71e94fa1b6f108',
					signatures: [],
					confirmations: 7406,
					asset: {},
				}],
				count: '120',
			},
		};


		it('should list transactions of a defined account', function () {
			var callback = sinon.spy();
			var address = 'ONZkRUyubpNDc4g4GUza49EMjAZzRjv4vPKX';
			var options = {
				senderId: address,
				recipientId: address,
				limit: '1',
				offset: '2',
				orderBy: 'timestamp:desc'
			};
			sinon.stub(ONZ, 'sendRequest').callsArgWith(2, expectedResponse);

			ONZ.listTransactions(address, '1', '2', callback);

			(ONZ.sendRequest.calledWith('transactions', options)).should.be.true();
			(callback.called).should.be.true();
			(callback.calledWith(expectedResponse)).should.be.true();
			ONZ.sendRequest.restore();
		});
	});

	describe('#getTransaction', function () {
		var expectedResponse = {
			body: {
				success: true,
				transaction: {
					id: '7520138931049441691',
					height: 2346486,
					blockId: '11556561638256817055',
					type: 0,
					timestamp: 25654653,
					senderPublicKey: '632763673e5b3a0b704cd723d8c5bdf0be47e08210fe56a0c530f27ced6c228e',
					senderId: '1891806528760779417L',
					recipientId: '1813095620424213569L',
					recipientPublicKey: 'e01b6b8a9b808ec3f67a638a2d3fa0fe1a9439b91dbdde92e2839c3327bd4589',
					amount: 56340416586,
					fee: 10000000,
					signature: 'd04dc857e718af56ae3cff738ba22dce7da0118565675527ddf61d154cfea70afd11db1e51d6d9cce87e0780685396daab6f47cae74c22fa20638c9b71883d07',
					signatures: [],
					confirmations: 506685,
					asset: {},
				},
			},
		};

		it('should list a defined transaction', function () {
			var callback = sinon.spy();
			var transactionId= '7520138931049441691';
			var options = {
				id: transactionId
			};
			sinon.stub(ONZ, 'sendRequest').callsArgWith(2, expectedResponse);

			ONZ.getTransaction(transactionId, callback);

			(ONZ.sendRequest.calledWith('transactions/get', options)).should.be.true();
			(callback.called).should.be.true();
			(callback.calledWith(expectedResponse)).should.be.true();
			ONZ.sendRequest.restore();
		});
	});

	describe('#listVotes', function () {
		var expectedResponse = {
			body: {
				success: true,
				delegates: [{
					username: 'thepool',
					address: '10839494368003872009L',
					publicKey: 'b002f58531c074c7190714523eec08c48db8c7cfc0c943097db1a2e82ed87f84',
					vote: '2317408239538758',
					producedblocks: 13357,
					missedblocks: 373,
					rate: 1,
					rank: 1,
					approval: 21.66,
					productivity: 97.28,
				}],
			},
		};

		it('should list votes of an account', function () {
			var callback = sinon.spy();
			var address= '16010222169256538112L';
			var options = {
				address: address
			};
			sinon.stub(ONZ, 'sendRequest').callsArgWith(2, expectedResponse);

			ONZ.listVotes(address, callback);

			(ONZ.sendRequest.calledWith('accounts/delegates', options)).should.be.true();
			(callback.called).should.be.true();
			(callback.calledWith(expectedResponse)).should.be.true();
			ONZ.sendRequest.restore();
		});
	});

	describe('#listVoters', function () {
		var expectedResponse = {
			body: {
				success: true,
				accounts: [{
					username: null,
					address: '7288548278191946381L',
					publicKey: '8c325dc9cabb3a81e40d7291a023a1574629600931fa21cc4fcd87b2d923214f',
					balance: '0',
				}],
			},
		};

		it('should list voters of an account', function () {
			var callback = sinon.spy();
			var publicKey= '6a01c4b86f4519ec9fa5c3288ae20e2e7a58822ebe891fb81e839588b95b242a';
			var options = {
				publicKey: publicKey
			};
			sinon.stub(ONZ, 'sendRequest').callsArgWith(2, expectedResponse);

			ONZ.listVoters(publicKey, callback);

			(ONZ.sendRequest.calledWith('delegates/voters', options)).should.be.true();
			(callback.called).should.be.true();
			(callback.calledWith(expectedResponse)).should.be.true();
			ONZ.sendRequest.restore();
		});
	});

	describe('#getAccount', function () {
		var expectedResponse = {
			body: {
				success: true,
				account: {
					address: '13389153080173401705Z',
					unconfirmedBalance: '7139704369275',
					balance: '7139704369275',
					publicKey: 'a81d59b68ba8942d60c74d10bc6488adec2ae1fa9b564a22447289076fe7b1e4',
					unconfirmedSignature: 1,
					secondSignature: 1,
					secondPublicKey: 'b823d706cec22383f9f10bb5095a66ed909d9224da0707168dad9d1c9cdef29c',
					multisignatures: [],
					'u_multisignatures': [],
				},
			},
		};

		it('should get account information', function () {
			var callback = sinon.spy();
			var address= '13389153080173401705Z';
			var options = {
				address: address
			};
			sinon.stub(ONZ, 'sendRequest').callsArgWith(2, expectedResponse);

			ONZ.getAccount(address, callback);

			(ONZ.sendRequest.calledWith('accounts', options)).should.be.true();
			(callback.called).should.be.true();
			(callback.calledWith(expectedResponse)).should.be.true();
			ONZ.sendRequest.restore();
		});
	});

	describe('#sendONZ', function () {
		var expectedResponse = {
			body: { success: true, transactionId: '8921031602435581844' }
		};
		it('should send testnet ONZ', function () {
			var options = {
				ssl: false,
				node: '',
				randomPeer: true,
				testnet: true,
				port: '10998',
				bannedPeers: []
			};
			var callback = sinon.spy();
			var ONZnode = onz.api(options);
			var secret = 'soap arm custom rhythm october dove chunk force own dial two odor';
			var secondSecret = 'spider must salmon someone toe chase aware denial same chief else human';
			var recipient = '10279923186189318946L';
			var amount = 100000000;
			sinon.stub(ONZnode, 'sendRequest').callsArgWith(2, expectedResponse);

			ONZnode.sendONZ(recipient, amount, secret, secondSecret, callback);

			(ONZnode.sendRequest.calledWith('transactions', {
				recipientId: recipient,
				amount: amount,
				secret: secret,
				secondSecret: secondSecret
			})).should.be.true();

			(callback.called).should.be.true();
			(callback.calledWith(expectedResponse)).should.be.true();
			ONZnode.sendRequest.restore();
		});
	});

	describe('#checkReDial', function () {

		it('should check if all the peers are already banned', function () {
			(onz.api().checkReDial()).should.be.equal(true);
		});

		it('should be able to get a new node when current one is not reachable', function (done) {
			onz.api({ node: '123', randomPeer: true }).sendRequest('blocks/getHeight', {}, function (result) {
				(result).should.be.type('object');
				done();
			});
		});

		it('should recognize that now all the peers are banned for mainnet', function () {
			var thisONZ = onz.api();
			thisONZ.bannedPeers = onz.api().defaultPeers;

			(thisONZ.checkReDial()).should.be.equal(false);
		});

		it('should recognize that now all the peers are banned for testnet', function () {
			var thisONZ = onz.api({ testnet: true });
			thisONZ.bannedPeers = onz.api().defaultTestnetPeers;

			(thisONZ.checkReDial()).should.be.equal(false);
		});

		it('should recognize that now all the peers are banned for ssl', function () {
			var thisONZ = onz.api({ssl: true});
			thisONZ.bannedPeers = onz.api().defaultSSLPeers;

			(thisONZ.checkReDial()).should.be.equal(false);
		});

		it('should stop redial when all the peers are banned already', function (done) {
			var thisONZ = onz.api();
			thisONZ.bannedPeers = onz.api().defaultPeers;
			thisONZ.currentPeer = '';

			thisONZ.sendRequest('blocks/getHeight').then(function (e) {
				(e.message).should.be.equal('could not create http request to any of the given peers');
				done();
			});
		});

		it('should redial to new node when randomPeer is set true', function () {
			var thisONZ = onz.api({ randomPeer: true, node: '123' });

			(thisONZ.checkReDial()).should.be.equal(true);
			(thisONZ.testnet).should.be.equal(false);
		});

		it('should not redial to new node when randomPeer is set to true but unknown nethash provided', function () {
			var thisONZ = onz.api({ randomPeer: true, node: '123', nethash: '123' });

			(thisONZ.checkReDial()).should.be.equal(false);
		});

		it('should redial to mainnet nodes when nethash is set and randomPeer is true', function () {
			var thisONZ = onz.api({ randomPeer: true, node: '123', nethash: 'ef56692f7973f7a8e82d6bd5bc68d5f514e4c3ed97d4cfca0345fddd0f421999' });

			(thisONZ.checkReDial()).should.be.equal(true);
			(thisONZ.testnet).should.be.equal(false);
		});

		it('should redial to testnet nodes when nethash is set and randomPeer is true', function () {
			var thisONZ = onz.api({ randomPeer: true, node: '123', nethash: 'aa14b4d84260e00b6fc033c022a25965629ab0e8a4aafc77e64cad4cf0dc2e00' });

			(thisONZ.checkReDial()).should.be.equal(true);
			(thisONZ.testnet).should.be.equal(true);
		});

		it('should not redial when randomPeer is set false', function () {
			var thisONZ = onz.api({ randomPeer: false});

			(thisONZ.checkReDial()).should.be.equal(false);
		});
	});

	describe('#sendRequest with promise', function () {

		it('should be able to use sendRequest as a promise for GET', function (done) {
			onz.api().sendRequest('blocks/getHeight', {}).then(function (result) {
				(result).should.be.type('object');
				(result.success).should.be.equal(true);
				(result.height).should.be.type('number');
				done();
			});
		});

		it('should route the request accordingly when request method is POST but GET can be used', function (done) {
			onz.api().sendRequest('accounts/open', { secret: '123' }).then(function (result) {
				(result).should.be.type('object');
				(result.account).should.be.ok;
				done();
			});
		});

		it('should respond with error when API call is disabled', function (done) {
			onz.api().sendRequest('delegates/forging/enable', { secret: '123' }).then(function (result) {
				(result.error).should.be.equal('Forging not available via offlineRequest');
				done();
			});
		});

		it('should be able to use sendRequest as a promise for POST', function (done) {
			var options = {
				ssl: false,
				node: '',
				randomPeer: true,
				testnet: true,
				port: '10998',
				bannedPeers: []
			};

			var ONZnode = onz.api(options);
			var secret = 'fiscal pretty rice hero away farm uncover melt waste skill myself empower';
			var secondSecret = 'elephant fun snap priority sentence minute bless parade gown child marine helmet';
			var recipient = 'ONZgKZmD713cLPfZK9YCTi9RRCxN7mygo7Eo';
			var amount = 100000000;

			ONZnode.sendRequest('transactions', { recipientId: recipient, secret: secret, secondSecret: secondSecret, amount: amount }).then(function (result) {
				(result).should.be.type('object');
				(result).should.be.ok;
				done();
			});
		});

		it('should retry timestamp in future failures', function () {
			var thisONZ = onz.api();
			var successResponse = { body: { success: true } };
			var futureTimestampResponse = {
				body: { success: false, message: 'Invalid transaction timestamp. Timestamp is in the future' }
			};
			var stub = sinon.stub(thisONZ, 'sendRequestPromise');
			var spy = sinon.spy(thisONZ, 'sendRequest');
			stub.resolves(futureTimestampResponse);
			stub.onThirdCall().resolves(successResponse);

			return thisONZ.sendRequest('transactions')
				.then(function () {
					(spy.callCount).should.equal(3);
					(spy.args[1][1]).should.have.property('timeOffset').equal(10e3);
					(spy.args[2][1]).should.have.property('timeOffset').equal(20e3);
					stub.restore();
					spy.restore();
				});
		});

		it('should not retry timestamp in future failures forever', function () {
			var thisONZ = onz.api();
			var futureTimestampResponse = {
				body: { success: false, message: 'Invalid transaction timestamp. Timestamp is in the future' }
			};
			var stub = sinon.stub(thisONZ, 'sendRequestPromise');
			var spy = sinon.spy(thisONZ, 'sendRequest');
			stub.resolves(futureTimestampResponse);

			return thisONZ.sendRequest('transactions')
				.then(function (response) {
					(response).should.equal(futureTimestampResponse.body);
					stub.restore();
					spy.restore();
				});
		});

	});

	describe('#listMultisignatureTransactions', function () {

		it('should list all current not signed multisignature transactions', function (done) {
			onz.api().listMultisignatureTransactions(function (result) {
				(result).should.be.ok;
				(result).should.be.type('object');
				done();
			});
		});
	});

	describe('#getMultisignatureTransaction', function () {

		it('should get a multisignature transaction by id', function (done) {
			onz.api().getMultisignatureTransaction('123', function (result) {
				(result).should.be.ok;
				(result).should.be.type('object');
				done();
			});
		});
	});
});
