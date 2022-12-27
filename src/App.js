import './App.css';
import RoutesWrapper from './routes';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <div>
      <BrowserRouter>
        <RoutesWrapper />
      </BrowserRouter>
    </div>
  );
}

export default App;
