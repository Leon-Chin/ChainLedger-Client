import React, { useEffect, useState } from 'react'
import './index.less'
import { FormField } from '@/components';
import { Spin, Upload, message } from 'antd'
import { AiOutlineInbox } from "react-icons/ai";
import { useStorageUpload } from '@thirdweb-dev/react';
import { useStateContext } from '@/context';
import { useNavigate } from 'react-router-dom';
import { navbars } from '@/constants';
import { copyToClipboard, isAddress, shortenAddress } from '@/utils';
import { MdContentCopy } from "react-icons/md";
const { Dragger } = Upload;

const CreateDebtPage = () => {
    const { createDebt, setActiveNavBar, allContacts } = useStateContext()
    console.log("allContacts", allContacts);
    const [debt, setDebt] = useState({
        debtor: '',
        creditor: '',
        amount: 0,
        repaymentDueDate: 0,
        initialEvidenceImages: [],
    });

    useEffect(() => {
        console.log(debt);
    }, [debt])
    const handleFormFieldChange = (fieldName, e) => {
        setDebt({ ...debt, [fieldName]: e.target.value })
    }

    const { mutateAsync: upload } = useStorageUpload()
    const uploadToIpfs = async (file) => {
        const uploadUrl = await upload({
            data: [file],
            options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: true },
        });
        // alert(uploadUrl);
        const index = fileList.indexOf(file);
        fileList[index].fileIPFSUrl = uploadUrl[0];
        const updatedFileList = fileList
        setFileList(updatedFileList)
    };

    const [fileList, setFileList] = useState([]);
    useEffect(() => {
        console.log(fileList);
    }, [fileList])
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

    const navigateTo = useNavigate()
    const [isLoading, setIsLoading] = useState(false);
    const SubmitRecord = async (e) => {
        e.preventDefault();
        if (!(isAddress(debt.debtor) && isAddress(debt.creditor))) {
            message.info('Please enter valid address')
            return
        }
        if (debt.debtor === debt.creditor) {
            message.info('Debtor Address cannot be same as Creditor Address')
            return
        }
        if (!debt.debtor || !debt.creditor || !debt.amount || !debt.repaymentDueDate) {
            message.info('Please fill all the fields correctly')
            return
        }
        if (debt.repaymentDueDate < new Date().getTime()) {
            message.error('Repayment Due Date cannot be in the past')
            return
        }

        setIsLoading(true)
        const imagesUrlList = fileList.map(file => file.fileIPFSUrl)
        console.log(debt.debtor, debt.creditor, debt.amount, debt.repaymentDueDate, imagesUrlList);
        await createDebt(debt.debtor, debt.creditor, debt.amount, debt.repaymentDueDate, imagesUrlList).then(res => {
            console.log(res);
            setIsLoading(false)
            message.success('Debt created successfully')
            navigateTo(navbars['allDebts'].link)
            setActiveNavBar(navbars['allDebts'].link)
        }).catch(err => {
            console.log(err);
            setIsLoading(false)
            message.error('Create debt failed')
        })
    }
    return (
        <div className='create-debt-page' style={{ overflow: 'auto', }}>
            {allContacts?.length !== 0 && <div className='create-debt-page-header'>
                <div style={{ fontFamily: 'Epilogue', fontWeight: '500', fontSize: '14px', lineHeight: '22px', color: '#808191', marginBottom: 10 }}>
                    Recent Users' Address
                </div>
                <section className='create-debt-page-header-address'>
                    <ul className='create-debt-page-header-address-list'>
                        {allContacts && allContacts?.map(contact => <li onClick={async (e) => { e.preventDefault(); await copyToClipboard(contact).then(() => message.success('Copied to clipboard')).catch(() => message.error('Copy failed')) }} key={contact} className='create-debt-page-header-address-list-item white-glassmorphism'>
                            <p>{shortenAddress(contact)}</p>
                            <span className='create-debt-page-header-address-list-item-img' >
                                <MdContentCopy />
                            </span>
                        </li>)}
                    </ul>
                </section>
            </div>}
            <div className='create-debt-page-content blue-glassmorphism'>
                <div className='create-debt-page-content-header'>
                    <h1>Create Debt Record</h1>
                </div>
                <form className='create-debt-page-content-form' onSubmit={SubmitRecord}>
                    <section style={{ display: 'flex', flexWrap: 'wrap', gap: 40 }}>
                        <FormField
                            labelName="Debtor Addresss *"
                            placeholder="Debtor Address"
                            inputType="text"
                            value={debt.debtor}
                            handleChange={(e) => handleFormFieldChange('debtor', e)}
                        />
                        <FormField
                            labelName="Creditor *"
                            placeholder="Creditor"
                            inputType="text"
                            value={debt.creditor}
                            handleChange={(e) => handleFormFieldChange('creditor', e)}
                        />
                    </section>
                    <section style={{ display: 'flex', flexWrap: 'wrap', gap: 40 }}>
                        <FormField
                            labelName="Amount (CHF)*"
                            placeholder="Amount"
                            inputType="number"
                            value={debt.amount}
                            handleChange={(e) => handleFormFieldChange('amount', e)}
                        />
                        <FormField
                            labelName="Repayment Due Date *"
                            placeholder="Repayment Due Date"
                            inputType="date"
                            value={debt.repaymentDueDate}
                            handleChange={(e) => { console.log(e); handleFormFieldChange('repaymentDueDate', e) }}
                        />
                    </section>
                    <section>
                        <div style={{ fontFamily: 'Epilogue', fontWeight: '500', fontSize: '14px', lineHeight: '22px', color: '#808191', marginBottom: 10 }}>Evidence Files (optional)</div>
                        <Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                                <AiOutlineInbox style={{ fontSize: 58 }} />
                            </p>
                            <p className="ant-upload-text">Click or drag file for Debt evidence to this area to upload</p>
                        </Dragger>
                    </section>
                    <section style={{ display: 'flex', justifyContent: 'center' }}>
                        <button type='submit' className='create-debt-page-content-form-submit-btn'>
                            {isLoading ? <Spin /> : "Create Debt"}
                        </button>
                    </section>
                </form>
            </div>
        </div>
    )
}

export default CreateDebtPage