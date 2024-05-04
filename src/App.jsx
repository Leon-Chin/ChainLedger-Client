import React from 'react'
import MyRouter from './router';
import { RouterProvider } from 'react-router-dom';

function App() {
    return (
        <RouterProvider router={MyRouter} />
    )
}

export default App