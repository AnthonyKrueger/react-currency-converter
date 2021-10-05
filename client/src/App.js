import './styles/App.scss';
import {useState, useReducer} from 'react';
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons'

function App() {

  const [currencyOne, setCurrencyOne] = useState(null)
  const [currencyTwo, setCurrencyTwo] = useState(null)

  const options = [
    { value: 'usd', label: 'USD' },
    { value: 'eur', label: 'EUR' },
    { value: 'ang', label: 'ANG' },
    { value: 'btc', label: 'BTC' }
  ]

  const styles = {
    control: provided => ({...provided, backgroundColor: "#282a36", color: "#ffb86c"}),
    menu: (provided, state) => ({
      ...provided,
      backgroundColor: "#282a36",
      color: "#ffb86c"
    }),
    input: (provided, state) => ({
      ...provided,
      color: "#ffb86c"
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: "#ffb86c"
    }),
    option: (provided, state) => ({
      ...provided,
      fontWeight: state.isSelected ? "bold" : "normal",
      fontSize: "15px",
      backgroundColor: state.isSelected ? "#6272a4" : "#282a36",
      color: state.isSelected ? "#ffb86c" : "#f1fa8c"
    })
  };

  function swapCurrencies() {
    const tempCurrOne = currencyOne;
    const tempCurrTwo = currencyTwo;
    setCurrencyOne(tempCurrTwo);
    setCurrencyTwo(tempCurrOne);
  }

  return (
    <div className="App">
      <div className="content">
        <div className="convertor">
          <h2 className="title">Currency Converter</h2>
          <div className="inputsDiv">
            <div>
              <input type="text" />
              <Select 
              value={currencyOne}
              onChange={setCurrencyOne}
              options={options}
              styles={styles} />
            </div>
            <div className="swapButton" onClick={() => swapCurrencies()}>
              <FontAwesomeIcon icon={faSyncAlt} />
            </div>
            <div>
              <input type="text" />
              <Select
              value={currencyTwo}
              onChange={setCurrencyTwo} 
              options={options}
              styles={styles} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
