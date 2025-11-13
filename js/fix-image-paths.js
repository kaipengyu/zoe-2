/**
 * Fix Image Paths for Local Development
 * 
 * This script converts Drupal theme paths to local static paths
 * so images display correctly when viewing HTML files locally.
 * 
 * It replaces: /themes/custom/icfbarrio/zoe/image/
 * With: /image/
 * 
 * Also fixes CSS and JavaScript file paths based on which company page is being viewed.
 */

(function() {
  'use strict';

  /**
   * Detect which company page this is based on logo images or URL
   * @returns {string} CSS filename suffix (ACE, PEPCO, or DPL)
   */
  function detectCompany() {
    // First, check URL pathname (most reliable, works immediately)
    const pathname = window.location.pathname.toLowerCase();
    const href = window.location.href.toLowerCase();
    
    if (pathname.includes('ace') || pathname.includes('atlantic') || href.includes('ace')) {
      return 'ACE';
    } else if (pathname.includes('pepco') || href.includes('pepco')) {
      return 'PEPCO';
    } else if (pathname.includes('delmarva') || pathname.includes('dpl') || href.includes('delmarva') || href.includes('dpl')) {
      return 'DPL';
    }
    
    // Fallback: check HTML content for company names
    if (document.body) {
      const bodyText = document.body.innerText.toLowerCase();
      if (bodyText.includes('atlantic city electric') || bodyText.includes('ace')) {
        return 'ACE';
      } else if (bodyText.includes('pepco') && !bodyText.includes('delmarva')) {
        return 'PEPCO';
      } else if (bodyText.includes('delmarva') || bodyText.includes('dpl')) {
        return 'DPL';
      }
    }
    
    // Last resort: check image src attributes
    const images = document.querySelectorAll('img[src]');
    for (let i = 0; i < images.length; i++) {
      const src = images[i].getAttribute('src') || '';
      if (src.includes('ace-logo.svg') || src.includes('ace-logo')) {
        return 'ACE';
      } else if (src.includes('pepco_logo.png') || src.includes('pepco_logo')) {
        return 'PEPCO';
      } else if (src.includes('dpl_logo.svg') || src.includes('dpl_logo')) {
        return 'DPL';
      }
    }
    
    return null;
  }

  /**
   * Get base path for relative URLs
   * Handles both root-level and subdirectory deployments
   */
  function getBasePath() {
    const pathname = window.location.pathname;
    // Remove filename and get directory depth
    const pathParts = pathname.split('/').filter(function(part) {
      return part && !part.includes('.html') && !part.includes('.htm');
    });
    
    // If we're in a subdirectory, calculate relative path to root
    // For /2025/zoe-twig/file.html, we need ../../ to reach root
    if (pathParts.length > 0) {
      return '../'.repeat(pathParts.length);
    }
    
    // Root level - use absolute path
    return '/';
  }

  /**
   * Inject CSS link dynamically based on detected company
   */
  function fixCSSPaths() {
    const head = document.head || document.getElementsByTagName('head')[0];
    if (!head) {
      return; // No head element available yet
    }
    
    // Check if any company-specific CSS already exists
    const existingCompanyCSS = document.querySelector('link[href*="style-"]');
    if (existingCompanyCSS) {
      return; // Already has company CSS
    }
    
    const company = detectCompany();
    let cssFile;
    const basePath = getBasePath();
    
    if (company) {
      // Try absolute path first, fallback to relative
      cssFile = basePath === '/' ? `/css/style-${company}.css` : `${basePath}css/style-${company}.css`;
    } else {
      // Fallback: try to determine from URL or use default
      const pathname = window.location.pathname.toLowerCase();
      if (pathname.includes('ace') || pathname.includes('atlantic')) {
        cssFile = basePath === '/' ? '/css/style-ACE.css' : `${basePath}css/style-ACE.css`;
      } else if (pathname.includes('pepco')) {
        cssFile = basePath === '/' ? '/css/style-PEPCO.css' : `${basePath}css/style-PEPCO.css`;
      } else if (pathname.includes('delmarva') || pathname.includes('dpl')) {
        cssFile = basePath === '/' ? '/css/style-DPL.css' : `${basePath}css/style-DPL.css`;
      } else {
        // Last resort: try ACE as default
        cssFile = basePath === '/' ? '/css/style-ACE.css' : `${basePath}css/style-ACE.css`;
      }
    }
    
    // Check if this specific CSS link already exists
    const existingLink = document.querySelector(`link[href="${cssFile}"]`) || 
                        document.querySelector(`link[href*="style-${company || 'ACE'}.css"]`);
    if (existingLink) {
      return; // Already exists, no need to add again
    }

    // Create and inject the CSS link
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssFile;
    link.type = 'text/css';
    link.setAttribute('data-injected', 'true');
    
    // Insert early in head for faster loading
    const firstStylesheet = head.querySelector('link[rel="stylesheet"]');
    if (firstStylesheet) {
      head.insertBefore(link, firstStylesheet);
    } else {
      head.appendChild(link);
    }
  }

  /**
   * Fix JavaScript file paths in the document
   * This runs synchronously to fix paths before browser loads scripts
   */
  function fixJSPaths() {
    // Get all scripts - use getElementsByTagName for faster synchronous access
    const scripts = document.getElementsByTagName('script');
    
    for (let i = 0; i < scripts.length; i++) {
      const script = scripts[i];
      const src = script.getAttribute('src');
      
      if (src) {
        let newSrc = src;
        
        // Fix Drupal theme paths first
        if (src.includes('/themes/custom/icfbarrio/zoe/js/')) {
          newSrc = src.replace('/themes/custom/icfbarrio/zoe/js/', '/js/');
        }
        
        // Convert absolute paths to relative for S3 subdirectory deployments
        newSrc = convertAbsoluteToRelative(newSrc);
        
        // Only fix if not already fixed to avoid infinite loops
        if (!script.hasAttribute('data-path-fixed') && newSrc !== src) {
          script.setAttribute('src', newSrc);
          script.setAttribute('data-path-fixed', 'true');
          
          // Force update if script already attempted to load
          if (script.src && script.src !== newSrc) {
            script.src = newSrc;
          }
        }
      }
    }
  }

  /**
   * Convert absolute paths to relative paths for S3 subdirectory deployments
   */
  function convertAbsoluteToRelative(absolutePath) {
    if (!absolutePath || !absolutePath.startsWith('/')) {
      return absolutePath; // Already relative or external URL
    }
    
    const basePath = getBasePath();
    if (basePath === '/') {
      return absolutePath; // Root level, keep absolute
    }
    
    // Convert /image/file.webp to ../../image/file.webp
    return basePath + absolutePath.substring(1);
  }

  /**
   * Fix image paths in the document
   */
  function fixImagePaths() {
    // Fix all img src attributes
    const images = document.querySelectorAll('img[src]');
    images.forEach(function(img) {
      const src = img.getAttribute('src');
      if (src) {
        let newSrc = src;
        
        // Fix Drupal theme paths first
        if (src.includes('/themes/custom/icfbarrio/zoe/image/')) {
          newSrc = src.replace('/themes/custom/icfbarrio/zoe/image/', '/image/');
        }
        
        // Convert absolute paths to relative for S3
        newSrc = convertAbsoluteToRelative(newSrc);
        
        if (newSrc !== src) {
          img.setAttribute('src', newSrc);
        }
      }
    });

    // Fix any background-image styles in inline styles
    const elementsWithBg = document.querySelectorAll('[style*="background-image"]');
    elementsWithBg.forEach(function(el) {
      const style = el.getAttribute('style');
      if (style && style.includes('/themes/custom/icfbarrio/zoe/image/')) {
        const newStyle = style.replace(/\/themes\/custom\/icfbarrio\/zoe\/image\//g, '/image/');
        el.setAttribute('style', newStyle);
      }
    });

    // Fix any CSS background-image in computed styles (if needed)
    // This handles dynamically set background images
    const allElements = document.querySelectorAll('*');
    allElements.forEach(function(el) {
      const computedStyle = window.getComputedStyle(el);
      const bgImage = computedStyle.backgroundImage;
      if (bgImage && bgImage.includes('/themes/custom/icfbarrio/zoe/image/')) {
        const newBgImage = bgImage.replace(/\/themes\/custom\/icfbarrio\/zoe\/image\//g, '/image/');
        el.style.backgroundImage = newBgImage;
      }
    });
  }

  /**
   * Main function to fix images, CSS, and JavaScript
   * Note: CSS fix runs first to detect company from original image paths
   */
  function fixPaths() {
    // Fix CSS first (detects company from original image paths)
    fixCSSPaths();
    // Then fix image paths
    fixImagePaths();
    // Fix JavaScript paths
    fixJSPaths();
  }

  /**
   * Try to fix images and scripts immediately if possible
   * This ensures logo images and scripts are fixed before they start loading
   */
  function fixAssetsEarly() {
    // Try to fix images and scripts that are already in the DOM
    if (document.body || document.head) {
      fixImagePaths();
      fixJSPaths();
    }
  }

  /**
   * Try to inject CSS immediately if head is available
   * This ensures CSS loads as early as possible
   */
  function injectCSSEarly() {
    if (document.head) {
      fixCSSPaths();
    }
  }

  /**
   * Ensure script.js loads correctly - inject if needed
   */
  function ensureScriptJS() {
    // Check if there's a script.js tag that needs fixing
    const scriptTags = document.querySelectorAll('script[src]');
    let scriptJSFound = false;
    let needsInjection = false;
    
    scriptTags.forEach(function(script) {
      const src = script.getAttribute('src') || script.src || '';
      if (src.includes('script.js')) {
        scriptJSFound = true;
        
        // If it has the wrong path, fix it
        if (src.includes('/themes/custom/icfbarrio/zoe/js/')) {
          const newSrc = src.replace('/themes/custom/icfbarrio/zoe/js/', '/js/');
          script.setAttribute('src', newSrc);
          script.src = newSrc;
          
          // If script failed to load, mark for injection
          script.addEventListener('error', function() {
            needsInjection = true;
          });
        }
      }
    });
    
    // If no script.js found or it failed to load, inject it
    if (!scriptJSFound || needsInjection) {
      // Check if we already injected it
      const basePath = getBasePath();
      const scriptPath = basePath === '/' ? '/js/script.js' : basePath + 'js/script.js';
      const existingInjected = document.querySelector('script[src="' + scriptPath + '"][data-injected="true"]') ||
                               document.querySelector('script[src*="script.js"][data-injected="true"]');
      if (!existingInjected) {
        const script = document.createElement('script');
        script.src = scriptPath;
        script.type = 'text/javascript';
        script.setAttribute('data-injected', 'true');
        // Insert before closing body tag or append to body
        const body = document.body || document.getElementsByTagName('body')[0];
        if (body) {
          body.appendChild(script);
        } else {
          // If body doesn't exist yet, wait a bit
          setTimeout(function() {
            const body = document.body || document.getElementsByTagName('body')[0];
            if (body) body.appendChild(script);
          }, 100);
        }
      }
    }
  }

  // CRITICAL: Fix JavaScript paths FIRST and SYNCHRONOUSLY
  // This must run before browser continues parsing and loading scripts
  fixJSPaths();
  
  // Ensure script.js is available
  ensureScriptJS();
  
  // Try to fix images, scripts, and inject CSS immediately (runs as soon as script loads)
  fixAssetsEarly();
  injectCSSEarly();

  /**
   * Run immediately if DOM is already loaded, otherwise wait for it
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixPaths);
  } else {
    // DOM is already loaded, run immediately
    fixPaths();
  }

  // Also run after short delays to catch any dynamically loaded images
  setTimeout(fixPaths, 50);
  setTimeout(fixPaths, 100);
  setTimeout(fixPaths, 500);
  
  // Ensure script.js loads after a delay (in case it failed initially)
  setTimeout(ensureScriptJS, 100);
  setTimeout(ensureScriptJS, 500);
  
  // Run once more after page fully loads to catch any late-loading images
  window.addEventListener('load', function() {
    fixPaths();
    ensureScriptJS();
  });
})();

