import './styles/App.scss';
import axios from "axios";
import {useState, useEffect} from 'react';
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import {FaGithub, FaLinkedin} from 'react-icons/fa'
import {RiPassportLine} from 'react-icons/ri'

const apiKey = process.env.REACT_APP_API_KEY

function App() {

  const [currencyOne, setCurrencyOne] = useState(null)
  const [currencyTwo, setCurrencyTwo] = useState(null)

  const [valueOne, setValueOne] = useState(0)
  const [valueTwo, setValueTwo] = useState(0)

  const [lastUpdated, setLastUpdated] = useState("")

  const [conversionRates, setConversionRates] = useState(null);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    let loadedRates = localStorage.getItem("conversionrates")
    loadedRates = JSON.parse(loadedRates);
    if(!loadedRates || loadedRates.lastUpdated < (Date.now() - 86400000)) {
      axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`)
      .then(res => {
        const conversionrates = {
          lastUpdated: Date.now(),
          rates: res.data.conversion_rates
        }
        setLastUpdated(Date.now())
        localStorage.setItem("conversionrates", JSON.stringify(conversionrates))
        setConversionRates(res.data.conversion_rates)
        window.location.reload();
      })
    }
    else {
      setConversionRates(loadedRates.rates)
      const date = new Date(loadedRates.lastUpdated)
      const dateString = ((date.getMonth()+1)+
      "/"+date.getDate()+
      "/"+date.getFullYear())
      setLastUpdated(dateString)
      const currencyOptions = Object.keys(loadedRates.rates)
      currencyOptions.forEach(option => {
        const newOptions = options
        newOptions.push({value: option, label: option})
        setOptions(newOptions)
      })
    }
  }, [options])

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

  function handleCurrencyChange(currency, inputNum, value) {
    if(inputNum === 1) {
      setCurrencyOne(currency)
      if(currencyOne && currencyTwo) {
        if(currencyOne && currencyTwo) {
          const newValue = (value / conversionRates[currency.value]) * conversionRates[currencyTwo.value]
          setValueTwo(Math.round(newValue * 100) / 100)
        }
      }
    }
    else {
      setCurrencyTwo(currency)
      if(currencyOne && currencyTwo) {
        const newValue = (value / conversionRates[currency.value]) * conversionRates[currencyOne.value]
        setValueOne(Math.round(newValue * 100) / 100)
      }
    }
  }

  function handleInputChange(value, inputNum) {
    const re = /^[0-9\b]+$/;

    if (value === '' || re.test(value)) {
      if(inputNum === 1) {
        setValueOne(value)
        if(currencyOne && currencyTwo) {
          const newValue = (value / conversionRates[currencyOne.value]) * conversionRates[currencyTwo.value]
          setValueTwo(Math.round(newValue * 100) / 100)
        }
      }
      else {
        setValueTwo(value)
        if(currencyOne && currencyTwo) {
          const newValue = (value / conversionRates[currencyTwo.value]) * conversionRates[currencyOne.value]
          setValueOne(Math.round(newValue * 100) / 100)
        }
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
              onChange={(val) => handleCurrencyChange(val, 1, valueOne)}
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
              onChange={(val) => handleCurrencyChange(val, 2, valueTwo)}
              options={options}
              styles={styles} />
            </div>
          </div>
          {lastUpdated ? 
          <div className="updatedDiv">
            <span>Last Updated: {lastUpdated}</span>
          </div>
          : null}
        </div>
      </div>
      <div className="footer">
      <div className="links">
        <a target="_blank" rel="noreferrer" href="https://github.com/AnthonyKrueger"><FaGithub /></a>
        <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/anthony-krueger-1545a5208/"><FaLinkedin /></a>
        <a target="_blank" rel="noreferrer" href="https://aik-portfolio.herokuapp.com/"><RiPassportLine /></a>
      </div>
      </div>
    </div>
  );
}

export default App;
