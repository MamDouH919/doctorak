import translation from './translation.json';
import navDrawer from './navDrawer.json';
import website from './website.json';

const en = {
    ...translation,
    navDrawer: {
        ...navDrawer,
    },
    website: {
        ...website,
    }
}

export default en