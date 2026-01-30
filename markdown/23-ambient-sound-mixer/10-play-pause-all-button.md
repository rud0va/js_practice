# Play/Pause All Button

Let's add functionality to the main play/pause button so users can control all sounds at once. This is useful for quickly stopping everything or starting your ambient mix.

## Add Play All Method

In `soundManager.js`, add a method to play all loaded sounds:

```js
// Play all sounds
playAll() {
  for (const [soundId, audio] of this.audioElements) {
    if (audio.paused) {
      audio.play();
    }
  }
  this.isPlaying = true;
}
```

## Add Pause All Method

In `soundManager.js`, add a method to pause all sounds:

```js
// Pause all sounds
pauseAll() {
  for (const [soundId, audio] of this.audioElements) {
    if (!audio.paused) {
      audio.pause();
    }
  }
  this.isPlaying = false;
}
```

## Add Visual Update Method

In `ui.js`, add a method to update the main play/pause button:

```js
// Update main play/pause button
updateMainPlayButton(isPlaying) {
  const icon = this.playPauseButton.querySelector('i');
  if (isPlaying) {
    icon.classList.remove('fa-play');
    icon.classList.add('fa-pause');
  } else {
    icon.classList.remove('fa-pause');
    icon.classList.add('fa-play');
  }
}
```

## Add Update Main Button State Method

In `app.js`, add a method to keep the main button in sync with individual sounds:

```js
// Update main play button based on individual sound states
updateMainPlayButtonState() {
  // Check if any sounds are playing
  let anySoundsPlaying = false;
  for (const [soundId, audio] of this.soundManager.audioElements) {
    if (!audio.paused) {
      anySoundsPlaying = true;
      break;
    }
  }

  // Update the main button and internal state
  this.soundManager.isPlaying = anySoundsPlaying;
  this.ui.updateMainPlayButton(anySoundsPlaying);
}
```

## Add Toggle All Sounds Method

In `app.js`, add a method to toggle all sounds:

```js
// Toggle all sounds
toggleAllSounds() {
  if (this.soundManager.isPlaying) {
    this.soundManager.pauseAll();
    this.ui.updateMainPlayButton(false);
    sounds.forEach((sound) => {
      this.ui.updateSoundPlayButton(sound.id, false);
    });
  } else {
    // Set default volume for 0-volume sliders
    for (const [soundId, audio] of this.soundManager.audioElements) {
      const card = document.querySelector(`[data-sound="${soundId}"]`);
      const slider = card?.querySelector('.volume-slider');

      if (slider) {
        let volume = parseInt(slider.value);

        if (volume === 0) {
          volume = 50;
          slider.value = 50;
          this.ui.updateVolumeDisplay(soundId, 50);
        }

        this.currentSoundState[soundId] = volume;

        const effectiveVolume = (volume * this.masterVolume) / 100;
        audio.volume = effectiveVolume / 100;
        this.ui.updateSoundPlayButton(soundId, true);
      }
    }

    // Use the SoundManager method here
    this.soundManager.playAll();

    this.ui.updateMainPlayButton(true);
  }
}

```

## Update Toggle Sound Method

Update the `toggleSound` method in `app.js` to sync the main button:

```js
// Toggle individual sound
async toggleSound(soundId) {
  const audio = this.soundManager.audioElements.get(soundId);

  if (!audio) {
    console.error(`Sound ${soundId} not found`);
    return;
  }

  if (audio.paused) {
   // ...rest of code
  }

  // Update main button state
  this.updateMainPlayButtonState();
}
```

## Update Set Sound Volume Method

Update the `setSoundVolume` method in `app.js` to sync the main button when auto-play/pause happens:

```js
// Set sound volume
setSoundVolume(soundId, volume) {
  // Calculate effective volume with master volume
  const effectiveVolume = (volume * this.masterVolume) / 100;

  const audio = this.soundManager.audioElements.get(soundId);

  //Update the sound volume with scaled value
  if (audio) {
    audio.volume = effectiveVolume / 100;
  }

  // Update the visual display
  this.ui.updateVolumeDisplay(soundId, volume);
  // Sync sounds
  this.updateMainPlayButtonState(); 

}
```

## Wire Up the Event Listener

In `setupEventListeners` in `app.js`, add the event listener for the play/pause all button after the master volume listener:

```js
// Handle play/pause all button
if (this.ui.playPauseButton) {
  this.ui.playPauseButton.addEventListener('click', () => {
    this.toggleAllSounds();
  });
}
```

## Test the Functionality

Save and refresh. Now the play/pause all button works properly if it starts and stops all sounds.

In the next section, we'll add a reset button to quickly clear everything and start fresh!
