// requestAnim shim layer by Paul Irish
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
        };
})();


// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
    requestAnimFrame( animate );
    var currentTime = new Date().getTime();
    if (mLastFrameTime === 0) {
        mLastFrameTime = currentTime;
    }

    if ((currentTime - mLastFrameTime) > mWaitTime) {
        swapPhoto();
        mLastFrameTime = currentTime;
    }
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/

// Counter for the mImages array
var mCurrentIndex = 0;

// Array holding GalleryImage objects (see below).
var mImages = [];

// Holds the retrieved JSON information
var mJson;



function swapPhoto() {
	//Add code here to access the #slideShow element.
	//Access the img element and replace its source
	//with a new image from your images array which is loaded 
	//from the JSON string

    // The if statement will check the length of mImages, and if the currentIndex is < than '0' it will increment
    if(mCurrentIndex < 0){
        mCurrentIndex += mImages.length;
    }

    // The attr() method will set and return attributes and values of the selected elements
    $("#photo").attr('src', mImages[mCurrentIndex].imgPath);

    // Ex: .location is a class accessing from HTML file
    // .text is a property that will set or return text value
    // Ex: It will get the text from the image file and will display on web based on the image is selected
    $(".location").text("Location: "+mImages[mCurrentIndex].imgLocation);
    $(".description").text("Description: "+mImages[mCurrentIndex].description);
    $(".date").text("Date: "+mImages[mCurrentIndex].date);

    mCurrentIndex++;
    if(mCurrentIndex >= mImages.length){
        mCurrentIndex = 0;
    }

	console.log('swap photo');
}

function getQueryLocation(ql) {
    ql = ql.split("+").join(" ");
    var queryLocation = {}, tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(ql)){
        queryLocation[decodeURIComponent(tokens(1))] = decodeURIComponent(tokens(2));
    }

    return queryLocation;
}
// Requesting $_GET variable
var $_GET = getQueryLocation(document.location.search);

// URL for the JSON to load by default
// Some options for you are: images.json, images.short.json; you will need to create your own extra.json later
// The if and else statement checks if either one json file become true
var mUrl = 'images.json';


console.log(mUrl);

// XMLHttpRequest variable
// Property contains the event handler to be called when the readystatechange event is fired
// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/onreadystatechange
// mRequest will fetch information about the image.
// Create a JSON object that contains the retrieved JSON string, a list of photo URL

var mRequest = new XMLHttpRequest();
mRequest.onreadystatechange = function() {
    if (mRequest.readyState == 4 && mRequest.status == 200){
        try{
            mJson = JSON.parse(mRequest.responseText);
            console.log(mJson);
            console.log(mJson.images[1].date);

            // For loop will check the image length and if its less than 0, it will increment by 1,
            // and push() the description on the page
            // mJson.images[i] is an array which starts from 0
            // Push() add thing
            for (var i = 0; i < mJson.images.length; i++) {
                mImages.push(new GalleryImage(mJson.images[i].imgLocation, mJson.images[i].description,
                    mJson.images[i].date, mJson.images[i].imgPath));
            }

            // the catch will check for error and will display message,
            // if something is wrong in try, when requesting image descriptions
        } catch (err) {
            console.log(err.message);
        }
    }
};

// The XMLHttpRequest method open() initializes a newly-created request or re-initializes an existing one.
mRequest.open("GET", mUrl, true);
// The XMLHttpRequest method send() the request to the server
mRequest.send();


//You can optionally use the following function as your event callback for loading the source of Images from your json data (for HTMLImageObject).
//@param A GalleryImage object. Use this method for an event handler for loading a gallery Image object (optional).
function makeGalleryImageOnloadCallback(galleryImage) {
	return function(e) {
		galleryImage.img = e.target;
		mImages.push(galleryImage);
	}
}


$(document).ready( function() {
    //this initially hides the photos' metadata information
    $('.details').eq(0).hide();

    // When click on the arrow the indicator will rotate 90 horizontally
    // The click() method attaches an event handler function to an HTML element
    // The function will is executed when the user clicks on the HTML element
    $(".moreIndicator").click(function(){

        // The toggleClass() method toggles the arrow. Like turn it on and off
        $( "img.rot90" ).toggleClass("rot270",3000);
        // The slideToggle method is used to switch between the slideup and slidedown details.
        $(".details").slideToggle(1000);
    });

    // swapPhoto to next
    $("#nextPhoto").click(function(){
        swapPhoto();

    });

    $("#prevPhoto").click(function(){
        mCurrentIndex -= 2;
        console.log(mCurrentIndex);
        swapPhoto();
    });

});



window.addEventListener('load', function() {
	console.log('window loaded');
}, false);

function GalleryImage(imgLocation, description, date, imgPath) {
	//implement me as an object to hold the following data about an image:
	//1. location where photo was taken
	//2. description of photo
	//3. the date when the photo was taken
	//4. either a String (src URL) or an an HTMLImageObject (bitmap of the photo. https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement)

	this.imgLocation = imgLocation;
	this.description = description;
	this.date = date;
	this.imgPath = imgPath;
}