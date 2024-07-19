// Bring in the http module
import http from 'http';
// Import CRUD operations
import { createProduct, deleteProduct, getProducts, getProductById, updateProduct } from './crudOperations.js';
// Import utility functions
import { regex, returnErrorWithMessage } from './utils.js';

// Base resource
const resource = '/products';

// Request handler to handle all requests
const requestHandler = async (req, res) => {
  const { method, url } = req;
  if (url === resource) {
    if (method === 'GET') return await getProducts(req, res);
    if (method === 'POST') return await createProduct(req, res);
    else return returnErrorWithMessage(res, 405, 'Method Not Allowed');
  } else if (regex(resource).test(url)) {
    if (method === 'GET') return await getProductById(req, res);
    if (method === 'PUT') return await updateProduct(req, res);
    if (method === 'DELETE') return await deleteProduct(req, res);
    else return returnErrorWithMessage(res, 405, 'Method Not Allowed');
  } else {
    return returnErrorWithMessage(res, 404, 'Resource Not Found');
  }
};
// Create a server
const server = http.createServer(requestHandler);
// Set the port
const port = 3000;
// Start the server
server.listen(port, () => console.log(`Server running at http://localhost:${port}`));
