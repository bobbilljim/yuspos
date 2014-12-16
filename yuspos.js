// ==UserScript==
// @name         Pos general fixes
// @namespace    bobbilljim.com
// @version      0.1
// @description  pos reply font fix
// @author       You
// @match        forums.somethingawful.com/*
// ==/UserScript==
if (document.body.className.indexOf("forum_219") > -1)
{

    //GM_addStyle ("\
    //            .post-wrapper {\
    //             	font-family: consolas, monaco, monospace;!important \
    //             }\
    //         	");
    //console.log("i ran");
    var messages = document.getElementsByName("message");
    if(messages.length > 0){
        messages[0].setAttribute('style','font-family:consolas, monaco, monospace;font-size: 14px;');
    }
    GM_addStyle ("\
                 #thread dl.userinfo dt.platinum{\
    			 	background-image: url(data:image/png;base64,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);\
				 }");
}
             