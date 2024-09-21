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
import axios from 'axios';

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
  const [imageUrl, setImageUrl] = useState([]);

  const [data, setData] = useState('');
  const [randomImage, setRandomImage] = useState('');


  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [hiddenLocations, setHiddenLocations] = useState([]);

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


  const handleUploadImage = async (index) => {
    // console.log(imageUrl[index]);
    // console.log('https://bkeppsbsb0.execute-api.us-east-1.amazonaws.com/default/cityquest-image-checker-dev-handler?location=' + locations[index]['name'] + '&base64_image=' + imageUrl[index])

    await axios.post(
      'https://bkeppsbsb0.execute-api.us-east-1.amazonaws.com/default/cityquest-image-checker-dev-handler?location=' + encodeURIComponent(locations[index]['name']),
      {
        base64_image: imageUrl[index],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).then(function (response) {
      // console.log(response);
      if (response['data']['is_location'] === true) {
        setSnackbarMessage(`Overview: ${data['data']['locations'][index]['overview']}\nFacts: ${data['data']['locations'][index]['facts']}`);
        setHiddenLocations((prevHidden) => [...prevHidden, index]); // Mark the location as hidden
      } else {
        setSnackbarMessage('Invalid image');
      }
      setShowSnackbar(true); // Move this inside the then block
      return response;
    });
    
  };

  const handleImageChange = (index) => (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set the desired width and height for the compressed image
          const maxWidth = 400;
          const maxHeight = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          const base64String = canvas.toDataURL('image/jpeg', 0.1).split(',')[1]; // Compress to 70% quality
          setImageUrl((prevImageUrls) => {
            const newImageUrls = [...prevImageUrls];
            newImageUrls[index] = base64String; // Set the base64 string at the specified index
            return newImageUrls;
          });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    document.getElementById('fileInput').click();
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
                {locations.map((loc, index) => (
                  !hiddenLocations.includes(index) && ( // Conditionally render based on hiddenLocations
                    <Grid item xs={12} sm={6} md={4} key={loc.number}>
                      <Card style={{ padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
                        <Typography variant="h6">{loc.name}</Typography>
                        <Typography variant="body1">Location {loc.number}</Typography>
                        <input
                          id={`fileInput-${index}`}
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange(index)} // Pass the index here
                          style={{ display: 'none' }}
                        />
                        <Button
                          variant="outlined"
                          style={{ marginTop: '10px', borderColor: '#F7A8CE', color: '#F7A8CE' }}
                          onClick={() => document.getElementById(`fileInput-${index}`).click()}
                        >
                          Upload Picture
                        </Button>
                        {imageUrl[index] && (
                          <img
                            src={`data:image/jpeg;base64,${imageUrl[index]}`}
                            alt="Selected"
                            style={{
                              marginTop: '10px',
                              maxWidth: '100%',
                              height: 'auto',
                            }}
                          />
                        )}
                        <Button
                          variant="contained"
                          style={{ marginTop: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#F7A8CE' }} // Pastel pink button
                          onClick={() => handleUploadImage(index)} // Pass the index here
                        >
                          Submit!
                        </Button>
                      </Card>
                    </Grid>
                  )
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
          autoHideDuration={10000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
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
