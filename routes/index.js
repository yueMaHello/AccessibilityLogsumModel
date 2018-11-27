var express = require('express');
var fs = require('fs');
var router = express.Router();
var appName = 'Accessibility Logsum Model';
var currentFolderName = './public/data/';

Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};

router.get('/', function(req, res, next) {
    res.render('index', { title: appName});
});

function walkfolders(dir) {
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    var filelist = filelist || [];
    files.forEach(function (file) {
        filelist.push(file);
    });
    return filelist;
}
module.exports = router;
