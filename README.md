# DTV Book

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![CSS](https://img.shields.io/badge/CSS-Custom_Properties-blue)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-f38020)

A beautiful, responsive web-based ebook reader for "DTV" by Michael Moritz - a portrait of Don Valentine and the roots of Sequoia Capital.

## Overview

DTV Book is a static web application that presents Michael Moritz's book about Don Valentine, the legendary founder of Sequoia Capital, in a clean, distraction-free reading experience. The reader is designed with careful attention to typography and UI/UX principles, making it comfortable for extended reading sessions.

The application features a cover page with the book's artwork and Don Valentine's signature, smooth chapter transitions, and persistent reading progress. It works seamlessly across desktop and mobile devices, with full support for both light and dark themes based on user preference or system settings.

## Features

- **Dark/Light Theme** - Toggle between themes with system preference detection and persistence
- **Chapter Navigation** - Navigate via header controls, keyboard arrows, or "Next Chapter" buttons
- **Reading Progress** - Visual progress bar tracks position through the entire book
- **Responsive Design** - Optimized typography and layout for all screen sizes
- **Smooth Animations** - Polished transitions following UI/UX best practices (under 300ms)
- **Social Sharing** - Open Graph and Twitter Card meta tags with custom imagery

## Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | Vanilla JavaScript (ES6+) |
| Styling | CSS Custom Properties, Responsive Design |
| Typography | Cormorant Garamond, Inter (Google Fonts) |
| Hosting | Cloudflare Pages |

## Getting Started

### Prerequisites

- Any modern web browser
- A local web server for development (e.g., `python -m http.server` or VS Code Live Server)

### Installation

```bash
# Clone the repository
git clone https://github.com/coleschaffer/DTVBook.git
cd DTVBook
```

### Running Locally

```bash
# Using Python
python -m http.server 3000

# Or using Node.js
npx serve .
```

Then open `http://localhost:3000` in your browser.

### Deployment

The site is deployed on Cloudflare Pages. To deploy your own instance:

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler pages deploy . --project-name=your-project-name
```

## Project Structure

```
DTVBook/
├── index.html           # Main HTML with cover and reader structure
├── styles.css           # Complete styling with theming support
├── reader.js            # Reader logic, navigation, and state management
├── book-content.js      # Parsed book content organized by chapters
├── og-image.jpg         # Open Graph image for social sharing
├── epub_extracted/      # Extracted assets from original EPUB
│   ├── cover_image.jpg  # Book cover artwork
│   └── signature.png    # Don Valentine's signature
└── Dtv_Michael_Moritz.epub  # Original EPUB source
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` | Previous chapter |
| `→` | Next chapter |
| `d` | Toggle dark/light theme |

## Live Site

Visit the live book at [dtvbook.com](https://dtvbook.com)

## License

All rights reserved. The book content is the intellectual property of Michael Moritz.
