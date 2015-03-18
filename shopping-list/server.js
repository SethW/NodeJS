var http = require('http');
var url = require('url');
var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');
var qs = require('querystring');

var root = __dirname;
var items = [];
var loaded_page = false;

var server = http.createServer(function (req, res) {
    if(req.url == '/') {
        console.log("Test");
        switch (req.method) {
        case 'POST':
            var item = '';
            req.setEncoding('utf8');
            req.on('data', function (chunk) {
                item += chunk;
            });
            req.on('end', function () {
                items.push(item);
                res.end('Item added\n');
            });
            break;
        case 'GET':
            
            req.url = '/index.html';
                
            
            var url = parse(req.url);
            var path = join(root, url.pathname);
            
            fs.stat(path, function (err, stat) {
                
                if (err) {
                    
                    if (err.code == 'ENOENT') {
                        res.statusCode = 404;
                        res.end('File Not Found');
                    }
                    else {
                        res.statusCode = 500;
                        res.end('Internal Server Error');
                    }
                }
                else {
                    if(!loaded_page){
                        loaded_page = true;
                        var stream = fs.createReadStream(path);
                        res.setHeader('Content-Length', stat.size);
                        stream.pipe(res);
                        stream.on('error', function (err) {
                            res.statusCode = 500;
                            res.end('Internal Server Error');
                        });
                    }else{
                        items.forEach(function (item, i) {
                            res.write(i + '. ' + item + '\n');
                        });
                        res.end();
                    }
                }
            });
            
            
            
            break;
        case 'DELETE':
            var pathname = url.parse(req.url).pathname;
            var i = parseInt(pathname.slice(1), 10);
        
            if (isNaN(i)) {
                res.statusCode = 400;
                res.end('Item id not valid');
            }
            else if (!items[i]) {
                res.statusCode = 404;
                res.end('Item not found');
            }
            else {
                items.splice(i, 1);
                res.end('Item deleted successfully');
            }
            break;
        case 'PUT':
            
            var pathname = url.parse(req.url).pathname;
            var i = parseInt(pathname.slice(1), 10);
        
            if (isNaN(i)) {
                res.statusCode = 400;
                res.end('Item id not valid');
            }
            else if (!items[i]) {
                res.statusCode = 404;
                res.end('Item not found');
            }
            else {
                req.setEncoding('utf8');
                req.on('data', function (chunk) {
                    items.splice(i,1,chunk);
                    res.end('Item modified\n');
                });
            }
            break;
        }
    }
    
    function getIndex(){
        var pathname = url.parse(req.url).pathname;
        var i = parseInt(pathname.slice(1), 10);
        if (isNaN(i)) {
            res.statusCode = 400;
            res.end('Item id not valid');
            return false;
        }
        else if (!items[i]) {
            res.statusCode = 404;
            res.end('Item not found');
            return false;
        }
        else{
            return i;
        }
    }

    
});

server.listen(9000, function(){
   console.log('listening on 9000');
});