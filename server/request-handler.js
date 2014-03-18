/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

var storage = [];
var responseBody;
var statusCode;
var storageLocations = {
  '/log': true,
  '/classes/room1': true,
  '/send': true,
  '/classes/messages/': true,
  '/classes/messages/?order=-createdAt': true
};

var handler = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */


  console.log('Serving request type ' + request.method + ' for url ' + request.url);


  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */

  var defaultCorsHeaders = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    'access-control-max-age': 10 // Seconds.
  };
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = 'text/plain';

  if (request.method==='POST'){


    request.on('data', function(data){

      storage.push(JSON.parse(data.toString()));
      storageLocations[request.url] = true;
    });

    statusCode = 201;
    responseBody = '';
    console.log('posted');
  }

  if (request.method==='GET'){
    console.log('storage', storage);
    responseBody = { 'results': storage };
    statusCode = 200;
    if(storageLocations[request.url] === undefined && request.method ==='GET'){
      statusCode = 404;
    }
  }


  //if (request.url.indexOf('/classes') === -1 || request.url.indexOf('/log') === -1){
  /* .writeHead() tells our server what HTTP status code to send back */
  response.writeHead(statusCode, headers);

  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/

  response.end(JSON.stringify(responseBody));
  //response.end(JSON.stringify({'results':['Hello, World!']}));
};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */

//export for the import (require)
module.exports.handler = handler;
