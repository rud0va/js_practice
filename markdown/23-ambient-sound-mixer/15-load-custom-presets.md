# Load Custom Presets

We can see our custom preset buttons, now we want to be able to load and play them.

In `presetManager.js`, add a method to retrieve a saved preset by its ID. This simply looks up the preset in our customPresets object:

```js
// Load a preset by ID
loadPreset(presetId) {
  return this.customPresets[presetId] || null;
}
```

## Add Load Custom Preset Method

The way that we load a custom preset is very similar to the way we load a file preset. So instead of adding a whole new method, let's use the `loadPreset` from `app.js` and just add a  `custom` param. Then check it and set it to load from the preset manager if it is custom:

```js
 // Load a preset config
  loadPreset(presetKey, custom = false) {
    let preset;

    if (custom) {
      // Get preset from localStorage
      preset = this.presetManager.loadPreset(presetKey);
    } else {
      // Get preset from soundData.js
      preset = defaultPresets[presetKey];
    }
// ... Rest of code
  }
```


## Reset Sound State

One more thing I want to do before we add the event listener is to clear the currentSoundState in the toggleSound. You may have an issue with old sounds being leftover when you load a preset. 

In the `app.js` file in the `toggleSound` method, Add the following line after the pause:

```js
 // Sound is on, turn it off
  this.soundManager.pauseSound(soundId);
  this.currentSoundState[soundId] = 0; // ADD THIS LINE
  this.ui.updateSoundPlayButton(soundId, false);
```

## Add Event Listener for Custom Presets

In `setupEventListeners` in `app.js`, add to the existing click event listener. We check if a custom preset button was clicked by looking for the `custom-preset-btn` class, then extract the preset ID from the button's data attribute:

```js
document.addEventListener('click', async (e) => {
  // ... existing click handlers ...

  // Check if a custom preset button was clicked - ADD THIS
  if (e.target.closest('.custom-preset-btn')) {
    const presetKey = e.target.closest('.custom-preset-btn').dataset.preset;
    this.loadCustomPreset(presetKey, true);
  }
});
```

## Active Class On Custom Presets

To make the custom buttons active, change the `setActivePreset` in the `ui.js` to the following:

```js
setActivePreset(presetkey) {
  // Remove active class from all default and custom preset buttons
  document.querySelectorAll('.preset-btn, .custom-preset-btn').forEach((btn) => {
    btn.classList.remove('preset-active');
  });

  // Add active class to the selected preset button
  const activeButton = document.querySelector(
    `.preset-btn[data-preset="${presetkey}"], .custom-preset-btn[data-preset="${presetkey}"]`
  );
  if (activeButton) {
    activeButton.classList.add('preset-active');
  }
}
```

Add the following at the very bottom of the `loadPreset` method in the `app.js` file:

```js
 if (presetKey) {
      this.ui.setActivePreset(presetKey);
    }
````

We also want to reset the active link when we click the reset button. Open the `app.js` file and add the following to the `resetAll` method under the `this.masterVolume = 100;` line:

```js
 // Reset active preset
this.ui.setActivePreset(null);
```


## Test the Functionality

Save and refresh. Now you can:

1. **Create a mix** and save it - It appears below default presets
2. **Refresh the page** - Your saved presets persist and load
3. **Click a custom preset** - It loads your saved mix
4. **Save multiple presets** - They all appear in the list

## How It Works

The custom preset system works through several coordinated steps:

1. **Saving**: PresetManager stores to localStorage, returns an ID
2. **Display**: UI creates a button with that ID as a data attribute
3. **Loading**: Click handler reads the ID, fetches preset from PresetManager
4. **Persistence**: On app init, we read all saved presets and recreate the buttons

The data flow: localStorage ↔ PresetManager ↔ App ↔ UI

In the next section, we'll add the ability to delete custom presets!
