import React from 'react'
import { useStateContext } from '@/context';
import { Header, Welcome } from '@/components/index';
import { Outlet } from 'react-router-dom';

function Dashboard() {
    const { isConnected } = useStateContext()
    return (
        <div className='background-gradient' style={{ position: 'relative', minHeight: "100vh" }}>
            {/* header */}
            <Header />
            {!isConnected && <Welcome />}
            {/*  */}
            {isConnected && <Outlet />}
        </div>
    )
}

export default Dashboard