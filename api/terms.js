import postgres from 'pg';
const { Pool } = postgres;

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
};

const terms = async (request, response) => {
  // Directly respond to GET or POST requests without checking the URL pattern, wallet, or version.
  if (request.method === 'GET' || request.method === 'POST') {
    return response.status(200).send({ success: true, message: "Terms requirement disabled." });
  }
  // Respond with Bad Request if the method is not GET or POST.
  return response.status(400).send('Bad Request');
};

export default async function(request, response) {
  return allowCors(terms)(request, response);
}
