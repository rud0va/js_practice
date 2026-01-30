# Sound Manager & Load Sound

Now that we have our main initializer set up, let's start on the sound manager. This is where we will do things like load, play, pause sounds and handle volume control. We will work with the HTML5 audio api.

Create a new file at `js/soundManager.js` and add the following code for now:

```js
export class SoundManager {
  constructor() {
    this.audioElements = new Map();
    this.isPlaying = false;
    console.log('SoundManager created...');
  }

  // Load a sound file (placeholder for now)
  async loadSound(soundId, filePath) {
    console.log(`Loading sound: ${soundId} from ${filePath}`);
    return true;
  }
}
```

We created a class called `SoundManager` and added a constructor where we set some state. Let's go over what these values are:

- `this.audioElements`: We set this to a new Map. A map is a JavaScript data structure that allows us to store key-value pairs, where each key is unique. In our case, we'll use the sound ID (like 'rain', 'thunder', etc.) as the key and store the actual audio element as the value.
- `this.isPlaying`: A boolean that tracks whether any sound is currently playing. This helps us manage the overall play/pause state of the mixer.

This makes it easy to:

- Store multiple audio elements - One for each sound
- Quickly find a specific sound - Just use the sound ID as the key
- Manage sound references - Keep track of all loaded sounds in one place

The `loadSound` method is currently just a placeholder that logs what it's doing and returns true.

## Initialize the SoundManager

Now go back to the app.js file and import the new class:

```js
import { SoundManager } from './soundManager.js';
```

In the app.js constructor, instantiate it:

```js
this.soundManager = new SoundManager();
```

Now in the `init` method of the `app.js` file, call the `loadSound()` method:

```js
this.soundManager.loadSound('rain', 'audio/rain.mp3');
```

You should see the text in the console that the audio was loaded. It is not actually loaded yet, we are just logging it. In the next lesson, we will work on loading audio.

# Loading Audio Elements

Right now our `loadSound` method just logs and returns true. Let's actually implement the audio loading functionality. This will allow us to load our sound files and prepare them for playback.

Open `js/soundManager.js` and update the `loadSound` method:

```js
// Load a sound file
loadSound(soundId, filePath) {
  try {
    const audio = new Audio();
    audio.src = filePath;
    audio.loop = true;
    audio.preload = 'metadata';
    this.audioElements.set(soundId, audio);
    return true;
  } catch (error) {
    console.log(`Failed to load sound: ${soundId}`);
    return false;
  }
}
```

Let's break down what's happening here:

1. **Create Audio Element** - We create a new HTML5 Audio element and set its source
2. **Set Loop** - Since these are ambient sounds, they should loop continuously
3. **Preload Metadata** - We use 'metadata' instead of 'auto' which is lighter on mobile browsers
4. **Store in Map** - We store the audio element immediately using the soundId as the key
5. **Return Status** - We return true for success or false for failure

### Notes:

- **Mobile Compatibility**: We don't wait for `canplaythrough` event because on mobile browsers, it may never fire due to autoplay policies. The audio will load and buffer when the user actually plays it.
- **Preload Strategy**: Using `preload='metadata'` loads only the file metadata (duration, etc.) instead of buffering the entire audio file upfront, which is more mobile-friendly.
- The audio elements are created immediately but the actual audio data loads on-demand when playback starts.

## Test `loadSound`

Add the following to the `init()` in the `app.js` file:

```js
init() {
    try {
      console.log('Initializing app...');

      this.soundManager.loadSound('rain', 'audio/rain.mp3');
      console.log('Audio Elements:', this.soundManager.audioElements);

      this.isInitialized = true;
    } catch (error) {
      console.log('Failed to initialize app: ', error);
    }
  }
```

You should see the console log that the rain sound was loaded and see it in the map. There are other ways to check as well.

Open your devtools and go to the network tab. You should see the rain.mp3 file.

You should now see "Sound Loaded" and 'rain' or whatever you hardcoded in the `app.js` file.

## Load All Sounds

We will have a method in the `app.js` to load all sounds. You may ask why we are putting this in the main app file. That's because the soundManager has a single responsibility. It manages individual sounds. The main app file is the one that orchestrates it. This also keeps it flexible to that another app could use the soundManager if it wanted. It may load sounds on demand instead of all up front, etc.

We also need to load all sounds at once, not one after another. So we will map through the sounds and await each one and then call `await Promise.all()`.

Add the following to the `AmbientMixer` class in the `app.js` file:

```js
 // Load all sound files
loadAllSounds() {
  sounds.forEach((sound) => {
    const audioUrl = `audio/${sound.file}`;
    const success = this.soundManager.loadSound(sound.id, audioUrl);
    if (!success) {
      console.warn(`Could not load sound: ${sound.name} from ${audioUrl}`);
    }
  });
}
```

This is pretty simple. We are mapping through the sounds and calling the `loadSound` from the `SoundManager` class for each one. This loads all the sounds.

Now in the `app.js` in the `init()`, add the following:

```js
 init() {
    try {
      console.log('Initializing app...');

      // Load audio files with fallback to placeholder
      await this.loadAllSounds();

      this.isInitialized = true;
    } catch (error) {
      console.log('Failed to initialize app: ', error);
    }
  }
```

You should see them all in the console and you can check the network tab as well. Now all sounds are being loaded.
