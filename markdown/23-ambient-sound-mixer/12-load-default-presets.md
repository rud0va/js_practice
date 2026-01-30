# Load Default Presets

Let's add preset combinations that users can load with one click. These are pre-configured mixes like "Focus" or "Sleep" that set multiple sounds to specific volumes.

## Add Default Presets to Sound Data

First, in `soundData.js`, make sure you have the default preset configurations after the sounds array:

```js
// Default Presets Configuration
export const defaultPresets = {
  focus: {
    name: 'Focus',
    icon: 'fa-brain',
    sounds: {
      rain: 30,
      cafe: 20,
      wind: 10,
    },
  },
  relax: {
    name: 'Relax',
    icon: 'fa-spa',
    sounds: {
      ocean: 40,
      forest: 30,
      wind: 20,
    },
  },
  sleep: {
    name: 'Sleep',
    icon: 'fa-bed',
    sounds: {
      rain: 40,
      night: 30,
      wind: 15,
    },
  },
};
```

## Import Presets in App

In `app.js`, update the import to include presets:

```js
import { sounds, defaultPresets } from './soundData.js';
```

## Add Current Sound States Tracking

We need to track sound states for presets to work properly. In the `app.js` constructor, add (if not already there):

```js
constructor() {
  console.log('Initializing state...');
  this.soundManager = new SoundManager();
  this.ui = new UI();
  this.presetManager = null;
  this.timer = null;
  this.currentSoundState = {}; // Add this if not present
  this.masterVolume = 100;
  this.isInitialized = false;
}
```

And in `init()`, initialize the states right after where we load the sounds:

```js
// Initialize sound states after loading sounds
sounds.forEach((sound) => {
  this.currentSoundState[sound.id] = 0;
});
```

## Update Set Sound Volume

Update `setSoundVolume` to track state changes:

```js
// Set sound volume
setSoundVolume(soundId, volume) {
  // Save the state
  this.currentSoundState[soundId] = volume;

  // ... rest of code
}
```

This will store the volume level for each sound in the object. It will look something like this:

```
 this.currentSoundState = {
    rain: 70,
    ocean: 50,
    birds: 30,
    thunder: 0,
    wind: 0
    // ... etc
  }
```

## Add Load Preset Method

We need to add a method that takes a preset configuration, stops all currently playing sounds, resets everything to zero, then applies the preset's volume settings and automatically starts playing the sounds defined in that preset.

We have a design choice to make here. Not UI design but code structure. We will have a `presetManager` class. However I want that class to only handle data persistence, saving to and loading from localStorage. The actual application of presets (stopping sounds, updating UI, setting volumes) will stay in the main `AmbientMixer` class in `app.js`. This separation of concerns means:

- `PresetManager` is responsible for the storage layer (CRUD operations on preset data)
- `AmbientMixer` is responsible for orchestration (coordinating between SoundManager, UI, and state)

This way, `PresetManager` doesn't need to know about audio elements, UI updates, or application state. It's just a data service. The main class uses `PresetManager` to get/save data, but handles all the actual implementation of applying that data to the running application.

In `app.js`, add a method to load presets:

```js
// Load a preset configuration
loadPreset(presetKey) {
  const preset = defaultPresets[presetKey];
  if (!preset) {
    console.error(`Preset ${presetKey} not found`);
    return;
  }

  console.log(`Loading preset: ${preset.name}`);

  // First, reset everything
  this.soundManager.stopAll();

  // Reset all volumes to 0
  sounds.forEach(sound => {
    this.currentSoundState[sound.id] = 0;
    this.ui.updateVolumeDisplay(sound.id, 0);
    this.ui.updateSoundPlayButton(sound.id, false);
  });

  // Apply the preset volumes
  for (const [soundId, volume] of Object.entries(preset.sounds)) {
    if (this.soundManager.audioElements.has(soundId)) {
      // Set the volume state
      this.currentSoundState[soundId] = volume;

      // Update UI
      this.ui.updateVolumeDisplay(soundId, volume);

      // Calculate effective volume
      const effectiveVolume = (volume * this.masterVolume) / 100;

      // Get the audio element and set volume
      const audio = this.soundManager.audioElements.get(soundId);
      if (audio) {
        audio.volume = effectiveVolume / 100;

        // Play the sound
        audio.play();
        this.ui.updateSoundPlayButton(soundId, true);
      }
    }
  }

  // Update main play button
  this.soundManager.isPlaying = true;
  this.ui.updateMainPlayButton(true);
}
```

Let's break this down.

The `loadPreset` method takes a preset identifier like 'focus', 'relax', or 'sleep' as the parameter.

The following code:

```js
const preset = defaultPresets[presetKey];
if (!preset) {
  console.error(`Preset ${presetKey} not found`);
  return;
}
```

Validates the preset exists - Looks up the preset configuration from our defaultPresets object. If it doesn't exist (typo or invalid key), logs an error and exits early.

The following:

```js
this.soundManager.stopAll();
```

Stops everything - Pauses all currently playing sounds and resets their playback position to the beginning. Clean slate.

The following:

```js
sounds.forEach((sound) => {
  this.currentSoundState[sound.id] = 0;
  this.ui.updateVolumeDisplay(sound.id, 0);
  this.ui.updateSoundPlayButton(sound.id, false);
});
```

Resets ALL sounds to zero - Goes through every available sound in the app and:

- Sets its volume state to 0
- Moves its slider to 0
- Changes its button to show play icon

This ensures sounds NOT in the preset are turned off.

The following:

```js
for (const [soundId, volume] of Object.entries(preset.sounds)) {
    if (this.soundManager.audioElements.has(soundId)) {
      // ...
```

Loops through the preset's sounds - For each sound defined in the preset (like rain: 30, cafe: 20), checks if that sound actually exists in our loaded audio files. The Object.entries() loops

`Object.entries()` converts an object into an array of key-value pairs. It would look something like this:

```
[
    ['rain', 30],
    ['cafe', 20],
    ['wind', 10]
]
```

It labels the key as `soundId` and the value as `volume`

The following:

```js
this.currentSoundState[soundId] = volume;
this.ui.updateVolumeDisplay(soundId, volume);
```

Sets the new volume - Updates both the internal state and the UI slider/display to the preset's volume level.

The following:

```js
const effectiveVolume = (volume * this.masterVolume) / 100;
const audio = this.soundManager.audioElements.get(soundId);
if (audio) {
  audio.volume = effectiveVolume / 100;
  audio.play();
  this.ui.updateSoundPlayButton(soundId, true);
}
```

Applies volume and starts playing

- Calculates the actual volume (considering master
  volume)
- Sets the audio element's volume
- Starts playing the sound
- Updates the button to show pause icon

The following:

```js
this.soundManager.isPlaying = true;
this.ui.updateMainPlayButton(true);
```

Updates the main controls - Sets the global playing state to true and changes the main play/pause button to show pause.

Example Flow

When user clicks "Focus" preset:

1. All sounds stop and reset to 0
2. Rain slider moves to 30, starts playing at 30%
3. Cafe slider moves to 20, starts playing at 20%
4. Wind slider moves to 10, starts playing at 10%
5. All other sounds remain at 0 and silent
6. Main play button shows pause icon

The result is an instant switch to the preset mix, replacing whatever was playing before.

## Add Preset Buttons Event Listeners

In `setupEventListeners`, add handling for preset buttons within the existing click listener:

```js
document.addEventListener('click', async (e) => {
  // Check if a play button was clicked
  if (e.target.closest('.play-btn')) {
    const soundId = e.target.closest('.play-btn').dataset.sound;
    await this.toggleSound(soundId);
  }

  // Check if a preset button was clicked - ADD THIS
  if (e.target.closest('.preset-btn')) {
    const presetKey = e.target.closest('.preset-btn').dataset.preset;
    this.loadPreset(presetKey);
  }
});
```

Now try clicking one of the presets. It should play that group of sounds at the specific volume.

## Update Reset All Method

Update the `resetAll` method to also reset sound states:

```js
// Reset everything to default state
resetAll() {
  // Stop all sounds
  this.soundManager.stopAll();

  // Reset master volume
  this.masterVolume = 100;

  // Reset sound states
  sounds.forEach(sound => {
    this.currentSoundState[sound.id] = 0;
  });

  // Reset UI
  this.ui.resetUI();

  console.log('✓ All sounds and settings reset');
}
```

In the next section, we'll add visual feedback to show which preset is active!
