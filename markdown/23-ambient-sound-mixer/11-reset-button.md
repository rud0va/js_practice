# Reset Button

Let's add functionality to the Reset All button so users can quickly clear everything and start fresh. This is useful when you want to build a new mix from scratch.

## Add Stop All Method

First, in `soundManager.js`, add a method to stop all sounds and reset their positions:

```js
// Stop all sounds and reset to beginning
stopAll() {
  for (const [soundId, audio] of this.audioElements) {
    if (!audio.paused) {
      audio.pause();
    }
    audio.currentTime = 0; // Reset to beginning
  }
  this.isPlaying = false;
}
```

This is different from `pauseAll()` - it also resets the playback position to the start.

## Add Reset UI Method

In `ui.js`, add a method to reset all UI elements:

```js
// Reset all UI elements to default state
resetUI() {
  // Reset all volume sliders to 0
  const sliders = document.querySelectorAll('.volume-slider');
  sliders.forEach(slider => {
    slider.value = 0;
    const soundId = slider.dataset.sound;
    this.updateVolumeDisplay(soundId, 0);
  });

  // Reset all play buttons to play state
  const playButtons = document.querySelectorAll('.play-btn');
  playButtons.forEach(btn => {
    const icon = btn.querySelector('i');
    icon.classList.remove('fa-pause');
    icon.classList.add('fa-play');
  });

  // Remove playing class from all cards
  const cards = document.querySelectorAll('.sound-card');
  cards.forEach(card => {
    card.classList.remove('playing');
  });

  // Reset main play button
  this.updateMainPlayButton(false);

  // Reset master volume to 100%
  this.masterVolumeSlider.value = 100;
  this.masterVolumeValue.textContent = '100%';
}
```

## Add Reset All Method

In `app.js`, add a method to handle the reset:

```js
// Reset everything to default state
resetAll() {
  // Stop all sounds
  this.soundManager.stopAll();

  // Reset master volume
  this.masterVolume = 100;

  // Reset UI
  this.ui.resetUI();

  console.log('✓ All sounds and settings reset');
}
```

## Wire Up the Event Listener

In `setupEventListeners` in `app.js`, add the event listener for the reset button after the play/pause all button:

```js
// Handle reset button
if (this.ui.resetButton) {
  this.ui.resetButton.addEventListener('click', () => {
    this.resetAll();
  });
}
```

## Test the Functionality

Save and refresh. Now test the reset button:

1. **Play some sounds** - Set different volumes, play multiple sounds
2. **Adjust master volume** - Change it to 50% or 75%
3. **Click Reset All** - Everything stops and resets:
   - All sounds stop playing
   - All volume sliders go to 0
   - Master volume returns to 100%
   - All buttons show play icons
   - Playback positions reset to the beginning

## Optional: Add Confirmation

If you want to prevent accidental resets, you could add a confirmation:

```js
// Handle reset button with confirmation
if (this.ui.resetButton) {
  this.ui.resetButton.addEventListener('click', () => {
    if (confirm('Reset all sounds and settings?')) {
      this.resetAll();
    }
  });
}
```

But for this project, we'll keep it simple without confirmation since it's easy to rebuild your mix.

## How It Works

The reset system:
- Stops all playing sounds (not just pause)
- Resets playback positions to the start
- Returns all sliders to 0
- Sets master volume back to 100%
- Updates all visual elements

This gives users a quick way to start over when experimenting with different ambient combinations.

In the next section, we'll add keyboard shortcuts for power users!