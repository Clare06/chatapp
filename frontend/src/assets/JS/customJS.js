// var myExtObject = (function(myExtObject) {
//   myExtObject.createBubbles = function() {
//     const theme = document.querySelector('.theme');
//     const numBubbles = 10; // Change the number of bubbles as needed

//     for (let i = 0; i < numBubbles; i++) {
//       const bubble = document.createElement('div');
//       bubble.className = 'bubble';

//       // Generate random positions within the theme div
//       const randomX = Math.floor(Math.random() * (theme.offsetWidth - 50));
//       const randomY = Math.floor(Math.random() * (theme.offsetHeight - 50));

//       // Set the position of the bubble div
//       bubble.style.left = randomX + 'px';
//       bubble.style.top = randomY + 'px';
//       console.log("hey I am bubble");
//       // Append the bubble to the theme div
//       theme.appendChild(bubble);
//     }
//   };

//   return myExtObject;
// })(myExtObject || {});

var PupilMovement = (function (PupilMovement) {
  PupilMovement.init = function () {
    // Get references to the pupils
    const pupilLeft = document.querySelector('.pupil-left');
    const pupilRight = document.querySelector('.pupil-right');

    // Calculate the center coordinates of the pupils
    const pupilLeftCenterX = pupilLeft.getBoundingClientRect().left + pupilLeft.offsetWidth / 2;
    const pupilLeftCenterY = pupilLeft.getBoundingClientRect().top + pupilLeft.offsetHeight / 2;
    const pupilRightCenterX = pupilRight.getBoundingClientRect().left + pupilRight.offsetWidth / 2;
    const pupilRightCenterY = pupilRight.getBoundingClientRect().top + pupilRight.offsetHeight / 2;

    // Calculate the maximum pupil movement distance
    const maxPupilMovement = 50; // Adjust this value to control the movement range

    // Add a mousemove event listener to the bubble
    document.querySelector('.bubble').addEventListener('mousemove', (e) => {
      // Calculate the distance between the cursor and the pupils' centers
      const deltaXLeft = e.clientX - pupilLeftCenterX;
      const deltaYLeft = e.clientY - pupilLeftCenterY;
      const deltaXRight = e.clientX - pupilRightCenterX;
      const deltaYRight = e.clientY - pupilRightCenterY;

      // Calculate the pupil movement based on the cursor position
      const pupilMovementXLeft = (deltaXLeft / window.innerWidth) * maxPupilMovement;
      const pupilMovementYLeft = (deltaYLeft / window.innerHeight) * maxPupilMovement;
      const pupilMovementXRight = (deltaXRight / window.innerWidth) * maxPupilMovement;
      const pupilMovementYRight = (deltaYRight / window.innerHeight) * maxPupilMovement;

      // Apply the pupil movement
      pupilLeft.style.transform = `translate(${pupilMovementXLeft}px, ${pupilMovementYLeft}px)`;
      pupilRight.style.transform = `translate(${pupilMovementXRight}px, ${pupilMovementYRight}px)`;
    });

    // Reset the pupils' position when the mouse leaves the bubble
    document.querySelector('.bubble').addEventListener('mouseleave', () => {
      pupilLeft.style.transform = 'translate(0, 0)';
      pupilRight.style.transform = 'translate(0, 0)';
    });
  };

  return PupilMovement;
})(PupilMovement || {});

