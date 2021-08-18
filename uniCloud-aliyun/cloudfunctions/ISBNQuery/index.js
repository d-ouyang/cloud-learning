'use strict';
const doubanbook = require('doubanbook')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	
	const { isbn } = event;
	
	const db = uniCloud.database();
	
	let dbRes = await db.collection('isbnlib').where({
		isbn: isbn
	}).get()
	if (dbRes.affectedDocs > 0) {
		console.log('自己有，直接拿 isbn')
		return dbRes.data[0]
	}
	
	console.log('库里没有就自己拿 isbn')
	
	const res = await uniCloud.httpclient.request(
		"https://search.douban.com/book/subject_search?search_text="+isbn,
		{
			dataType: 'text'
		}
	)
	console.log(res, 'isbn')
	
	let reg = /window\.__DATA__ = "(.*)"/;
	console.log(reg.test(res.data), 'reg isbn')
	if (reg.test(res.data)) {
		let bookdata = RegExp.$1;
		let data = doubanbook(bookdata)[0]
		console.log(data, '豆瓣图书资料  isbn')
		if (!data) {
			return {
				errcode: '1001',
				errMsg: '抱歉，没找到图书'
			}
		}
		let coverImage = await uniCloud.httpclient.request(data.cover_url)
		console.log(coverImage, '封面图  isbn')
		const uploadResult = await uniCloud.uploadFile({
			cloudPath: isbn + '.jpg',
			fileContent: coverImage.data
		})
		console.log(uploadResult, '封面图上传到云存储 isbn')
		let dbData = {
			isbn: isbn,
			title: data.title,
			cover_url: uploadResult.fileID,
			abstract: data.abstract
		}
		dbRes = await db.collection('isbnlib').add(dbData)
		console.log(dbRes, '新增图书的返回值 isbn')
		dbData['_id'] = dbRes.id
		return dbData
	}
};
