var myExtObject = (function(myExtObject) {
  myExtObject.createBubbles = function() {
    const theme = document.querySelector('.theme');
    const numBubbles = 10; // Change the number of bubbles as needed

    for (let i = 0; i < numBubbles; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';

      // Generate random positions within the theme div
      const randomX = Math.floor(Math.random() * (theme.offsetWidth - 50));
      const randomY = Math.floor(Math.random() * (theme.offsetHeight - 50));

      // Set the position of the bubble div
      bubble.style.left = randomX + 'px';
      bubble.style.top = randomY + 'px';
      console.log("hey I am bubble");
      // Append the bubble to the theme div
      theme.appendChild(bubble);
    }
  };

  return myExtObject;
})(myExtObject || {});

