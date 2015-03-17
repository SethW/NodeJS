var http = require('http');
var url = require('url');
var items = [];

var server = http.createServer(function (req, res) {
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
        items.forEach(function (item, i) {
            res.write(i + '. ' + item + '\n');
        });
        res.end();
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