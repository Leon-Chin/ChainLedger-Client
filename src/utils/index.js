import { ethers } from 'ethers'

const isAddress = (address) => {
    return ethers.utils.isAddress(address)
}

const shortenAddress = (address, moreDetail) => moreDetail ? `${address.slice(0, 8)}...${address.slice(address.length - 6)}` : `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;

const copyToClipboard = async (text) => {
    return navigator.clipboard.writeText(text);
};

const convertBigNumber = (bigNumber) => {
    return ethers.BigNumber.from(bigNumber).toNumber()
}
export { isAddress, shortenAddress, copyToClipboard, convertBigNumber }