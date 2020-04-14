
function doStory() {
	alertify.alert().setting('modal', false);
  alertify.confirm().setting('modal', false);
	alertify.alert("???", "Wake up... Please wake up...");
	alertify.alert("", "You sit up and groan.")
	alertify.alert("You", "W-where am I?");
}
document.onload(doStory());