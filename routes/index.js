var express = require('express');
var fs = require('fs');
var router = express.Router();
var appName = 'Accessibility Logsum Model';
var folderNamesAndCsvNames = {};
var currentFolderName = './public/data/';
var folderNames = walkfolders(currentFolderName);

Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};
folderNamesAndCsvNames = {
    'Work':{
        'High':['Insuff Car','No Car','Suff Car','Need Car At Work'],
        'Low':['Insuff Car','No Car','Suff Car','Need Car At Work'],
        'Medium':['Insuff Car','No Car','Suff Car','Need Car At Work'],
    },
    'PSE':['Insuff Car','No Car','Suff Car'],

    'GS':{
        'Elementary School':['Insuff Car','No Car','Suff Car'],
        'Junior High':['Insuff Car','No Car','Suff Car'],
        'Preschool':['Insuff Car','No Car','Suff Car'],
        'SHS With License':['Insuff Car','No Car','Suff Car'],
        'SHS Without License':['Insuff Car','No Car','Suff Car'],
    },
    'Other': ['Insuff Car','No Car','Suff Car'],
    'Otherpurpose':{
        'Eat':['Insuff Car','No Car','Suff Car'],
        'PB':['Insuff Car','No Car','Suff Car'],
        'PUDO':['Insuff Car','No Car','Suff Car'],
        'QS':['Insuff Car','No Car','Suff Car'],
        'Rec':['Insuff Car','No Car','Suff Car'],
        'Shop':['Insuff Car','No Car','Suff Car'],
        'Soc':['Insuff Car','No Car','Suff Car']
    }

};
router.get('/', function(req, res, next) {
    res.render('index', { title: appName,sliderType:folderNamesAndCsvNames});
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
