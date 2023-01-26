// Component for showing track details
import { useState, React } from "react"
import axios from 'axios';
import { Slide, Fade, TableCell, TableRow } from '@mui/material';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { IconButton } from '@mui/material';

const Track = ({ track, clickable, num, theme }) => {
  const [clicked, setClicked] = useState(false)
  const [disable, setDisabled] = useState(false)
  const [fade, setSlide] = useState(true)
  let unqueueable = false

  if (!track.filter)
    unqueueable = true
  if (track.explicit)
    unqueueable = true


  function handleAdd() {
    if (!track.explicit && clickable && track.filter) axios.post(process.env.REACT_APP_API_URL + "/queue/add", {
      title: track.title,
      artist: track.artist,
      albumUrl: track.albumUrl,
      albumName: track.albumName,
      songDuration: track.songDuration,
      uri: track.uri,
      explicit: track.explicit

    })
      .then(res => {
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      });

    setClicked(true)
    setDisabled(true)
    setTimeout(() => {
      setClicked(false)
    }, 3000)
    setTimeout(() => {
      setSlide(false)
    }, 2500)
  }

  function secondsToMinutes(milliSeconds) {
    let seconds = parseFloat((milliSeconds / 1000) % 60).toFixed(0)
    let minutes = Math.floor((milliSeconds / 1000) / 60)
    if (seconds < 10) {
      return minutes.toString() + ":0" + seconds.toString()
    }
    return minutes.toString() + ":" + seconds.toString()




  }

    return (
      
        <>  
        {clickable==false?
        <Fade key = {num && track.title} in={true} timeout={1000}><TableRow  
             hover={true} > 
              <div  style={{width: '.9vw', marginLeft: -window.innerWidth*0.007}}></div>
             <TableCell style={{ width: '2.15vw',padding: "2.08vh .55vw",fontSize: window.innerHeight*0.018, fontWeight : 500,fontFamily:"DM Sans",color: "#6d7285" }}>{num+1}
             </TableCell>
          
          <TableCell style={{ padding: ".7vh 1.1vw",width: window.innerWidth*0.01 }} align="left">
                
                <img src={track.albumUrl} alt={track.title} style={{height : window.innerWidth*0.02625, width:window.innerWidth*0.02625}} />
                
              </TableCell> 
              <div  style={{ marginLeft: -window.innerWidth*0.007, alignItems: "center", align: "center"}}>

              <TableCell style={{ padding: "1.3vh .8vw",width: window.innerWidth*0.3, fontFamily:"DM Sans", color: theme.palette.text.primary}} align="left">
                <div style={{ marginBottom: -window.innerHeight*0.005, fontWeight : "bold", fontSize: window.innerHeight*0.018}}>
                  {track.title}
                </div>
                <div style={{ fontWeight : 500, color: "#6d7285", fontSize: window.innerHeight*0.015}}>
                  {track.artist}
                </div>
              </TableCell> 
              </div>


           </TableRow> 
           </Fade>: 
        <Slide direction = 'down' in={true} timeout={500}>
          
            <TableRow  
             hover={true} >  
             
            <div  style={{width: '.9vw', marginLeft: -window.innerWidth*0.007}}></div>
          
              {/* image  */}
                
              <TableCell style={{ padding: ".75vh .9vw",width: window.innerWidth*0.01 }} align="left">
              
                <img src={track.albumUrl} alt={track.title} style={{height : window.innerWidth*0.034, width: window.innerWidth*0.034}} />
             
              </TableCell> 
            
              <div  style={{ marginLeft: -window.innerWidth*0.007, alignItems: "center", align: "center"}}>
              {/* Title and Artist  */}
              
              <TableCell style={{ padding: "1.4vh .6vw",width: window.innerWidth*0.3, fontFamily:"DM Sans", color:theme.palette.text.primary}} align="left">
                <div style={{ fontWeight : "bold", fontSize : window.innerHeight*0.02}}>
                  {track.title}
                </div>
                <div style={{ fontWeight : 500, color: "#6d7285", fontSize: window.innerHeight*0.018}}>
                  {track.artist}
                </div>
              </TableCell>
             
              </div>
              
          

              {/* Button Add to Queue */}
              <TableCell style={{padding: "0vh", paddingRight: "1vw"}} align="right">
              {
                 !unqueueable && clickable? 
                
                 <IconButton onClick={handleAdd} disabled = {disable} disableRipple disableTouchRipple style={{  marginRight: -window.innerWidth*0.008}} >
                 {
                 !clicked?
                 !disable?
                 
                 <AddCircleOutlineRoundedIcon  sx={{  fontSize: '2.2vw', color: theme.palette.primary.main}}/>
                
                
                  :

                  <Fade in={disable} timeout={500}>
                  <AddCircleOutlineRoundedIcon  sx={{  fontSize: '2.2vw'}}/>
                  </Fade>
                
                  :
                  <Fade in={fade} timeout={500}>
                 <CheckCircleRoundedIcon sx={{  fontSize: '2.2vw', color: theme.palette.primary.main }}/>
                 </Fade>
                 }
                 </IconButton>
                
                 : clickable ? 
               
                 <IconButton variant="outlined" disabled style={{  marginRight: -window.innerWidth*0.008}}>
                     <AddCircleOutlineRoundedIcon   sx={{ fontSize:window.innerWidth*0.022, }}/>
                 </IconButton>: null
              }  
              </TableCell> 
            </TableRow>
            </Slide>
            }
        </>
       
        
    )

}
export default Track;
