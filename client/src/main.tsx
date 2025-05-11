import {createRoot} from 'react-dom/client'
import './index.css'
import App from './components/App.tsx'
import store from "./redux/store.ts";
import {Provider} from 'react-redux'
import {ConfigProvider} from "antd";

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <ConfigProvider>
            <App/>
        </ConfigProvider>
    </Provider>
)
