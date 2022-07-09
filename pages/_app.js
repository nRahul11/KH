/** @format */

// import Layout from '../components/Layout/Layout';
import { wrapper } from '../redux/store';
import '../styles/globals.css';
import 'react-datepicker/dist/react-datepicker.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default wrapper.withRedux(MyApp);
