createViewPage = function(obj) {
    var page = tabris.create("Page", {
        title: "#" + obj.fields.number + ". " + obj.title
    });

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
                        url: models[0].image,
                    }).appendTo(contentComposite);
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

    //footer comment image, onclick open comment page
    var commentImage = tabris.create("ImageView", {
        layoutData: {top: 15, left: 10, width: 25, height: 25},
        image: {src: "images/comment.png"},
    }).on("tap", function(target) {
        createCommentPage(obj).open();
    }).appendTo(footerComposite);

    //footer next image, onclick go to next chapter
    var nextImage = tabris.create("ImageView", {
        layoutData: {top: 15, right: 10, width: 25, height: 25},
        image: {src: "images/next.png"},
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
        image: {src: "images/prev.png"},
    }).on("tap", function(target) {
        goToPage(Number(obj.fields.number) - 1);
    }).appendTo(footerComposite);

    return page;
}

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