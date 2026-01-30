# Master Volume Control

Now let's add a master volume slider that controls the overall volume of all sounds at once. This is like the main volume knob on a stereo system.

## Add Master Volume Event Listener

In `app.js`, update the `setupEventListeners` method to handle the master volume slider:

```js
// Set up all event listeners
setupEventListeners() {
  // Other event listeners...

  // Handle master volume slider
  const masterVolumeSlider = document.getElementById('masterVolume');
  if (masterVolumeSlider) {
    masterVolumeSlider.addEventListener('input', (e) => {
      const volume = parseInt(e.target.value);
      this.setMasterVolume(volume);
    });
  }
}
```

We are just listening for the master volume and then calling the `setMasterVolume` method, which we will create now.

## Track Master Volume

Add a property to track the master volume in the constructor:

```js
constructor() {
  console.log('Initializing state...');
  this.soundManager = new SoundManager();
  this.ui = new UI();
  this.presetManager = null;
  this.timer = null;
  this.currentSoundStates = {};
  this.masterVolume = 100; // Add this line - default to 100%
  this.isInitialized = false;
}
```

We will not be using this property later when we add Web Audio context.

## Add Set Master Volume Method

Add a new method in `app.js` to handle master volume changes:

```js
// Set master volume
setMasterVolume(volume) {
  this.masterVolume = volume;

  // Update the display
  const masterVolumeValue = document.getElementById('masterVolumeValue');
  if (masterVolumeValue) {
    masterVolumeValue.textContent = `${volume}%`;
  }

  // Apply master volume to all currently playing sounds
  this.applyMasterVolumeToAll();
}
```

This method:

- Stores the new master volume value in our property
- Updates the display text to show the percentage (e.g., "75%")
- Calls `applyMasterVolumeToAll()` to immediately apply the change to all playing sounds

## Apply Master Volume to All Sounds

Add a method to apply the master volume scaling:

```js
// Apply master volume to all sounds
applyMasterVolumeToAll() {
  for (const [soundId, audio] of this.soundManager.audioElements) {
    if (!audio.paused) {
      // Get the individual volume from the slider
      const card = document.querySelector(`[data-sound="${soundId}"]`);
      const slider = card?.querySelector('.volume-slider');
      if (slider) {
        const individualVolume = parseInt(slider.value);
        // Calculate effective volume (individual * master)
        const effectiveVolume = (individualVolume * this.masterVolume) / 100;

        // Apply to the actual audio element
        audio.volume = effectiveVolume / 100;
      }
    }
  }
}
```

This method scales each playing sound by the master volume:

- Loops through all audio elements in our Map
- For playing sounds (!audio.paused), gets their individual slider value
- Calculates effective volume: (individual × master) ÷ 100
- Applies the scaled volume to the audio element
- Example: If rain is at 60% and master is at 50%, rain plays at 30% (60 × 50 ÷ 100 = 30)

## Test Master Volume

Now, play some sounds and test the master volume slider. It should change the volume of all the playing sounds. You will not see the individual sliders change yet. Let's work on that now.

## Update Individual Volume Method

Update `setSoundVolume` to respect master volume:

```js
// Set sound volume
setSoundVolume(soundId, volume) {
  // Calculate effective volume with master volume
  const effectiveVolume = (volume * this.masterVolume) / 100;

  // Update the sound volume with scaled value
  const audio = this.soundManager.audioElements.get(soundId);
  if (audio) {
    audio.volume = effectiveVolume / 100;
  }

  // Update the visual display (shows individual volume, not scaled)
  this.ui.updateVolumeDisplay(soundId, volume);
}
```

We're updating our existing method to factor in the master volume whenever an individual slider changes. The visual display still shows the individual volume (0-100), but the actual audio plays at the scaled volume.

The line where we get the `effectiveVolume` calculates the actual volume to play by combining individual and master volumes.

Examples:

1. Rain at 50%, Master at 100%:
   (50 \* 100) / 100 = 5000 / 100 = 50
1. Rain plays at 50% (no change)
1. Rain at 50%, Master at 50%:
   (50 \* 50) / 100 = 2500 / 100 = 25
1. Rain plays at 25% (half as loud)
1. Ocean at 80%, Master at 75%:
   (80 \* 75) / 100 = 6000 / 100 = 60
1. Ocean plays at 60%

Why divide by 100?

- Both volumes are percentages (0-100)
- Multiplying two percentages gives a huge number
- Dividing by 100 converts back to percentage

Think of it as:

- Individual volume = "How loud should THIS sound
  be?"
- Master volume = "How loud should EVERYTHING be?"
- Effective volume = Individual percentage OF the
  master percentage

It's percentage of a percentage - if rain is at 50%
and you turn master to 50%, rain should play at 50%
of 50% = 25%.

We also got rid of the line `this.soundManager.setVolume(soundId, volume);` because that would ignore master volume. Instead, we added ` audio.volume = effectiveVolume / 100;` to use the effectiveVolume.

## Update Toggle Method

Update the `toggleSound` method to apply master volume when playing:

```js
// In toggleSound method, after this line:
this.soundManager.setVolume(soundId, volume);

// Add these lines to apply master volume scaling:
const effectiveVolume = (volume * this.masterVolume) / 100;
const audio = this.soundManager.audioElements.get(soundId);
audio.volume = effectiveVolume / 100;
```

This ensures when you click play, the sound starts at the correct scaled volume (individual volume × master volume).

## Initialize Master Volume

In the `init` method, set the initial master volume display:

```js
async init() {
  try {
    console.log('Initializing app...');

    // Initialize UI
    this.ui.init();
    this.ui.renderSoundCards(sounds);

    // Set initial master volume display
    const masterVolumeValue = document.getElementById('masterVolumeValue');
    if (masterVolumeValue) {
      masterVolumeValue.textContent = '100%';
    }

    // Load all sound files
    await this.loadAllSounds();

    // Set up event listeners
    this.setupEventListeners();

    this.isInitialized = true;
    console.log('✓ App initialized successfully');
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
}
```

## Test the Functionality

Save and refresh. Now you can:

1. **Play multiple sounds** at different volumes
2. **Adjust master volume** - All sounds get quieter/louder together
3. **Individual volumes stay proportional** - If rain is at 50% and ocean at 100%, ocean stays twice as loud
4. **Visual feedback** - Master volume shows percentage

## How It Works

The master volume system works by scaling:

- Individual volume: 50%, Master volume: 50% → Effective volume: 25%
- Individual volume: 100%, Master volume: 50% → Effective volume: 50%

This maintains the relative balance between sounds while controlling overall loudness.

In the next section, we'll add state management to remember volume settings!
