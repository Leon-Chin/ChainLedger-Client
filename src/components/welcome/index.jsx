import React, { useState } from 'react'
import './index.less'
const ServiceCard = ({ color, title, icon, subtitle }) => {
    const [isHover, setIsHover] = useState(false)
    return (
        <div
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            className="white-glassmorphism"
            style={{
                display: 'flex',
                cursor: 'pointer',
                maxWidth: 560,
                width: '80%',
                padding: "0.75rem",
                margin: "0.5rem",
                justifyContent: 'start',
                alignItems: 'center',
                boxShadow: isHover ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 20px 50px -10px rgba(0, 0, 0, 0.1)' : ""
            }}
        >
            <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: color }}>
                {icon}
            </div>
            <div style={{ marginLeft: 16, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <p style={{ marginTop: 6, fontSize: 20 }}>{title}</p>
                <p style={{ marginTop: 10, marginBottom: 6, fontSize: 14, width: '90%' }}>{subtitle}</p>
            </div>
        </div>
    )
};
function Welcome() {
    return (
        <div className='Welcome-container'>
            <div style={{ flex: 1, margin: 30, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'start' }}>
                <div className='text-gradient' style={{ fontSize: 52, marginBottom: 20 }}>
                    Record your <br />
                    Debit Record
                </div>
                <div style={{}}>
                    Explore the crypto world. Buy and sell cryptocurrencies easily on Krypto.
                </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <ServiceCard color={"#2952E3"} title={"Buy"} icon={<i className="fa-solid fa-dollar-sign"></i>} subtitle={" sdfa fdsafsda dsfasdfasddgasdsagas  dfasdfasddsafdsafasdfasdfdsafasdf "} />
                <ServiceCard color={"#8945F8"} title={"Buy"} icon={<i className="fa-solid fa-dollar-sign"></i>} subtitle={" sdfa fdsafsda dsfasdfasddgasdsagas  dfasdfasddsafdsafasdfasdfdsafasdf "} />
                <ServiceCard color={"#F84550"} title={"Buy"} icon={<i className="fa-solid fa-dollar-sign"></i>} subtitle={" sdfa fdsafsda dsfasdfasddgasdsagas  dfasdfasddsafdsafasdfasdfdsafasdf "} />
            </div>
        </div>
    )
}

export default Welcome