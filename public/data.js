import { WebMidi } from "./webmidi/dist/esm/webmidi.esm.js";

// import { values, rawValues } from "./scanner.js";
export var values = [], rawValues = [];
export async function loadJSON(dataFile) {

  const response = await fetch(dataFile)
    .then((res) => res.json())
    .then((data) => {
      rawValues = data.values;
      console.log(rawValues);
      remapInputValues(rawValues);
      console.log(values);
      try {

        // Enable WEBMIDI.js and trigger the onEnabled() function when ready
        WebMidi
          .enable()
          .then(() => {
            // Display available MIDI input devices
            if (WebMidi.inputs.length < 1) {
              document.body.innerHTML += "No device detected.";
            } else {
              WebMidi.inputs.forEach((device, index) => {
                console.log("Midi Inputs:" + `${index}: ${device.name}`);
              });

              // mySynth = WebMidi.inputs[0];
              // const mySynth = WebMidi.getInputByName("TYPE NAME HERE!")
            }

            if (WebMidi.outputs.length < 1) {
              console.log("no output devices detected.");
            }
            else {
              console.log("Midi Outputs:");
              WebMidi.outputs.forEach((device, index) => {
                console.log(`${index}: ${device.name}`);
              });

              // mySynth = WebMidi.outputs[1];
              mySynth = WebMidi.getOutputByName("USB MIDI Interface MIDI 1");
            }

          }) // init output synth
          .catch(err => alert(err));

        console.log(`WebMidi.inputs: ${WebMidi.inputs}`);
      } catch (error) {
        console.error("could not initialize MIDI.", error);
      }

    })
    .catch(error => {
      console.error("Error loading ./data.json! (Maybe try a different browser)", error);
    })
}

export function remapInputValues() {
  for (let index = 0; index < rawValues.length; index++) {
    values[index] = Math.round(rawValues[index] / 1080 * innerHeight);
  }
}
