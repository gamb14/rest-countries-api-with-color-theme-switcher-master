// Dom references
const main = document.querySelector('main');
const searchCountry = document.querySelector('.search-country');
const body = document.querySelector('body')
const headerContainer = document.querySelector('.header-container')
const form = document.querySelector('form');
const h2 = document.querySelector('.header h2');
const label = document.querySelector('label');
const select = document.querySelector('select');
const searchBarContainer = document.querySelector('.searchbar-container');
const detailedInfoParent = document.querySelector('.detailed-info-parent')
const detailedInfoContainer = document.querySelector('.detailed-info-container')
const borderCountries = document.querySelector('.border-countries')
const backBtn = document.querySelector('.back-btn')
const themeBtn = document.querySelector('label i')
const span = document.querySelector('.label span')

// functions

const getAllCountries = async () => {

  // Get the data of all countries
  const allCountriesData = 'https://restcountries.eu/rest/v2/all'
  const response = await fetch(allCountriesData)
  const data = response.json();
  return data;
}

const fillUp = (countries) => {

  countries.forEach(country => {
    const countriesInfo = 
    `<img src=${country.flag} alt=${country.name}>
    <div class=${country.region.toLowerCase()}>
      <h2>${country.name}</h2>
      <p> Population: <span>${country.population}</span>
      <p> Region: <span>${country.region} </span>
      <p> Captial: <span>${country.capital} </span>
    </div>
    `
    const region = country.region.toLowerCase()
    const div = document.createElement('div');
    
    // Adding-classes and attributes
    div.classList.add('grid-item')
    region ? div.classList.add(region) : false;
    div.setAttribute('name', country.alpha3Code)
    
    div.innerHTML = countriesInfo;
    main.appendChild(div);
  })

  const countriesParent = document.querySelector('.grid-container')
  return countriesParent;
}

const filterCountriesBySearch = (countriesParent) => {

  // Just to prevent the site from resetting whenever the user sumbits the form
  form.addEventListener('submit', e => {
    e.preventDefault();
  })

  form.addEventListener('keyup', () => {
    const inputCountry = form.search.value.toLowerCase().trim();
    
    Array.from(countriesParent.children)
       .filter((country) => {
        const countryName = country.lastElementChild.firstElementChild.textContent.toLowerCase();

        return !countryName.includes(inputCountry);       
      })
      .forEach((country) => country.classList.add('d-none')) 


      Array.from(countriesParent.children)
      .filter((country) => {
        const countryName = country.lastElementChild.firstElementChild.textContent

        return countryName.includes(inputCountry);       
      })
      .forEach((country) => country.classList.remove('d-none')) 

  });

  return countriesParent;
}

const filterCountriesByRegion = (countriesParent) => {

  select.addEventListener('change', () => {

    const countriesArray = Array.from(countriesParent.children)

    switch(select.value){
      case 'all':
        countriesArray.forEach(country => country.classList.remove('r-filtered'))
      break;

      case 'asia':
        countriesArray.forEach(country => {
          if(country.classList.contains('asia')){
            country.classList.remove('r-filtered')
          }
          else{
            country.classList.add('r-filtered')
          }
        })
      break;
      
      case 'americas':
        countriesArray.forEach(country => {
          if(country.classList.contains('americas')){
            country.classList.remove('r-filtered')
          }
          else{
            country.classList.add('r-filtered')
          }
        })
      break;

      case 'africa':
        countriesArray.forEach(country => {
          if(country.classList.contains('africa')){
            country.classList.remove('r-filtered')
          }
          else{
            country.classList.add('r-filtered')
          }
        })
      break;

      case 'europe':
        countriesArray.forEach(country => {
          if(country.classList.contains('europe')){
            country.classList.remove('r-filtered')
          }
          else{
            country.classList.add('r-filtered')
          }
        })
      break;

      case 'oceania':
        countriesArray.forEach(country => {
          if(country.classList.contains('oceania')){
            country.classList.remove('r-filtered')
          }
          else{
            country.classList.add('r-filtered')
          }
        })
      break;
    }

  })
}

const displayDetailedInfo = async (countryName) => {
  const base = 'https://restcountries.eu/rest/v2/'
  const query = `name/${countryName}?fullText=true`

  const response = await fetch(base + query)
  const Data = await response.json();
  const countryData = Data[0];


  let array = [];

  for(i=0; i< countryData.languages.length; i++){
    array[i] = countryData.languages[i].name;
  }
  
  let languagesArray = array.join(', ')
  
  detailedInfoParent.innerHTML = `
  <img class='detailed-info-img' src="${countryData.flag}" alt="${countryData.name}">
  <div class='detailed-info'>
    <h1>${countryData.name}</h1>
    <div class="info-container">
      <div class="info-tab-1">
        <p>Native Name: <span>${countryData.nativeName} </span></p>
        <p>Population: <span> ${countryData.population} </span></p>
        <p>Region: <span> ${countryData.region} </span></p>
        <p>Sub Region: <span> ${countryData.subregion} </span></p>
        <p>Capital: <span> ${countryData.capital} </span></p>
      </div>
      <div class="info-tab-2">
        <p>Top Level Domain: <span>${countryData.topLevelDomain.toString()}</span></p>
        <p>Currencies: <span>${countryData.currencies[0].name}</span></p>
        <p>Languages: <span>${languagesArray}</span></p>
      </div>
    </div>
    <div class="border-countries">
      <span>Border-countries:</span>
    </div>
  </div> `

  // Check if it is light mode and if it is then add the shadow class to the img
  let detailedImg = detailedInfoParent.firstElementChild;
  body.classList.contains('light-bg') ? detailedImg.classList.add('light-shadow-lg') : false;

  // Add Buttons to the Border Countries
  const borderCountries = document.querySelector('.border-countries');
  
  for(i=0; i< countryData.borders.length; i++){
    const button = document.createElement('button');

    Array.from(main.children)
      .forEach(child => {
        const name = child.getAttribute('name') // 3no. country code

        if(name === countryData.borders[i]){
          const countryName = child.lastElementChild.firstElementChild.textContent;
          console.log(countryName);
          button.textContent = countryName;
        }
      })

      body.classList.contains('light-bg') ? button.classList.add('light-item', 'light-shadow-sm') : false;
      borderCountries.appendChild(button)
    
  }
  

  // Adding a Event Listener to border buttons Which runs the function again if it clicked

  borderCountries.addEventListener('click', async e => {
      if(e.target.tagName === 'BUTTON'){
        const button = e.target;
        const countryName = button.textContent;
        
        displayDetailedInfo(countryName);
        
      }
    })
}


const resetToHomePage = () => {

  if(main.classList.contains('d-none')){
    main.classList.remove('d-none');
    searchBarContainer.classList.remove('d-none');
    detailedInfoParent.classList.add('d-none')
    detailedInfoContainer.classList.add('d-none')
  } 

  form.reset();

  select.value = 'filter-by-region'

  Array.from(main.children)
    .forEach(child => {
      if(child.classList.contains('d-none')){
        child.classList.remove('d-none');
      }
      if(child.classList.contains('r-filtered')){
        child.classList.remove('r-filtered');
      }
    })
}

const changeTheme = () => {

  const detailedInfoParent = document.querySelector('.detailed-info-parent');
  const borderCountriesButtons = document.querySelectorAll('.border-countries button')

  if(body.classList.contains('light-bg')){
    span.textContent = 'Dark Mode'
    themeBtn.classList.add('fa-moon')
    themeBtn.classList.remove('fa-sun')
    body.classList.remove('light-bg');
    headerContainer.classList.remove('light-item', 'light-shadow-md');
    form.search.classList.remove('light-bg', 'light-input', 'light-shadow-md');
    select.classList.remove('light-item', 'light-shadow-sm');
    backBtn.classList.remove('light-item', 'light-shadow-sm');
    detailedInfoParent.firstElementChild.classList.remove('light-shadow-lg')
    
    Array.from(main.children)
      .forEach(child => {
      child.classList.remove('light-item', 'light-shadow-md')
    })

    

    Array.from(borderCountriesButtons)
      .forEach(button => {
        button.classList.remove('light-item', 'light-shadow-sm')
      })
  }

  else{
    span.textContent = 'Light Mode'
    themeBtn.classList.add('fa-sun');
    themeBtn.classList.remove('fa-moon');
    body.classList.add('light-bg');
    headerContainer.classList.add('light-item', 'light-shadow-md');
    form.search.classList.add('light-bg', 'light-input', 'light-shadow-md');
    select.classList.add('light-item', 'light-shadow-sm');
    backBtn.classList.add('light-item', 'light-shadow-sm');
    detailedInfoParent.firstElementChild.classList.add('light-shadow-lg');
    
    Array.from(main.children)
      .forEach(child => {
        child.classList.add('light-item', 'light-shadow-md')
      })

    Array.from(borderCountriesButtons)
      .forEach(button => {
        button.classList.add('light-item', 'light-shadow-sm')
      })
  } 
}


// On load

getAllCountries()
  .then(countriesInfo => fillUp(countriesInfo))
  .then(countriesParent => filterCountriesBySearch(countriesParent))
  .then(countriesParent => filterCountriesByRegion(countriesParent))
  .catch(err => console.log(err));


// Event Listeners

h2.addEventListener('click', resetToHomePage);

backBtn.addEventListener('click', resetToHomePage);

label.addEventListener('click', (e) => {
  e.preventDefault();
  changeTheme();
});

main.addEventListener('click', (e) => {

  if(e.target.tagName !== 'MAIN' && e.target.tagName !== 'BODY' ){
    main.classList.add('d-none');
    searchBarContainer.classList.add('d-none');
    detailedInfoParent.classList.remove('d-none')
    detailedInfoContainer.classList.remove('d-none')
  }

  // Closest so useful here, a Lifesaver
  const countryName= e.target.closest('.grid-item').lastElementChild.firstElementChild.textContent;
  console.log(countryName)

  // Detailed Information Manipulation
  displayDetailedInfo(countryName)

})


