import React, { useState } from 'react'
import "./index.less"
import { useStateContext } from '@/context'
import { Avatar, Button, Form, Input, Modal, Upload, message } from 'antd'
import { FaUser } from "react-icons/fa";
import { FiUpload } from 'react-icons/fi';
import { storage } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
const { TextArea } = Input
const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

const ProfilePage = () => {
    const { userInfo, update, register } = useStateContext()
    console.log("userInfo", userInfo);
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const formref = React.useRef();
    const [updatedAvator, setUpdatedAvator] = useState(userInfo?.avator ? [{ uid: 0, name: 'avatar', status: 'done', url: userInfo?.avator, thumbUrl: userInfo?.avator }] : [])
    const propsImage = {
        onRemove: (file) => {
            const index = updatedAvator.indexOf(file);
            const newFileList = updatedAvator.slice();
            newFileList.splice(index, 1);
            setUpdatedAvator(newFileList);
        },
        beforeUpload: (file) => {
            const isImage = file.type?.startsWith('image')
            if (isImage) {
                updatedAvator.push({ ...file, name: file.name })
                setUpdatedAvator(updatedAvator)
            } else {
                message.error("Should Be a Picture")
                return false
            }
        },
        fileList: updatedAvator,
    };
    const submitImageToFirebase = ({ file }) => {
        setLoading(true)
        if (file) {
            const storageRef = ref(storage, `avatar-${parseInt((new Date().getTime() / 1000).toString())}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                const handledBlogImgs = updatedAvator.map(item => {
                    if (item.uid === file.uid) {
                        return { ...file, status: 'uploading', percent: progress }
                    }
                    return item
                })
                setUpdatedAvator(handledBlogImgs)
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running', progress);
                        break;
                }
            },
                (error) => {
                    message.err('Some error happens')
                    updatedAvator.map(item => {
                        if (item.uid === file.uid) {
                            return { ...file, status: 'error' }
                        }
                        return item
                    })
                    setUpdatedAvator(updatedAvator)
                    setLoading(false)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        const handledBlogImgs = updatedAvator.map(item => {
                            if (item.uid === file.uid) {
                                return { ...file, status: 'done', url: downloadURL, thumbUrl: downloadURL, name: file.name }
                            }
                            return item
                        })
                        setUpdatedAvator(handledBlogImgs)
                    });
                    setLoading(false)
                }
            );
        } else {
            message.err('Some error happens')
            updatedAvator.map(item => {
                if (item.uid === file.uid) {
                    return item = { ...file, status: 'error' }
                }
                return item
            })
            setUpdatedAvator(updatedAvator)
            setLoading(false)
        }
    }
    const onFinish = async (items) => {
        setLoading(true)
        let handledItems = { ...items, avatar: updatedAvator[0]?.url ? updatedAvator[0]?.url : "" }
        console.log("handledItems", handledItems);
        try {
            if (userInfo?.name) {
                await update(handledItems.name, handledItems.avatar, handledItems.description).then(res => {
                    setLoading(false)
                    message.success("Updated")
                    setOpen(false)
                    formref.current.resetFields()
                }).catch(err => {
                    console.log("err", err);
                    setLoading(false)
                })
            } else {
                await register(handledItems.name, handledItems.avatar, handledItems.description).then(res => {
                    setLoading(false)
                    message.success("Updated")
                    setOpen(false)
                    formref.current.resetFields()
                }).catch(err => {
                    console.log("err", err);
                    setLoading(false)
                })
            }
        } catch (error) {
            console.log(error);
            message.error("Error")
        }
    }
    const onFinishFailed = (errorInfo) => { message.error("Error: ", errorInfo) }

    return (
        <div className='profilePage'>
            <section className='profilePage-card white-glassmorphism'>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar src={userInfo?.avatar} size={64} icon={<FaUser />} />
                        <div style={{ fontSize: 20, fontWeight: 600 }}>{userInfo?.name ? userInfo?.name : "User"}</div>
                    </div>
                    <div>
                        <Button onClick={() => setOpen(true)}>Update</Button>
                    </div>
                </div>
                <div style={{ textOverflow: 'ellipsis', whiteSpace: 'wrap', overflowWrap: 'break-word', width: '100%' }}>
                    <p style={{ padding: '10px 30px' }}>{userInfo?.description ? userInfo?.description : "No Description Here"}</p>
                </div>
            </section>
            <Modal open={open} onOk={() => setOpen(false)} footer={null} onCancel={() => setOpen(false)} title={"Update Profile"}>
                <Form labelCol={{ span: 4 }} initialValues={userInfo} wrapperCol={{ span: 14, }} layout="horizontal" style={{ width: 600, marginTop: 20 }} onFinish={onFinish} onFinishFailed={onFinishFailed}>
                    <Form.Item name="name" label={"User Name"} rules={[{ required: true, message: 'Please input your username!' }]}>
                        <Input placeholder='User Name' />
                    </Form.Item>
                    <Form.Item name="description" label={'Description'} rules={[{ required: true, message: 'Please input your Description!' }]}>
                        <TextArea placeholder='Description' rows={2} />
                    </Form.Item>
                    <Form.Item label={"Avatar"} key={"Profile Picture"} getValueFromEvent={normFile}>
                        <Upload listType="picture" customRequest={submitImageToFirebase} {...propsImage} maxCount={1}>
                            <Button icon={<FiUpload />}>Upload Avatar</Button>
                        </Upload>
                    </Form.Item>
                    <Button loading={loading} style={{ marginLeft: 300 }} type="primary" htmlType="submit">
                        Update
                    </Button>
                </Form>
            </Modal>
        </div>
    )
}

export default ProfilePage