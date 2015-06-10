var MARGIN_SMALL = 4;
var MARGIN = 8;

var titleCompY = 0;

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
  text: "The Muslim Show",
  font: "32px sans-serif",
  textColor: "white",
}).appendTo(scrollView);

var descTextView = tabris.create("TextView", {
  layoutData: {left: 30, top: [titleTextView, 5]},
  markupEnabled: true,
  text: "<p>The Muslim Show Indonesia</p>",
  textColor: "white",
}).appendTo(scrollView);

var contentComposite = tabris.create("Composite", {
  layoutData: {left: 0, right: 0, top: [bgImageView, 0], height: 700},
  background: "white"
}).appendTo(scrollView);

tabris.create("TextView", {
  layoutData: {left: MARGIN, right: MARGIN, top: MARGIN},
  text: "Etiam nisl nisi, egestas quis lacus ut, tristique suscipit metus. In vehicula lectus " +
        "metus, at accumsan elit fringilla blandit. Integer et quam sed dolor pharetra " +
        "molestie id eget dui. Donec ac libero eu lectus dapibus placerat eu a tellus. Fusce " +
        "vulputate ac sem sit amet bibendum. Pellentesque euismod varius purus pharetra. Sed " +
        "vitae ipsum sit amet risus vehicula euismod in at nunc. Sed in viverra arcu, id " +
        "blandit. Praesent sagittis quis nisl id molestie. Donec dignissim, nisl id volutpat " +
        "consectetur, massa diam aliquam lectus, sed euismod leo elit eu justo. Integer vel " +
        "ante sapien.\n\nNunc sit amet blandit tellus, sed neque. Proin vel elementum augue. " +
        "Quisque gravida nulla nisl, at fermentum turpis euismod in. Maecenas tortor at ante " +
        "vulputate iaculis at vitae sem. Nulla dui erat, viverra eget mauris in, sodales " +
        "mollis. Integer rhoncus suscipit mi in pulvinar. Nam metus augue, dictum a egestas " +
        "ut, gravida eget ipsum. Nunc nisl, mollis et mauris in, venenatis blandit magna. " +
        "Nullam scelerisque tellus lacus, in lobortis purus consectetur sed. Etiam pulvinar " +
        "sapien vel nibh vehicula, in lacinia odio pharetra. Duis tincidunt metus a semper " +
        "auctor. Sed nec consequat augue, id vulputate orci. Nunc metus nulla, luctus id " +
        "porttitor nec, sed lacus. Interdum et malesuada fames ac ante ipsum primis in faucibus."
}).appendTo(contentComposite);


scrollView.on("resize", function(widget, bounds) {
  bgImageView.set("image", {src: "images/car-rent.jpg", width: bounds.width, height: bounds.width});
});

scrollView.on("scroll", function(widget, offset) {
  bgImageView.set("transform", {translationY: offset.y * 0.4});
});

page.open();
      