# Delete Custom Presets

Let's add the ability to delete custom presets. Each custom preset button has a small delete button (X) that appears on hover. When clicked, it removes the preset from localStorage and the UI.

## Add Delete Method to PresetManager

In `presetManager.js`, add a method to delete a preset. This method removes the preset from our customPresets object using JavaScript's `delete` operator, then saves the updated object back to localStorage:

```js
// Delete a custom preset
deletePreset(presetId) {
  if (this.customPresets[presetId]) {
    delete this.customPresets[presetId];
    this.saveCustomPresets();
    return true;
  }
  return false;
}
```

The method returns `true` if the preset was found and deleted, `false` if it didn't exist.

## Add Remove Method to UI

In `ui.js`, add a method to remove the preset button from the DOM. This uses a CSS selector to find the button with the matching preset ID, then removes it from its parent container:

```js
// Remove custom preset from UI
removeCustomPreset(presetId) {
  const button = document.querySelector(`.custom-preset-btn[data-preset="${presetId}"]`);
  if (button) {
    button.remove();
  }
}
```

## Add Delete Custom Preset Method

In `app.js`, add a method that coordinates the deletion. This method calls the PresetManager to delete from storage, then updates the UI to remove the button:

```js
// Delete custom preset
deleteCustomPreset(presetId) {
  if (this.presetManager.deletePreset(presetId)) {
    this.ui.removeCustomPreset(presetId);
    console.log(`Preset ${presetId} deleted`);
  }
}
```

## Add Delete Event Listener

In `setupEventListeners` in `app.js`, add to the existing click event listener. The delete button is nested inside the preset button, so we need to handle it separately and use `stopPropagation()` to prevent the parent button's click from also firing.

The order is also important. We dont want it to continue to load events after the delete. So put this before the other custom preset handler:

```js
document.addEventListener('click', async (e) => {
  // ... existing click handlers ...

   // Check if delete button was clicked - ADD THIS
     if (e.target.closest('.delete-preset')) {
        e.stopPropagation();
        const presetId = e.target.closest('.delete-preset').dataset.preset;

        this.deleteCustomPreset(presetId);

        return;
      }

      // Check if a custom preset button was clicked 
      if (e.target.closest('.custom-preset-btn')) {
        const presetId = e.target.closest('.custom-preset-btn').dataset.preset;
        this.loadCustomPreset(presetId);
      }
});
```

The `stopPropagation()` is crucial here - without it, clicking delete would also trigger the parent button's click event, trying to load the preset we're deleting.

## How the Delete Flow Works

When a user hovers over a custom preset button and clicks the X:

1. **Event capture**: The click event is caught by our delegated listener
2. **Stop propagation**: Prevents the parent button from also responding
3. **Confirmation**: Browser confirms the user wants to delete
4. **Storage deletion**: PresetManager removes from customPresets object and localStorage
5. **UI update**: The button is removed from the DOM
6. **Permanent**: The preset is gone even after page refresh

## Test the Delete Functionality

Save and refresh. Now you can:

1. **Save a custom preset** - It appears with a star icon
2. **Hover over it** - The red X delete button appears
3. **Click the X** - Confirmation dialog appears
4. **Confirm deletion** - Preset disappears
5. **Refresh the page** - Deleted preset stays gone
6. **Cancel deletion** - Preset remains if you click Cancel

## Event Delegation Benefits

We're using event delegation (one listener on document) rather than adding individual listeners to each delete button. This approach:
- Works for dynamically created buttons
- Uses less memory (one listener vs many)
- Automatically handles new presets without attaching new listeners

The trade-off is we need to check what was clicked, but for dynamic content like our custom presets, it's the ideal pattern.

In the next section, we'll add a timer feature for meditation sessions!