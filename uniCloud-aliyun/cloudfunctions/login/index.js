'use strict';
const {appId, appSecret, getToken} = require('wx-common');
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const db = uniCloud.database();
	const {code} = event;
	const res = await uniCloud.httpclient.request(
		`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`,
		{
			dataType: "json"
		}
	)
	const openid = res.data.openid
	
	let dbRes = await db.collection("users").where({
		openid:openid
	}).get();
	const token = getToken(openid)
	let userData;
	if (dbRes.affectedDocs <= 0) {
		userData = {
			openid: res.data.openid,
			nickName: '铲屎官大人',
			avatarUrl: ''
		}
		await db.collection('users').add(userData)
	} else {
		userData = dbRes.data[0]
	}
	
	delete userData['openid'];
	userData['token'] = token;
	//返回数据给客户端
	return userData
};
