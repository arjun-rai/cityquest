import './App.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Container,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Card,
  AppBar,
  Toolbar,
  Snackbar,
} from '@mui/material';
import Confetti from 'react-confetti';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Mali, cursive',
    fontWeightBold: 700,
  },
  palette: {
    primary: {
      main: '#F7A8CE',
    },
  },
});

function App() {
  const [city, setCity] = useState('');
  const [submittedCity, setSubmittedCity] = useState('');
  const [distanceOption, setDistanceOption] = useState('');
  const [numLocations, setNumLocations] = useState('');
  const [locations, setLocations] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [done, setDone] = useState(false);
  const [confettiVisible, setConfettiVisible] = useState(false);
  const [randomImage, setRandomImage] = useState('');

  const images = [
    'image1.jpg',
    'image2.jpg',
    'image3.jpg',
    // Add more images as needed
  ];

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    setRandomImage(images[randomIndex]);
  };

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    if (confettiVisible) {
      const timer = setTimeout(() => {
        setConfettiVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [confettiVisible]);

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedCity(city);
    setCity('');
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
    setShowTimer(true);
    setIsTimerRunning(true);
    setSubmittedCity('');
    setDistanceOption('');
    setNumLocations('');
  };

  const handleUploadImage = () => {
    getRandomImage();
    setShowSnackbar(true);
  };

  const handleDone = () => {
    setDone(true);
    setIsTimerRunning(false);
    setConfettiVisible(true);
  };

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        className="App"
        maxWidth="sm"
        style={{
          backgroundColor: '#f5f5f5',
          padding: '10px', /* adjusted padding */
          borderRadius: '8px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          opacity: 0.7,
        }}
      >
        {/* Header Section with Bar */}
        <AppBar
          position="fixed"
          style={{
            backgroundColor: '#F7A8CE',
            boxShadow: 'none',
            top: 0,
            left: 0,
            right: 0,
            transition: 'height 0.3s',
          }}
        >
          <Toolbar style={{ height: '70px', justifyContent: 'center' }}>
            <img 
              src={`${process.env.PUBLIC_URL}/CityQuest_Logo.png`} 
              alt="CityQuest Logo" 
              style={{ height: '180px' }} // Adjust height as needed
            />
          </Toolbar>
        </AppBar>

        <div style={{ marginTop: '100px' }}> {/* change this if you want to change the height of timer */}
          {showTimer && (
            <Typography variant="h5" align="center" style={{ display: 'none' }}>
              {formatTime(timer)} {/* Hidden Timer */}
            </Typography>
          )}

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
                style={{ margin: '20px auto', display: 'block', backgroundColor: '#F7A8CE' }}
              >
                Let's roll
              </Button>
            </form>
          ) : locations.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Typography variant="h6">You are in: {submittedCity}</Typography>
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
                      backgroundColor: distanceOption === option ? '#F7A8CE' : 'transparent',
                      color: distanceOption === option ? 'white' : 'inherit',
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
                    {[...Array(5).keys()].map((num) => (
                      <MenuItem key={num + 1} value={num + 1}>
                        {num + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Submit Button to Fetch Locations */}
              <Button
                variant="contained"
                style={{ marginTop: '20px', backgroundColor: '#F7A8CE' }}
                onClick={handleFetchLocations}
                disabled={!numLocations || !distanceOption}
              >
                It's questin' time!
              </Button>
            </div>
          ) : (
            <div style={{ marginTop: '20px', overflowY: 'auto', maxHeight: '70vh' }}>
              <Grid container spacing={2}>
                {locations.map((loc) => (
                  <Grid item xs={12} sm={6} md={4} key={loc.number}>
                    <Card style={{ padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
                      <Typography variant="h6">Location {loc.number}</Typography>
                      <Typography variant="body1">{loc.name}</Typography>
                      
                      {randomImage && (
                        <img src={randomImage} alt="Random Location" style={{ width: '100%', height: 'auto', marginTop: '10px' }} />
                      )}

                      <Button
                        variant="outlined"
                        style={{ marginTop: '10px', borderColor: '#F7A8CE', color: '#F7A8CE' }}
                        onClick={handleUploadImage}
                      >
                        Upload Picture
                      </Button>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              {/* Submit Button at the Bottom */}
              <Button
                variant="contained"
                style={{ marginTop: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#F7A8CE' }}
                onClick={handleDone}
              >
                I'm done!
              </Button>
            </div>
          )}
        </div>

        {/* Confetti Effect */}
        {confettiVisible && <Confetti />}

        {/* Snackbar for Image Uploads */}
        <Snackbar
          open={showSnackbar}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          message="Image uploaded!"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          ContentProps={{
            style: {
              backgroundColor: '#F7A8CE', // Pink color
              color: 'white', // Optional: Change text color for better contrast
            },
          }}
        />


        {/* Timer Display after "I'm done" */}
        {done && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Typography variant="h5">Your time: {formatTime(timer)}</Typography>
          </div>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
