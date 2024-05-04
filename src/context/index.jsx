import { convertBigNumber } from '@/utils';
import { metamaskWallet, useConnectionStatus } from '@thirdweb-dev/react';
import { useAddress, useConnect, useContract, useContractRead, useContractWrite } from '@thirdweb-dev/react-core';
import React, { useEffect, useMemo, useState } from 'react'

const StateContext = React.createContext();

const StateContextProvider = ({ children }) => {
    const { contract } = useContract("0xBD6459404378e37dB31bD01138720A3C22a33dd7")
    const address = useAddress()

    // contract Methods
    // write functions
    const { mutateAsync: RecordDebt } = useContractWrite(contract, "recordDebt")
    const { mutateAsync: ConfirmDebt } = useContractWrite(contract, "confirmDebt")
    const { mutateAsync: SettleDebt } = useContractWrite(contract, "settleDebt")
    const { mutateAsync: RemoveDebt } = useContractWrite(contract, "deleteDebt")
    const { mutateAsync: UpdateDebt } = useContractWrite(contract, "updateDebt")

    // read functions
    const { data: allDebts, isLoading: isGetAllDebtsLoading, error: isGetAllDebtsError } = useContractRead(contract, "getAllDebts", [address])
    const { data: totalCreditOwed, isLoading: isGetTotalCreditOwedLoading, error: isGetTotalCreditOwedError } = useContractRead(contract, "getTotalCreditOwed", [address])
    const { data: totalDebtOwed, isLoading: isGetTotalDebtOwedLoading, error: isGetTotalDebtOwedError } = useContractRead(contract, "getTotalDebtOwed", [address])
    const { data: allContacts, isLoading: isGetAllContactsLoading, error: isGetAllContactError } = useContractRead(contract, "getRecentTransactionPartners", [address])

    const myDebts = useMemo(() => allDebts ? allDebts.map(item => ({
        amount: convertBigNumber(item.amount._hex),
        oppositeParty: item.oppositeParty,
        id: convertBigNumber(item.id._hex),
        repaymentDueDate: new Date(convertBigNumber(item.repaymentDueDate._hex)),
        repaymentDate: convertBigNumber(item.repaymentDate._hex) ? new Date(convertBigNumber(item.repaymentDate._hex)) : null,
        creditorInitiateConfirmed: item.creditorInitiateConfirmed,
        creditorSettledConfirmed: item.creditorSettledConfirmed,
        debtorInitiateConfirmed: item.debtorInitiateConfirmed,
        debtorSettledConfirmed: item.debtorSettledConfirmed,
        initialEvidenceFiles: item.initialEvidenceImages,
        isDebtor: item.isDebtor,
        settledEvidenceFiles: item.settledEvidenceImages,
    })
    ) : [], [allDebts])
    const myTotalCreditOwed = useMemo(() => totalCreditOwed?._hex ? convertBigNumber(totalCreditOwed._hex) : 0, [totalCreditOwed?._hex])
    const myTotalDebtOwed = useMemo(() => totalDebtOwed?._hex ? convertBigNumber(totalDebtOwed._hex) : 0, [totalDebtOwed?._hex])

    // metaMask connect Status
    const metmaskConfig = metamaskWallet()
    const connect = useConnect()
    const connectToMetamask = async () => {
        await connect(metmaskConfig)
    }
    const connectStatus = useConnectionStatus()

    const isConnected = useMemo(() => connectStatus === "connected" ? true : false, [connectStatus])

    const createDebt = (_debtor, _creditor, _amount, _repaymentDueDate, _initialEvidenceImages) => {
        return RecordDebt({ args: [_debtor, _creditor, _amount, _repaymentDueDate, _initialEvidenceImages] })
    }
    const confirmDebt = (_contractID) => {
        return ConfirmDebt({ args: [_contractID] })
    }

    const repayDebt = (debtID, repaymentDate, settledEvidenceImages) => {
        return SettleDebt({ args: [debtID, repaymentDate, settledEvidenceImages] })
    }

    const [activeNav, setActiveNav] = useState("/")

    useEffect(() => {
        setActiveNav(window.location.pathname)
    }, [window.location.pathname])

    const setActiveNavBar = (path) => {
        setActiveNav(path)
    }
    return (
        <StateContext.Provider value={{
            connectToMetamask,
            isConnected,
            address,
            allContacts,
            createDebt,
            confirmDebt,
            repayDebt,
            RemoveDebt,
            UpdateDebt,
            myDebts,
            myTotalCreditOwed,
            myTotalDebtOwed,
            activeNav,
            setActiveNavBar
        }}>
            {children}
        </StateContext.Provider>
    )
}

export default StateContextProvider

export const useStateContext = () => React.useContext(StateContext)