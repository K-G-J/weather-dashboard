// helper identifiers 
const d=document;
const q=(e,n=d)=>n.querySelector(e);
const qa=(e,n=d)=>n.querySelectorAll(e);

// html areas 
const cityFormEl = d.forms.city;
const cityInputEl = q("#cityname");
const cityContainerEl = q("#city-container")
const daysContainerEl = q("#days-container");
const citySearchTerm = q("#city-search-term");
const pastCitiesButtonsEl = q("#past-cities-buttons");
const searchBtn=q('#getCords');
const ulSearches=q('#recent');

// 10 minutes 
const _EXPIRY=Math.pow( 60, 2 ) * 10;
const css={
    blue:'color:blue;font-weight:bold',
    blk:'color:black;font-weight:normal',
    grp:'padding:0.5rem;background:purple;color:gold;font-size:1.5rem'
};

// google maps API and json weather object 
let geocoder = new google.maps.Geocoder();
let weatherdata={};

console.info('%cOpenWeather API',css.grp);

// One Call API and data storage 
const getWeather = function(obj) {
    let time=(new Date()).getTime();
    let city=d.forms.city.address.value;
    let endpoint='https://api.openweathermap.org/data/2.5/onecall';
    let args= {
        lat: obj.lat(),
        lon: obj.lng(),
        units: 'imperial',
        appid: 'fb9174eee39da62906652ee7dd116b7c'
    };
    var url=buildurl(endpoint,args);
    
    console.info( 
        "City: %c%s%c, URL: %c%s%c, Latitude: %c%s%c Longitude: %c%s%c", 
        css.blue, city, css.blk, 
        css.blue, url.toString(), css.blk,
        css.blue, obj.lat(),css.blk,
        css.blue, obj.lng(), css.blk
        );
        
        // check if the results for this city already exist and are not stale 
        if(weatherdata.hasOwnProperty(city) && time - weatherdata[city].time < _EXPIRY){
            let json=weatherdata[city].data;
            console.info( 'Non-Stale results: %o', json );
            clearSearch();
            return displayWeather(json, city, false );
        }
        fetch(url).then(r=>r.json())
        .then(json => {
            console.info( 'Fresh results: %o', json );
            // Display the weather data 
            displayWeather( json, city, true );
            // store the weather data 
            updateDataStore( city, json );
            // add recent search to list 
            addRecentSearch( city );
            // clear the input element
            clearSearch();
        })
        .catch(err=>errorHandler(err))
};

// display current weather in large card 
const displayWeather = (json,city,fresh) => {
    console.info( 'Render JSON Data for:%c%s%c - Results are fresh: %c%s%c', css.blue,city,css.blk,css.blue,fresh,css.blk )
    return true;
};

// build the One Call API based on Google Maps coordinates 
const buildurl=function(endpoint, params){
    let url = new URL(endpoint);
    url.search = new URLSearchParams(params).toString();
    return url;
};

const searchHandler=(e)=>{
    if(e.target!=e.currentTarget)setSearch(e.target.textContent);
};

const setState = function(params) {
    let base = window.location.href.split("#")[0].split("?")[0];
    if(!params)return history.pushState( null, null, '?' );
    let args = new URLSearchParams(location.search);
    Object.keys(params).map(key => {
        if(params[key]=='')args.delete(key);
        else {
            if('URLSearchParams' in window)args.set(key, params[key])
            else args[key]=params[key];
        }
    });
    let q = args.toString().length > 0 ? '?' : '';
    history.pushState( args.toObject(), document.title, base + q + args.toString() );
};

URLSearchParams.prototype.toObject=function(){
    let tmp={};
    for( let p of this.entries() )tmp[p[0]]=p[1]
    return tmp;
};

function initialize(e) {
    e.preventDefault();
    let autocomplete = new google.maps.places.Autocomplete(cityInputEl);
    autocomplete.setTypes(['geocode']);
    google.maps.event.addListener( autocomplete, 'place_changed', function(e){
        let place = autocomplete.getPlace();
        if(!place.geometry )return;
        if( place.address_components ) {
            let obj = place.address_components;
            d.forms.city.address.value=[
                ( obj[0] && obj[0].short_name || ''),
                ( obj[1] && obj[1].short_name || ''),
                ( obj[2] && obj[2].short_name || '')
            ].join(' ');
        }
    });
}
function codeAddress(e){
    e.preventDefault();
    let city = d.forms.city.address.value;
    if( city === '' ) return;
    const callback = (results, status) => {
    if(status === google.maps.GeocoderStatus.OK) {
        showQuery({
            city: city,
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
        })
        return getWeather(results[0].geometry.location)
        }
        console.log('Geocoding failed: %s', status )
    };
    const args= {
        'address':city
    };
    geocoder.geocode( args, callback )
}

// event listeners
google.maps.event.addDomListener( window, 'load', initialize );
searchBtn.addEventListener('click', codeAddress )
ulSearches.addEventListener('click', searchHandler )


// supporting functions
const updateDataStore=(city,json)=>{ weatherdata[city]={ data:json, time:( new Date() ).getTime() }; };
const showQuery=(args)=>{setState(args)};
const clearSearch=()=>{ d.forms.city.address.value=''; d.forms.city.cityname.value=''; }
const setSearch=(city)=>{ d.forms.city.address.value=city; d.forms.city.cityname.value=city; }
const errorHandler=(error)=>alert(`Unable to connect to the Weather Service App!\n${error}`);
const addRecentSearch=(city)=>q('ul#recent').insertAdjacentHTML('beforeend',`<li>${city}</li>`);