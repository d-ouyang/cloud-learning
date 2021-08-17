'use strict';
const {verifyToken} = require('wx-common')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const {action, token} = event;
	const payload = verifyToken(token);
	const db = uniCloud.database();
	const dbCmd = db.command;
	let dbRes;
	if (action === 'create') {
		dbRes = await db.collection('bookshelfs').add({
			owner: payload.openid,
			name: event.name,
			address: event.address,
			geopoint:new db.Geo.Point(event.longitude, event.latitude),
			totalbooks: 0
		})
	} else if (action === 'read') {
		dbRes = await db.collection('bookshelfs').where({
			owner: dbCmd.eq(payload.openid)
		})
		.field({'owner': false })
		.orderBy("_id","desc")
		.limit(10)
		.get()
	} else if (action === 'delete') {
		dbRes = await db.collection('bookshelfs').where({
			_id: dbCmd.eq(event._id)
		}).remove()
	}
	//返回数据给客户端
	return dbRes ? dbRes.data : null;
};
