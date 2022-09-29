(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/CommentBox/CommentBox"],{"5b9e":function(n,e,t){"use strict";t.d(e,"b",(function(){return u})),t.d(e,"c",(function(){return c})),t.d(e,"a",(function(){return o}));var o={uniDateformat:function(){return Promise.all([t.e("common/vendor"),t.e("uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat")]).then(t.bind(null,"4026"))},CommentBox:function(){return Promise.resolve().then(t.bind(null,"95f5"))}},u=function(){var n=this,e=n.$createElement;n._self._c},c=[]},"6fd7":function(n,e,t){"use strict";var o=t("f94b"),u=t.n(o);u.a},"95f5":function(n,e,t){"use strict";t.r(e);var o=t("5b9e"),u=t("ce96");for(var c in u)"default"!==c&&function(n){t.d(e,n,(function(){return u[n]}))}(c);t("6fd7");var r,i=t("f0c5"),m=Object(i["a"])(u["default"],o["b"],o["c"],!1,null,null,null,!1,o["a"],r);e["default"]=m.exports},c9a9:function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o=function(){Promise.resolve().then(function(){return resolve(t("95f5"))}.bind(null,t)).catch(t.oe)},u={name:"CommentBox",components:{CommentBox:o},props:{commentData:Object,isReply:{type:Boolean,default:!1}},methods:{commentReply:function(n){n.isReply&&(n.comment.reply_id=n.comment.comment_id,n.comment.comment_id=this.commentData.comment_id),this.$emit("commentReply",n)}}};e.default=u},ce96:function(n,e,t){"use strict";t.r(e);var o=t("c9a9"),u=t.n(o);for(var c in o)"default"!==c&&function(n){t.d(e,n,(function(){return o[n]}))}(c);e["default"]=u.a},f94b:function(n,e,t){}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/CommentBox/CommentBox-create-component',
    {
        'components/CommentBox/CommentBox-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("95f5"))
        })
    },
    [['components/CommentBox/CommentBox-create-component']]
]);
