import './styles/App.scss';
import axios from "axios";
import {useState, useEffect} from 'react';
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons'

const apiKey = process.env.REACT_APP_API_KEY

function App() {

  const [currencyOne, setCurrencyOne] = useState(null)
  const [currencyTwo, setCurrencyTwo] = useState(null)

  const [valueOne, setValueOne] = useState(0)
  const [valueTwo, setValueTwo] = useState(0)

  const [conversionRates, setConversionRates] = useState(null);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    let loadedRates = localStorage.getItem("conversionrates")
    loadedRates = JSON.parse(loadedRates);
    console.log(loadedRates)
    if(!loadedRates) {
      axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`)
      .then(res => {
        const conversionrates = {
          lastUpdated: Date.now(),
          rates: res.data.conversion_rates
        }
        localStorage.setItem("conversionrates", JSON.stringify(conversionrates))
        setConversionRates(res.data.conversion_rates)
      })
    }
    else {
      setConversionRates(loadedRates.rates)
      const currencyOptions = Object.keys(loadedRates.rates)
      console.log(currencyOptions)
      currencyOptions.forEach(option => {
        const newOptions = options
        newOptions.push({value: option, label: option})
        setOptions(newOptions)
      })
    }
  }, [])

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

  function handleCurrencyChange(currency, inputNum) {
    if(inputNum === 1) {
      setCurrencyOne(currency)
      if(currencyOne && currencyTwo) {
        setValueTwo((valueOne / conversionRates[currency.value]) * conversionRates[currencyTwo.value])
      }
    }
    else {
      setCurrencyTwo(currency)
      if(currencyOne && currencyTwo) {
        setValueOne((valueTwo / conversionRates[currency.value]) * conversionRates[currencyOne.value])
      }
    }
  }

  function handleInputChange(value, inputNum) {
    if(inputNum === 1) {
      setValueOne(value)
      if(currencyOne && currencyTwo) {
        setValueTwo((value / conversionRates[currencyOne.value]) * conversionRates[currencyTwo.value])
      }
    }
    else {
      setValueTwo(value)
      if(currencyOne && currencyTwo) {
        setValueOne((value / conversionRates[currencyTwo.value]) * conversionRates[currencyOne.value])
      }
    }
  }

  function swapCurrencies() {
    const tempCurrOne = currencyOne;
    const tempCurrTwo = currencyTwo;
    const tempValOne = valueOne;
    const tempValTwo = valueTwo;
    setValueOne(tempValTwo)
    setValueTwo(tempValOne)
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
              <input type="text" value={valueOne} onChange={(event) => handleInputChange(event.target.value, 1)}/>
              <Select 
              defaultValue={"USD"}
              value={currencyOne}
              onChange={(val) => handleCurrencyChange(val, 1)}
              options={options}
              styles={styles} />
            </div>
            <div className="swapButton" onClick={() => swapCurrencies()}>
              <FontAwesomeIcon icon={faSyncAlt} />
            </div>
            <div>
              <input type="text" value={valueTwo} onChange={(event) => handleInputChange(event.target.value, 2)} />
              <Select
              defaultValue={"USD"}
              value={currencyTwo}
              onChange={(val) => handleCurrencyChange(val, 2)}
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
