'use strict';
const {verifyToken} = require('wx-common')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const {action, shelfid, isbnid, token} = event;
	const db = uniCloud.database()
	const dbCmd = db.command;
	const payload = verifyToken(token)
	
	const now = new Date().getTime()
	
	if (action === 'create') {
		const bookInfo = await db.collection('isbnlib').doc(isbnid).get().then(res => {
			return res.data[0]
		})
		const dbRes = await db.collection('books').add({
			owner: payload.openid,
			shelfid: shelfid,
			isbn: bookInfo.isbn,
			title: bookInfo.title,
			cover_url: bookInfo.cover_url,
			isbnid: isbnid,
			createtime: now,
			updatetime: now
		})
		
		await db.collection('bookshelfs').where({
			owner: payload.openid,
			_id: shelfid
		}).update({
			totalbooks: dbCmd.inc(1)
		})
		return dbRes
	} else if (action === 'listbyshelf') {
		const dbRes = await db.collection('books').field({'owner': false}).where({
			shelfid: dbCmd.eq(shelfid)
		})
		.get()
		return dbRes.data || []
	}
};
