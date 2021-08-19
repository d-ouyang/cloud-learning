const jwt = require('jsonwebtoken');
const appId = 'wx1284311b54d35d99';
const appSecret = 'f342da6857407f093ecb91347a161f4b';

const db = uniCloud.database()
async function getNewAccessToken() {
	const res = await uniCloud.httpclient.request(
		`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`,
		{
			dataType: 'json'
		}
	)
	const dbRes = await db.collection('system').doc('611e2d1a1b51d100015a3777').update({
		access_token: {
			value: res.data.access_token,
			expiredtime:new Date().getTime() + 7000000
		}
	})
	return res.data.access_token;
}
async function getAccessToken(forceupdate = false) {
	const dbRes = await db.collection('system').doc('611e2d1a1b51d100015a3777').get()
	const accessTokenInfo = dbRes.data[0]
	const now = new Date().getTime();
	if (accessTokenInfo.access_token && !forceupdate) {
		if (now > accessTokenInfo.access_token.expiredtime) {
			const access_token = await getNewAccessToken()
			return access_token
		} else {
			return accessTokenInfo.access_token.value
		}
	} else {
		const access_token = await getNewAccessToken()
		return access_token
	}
}
function getToken(openid) {
	return jwt.sign({openid: openid}, appSecret, {expiresIn:60*60*24});
}
function verifyToken(token){
	return jwt.verify(token, appSecret);
}
module.exports = {
	appId,
	appSecret,
	getToken,
	verifyToken,
	getAccessToken
}
