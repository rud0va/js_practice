# Sound Data

Before we start writing any logic and creating classes, I want to first create a data store for our sounds. This could be coming from a database, but we want this to be a frontend project and we don't have a ton of sound, so keeping them in an object in a file is perfect.

Create a file in the `js` folder called `soundData.js` and add the following array:

```js
// Sound Data Configuration
export const sounds = [
    {
        id: 'rain',
        name: 'Rain',
        icon: 'fa-cloud-rain',
        color: 'from-blue-500 to-cyan-500',
        file: 'rain.mp3',
        description: 'Gentle rainfall'
    },
    {
        id: 'ocean',
        name: 'Ocean Waves',
        icon: 'fa-water',
        color: 'from-teal-500 to-blue-500',
        file: 'ocean.mp3',
        description: 'Calming ocean waves'
    },
    {
        id: 'forest',
        name: 'Forest',
        icon: 'fa-tree',
        color: 'from-green-500 to-emerald-500',
        file: 'birds.mp3',
        description: 'Birds and wind in trees'
    },
    {
        id: 'fireplace',
        name: 'Fireplace',
        icon: 'fa-fire',
        color: 'from-orange-500 to-red-500',
        file: 'fireplace.mp3',
        description: 'Crackling fire'
    },
    {
        id: 'thunder',
        name: 'Thunder',
        icon: 'fa-bolt',
        color: 'from-purple-500 to-indigo-500',
        file: 'thunder.mp3',
        description: 'Distant thunder'
    },
    {
        id: 'wind',
        name: 'Wind',
        icon: 'fa-wind',
        color: 'from-gray-400 to-gray-600',
        file: 'wind.mp3',
        description: 'Gentle breeze'
    },
    {
        id: 'cafe',
        name: 'Coffee Shop',
        icon: 'fa-mug-hot',
        color: 'from-amber-600 to-yellow-600',
        file: 'cafe.mp3',
        description: 'Ambient cafe sounds'
    },
    {
        id: 'night',
        name: 'Night',
        icon: 'fa-moon',
        color: 'from-indigo-600 to-purple-600',
        file: 'night.mp3',
        description: 'Crickets and night sounds'
    }
];
```

We have a bunch of objects with an id, name, icon, which is a font-awesome class. A title, which is the filename and a description.

This will serve as our database of sounds.

I also want to store presets here. Add the following object under the sounds array:

```js
// Default Presets Configuration
export const defaultPresets = {
    focus: {
        name: 'Focus',
        icon: 'fa-brain',
        sounds: {
            rain: 30,
            cafe: 20,
            wind: 10
        }
    },
    relax: {
        name: 'Relax',
        icon: 'fa-spa',
        sounds: {
            ocean: 40,
            forest: 30,
            wind: 20
        }
    },
    sleep: {
        name: 'Sleep',
        icon: 'fa-bed',
        sounds: {
            rain: 40,
            night: 30,
            wind: 15
        }
    }
};
```

Here we have each of the three presets with a name, icons and sounds array. The number for the sound is the volume.


## Main Class & Initalizer

We are going to have a class that manages all the methods that have to do with sound. From playing, pausing, etc. 


In the `app.js` file, add the following:

```js
import { sounds, defaultPresets } from './soundData.js';

class AmbientMixer {
  // Initialize dependencies and default state
  constructor() {
    console.log('Initializing state...');
    this.soundManager = null;
    this.ui = null;
    this.presetManager = null;
    this.timer = null;
    this.currentSoundStates = {};
    this.isInitialized = false;
  }

  // Initialize application components and load resources
  init() {
    try {
      console.log('Initializing app...');
      this.isInitialized = true;
    } catch (error) {
      console.log('Failed to initialize app: ', error);
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new AmbientMixer();
  app.init();
});
```

When you run the app in the browser, you should see the console logs.

Here is what we did:

1. Created the Main App Structure

We created js/app.js with a class called `AmbientMixer` that will be the central controller for our entire application. This class will coordinate between all the other components we'll build.

2. Set Up the Constructor
The constructor is where we define what our app will need to function:
- Dependencies (set to null initially): soundManager, ui, presetManager, timer
- State tracking: `currentSoundStates` object and `isInitialized` flag

`currentSoundStates` is a crucial piece of state that tracks the current volume and playing status of each sound in our mixer.

The `null` values are placeholders - we're saying "these will be real objects later, but not yet." This is a common pattern that makes it clear what the class will need while keeping the constructor lightweight.

3. Created the Initialization Method
The `init()` method is where the real work happens. This is where we'll:
- Create all our dependency objects
- Load audio files
- Set up event listeners
- Connect everything together

4. Set Up Module Loading
We added the script tag with type="module" to enable ES6 modules, which allows us to organize our code across multiple files and import/export functionality between them.

5. Added App Startup
We used DOMContentLoaded to ensure our app starts only after the HTML is fully loaded, which is essential for DOM manipulation.ß



