'use strict';
const db = uniCloud.database();
const $ = db.command.aggregate;	// 获取一个聚合的操作符
exports.main = async (event, context) => {
	const { userId } = event;
	
	const userInfo = await db.collection("user").doc(userId).get();
	const author_likes_ids = userInfo.data[0].author_likes_ids;	//获取关注作者的数组
	
	let list = await db.collection("user")
		.aggregate()
		.addFields({
			is_like: $.in(['$id', author_likes_ids])
		})
		.project({
			loginName: false,
			password: false
		})
		.match({
			is_like: true
		})
		.end();
	
	//返回数据给客户端
	return {
		code: 0,
		msg: "获取数据成功",
		data: list.data
	}
};
