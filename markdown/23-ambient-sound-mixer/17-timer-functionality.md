# Timer Functionality

Let's add a meditation timer that automatically stops all sounds after a set duration. This is useful for meditation sessions or falling asleep to ambient sounds.

## Create the Timer Class

Create a new file `js/timer.js`. This class manages a countdown timer using `setInterval` to decrease the remaining time every second. It takes two callback functions: one for when the timer completes and one for each tick to update the display:

```js
// Timer Module
export class Timer {
  constructor(onComplete, onTick) {
    this.duration = 0;
    this.remaining = 0;
    this.intervalId = null;
    this.onComplete = onComplete;
    this.onTick = onTick;
    this.isRunning = false;
  }

  // Start timer with duration in minutes
  start(minutes) {
    if (minutes <= 0) {
      this.stop();
      return;
    }

    this.duration = minutes * 60; // Convert to seconds
    this.remaining = this.duration;
    this.isRunning = true;

    // Clear any existing interval
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Update immediately
    this.updateDisplay();

    // Start countdown
    this.intervalId = setInterval(() => {
      this.remaining--;
      this.updateDisplay();

      if (this.remaining <= 0) {
        this.complete();
      }
    }, 1000);
  }

  // Stop timer
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.duration = 0;
    this.remaining = 0;
    this.isRunning = false;
    this.updateDisplay();
  }

  // Timer completed
  complete() {
    this.stop();
    if (this.onComplete) {
      this.onComplete();
    }
  }

  // Update display
  updateDisplay() {
    const minutes = Math.floor(this.remaining / 60);
    const seconds = this.remaining % 60;

    if (this.onTick) {
      this.onTick(minutes, seconds);
    }
  }
}
```

## How the Timer Works

The timer uses JavaScript's `setInterval` to create a countdown:

1. **Start**: Converts minutes to seconds, stores the duration
2. **Interval**: Every 1000ms (1 second), decreases `remaining` by 1
3. **Update**: Calls `onTick` callback with formatted time for display
4. **Complete**: When remaining hits 0, calls `onComplete` callback
5. **Cleanup**: `clearInterval` stops the countdown and prevents memory leaks

## Import and Initialize Timer

In `app.js`, import the Timer:

```js
import { sounds, defaultPresets } from './soundData.js';
import { SoundManager } from './soundManager.js';
import { PresetManager } from './presetManager.js';
import { UI } from './ui.js';
import { Timer } from './timer.js'; // Add this
```

In the constructor, initialize the timer with callbacks. The arrow functions preserve the `this` context so we can access the app's methods:

```js
constructor() {
  console.log('Initializing state...');
  this.soundManager = new SoundManager();
  this.ui = new UI();
  this.presetManager = new PresetManager();

  // Initialize timer with callbacks - MODIFY THIS
  this.timer = new Timer(
    () => this.onTimerComplete(),
    (minutes, seconds) => this.ui.updateTimerDisplay(minutes, seconds)
  );

  this.currentSoundState = {};
  this.masterVolume = 100;
  this.isInitialized = false;
}
```

## Add Timer Complete Handler

In `app.js`, add a method that runs when the timer reaches zero. This stops all sounds and resets the UI:

```js
// Timer complete callback
onTimerComplete() {
  // Stop all sounds
  this.soundManager.pauseAll();
  this.ui.updateMainPlayButton(false);

  // Update individual buttons
  sounds.forEach((sound) => {
    this.ui.updateSoundPlayButton(sound.id, false);
  });

  // Reset timer dropdown
  const timerSelect = document.getElementById('timerSelect');
  if (timerSelect) {
    timerSelect.value = '0';
  }

  // Clear and hide timer display
  if (this.ui.timerDisplay) {
    this.ui.timerDisplay.textContent = '';
    this.ui.timerDisplay.classList.add('hidden');
  }

  console.log('Timer complete, all sounds stopped');
}

```

Add a method to update the timer display. This formats the time as MM:SS with leading zeros:

```js
// Update timer display
updateTimerDisplay(minutes, seconds) {
  if (this.timerDisplay) {
    if (minutes > 0 || seconds > 0) {
      const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      this.timerDisplay.textContent = formattedTime;
      this.timerDisplay.classList.remove('hidden');
    } else {
      this.timerDisplay.classList.add('hidden');
    }
  }
}
```

The `padStart(2, '0')` ensures single digits show as "09" instead of "9".

## Add Timer Event Listener

In `setupEventListeners` in `app.js`, add a listener for the timer dropdown. When the user selects a duration, we start the timer:

```js
// Timer select
const timerSelect = document.getElementById('timerSelect');
if (timerSelect) {
  timerSelect.addEventListener('change', (e) => {
    const minutes = parseInt(e.target.value);
    // const minutes = 0.1; // Test
    if (minutes > 0) {
      this.timer.start(minutes);
      console.log(`Timer set for ${minutes} minutes`);
    } else {
      this.timer.stop();
    }
  });
}
```

## Reset Timer on Reset All

When the reset button is clicked, your timer should also reset. Add the following to `resetAll()` in the `app.js` file:

```js
this.timer.stop();
if (this.ui.timerSelect) {
  this.ui.timerSelect.value = '0';
}
```

## Test the Timer

Save and refresh. Now you can:

1. **Start playing some sounds**
2. **Select "5 minutes" from the timer dropdown**
3. **See the countdown display** appear showing "05:00" or 5 seconds if you use the commented out line
4. **Watch it count down** each second
5. **At 00:00** - All sounds stop automatically
6. **Select "Off"** - Timer stops and display hides

You can add different times in the HTML.

## How It All Connects

The timer system uses callbacks to maintain separation of concerns:

- **Timer class**: Only manages time counting, doesn't know about sounds
- **App class**: Provides callbacks that handle what happens on tick/complete
- **UI class**: Updates the visual display
- **Separation**: Timer is reusable and testable independently

This pattern lets each class focus on its single responsibility while still working together.

In the next section, we'll add a theme toggle for dark/light mode!
