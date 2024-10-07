import React, { useState, useEffect, useContext } from "react";
import '../styles/App.css'
import axios from 'axios';
import Track from "./Track"
import { Container, IconButton } from '@mui/material';
import { TableContainer, Table, TableBody, TableHead, tableCellClasses } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { SocketContext } from './App';

const History = ({ theme }) => {

  // handling mobile vs. desktop screen size
  const [isMobile, setMobile] = useState(window.innerWidth <= 600);
  const handleScreenSize = () => {
    setMobile(window.innerWidth <= 600);
  }

  useEffect(() => {
    window.addEventListener("resize", handleScreenSize);
    return () => window.removeEventListener("resize", handleScreenSize);
  })

  const socket = useContext(SocketContext);

  const [historyData, setHistoryData] = useState([])
  const [searchedHistory, setSearchedHistory] = useState(historyData)


  const [searching, setSearching] = useState(false)
  const [clickedSB, setClickedSB] = useState(theme.palette.common.misc)
  const [borderColor, setBC] = useState(".25vh solid " + theme.palette.common.border)


  function handleFocus() {
    setClickedSB(theme.palette.primary.main)
    setBC(".25vh solid " + theme.palette.primary.main)
  }

  function handleBlur() {
    setClickedSB(theme.palette.common.misc)
    setBC(".25vh solid " + theme.palette.common.border)
  }

  // Initialization
  useEffect(() => {

    let ignore = false;
    async function fetchHistory() {
      const result = await axios(process.env.REACT_APP_API_URL + '/playback/history');
      if (!ignore) setHistoryData(result.data.reverse());
    }
    fetchHistory();

    socket.on('updateHistory', (data) => {
      setHistoryData((prevData) => ([data, ...prevData]))
    })

    return () => {
      ignore = true;
      socket.off('updateHistory');
    }
  }, [])

  const searchHistory = (term) => {
    setSearchedHistory(historyData.filter((track) => (track.title.toLowerCase().includes(term.toLowerCase()) || track.artist.toLowerCase().includes(term.toLowerCase()))))
  }

  return (
    <div>
    { isMobile ? (
      // The following is returned when screen width < 600px
          <div style={{ minHeight: "100vh", width: "90vh", maxWidth: "100%" }}>

          <div style={{ display: "inline-flex", height: 100+ 'vh', marginTop: -100 * .05 + 'vh'}}>
    
            <Container style={{
              fontFamily: "'DM Sans', sans-serif", marginTop: 100 * .05+ 'vh', marginLeft: 100 * .01+ 'vw'
            }}>
    
              <div style={{ display: "flex", flexDirection: "row" }}>
                <input
                  style={{
                    marginTop: 100 * .018+ 'vh',
                    width: "90vw",
                    height: 100 * .06+ 'vh',
                    borderRadius: 100 * .015+ 'vh',
                    paddingLeft: 100 * .1 + 'vw',
                    paddingRight: 100 * .00875+ 'vw',
                    border: borderColor,
                    borderColor: theme.palette.common.border,
                    backgroundColor: theme.palette.background.secondary,
                    color: theme.palette.text.primary,
                    fontSize: "100%"
                  }}
    
                  type="search"
                  placeholder="Search with a word or artist"
                  className={theme.palette.mode == 'light'?"searchA":"searchB"}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
    
                  onChange={(e) => {
                    if (e.target.value.length > 0)
                      setSearching(true)
                    if (e.target.value.length == 0)
                      setSearching(false)
                    searchHistory(e.target.value)
    
                  }}
    
                />
    
                <IconButton
                  disableRipple
                  style={{
                    marginTop: 100 * .0235 + 'vh', marginLeft: -90 + 'vw', marginBottom: 100 * .000+ 'vh', height: 100 * .05+ 'vh',
                    width: 100 * .05+ 'vh', borderRadius: 80, display: "flex",
    
                    color: clickedSB
                  }}
                  onClick={() => { }}
                  type="button"
                  variant="contained"
                  children={<SearchRoundedIcon style={{ fontSize: 100 * .07+ 'vw' }} />}
                  fullWidth={false}
                >
                </IconButton>
    
              </div>
    
    
              <div
    
                style={{
                  overflowY: "hidden",
                  overflowX: "hidden",
                  border: '.25vh solid ' + theme.palette.common.border,
                  marginTop: 100 * .02+ 'vh', borderRadius: 100 * .015+ 'vh',
                  display: "flex", flexDirection: "row", fontWeight: "bold",
                  height: "75.3vh", backgroundColor: theme.palette.background.secondary, color: theme.palette.text.primary, width: "90vw",
                }}
    
              >
                <div style={{ width: "100%" }}>
                  {historyData.length === 0 ?
                    <div
    
                      style={{ fontWeight: "bold", overflowY: "auto", padding: 100 * 0.03+ 'vh', color: theme.palette.text.primary }}>
                      The party just started, no songs have been played.
                    </div>
                    :
                    <div style={{ borderRadius: 100 * .015+ 'vh', height: "69.4vh", width: "100%" }} >
                      {searching ?
                        <div style={{ margin: "2vh" }}>Results</div>
                        :
                        <div style={{fontWeight: 700, margin: "2vh", fontSize: '1.25vw' }}>Can't remember a song you want to replay?</div>
                      }
                      <div style={{ height: "5vh", fontWeight: 500, color: theme.palette.text.primary, fontSize: 100 * 0.01 + 'vw', paddingLeft: 100 * 0.015+ 'vw', paddingTop: 100 * 0.01 + 'vh'}} align="left">
                        Title
    
                      </div>
                      <div style={{ borderTop: ".25vh solid " + theme.palette.common.border, marginLeft: 100 * 0.01+ 'vw', width: 100 * .76+ 'vw', marginTop: 100 * .000+ 'vh' }} />
                      <TableContainer style={{
                        float: "left",
                        borderBottomLeftRadius: 100 * .015+ 'vh',
                        borderBottomRightRadius: 100 * .015+ 'vh',
                        backgroundColor: theme.palette.background.secondary, height: "62.5vh", width: "99.5%", overflowY: "auto", overflowX: "hidden" 
                      }}>
    
                        <Table sx={{
                          [`& .${tableCellClasses.root}`]: {
                            borderBottom: "none",
                          }
                        }}
                       >
                       
                          <TableBody>
    
    
                            {((searchedHistory.length > 0) ? searchedHistory : historyData.slice(1)).map((track, index) => (
    
                              <Track
                                track={track}
                                filter={Array.from({ length: historyData.length }, () => true)}
                                key={index}
                                clickable={true}
                                albumName={track.albumName}
                                duration={track.songDuration}
                                theme={theme}
                              />
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>}
                </div>
              </div>
            </Container>
          </div>
        </div>
    ) : (
    <div style={{ minHeight: "100vh", width: "80vh", maxWidth: "100%" }}>
      <Container style={{
        fontFamily: "'DM Sans', sans-serif", marginTop: 100 * .045+ 'vh', marginLeft: 100 * .01+ 'vw',
        fontSize: 100 * .021+ 'vw', fontWeight: "1000", color: theme.palette.text.primary
      }}>History</Container>

      <div style={{ display: "inline-flex", width: "100%", height: 100+ 'vh', marginTop: -100 * .05 + 'vh'}}>

        <Container style={{
          fontFamily: "'DM Sans', sans-serif", marginTop: 100 * .05+ 'vh', marginLeft: 100 * .01+ 'vw',
          width: 100 * .75+ 'vw',
        }}>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <input
              style={{
                marginTop: 100 * .018+ 'vh',
                width: 100 * .7775+ 'vw',
                height: 100 * .06+ 'vh',
                borderRadius: 100 * .015+ 'vh',
                paddingLeft: 100 * .027+ 'vw',
                paddingRight: 100 * .00875+ 'vw',
                border: borderColor,
                borderColor: theme.palette.common.border,
                backgroundColor: theme.palette.background.secondary,
                color: theme.palette.text.primary,
              }}

              type="search"
              placeholder="Search with a word or artist"
              className={theme.palette.mode == 'light'?"searchA":"searchB"}
              onFocus={handleFocus}
              onBlur={handleBlur}

              onChange={(e) => {
                if (e.target.value.length > 0)
                  setSearching(true)
                if (e.target.value.length == 0)
                  setSearching(false)
                searchHistory(e.target.value)

              }}

            />

            <IconButton
              disableRipple
              style={{
                marginLeft: -100 * .77525+ 'vw', marginTop: 100 * .023+ 'vh', marginBottom: 100 * .000+ 'vh', height: 100 * .05+ 'vh',
                width: 100 * .05+ 'vh', borderRadius: 80, display: "flex",

                color: clickedSB
              }}
              onClick={() => { }}
              type="button"
              variant="contained"
              children={<SearchRoundedIcon style={{ fontSize: 100 * .02+ 'vw' }} />}
              fullWidth={false}
            >
            </IconButton>

          </div>


          <div

            style={{
              overflowY: "hidden",
              overflowX: "hidden",
              border: '.25vh solid ' + theme.palette.common.border,
              marginTop: 100 * .02+ 'vh', borderRadius: 100 * .015+ 'vh',
              display: "flex", flexDirection: "row", fontWeight: "bold",
              height: "75.3vh", backgroundColor: theme.palette.background.secondary, color: theme.palette.text.primary,
              fontSize: '1.5vw', width: 100 * .7775+ 'vw'
            }}

          >
            <div style={{ width: "100%" }}>
              {historyData.length === 0 ?
                <div

                  style={{ fontWeight: "bold", overflowY: "auto", padding: 100 * 0.03+ 'vh', color: theme.palette.text.primary }}>
                  The party just started, no songs have been played.
                </div>
                :
                <div style={{ borderRadius: 100 * .015+ 'vh', height: "69.4vh", width: "100%" }} >
                  {searching ?
                    <div style={{ margin: "2vh" }}>Results</div>
                    :
                    <div style={{fontWeight: 700, margin: "2vh", fontSize: '1.25vw' }}>Can't remember a song you want to replay?</div>
                  }
                  <div style={{ height: "5vh", fontWeight: 500, color: theme.palette.text.primary, fontSize: 100 * 0.01 + 'vw', paddingLeft: 100 * 0.015+ 'vw', paddingTop: 100 * 0.01 + 'vh'}} align="left">
                    Title

                  </div>
                  <div style={{ borderTop: ".25vh solid " + theme.palette.common.border, marginLeft: 100 * 0.01+ 'vw', width: 100 * .76+ 'vw', marginTop: 100 * .000+ 'vh' }} />
                  <TableContainer style={{
                    float: "left",
                    borderBottomLeftRadius: 100 * .015+ 'vh',
                    borderBottomRightRadius: 100 * .015+ 'vh',
                    backgroundColor: theme.palette.background.secondary, height: "62.5vh", width: "99.5%", overflowY: "auto", overflowX: "hidden" 
                  }}>

                    <Table sx={{
                      [`& .${tableCellClasses.root}`]: {
                        borderBottom: "none",
                      }
                    }}
                   >
                   
                      <TableBody>


                        {((searchedHistory.length > 0) ? searchedHistory : historyData.slice(1)).map((track, index) => (

                          <Track
                            track={track}
                            filter={Array.from({ length: historyData.length }, () => true)}
                            key={index}
                            clickable={true}
                            albumName={track.albumName}
                            duration={track.songDuration}
                            theme={theme}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>}
            </div>
          </div>
        </Container>
      </div>
    </div>)
    }
    </div>
  )
};

export default History;
