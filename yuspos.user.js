// ==UserScript==
// @name         SA forums shit
// @namespace    bobbilljim.com
// @version      1.0
// @description  sa forums shit
// @author       You
// @match        http://forums.somethingawful.com/*
// @match        https://forums.somethingawful.com/*
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

//give me a webm url
function embedWebm(url){
    var vidFrame = document.createElement("video");
    vidFrame.setAttribute("muted", '');
    vidFrame.setAttribute("autoplay", '');
    vidFrame.setAttribute("loop", '');
    vidFrame.setAttribute("src", url);
    return vidFrame;
}

//twitter integration
function twitLoaded (){
    //this goes over all teh links again for a MASSIVE performance hit :(
 	var links = jQuery('.postbody > a'); //more efficient AND wont load tweets into title text haha
	//find all tweet links
	for (var i=1; i < links.length; i++) {
        var ref = links[i].href;
        //console.log(ref);
        if(ref.indexOf("twitter.com") > -1 && ref.indexOf("status") > -1){
            //get tweet id
            var id = ref.substring(ref.lastIndexOf("/") + 1);
            //fuck it, just slam in the link
            var myDiv = document.createElement('div');
            $(links[i]).replaceWith(myDiv);
            twttr.widgets.createTweet(id, myDiv);
        }
	}
}

//----------------- shite ----------------------------

//these are probably redundant
var haveVine = false;
var haveGfycats = false;
var haveTweet = false;
//cheesy embed loop go
var tindeck = 'tindeck.com/listen/';
var gfycat = 'gfycat.com/';
var soundcloud = 'soundcloud.com/';
var soundclouds = {};
var cheesy = jQuery('.postbody > a , blockquote > a');
for (var c=0; c < cheesy.length; c++) {
    var cheesyRef = cheesy[c].href;
    if (cheesyRef.indexOf(tindeck) > -1){
        console.log("got tindeck, url: " + cheesyRef);
        var tinDiv = document.createElement("div");
        var part1 = "<object width=\"466\" height=\"105\">\n<param name=\"movie\" value=\"http://tindeck.com/player/v1/player.swf?trackid=";
        var part2 = "\"></param><param name=\"allowFullScreen\" value=\"true\"></param><param name=\"allowscriptaccess\" value=\"always\"></param><param name=\"wmode\" value=\"transparent\"></param><embed src=\"http://tindeck.com/player/v1/player.swf?trackid=";
        var part3 = "\" type=\"application/x-shockwave-flash\" wmode=\"transparent\" allowscriptaccess=\"always\" allowfullscreen=\"true\" width=\"466\" height=\"105\"></embed></object>";
        var trackIdSegment = cheesyRef.substring(cheesyRef.indexOf(tindeck) + tindeck.length);
        var trackId = trackIdSegment.substring(0, trackIdSegment.indexOf('/') > 0 ? trackIdSegment.indexOf('/') : trackIdSegment.length); //defensive lol whyyy
        tinDiv.innerHTML = part1 + trackId + part2 + trackId + part3;
        $(cheesy[c]).replaceWith(tinDiv);
    }else if (cheesyRef.indexOf(gfycat) > -1){
        console.log("got gfycat url: " + cheesyRef);
        var source = cheesyRef.substring(cheesyRef.lastIndexOf("/") + 1, (cheesyRef.substring(cheesyRef.lastIndexOf("/")).lastIndexOf(".") > -1 ? cheesyRef.lastIndexOf(".") : cheesyRef.length));
        console.log("sauce = " + source);
        $(cheesy[c]).replaceWith("<img class=\"gfyitem\" data-id=\"" + source + "\" />");      
        haveGfycats = true;
    }else if (cheesyRef.indexOf(".webm") > -1 || cheesyRef.indexOf(".gifv") > -1){
        haveWebm = true;
        var mungedLink = webmLinks[i].href.replace(".gifv", ".webm");
        var vidFrame = embedWebm(mungedLink);
        $(cheesy[c]).replaceWith(vidFrame);
    }else if(cheesyRef.indexOf("vine.co") > -1){
        haveVine = true;
        var vineFrame = document.createElement("iframe");
        vineFrame.class = "vine-embed";
        vineFrame.src = cheesyRef + "/embed/postcard";
        vineFrame.width="320";
        vineFrame.height="400";
        vineFrame.frameborder="0";
        $(cheesy[c]).replaceWith(vineFrame);
    }else if(cheesyRef.indexOf("twitter.com") > -1 && cheesyRef.indexOf("status") > -1){
        haveTweet = true;
    }else if (cheesyRef.indexOf(soundcloud) > -1){
        if(soundclouds[cheesyRef]){
            console.log("duped");
        }
        if(!soundclouds[cheesyRef]){
            console.log("adding soudclown link: " + cheesyRef);
            soundclouds[cheesyRef] = true;
            var request = 'http://api.soundcloud.com/resolve.json?url=' + cheesyRef + '&client_id=e9e08f5d3e6c544a4d1add6c762e9e2d';
            console.log(request);
            $.get(request , function (result) {
                //console.log(result);
                if(result.kind === "track"){
                    console.log("got track: " + result.permalink_url + " id " + result.id);
                    var soundSrc = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/" + result.id + "&amp;color=57ff57&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false";
                    var soundFrame = document.createElement('iframe');
                    soundFrame.width="100%";
                    soundFrame.height="166";
                    soundFrame.scrolling="no";
                    soundFrame.frameborder="no";
                    soundFrame.src = soundSrc;
                    $("[href$='" + result.permalink_url.substring(result.permalink_url.indexOf(soundcloud)) + "']").replaceWith(soundFrame);
                }
                //can't do much to embed users and stuff so w/e
            });
        }
        //http://api.soundcloud.com/resolve.json?url=https://soundcloud.com/giraffage/04-all-that-matters&client_id=e9e08f5d3e6c544a4d1add6c762e9e2d
    }
}
if(haveGfycats){
    loadScript('http://assets.gfycat.com/js/gfyajax-0.517d.js');
}
if (haveVine){
    loadScript("//platform.vine.co/static/scripts/embed.js");
}
if(haveTweet){
    loadScript("http://platform.twitter.com/widgets.js", twitLoaded, "twitscript");
}

//some functionality
//jQuery('.userinfo.userid-43235').parent().attr('style', "background-color: purple !important;background-image:none !important;");
//if (jQuery('.userinfo.userid-185872').size() > 0) { 
//	var warn = confirm('Warning! ' + jQuery('.userinfo.userid-185872 .author').first().html() + ' Post Detected. Proceed?'); 
//	if(warn == false){ window.location.href = 'http://forums.somethingawful.com/forumdisplay.php?forumid=219' };
//};

//if (jQuery('.userinfo.userid-185872').size() > 0) { 
//    loadScript("http://code.onion.com/fartscroll.js", function () { fartscroll(500); console.log("fartscroll activated");} );
//    console.log("fartscroll set");
//}

//resize images like the forums damn well should - TODO: auto timg style but as wide as screen??
//firefox is a garbage and doesnt understand max-width:100% inside tables
var max_width = Math.min.apply(Math, jQuery('.postbody').not(jQuery('.postbody > img').parent()).map(function(){ return jQuery(this).width(); }).get());
jQuery('.postbody img.img').css("max-width",max_width);

console.log("farking hell");
// ------------------ POS only garbage ---------------------------------
if (document.body.className.indexOf("forum_219") > -1)
{
	console.log("i ranned");
	var messages = document.getElementsByName("message");
    if(messages.length > 0){
        messages[0].setAttribute('style','font-family:consolas, monaco, monospace;font-size: 14px;');
    }
	
	console.log("fahrt");
    jQuery("dt.author.platinum").css("background-image","url(data:image/png;base64,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");
	console.log("ballz");
	//highlight when i'm quoted
	//this is wrapped in a timeout since firefox runs it like just whenever
    window.setTimeout(function() {
		jQuery("div.userquoted").removeClass("bbc-block").removeClass("userquoted").css({
			"background":"#444444",
			"border-color":"#57ff57",
			"border-radius":"0",
			"border-style":"solid none",
			"border-width":"1px 0",
			"margin":"12px 22px",
			"padding":"2px 18px"
		});
		//nice functionailty
		var base64Nice = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAUCAYAAADRA14pAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gwRBS4qH8IIFQAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAuUlEQVRYw+1Y2w6AIAgN1z/yjXwlPTRXc1BkaBfEl+aCOAcECZCRp0gSCTAycpqCyQD8d5lrzzsBgVQDCAi0upB1tPqRdY9sSN8u7bpFWDK837M8l2AJtiURun/n0ZS2REDb0yJzBsoD9K0z3KKlaaBq0tcVsFeK9Sb2E1Xak9z0JvZ7gE5vYd5KYFnJr/qQWjAvOW3p4bkHW8lAXleXi8cV5ySnct/Veu+Z/piWxrQ0hoeYgCHaL54FH2yW03TbUfMAAAAASUVORK5CYII=";
		jQuery("button.nice").parent().replaceWith('<li><a class="nice" href="#"><img src="' + base64Nice + '"></a><li>');
		loadScript("http://www.cornify.com/js/cornify.js", function(){
			//add click event
			$( "a.nice" ).click(
		    function( event ) {
		    	event.preventDefault();
		        cornify_add();
		    });
		});
	}, 200);

	//synpa functionalith
    if(window.location.pathname == "/forumdisplay.php"){
		var myStyle = document.createElement('style');
		myStyle.setAttribute('type', 'text/css');
		myStyle.innerHTML = "#forum td.snype { background-color:red !important; text-align:center !important} #forum td.almostsnype { background-color:yellow !important; text-align:center !important}";
		document.head.appendChild(myStyle);
		
        
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
    //CHECK THAT SIGBOX brute force approach
    var s = document.getElementsByName('signature');
    for(var si=0; si<s.length; si++)
    {
        if(s[si].getAttribute('type') == 'checkbox'){
            s[si].setAttribute('checked',true);
        }
    }
}
