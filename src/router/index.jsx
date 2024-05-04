import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { ErrorPage } from '../components/index'
import { CreateDebtPage, DebtsPage, HomePage, Dashboard } from '../pages/index'
const MyRouter = createBrowserRouter([
    {
        path: '/',
        element: <Dashboard />,
        children: [
            {
                path: '',
                element: <HomePage />,
                errorElement: <ErrorPage />,
            },
            {
                path: '/debts',
                element: <DebtsPage />,
                errorElement: <ErrorPage />,
            },
            {
                path: '/create',
                element: <CreateDebtPage />,
                errorElement: <ErrorPage />,
            },
            {
                path: '*',
                element: <ErrorPage />,
            }
        ],
        errorElement: <ErrorPage />,
    },


])

export default MyRouter