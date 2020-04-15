alertify.set('notifier','position', 'bottom-left');
function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}
function say(text){
	alertify.notify(text);
}
async function doStory() {
		say("<b>???:</b>  Wake up... Please wake up...");
		await sleep(1000);
		say("<i>You sit up and groan.</i>");
		await sleep(500)
		say("<b>You:</b>  W-where am I?")
		await sleep(1000)
		say("<b>???:</b>  All in good time...")
		await sleep(1000)
		say("<b>???:</b>  Now, let's get you back on your feet.")
		await sleep(1000)
		say("<b>GAME:</b><i>  Use the W, A, S and D keys to move around.</i>")
		await sleep(100)
		say("<b>GAME:</b><i>  Click on the screen and use your mouse to look around.</i>")
		
}
document.onload = doStory();