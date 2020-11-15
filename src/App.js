import logo from './logo.svg';
import './App.css';
import HtmlToCanvas from './components/htmlToCanvas/htmlToCanvas';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <HtmlToCanvas/>
      </header>
    </div>
  );
}

export default App;
