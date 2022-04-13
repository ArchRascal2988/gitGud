var gamesArray =[]

//global hooks
const imgC= document.querySelector("#gameImage");
const carouselEl= $("#top5");
const infoC= $("#gameInfo");
const olEl= $("#games");
console.log(imgC);

//global variables for the twitch authorization
const twitchClientId = "ddg5ztvzrbtcgwze0t9jbb6wqn5dj0";
const twitchSecretId= "axxonlvfp1hw6c4omorwefqwjno7o0";
var twitchUrl = "https://api.twitch.tv/helix/"



var formEl= $("#gameFind");


function free2GameFetch(platform, category,){
    var url = `https://floating-headland-95050.herokuapp.com/https://www.freetogame.com/api/games?platform=${platform}&category=${category}&sort-by=popularity`

    return fetch(url)
    .then(function(res){
        return res.json();
    })
    .then(function(data){
        //console.log(data)
        return data
    })
}

//makes list of games using fetch from free2Game
async function createGameList(x,y){
    gamesArray=[];
    olEl.empty();
    gameFetch = await free2GameFetch(x , y);
  
    for (i = 0; i < 10; i++){
        gamesArray.push(gameFetch[i].title)
        var listItem= $("<li>");
        var gameB= $("<button>")
        gameB.addClass("gameBtn");
        gameB.text(gameFetch[i].title);
        olEl.append(listItem);
        listItem.append(gameB);
        gameB.on("click", function(event){
            event.preventDefault();
            fetchGameId(event.target.innerHTML);
        });
    }
}

//this function makes the access token that is recquired each time we fetch from twitch
function getTwitchAuthorization(){
    let url = `https://id.twitch.tv/oauth2/token?client_id=${twitchClientId}&client_secret=${twitchSecretId}&grant_type=client_credentials`;
    return fetch(url , {method: "POST"})
    .then(function(respond){
        return respond.json()
    })
    .then(function(data){
        return data;
    });
}
    
//these variables are to test the twitchGrab function.

async function twitchGrab(endpoint){
    
    let tokenObject = await getTwitchAuthorization();
    console.log(tokenObject)
    
    let accesToken = tokenObject.access_token;
    let bearer = tokenObject.token_type;

    console.log(accesToken);
    console.log(bearer)
    
    bearer = bearer.substring(0,1).toUpperCase() + bearer.substring(1,bearer.length);

    let authorization = `${bearer} ${accesToken}`

    let headers = {
        authorization, "client-Id": twitchClientId
    };

    twitchEndpoint = twitchUrl + endpoint

    return fetch(twitchEndpoint , {headers})
    .then(function(respond){
        return respond.json()
    })
    .then(function(data){
        return data;
    });
}

async function fetchGameId(gameName){
    var gameEndpoint= `games?name=${gameName}`;
    var twitchData = await twitchGrab(gameEndpoint)
    console.log(twitchData)
    var gameId = twitchData.data[0].id;
    var streamEndpoint = `streams?first=5&game_id${gameId}`;
}

$(document).ready(); 
formEl.on("submit", function(event){
    event.preventDefault();
    var pSelected= $('#sPlat').find(":selected");
    var gSelected= $('#sGenre').find(":selected");
    var platform= pSelected[0].dataset.platform;
    var genre= gSelected[0].dataset.genre;
    createGameList(platform, genre);
});




 //game picture 
    // gamePic = "https://static-cdn.jtvnw.net/ttv-boxart/" + gameId + "-300x400.jpg";
    // console.log(gamePic);
    // gameImageEl.src = gamePic; //gameImageEl = document.getElementId("gameImage") 

    // for loop to pull Streamer Data 
    // for (var i = 0; i < 5; i++) {
    //     var userName = document.createElement('h3'); //Element creation subject to change
    //     var liveStatus = document.createElement('p'); //Element creation subject to change
    //     var viewercount = document.createElement('p'); //Element creation subject to change
    //     var link = document.createElement('a'); //Element creation subject to change
    //     userName.textContent = "Username: " + twitchData.data[i].user_name;
    //     liveStatus.textContent = twitchData.data[i].type.toUpperCase();
    //     viewercount.textContent = "Viewers: " + twitchData.data[i].viewer_count;
    //     link.setAttribute('href', "https://www.twitch.tv/" + twitchData.data[i].user_name);
    //     link.setAttribute("target", "_blank");
    //     link.innerHTML = "https://www.twitch.tv/" + twitchData.data[i].user_name
    //     // thumbnail.frameBorder = 0;
    //     // thumbnail.allowFullscreen = "true";
    //     // // thumbnail.scrolling = "no";
    //     // thumbnail.style.height = 300;
    //     // thumbnail.style.width = 400;
    //     topTwitch.append(userName); // topTwitch will change via HTML id
    //     topTwitch.append(liveStatus);
    //     topTwitch.append(viewercount);
    //     topTwitch.append(link);
    //   }

