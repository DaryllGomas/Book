# Enter Zen - Interactive Book Landing Page

An immersive, interactive landing page featuring a 3D book that opens and redirects to another site when clicked. The book floats against a cosmic background with animated stars.

## Features

- **Interactive 3D Book**: Click or press Enter/Space to animate the book opening
- **Immersive Background**: Cosmic background with animated twinkling stars
- **Accessibility Support**: Keyboard navigation and screen reader support
- **Sound Effects**: Subtle audio feedback when the book is opened
- **Smooth Transitions**: Polished animations between states
- **Loading Indicator**: Visual feedback during page transition

## Project Structure

```
├── index.html              # Main HTML structure
├── css/
│   ├── styles.css          # Main stylesheet with imports
│   ├── base.css            # Core layout and foundation styles
│   ├── components.css      # Component-specific styles
│   └── animations.css      # Animation definitions
├── js/
│   └── script.js           # Interactive functionality
└── assets/
    ├── book.png            # Book cover image
    ├── cosmic.png          # Background image
    └── fonts/              # Custom fonts (if any)
```

## File Details

### CSS Architecture

The CSS has been organized into modular files:

- **styles.css**: Main stylesheet that imports the modular files
- **base.css**: Core layout and styling fundamentals
- **components.css**: Individual UI component styles
- **animations.css**: Animation keyframes and transition definitions

### JavaScript Features

- **Modular Organization**: Clean separation of concerns and functions
- **Keyboard Support**: Full keyboard navigation 
- **Performance Optimizations**: Uses `will-change` for better GPU acceleration
- **Debug Helpers**: Console-accessible debugging functions
- **Sound Effects**: Generated with Web Audio API

### Animation Pipeline

1. User clicks the book or presses Enter/Space
2. Book cover animates open with 3D transform
3. Pages appear with subtle animation
4. Screen fades out
5. Loading indicator appears
6. Page redirects to target URL

## Browser Support

Tested and working in:
- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

## Accessibility

- Keyboard navigation
- ARIA attributes
- Screen reader support
- Visual focus indicators
- Instruction text for keyboard users

## Credits

- Original design: Website Cover Project
- Images: assets/book.png, assets/cosmic.png

## License

MIT 

# Website Cover Project

This project displays an interactive book animation against a dynamic cosmic background.

## Features

*   Animated cosmic nebula background using CSS gradients.
*   Multi-layered parallax starfield.
*   Interactive book cover that opens on click/keypress.
*   Pulsing glow effect on the book and text.
*   Subtle animated energy wisps flowing towards the book.
*   Hover effects to enhance interactivity.

## Troubleshooting

### Book Opening Animation Glitch

**Symptom:** The book cover does not rotate open smoothly, it glitches, stutters, or behaves unexpectedly.

**Cause:** This issue was previously caused by conflicting CSS transitions on the `.book-cover` element. Specifically, adding a `transition` for the `box-shadow` property (for hover effects) interfered with the primary `transition` needed for the `transform: rotateY(-180deg)` property (the opening rotation).

**Fix (Applied):** The `transition: box-shadow ...;` property and the `.book-container:hover .book-cover` CSS rule were commented out in `css/styles.css`. This isolates the main `transform` transition, allowing it to run smoothly.

**Future Prevention:** Be cautious when applying multiple CSS transitions or complex hover effects to elements that also have significant transform animations. If glitches occur, try temporarily removing hover effects or simplifying transitions on the affected element to isolate the conflict. 