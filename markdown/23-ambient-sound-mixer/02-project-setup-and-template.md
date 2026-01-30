# Project Setup and Template

For this project, we will be using a pre-built template that includes all the HTML and CSS. We are not going to be typing out the HTML/CSS because the focus is on the JavaScript functionality and OOP architecture.

I have included a folder called `ambient-sound-mixer-template` in the lesson files. You can find it in the main project directory.

Take the template folder and copy it to your machine. Rename it to `ambient-sound-mixer` and open it up with VS Code. Open `index.html` with the Live Server extension.

You should see the UI, although nothing will work because there is no JavaScript. The only things that will work are the basic HTML interactions like the theme toggle button and the modal for saving presets. That is because we are including Tailwind CSS and Font Awesome. The rest of the JavaScript will be written from scratch.

## Template Structure

The template includes:

- **index.html** - Complete HTML structure with all UI elements
- **css/styles.css** - Custom CSS for animations and styling
- **audio/** - Folder with 8 ambient sound files (rain, ocean, cafe, etc.)

## What We'll Build

We will be creating 6 JavaScript modules:

1. **soundData.js** - Configuration data for sounds and presets
2. **soundManager.js** - Handles all audio operations using the HTML5 audio api
3. **ui.js** - Manages all DOM updates and visual feedback
4. **presetManager.js** - Saves and loads user presets to localStorage
5. **timer.js** - Sleep timer functionality
6. **app.js** - Main application class that coordinates everything

Each module will be a separate class with a single responsibility. This is the foundation of good OOP design.

In the `index.html` file, add the following script tag at the bottom: 

```html
    <script src="./js/app.js" type="module"></script>
```

We are loading the main `app.js` file as an ES6 module. We can do this right in the browser now with no extra tooling.

Now that we have our template setup, we can start working on the JavaScript. Let's begin with the data module.
