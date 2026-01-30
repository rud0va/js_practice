# Play, Pause & Volume

We will add a few methods to the `SoundManager` to play, pause and set volume. Keep in mind that in iOS, you can not programmatically set the volume. You need to use the physical device as far as I'm aware. So if you are testing, don't test on an iPhone.

Open `js/soundManager.js` and add a method to play a single sound:

```js
// Play a specific sound
async playSound(soundId) {
  const audio = this.audioElements.get(soundId);

  if (audio) {
    try {
      await audio.play();
      console.log(`Playing: ${soundId}`);
      return true;
    } catch (error) {
      console.error(`Failed to play ${soundId}:`, error);
      return false;
    }
  }
  return false;
}
```

This method:

- Gets the audio element from our Map
- Plays the audio and returns true/false for success

## Add Pause Sound Method

Now add a method to pause a sound. The audio API does not have a `stop` method, which I always thought was weird. So to actually stop, you pause and reset. Right now, we just want to be able to pause.

```js
// Pause a specific sound
pauseSound(soundId) {
  const audio = this.audioElements.get(soundId);

  if (audio && !audio.paused) {
    audio.pause();
    console.log(`Paused: ${soundId}`);
  }
}
```

## Add Volume Control

Finally, let's add a method to adjust volume for a playing sound. In the final version, we will be using context for smooth volume. For now, we are just keeping it simple:

```js
// Set volume for a specific sound (0-100)
setVolume(soundId, volume) {
  const audio = this.audioElements.get(soundId);

  if (!audio) {
    console.error(`Sound ${soundId} not found`);
    return false;
  }

  // Convert 0-100 to 0-1
  audio.volume = volume / 100;
  console.log(`Volume for ${soundId}: ${volume}%`);
  return true;
}
```

We divide the volume entered by 100 because the HTML5 audio API expects volume as a decimal between 0 and 1:

- audio.volume = 0 = muted (0%)
- audio.volume = 0.5 = half volume (50%)
- audio.volume = 1 = full volume (100%)

But for users, percentages are more intuitive:

- "Set volume to 50%" makes sense
- "Set volume to 0.5" is less natural

So we accept 0-100 from the user and convert:

```js
// User passes 50 (meaning 50%)
setVolume('rain', 50);
```

## Test in app.js

Let's test our new methods. Update the `init` method in `app.js`.

We're going to run into an issue here but I want you to see it, so let's add the following:

```js
init() {
  try {
    console.log('Initializing app...');

    // Load all sound files
    await this.loadAllSounds();

    // Try to play rain (this will fail!)
    this.soundManager.setVolume('rain', 30);
    await this.soundManager.playSound('rain');

    this.isInitialized = true;
    console.log('✓ App initialized successfully');
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
}
```

As soon as you open your browser, you'll see an error in the console:

```
Failed to play rain: NotAllowedError: play() failed because the user didn't interact with the document first.
```

This is because browsers block autoplay without user interaction. This is actually a good thing - it prevents annoying auto-playing ads!

## Quick Test with Console

First, we need to make our app accessible in the console. Update the bottom of `app.js`:

```js
document.addEventListener('DOMContentLoaded', () => {
  app = new AmbientMixer(); // Now accessible globally
  app.init();

  // Make app available for testing in the browser
  window.app = app;
});
```

Now you can test our methods manually. Open the browser console and type:

```js
// Test playing a sound (after page loads)
await app.soundManager.playSound('rain');

// Test setting volume
app.soundManager.setVolume('rain', 50);

// Test pausing
app.soundManager.pauseSound('rain');

// Play again
await app.soundManager.playSound('rain');
```

These should work when you type them in the console because the console counts as user interaction!

Now remove the play test from your `init` method:

```js
async init() {
  try {
    console.log('Initializing app...');

    // Load all sound files
    await this.loadAllSounds();

    this.isInitialized = true;
    console.log('✓ App initialized successfully');
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
}
```

Also, remove the `window.app = app;`

Now that we have the basic sound manager, we will move to the UI so that we can start to hook up stuff in the visual part of our app.
