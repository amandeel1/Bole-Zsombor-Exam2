function getData(url, callbackFunc) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      callbackFunc(this);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

function successAjax(xhttp) {
  var movieDatas = JSON.parse(xhttp.responseText);

  var movieArray = movieDatas.movies;

  sortingByTitle(movieArray);
  changeCategories(movieArray);
  listMovies(movieArray);
  console.log(movieArray);
}

getData("/json/movies.json", successAjax);

function changeCategories(movieArray) {
  for (let i = 0; i < movieArray.length; i++) {
    let categories = movieArray[i].categories;
    for (let j = 0; j < categories.length; j++) {
      categories[j].replace(/\b\w/g, j => j.toUpperCase());
    }
  }
}

function getPictures(title) {
  const hunChars = {
    á: "a",
    é: "e",
    í: "i",
    ó: "o",
    ú: "u",
    ö: "o",
    ő: "o",
    ü: "u",
    ű: "u"
  };
  title = title
    .toLowerCase()
    .replace(/[\?:;,\.\+\\&*]/g, "")
    .replace(/[áéíóúöőüű]/g, c => hunChars[c])
    .replace(/ +/g, "-");

  return title;
}
//   for (let i in movieArray) {
//     movieArray[i].title.replace(/\b\w/g, j => j.toLowerCase);
//     movieArray[i].title.replace(/\u&#32/g, j => "-");
//     return movieArray[i].title;

//   for (let i = 0; i < movieArray.length; i++) {
//     let title = movieArray[i].title;
//     for (let j = 0; j < title.length; j++) {
//       title[j].replace(/\b\w/g, j => j.toLowerCase);
//       title[j].replace(/\u&#32/g, j => "-");
//     }
//   }

function sortingByTitle(movieArray) {
  movieArray.sort(function(a, b) {
    var titleA = a.title.toLowerCase();
    var titleB = b.title.toLowerCase();
    if (titleA < titleB) {
      return -1;
    }
    if (titleA > titleB) {
      return 1;
    }
    return 0;
  });
}

function listMovies(movieArray) {
  var mainDiv = document.getElementById("main");
  var statButton = document.getElementById("statistics");
  statButton.addEventListener("click", function() {
    statistics(movieArray);
  });
  for (let i in movieArray) {
    var cover = `/img/covers/${getPictures(movieArray[i].title)}.jpg`;
    var actorCover = `/img/actors/${getPictures(
      movieArray[i].cast[0].name
    )}.jpg`;
    var newDiv = document.createElement("div");
    var newP = document.createElement("p");
    var newImg = document.createElement("img");
    var actorImg = document.createElement("img");
    newImg.addEventListener("click", function() {
      movieDetails(movieArray);
    });
    newP.innerHTML = `Cím: ${movieArray[i].title}<br> Hossz: ${
      movieArray[i].timeInMinutes
    } perc <br> Premier: ${movieArray[i].premierYear} <br> Kategória: ${
      movieArray[i].categories
    } <br> Rendező: ${movieArray[i].directors}<br>Szereplők: ${
      movieArray[i].cast[0].name
    }, ${movieArray[i].cast[1].name}`;
    newDiv.setAttribute("class", "small-div");
    newImg.setAttribute("class", "cover-image");
    newImg.setAttribute("src", `${cover}`);
    actorImg.setAttribute("src", `${actorCover}`);
    actorImg.setAttribute("class", "small-image");
    newDiv.appendChild(newImg);
    newDiv.appendChild(newP);
    newDiv.appendChild(actorImg);
    mainDiv.appendChild(newDiv);
  }
}

function statistics(movieArray) {
  var sideDisplay = document.getElementById("side");
  var hossz = 0;
  var actor = new Map();
  var director = new Map();
  for (var i in movieArray) {
    hossz += movieArray[i].timeInMinutes / 60;
    var currentValue = 0;
    if (actor.has(movieArray[i].cast.name)) {
      actor.set(movieArray[i].cast.name, currentValue + 1);
    } else {
      actor.set(movieArray[i].cast.name, 1);
    }
  }
  sideDisplay.innerHTML += `Az összes film hossza: ${parseFloat(
    Math.round(hossz * 100) / 100
  ).toFixed(2)} óra, átlagban ${parseFloat(
    Math.round(hossz * 100) / 100 / 90
  ).toFixed(2)} óra/film.`;
}
function movieDetails(movieArray) {
  var foundImg = document.querySelector("#pictureDisplay>img");

  foundImg.setAttribute(
    "src",
    `https://ih0.redbubble.net/image.24642557.6113/flat,800x800,070,f.u3.jpg`
  );
}
function stringMatch(base, substring) {
  if (base.toLowerCase().indexOf(substring.toLowerCase()) !== -1) {
    return true;
  } else {
    return false;
  }
}

function searchByTitle(movieArray) {
  var searchValue = document.getElementById("movieSearch").value;
  for (var i = 0; i < data.length; i++) {
    //console.log(stringMatch(data[i].title, searchValue));
    if (stringMatch(movieArray[i].title, searchValue)) {
      movieDetails(movieArray[i]);
      // console.log('found match: ' + data[i].title)
    } else {
      //console.log("none");
    }
  }
}
