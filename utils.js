/**
 * Sends an error response with a specified status code and message.
 *
 * @param {Object} res - The response object.
 * @param {number} code - The status code of the response. Defaults to 500 if not provided.
 * @param {string} message - The error message to be sent. Defaults to 'Internal Server Error' if not provided.
 * @returns {void}
 * @example returnErrorWithMessage(res, 404, 'Resource Not Found');
 */
export const returnErrorWithMessage = (res, code, message) => {
  res.statusCode = code || 500;
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify({ message: message || 'Internal Server Error' }));
};

/**
 * Processes the body from a request object.
 *
 * @param {http.IncomingMessage} req - The request object.
 * @returns {Promise<string>} A promise that resolves with the body of the request.
 */
export const processBodyFromRequest = req =>
  new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });

/**
 * Creates a regular expression pattern for a given resource.
 *
 * @param {string} resource - The resource to create the regular expression for.
 * @returns {RegExp} - The regular expression pattern.
 * @example regex('/products') => /^\/products\/[a-zA-Z0-9]+$/
 */
export const regex = resource => new RegExp(`^${resource}\/[a-zA-Z0-9]+$`);

/**
 * Get the resource ID from the given URL.
 *
 * @param {string} url - The URL from which to extract the resource ID.
 * @returns {string} The extracted resource ID.
 * @example getResourceId('/products/123') => '123'
 */
export const getResourceId = url => url.split('/')[2];
