var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();
var appName = 'Accessibility Model';
var currentFolderName = './public/data/';

Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};
let sliderType = walk('./public/data');
function walk(directory) {

    let results = {};
    if(is_dir(directory)){
        let childList = walkfolders(directory);
        for(let i=0;i<childList.length;i++){
            results[childList[i]]={};
        }
        for(let k in results){
            if(is_dir(directory+'/'+k)){
                let childList = walkfolders(directory+'/'+k)
                for(let i=0;i<childList.length;i++){
                    results[k][childList[i]] = {}
                }
                for(let y in results[k]){
                    if(is_dir(directory+'/'+k+'/'+y)){
                        let childList = walkfolders(directory+'/'+k+'/'+y);
                        for(let i=0;i<childList.length;i++){
                            results[k][y][childList[i]] = {}
                        }
                        for(let x in results[k][y]){
                            if(is_dir(directory+'/'+k+'/'+y+'/'+x)){
                                let childList = walkfolders(directory+'/'+k+'/'+y+'/'+x);
                                for(let i=0;i<childList.length;i++){
                                    results[k][y][x][childList[i]] = {}
                                }
                                for(let z in results[k][y][x]){
                                    if(is_dir(directory+'/'+k+'/'+y+'/'+x+'/'+z)){
                                        console.log('Too Complex Data Structure! Cannot Handle1')
                                    }
                                    else{
                                        results[k][y][x] =  walkfolders(directory+'/'+k+'/'+y+'/'+x);
                                    }
                                }

                            }
                            else{
                                results[k][y] =  walkfolders(directory+'/'+k+'/'+y);
                            }

                        }
                    }
                    else{
                        results[k] = walkfolders(directory+'/'+k)
                    }
                }
            }
            else{
                results= walkfolders(directory+'/')
            }
        }
    }
    else{

    }
    return results
}
router.get('/', function(req, res, next) {
    res.render('index', { title: appName,sliderType:sliderType});
});

function walkfolders(dir) {
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    var filelist = filelist || [];
    files.forEach(function (file) {
        filelist.push(file.split('.csv')[0]);
    });
    return filelist;
}

function is_dir(path) {
    try {
        var stat = fs.lstatSync(path);
        return stat.isDirectory();
    } catch (e) {
        // lstatSync throws an error if path doesn't exist
        return false;
    }
}

module.exports = router;
