import { useStateContext } from '@/context'
import React, { useEffect, useMemo, useState } from 'react'
import './index.less'
import { shortenAddress } from '@/utils'
import { IoSend } from "react-icons/io5";
import { MdCallReceived } from "react-icons/md";
import { COLORS } from '@/constants';
import dayjs from 'dayjs';
import { Button, Divider, Empty, Modal, Popconfirm, Spin, Steps, Tag, message } from 'antd';
import { FaFileAlt } from "react-icons/fa";
import { saveAs } from 'file-saver';
import Dragger from 'antd/es/upload/Dragger';
import { AiFillDelete, AiOutlineDelete, AiOutlineInbox } from 'react-icons/ai';
import { useStorageUpload } from '@thirdweb-dev/react';
import UserBrief from '@/components/UserBrief';

const STATUS = {
    INITIATE: 0,
    CONFIRMED: 1,
    REPAID: 2,
}

const RepayingSection = ({ debt }) => {
    const { repayDebt, confirmSettledDebt } = useStateContext()
    const { mutateAsync: upload } = useStorageUpload()
    const [fileList, setFileList] = useState([]);
    const uploadToIpfs = async (file) => {
        const uploadUrl = await upload({
            data: [file],
            options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: true },
        });
        const index = fileList.indexOf(file);
        fileList[index].fileIPFSUrl = uploadUrl[0];
        const updatedFileList = fileList
        setFileList(updatedFileList)
    };

    const props = {
        name: 'file',
        multiple: true,
        beforeUpload: (file) => {
            setFileList([...fileList, file]);
            return false;
        },
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        onDrop(e) {
            setFileList([...fileList, ...e.dataTransfer.files]);
            console.log('Dropped files', e.dataTransfer.files);
        },
    };
    useEffect(() => {
        fileList.forEach(file => {
            console.log("file1", file);
            if (file?.fileIPFSUrl) {
                return
            } else {
                uploadToIpfs(file)
            }
        })
    }, [fileList])


    const [settleLoading, setSettleLoading] = useState(false)

    const repay = async () => {
        setSettleLoading(true)
        const currentDateTimeStamp = new Date().getTime()
        const fileURLs = fileList.map(file => file.fileIPFSUrl)
        await repayDebt(debt.id, currentDateTimeStamp, fileURLs).then(res => {
            console.log(res);
            message.success("Repay Successfully!")
            setModalOpen(false)
            setSettleLoading(false)
        }).catch(err => {
            setModalOpen(false)
            setSettleLoading(false)
        })
    }
    const [loading, setLoading] = useState(false)
    const settledConfirm = async () => {
        setLoading(true)
        await confirmSettledDebt(debt.id).then(res => {
            console.log(res);
            setLoading(false)
            message.success("Confirm Successfully!")
        }).catch(err => {
            console.log(err);
            setLoading(false)
            message.error("Confirm Failed!")
        })
    }
    const SettleButton = ({ debt }) => {
        if (debt.debtorSettledConfirmed && debt.creditorSettledConfirmed) {
            return <Button disabled>Settled</Button>
        } else if (debt.repaymentDate) {
            if (debt.isDebtor) {
                return <Button disabled>Awaiting Creditor's Confirmation</Button>
            } else {
                return <Button loading={loading} onClick={settledConfirm}>Confirm</Button>
            }
        } else if (debt.isDebtor) {
            return <Button onClick={() => setModalOpen(true)}>Repay</Button>
        } else {
            return <Button>Awaiting Repay</Button>
        }
    }

    const [modalOpen, setModalOpen] = useState(false)
    const SaveFile = async (fileURL) => {
        fileURL && await fetch(fileURL).then(res => res.blob()).then(blob => {
            saveAs(blob)
        })
    }
    return <>
        <Divider plain>Repaying Stage</Divider>
        <div className='all-debts-page-section-debt-content'>
            <div className='all-debts-page-section-debt-content-initialFile'>
                {debt?.settledEvidenceFiles && debt?.settledEvidenceFiles.length !== 0 && <div className='all-debts-page-section-debt-content-initialFile-title'>
                    Settled Files ({debt?.settledEvidenceFiles?.length}) :
                </div>}
                <div className='all-debts-page-section-debt-content-initialFile-files'>
                    {debt?.settledEvidenceFiles?.map((file, index) => (
                        <>
                            <Tag onClick={() => SaveFile(file)} className='all-debts-page-section-debt-content-initialFile-files-file' key={index}>
                                <FaFileAlt />
                                <p>Settle File {index + 1}</p>
                            </Tag>
                        </>
                    ))}
                </div>
            </div>
            <div className='all-debts-page-section-debt-content-status'>
                <SettleButton debt={debt} />
            </div>
        </div>
        <Modal
            title="Repay"
            open={modalOpen}
            confirmLoading={settleLoading}
            onCancel={() => setModalOpen(false)}
            onOk={repay}
            okText="Repay"
        >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <section>
                    <div style={{ fontFamily: 'Epilogue', fontWeight: '500', fontSize: '14px', lineHeight: '22px', color: '#808191', marginBottom: 10 }}>Evidence Files</div>
                    <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                            <AiOutlineInbox style={{ fontSize: 58 }} />
                        </p>
                        <p className="ant-upload-text">Click or drag file for Debt evidence to this area to upload</p>
                    </Dragger>
                </section>
            </div>
        </Modal>
    </>
}

const InitiatialConfirmSection = ({ debt }) => {
    const { confirmDebt } = useStateContext()
    const [loading, setLoading] = useState(false)
    const Confirm = async (debtID) => {
        setLoading(true)
        await confirmDebt(debtID).then(res => {
            console.log(res);
            setLoading(false)
        }).catch(err => {
            console.log(err);
            setLoading(false)
        })
    }
    const SaveFile = async (fileURL) => {
        fileURL && await fetch(fileURL).then(res => res.blob()).then(blob => {
            saveAs(blob)
        })
    }
    const ConfirmButton = ({ debt }) => {
        if (debt.creditorInitiateConfirmed && debt.debtorInitiateConfirmed) {
            return <Button disabled>Confirmed</Button>
        } else if ((debt.isDebtor && debt.debtorInitiateConfirmed) || (!debt.isDebtor && debt.creditorInitiateConfirmed)) {
            return <Button disabled>Awaiting Confirmation</Button>
        } else {
            return <Button onClick={() => {
                Confirm(debt.id)
            }} loading={loading}>Confirm</Button>
        }
    }
    return <>
        <Divider plain>Confirming Stage</Divider>
        <div className='all-debts-page-section-debt-content'>
            <div className='all-debts-page-section-debt-content-initialFile'>
                {debt?.initialEvidenceFiles && debt?.initialEvidenceFiles.length !== 0 && <div className='all-debts-page-section-debt-content-initialFile-title'>
                    Initial Files ({debt?.initialEvidenceFiles?.length}) :
                </div>}
                <div className='all-debts-page-section-debt-content-initialFile-files'>
                    {debt?.initialEvidenceFiles?.map((file, index) => (
                        <>
                            <Tag onClick={() => SaveFile(file)} className='all-debts-page-section-debt-content-initialFile-files-file' key={index}>
                                <FaFileAlt />
                                <p>Initial File {index + 1}</p>
                            </Tag>
                        </>
                    ))}
                </div>
            </div>
            <div className='all-debts-page-section-debt-content-status'>
                <ConfirmButton debt={debt} key={"Button_index"} />
            </div>
        </div>
    </>
}

const DebtCard = ({ debt, index }) => {
    const { removeDebt } = useStateContext()
    const isFinished = useMemo(() => debt.creditorSettledConfirmed && debt.debtorSettledConfirmed, [debt])
    const currentState = useMemo(() => {
        if (debt.repaymentDate) {
            return STATUS.REPAID
        } else if (debt.creditorInitiateConfirmed && debt.debtorInitiateConfirmed) {
            return STATUS.CONFIRMED
        } else {
            return STATUS.INITIATE
        }
    }, [debt])

    const Progress = () => {
        return <Steps
            current={currentState}
            items={[
                {
                    title: currentState > STATUS.INITIATE ? 'Confirmed' : 'Confirming',
                    description: currentState > STATUS.INITIATE ? 'Both confirmed' : "Waiting for the other party to confirm",
                },
                {
                    title: currentState > STATUS.CONFIRMED ? 'Repaid' : "In Progress",
                    description: currentState > STATUS.CONFIRMED ? "Repaid the debt" : "Waiting for the other party to repay",
                },
                {
                    title: isFinished ? 'Finished' : "Finish",
                    description: isFinished ? "Finished the debt" : (debt?.isDebtor ? "Waiting for the other party to confirm" : "Waiting for your confirmation"),
                },
            ]}
        />
    }
    const [deleteLoading, setDeleteLoading] = useState(false)
    const deleteDebt = async () => {
        setDeleteLoading(true)
        await removeDebt(debt.id).then(res => {
            message.success("Debt Deleted Sucessfully!")
            setDeleteLoading(false)
        }).catch(err => {
            message.error("Debt Deletion Failed!")
            setDeleteLoading(false)
            console.log(err);
        })
    }
    return <div className='all-debts-page-section-debt white-glassmorphism' key={index}>
        <Spin spinning={deleteLoading} tip="Loading..." >
            <div className='all-debts-page-section-debt-header'>
                <div className='all-debts-page-section-debt-header-BriefInfo'>
                    <div className='all-debts-page-section-debt-header-BriefInfo-icon' style={{ backgroundColor: debt.isDebtor ? COLORS.red : COLORS.green }}>
                        {debt.isDebtor ? <MdCallReceived style={{ fontSize: 20 }} /> : <IoSend style={{ fontSize: 16 }} />}
                    </div>
                    <div style={{ color: COLORS.darkGray }}>
                        <UserBrief contactAddress={debt.oppositeParty} />
                    </div>
                    <div>
                        Amount (CHF): {debt.amount}
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className='all-debts-page-section-debt-header-date'>
                        Due Date : {dayjs(debt.repaymentDueDate).format('DD/MM/YYYY')}
                    </div>
                    <div style={{ cursor: 'pointer' }}>
                        <Popconfirm
                            title="Are you sure delete this debt record?"
                            onConfirm={deleteDebt}
                            okText="Yes"
                            cancelText="No"
                        >
                            <AiFillDelete style={{ color: COLORS.darkGray }} />
                        </Popconfirm>
                    </div>
                </div>
            </div>
            <section style={{ display: 'flex', justifyContent: 'center', marginTop: 16, padding: 20 }}>
                <Progress />
            </section>
            <InitiatialConfirmSection debt={debt} />
            {currentState >= STATUS.CONFIRMED && <RepayingSection debt={debt} />}
        </Spin>
    </div >
}

const EmptyCard = ({ }) => {
    return <div className='all-debts-page-section-debt white-glassmorphism' style={{ padding: 20 }}>
        <Empty description="No Debt" />
    </div >
}



const AllDebtsPage = () => {
    const { myDebts } = useStateContext()
    console.log(myDebts);
    return (
        <div className='all-debts-page'>
            <div className='all-debts-page-header'>
                <h1>All Debts</h1>
            </div>
            <section className='all-debts-page-section'>
                {myDebts && myDebts.map((debt, index) => (<DebtCard debt={debt} key={index} />))}
                {(myDebts && myDebts?.length === 0) && <EmptyCard />}
            </section>
        </div>
    )
}



export default AllDebtsPage