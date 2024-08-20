import { WebMidi } from "./webmidi/dist/esm/webmidi.esm.js";

export class Midi {

  synth;
  synthConfig; // json-file to hold MIDI CC numbers for the specific synth(s)
  tempNote;

  static loadWebMidi() {

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
              console.log(`\t${index}: ${device.name}`);
            });

            // this.synth = WebMidi.outputs[1];
            this.synth = WebMidi.getOutputByName("USB MIDI Interface MIDI 1");
            this.synth.sendAllNotesOff();
          }

        }) // init output synth
        .catch(err => alert(err));

    } catch (error) {
      console.error("could not initialize MIDI.", error);
    }
  }

  /**
   * get the midi CC mapping from server
   */
  static async fetchSynthConfig() {
    try {
      await fetch('./synth-config/volca.json')
      .then(response => response.json())
      .then(data => {
        this.synthConfig = data;
      });

    } catch (error) {
      console.error('Error fetching valid files:', error);
    }
  }

}