// Import utility functions
import {
  getResourceId,
  processBodyFromRequest,
  returnErrorWithMessage,
} from "./utils.js";
import pg from "pg";
const { Client } = pg;

export const createProduct = async (req, res) => {
  try {
    const body = await processBodyFromRequest(req); // This utility function gets the body for you
    if (!body) return returnErrorWithMessage(res, 400, 'Body is required');
    const parsedBody = JSON.parse(body); 
    const client = new Client({
      connectionString: process.env.PG_URI
    });
    await client.connect();
    const results = await client.query(
      'INSERT INTO products (name, description, price, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
      [parsedBody.name, parsedBody.description, parsedBody.price, parsedBody.created_at, parsedBody.updated_at]
    );
    console.log(results);
    await client.end();
    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(results.rows[0]));
  } catch (error) {
    console.error('Error creating product: ', error);
    returnErrorWithMessage(res);
  }
};

export const getProducts = async (req, res) => {
  try {
    const client = new Client({ connectionString: process.env.PG_URI });

    await client.connect();
    const results = await client.query("SELECT * FROM products;");
    console.log(results) 
    await client.end();
    
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: 'products fetched' }));
  } catch (error) {
    console.error("Error fetching products: ", error);
    returnErrorWithMessage(res);
  }
};

export const getProductById = async (req, res) => {
  try {
    const id = getResourceId(req.url);
    const client = new Client({
      connectionString: process.env.PG_URI
    });
    await client.connect();
    const results = await client.query('SELECT * FROM products WHERE id = $1;', [id]);
    await client.end();
    if (!results.rowCount) return returnErrorWithMessage(res, 404, 'Product not found');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(results.rows[0]));
  } catch (error) {
    console.error('Error fetching product: ', error);
    returnErrorWithMessage(res);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const id = getResourceId(req.url);
    const body = await processBodyFromRequest(req);
    if (!body) return returnErrorWithMessage(res, 400, 'Body is required');
    const parsedBody = JSON.parse(body);
    const client = new Client({
      connectionString: process.env.PG_URI
    });
    await client.connect();
    const results = await client.query(
      'UPDATE products SET name = $1, image = $2, description = $3, category = $4, price = $5, stock = $6 WHERE id = $7 RETURNING *;',
      [parsedBody.name, parsedBody.image, parsedBody.description, parsedBody.category, parsedBody.price, parsedBody.stock, id]
    );
    await client.end();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(results.rows[0]));
  } catch (error) {
    console.error('Error updating product: ', error);
    returnErrorWithMessage(res);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = getResourceId(req.url);
    const client = new Client({
      connectionString: process.env.PG_URI
    });
    await client.connect();
    await client.query('DELETE FROM products WHERE id = $1;', [id]);
    await client.end();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'product deleted successfully' }));
  } catch (error) {
    console.error('Error deleting product: ', error);
    returnErrorWithMessage(res);
  }
};
