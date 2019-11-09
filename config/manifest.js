require("./mongoDB")
var LANGUAGES = "en,hi"
var DEFAULT_LANGUAGE = "hi"

const envKey = key => {
  const env = process.env.NODE_ENV || 'development';

  const configuration = {
    development: {
      host: 'localhost',
      port: 8000
    },
    uat: {
      host: 'localhost',
      port: 8010
    },
    // These should match environment variables on hosted server
    production: {
      host: process.env.HOST,
      port: process.env.PORT
    }
  };

  return configuration[env][key];
};

const manifest = {

  connections: [
    {
      host: envKey('host'),
      port: envKey('port'),
      routes: {
        cors: true
      },
      router: {
        stripTrailingSlash: true
      }
    }
  ],
  registrations: [
    {
      plugin: 'hapi-auth-jwt2'
    },
    {
      plugin: './auth'
    },
    {
      plugin: {
        register: 'good',
        options: {
          ops: { interval: 60000 },
          reporters: { console: [{ module: 'good-console' }, 'stdout'] }
        }
      }
    },
    {
      plugin: 'inert'
    },
    {
      plugin: 'vision'
    },
    {
      plugin: {
        register: 'hapi-swagger',
        options: {
          grouping: 'tags',
          payloadType: 'form'
        },
      }
    },
    {
      plugin: './api'
      // , options: { routes: { prefix: '/api' } }
    },
    {
      plugin: {
        register: 'hapi-i18n',
        options: {
          locales: ["hi", "en"],
          directory: __dirname+'/locales',
          languageHeaderField: 'lang',
          defaultLocale: "en"
        }
      }
    }
  ]
};

module.exports = manifest;