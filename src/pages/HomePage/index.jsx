import React from 'react'
import './index.less'
import { useStateContext } from '@/context'
import { MdCallReceived, MdContentCopy, MdPermContactCalendar } from "react-icons/md";
import { copyToClipboard, shortenAddress } from '@/utils';
import { Button, Empty, message } from 'antd';
import { Card, Col, Row, Statistic } from 'antd';
import { FiFileText } from "react-icons/fi";
import { IoSend } from 'react-icons/io5';
import { FaAngleRight } from 'react-icons/fa';
import { COLORS, navbars } from '@/constants';
import dayjs from 'dayjs';
import ReactEcharts from "echarts-for-react";
import { useNavigate } from 'react-router-dom';

const ContactCard = () => {
    const { allContacts } = useStateContext()
    return <section className='home-page-content-area-card white-glassmorphism'>
        <div className='home-page-content-area-card-title'>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className='home-page-content-area-card-title-icon' style={{ backgroundColor: '#5e8ff2' }}>
                    <MdPermContactCalendar style={{ fontSize: 18 }} />
                </div>
                <div className='home-page-content-area-card-title-text'>Contact</div>
            </div>
            <div>
                {allContacts?.length}
            </div>
        </div>
        <div className='home-page-content-area-card-content'>
            <section className='contact-card-address'>
                <ul className='contact-card-address-list'>
                    {allContacts?.map(contact => <li
                        onClick={async (e) => {
                            e.preventDefault();
                            await copyToClipboard(contact)
                                .then(() => message.success('Copied to clipboard'))
                                .catch(() => message.error('Copy failed'))
                        }} key={contact} className='contact-card-address-list-item blue-glassmorphism'>
                        <p>{shortenAddress(contact, true)}</p>
                        <span className='contact-card-address-list-item-img' >
                            <MdContentCopy />
                        </span>
                    </li>)}
                    {allContacts?.length === 0 && <Empty description="No contact found" />}
                </ul>
            </section>
        </div>
    </section>
}
const AllDebtOverview = ({ }) => {
    const { myDebts, setActiveNavBar } = useStateContext()
    const navigateTo = useNavigate()
    return <div className='AllDebtOverview'>
        <div className='AllDebtOverview-header'>
            <div className='AllDebtOverview-header-title'>
                <div className='AllDebtOverview-header-title-icon' style={{ backgroundColor: '#5bbc7a' }}>
                    <FiFileText style={{ fontSize: 20 }} />
                </div>
                <div>All Debts: </div>
                <div>{myDebts?.length}</div>
            </div>
            <div className='AllDebtOverview-header-Nav'>
                <Button
                    onClick={() => {
                        setActiveNavBar(navbars.allDebts.link)
                        navigateTo(navbars.allDebts.link)
                    }}
                    style={{ display: 'flex', alignItems: 'center' }}
                >
                    Detail <FaAngleRight style={{ fontSize: 16 }} />
                </Button>
            </div>
        </div>
        <div className='AllDebtOverview-content'>
            {myDebts?.map((debt, index) => (<div className='all-debts-page-section-debt-header blue-glassmorphism' key={index} style={{ padding: 10, marginBottom: 10 }}>
                <div className='all-debts-page-section-debt-header-BriefInfo'>
                    <div className='all-debts-page-section-debt-header-BriefInfo-icon' style={{ backgroundColor: debt.isDebtor ? COLORS.red : COLORS.green }}>
                        {debt.isDebtor ? <MdCallReceived style={{ fontSize: 20 }} /> : <IoSend style={{ fontSize: 16 }} />}
                    </div>
                    <div style={{ color: COLORS.darkGray }}>
                        {shortenAddress(debt.oppositeParty)}
                    </div>
                    <div>
                        Amount (CHF): {debt.amount}
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className='all-debts-page-section-debt-header-date'>
                        Due Date : {dayjs(debt.repaymentDueDate).format('DD/MM/YYYY')}
                    </div>
                </div>
            </div>))}
            {myDebts?.length === 0 && <Empty />}
        </div>
    </div>
}
const PieChartOptions = (credit, debt) => ({
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '5%',
        left: 'center',
        textStyle: {
            color: COLORS.darkGray
        }
    },
    series: [
        {
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            padAngle: 5,
            itemStyle: {
                borderRadius: 10,
                borderColor: COLORS.darkGray,
                borderWidth: 2
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: false,
                    fontSize: 40,
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [
                { value: credit, name: 'Current Credit' },
                { value: debt, name: 'Current Debt' },
            ]
        }
    ]
});
const StatisticsCard = () => {
    const { myTotalCreditOwed, myTotalDebtOwed } = useStateContext()
    return <section className='home-page-content-area-card white-glassmorphism'>
        <Row gutter={16}>
            <Col span={12}>
                <Card bordered={false}>
                    <Statistic
                        title="Current Debt"
                        value={myTotalDebtOwed}
                        precision={2}
                        valueStyle={{
                            color: COLORS.red,
                        }}
                        prefix={<MdCallReceived style={{ fontSize: 20 }} />}
                    />
                </Card>
            </Col>
            <Col span={12}>
                <Card bordered={false}>
                    <Statistic
                        title="Current Credit"
                        value={myTotalCreditOwed}
                        precision={2}
                        valueStyle={{
                            color: COLORS.green,
                        }}
                        prefix={<IoSend style={{ fontSize: 16 }} />}
                    />
                </Card>
            </Col>
        </Row>
        <div>
            <ReactEcharts option={PieChartOptions(myTotalCreditOwed, myTotalDebtOwed)} />
        </div>
    </section>
}
const HomePage = () => {
    return (
        // white-glassmorphism
        <div className='home-page'>
            <section className='home-page-content'>
                <section className='home-page-content-area white-glassmorphism'>
                    <AllDebtOverview />
                </section>
                <section className='home-page-content-area'>
                    {/* Contact number */}
                    <ContactCard />
                    {/* Nearlest Record */}
                    <StatisticsCard />
                </section>
            </section>
        </div>
    )
}

export default HomePage