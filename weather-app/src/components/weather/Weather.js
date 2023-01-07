import axios from 'axios';
import React, { useEffect, useState } from 'react'
import './Weather.css'
import { createClient } from 'pexels';
import heart from './heart.png';
import redHeart from './redHeart.png';

export default function Weather(data) {
  const {latitude, longitude} = data.data;
  const [weatherInfo, setWeatherInfo] = useState(() => {});
  const client = createClient(`563492ad6f917000010000018ed297825297491ba887b6635cbc3254`); //pexels api
  const [query, setQuery] = useState(() =>{})
  const [cityPhoto, setCityPhoto] = useState(() => {});
  const currentDate = Date().substring(0, 15);
  const [hideSpinner, setHideSpinner] = useState(false);
  const [heartImage, setHeartImage] = useState(() => heart);

  const callWeatherAPI = function() {
    return axios.request(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=e5c28260159fe44f13040d89ac866fc4&units=metric`)
      .then(function (response) {
        return {
            feels_like: response.data.main.feels_like,
            humidity: response.data.main.humidity,
            pressure: response.data.main.pressure,
            temp: response.data.main.temp,
            temp_max: response.data.main.temp_max,
            temp_min: response.data.main.temp_min,
            wind: response.data.wind.speed,
            name: response.data.name,
            country: response.data.sys.country,
            icon: response.data.weather[0].icon,
            description: response.data.weather[0].description
        };
      })
    };
    
    useEffect(() => {
      callWeatherAPI().then(response => {
        if (response !== undefined)
          {
            setWeatherInfo(weatherInfo => weatherInfo = response);
            setQuery(query => query = response.name);
          }
        });

        if(localStorage.getItem('lat').split(',').find((elem) => elem == latitude) && localStorage.getItem('lon').split(',').find((elem) => elem == longitude))
          return setHeartImage(heartImage => heartImage = redHeart);
        else
          return setHeartImage(heartImage => heartImage = heart);
    }, [latitude, longitude]);

    useEffect(() => {
      if(weatherInfo !== undefined){
        setTimeout(() => {
          setHideSpinner(hideSpinner => hideSpinner = true);
          data.changeShow(true);
        }, [1000]);
      }
    }, [weatherInfo])

    useEffect(() => {
      
      if(hideSpinner === true){
        document.getElementById("spinner").setAttribute('hidden', '');
        setHideSpinner(hideSpinner => hideSpinner = false);
      }
    }, [hideSpinner])

    useEffect(() => {
      if(query !== "")
        client.photos.search({ query, per_page: 1 }).then((photo) => {
          if(photo.photos[0])
            setCityPhoto(cityPhoto => cityPhoto = photo.photos[0].src.landscape);
          else
            setCityPhoto(cityPhoto => cityPhoto = `https://media.capital.ro/wp-content/uploads/2021/12/romania-bucuresti-casa-poporului-palatul-parlamentului-1024x682.jpg`);
        })}, [query]);

  const addToFavorites = () => {
    const favItem = localStorage.getItem('favs');
    const latItem = localStorage.getItem('lat');
    const lonItem = localStorage.getItem('lon');

    if(favItem.split(',').find((elem) => elem === weatherInfo.name) )
    {
      localStorage.setItem('favs', favItem.split(',').filter((elem) => elem !== weatherInfo.name));
      localStorage.setItem('lat', latItem.split(',').filter((elem) => elem != latitude));
      localStorage.setItem('lon', lonItem.split(',').filter((elem) => elem != longitude));
      setHeartImage(heartImage => heartImage = heart);
    }
    else {
      localStorage.setItem('favs', [favItem, weatherInfo.name]);
      localStorage.setItem('lat', [latItem, latitude]);
      localStorage.setItem('lon', [lonItem, longitude]);
      setHeartImage(heartImage => heartImage = redHeart);
    }
  } 

  const showWeatherInfo = function() {
    return (
      <div className="background">
        <div id="image" style={{ backgroundImage: `url(${cityPhoto})`, width: '50vw', height: '55vh', backgroundBlendMode: 'lighten', backgroundRepeat: 'no-repeat', borderRadius: '3vw'}}>
          <div className='weather' id="gradWeather">
            
            <div className='top'>
              <img alt='like' src={heartImage} style={{width: '2vw', padding: '0vw'}} onClick={addToFavorites}></img>
              <div className='column'>
                <p>{weatherInfo.name}, {weatherInfo.country}</p>
                <p className='time'>{currentDate}</p>
                <p className='description'>{weatherInfo.description}</p>
              </div>
              <p className='temperature'>{Math.round(weatherInfo.temp)}°C</p>
            </div>
            
            <div className='bottom'>
              <img alt="weather" className='weatherIcon' src={`icons/${weatherInfo.icon}.png`}></img>
              
              <div className='details'>
                <span className='value'>{Math.floor(weatherInfo.temp_min)}°C / {Math.ceil(weatherInfo.temp_max)}°C</span>

                <div className='row'>
                  <span className='label'>Feels like </span>
                  <span className='value'>{Math.round(weatherInfo.feels_like)}°C</span>
                </div>

                <div className='row'>
                  <span className='label'>Humidity </span>
                  <span className='value'>{weatherInfo.humidity}%</span>
                </div>

                <div className='row'>
                  <span className='label'>Pressure </span>
                  <span className='value'>{weatherInfo.pressure} hPa</span>
                </div>

                <div className='row'>
                  <span className='label'>Wind </span>
                  <span className='value'>{weatherInfo.wind} m/sec</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {data.show && showWeatherInfo()}
    </div>
  )
}
