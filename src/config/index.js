const isProd = process.env.NODE_ENV === 'production';

const serverUrl = {};
const debugServerUrl = {
  adminUrl: '/wadmin',
};

export default {
  serverUrl: isProd ? serverUrl : debugServerUrl,
};
