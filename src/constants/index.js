const navbars = {
    home: {
        name: 'Home',
        link: '/'
    },
    allDebts: {
        name: 'Debts',
        link: '/debts'
    },
    create: {
        name: 'Create',
        link: '/create'
    },
    profile: {
        name: 'Profile',
        link: '/profile'
    }
}
const navItem = [
    navbars['home'],
    navbars['allDebts'],
    navbars['create'],
    navbars['profile']
]

const COLORS = {
    red: '#d4583b',
    green: '#5bbc7a',
    darkGray: '#808191'
}

export { navbars, navItem, COLORS }