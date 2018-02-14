if (typeof module !== 'undefined' && module.exports) {
	var common = require('../common');
	var onz = common.onz;
}

describe('crypto.js', function () {

	var crypto = onz.crypto;

	it('should be ok', function () {
		(crypto).should.be.ok;
	});

	it('should be object', function () {
		(crypto).should.be.type('object');
	});

	it('should has properties', function () {
		var properties = ['getBytes', 'getHash', 'getId', 'getFee', 'sign', 'secondSign', 'getKeys', 'getAddress', 'verify', 'verifySecondSignature', 'fixedPoint'];
		properties.forEach(function (property) {
			(crypto).should.have.property(property);
		});
	});

	describe('#getBytes', function () {

		var getBytes = crypto.getBytes;
		var bytes = null;

		it('should be ok', function () {
			(getBytes).should.be.ok;
		});

		it('should be a function', function () {
			(getBytes).should.be.type('function');
		});

		it('should return Buffer of simply transaction and buffer most be 132 length for ONZ', function () {
			var transaction = {
				type: 0,
				amount: 10000000,
				recipientId: 'ONZkM9RAtLm8CvBQSjYbzxc7VqvsUwz1vyAk',
				timestamp: 224985,
				asset: {},
				senderPublicKey: 'eb7943c56b700b542c360c74b9bc270b528d8202ea6d877708c2c9d38514303e',
				signature: '19f7ec98eab037cc07f90d4843732e9a550e429b771920ef6f739fb4493770597f963c0ce2d37e18a4c1fd4d8d517330d51d7b2bb74fcebdd534286464623b0b',
				id: '9a9f1535a63895a3578048be9a62ef20c1990131d341d85576cd206c74ef11a1'
			};

			bytes = getBytes(transaction);
			(bytes).should.be.ok;
			(bytes).should.be.type('object');
			(bytes.length).should.be.equal(132);
		});

		it('should return Buffer of transaction with second signature and buffer most be 181 length', function () {
			var transaction = {
				type: 0,
				amount: 10000000,
				recipientId: 'ONZkM9RAtLm8CvBQSjYbzxc7VqvsUwz1vyAk',
				timestamp: 224985,
				asset: {},
				senderPublicKey: 'eb7943c56b700b542c360c74b9bc270b528d8202ea6d877708c2c9d38514303e',
				signature: '19f7ec98eab037cc07f90d4843732e9a550e429b771920ef6f739fb4493770597f963c0ce2d37e18a4c1fd4d8d517330d51d7b2bb74fcebdd534286464623b0b',
				signSignature: '19f7ec98eab037cc07f90d4843732e9a550e429b771920ef6f739fb4493770597f963c0ce2d37e18a4c1fd4d8d517330d51d7b2bb74fcebdd534286464623b0b',
				id: '9a9f1535a63895a3578048be9a62ef20c1990131d341d85576cd206c74ef11a1'
			};

			bytes = getBytes(transaction);
			(bytes).should.be.ok;
			(bytes).should.be.type('object');
			(bytes.length).should.be.equal(196);
		});
	});

	describe('#getHash', function () {

		var getHash = crypto.getHash;

		it('should be ok', function () {
			(getHash).should.be.ok;
		});

		it('should be a function', function () {
			(getHash).should.be.type('function');
		});

		it('should return Buffer and Buffer most be 32 bytes length', function () {
			var transaction = {
				type: 0,
				amount: 1000,
				recipientId: 'ONZkM9RAtLm8CvBQSjYbzxc7VqvsUwz1vyAk',
				timestamp: 141738,
				asset: {},
				senderPublicKey: 'eb7943c56b700b542c360c74b9bc270b528d8202ea6d877708c2c9d38514303e',
				signature: '19f7ec98eab037cc07f90d4843732e9a550e429b771920ef6f739fb4493770597f963c0ce2d37e18a4c1fd4d8d517330d51d7b2bb74fcebdd534286464623b0b',
				id: '9a9f1535a63895a3578048be9a62ef20c1990131d341d85576cd206c74ef11a1'
			};

			var result = getHash(transaction);
			(result).should.be.ok;
			(result).should.be.type('object');
			(result.length).should.be.equal(32);
		});
	});

	describe('#getId', function () {

		var getId = crypto.getId;

		it('should be ok', function () {
			(getId).should.be.ok;
		});

		it('should be a function', function () {
			(getId).should.be.type('function');
		});

		it('should return string id and be equal to 24af3cd399ed00aac5fae54902e61e8d4f286441ad762979d065e4512b84b977', function () {
			var transaction = {
				type: 0,
				amount: 1000,
				recipientId: 'ONZkM9RAtLm8CvBQSjYbzxc7VqvsUwz1vyAk',
				timestamp: 141738,
				asset: {},
				senderPublicKey: 'b390a3935f0bbc71a4bf601188efedd2dbf74dcd58c52e1bf420f186a7ce9601',
				signature: '19f7ec98eab037cc07f90d4843732e9a550e429b771920ef6f739fb4493770597f963c0ce2d37e18a4c1fd4d8d517330d51d7b2bb74fcebdd534286464623b0b'
			};

			var id = getId(transaction);
			(id).should.be.type('string').and.equal('24af3cd399ed00aac5fae54902e61e8d4f286441ad762979d065e4512b84b977');
		});
	});

	describe('#getFee', function () {

		var getFee = crypto.getFee;

		it('should be ok', function () {
			(getFee).should.be.ok;
		});

		it('should be a function', function () {
			(getFee).should.be.type('function');
		});

		it('should return number', function () {
			var fee = getFee({amount: 100000, type: 0});
			(fee).should.be.type('number');
			(fee).should.be.not.NaN;
		});

		it('should return 10000000', function () {
			var fee = getFee({amount: 100000, type: 0});
			(fee).should.be.type('number').and.equal(10000000);
		});

		it('should return 500000000', function () {
			var fee = getFee({type: 1});
			(fee).should.be.type('number').and.equal(500000000);
		});

		it('should be equal 20000000000', function () {
			var fee = getFee({type: 2});
			(fee).should.be.type('number').and.equal(20000000000);
		});

		it('should be equal 100000000', function () {
			var fee = getFee({type: 3});
			(fee).should.be.type('number').and.equal(100000000);
		});
	});

	describe('fixedPoint', function () {

		var fixedPoint = crypto.fixedPoint;

		it('should be ok', function () {
			(fixedPoint).should.be.ok;
		});

		it('should be number', function () {
			(fixedPoint).should.be.type('number').and.not.NaN;
		});

		it('should be equal 100000000', function () {
			(fixedPoint).should.be.equal(100000000);
		});
	});

	describe('#sign', function () {

		var sign = crypto.sign;

		it('should be ok', function () {
			(sign).should.be.ok;
		});

		it('should be a function', function () {
			(sign).should.be.type('function');
		});
	});

	describe('#secondSign', function () {

		var secondSign = crypto.secondSign;

		it('should be ok', function () {
			(secondSign).should.be.ok;
		});

		it('should be a function', function () {
			(secondSign).should.be.type('function');
		});
	});

	describe('#getKeys', function () {

		var getKeys = crypto.getKeys;

		it('should be ok', function () {
			(getKeys).should.be.ok;
		});

		it('should be a function', function () {
			(getKeys).should.be.type('function');
		});

		it('should return two keys in hex', function () {
			var keys = getKeys('secret');

			(keys).should.be.ok;
			(keys).should.be.type('object');
			(keys).should.have.property('publicKey');
			(keys).should.have.property('privateKey');
			(keys.publicKey).should.be.type('string').and.match(function () {
				try {
					new Buffer(keys.publicKey, 'hex');
				} catch (e) {
					return false;
				}

				return true;
			});
			(keys.privateKey).should.be.type('string').and.match(function () {
				try {
					new Buffer(keys.privateKey, 'hex');
				} catch (e) {
					return false;
				}

				return true;
			});
		});
	});

	describe('#getAddress', function () {

		var getAddress = crypto.getAddress;

		it('should be ok', function () {
			(getAddress).should.be.ok;
		});

		it('should be a function', function () {
			(getAddress).should.be.type('function');
		});

		it('should generate address by publicKey', function () {
			var keys = crypto.getKeys('position hunt belt avoid infant slot holiday captain inside lounge car fox');
			var address = getAddress(keys.publicKey);

			(address).should.be.ok;
			(address).should.be.type('string');
			(address).should.be.equal('ONZgRgNF3Q3GUBVinNSX4UY9ud5t8gws2XPQ');
		});
	});

	describe('#verify', function () {

		var verify = crypto.verify;

		it('should be ok', function () {
			(verify).should.be.ok;
		});

		it('should be function', function () {
			(verify).should.be.type('function');
		});
	});

	describe('#verifySecondSignature', function () {

		var verifySecondSignature = crypto.verifySecondSignature;

		it('should be ok', function () {
			(verifySecondSignature).should.be.ok;
		});

		it('should be function', function () {
			(verifySecondSignature).should.be.type('function');
		});
	});
});
