/**
 * DTV Book Reader
 * A beautiful, responsive ebook reader with smooth animations
 * Following UI/UX principles from userinterface.wiki
 */

(function() {
  'use strict';

  // ========================================
  // State Management
  // ========================================
  // Detect system theme preference
  function getDefaultTheme() {
    const stored = localStorage.getItem('dtv-theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  const state = {
    currentChapter: 0,
    totalChapters: BOOK_CONTENT.chapters.length,
    theme: getDefaultTheme(),
    isTransitioning: false,
    scrollPosition: 0
  };

  // ========================================
  // DOM Elements
  // ========================================
  const elements = {
    coverScreen: document.getElementById('cover-screen'),
    startButton: document.getElementById('start-reading'),
    reader: document.getElementById('reader'),
    themeToggle: document.getElementById('theme-toggle'),
    currentSection: document.getElementById('current-section'),
    progressBar: document.getElementById('progress-bar'),
    chapterContent: document.getElementById('chapter-content'),
    readerContent: document.getElementById('reader-content'),
    prevButton: document.getElementById('prev-section'),
    nextButton: document.getElementById('next-section')
  };

  // ========================================
  // Initialization
  // ========================================
  function init() {
    // Apply saved theme
    applyTheme(state.theme);

    // Bind event listeners
    bindEvents();
  }

  // ========================================
  // Event Binding
  // ========================================
  function bindEvents() {
    // Start reading
    elements.startButton.addEventListener('click', startReading);

    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);

    // Navigation
    elements.prevButton.addEventListener('click', goToPreviousChapter);
    elements.nextButton.addEventListener('click', goToNextChapter);

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);

    // Scroll progress tracking
    elements.readerContent.addEventListener('scroll', updateScrollProgress);
    window.addEventListener('scroll', updateScrollProgress);

    // Save position on visibility change
    document.addEventListener('visibilitychange', saveReadingPosition);
  }

  // ========================================
  // Cover & Reader Transitions
  // ========================================
  function startReading() {
    // Hide cover with animation
    elements.coverScreen.classList.add('hidden');

    // Show reader after cover fades
    setTimeout(() => {
      elements.reader.classList.remove('hidden');
      elements.reader.classList.add('entering');

      // Always start at Preface (chapter 0)
      state.currentChapter = 0;
      loadChapter(0);

      // Remove entering class after animation
      setTimeout(() => {
        elements.reader.classList.remove('entering');
      }, 300);
    }, 300);
  }

  // ========================================
  // Theme Management
  // ========================================
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    // Update color-scheme meta tag to help override browser dark mode
    const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
    if (metaColorScheme) {
      metaColorScheme.content = theme;
    }
    state.theme = theme;
    localStorage.setItem('dtv-theme', theme);
  }

  function toggleTheme() {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);

    // Add subtle feedback animation
    elements.themeToggle.style.transform = 'scale(0.9)';
    setTimeout(() => {
      elements.themeToggle.style.transform = '';
    }, 150);
  }

  // ========================================
  // Chapter Loading & Rendering
  // ========================================
  function loadChapter(index) {
    if (state.isTransitioning) return;
    if (index < 0 || index >= state.totalChapters) return;

    state.isTransitioning = true;
    const chapter = BOOK_CONTENT.chapters[index];

    // Transition out current content
    elements.chapterContent.classList.add('transitioning');

    // Wait for exit animation (220ms ease-in)
    setTimeout(() => {
      // Update content
      elements.chapterContent.innerHTML = renderChapter(chapter, index);

      // Update UI
      state.currentChapter = index;
      elements.currentSection.textContent = formatChapterTitle(index, chapter.title);
      updateNavigationButtons();

      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'instant' });
      elements.readerContent.scrollTop = 0;

      // Remove transitioning class to trigger entrance animation
      elements.chapterContent.classList.remove('transitioning');

      // Save position
      saveReadingPosition();

      // Reset transition lock
      setTimeout(() => {
        state.isTransitioning = false;
        updateScrollProgress();
      }, 300);
    }, 220);
  }

  function renderChapter(chapter, chapterIndex) {
    let html = '';

    // Add chapter title
    html += `<h2>${chapter.title}</h2>`;

    // Render paragraphs
    chapter.paragraphs.forEach((para, index) => {
      const isFirstPara = index === 0;
      const isSectionStart = para.class === 'no-indent-caps';

      let className = '';
      if (isSectionStart) {
        className = 'section-start';
      }

      html += `<p class="${className}">${escapeHtml(para.text)}</p>`;
    });

    // Add next chapter button if not the last chapter
    if (chapterIndex < state.totalChapters - 1) {
      html += `
        <button class="next-chapter-btn" onclick="window.goToNextChapter()">
          <span class="next-chapter-label">Next Chapter</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      `;
    }

    return html;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatChapterTitle(index, title) {
    // Preface doesn't get a chapter number
    if (index === 0) {
      return title;
    }
    return `Chapter ${index}: ${title}`;
  }

  // ========================================
  // Navigation
  // ========================================
  function goToPreviousChapter() {
    if (state.currentChapter > 0) {
      loadChapter(state.currentChapter - 1);
    }
  }

  function goToNextChapter() {
    if (state.currentChapter < state.totalChapters - 1) {
      loadChapter(state.currentChapter + 1);
    }
  }

  function updateNavigationButtons() {
    elements.prevButton.disabled = state.currentChapter === 0;
    elements.nextButton.disabled = state.currentChapter === state.totalChapters - 1;
  }

  function handleKeyboard(e) {
    // Only handle if reader is visible
    if (elements.reader.classList.contains('hidden')) return;

    switch (e.key) {
      case 'ArrowLeft':
        goToPreviousChapter();
        break;
      case 'ArrowRight':
        goToNextChapter();
        break;
      case 'd':
        if (!e.ctrlKey && !e.metaKey) {
          toggleTheme();
        }
        break;
    }
  }

  // ========================================
  // Progress Tracking
  // ========================================
  function updateScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    // Calculate overall progress
    const chapterProgress = docHeight > 0 ? scrollTop / docHeight : 0;
    const chapterWeight = 1 / state.totalChapters;
    const overallProgress = (state.currentChapter * chapterWeight) + (chapterProgress * chapterWeight);

    // Update progress bar with smooth animation
    elements.progressBar.style.width = `${Math.min(overallProgress * 100, 100)}%`;
  }

  function saveReadingPosition() {
    localStorage.setItem('dtv-chapter', state.currentChapter.toString());
  }

  // ========================================
  // Start
  // ========================================
  init();

  // Expose goToNextChapter globally for the next chapter button
  window.goToNextChapter = goToNextChapter;

})();
