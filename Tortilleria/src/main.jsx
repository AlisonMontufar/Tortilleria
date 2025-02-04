import ReactDOM from 'react-dom/client';
import App from './App'; // Importa el componente principal
import './styles/styles.css'; // Importa los estilos si los estás utilizando
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);




