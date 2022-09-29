import ajax from "@/ajax/http.js";

// 检查最新版本
export const get_current_version = data => ajax({
	name: 'get_current_version',
	data
});