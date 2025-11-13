import { createI18n } from 'vue-i18n'
import en from '../languages/en.json'
import hr from '../languages/hr.json'
import ru from '../languages/ru.json'
import fr from '../languages/fr.json'
import it from '../languages/it.json'
import de from '../languages/de.json'
import es from '../languages/es.json'
import zh from '../languages/zh.json'
import ko from '../languages/ko.json'
import nl from '../languages/nl.json'
import sv from '../languages/sv.json'
import sl from '../languages/sl.json'

const messages = {
    en,
    hr,
    ru,
    fr,
    it,
    de,
    es,
    zh,
    ko,
    nl,
    sv,
    sl
}

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages
})

export default i18n