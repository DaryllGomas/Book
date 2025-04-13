# Integration Instructions for Zen Landing Page

This document provides instructions on how to integrate the animated book landing page with your existing Zen Story website.

## Files Overview

The landing page consists of the following files and directories:

- `index.html`: The main HTML file for the landing page
- `css/styles.css`: CSS styles and animations for the book and text effects
- `js/script.js`: JavaScript for book opening animation and page transition
- `assets/book.png`: The book image used for the landing page

## Integration Steps

### Option 1: Use as a Standalone Landing Page

1. Upload all files and directories to your web server, maintaining the same directory structure.
2. Set this page as the main entry point to your website.
3. The page will automatically redirect to your existing Zen Story page (https://daryllgomas.github.io/website/zen-story) when the book is clicked.

### Option 2: Integrate with Existing GitHub Pages Site

1. Add all files to your GitHub repository that hosts the existing website.
2. Place the files at the root level of your repository or in a subdirectory.
3. If placed at the root level, this will become your new homepage.
4. If placed in a subdirectory (e.g., `/landing/`), you can access it via https://daryllgomas.github.io/website/landing/

### Customization Options

- **Change Target URL**: If you need to redirect to a different page, modify the `targetUrl` variable in `js/script.js`.
- **Adjust Animation Timing**: You can modify the animation durations in both `css/styles.css` and `js/script.js`.
- **Responsive Behavior**: The page is already responsive, but you can adjust the media queries in `css/styles.css` if needed.

## Testing

Before deploying to production, test the landing page to ensure:

1. The book image displays correctly with the shimmering effect
2. The "Enter Zen" text is visible and pulsates
3. Clicking the book triggers the opening animation
4. The page correctly transitions to your Zen Story website

## Troubleshooting

- If the book image doesn't appear, check that the path to `assets/book.png` is correct
- If animations don't work, ensure that your web hosting supports modern CSS animations
- If the redirect doesn't work, verify the target URL in `js/script.js`

For any questions or issues, please refer to the code comments or contact your developer.
