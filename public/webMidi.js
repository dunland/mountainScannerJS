import { WebMidi } from "./webmidi/dist/esm/webmidi.esm.js";

export class Midi {

  synth;
  cc;

  static loadWebMidi() {

    this.cc = 44;

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

            // this.synth = WebMidi.inputs[0];
            // this.synth = WebMidi.getInputByName("TYPE NAME HERE!")
          }

          if (WebMidi.outputs.length < 1) {
            console.log("no output devices detected.");
          }
          else {
            console.log("Midi Outputs:");
            WebMidi.outputs.forEach((device, index) => {
              console.log(`${index}: ${device.name}`);
            });

            // this.synth = WebMidi.outputs[1];
            this.synth = WebMidi.getOutputByName("USB MIDI Interface MIDI 1");
          }

        }) // init output synth
        .catch(err => alert(err));

      console.log(`WebMidi.inputs: ${WebMidi.inputs}`);
    } catch (error) {
      console.error("could not initialize MIDI.", error);
    }
  }
}