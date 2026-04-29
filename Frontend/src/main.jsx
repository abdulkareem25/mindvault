import { createRoot } from 'react-dom/client'
import './app/index.css'
import App from './app/App.jsx'
import { Provider } from 'react-redux'
import store from './app/app.store'
import Toast from './features/shared/components/Toast.jsx'

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App />
        <Toast />
    </Provider>
)