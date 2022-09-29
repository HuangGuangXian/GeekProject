'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
exports.main = async (event, context) => {
	const { userId, articleId } = event;
	
	const userList = await db.collection('user').doc(userId).get();
	const thumbs_up_article_ids = userList.data[0].thumbs_up_article_ids;
	
	let thumbsArr = null;
	let msg = null;
	let thumbSum = null;
	
	// 判断数据表的指定数据里面是否点赞了这篇文章
	if (thumbs_up_article_ids.includes(articleId)) {
		// 取消操作
		thumbsArr = dbCmd.pull(articleId);
		msg = "取消点赞";
		thumbSum = -1;
	} else {
		// 添加操作
		thumbsArr = dbCmd.addToSet(articleId);
		msg = "点赞成功";
		thumbSum = 1;
	}
	// 修改当前这个指定的用户的点赞文章的状态
	await db.collection("user").doc(userId).update({
		thumbs_up_article_ids: thumbsArr
	});
	
	// 更新文章的点赞数量
	await db.collection('article').doc(articleId).update({
		thumbs_up_count: dbCmd.inc(thumbSum)
	})
	
	//返回数据给客户端
	return {
		code: 0,
		data: {
			msg
		}
	}
};
