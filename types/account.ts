
export interface Social {
    type: string,
    link: string
}

export interface Videos {
    type: string,
    link: string
}

export interface CreateAccount {
    title: string,
    siteName: string,
    phone: string,
    whatsApp: string,
    description: string,
    color: string,
    lang: string,
    about: string,
    domain: string,
    userId: string,
    social: Social[],
    videos: Videos[],
    showInHomePage: boolean,
    isPremiumAccount: boolean,
    appointments: {
        day: string,
        timeFrom: string | Date,
        timeTo: string | Date,
        checked?: boolean
    }[]
}