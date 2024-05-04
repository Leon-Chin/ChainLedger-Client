import { ThirdwebProvider, metamaskWallet } from "@thirdweb-dev/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Sepolia } from '@thirdweb-dev/chains'
import React from "react";
import ReactDOM from 'react-dom/client'
import App from "./App";
import './index.css'
import 'reset-css'
import StateContextProvider from "./context";
import { ConfigProvider, theme } from "antd";
const root = ReactDOM.createRoot(document.getElementById('root'));
const { darkAlgorithm } = theme
root.render(
    <ConfigProvider locale={"en-US"} theme={{ algorithm: [darkAlgorithm] }}>
        <ThirdwebProvider
            supportedWallets={[
                metamaskWallet({ recommended: true })
            ]}
            activeChain={Sepolia}
            clientId="18c7b707cfa09b2e6d3aaac173596ac7">
            <StateContextProvider>
                <App />
            </StateContextProvider>
        </ThirdwebProvider>
    </ConfigProvider>
)