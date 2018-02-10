/*
 * Copyright © 2017 Onz Coin Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Onz Coin Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */

var Buffer = require('buffer/').Buffer;
var bignum = require('browserify-bignum');
var crypto = require('crypto-browserify');

var hash = require('./hash');
var convert = require('./convert');

function getPrivateAndPublicKeyFromSecret (secret) {
	var sha256Hash = hash.getSha256Hash(secret, 'utf8');
	var keypair = naclInstance.crypto_sign_seed_keypair(sha256Hash);

	return {
		privateKey: convert.bufferToHex(Buffer.from(keypair.signSk)),
		publicKey: convert.bufferToHex(Buffer.from(keypair.signPk))
	};
}

function getRawPrivateAndPublicKeyFromSecret (secret) {
	var sha256Hash = hash.getSha256Hash(secret, 'utf8');
	var keypair = naclInstance.crypto_sign_seed_keypair(sha256Hash);

	return {
		privateKey: keypair.signSk,
		publicKey: keypair.signPk
	};
}

function getAddressFromPublicKey (publicKey) {
	var publicKeyHash = crypto.createHash('sha256').update(publicKey, 'hex').digest();
	var buffer = new Buffer(new RIPEMD160().update(publicKeyHash).digest('hex'));
	var payload = new Buffer(21);
	payload.writeUInt8(81, 0);
	buffer.copy(payload, 1);
	return 'ON'+bs58check.encode(payload);
}

module.exports = {
	getKeypair: getPrivateAndPublicKeyFromSecret,
	getPrivateAndPublicKeyFromSecret: getPrivateAndPublicKeyFromSecret,
	getRawPrivateAndPublicKeyFromSecret: getRawPrivateAndPublicKeyFromSecret,
	getAddressFromPublicKey: getAddressFromPublicKey
};
