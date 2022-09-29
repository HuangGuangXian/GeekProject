'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
exports.main = async (event, context) => {
	const {
		userId, 
		articleId, 
		content,
		comment_id = '',
		reply_id = '',
		is_reply = false
		} = event;
	
	// 获取用户信息
	let user = await db.collection("user").doc(userId).get();
	user = user.data[0];
	
	// 获取文章的数据表
	const article = await db.collection("article").doc(articleId).get();
	const comments = article.data[0].comments;
	
	let commentObj = {
		comment_id: generatedId(5), //生成一个唯一的id值
		comment_content: content,	// 评论内容
		create_time: Date.now(),	// 评论时间
		is_reply,	// 是否是回复评论
		replyArr: [],
		author: {	// 作者信息
			author_id: user._id,	// id
			author_name: user.author_name,	// 作者名字
			avatar: user.avatar,	// 头像
			professional: user.professional	// 职业
		}
	}
	
	if(comment_id === '') {
		commentObj.replyArr = [];
		commentObj = dbCmd.unshift(commentObj);
	} else {
		// 获取当前的评论的集合，在这个集合里面找到指定的那一条评论，修改replyArr属性
		let commentAuthor = null;
		let commentIndex = comments.findIndex(item => item.comment_id === comment_id);
		
		if(is_reply) {
			commentAuthor = comments[commentIndex].replyArr.find(item => item.comment_id === reply_id).author.author_name;
		} else {
			commentAuthor = comments.find(item => item.comment_id === comment_id).author.author_name;
		}
		
		commentObj.to = commentAuthor;
		
		commentObj = {
			[commentIndex]: {
				replyArr: dbCmd.unshift(commentObj)
			}
		}
	}
	
	// 修改文章评论内容
	await db.collection("article").doc(articleId).update({
		comments: commentObj
	})
	
	// 生成ID的方法
	function generatedId(num) {
		return Number(Math.random().toString().substr(3, num) + Date.now()).toString(36);
	}
	
	//返回数据给客户端
	return {
		code: 0,
		data: {
			msg: "添加数据成功"
		}
	}
};
