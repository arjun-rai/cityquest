import './App.css';
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
import axios from 'axios';

const theme = createTheme({
  typography: {
    fontFamily: 'Mali, cursive', // Apply Mali font
    fontWeightBold: 700, // Set bold weight
  },
  palette: {
    primary: {
      main: '#F7A8CE', // Main color for buttons
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

  const [data, setData] = useState('');

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
      }, 5000); // Confetti lasts for 5 seconds
      return () => clearTimeout(timer);
    }
  }, [confettiVisible]);

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  const handleSubmit = async (event) => {
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

  const handleFetchLocations = async () => {
    await axios.get(
      'https://wkq9bdzy81.execute-api.us-east-1.amazonaws.com/default/cityquest-backend-dev-handler?location=' + submittedCity + '&transportation=' + distanceOption + '&num_places=' + numLocations
    ).then(function (response)
    {
      // console.log(response);
      setData(response);
      const fetchedLocations = Array.from({ length: numLocations }, (_, index) => ({
        number: index + 1,
        name: response['data']['locations'][index]['location'],
      }));
      setLocations(fetchedLocations);

      return response;

    });
    setShowTimer(true);
    setIsTimerRunning(true);
    setSubmittedCity('');
    setDistanceOption('');
    setNumLocations('');
  };

  const handleUploadImage = () => {

    setShowSnackbar(true);
  };

  const handleDone = () => {
    setDone(true);
    setIsTimerRunning(false);
    setConfettiVisible(true); // Show confetti
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
          padding: '20px',
          borderRadius: '8px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',

          opacity: 0.5, // THIS IS THE OPACITY, YOU CAN CHANGE IT IF YOU WANT, LOOK FOR THIS LINE
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
          <Toolbar style={{ height: '80px', justifyContent: 'center' }}>
            <Typography variant="h5" style={{ fontWeight: 'bold', color: '#fff' }}>
              CityQuest
            </Typography>
          </Toolbar>
          <div style={{ height: '5px', backgroundColor: '#ffffff', transition: 'height 0.3s' }} />
        </AppBar>

        <div style={{ marginTop: '100px' }}>
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
                style={{ margin: '20px auto', display: 'block', backgroundColor: '#F7A8CE' }} // Pastel pink button
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
                    {[...Array(10).keys()].map((num) => (
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
                style={{ marginTop: '20px', backgroundColor: '#F7A8CE' }} // Pastel pink button
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
                      <Typography variant="h6">{loc.name}</Typography>
                      <Typography variant="body1">Location {loc.number}</Typography>
                      <Button
                        variant="outlined"
                        style={{ marginTop: '10px', borderColor: '#F7A8CE', color: '#F7A8CE' }} // Pastel pink button
                        onClick={handleUploadImage} // Upload button triggers the snackbar
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
                style={{ marginTop: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#F7A8CE' }} // Pastel pink button
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

