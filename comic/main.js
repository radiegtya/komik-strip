var viewModule = require("./view.js");
var commentModule = require("./comment.js");
var moment = require('moment');

var MARGIN_X_SMALL = 2;
var MARGIN_SMALL = 4;
var MARGIN = 8;

var page = tabris.create("Page", {
    topLevel: true,
    title: "Comics",
    style: ["FULLSCREEN"]
});

var scrollView = tabris.create("ScrollView", {
    layoutData: {left: 0, right: 0, top: 0, bottom: 0}
}).appendTo(page);

var bgImageView = tabris.create("ImageView", {
    layoutData: {left: 0, top: 0, right: 0}
}).appendTo(scrollView);

var titleTextView = tabris.create("TextView", {
    layoutData: {left: 30, top: 30},
    markupEnabled: true,
    text: "",
    font: "32px sans-serif",
    textColor: "white",
}).appendTo(scrollView);

var descTextView = tabris.create("TextView", {
    layoutData: {left: 30, top: [titleTextView, 5]},
    markupEnabled: true,
    text: "",
    textColor: "black",
}).appendTo(scrollView);

scrollView.on("resize", function(widget, bounds) {
    var xhr2 = new tabris.XMLHttpRequest();
    xhr2.onreadystatechange = function() {
        if (xhr2.readyState === xhr2.DONE) {
            var dataCount = this.getResponseHeader('X-Pagination-Total-Count');
            var models = JSON.parse(xhr2.responseText).data;
            var collectionViewHeight = 100;

            //content for collectionView comic chapters
            var contentComposite = tabris.create("Composite", {
                layoutData: {left: 0, right: 0, top: [bgImageView, 0], height: collectionViewHeight * dataCount},
                background: "white"
            }).appendTo(scrollView);

            //create comic chapters instances
            tabris.create("CollectionView", {
                layoutData: {left: 0, top: [bgImageView, 0]},
                items: models,
                itemHeight: collectionViewHeight,
                initializeCell: function(cell) {
                    var imageView = tabris.create("ImageView", {
                        layoutData: {left: 0, top: 0}
                    }).appendTo(cell);
                    var titleTextView = tabris.create("TextView", {
                        layoutData: {left: [imageView, 10], top: MARGIN_SMALL},
                        font: "18px sans-serif",
                    }).appendTo(cell);
                    var numberTextView = tabris.create("TextView", {
                        layoutData: {right: MARGIN_SMALL, top: MARGIN_SMALL},
                        font: "18px sans-serif",
                    }).appendTo(cell);
                    var dateTextView = tabris.create("TextView", {
                        layoutData: {left: [imageView, 10], top: [titleTextView, MARGIN_X_SMALL]},
                        font: "12px sans-serif",
                    }).appendTo(cell);
                    cell.on("change:item", function(widget, model) {
                        imageView.set("image", {src: model.image});
                        titleTextView.set("text", model.title);
                        numberTextView.set("text", "#" + model.fields.number);
                        dateTextView.set("text", moment(model.createdAt).format('ll'));
                    });
                }
            }).on("select", function(target, obj) {
                createViewPage(obj).open();
            }).appendTo(contentComposite);
        }
    };
    xhr2.open("GET", "http://128.199.228.15:5001/api/v1/categories/the-muslim-show/catalogs/?key=a110568402c460bb91f2695d4052fe7b9fe6cb26&limit=1000");
    xhr2.send();

    var xhr = new tabris.XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === xhr.DONE) {
            var model = JSON.parse(xhr.responseText).data;
            var image = encodeURI(model.image.trim());

            titleTextView.set("text", model.title);
            descTextView.set("text", model.seoDescription);
            bgImageView.set("image", {src: image, width: bounds.width, height: bounds.width});
        }
    };
    xhr.open("GET", "http://128.199.228.15:5001/api/v1/categories/the-muslim-show/?key=a110568402c460bb91f2695d4052fe7b9fe6cb26");
    xhr.send();
});

scrollView.on("scroll", function(widget, offset) {
    bgImageView.set("transform", {translationY: offset.y * 0.4});
});

page.open();