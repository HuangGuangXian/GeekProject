'use strict';
exports.main = async (event, context) => {
	const {phone} = event;
	// 创建一个随机数
	const currentNumber = Math.random().toString().substr(2, 6);
	try {
	    const res = await uniCloud.sendSms({
	      appid: '__UNI__89022ED', // 工程ID
	      smsKey: '90b165117f83c3ca7714391db23d0a6d',
	      smsSecret: '2607dfe602ef23fee3c0a101d84e0989',
	      phone,
	      templateId: '12333', // 短信模板的ID
	      data: {
	        code: currentNumber,
	        expMinute: '1',
	      }
	    })
	    // 调用成功，请注意这时不代表发送成功
	    return {
			code: 0,
			data: {
				msg: '请在手机上注意查收验证码',
				mobileCode: currentNumber
			}
		}
	  } catch(err) {
	    return {
	      code: 1,
	      msg: "手机验证码发送失败"
	    }
	  }
	
};
