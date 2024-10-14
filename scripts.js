console.log("Let's Write JavaScript")
let currentSong = new Audio();



function formatTime(seconds) {
    // Calculate the number of minutes
    let minutes = Math.floor(seconds / 60);
    
    // Calculate the remaining seconds
    let remainingSeconds = Math.floor(seconds % 60);

    // Ensure both minutes and seconds are two digits (e.g., 01, 09)
    let formattedMinutes = String(minutes).padStart(2, '0');
    let formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted time as "minutes:seconds"
    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs(){
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text()
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        if (element.href.endsWith("mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
        
    }
    return(songs)
}


const playMusic = (track, pause=false)=>{
    // let audio = new Audio("songs/" + track)
    currentSong.src = "songs/" + track
    if(!pause){

        currentSong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main(){

    
    // Get the list all songs
    let songs = await getSongs()
    playMusic(songs[0], true)
    // console.log(songs)

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 
                        <img src="music.svg" class="invert" alt="">
                        <div class="info">
                            <div> ${song.replaceAll("%20", " ").replace("%2", " ")}</div>
                            <div>Shadoww Hokage</div>
                        </div>
                        <div class="playnow">
                            <span>PLay Now</span>
                            <img src="play.svg" class="invert" alt="">
                        </div>
        </li>`;
    }
        //Attach an eventlistener to each song
        Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
            e.addEventListener("click", element=>{
                console.log(e.querySelector(".info").firstElementChild.innerHTML)
                playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

            })
        })
    

    //Attach an event listener to play, next and previous
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "play.svg"
        }
    })
   
    //Listen for timeupdate event
    currentSong.addEventListener("timeupdate", ()=>{
        console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //Add an event listener to seek bar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration) * percent / 100;
    })


    // Add event listener to hamburger

    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    })

    //Add an event listener to close button

    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%"
    })
    
    
}

main()