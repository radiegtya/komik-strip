Api = {
    url: "http://128.199.228.15:5001/api/v1",
//    url: "http://192.168.1.178:3000/api/v1",
    key: "a110568402c460bb91f2695d4052fe7b9fe6cb26",
    getUrl: function(route, params) {
        var paramString = "";
        for (var key in params) {
            paramString += "&" + key + "=" + params[key];
        }
        
        return this.url + "/" + route + "/?key=" + this.key + paramString;
    }
}