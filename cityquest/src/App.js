import './App.css';
import { useState } from 'react';
import { TextField, Button, Typography, Container, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

function App() {
  const [city, setCity] = useState('');
  const [submittedCity, setSubmittedCity] = useState('');
  const [distanceOption, setDistanceOption] = useState('');
  const [numLocations, setNumLocations] = useState('');

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedCity(city);
    setCity(''); // Clear the input field after submission
  };

  const handleDistanceSelect = (option) => {
    setDistanceOption(option);
  };

  const handleNumLocationsChange = (event) => {
    setNumLocations(event.target.value);
  };

  return (
    <Container className="App" maxWidth="sm">
      {!submittedCity ? (
        <>
          <Typography variant="h4" gutterBottom>
            What city are you in?
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField 
              label="Enter your city" 
              variant="outlined" 
              fullWidth 
              value={city} 
              onChange={handleInputChange} 
              margin="normal"
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              style={{ margin: '20px auto', display: 'block' }} // Center the button
            >
              Submit
            </Button>
          </form>
        </>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Typography variant="h6">
            You are in: {submittedCity}
          </Typography>
          <Typography variant="body1" style={{ marginTop: '10px' }}>
            How would you like to explore the city?
          </Typography>
          
          {/* Distance Selection Buttons */}
          {['walking', 'biking', 'driving'].map((option) => (
            <Button 
              key={option}
              variant="outlined"
              onClick={() => handleDistanceSelect(option)}
              style={{
                margin: '10px',
                backgroundColor: distanceOption === option ? '#1976d2' : 'transparent', // Blue background if selected
                color: distanceOption === option ? 'white' : 'inherit', // White text if selected
              }}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Button>
          ))}

          <div style={{ marginTop: '20px' }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="num-locations-label">Number of Locations</InputLabel>
              <Select
                labelId="num-locations-label"
                value={numLocations}
                onChange={handleNumLocationsChange}
                label="Number of Locations"
              >
                {[...Array(10).keys()].map((num) => (
                  <MenuItem key={num + 1} value={num + 1}>{num + 1}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      )}
    </Container>
  );
}

export default App;
