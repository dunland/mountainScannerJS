const movingRegion = document.querySelector('.moving-region');
var values, centerX;

// ---------------- Script wrapper: ------------------
fetch("./data.json")
    .then((res) => res.json())
    .then((data) => {
        values = data.values;
        moveRegion();
    })


// ------------------- functions: --------------------
function moveRegion() {
    let position = 0, regionWidth = 20;
    const screenWidth = window.innerWidth;
    console.log(innerWidth, screenWidth);
    const moveSpeed = 1; // Adjust the speed of the moving region

    function animate() {
        position += moveSpeed;
        centerX = position + regionWidth / 2;
        if (position > screenWidth) {
            position = -regionWidth; // Reset the position when the region moves out of the screen
        }

        const index = Math.floor((centerX / screenWidth) * values.length);
        const value = values[index];
        displayValue(centerX, value);

        movingRegion.style.left = position + 'px';
        let xpos = screenWidth - position;
        movingRegion.style.backgroundPosition = `${xpos}px 0px`;
        requestAnimationFrame(animate);
    }

    animate();
}

// TODO: Function to invert the pixels of the underlying image
function invertImage() {
    const fullscreenImage = document.querySelector('.fullscreen-image');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = fullscreenImage.width;
    canvas.height = fullscreenImage.height;

    ctx.drawImage(fullscreenImage, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i]; // Invert the red channel
        data[i + 1] = 255 - data[i + 1]; // Invert the green channel
        data[i + 2] = 255 - data[i + 2]; // Invert the blue channel
        // Alpha channel (data[i + 3]) is unchanged
    }

    ctx.putImageData(imageData, 0, 0);
    // fullscreenImage.src = canvas.toDataURL(); // Update the image with inverted pixels
    // TODO:
    // movingRegion.style.backgroundImage = imageData;
}

function displayValue(x, y) {

    const valueElement = document.querySelector('.value-display');

    // Update the position and content of the value display
    valueElement.style.left = x + 15 + 'px';
    valueElement.style.top = y - 15 + 'px';
    valueElement.textContent = '___' + y;
}
