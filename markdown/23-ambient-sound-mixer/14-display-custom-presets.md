# Display Custom Presets

Now let's display the saved custom presets in buttons. Users will see their saved presets appear below the default presets, with the ability to load and delete them.

## Add Custom Presets Container Reference

First, we need a reference to where custom presets will be displayed. In `ui.js`, update the `init` method:

```js
init() {
  // Get DOM elements
  this.soundCardsContainer = document.querySelector('.grid');
  this.masterVolumeSlider = document.getElementById('masterVolume');
  this.masterVolumeValue = document.getElementById('masterVolumeValue');
  this.playPauseButton = document.getElementById('playPauseAll');
  this.resetButton = document.getElementById('resetAll');
  this.modal = document.getElementById('savePresetModal');
  this.customPresetsContainer = document.getElementById('customPresets'); // Add this
}
```

## Create Custom Preset Button

In `ui.js`, add a method that creates the HTML for a custom preset button:

```js
// Create custom preset button
createCustomPresetButton(name, presetId) {
  const button = document.createElement('button');
  button.className = 'custom-preset-btn bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-300 relative group';
  button.dataset.preset = presetId;

  button.innerHTML = `
    <i class="fas fa-star mr-2 text-yellow-400"></i>
    ${name}
    <button type="button" class="delete-preset absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" data-preset="${presetId}">
      <i class="fas fa-times text-xs text-white"></i>
    </button>
  `;

  return button;
}
```

This method builds a button element programmatically using `createElement` and sets its classes, data attributes, and inner HTML. The button includes a delete button (X) that only appears on hover using CSS opacity transitions.

## Add Custom Preset to UI

This method takes a preset name and ID, creates the button using our helper method, and appends it to the custom presets container in the DOM:

```js
// Add custom preset to UI
addCustomPreset(name, presetId) {
  const button = this.createCustomPresetButton(name, presetId);
  this.customPresetsContainer.appendChild(button);
}
```

## Update Save Current Preset

In `app.js`, update the `saveCurrentPreset` method to also add the preset to the UI after saving. This ensures the preset appears immediately without needing a page refresh:

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

  // Add the preset to the UI - ADD THIS LINE
  this.ui.addCustomPreset(name, presetId);

  this.ui.hideModal();

  console.log(`Preset "${name}" saved successfully with ID: ${presetId}`);
}
```

## Load Existing Custom Presets on Init

In `app.js`, add a method to load all existing custom presets from localStorage when the app starts. This uses `Object.entries` to loop through all saved presets and add them to the UI:

```js
// Load custom presets into UI
loadCustomPresetsUI() {
  const customPresets = this.presetManager.customPresets;
  for (const [presetId, preset] of Object.entries(customPresets)) {
    this.ui.addCustomPreset(preset.name, presetId);
  }
}
```

Call this in the `init` method after setting up event listeners:

```js
async init() {
  // ... existing init code ...

  // Set up event listeners
  this.setupEventListeners();

  // Load custom presets from localStorage - ADD THIS
  this.loadCustomPresetsUI();

  this.isInitialized = true;
  console.log('✓ App initialized successfully');
}
```


In the next section, we'll add the ability to load and play custom presets!
