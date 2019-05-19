const pkg = require('./package')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const api = require("./api/index")

module.exports = {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: "독립출판물 아카이빙",
    htmlAttrs: {
      lang: 'ko',
    },
    // script: [{
    //   src: "https://sdk.amazonaws.com/js/aws-sdk-2.384.0.min.js"
    // }],
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: pkg.description
      }
    ],
    link: [{
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },

  /*
   ** Global CSS
   */
  css: [
    '~/assets/style/app.styl',
    '~/assets/style/style.scss'
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/vuetify',
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
    'vuetify-dialog/nuxt'
  ],

  // scss 처리
  // styleResources: {
  //   scss: [
  //     './assets/style/style.scss'
  //   ]
  // },

  // vuetify-dialog
  vuetifyDialog: {
    property: '$dialog',
    confirm: {}
    // ...
  },

  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
   ** Build configuration
   */
  build: {
    vendor: ['browser-image-resizer'],
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ['~assets/style/variables.styl']
      }
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },

  serverMiddleware: [
    // Will register redirect-ssl npm package
    // 'redirect-ssl',

    // Will register file from project api directory to handle /api/* requires
    api
  ]
}
