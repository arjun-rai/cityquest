import './App.css';
import { useState } from 'react';
import { TextField, Button, Typography, Container, Select, MenuItem, InputLabel, FormControl, Grid, Card } from '@mui/material';

function App() {
  const [city, setCity] = useState('');
  const [submittedCity, setSubmittedCity] = useState('');
  const [distanceOption, setDistanceOption] = useState('');
  const [numLocations, setNumLocations] = useState('');
  const [locations, setLocations] = useState([]);

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

  const handleFetchLocations = () => {
    const fetchedLocations = Array.from({ length: numLocations }, (_, index) => ({
      number: index + 1,
      name: `Location ${index + 1}`,
    }));
    setLocations(fetchedLocations);
    // Clear all states
    setSubmittedCity('');
    setDistanceOption('');
    setNumLocations('');
  };

  return (
    <Container className="App" maxWidth="sm" style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      {!submittedCity && locations.length === 0 ? (
        <form onSubmit={handleSubmit}>
          <Typography variant="h4" gutterBottom align="center">
            What city are you in?
          </Typography>
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
            Let's roll
          </Button>
        </form>
      ) : locations.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Typography variant="h6">
            You are in: {submittedCity}
          </Typography>
          <Typography variant="body1" style={{ marginTop: '10px' }}>
            How would you like to explore the city?
          </Typography>
          
          {/* Distance Selection Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
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
          </div>

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

          {/* Blue Submit Button to Fetch Locations */}
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: '20px' }}
            onClick={handleFetchLocations}
            disabled={!numLocations || !distanceOption} // Disable if no number or distance option is selected
          >
            It's questin' time!
          </Button>
        </div>
      ) : (
        <div style={{ marginTop: '20px', overflowY: 'auto', maxHeight: '70vh' }}>
          <Typography variant="h5" gutterBottom align="center">
            Locations:
          </Typography>
          <Grid container spacing={2}>
            {locations.map((loc) => (
              <Grid item xs={12} sm={6} md={4} key={loc.number}>
                <Card style={{ padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
                  <Typography variant="h6">Location {loc.number}</Typography>
                  <Typography variant="body1">{loc.name}</Typography>
                  <Button variant="outlined" style={{ marginTop: '10px' }}>
                    Upload Picture
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      )}
    </Container>
  );
}

export default App;
