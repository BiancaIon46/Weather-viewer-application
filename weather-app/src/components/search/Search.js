import React, { useEffect, useState } from 'react'
import axios from "axios";
import './Search.css'

export default function Search(props) {
    const [value, setValue] = useState("");
    const [city, setCity] = useState([]);

    const callGeoAPI = function() {     // api for cities
        const options = {
            method: 'GET',
            url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
            params: {namePrefix: `${value}`, sort: '-population'},
            headers: {
                'X-RapidAPI-Key': 'API key',
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
        };
            
        return axios.request(options).then(function (response) {
            return response.data.data.map(function(elem) {
                return {
                    name: elem.city,
                    countryCode: elem.countryCode,
                    latitude: elem.latitude,
                    longitude: elem.longitude
                }
            });
        }).catch(function (error) {
            return console.error('Cannot search for city');
        });
    };

    useEffect(() => {
        if(value.length !== 0){
            console.log(localStorage.getItem('favs').split(','));
            localStorage.getItem('favs').split(',').forEach(function(elem, index) {
                if(elem === value)
                {
                    props.setCity({
                        latitude: localStorage.getItem('lat').split(',')[index],
                        longitude: localStorage.getItem('lon').split(',')[index]
                    });
                }
            })
        }

        if(value.length >= 3)
           callGeoAPI().then(response => {
                if(response !== undefined) 
                    response.forEach(element => {
                        setCity(city => city = [...city, {
                            name: element.name,
                            countryCode: element.countryCode,
                            latitude: element.latitude,
                            longitude: element.longitude
                        }]);                    
                    });
            });
        return setCity(city => city = []);
    }, [value]);

    const printOptionsForAutocomplete = function() {
        return (
            <datalist id = "autocomplete"> {
                city.map(function(elem, index) {
                    return (
                        <option value = {`${elem.name} ${elem.countryCode}`} key = {index}></option>
                    );
                })
            }
            </datalist>
        );
    }

    const printOptionsForFavsAutocomplete = function() {
        return (
            <datalist id = "autocomplete"> {
                localStorage.getItem('favs').split(',').map(function(elem, index) {
                    return (
                        <option value = {`${elem}`} key = {index}></option>
                    );
                })
            }
            </datalist>
        );
    }

    const onChange = (event) => {
        setValue(event.target.value);
        city.forEach(function(elem) {
            if(elem.name + " " + elem.countryCode === event.target.value)
            {   
                props.setCity({
                    latitude: elem.latitude,
                    longitude: elem.longitude
                });
            }
        });
    };

    return (
        <div>
            <input type = "text" list = "autocomplete" value = {value} onChange = {onChange} id="search" placeholder='Search for city'></input>
            {city.length !== 0 && printOptionsForAutocomplete()}
            {value.length === 0 && printOptionsForFavsAutocomplete()}
        </div>
    )
}



