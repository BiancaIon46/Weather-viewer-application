import React, { useEffect, useState } from 'react';
import axios from "axios";
import './Forecast.css'

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Forecast(data) {
    const {latitude, longitude} = data.data;
    const [forecastInfo, setforecastInfo] = useState(() => {});

    const callForecastAPI = function() {
        return axios.request(`https://api.openweathermap.org/data/2.5/forecast/?&daily&lat=${latitude}&lon=${longitude}&cnt=7&appid=APIkey&units=metric`)
          .then(function (response) {
            console.log(response);
            return response.data.list.map(function(elem) {
              return {
                  feels_like: elem.main.feels_like,
                  humidity: elem.main.humidity,
                  pressure: elem.main.pressure,
                  temp: elem.main.temp,
                  temp_max: elem.main.temp_max,
                  temp_min: elem.main.temp_min,
                  wind: elem.wind.speed,
                  icon: elem.weather[0].icon,
                  description: elem.weather[0].description,
                  date: elem.dt_txt.split(" ")[1].substring(0,5)
              };
            });
          })
    };

    useEffect(() => {
        callForecastAPI().then(response => {
          if (response !== undefined)
            response.forEach(elem => {
              setforecastInfo(forecastInfo => forecastInfo = response)
            })
              //setforecastInfo(forecastInfo => forecastInfo = response)
          });
      }, [latitude, longitude]);
  
      useEffect(() => {
        console.log(forecastInfo)
      }, [forecastInfo])

    const showforecastInfo = function() {
      return forecastInfo.map(forecastInfo => {
        return (
            <div className='forecast' id="grad">
              
              <div className='top'>
                <div className='column'>
                  <p>{forecastInfo.date}</p>
                  <p className='description'>{forecastInfo.description}</p>
                </div>
                <p className='temperature'>{Math.round(forecastInfo.temp)}°C</p>
              </div>

              <div className='bottom'>
                <img alt="weather" className='weatherIcon' src={`icons/${forecastInfo.icon}.png`}></img>
                
                <div className='details'>
                  <div className='value-forecast'>{Math.floor(forecastInfo.temp_min)}°C / {Math.ceil(forecastInfo.temp_max)}°C</div>
                  
                  <div className='row-forecast'>
                    <span className='label-forecast'>Feels like </span>
                    <span className='value-forecast'>{Math.round(forecastInfo.feels_like)}°C</span>
                  </div>
      
                  <div className='row-forecast'>
                    <span className='label-forecast'>Humidity </span>
                    <span className='value-forecast'>{forecastInfo.humidity}%</span>
                  </div>
      
                  <div className='row-forecast'>
                    <span className='label-forecast'>Pressure </span>
                    <span className='value-forecast'>{forecastInfo.pressure} hPa</span>
                  </div>
      
                  <div className='row=forecast'>
                    <span className='label-forecast'>Wind </span>
                    <span className='value-forecast'>{forecastInfo.wind} m/sec</span>
                </div>
                </div>
              </div>
            </div>
          )
      })
      }

    const groupForecastElem = () => {
      const elements = showforecastInfo();
      const divForecastElem = [];

      for(let idx = 0; idx < elements.length; idx = idx + 2){
        divForecastElem.push(
          <div className='divForecast'>
            {elements[idx]} {elements[idx + 1]}
          </div>
        );
      }

      return divForecastElem;
    }

   // groupForecastElem();

  return (
    <div>
      {data.show && groupForecastElem()}
    </div>
  )
}
