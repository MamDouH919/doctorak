import translation from './translation.json';
import navDrawer from './navDrawer.json';
import website from './website.json';
import breadCrumb from './breadCrumb.json';
import adminPages from './adminPages.json';
import common from './common.json';
import validation from './validation.json';

const en = {
    ...translation,
    navDrawer: {
        ...navDrawer,
    },
    website: {
        ...website,
    },
    breadCrumb: {
        ...breadCrumb,
    },
    adminPages: {
        ...adminPages,
    },
    common: {
        ...common,
    },
    validation: {
        ...validation,
    }
}

export default en