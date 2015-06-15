createCommentPage = function(obj) {
    var page = tabris.create("Page", {
        title: "Komentar - " + obj.title,
    });

    //display comment page to webview
    tabris.create("WebView", {
        layoutData: {left: 0, top: 0, right: 0, bottom: 0},
        url: getUrlComment(obj._id, "themuslimshow"),
    }).appendTo(page);

    return page;
}

function getUrlComment(identifier, shortname) {
    return "http://piyiku.biz/tabris-helpers/disqus/embed.php?identifier=" + identifier + "&shortname=" + shortname;
}


      