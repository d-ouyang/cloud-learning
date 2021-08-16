'use strict';
const {verifyToken} = require('wx-common')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const {action, token} = event;
	const payload = verifyToken(token);
	const db = uniCloud.database();
	let dbRes;
	if (action === 'create') {
		dbRes = await db.collection('bookshelfs').add({
			owner: payload.openid,
			name: event.name,
			address: event.address,
			geopoint:new db.Geo.Point(event.longitude, event.latitude),
			totalbooks: 0
		})
	}
	//返回数据给客户端
	return dbRes ? dbRes.data : null;
};
