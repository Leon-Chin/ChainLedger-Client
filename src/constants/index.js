const navbars = {
    home: {
        name: 'Home',
        link: '/'
    },
    allDebts: {
        name: 'All Debts',
        link: '/debts'
    },
    create: {
        name: 'Create',
        link: '/create'
    }
}
const navItem = [
    navbars['home'],
    navbars['allDebts'],
    navbars['create']
]

const COLORS = {
    red: '#d4583b',
    green: '#5bbc7a',
    darkGray: '#808191'
}

export { navbars, navItem, COLORS }