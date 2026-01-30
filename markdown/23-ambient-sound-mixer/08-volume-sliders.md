# Volume Sliders

Let's make the volume sliders functional so users can control the volume of each sound individually. This will change a bit late when we refactor for context to make things smoother. I just want to take it one step at a time and not overwhelm some of you.

## Add Volume Slider Event Listener

In `app.js`, update the `setupEventListeners` method to handle volume slider changes:

```js
// Set up all event listeners
setupEventListeners() {
  // Handle all clicks with event delegation
  document.addEventListener('click', async (e) => {
    // Check if a play button was clicked
    if (e.target.closest('.play-btn')) {
      const soundId = e.target.closest('.play-btn').dataset.sound;
      await this.toggleSound(soundId);
    }
  });

  // Handle volume slider changes
  document.addEventListener('input', (e) => {
    if (e.target.classList.contains('volume-slider')) {
      const soundId = e.target.dataset.sound;
      const volume = parseInt(e.target.value);
      this.setSoundVolume(soundId, volume);
    }
  });
}
```

We're using the 'input' event which fires as the user drags the slider, giving real-time feedback. Now we need to create the `setSoundVolume` method.

## Add Set Sound Volume Method

Add a new method in `app.js` to handle volume changes:

```js
// Set sound volume
setSoundVolume(soundId, volume) {
  // Update the sound volume
  this.soundManager.setVolume(soundId, volume);

  // Update the visual display
  this.ui.updateVolumeDisplay(soundId, volume);
}
```

This method sets the actual audio volume and updates the visual display.

## Add Visual Update Method

In `ui.js`, add a method to update the volume display:

```js
// Update volume display for a sound
updateVolumeDisplay(soundId, volume) {
  const card = document.querySelector(`[data-sound="${soundId}"]`);
  if (card) {
    // Update the number display
    const volumeValue = card.querySelector('.volume-value');
    if (volumeValue) {
      volumeValue.textContent = volume;
    }

    // Update the volume bar visualization
    const volumeBarFill = card.querySelector('.volume-bar-fill');
    if (volumeBarFill) {
      volumeBarFill.style.width = `${volume}%`;
    }

    // Update the slider position (in case volume was set programmatically)
    const slider = card.querySelector('.volume-slider');
    if (slider) {
      slider.value = volume;
    }
  }
}
```

This updates:

- The numeric display (0-100)
- The visual volume bar width
- The slider position itself

Right now the sound will play and the volume control will work. However it starts at 0 so when you click on it, the volume will go down. Let's have it start at 50%.

## Update Toggle Method

Update the `toggleSound` method in `app.js` to work better with sliders. We want to replace this line ` this.soundManager.setVolume(soundId, 50); // Default to 50% volume`:

```js
// Toggle individual sound
async toggleSound(soundId) {
  const audio = this.soundManager.audioElements.get(soundId);

  if (!audio) {
    console.error(`Sound ${soundId} not found`);
    return;
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

    // Play with the slider's volume
    this.soundManager.setVolume(soundId, volume);
    await this.soundManager.playSound(soundId);
    this.ui.updateSoundPlayButton(soundId, true);
  } else {
    // Sound is on, turn it off
    this.soundManager.pauseSound(soundId);
    this.ui.updateSoundPlayButton(soundId, false);
  }
}
```

Now the play button respects the slider position.

In the next section, we'll add master volume control to adjust all sounds at once!
