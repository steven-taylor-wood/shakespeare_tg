/*
Data and machine learning for artistic practice
Week 8

Generative Text CharRNN live generation
*/

/*
For this project I trained my own CharRNN model,
using The Complete Works of Shakespeare,
the training process took 7 hours total.

The model I TRAINED can be found in '...models/input

I find it interesting how the AI implements stage directions into the output,
and their placement amongst the rest of the text
*/

/*
A SAMPLE INPUT MAY LOOK LIKE...

"Be not afraid of greatness. ..."
"We know what we are, but know not what we may be."
"Our doubts are traitors and make us lose the good we oft might win by fearing to attempt."

... or perhaps the lyrics to your favourite song!
*/

let charRNN,
    textInput,
    tempSlider,
    lengthSlider,
    isGenerating = false,
    original_text = "",
    prediction_text = "",
    music;

function preload() {
  song = loadSound('assets/shakespeare_song.mp3');
}

function setup() {
  createCanvas(800,400);

  // Create the LSTM Generator passing it the model directory
  charRNN = ml5.charRNN('models/input/', modelReady);

  // Grab the DOM elements
  textInput = select('#textInput');
  lengthSlider = select('#lenSlider');
  tempSlider = select('#tempSlider');

  // Run generate anytime something changes
  textInput.input(generate);
  lengthSlider.input(generate);
  tempSlider.input(generate);

  song.play();
  song.loop();
}

function draw() {
  background(0);
  fill(255);
  noStroke();
  
  // draw our original and generated text
  text(`${original_text}${prediction_text}`, 0, 0, width, height);
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function generate() {
  if(!isGenerating) {
    isGenerating = true;
    
    // Update the status log
    select('#status').html('Generating...');
    
    // Update the length and temperature span elements
    select('#length').html(lengthSlider.value());
    select('#temperature').html(tempSlider.value());
    
    // Grab the original text
    let original = textInput.value();
    original_text = original;
    
    // Make it to lower case
    let txt = original.toLowerCase();
    
    // Check if there's something
    if (txt.length > 0) {
      // Here is the data for the LSTM generator
      let data = {
        seed: txt,
        temperature: tempSlider.value(),
        length: lengthSlider.value()
      };
    
      // Generate text with the charRNN
      charRNN.generate(data, gotData);
    
    }else {
      // Clear everything
      prediction_text = "";
      original_text = "";
    }
  }
}

// Update the DOM elements with typed and generated text
function gotData(err, result) {
  select('#status').html('Ready!');
  prediction_text = result.sample;
  isGenerating = false;
}