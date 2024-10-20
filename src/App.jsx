import { useState, useEffect } from 'react';
import beer from './assets/resources/beer.jpg';
import './App.css';

function App() {
  const [zip, setZip] = useState('');
  const [city, setCity] = useState('');
  const [breweryType, setBreweryType] = useState('');
  const [breweryData, setBreweryData] = useState([]);
  const [message, setMessage] = useState('');
  const [totalBreweries, setTotalBreweries] = useState(0);
  const [showAbout, setShowAbout] = useState(false); // State to toggle the About page

  useEffect(() => {
    if (breweryData.length) {
      setTotalBreweries(breweryData.length);
    }
  }, [breweryData]);

  const fetchBreweries = async (zip, type) => {
    try {
      const response = await fetch(`https://api.openbrewerydb.org/v1/breweries?by_postal=${zip}${type ? `&by_type=${type}` : ''}`);
      const data = await response.json();

      if (data.length > 0) {
        setBreweryData(data);
        setMessage('');
      } else {
        setMessage("No breweries found in this zip code. Try a nearby one or search by city.");
        setBreweryData([]);
      }
    } catch (error) {
      setMessage("An error occurred while fetching data. Please try again.");
    }
  };

  const fetchBreweriesByCity = async (city, type) => {
    try {
      const response = await fetch(`https://api.openbrewerydb.org/v1/breweries?by_city=${city}${type ? `&by_type=${type}` : ''}`);
      const data = await response.json();

      if (data.length > 0) {
        setBreweryData(data);
        setMessage('');
      } else {
        setMessage("No breweries found in this city. Try a different one.");
        setBreweryData([]);
      }
    } catch (error) {
      setMessage("An error occurred while fetching data. Please try again.");
    }
  };

  const handleZipSubmit = (e) => {
    e.preventDefault();
    if (zip) {
      fetchBreweries(zip, breweryType);
    }
  };

  const handleCitySubmit = (e) => {
    e.preventDefault();
    if (city) {
      fetchBreweriesByCity(city, breweryType);
    }
  };

  const toggleAbout = () => {
    setShowAbout(!showAbout); // Toggle the About page visibility
  };

  return (
    <div>
      <div className='top'>
        <div className='left'>
          <h1>Welcome to Our Thirst Utopia</h1>
          <img className='beerimage' src={beer} alt="beer" />
        </div>
        <div className='middle'>
          <button onClick={() => setShowAbout(false)}>Home</button>
          <button onClick={toggleAbout}>About</button>
        </div>
        <div className='right'></div>
      </div>

      {showAbout ? (
        <div className="about">
          <h2>About This Website</h2>
          <p>We would love to help you search for breweries by zip code or city.</p>
          <p>Let's quench our thirst.</p>
          
          <p>Use the dropdown to filter results by brewery type.</p>
          <button onClick={() => setShowAbout(false)}>Back to Home</button>
        </div>
      ) : (
        <div className='search-section'>
          <h2>Search for Breweries by Zip Code</h2>
          <form onSubmit={handleZipSubmit}>
            <input
              type="text"
              placeholder="Enter Zip Code"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
            <select value={breweryType} onChange={(e) => setBreweryType(e.target.value)}>
              <option value="">All Types</option>
              <option value="micro">Micro</option>
              <option value="nano">Nano</option>
              <option value="regional">Regional</option>
              <option value="brewpub">Brewpub</option>
              <option value="large">Large</option>
              <option value="planning">Planning</option>
              <option value="contract">Contract</option>
              <option value="proprietor">Proprietor</option>
              <option value="closed">Closed</option>
            </select>
            <button type="submit">Search</button>
          </form>

          <h2>Search for Breweries by City</h2>
          <form onSubmit={handleCitySubmit}>
            <input
              type="text"
              placeholder="Enter City Name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <select value={breweryType} onChange={(e) => setBreweryType(e.target.value)}>
              <option value="">All Types</option>
              <option value="micro">Micro</option>
              <option value="nano">Nano</option>
              <option value="regional">Regional</option>
              <option value="brewpub">Brewpub</option>
              <option value="large">Large</option>
              <option value="planning">Planning</option>
              <option value="contract">Contract</option>
              <option value="proprietor">Proprietor</option>
              <option value="closed">Closed</option>
            </select>
            <button type="submit">Search</button>
          </form>

          {message && <p>{message}</p>}

          <div className="stats">
            <h3>Total Breweries: {totalBreweries}</h3>
          </div>

          {breweryData.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Website</th>
                </tr>
              </thead>
              <tbody>
                {breweryData.map((brewery) => (
                  <tr key={brewery.id}>
                    <td>{brewery.name}</td>
                    <td>
                      <a href={brewery.website_url} target="_blank" rel="noopener noreferrer">
                        {brewery.website_url}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
