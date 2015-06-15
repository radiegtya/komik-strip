createViewPage = function(obj) {
    var page = tabris.create("Page", {
        title: "#" + obj.fields.number + ". " + obj.title,
    });

    //call loading
    Spinner.get().appendTo(page);

    var scrollView = tabris.create("ScrollView", {
        layoutData: {left: 0, right: 0, top: 0, bottom: 50}
    }).appendTo(page);

    scrollView.on("resize", function(widget, bounds) {
        var xhr = new tabris.XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.responseText) {
                    var models = JSON.parse(xhr.responseText).data;

                    //content for collectionView comic pages
                    var contentComposite = tabris.create("Composite", {
                        layoutData: {left: 0, right: 0, top: 0, bottom: 50},
                        background: "white"
                    }).appendTo(scrollView);

                    //display comic image to webview
                    var contentWebView = tabris.create("WebView", {
                        layoutData: {left: 0, top: 0, right: 0},
                        url: "http://piyiku.biz/tabris-helpers/images/pinch.php?image=" + models[0].image,
                    }).appendTo(contentComposite);

                    //hide loading
                    Spinner.hide();

                } else {
                    window.plugins.toast.showShortCenter("Maaf, Silakan cek koneksi internet Anda.");
                }
            }
        };
        xhr.open("GET", Api.getUrl("catalogs/" + obj._id + "/photos", {limit: 1}));
        xhr.send();
    });

    //create footer
    var footerComposite = tabris.create('Composite', {
        layoutData: {bottom: 0, left: 0, right: 0, height: 50},
        background: "black"
    }).appendTo(page);

    //footer love image, onclick open comment page
    var loveImage = tabris.create("ImageView", {
        layoutData: {top: 15, left: 10, width: 25, height: 25},
        image: {src: "comic/images/love.png"},
    }).on("tap", function(target) {
        postLove(obj);
    }).appendTo(footerComposite);

    var loveCountTextView = tabris.create("TextView", {
        layoutData: {top: 15, left: [loveImage, 5], width: 25, height: 25},
        textColor: "white"
    }).on("tap", function(target) {
        postLove(obj);
    }).on('resize', function() {
        getLoveCount(obj, this);
    }).appendTo(footerComposite);

    //footer comment image, onclick open comment page
    var commentImage = tabris.create("ImageView", {
        layoutData: {top: 15, left: [loveCountTextView, 10], width: 25, height: 25},
        image: {src: "comic/images/comment.png"},
    }).on("tap", function(target) {
        createCommentPage(obj).open();
    }).appendTo(footerComposite);

    //footer comment count webview
    var commentCountWebView = tabris.create("WebView", {
        layoutData: {top: 10, left: [commentImage, 5], width: 110},
        url: getUrlCommentCount(obj._id, "themuslimshow"),
    }).on("tap", function(target) {
        createCommentPage(obj).open();
    }).appendTo(footerComposite);

    //footer next image, onclick go to next chapter
    var nextImage = tabris.create("ImageView", {
        layoutData: {top: 15, right: 10, width: 25, height: 25},
        image: {src: "comic/images/next.png"},
    }).on("tap", function(target) {
        goToPage(Number(obj.fields.number) + 1);
    }).appendTo(footerComposite);

    //footer currentpage
    var currPageText = tabris.create("TextView", {
        layoutData: {top: 15, right: [nextImage, 10], width: 30, height: 25},
        text: "#" + obj.fields.number,
        textColor: "white"
    }).appendTo(footerComposite);

    //footer prev image, onclick go to prev chapter
    var prevImage = tabris.create("ImageView", {
        layoutData: {top: 15, right: [nextImage, 50], width: 25, height: 25},
        image: {src: "comic/images/prev.png"},
    }).on("tap", function(target) {
        goToPage(Number(obj.fields.number) - 1);
    }).appendTo(footerComposite);

    function goToPage(number) {
        if (number == 0) {
            window.plugins.toast.showShortCenter("Maaf, halaman tidak ditemukan");
            return false;
        }

        var xhr = new tabris.XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.responseText) {
                    var models = JSON.parse(xhr.responseText).data;

                    if (models[0])
                        createViewPage(models[0]).open();
                    else
                        window.plugins.toast.showShortCenter("Maaf, halaman tidak ditemukan");
                } else {
                    window.plugins.toast.showShortCenter("Maaf, Silakan cek koneksi internet Anda.");
                }
            }
        };
        xhr.open("GET", Api.getUrl("categories/the-muslim-show/catalogs", {number: number}));
        xhr.send();
    }


//function checkPage(number) {
//    var xhr = new tabris.XMLHttpRequest();
//    xhr.onreadystatechange = function() {
//        if (xhr.readyState === xhr.DONE) {
//            var models = JSON.parse(xhr.responseText).data;
//
//            if (models[0]){
//                console.log(models[0])
//                return true;
//            }
//            return false;
//        }
//    };
//    xhr.open("GET", "http://128.199.228.15:5001/api/v1/categories/the-muslim-show/catalogs/?key=a110568402c460bb91f2695d4052fe7b9fe6cb26&number=" + number);
//    xhr.send();
//}

    function getIP() {
        if (window.XMLHttpRequest)
            xmlhttp = new XMLHttpRequest();
        else
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

        xmlhttp.open("GET", "http://api.hostip.info/get_html.php", false);
        xmlhttp.send();

        hostipInfo = xmlhttp.responseText.split("\n");

        for (i = 0; hostipInfo.length >= i; i++) {
            ipAddress = hostipInfo[i].split(":");
            if (ipAddress[0] == "IP")
                return ipAddress[1];
        }

        return false;
    }

    function getUrlCommentCount(identifier, shortname) {
        return "http://piyiku.biz/tabris-helpers/disqus/count.php?identifier=" + identifier + "&shortname=" + shortname;
    }

    function postLove(obj) {
        console.log(getIP())
        
        //check user already like this chapter? disable love
        if (localStorage.getItem("loved" + obj._id)) {
            window.plugins.toast.showShortCenter("Maaf Anda tidak dapat menyukai chapter ini lagi.");
            console.log('ini jalan')
            return false;
        } else {
            window.plugins.toast.showShortCenter("Anda menyukai chapter ini.");            

            var xhr = new tabris.XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === xhr.DONE) {
                    if (xhr.responseText) {
                        var models = JSON.parse(xhr.responseText).data;

                        //set to local storage that user already like this chapter
                        localStorage.setItem("loved" + obj._id, true);
                        console.log('local set')
                    }
                }
            };
            xhr.open("POST", Api.getUrl("catalogs/" + obj._id + "/likes"), true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send('identifier=' + obj._id);

            getLoveCount(obj, loveCountTextView);
        }
    }

    function getLoveCount(obj, textView) {
        var xhr = new tabris.XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.responseText) {
                    var dataCount = this.getResponseHeader('X-Pagination-Total-Count');

                    textView.set('text', dataCount);
                }
            }
        };
        xhr.open("GET", Api.getUrl("catalogs/" + obj._id + "/likes"));
        xhr.send();
    }

    return page;
}
