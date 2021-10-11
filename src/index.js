const http = require('http');
const url = require('url');

const routes = require('./routes');

const server = http.createServer((request, response) => {
  const parsedUrl = url.parse(request.url, true); // parse() retorna uma string. Parse(arg1, true) transforma a string em obj JSON
  console.log(parsedUrl);
  console.log(`Request method: ${request.method} | Endpoint: ${parsedUrl.pathname}`);

  let { pathname } = parsedUrl;
  let id = null;
  
  const splitEndpoint = pathname.split('/').filter(Boolean); // --> Split() transforma a string em um array que é dividido a cada '/' encontrado. 

  if(splitEndpoint.length > 1) {
    pathname = `/${splitEndpoint[0]}/:id`;
    id = splitEndpoint[1];
  }

  const route = routes.find((routeObj) => (
    routeObj.endpoint === pathname && routeObj.method === request.method
  ));

  if(route) {
    request.query = parsedUrl.query;
    request.params = { id };

    route.handler(request,response);
  } else {
    response.writeHead(404, { 'Content-Type' : 'application/json'});
    response.end(`Cannot ${request.method} ${parsedUrl.pathname}`);
  }
});

server.listen(3000, () => console.log('Server started at http://localhost:3000'));