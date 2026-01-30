# Theme Toggle

Let's add a dark/light theme toggle to give users control over the app's appearance. This uses CSS classes to switch between color schemes.

## Add Theme Toggle Reference

In `ui.js`, add a reference to the theme toggle button in the `init()` method:

```js
init() {
  // ... existing elements ...
  this.themeToggle = document.getElementById('themeToggle');
}
```

## Add Toggle Theme Method

In `ui.js`, add a method to toggle between themes. This method adds or removes a class on the body element and swaps the sun/moon icon:

```js
// Toggle theme
toggleTheme() {
  const body = document.body;
  const icon = this.themeToggle.querySelector('i');

  if (body.classList.contains('light-theme')) {
    body.classList.remove('light-theme');
    icon.classList.replace('fa-moon', 'fa-sun');
  } else {
    body.classList.add('light-theme');
    icon.classList.replace('fa-sun', 'fa-moon');
  }
}
```

## How Theme Switching Works

The theme system uses a simple class-based approach:

1. **Default state**: Dark theme (no class on body)
2. **Light theme**: Add `light-theme` class to body
3. **CSS cascade**: The class changes CSS variables or overrides styles
4. **Icon swap**: Visual feedback showing current mode

## Add Event Listener

In `setupEventListeners` in `app.js`, add a listener for the theme toggle button:

```js
// Theme toggle
if (this.ui.themeToggle) {
  this.ui.themeToggle.addEventListener('click', () => {
    this.ui.toggleTheme();
  });
}
```

## Add Light Theme Styles

You should already have the CSS for the light theme in your template, but here it is anyway:

```css
/* Light Theme */
body.light-theme {
  background: linear-gradient(
    135deg,
    #ffeaa7 0%,
    #74b9ff 50%,
    #a29bfe 100%
  ) !important;
}

body.light-theme * {
  color: #2d3436;
}

body.light-theme .text-white {
  color: #2d3436 !important;
}

body.light-theme .bg-white\/10 {
  background-color: rgba(255, 255, 255, 0.7) !important;
}

body.light-theme .bg-white\/20:hover {
  background-color: rgba(255, 255, 255, 0.9) !important;
}

body.light-theme .border-white\/20 {
  border-color: rgba(0, 0, 0, 0.2) !important;
}

body.light-theme .border-white\/30 {
  border-color: rgba(0, 0, 0, 0.3) !important;
}

body.light-theme .text-white\/60 {
  color: rgba(45, 52, 54, 0.6) !important;
}

body.light-theme input[type='range']::-webkit-slider-track {
  background: rgba(0, 0, 0, 0.2);
}

body.light-theme input[type='range']::-moz-range-track {
  background: rgba(0, 0, 0, 0.2);
}
```

## CSS Specificity Strategy

The light theme CSS works through specificity:

1. **Base styles**: Default dark theme styles
2. **Override with class**: `body.light-theme` selector has higher specificity
3. **Cascade down**: All children inherit the light theme
4. **Important override**: `!important` forces text color changes where needed

## Test the Theme Toggle

Save and refresh. Now you can:

1. **Click the sun/moon icon** in the top right
2. **Dark to light**: Background becomes purple gradient, text darkens
3. **Light to dark**: Returns to dark gradient background
4. **Icon changes**: Sun icon in dark mode, moon icon in light mode
5. **All elements update**: Cards, buttons, sliders adapt to theme

## Persistence (Optional Enhancement)

To remember the user's theme preference, you could add localStorage:

Add this to the `toggleTheme` method in the `ui.js` file:

```js
// In toggleTheme method
toggleTheme() {
  const body = document.body;
  const icon = this.themeToggle.querySelector('i');

  if (body.classList.contains('light-theme')) {
    body.classList.remove('light-theme');
    icon.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.add('light-theme');
    icon.classList.replace('fa-sun', 'fa-moon');
    localStorage.setItem('theme', 'light');
  }
}

// In init method
init() {
  // ... existing code ...

  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    this.toggleTheme();
  }
}
```

## How It All Works

The theme system demonstrates:

- **CSS class toggling**: JavaScript adds/removes classes
- **CSS cascade**: Styles flow down from body to all children
- **Specificity overrides**: Light theme rules override dark defaults
- **Icon feedback**: Visual indicator of current mode

This approach is simple, performant, and doesn't require reloading or complex state management.

Congratulations! You've built a fully functional ambient sound mixer with all major features!
