var http = require('http');
var fs = require('fs');
var path = require('path');

var PORT = 8080;

var zips = {};

var readZipFiles = function (dirname, onFileContent, onError) {
  fs.readdir(dirname, function(error, filenames) {
    if (error) {
      onError(error);
      return;
    }
    filenames.forEach(function(filename) {
      fs.readFile(dirname + filename, 'utf-8', function(error, content) {
        if (error) {
          onError(error);
          return;
        }
        onFileContent(filename, content);
      });
    });
  });
};


readZipFiles('./postalcodes/', function(filename, content) {
  zips[JSON.parse(content).postal_code] = JSON.parse(content);
}, function(error) {
  throw error;
});

var handleRequest = function (request, response){
  var filePath = request.url;
  var extname = path.extname(filePath);
  var contentTypesByExtention = {
    'html': 'text/html',
    'js':   'text/javascript',
    'css':  'text/css'
  };
  var zip = request.url.replace("/","");

  if (request.url === "/") {
    fs.readFile('index.html',function (error, data){
      if(error){
        response.writeHead(500, {"Content-Type": "text/html"});
        response.end("<h1>FS READ FILE ERROR: Internal Server Error!</h1>");
      }
      response.writeHead(200, {'Content-Type': contentTypesByExtention[extname] || 'text/html','Content-Length':data.length});
      response.write(data);
      //if (zips[zip]) {
      //  response.send({"zip": zip, "city": zips[zip]["place_name"], "state": zips[zip]["admin_name1"]});
      //}
      response.end();
    });
  } else {
    if (zips[zip]) {
      var cityState = JSON.stringify(zips[zip]);
      console.log("server/cityState:", cityState);
      response.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': cityState.length});
      response.write(cityState);
      response.end();
    } else {
      var noZip = "ZIP Code Not Found";
      response.writeHead(200, {'Content-Type': 'text/plain', 'Content-Length': noZip.length});
      response.write(noZip);
      response.end();
    }

  }
};

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
  console.log("Server listening on: http://localhost:%s", PORT);
});