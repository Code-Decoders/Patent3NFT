import Layout from '../components/layout'
import '../styles/globals.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {
  return <Layout>
    <Component {...pageProps} />
    <ToastContainer />
  </Layout>;
}

export default MyApp
