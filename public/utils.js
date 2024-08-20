export function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function getRandomColorWithSameLightness(lightness = 50) {
  // Generate random hue between 0 and 360
  const hue = Math.floor(Math.random() * 360);

  // Generate random saturation between 40 and 100
  const saturation = Math.floor(Math.random() * 31) + 70;

  // Return the HSL color string
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function colorFrom7bitValue(value){
  const hue = (value / 127) * 360;
  return `hsl(${hue}, ${80}%, ${50}%)`;
}