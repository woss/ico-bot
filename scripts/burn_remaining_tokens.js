/*jslint node: true */
'use strict';
const db = require('byteballcore/db');
const headlessWallet = require('headless-byteball');
const notifications = require('../modules/notifications');
const eventBus = require('byteballcore/event_bus');
const chash = require('byteballcore/chash');
const conf = require('byteballcore/conf');

const BURN_ADDRESS = chash.getChash160('0');

function burn() {
	db.query(
		"SELECT SUM(amount) AS total_free FROM my_addresses CROSS JOIN outputs USING(address) WHERE is_spent=0 AND asset = ?",
		[conf.issued_asset], 
		rows => {
			if(!rows.length || rows[0].total_free === 0) 
				return console.error('==== Nothing left');

			headlessWallet.issueChangeAddressAndSendPayment(conf.issued_asset, rows[0].total_free, BURN_ADDRESS, null, (err, unit) => {
				if (err)
					return notifications.notifyAdmin('burning failed', err);
				console.error('==== DONE');
			});
		}
	);
}

eventBus.on('headless_wallet_ready', burn);
