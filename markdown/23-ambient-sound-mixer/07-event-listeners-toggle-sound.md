# Event Listeners & Toggle Sound

Now that we have our UI rendered, let's make the play/pause buttons actually work! We'll use event delegation to handle all button clicks efficiently.

## Add Event Listeners Setup

In `app.js`, add a new method to set up event listeners:

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
}
```

This uses event delegation - one listener on the document that checks what was clicked. The `closest()` method finds the play button even if you clicked the icon inside it.

## Add Toggle Sound Method

Now add a method to toggle individual sounds:

```js
// Toggle individual sound
async toggleSound(soundId) {
  const audio = this.soundManager.audioElements.get(soundId);

  if (!audio) {
    console.error(`Sound ${soundId} not found`);
    return;
  }

  if (audio.paused) {
    // Sound is off, turn it on
    this.soundManager.setVolume(soundId, 50); // Default to 50% volume
    await this.soundManager.playSound(soundId);
    this.ui.updateSoundPlayButton(soundId, true);
  } else {
    // Sound is on, turn it off
    this.soundManager.pauseSound(soundId);
    this.ui.updateSoundPlayButton(soundId, false);
  }
}
```

This method:

1. Checks if the sound is currently playing
2. If paused, sets volume to 50% and plays it
3. If playing, pauses it
4. Updates the button visual state

## Run `setupEventListeners`

Now let's go to the `init` method and add the `setupEventListeners` method:

```js
async init() {
    try {
      console.log('Initializing app...');

      // Initialize UI
      this.ui.init();
      this.ui.renderSoundCards(sounds);

      // Initialize current sound state
      sounds.forEach((sound) => {
        this.currentSoundState[sound.id] = 0;
      });

      // IMPORTANT: Set up event listeners BEFORE loading audio
      // This ensures buttons work immediately, especially on mobile
      this.setupEventListeners();

      // Load all sound files in background
      this.loadAllSounds().catch(err => {
        console.error('Error loading sounds:', err);
      });

      this.isInitialized = true;
      console.log('✓ App initialized successfully');
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  }
```

**Important Note**: We set up event listeners BEFORE loading audio files. This is crucial for mobile compatibility - audio loading can block on mobile browsers, so we ensure buttons work immediately while audio loads in the background.

Now when you click on a play button, you should hear the sound. When you click it again, it will stop/pause.

Now we need the button to change between playing and pausing.ß

## Add Visual Feedback Method

Go back to `ui.js` and add the method to update button visuals:

```js
// Update play/pause button for individual sound
updateSoundPlayButton(soundId, isPlaying) {
  const card = document.querySelector(`[data-sound="${soundId}"]`);
  if (card) {
    const playBtn = card.querySelector('.play-btn');
    const icon = playBtn.querySelector('i');

    if (isPlaying) {
      icon.classList.remove('fa-play');
      icon.classList.add('fa-pause');
      card.classList.add('playing');
    } else {
      icon.classList.remove('fa-pause');
      icon.classList.add('fa-play');
      card.classList.remove('playing');
    }
  }
}
```

This swaps the play/pause icon and adds a 'playing' class to style active cards.

## Test the Functionality

Save all files and refresh your browser. Now you can:

1. Click any play button - the sound should start at 50% volume
2. The icon changes from play to pause
3. Click again to pause the sound
4. The icon changes back to play

Try playing multiple sounds at once - they should all mix together!

## What's Happening

When you click a play button:

1. The event bubbles up to the document listener
2. We check if it was a play button using `closest('.play-btn')`
3. We get the sound ID from the button's `data-sound` attribute
4. `toggleSound` checks if it's playing and either starts or stops it
5. The UI updates to show the new state

This event delegation pattern is efficient - one listener handles all buttons instead of adding a listener to each button individually.

In the next section, we'll add volume slider functionality so users can control individual sound volumes!
