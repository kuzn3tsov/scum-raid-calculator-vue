import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faBomb,
    faCopy,
    faGlobe,
    faCalculator,
    faLanguage,
    faShareAlt,
    faSun,
    faMoon,
    faArrowLeft,
    faUser,
    faEnvelope,
    faDownload,
    faExpand,
    faCompress,
    faChevronRight,
    faChevronDown,
    faPaperPlane,
    faHandsHelping,
    faTimes,
    faGear,
    faShieldHalved,
    faCube,
    faRotateLeft,
    faCircleInfo,
    faLock,
    faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
    faBomb,
    faCopy,
    faGlobe,
    faCalculator,
    faLanguage,
    faShareAlt,
    faSun,
    faMoon,
    faArrowLeft,
    faUser,
    faEnvelope,
    faDownload,
    faExpand,
    faCompress,
    faChevronRight,
    faChevronDown,
    faPaperPlane,
    faHandsHelping,
    faTimes,
    faGear,
    faShieldHalved,
    faCube,
    faRotateLeft,
    faCircleInfo,
    faLock,
    faTriangleExclamation
)

const app = createApp(App)
app.use(i18n)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')