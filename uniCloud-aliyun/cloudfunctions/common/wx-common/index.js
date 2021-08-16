const jwt = require('jsonwebtoken');
const appId = 'wx1284311b54d35d99';
const appSecret = 'f342da6857407f093ecb91347a161f4b';

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
	verifyToken
}
