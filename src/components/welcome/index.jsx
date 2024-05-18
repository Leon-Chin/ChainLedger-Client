import React, { useState } from 'react'
import './index.less'
import { COLORS } from '@/constants';
import { userFriendlyICON, realTimeICON, responsiveICON, secureICON } from '@/assets/Images';

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
                    Debt Record
                </div>
                <div style={{}}>
                    Explore the Chain Ledger. Record your debt record easily on Chain Ledger.
                </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <ServiceCard color={"#2952E3"} title={"User-Friendly Interface"} icon={<img src={userFriendlyICON} style={{ width: 30 }} />} subtitle={"Simple and intuitive design for effortless navigation."} />
                <ServiceCard color={"#8945F8"} title={"Real-Time Updates"} icon={<img src={realTimeICON} style={{ width: 30 }} />} subtitle={"Instant transaction recording and verification."} />
                <ServiceCard color={"#F84550"} title={"Secure and Transparent"} icon={<img src={secureICON} style={{ width: 30 }} />} subtitle={"Blockchain technology ensures the highest security and transparency."} />
                <ServiceCard color={COLORS.green} title={"Responsive UI"} icon={<img src={responsiveICON} style={{ width: 30 }} />} subtitle={"Fully responsive design for optimal user experience on all devices."} />
            </div>
        </div>
    )
}

export default Welcome