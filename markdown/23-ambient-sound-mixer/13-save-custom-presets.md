# Save Custom Presets

Let's add the ability to save custom mixes. Users can save their current sound configuration as a preset that gets stored in the browser's localStorage.

## Create the Preset Manager Class

This class handles data persistence for custom presets. It manages:

- Loading saved presets
- Saving new presets
- Avoiding duplicate names

It does not deal with the UI or sound playing logic — keeping concerns separated and the codebase clean.

Create a new file `js/presetManager.js`:

```js
// Preset Manager Module
export class PresetManager {
  constructor() {
    this.customPresets = this.loadCustomPresets();
  }

  // Load custom presets from localStorage
  loadCustomPresets() {
    const stored = localStorage.getItem('ambientMixerPresets');
    return stored ? JSON.parse(stored) : {};
  }

  // Save custom presets to localStorage
  saveCustomPresets() {
    localStorage.setItem(
      'ambientMixerPresets',
      JSON.stringify(this.customPresets)
    );
  }

  // Save current mix as a preset
  savePreset(name, soundStates) {
    const presetId = `custom-${Date.now()}`;

    // Create preset object with only active sounds
    const preset = {
      name,
      sounds: {},
    };

    for (const [soundId, volume] of Object.entries(soundStates)) {
      if (volume > 0) {
        preset.sounds[soundId] = volume;
      }
    }

    // Add to custom presets
    this.customPresets[presetId] = preset;
    this.saveCustomPresets();

    return presetId;
  }

  // Check if preset name already exists
  presetNameExists(name) {
    return Object.values(this.customPresets).some(
      (preset) => preset.name === name
    );
  }
}
```

- `loadCustomPresets()` loads any saved data from localStorage.
- `saveCustomPresets()` saves all current presets to localStorage.
- `savePreset(name, soundStates)` creates and saves a new preset with only the active sounds.
- `presetNameExists(name)` checks for duplicate names to prevent overwriting.

## Import and Initialize Preset Manager

In `app.js`, import the PresetManager:

```js
import { sounds, defaultPresets } from './soundData.js';
import { SoundManager } from './soundManager.js';
import { UI } from './ui.js';
import { PresetManager } from './presetManager.js'; // Add this
```

Then initialize it in the constructor:

```js
constructor() {
  console.log('Initializing state...');
  this.soundManager = new SoundManager();
  this.ui = new UI();
  this.presetManager = new PresetManager(); // Change from null
  this.timer = null;
  this.currentSoundState = {};
  this.masterVolume = 100;
  this.isInitialized = false;
}
```

## Add Modal Reference to UI

In `ui.js`, add a reference to the modal in the `init` method:

```js
init() {
  // Get DOM elements
  this.soundCardsContainer = document.querySelector('.grid');
  this.masterVolumeSlider = document.getElementById('masterVolume');
  this.masterVolumeValue = document.getElementById('masterVolumeValue');
  this.playPauseButton = document.getElementById('playPauseAll');
  this.resetButton = document.getElementById('resetAll');
  this.modal = document.getElementById('savePresetModal');
}
```

## Add Modal Methods to UI

In `ui.js`, add methods to show and hide the modal:

```js
// Show save preset modal
showModal() {
  this.modal.classList.remove('hidden');
  this.modal.classList.add('flex');
  document.getElementById('presetName').focus();
}

// Hide save preset modal
hideModal() {
  this.modal.classList.add('hidden');
  this.modal.classList.remove('flex');
  document.getElementById('presetName').value = '';
}
```

## Set sound state in `toggleSound`

In order for this to work, you need to add to the sound state when you play a sound. Open the `toggleSound` method in the `app.js` and add the following:

```js
// Toggle individual sound
async toggleSound(soundId) {
  const audio = this.soundManager.audioElements.get(soundId);

  if (!audio) {
    console.error(`Sound ${soundId} not found`);
    return false;
  }

  if (audio.paused) {
    // Get current slider value
    const card = document.querySelector(`[data-sound="${soundId}"]`);
    const slider = card.querySelector('.volume-slider');
    let volume = parseInt(slider.value);

    // If slider is at 0, default to 50%
    if (volume === 0) {
      volume = 50;
      this.ui.updateVolumeDisplay(soundId, volume);
    }

    // ADD THIS: Set the current sound state
    this.currentSoundState[soundId] = volume;

    // Sound is off, turn it on
    this.soundManager.setVolume(soundId, volume);
    await this.soundManager.playSound(soundId);
    this.ui.updateSoundPlayButton(soundId, true);
  } else {
    // Sound is on, shut it off
    this.soundManager.pauseSound(soundId);
    this.ui.updateSoundPlayButton(soundId, false);
    
    // ADD THIS: Set the current sound state to 0 when paused
    this.currentSoundState[soundId] = 0;
  }

  // Update main play button state
  this.updateMainPlayButtonState();
}
```

## Add Save Button Event Listener

We have a bunch of event listeners to setup. Here are the events we need to add:

- Save Mix button click - opens the modal
- Modal Save button click - saves the preset
- Modal Cancel button click - closes without saving
- Click outside modal - closes without saving

In `setupEventListeners` in `app.js`, add:

```js
// Save preset button
const saveButton = document.getElementById('savePreset');
if (saveButton) {
  saveButton.addEventListener('click', () => {
    this.showSavePresetModal();
  });
}

// Modal save button
const confirmSaveButton = document.getElementById('confirmSave');
if (confirmSaveButton) {
  confirmSaveButton.addEventListener('click', () => {
    this.saveCurrentPreset();
  });
}

// Modal cancel button
const cancelSaveButton = document.getElementById('cancelSave');
if (cancelSaveButton) {
  cancelSaveButton.addEventListener('click', () => {
    this.ui.hideModal();
  });
}

// Close modal on backdrop click
if (this.ui.modal) {
  this.ui.modal.addEventListener('click', (e) => {
    if (e.target === this.ui.modal) {
      this.ui.hideModal();
    }
  });
}
```

## Add Show Save Preset Modal Method

This method checks if there are active sounds and shows the modal. We validate that the user has actually created a mix (at least one sound with
volume > 0) before allowing them to save. There's no point in saving silence! If they have active sounds, we display the modal where they can enter a name for their preset.

In `app.js`, add:

```js
// Show save preset modal
showSavePresetModal() {
  // Check if any sounds are active
  const hasActiveSounds = Object.values(this.currentSoundState).some(v => v > 0);

  if (!hasActiveSounds) {
    alert('No active sounds to save. Please adjust some volume sliders first.');
    return;
  }

  this.ui.showModal();
}
```

## Add Save Current Preset Method

This method reads the preset name from the modal input and saves the preset. It's called when the user clicks the "Save Preset" button in the modal. The method validates the input (not empty, not duplicate), saves the preset using our PresetManager, and then closes the modal. We're using the current sound states (volumes) that we've been tracking throughout the session.

In `app.js`, add:

```js
// Save current preset
saveCurrentPreset() {
  const nameInput = document.getElementById('presetName');
  const name = nameInput.value.trim();

  if (!name) {
    alert('Please enter a preset name');
    return;
  }

  if (this.presetManager.presetNameExists(name)) {
    alert(`A preset with the name "${name}" already exists`);
    return;
  }

  const presetId = this.presetManager.savePreset(name, this.currentSoundState);
  this.ui.hideModal();

  console.log(`Preset "${name}" saved successfully with ID: ${presetId}`);
}
```

## Test the Save Functionality

Save and refresh. Now test saving presets:

1. **Adjust some volume sliders** - Create your mix
2. **Click "Save Mix"** - Modal appears with input field
3. **Enter a name** like "My Relaxing Mix"
4. **Click "Save Preset"** - Modal closes and preset saves
5. **Click outside the modal** - Modal closes without saving
6. **Open DevTools** > Application > Local Storage - You'll see your saved preset

## How It Works

The save system:

- Uses a proper modal instead of browser prompt
- Validates that there are active sounds
- Checks for duplicate names
- Saves to localStorage with unique timestamp IDs
- Only saves sounds with volume > 0
- Provides good UX with focus management and backdrop clicks

The saved presets persist between browser sessions and can be loaded later.

In the next section, we'll add the ability to display and load these saved custom presets!
