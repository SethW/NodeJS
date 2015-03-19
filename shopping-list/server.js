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
    
    var ext = req.url.split('.').pop();
    var pathname = url.parse(req.url).pathname;
    
    
    if(req.url == '/') {
        
        switch (req.method) {
        case 'POST':
            var item = '';
            req.setEncoding('utf8');
            req.on('data', function (chunk) {
                item += chunk;
            });
            // redirect back to the "GET" 
            req.on('end', function () {
                items.push(item);
                res.end('Item added\n');
            });
            break;
        case 'GET':
            // very primitive
            // loop inside html string.. that goes over items array 
            var html_top = '<!DOCTYPE html>' +
            '<html lang="en">'+
            '<head>' +
                '<script src="jquery-1.11.2.min.js"></script>'+
                '<script src="scripts.js"></script>'+
                '<link rel="stylesheet" type="text/css" href="style.css" />'+
               '<meta charset="UTF-8">' +
               '<title>Shopping List</title>' +
            '</head>' +
            '<body>' +
               '<form action="/" method="post">' +
                  '<input type="text" name="item" placeholder="Enter an item">' +
                  '<button>Add Item</button>' +
               '</form>' +
               '<ul>';

            var content_string = "";
            for (var i = 0; i < items.length; i++){
               content_string += "<li id='"+i+"'><span class='item_value'>" + qs.parse(items[i]).item + "</span><a href='#' class='delete'>X</a><a href='#' class='modify'>M</a></li>";
            }

            var full_html = html_top + content_string + '</ul>'+
                              '</body>' +
                              '</html>'
            
            res.end(full_html);
            break;
        
        }
    }else if(ext == "js" || ext == "css" || ext == "ico"){ //Not the index
        
        
        
        var rurl = parse(req.url);
        var path = join(root, rurl.pathname);
            
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
                        var stream = fs.createReadStream(path);
                        res.setHeader('Content-Length', stat.size);
                        stream.pipe(res);
                        stream.on('error', function (err) {
                            res.statusCode = 500;
                            res.end('Internal Server Error');
                        });
                    }
                });
    }else{
        if(req.method == "DELETE"){
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
        }else if(req.method == "PUT"){
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
        }
    }

});

server.listen(9000, function(){
   console.log('listening on 9000');
});