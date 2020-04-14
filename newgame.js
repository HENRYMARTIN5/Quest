var r = confirm("Are you sure you would like to start a new game? All previous progress will be lost.");
if (r == true) {
	localStorage.setItem("savePointSeason", "1");
	localStorage.setItem("savePointEpisode", "1");
	document.location.href = "/game.html";
} else {
	document.location.href = "/index.html";
}
