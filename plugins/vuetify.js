import Vue from 'vue'
import Vuetify, {
  VSnackbar,
  VIcon,
  VDialog,
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VSpacer,
  VBtn,
  VToolbar,
  VToolbarTitle,
  VAlert
} from 'vuetify/lib'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  theme: {
    primary: "#f5b623",
    accent: "#cc0000",
    secondary: colors.amber.darken3,
    info: colors.teal.lighten1,
    warning: colors.amber.base,
    error: colors.deepOrange.accent4,
    success: colors.green.accent3
  },
  components: {
    VSnackbar,
    VIcon,
    VDialog,
    VCard,
    VCardTitle,
    VCardText,
    VCardActions,
    VSpacer,
    VBtn,
    VToolbar,
    VToolbarTitle,
    VAlert
  }
})
