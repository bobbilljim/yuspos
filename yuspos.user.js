// ==UserScript==
// @name         SA forums shit
// @namespace    bobbilljim.com
// @version      0.3
// @description  sa forums shit
// @author       You
// @match        forums.somethingawful.com/*
// ==/UserScript==

//--------------------- functions ---------------------------------

//copied from snackoverflow because I coudln't understand twitter's version
//http://stackoverflow.com/questions/950087/include-a-javascript-file-in-another-javascript-file
function loadScript(url, callback, id)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.id = id;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}


//----------------- shite ----------------------------

//if i was bothered i'd sort out all the lonks in one loop and hand them out to these funcs 


//twitter integration
var twitLoaded = function() {
 	var links = document.getElementsByTagName("a");
	//find all tweet links
	for (var i=1; i < links.length; i++) {
        var ref = links[i].href;
        //console.log(ref);
        if(ref.indexOf("twitter.com") > -1 && ref.indexOf("status") > -1){
            //get tweet id
            var id = ref.substring(ref.lastIndexOf("/") + 1);
            //fuck it, just slam in the link
            twttr.widgets.createTweet(id, links[i]);
        }
	}
};

loadScript("http://platform.twitter.com/widgets.js", twitLoaded, "twitscript");

//vine integration
var links = document.getElementsByTagName("a");
//find all vine links
var haveVine = false;
for (var i=1; i < links.length; i++) {
    if(links[i].href.indexOf("vine.co") > -1){
        haveVine = true;
        var vineFrame = document.createElement("iframe");
        vineFrame.class = "vine-embed";
        vineFrame.src = links[i].href + "/embed/postcard";
        vineFrame.width="320";
        vineFrame.height="400";
        vineFrame.frameborder="0"   
        links[i].appendChild(document.createElement("br"));
        links[i].appendChild(vineFrame);
    }
}
if (haveVine){
    loadScript("//platform.vine.co/static/scripts/embed.js");
}



// ------------------ POS only garbage ---------------------------------
if (document.body.className.indexOf("forum_219") > -1)
{
    //console.log("i ran");
    var messages = document.getElementsByName("message");
    if(messages.length > 0){
        messages[0].setAttribute('style','font-family:consolas, monaco, monospace;font-size: 14px;');
    }
    
    GM_addStyle ("\
                 #thread dl.userinfo dt.platinum{\
    			 	background-image: url(data:image/png;base64,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);\
				 }");
    //console.log("i ran");
    if(window.location.pathname == "/forumdisplay.php"){
        GM_addStyle("#forum td.snype { background-color:red !important; text-align:center !important}");
        GM_addStyle("#forum td.almostsnype { background-color:yellow !important; text-align:center !important}");
        
        var repliesCells = document.getElementsByTagName("td");
        for (var i=1; i<repliesCells.length; i++) {
            if(repliesCells[i].className == "replies"){
                var str = repliesCells[i].innerHTML;
                
                var numReplies =  repliesCells[i].firstChild.innerHTML ;
                //console.log(str + "  " + numReplies);
                if ((numReplies ) % 40 == 39 || (numReplies ) % 40 == 38)
                {
                    //console.log(str);
                    var threadNumber = str.substring(str.indexOf("threadid=") + "threadid=".length, str.indexOf("target=") - 2);
                    //console.log(threadNumber);
                    repliesCells[i].className = ((numReplies ) % 40 == 39) ? "snype" : "almostsnype";
                    repliesCells[i].innerHTML = "<a href=\"http://forums.somethingawful.com/newreply.php?s=&action=newreply&threadid=" + threadNumber + "\">" + numReplies + "</a>" + str.substring(str.indexOf("</a>") + 4);
                }
            }
        }
    }
    //cosby shit - NICE! overhaul
}
             