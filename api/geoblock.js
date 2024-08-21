export const config = {
  runtime: 'edge',
};

const blockedCountries = [
  'KP',
];

function isGeoblocked(req) {
  // https://vercel.com/docs/concepts/edge-network/headers#x-vercel-ip-country
  const countryCode = req.headers.get('x-vercel-ip-country')
  return blockedCountries.includes(countryCode)
}

export default (req) => {
  return new Response(null, { status: isGeoblocked(req) ? 403 : 200 })
};
