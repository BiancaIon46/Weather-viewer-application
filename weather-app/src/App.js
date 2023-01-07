import { useEffect, useState } from 'react';
import './App.css';
import Forecast from './components/forecast/Forecast';
import Search from "./components/search/Search";
import Weather from './components/weather/Weather';


function App() {
  const [cityToSearch, setCityToSearch] = useState(() => []);
  const [show, setShow] = useState(false);
  
  if(localStorage.getItem('favs') === null )
    localStorage.setItem('favs', []);
  if(localStorage.getItem('lat') === null )
    localStorage.setItem('lat', []);
  if(localStorage.getItem('lon') === null )
    localStorage.setItem('lon', []);
      
  
  useEffect(() => {
    console.log(cityToSearch);
    if(cityToSearch.length !== 0){
      document.getElementById("spinner").removeAttribute('hidden');
      setShow(show => show = false);
    }
    else
      document.getElementById("spinner").setAttribute('hidden', '');
  }, [cityToSearch]);

  return (
    <>
      <Search setCity = {cityToSearch => setCityToSearch(cityToSearch)}></Search>
      <div id="spinner" hidden></div>
      {cityToSearch && <Weather data = {cityToSearch} changeShow = {show => setShow(show)} show = {show}/>}
      {cityToSearch && <Forecast data = {cityToSearch} show = {show}/>}
    </>
  );
}

export default App;
