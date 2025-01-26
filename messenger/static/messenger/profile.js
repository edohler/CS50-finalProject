document.addEventListener('DOMContentLoaded', function() {
document.querySelector('#picture-form').addEventListener('submit', picture);

main();
})

function main(event) {
	let img = document.querySelector(".profile-picture");
	img.addEventListener('load', function() {
		let currWidth = img.naturalWidth;
	    let currHeight = img.naturalHeight;
	    console.log(currWidth);
	    console.log(currHeight);
	    if (currWidth > currHeight) {
	    	img.setAttribute("id", "picture-wide");
	    } else {
	    	img.setAttribute("id", "picture-long");
	    }
	})
    
}


function picture(event) {
	const input = document.querySelector('#new-picture').value;
	fetch('/picture/blank', {
		method: 'PUT',
		body: JSON.stringify({
			body: input
		})
	})
	.then(response => response.json())
	.then(result => {
		console.log(result);
		document.querySelector('.profile-picture').src = input;
	});
	event.preventDefault();
}