import './styles/App.scss';
import Select from 'react-select'

function App() {

  const options = [
    { value: 'usd', label: 'USD'}
  ]

  return (
    <div className="App">
      <div className="content">
        <h2 className="title">Currency Converter</h2>
        <div className="convertor">
          <Select options={options} />
        </div>
      </div>
    </div>
  );
}

export default App;
