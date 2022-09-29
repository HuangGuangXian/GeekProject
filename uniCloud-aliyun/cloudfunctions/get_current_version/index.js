'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	const version = await db.collection("version").get();
	
	//返回数据给客户端
	return {
		code: 0,
		data: {
			version: version.data[0].current_version,
			downLoadLinkUrl: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-99bcace7-998a-4070-9bd9-e4ab2b49ec93/21c8451d-d3d7-4ba9-a6b7-a8b9755bd69a.apk"
		}
	}
};
