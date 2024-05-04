import { useStateContext } from '@/context'
import { Button, Result } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const ErrorPage = () => {
    const { setActiveNavBar } = useStateContext()
    const navigateTo = useNavigate()
    return (
        <div style={{
            height: 'calc(100% - 76px)', width: '100%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div className='white-glassmorphism' style={{
                width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: 800, height: '80%', padding: 10, paddingTop: 20, overflow: 'hidden'
            }}>
                <Result
                    status="404"
                    subTitle="Sorry, the page you visited does not exist."
                    extra={<Button
                        onClick={() => {
                            setActiveNavBar("/")
                            navigateTo("/")
                        }}
                        type="primary"
                    >Back Home</Button>}
                />
            </div>
        </div>
    )
}

export default ErrorPage