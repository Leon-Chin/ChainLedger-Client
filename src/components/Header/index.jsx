import React, { useEffect, useState } from 'react'
import { ConnectWallet } from '@thirdweb-dev/react';
import { useStateContext } from '../../context';
import { IoMenu } from "react-icons/io5";
import { Drawer } from 'antd'
import './index.less'
import { useNavigate } from 'react-router-dom';
import { navItem } from '@/constants/index'

const Header = () => {
    const { isConnected, activeNav, setActiveNavBar } = useStateContext()
    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            // 设置滚动超过一定距离时添加阴影
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        // 添加滚动监听
        window.addEventListener('scroll', handleScroll);

        // 组件卸载时移除监听器
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const [open, setOpen] = useState(false);
    const navigateTo = useNavigate()

    return (
        <div className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
            <div style={{ fontSize: 26, fontWeight: 500, }}>Chain Ledger</div>
            <div className='header-right'>
                {isConnected && <div className='header-navigations' >
                    {
                        navItem.map((item, index) => (
                            <li className={`header-navigations-navItem ${activeNav === item.link ? 'active' : ''}`} key={index} style={{ marginRight: 10 }}>
                                <a href="#" onClick={(e) => {
                                    e.preventDefault();
                                    setActiveNavBar(item.link)
                                    navigateTo(item.link)
                                }} style={{ textDecoration: 'none' }}>{item.name}</a>
                            </li>
                        ))
                    }
                </div>}
                <ConnectWallet style={isConnected ? {} : { backgroundColor: '#73c895', borderRadius: 20, fontWeight: 'bold', fontSize: 18, color: '#fff' }} btnTitle='Login' theme={"dark"} />
                <div className='header-navigations-mobile-icon' onClick={() => setOpen(true)} style={{ cursor: 'pointer' }}>
                    <IoMenu fontSize={36} />
                </div>
                <Drawer onClose={() => setOpen(false)} open={open}>
                    <div className='header-navigations-mobile' >
                        {navItem.map((item, index) => (
                            <li className={`header-navigations-mobile-navItem`} onClick={(e) => {
                                e.preventDefault();
                                setActiveNavBar(item.link)
                                navigateTo(item.link)
                            }} key={index} style={{ marginRight: 10 }}>
                                <a href="#" style={{ color: '#fff', textDecoration: 'none' }}>{item.name}</a>
                            </li>
                        ))}
                    </div>
                </Drawer>
            </div>
        </div >
    )
}

export default Header