Spinner = {
    spinnerImageView: "",
    get: function() {
        this.spinnerImageView = tabris.create("ImageView", {
            layoutData: {top: 0, left: 0, right: 0, bottom: 0},
            image: {src: 'helpers/spinner/images/loading.gif'}
        });

        return this.spinnerImageView;
    },
    hide: function() {
        this.spinnerImageView.set("visible", false);
    }
}