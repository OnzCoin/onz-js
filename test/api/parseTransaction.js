if (typeof module !== 'undefined' && module.exports) {
	var common = require('../common');
	var onz = common.onz;
}

describe('ParseOfflineRequests', function () {

	var ONZ = onz.api();

	describe('#httpGETPUTorPOST', function () {

		it('should tell if GET request', function () {
			var requestMethod1 = ONZ.parseOfflineRequests('blocks/getHeight');

			(requestMethod1.requestMethod).should.be.equal('GET');
		});

		it('should tell if POST request', function () {
			var requestMethod2 = ONZ.parseOfflineRequests('accounts/open');

			(requestMethod2.requestMethod).should.be.equal('POST');
		});

		it('should tell if PUT request', function () {
			var requestMethod3 = ONZ.parseOfflineRequests('delegates');

			(requestMethod3.requestMethod).should.be.equal('PUT');
		});
	});

	describe('#checkDoubleNamedAPI', function () {

		it('should route to getTransactions when /transactions API is called and no secret is added', function () {
			var requestMethodGetTx = ONZ.parseOfflineRequests('transactions', { senderId: '123' });

			(requestMethodGetTx.requestMethod).should.be.equal('GET');
		});
	});

	describe('#checkDoubleNamedAPI', function () {

		it('should route to getTransactions when /transactions API is called and no secret is added', function () {
			var requestMethodGetTx = ONZ.parseOfflineRequests('transactions', { senderId: '123' });

			(requestMethodGetTx.requestMethod).should.be.equal('GET');
		});
	});

	describe('#checkOfflineRequestBefore', function () {

		it('should route accounts/open requests correctly', function () {
			var checkRequestRouting = ONZ.parseOfflineRequests('accounts/open', { secret: '123' });

			(checkRequestRouting.requestMethod).should.be.equal('POST');
			(checkRequestRouting.checkOfflineRequestBefore().requestMethod).should.be.equal('GET');
			(checkRequestRouting.checkOfflineRequestBefore().requestUrl).should.be.equal('accounts?address=ONZkRUyubpNDc4g4GUza49EMjAZzRjv4vPKX');
		});

		it('should route accounts/generatePublicKey requests correctly', function () {
			var checkRequestRouting = ONZ.parseOfflineRequests('accounts/generatePublicKey', { secret: '123' });

			(checkRequestRouting.requestMethod).should.be.equal('POST');
			(checkRequestRouting.checkOfflineRequestBefore().requestMethod).should.be.equal('GET');
			(checkRequestRouting.checkOfflineRequestBefore().requestUrl).should.be.equal('accounts?address=ONZkRUyubpNDc4g4GUza49EMjAZzRjv4vPKX');
		});

		it('should route accounts/delegates requests correctly', function () {
			var checkRequestRouting = ONZ.parseOfflineRequests('accounts/delegates', { secret: '123', delegates: ['+f6a1b12331281fa9b17be2b4887b8c626571dc3340c2643d9f70dfb2173cfb6c'] });

			(checkRequestRouting.requestMethod).should.be.equal('PUT');
			(checkRequestRouting.checkOfflineRequestBefore().requestMethod).should.be.equal('POST');
			(checkRequestRouting.checkOfflineRequestBefore().requestUrl).should.be.equal('transactions');
			(checkRequestRouting.checkOfflineRequestBefore().params).should.be.ok();
		});

		it('should route transactions requests correctly', function () {
			var checkRequestRouting = ONZ.parseOfflineRequests('transactions', { secret: '123', recipientId: 'ONZkRUyubpNDc4g4GUza49EMjAZzRjv4vPKX', amount: 10000000 });

			(checkRequestRouting.requestMethod).should.be.equal('PUT');
			(checkRequestRouting.checkOfflineRequestBefore().requestMethod).should.be.equal('POST');
			(checkRequestRouting.checkOfflineRequestBefore().requestUrl).should.be.equal('transactions');
			(checkRequestRouting.checkOfflineRequestBefore().params).should.be.ok();
		});

		it('should route signatures requests correctly', function () {
			var checkRequestRouting = ONZ.parseOfflineRequests('signatures', { secret: '123', secondSecret: '1234' });

			(checkRequestRouting.requestMethod).should.be.equal('PUT');
			(checkRequestRouting.checkOfflineRequestBefore().requestMethod).should.be.equal('POST');
			(checkRequestRouting.checkOfflineRequestBefore().requestUrl).should.be.equal('transactions');
			(checkRequestRouting.checkOfflineRequestBefore().params).should.be.ok();
		});

		it('should route delegates requests correctly', function () {
			var checkRequestRouting = ONZ.parseOfflineRequests('delegates', { secret: '123', username: 'myname' });

			(checkRequestRouting.requestMethod).should.be.equal('PUT');
			(checkRequestRouting.checkOfflineRequestBefore().requestMethod).should.be.equal('POST');
			(checkRequestRouting.checkOfflineRequestBefore().requestUrl).should.be.equal('transactions');
			(checkRequestRouting.checkOfflineRequestBefore().params).should.be.ok();
		});

		it('should route multisignature requests correctly', function () {
			var checkRequestRouting = ONZ.parseOfflineRequests('multisignatures', { secret: '123', secondSeret: '123', min: 2, lifetime: 5, keysgroup: ['+123', '+234'] });

			(checkRequestRouting.requestMethod).should.be.equal('POST');
			(checkRequestRouting.checkOfflineRequestBefore().requestMethod).should.be.equal('POST');
			(checkRequestRouting.checkOfflineRequestBefore().requestUrl).should.be.equal('transactions');
			(checkRequestRouting.checkOfflineRequestBefore().params).should.be.ok();
		});

		it('should route multisignatures/sign requests correctly', function () {
			var transaction = {'type':4,'amount':0,'fee':2000000000,'senderPublicKey':'b390a3935f0bbc71a4bf601188efedd2dbf74dcd58c52e1bf420f186a7ce9601','timestamp':27805422,'asset':{'multisignature':{'min':2,'lifetime':24,'keysgroup':['+9cc69eb423abc2531394ce133a0e9111f6a1a65f68b805615db22f2f1273fe84','+9ff43f4be47c55c671b64bf39cb182066da5ac08bdf0cab1aaa5f1edd34d096a','+c18718d3bcec893e88ed15b05a046a9f490d228e886f97c6f1f52c18f6bbf501']}},'signature':'70fd23a1f1ab87b21f62a2ffce87d34d7d141c18ab7177bdc8a4cb72314cad19354e38800aebc954bcf50d5afaec5e758994956c2fb6dd274c2a1e4340d8fc05','id':'1213555903609601305','senderId':'8437095464619135969L','relays':1,'receivedAt':'2017-04-11T12:43:42.207Z'};

			var checkRequestRouting = ONZ.parseOfflineRequests('multisignatures/sign', { transaction: transaction, secret: '1234' });

			(checkRequestRouting.requestMethod).should.be.equal('POST');
			(checkRequestRouting.checkOfflineRequestBefore().requestMethod).should.be.equal('POST');
			(checkRequestRouting.checkOfflineRequestBefore().requestUrl).should.be.equal('signatures');
			(checkRequestRouting.checkOfflineRequestBefore().params).should.be.ok();
		});
	});

	describe('#transactionOutputAfter', function () {

		var ONZ = onz.api();

		it('should calculate crypto for accounts/open instead of using the API', function () {
			var transformAnswer = {
				success: 'true',
				'account': {
					'address': 'ONZkc5XVxfYfQ4oiLWcmuuXqLWWmxWUBMYQS',
					'unconfirmedBalance': '0',
					'balance': '0',
					'publicKey': 'aa73601080c9896502d999c931ff70346ca41957976cfce933f6d874a6f16137',
					'unconfirmedSignature': '0',
					'secondSignature': '0',
					'secondPublicKey': null,
					'multisignatures': null,
					'u_multisignatures': null
				}
			};

			var offlineRequest = ONZ.parseOfflineRequests('accounts/open', { secret: 'unknown' });
			var requestAnswer = offlineRequest.transactionOutputAfter({ error: 'Account not found' });

			(requestAnswer).should.be.eql(transformAnswer);
		});

		it('should calculate crypto for accounts/generatePublicKey instead of using the API', function () {
			var transformAnswer = {
				'success': 'true',
				'publicKey': 'aa73601080c9896502d999c931ff70346ca41957976cfce933f6d874a6f16137'
			};

			var offlineRequest = ONZ.parseOfflineRequests('accounts/generatePublicKey', { secret: 'unknown' });
			var requestAnswer = offlineRequest.transactionOutputAfter();

			(requestAnswer).should.be.eql(transformAnswer);
		});

		it('should route if everything is done already as for most API calls', function () {
			var reqAnswer = {
				'success': 'true',
				'account': 'account'
			};

			var offlineRequest = ONZ.parseOfflineRequests('delegates', { secret: 'unknown' });
			var requestAnswer = offlineRequest.transactionOutputAfter( { success: 'true', account: 'account' } );

			(requestAnswer).should.be.eql(reqAnswer);
		});

		it('should not allow blocked API calls - enable forging', function () {
			var reqAnswer = {
				'success': 'false',
				'error': 'Forging not available via offlineRequest'
			};

			var offlineRequest = ONZ.parseOfflineRequests('delegates/forging/enable', { secret: 'unknown' });
			var requestAnswer = offlineRequest.transactionOutputAfter();

			(requestAnswer).should.be.eql(reqAnswer);
		});

		it('should not allow blocked API calls - disable forging', function () {
			var reqAnswer = {
				'success': 'false',
				'error': 'Forging not available via offlineRequest'
			};

			var offlineRequest = ONZ.parseOfflineRequests('delegates/forging/disable', { secret: 'unknown' });
			var requestAnswer = offlineRequest.transactionOutputAfter();

			(requestAnswer).should.be.eql(reqAnswer);
		});

		it('should not allow blocked API calls - install dapp', function () {
			var reqAnswer = {
				'success': 'false',
				'error': 'Install dapp not available via offlineRequest'
			};

			var offlineRequest = ONZ.parseOfflineRequests('dapps/install', { secret: 'unknown' });
			var requestAnswer = offlineRequest.transactionOutputAfter();

			(requestAnswer).should.be.eql(reqAnswer);
		});

		it('should not allow blocked API calls - uninstall dapp', function () {
			var reqAnswer = {
				'success': 'false',
				'error': 'Uninstall dapp not available via offlineRequest'
			};

			var offlineRequest = ONZ.parseOfflineRequests('dapps/uninstall', { secret: 'unknown' });
			var requestAnswer = offlineRequest.transactionOutputAfter();

			(requestAnswer).should.be.eql(reqAnswer);
		});

		it('should not allow blocked API calls - dapps launch', function () {
			var reqAnswer = {
				'success': 'false',
				'error': 'Launch dapp not available via offlineRequest'
			};

			var offlineRequest = ONZ.parseOfflineRequests('dapps/launch', { secret: 'unknown' });
			var requestAnswer = offlineRequest.transactionOutputAfter();

			(requestAnswer).should.be.eql(reqAnswer);
		});

		it('should not allow blocked API calls - dapps stop', function () {
			var reqAnswer = {
				'success': 'false',
				'error': 'Stop dapp not available via offlineRequest'
			};

			var offlineRequest = ONZ.parseOfflineRequests('dapps/stop', { secret: 'unknown' });
			var requestAnswer = offlineRequest.transactionOutputAfter();

			(requestAnswer).should.be.eql(reqAnswer);
		});

		it('should not influence already finished calls - delegates', function () {
			var request = {
				'success': 'true',
				'call': 'etc'
			};

			var offlineRequest = ONZ.parseOfflineRequests('accounts/delegates', { secret: 'unknown' });
			var requestAnswer = offlineRequest.transactionOutputAfter(request);

			(request).should.be.eql(requestAnswer);
		});

		it('should not influence already finished calls - accounts/delegates', function () {

			var request = {
				'success': 'true',
				'call': 'etc'
			};

			var offlineRequest = ONZ.parseOfflineRequests('accounts/delegates', { secret: 'unknown' });
			var requestAnswer = offlineRequest.transactionOutputAfter(request);

			(request).should.be.eql(requestAnswer);
		});

		it('should not influence already finished calls - transactions', function () {
			var request = {
				'success': 'true',
				'call': 'etc'
			};

			var offlineRequest = ONZ.parseOfflineRequests('transactions', { secret: 'unknown' });
			var requestAnswer = offlineRequest.transactionOutputAfter(request);

			(request).should.be.eql(requestAnswer);
		});

		it('should not influence already finished calls - signatures', function () {
			var request = {
				'success': 'true',
				'call': 'etc'
			};

			var offlineRequest = ONZ.parseOfflineRequests('signatures', { secret: 'unknown' });
			var requestAnswer = offlineRequest.transactionOutputAfter(request);

			(request).should.be.eql(requestAnswer);
		});

		it('should not influence already finished calls - dapps', function () {
			var request = {
				'success': 'true',
				'call': 'etc'
			};

			var offlineRequest = ONZ.parseOfflineRequests('dapps', { secret: 'unknown' });
			var requestAnswer = offlineRequest.transactionOutputAfter(request);

			(request).should.be.eql(requestAnswer);
		});

		it('should not influence already finished calls - multisignatures', function () {
			var request = {
				'success': 'true',
				'call': 'etc'
			};

			var offlineRequest = ONZ.parseOfflineRequests('multisignatures', { secret: 'unknown' });
			var requestAnswer = offlineRequest.transactionOutputAfter(request);

			(request).should.be.eql(requestAnswer);
		});

		it('should not influence already finished calls - multisignatures/sign', function () {
			var request = {
				'success': 'true',
				'call': 'etc'
			};

			var offlineRequest = ONZ.parseOfflineRequests('multisignatures/sign', { secret: 'unknown' });
			var requestAnswer = offlineRequest.transactionOutputAfter(request);

			(request).should.be.eql(requestAnswer);
		});
	});
});
