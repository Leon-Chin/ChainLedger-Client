import { useStateContext } from '@/context'
import { shortenAddress } from '@/utils'
import { useContractRead } from '@thirdweb-dev/react'
import { Avatar } from 'antd'
import React, { useMemo } from 'react'
import { FaUser } from 'react-icons/fa'

const UserBrief = ({ contactAddress }) => {
    const { userService } = useStateContext()
    const { data: userDetails, isLoading: isGetUserInfoLoading } = useContractRead(userService, "getUserInfo", [contactAddress])
    const userInfo = useMemo(() => {
        return userDetails ? {
            name: userDetails?.name,
            avatar: userDetails?.avatar,
            description: userDetails?.description
        } : {
            name: "",
            avatar: "",
            description: ""
        }
    }, [userDetails])

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Avatar src={userInfo?.avatar} icon={<FaUser />} />
            <p>{userInfo?.name}</p>
            <p>{shortenAddress(contactAddress, false)}</p>
        </div>
    )
}

export default UserBrief