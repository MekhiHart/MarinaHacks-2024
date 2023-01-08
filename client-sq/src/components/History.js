import React, { useState, useEffect } from "react";
import '../styles/App.css'
import axios from 'axios';
import Track from "./Track"
import { Container, IconButton } from '@mui/material';
import { Divider, TableContainer, Table, TableBody, TableHead, tableCellClasses } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

function History() {

    const [historyData, setHistoryData] = useState([])
    const [searchedHistory, setSearchedHistory] = useState(historyData)

    // Hook handling retrieving the data of the queue from the backend.
    useEffect(() => {
        let ignore = false;

        async function fetchHistory() {
            const result = await axios('http://localhost:3001/playback/history');
            if (!ignore) setHistoryData(result.data);
        }

        const interval = setInterval(() => {
            fetchHistory();
        }, 1000);

        return () => { ignore = true; clearInterval(interval); }
    }, [])

    const searchHistory = (term) => {
        setSearchedHistory(historyData.filter((track) => (track.title.toLowerCase().includes(term.toLowerCase()) || track.artist.toLowerCase().includes(term.toLowerCase()))))
    }

    return (

        <div style={{ minHeight: "100vh", width: "80vh", maxWidth: "100%" }}>
            <Container style={{
                fontFamily: "'DM Sans', sans-serif", marginTop: window.innerHeight * .05, marginLeft: window.innerWidth * .01,
                fontSize: window.innerWidth * .02, fontWeight: "1000", color: "#3d435a"
            }}>History</Container>

            <div style={{ display: "inline-flex", width: "100%", height: window.innerHeight, marginTop: -window.innerHeight * .05 }}>

                <Container style={{
                    fontFamily: "'DM Sans', sans-serif", marginTop: window.innerHeight * .05, marginLeft: window.innerWidth * .01,// outline: '.3vh solid #e00000',
                    width: window.innerWidth * .75,
                }}>


                    <input
                        style={{
                            marginTop: window.innerHeight * .018,
                            width: window.innerWidth * .783,
                            height: window.innerHeight * .065,
                            borderRadius: window.innerHeight * .015,
                            //background: "transparent",
                            paddingLeft: window.innerWidth * .035,
                            paddingRight: window.innerWidth * .00875,

                            border: '.3vh solid #e0e4f2'
                        }}
                        type="search"
                        placeholder="Search with a word or artist"

                        className="searchA"



                        onChange={(e) => { searchHistory(e.target.value) }}

                    />
                    <IconButton

                        style={{
                            marginLeft: window.innerWidth * .0025, marginTop: -window.innerHeight * .063, marginBottom: window.innerHeight * .002, height: window.innerHeight * .06,
                            width: window.innerHeight * .06, borderRadius: 80, display: "flex",

                            color: "#496fff"
                        }}
                        onClick={() => { }}
                        type="button"
                        variant="contained"
                        children={<SearchRoundedIcon style={{ fontSize: window.innerWidth * .023 }} />}
                        fullWidth={false}
                    >
                    </IconButton>

                    <div
                        style={{ border: '.3vh solid #e0e4f2', marginTop: window.innerHeight * .023, borderRadius: window.innerHeight * .015, display: "flex", flexDirection: "row", fontWeight: "bold", height: "75vh", backgroundColor: "#ffffff", color: "#3d435a", fontSize: window.innerWidth * 0.0154, width: window.innerWidth * .783 }}
                    >
                        <div style={{ width: "100%" }}>
                            {historyData.length === 0 ?
                                <div

                                    style={{ fontWeight: "bold", overflowY: "auto", padding: window.innerHeight * 0.03, color: "#3d435a", fontSize: window.innerWidth * 0.0154 }}>
                                    Loading history...
                                </div>
                                :
                                <div style={{ borderRadius: window.innerHeight * .015, height: "77vh", width: "100%" }} >
                                    <div style={{ height: "5vh", fontWeight: "bold", color: "#3d435a", fontSize: window.innerWidth * 0.01, paddingLeft: window.innerHeight * 0.03, paddingTop: window.innerHeight * 0.02 }} align="left">
                                        Title

                                    </div>
                                    <Divider sx={{ borderTop: ".2vh solid #e0e4f2" }} component="nav" style={{ marginLeft: window.innerWidth * 0.01, width: window.innerWidth * .76, marginTop: window.innerHeight * .000 }} />
                                    <TableContainer style={{ float: "right", borderBottomLeftRadius: window.innerHeight * .015, borderBottomRightRadius: window.innerHeight * .015, backgroundColor: '#ffffff', height: "72vh", width: "99.5%", overflowX: "hidden" }}>

                                        <Table sx={{
                                            [`& .${tableCellClasses.root}`]: {
                                                borderBottom: "none",
                                            }
                                        }}
                                            stickyHeader aria-label="sticky table">
                                            <TableHead style={{ width: window.innerHeight * 0.954 }} sx={{}}>


                                            </TableHead>
                                            <TableBody>


                                                {(searchedHistory.length > 0 ? searchedHistory.slice(0).reverse() : historyData.slice(0).reverse()).map(track => (

                                                    <Track
                                                        track={track}
                                                        filter={Array.from({ length: historyData.length }, () => true)}
                                                        key={track.uri}
                                                        clickable={true}
                                                        albumName={track.albumName}
                                                        duration={track.songDuration}
                                                    />
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            }

                        </div>

                    </div>
                </Container>

            </div>
        </div>
    )
}

export default History;
