// use a script tag or an external JS file
document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  // gsap code here!

  // GSAP orbit animation for bubbles in the first tab (oscillate, not full circle)
  gsap.to('.orbit-1', {
    rotate: 30,
    duration: 2,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
    transformOrigin: '50% 50%'
  });
  gsap.to('.orbit-2', {
    rotate: -30,
    duration: 2.5,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
    transformOrigin: '50% 50%'
  });
  gsap.to('.orbit-3', {
    rotate: 20,
    duration: 3,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
    transformOrigin: '50% 50%'
  });
});

gsap.from("header .container", { duration: 1, y: -50, opacity: 0, ease: "power2.out" });

// Initialize GSAP ScrollSmoother for smooth scrolling using wrapper and content selectors
if (window.ScrollSmoother) {
  ScrollSmoother.create({
    wrapper: '.smooth-wrapper',
    content: '.smooth-content',
    smooth: 1.2,
    effects: true
  });
}

document.addEventListener('DOMContentLoaded', function () {
  // Listen for clicks on any tab-arrow button
  document.querySelectorAll('.tab-arrow').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const targetSelector = btn.getAttribute('data-bs-target');
      if (targetSelector) {
        const tabTrigger = document.querySelector(`[data-bs-toggle="tab"][data-bs-target="${targetSelector}"]`);
        if (tabTrigger) {
          var tab = new bootstrap.Tab(tabTrigger);
          tab.show();
        }
      }
    });
  });

  // GSAP tab animation for tabbed-section (direction-aware)
  const tabContent = document.getElementById('sectionTabsContent');
  let isAnimating = false;
  let currentTabIndex = 0;

  // Helper: get tab index from trigger
  function getTabIndex(tabTrigger) {
    const tabs = Array.from(document.querySelectorAll('#sectionTabs .nav-link'));
    return tabs.findIndex(tab => tab === tabTrigger);
  }

  function animateTabSwitch(nextTabTrigger) {
    if (isAnimating) return;
    isAnimating = true;

    const tabs = Array.from(document.querySelectorAll('#sectionTabs .nav-link'));
    const nextTabIndex = getTabIndex(nextTabTrigger);
    const direction = nextTabIndex > currentTabIndex ? 1 : -1;

    const currentPane = tabContent.querySelector('.tab-pane.active');
    const nextPane = document.querySelector(nextTabTrigger.getAttribute('data-bs-target'));

    gsap.to(currentPane, {
      x: -100 * direction,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        var tab = new bootstrap.Tab(nextTabTrigger);
        tab.show();
        setTimeout(() => {
          gsap.fromTo(nextPane, { x: 100 * direction, opacity: 0 }, {
            x: 0,
            opacity: 1,
            duration: 0.3,
            onComplete: () => {
              isAnimating = false;
              currentTabIndex = nextTabIndex;
            }
          });
        }, 10);
      }
    });
  }

  // Intercept tab and arrow clicks for GSAP animation
  document.querySelectorAll('#sectionTabs .nav-link, .tab-arrow').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      const targetSelector = btn.getAttribute('data-bs-target');
      if (targetSelector) {
        e.preventDefault();
        const nextTabTrigger = document.querySelector(`[data-bs-toggle="tab"][data-bs-target="${targetSelector}"]`);
        if (nextTabTrigger) {
          animateTabSwitch(nextTabTrigger);
        }
      }
    });
  });

  // --- Custom Dropdown for Mobile Tabs ---
  var dropdownBtn = document.querySelector('.custom-dropdown-selected');
  var dropdownMenu = document.querySelector('.custom-dropdown-list');
  if (dropdownBtn && dropdownMenu) {
    var btnTextSpan = dropdownBtn.querySelector('.dropdown-btn-text');
    dropdownMenu.querySelectorAll('.dropdown-item').forEach(function(item) {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        // Update button text
        if (btnTextSpan) btnTextSpan.textContent = this.textContent;
        // Update active class
        dropdownMenu.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        // Switch tab
        var tabId = this.getAttribute('data-tab');
        var tabTrigger = document.querySelector('[data-bs-target="#' + tabId + '"]');
        if (tabTrigger) {
          var tab = new bootstrap.Tab(tabTrigger);
          tab.show();
        }
      });
    });
    // Keep dropdown in sync with tab changes (arrows, etc)
    var tabButtons = document.querySelectorAll('#sectionTabs button[data-bs-toggle="tab"]');
    tabButtons.forEach(function (btn) {
      btn.addEventListener('shown.bs.tab', function (e) {
        var tabId = e.target.getAttribute('data-bs-target').replace('#', '');
        var activeItem = dropdownMenu.querySelector('.dropdown-item[data-tab="' + tabId + '"]');
        if (activeItem && btnTextSpan) {
          btnTextSpan.textContent = activeItem.textContent;
          dropdownMenu.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
          activeItem.classList.add('active');
        }
      });
    });
  }
  // END Custom Dropdown for Mobile Tabs

  // Accordion plus/minus icon toggle using Font Awesome
  document.querySelectorAll('.accordion-button').forEach(function(btn) {
    // Remove any existing icon
    let iconSpan = btn.querySelector('.accordion-icon');
    if (iconSpan) iconSpan.remove();
    // Add icon span
    let span = document.createElement('span');
    span.className = 'accordion-icon';
    // Set icon based on collapsed state
    if (btn.classList.contains('collapsed')) {
      span.innerHTML = '<i class="fa-solid fa-plus"></i>';
    } else {
      span.innerHTML = '<i class="fa-solid fa-minus"></i>';
    }
    btn.appendChild(span);
  });

  // Listen for accordion show/hide events to toggle icon
  document.querySelectorAll('.accordion').forEach(function(acc) {
    acc.addEventListener('show.bs.collapse', function(e) {
      let btn = e.target.previousElementSibling.querySelector('.accordion-button');
      if (btn) {
        let icon = btn.querySelector('.accordion-icon i');
        if (icon) icon.className = 'fa-solid fa-minus';
      }
    });
    acc.addEventListener('hide.bs.collapse', function(e) {
      let btn = e.target.previousElementSibling.querySelector('.accordion-button');
      if (btn) {
        let icon = btn.querySelector('.accordion-icon i');
        if (icon) icon.className = 'fa-solid fa-plus';
      }
    });
  });

  // --- Dot indicator sync for mobile tab navigation ---
  const tabIds = ['tab0', 'tab1', 'tab2', 'tab3', 'tab4'];
  // For each tab-image-wrapper, sync the dots
  document.querySelectorAll('.tab-image-wrapper').forEach(function(wrapper, tabIdx) {
    const dotContainer = wrapper.querySelector('.tab-dot-indicators');
    if (!dotContainer) return;
    const dots = dotContainer.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', function(e) {
        e.preventDefault();
        // Show the corresponding tab
        const tabTrigger = document.querySelector(`[data-bs-toggle="tab"][data-bs-target="#${tabIds[idx]}"]`);
        if (tabTrigger) {
          var tab = new bootstrap.Tab(tabTrigger);
          tab.show();
        }
      });
    });
  });
  // When a tab is shown, update all dot indicators
  document.querySelectorAll('#sectionTabs button[data-bs-toggle="tab"]').forEach(function(tabBtn, idx) {
    tabBtn.addEventListener('shown.bs.tab', function(e) {
      const activeTabId = e.target.getAttribute('data-bs-target');
      document.querySelectorAll('.tab-dot-indicators').forEach(function(dotContainer) {
        const dots = dotContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', `#${tabIds[i]}` === activeTabId);
        });
      });
    });
  });

  // --- Dropdown arrow icon swap on open/close ---
  var dropdownBtnEl = document.getElementById('roomDropdown');
  if (dropdownBtnEl) {
    dropdownBtnEl.addEventListener('show.bs.dropdown', function () {
      var icon = dropdownBtnEl.querySelector('.tab-dropdown-arrow i');
      if (icon) {
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
      }
    });
    dropdownBtnEl.addEventListener('hide.bs.dropdown', function () {
      var icon = dropdownBtnEl.querySelector('.tab-dropdown-arrow i');
      if (icon) {
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
      }
    });
  }
});

// Debounced resize handler to refresh ScrollSmoother and ScrollTrigger
(function() {
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      if (window.ScrollSmoother && ScrollSmoother.get()) {
        ScrollSmoother.get().refresh();
      }
      if (window.ScrollTrigger) {
        ScrollTrigger.refresh();
      }
    }, 150); // 150ms debounce
  });
})();

// === HERO SECTION ANIMATION (GSAP) ===
let lastHeroMode = null; // Track last mode: 'desktop' or 'mobile'
let heroTimeline = null; // Store timeline to kill on mode change
let heroAnimPaused = false; // Track pause state
let heroAnimCompleted = false; // Track if animation completed

function animateHeroSection() {
  // Elements
  const leftImage = document.getElementById('heroLeftImage');
  const leftDialogue = document.getElementById('heroLeftDialogue');
  const zoeImage = document.getElementById('heroZoeImage');
  const zoeDialogue = document.getElementById('heroZoeDialogue');
  const heroRow = document.querySelector('.hero-bottom-row');
  const animControlBtn = document.getElementById('heroAnimControlBtn');

  // Detect mode
  const desktop = window.matchMedia('(min-width: 1025px)').matches;
  const mode = desktop ? 'desktop' : 'mobile';
  if (lastHeroMode === mode) return; // Only animate if mode changes
  lastHeroMode = mode;

  // Kill previous timeline if exists
  if (heroTimeline) heroTimeline.kill();

  // Reset all
  gsap.set([leftImage, leftDialogue, zoeImage, zoeDialogue], {clearProps: 'all'});

  // Reset control state
  heroAnimPaused = false;
  heroAnimCompleted = false;
  if (animControlBtn) {
    animControlBtn.textContent = 'Pause Animation';
    animControlBtn.disabled = false;
    animControlBtn.style.display = desktop ? 'none' : 'inline-block';
  }

  if (desktop) {
    // Desktop animation
    if (zoeDialogue) zoeDialogue.src = 'image/zoe-dialogue.svg';
    gsap.set([leftImage, leftDialogue, zoeImage, zoeDialogue], {autoAlpha: 0});
    gsap.set(leftImage, {xPercent: -50, left: '50%', right: 'auto', position: 'absolute', zIndex: 2});
    gsap.set(leftDialogue, {xPercent: -50, left: '70%', right: 'auto', position: 'absolute', zIndex: 3});
    gsap.set(zoeImage, {right: 0, left: 'auto', position: 'absolute', zIndex: 2});
    gsap.set(zoeDialogue, {right: '25%', left: 'auto', position: 'absolute', zIndex: 3});

    heroTimeline = gsap.timeline();
    heroTimeline.to(leftImage, {autoAlpha: 1, duration: 1, ease: 'power2.out'})
      .to(leftDialogue, {autoAlpha: 1, duration: 1, ease: 'power2.out'}, '+=0.2')
      .to(leftImage, {
        xPercent: 0,
        left: 0,
        duration: 1,
        ease: 'power2.inOut',
        stagger: 0.05
      })
      .to(leftDialogue, {
        xPercent: 0,
        left: '30%',
        duration: 1,
        ease: 'power2.inOut',
        stagger: 0.05
      }, '<')
      .to(zoeImage, {autoAlpha: 1, x: 60, duration: 1, ease: 'power2.out'}, '+=0.3')
      .to(zoeImage, {x: 0, duration: 0.6, ease: 'power2.inOut'}, '-=0.2')
      .to(zoeDialogue, {autoAlpha: 1, duration: 0.6, ease: 'power2.out'}, '-=0.2');
  } else {


    // Mobile animation
    if (zoeDialogue) zoeDialogue.src = 'image/zoe-dialogue-mobile.svg';
    gsap.set([leftImage, leftDialogue, zoeImage, zoeDialogue], {autoAlpha: 0});
    gsap.set(leftImage, {xPercent: -50, left: '50%', right: 'auto', position: 'absolute', zIndex: 2});
    gsap.set(leftDialogue, {xPercent: -50, left: '70%', right: 'auto', position: 'absolute', zIndex: 3});
    gsap.set(zoeImage, {xPercent: 50, left: '50%', right: 'auto', position: 'absolute', zIndex: 2});
    gsap.set(zoeDialogue, {xPercent: 50, left: '10%', right: 'auto', position: 'absolute', zIndex: 3});

    heroTimeline = gsap.timeline({
      onComplete: function() {
        heroAnimCompleted = true;
        if (animControlBtn) {
          animControlBtn.textContent = 'Replay Animation';
          animControlBtn.disabled = false;
        }
      }
    });
    heroTimeline.to(leftImage, {autoAlpha: 1, duration: 0.6, ease: 'power2.out'})
      .to(leftDialogue, {autoAlpha: 1, duration: 0.5, ease: 'power2.out'}, '+=0.2')
      .to([leftImage, leftDialogue], {
        x: '-60vw',
        autoAlpha: 0,
        duration: 1,
        ease: 'power2.inOut',
        stagger: 0.05
      }, '+5')
      .to(zoeImage, {
        autoAlpha: 1,
        xPercent: -50,
        x: 0,
        duration: 1,
        left: '60%',
        ease: 'power2.out',
        stagger: 0.1
      }, '+=0.3')
       .to(zoeDialogue, {
        autoAlpha: 1,
        xPercent: 0,
        x: 0,
        duration: 1,
        left: '5%',
        ease: 'power2.out',
        stagger: 0.1
      }, '-=0.3');
  }

  // Button logic (mobile only)
  if (animControlBtn && !desktop) {
    animControlBtn.onclick = function() {
      if (heroAnimCompleted) {
        // Replay
        heroTimeline.restart();
        heroAnimCompleted = false;
        animControlBtn.textContent = 'Pause Animation';
      } else if (!heroAnimPaused) {
        // Pause
        heroTimeline.pause();
        heroAnimPaused = true;
        animControlBtn.textContent = 'Resume Animation';
      } else {
        // Resume
        heroTimeline.play();
        heroAnimPaused = false;
        animControlBtn.textContent = 'Pause Animation';
      }
    };
  }
}

// Run on load
animateHeroSection();
// Re-run on resize/orientation change
window.addEventListener('resize', () => {
  animateHeroSection();
});

// === LOTTIE GAUGE POINTER (SCROLL SCRUB, PAUSE ON STOP) ===
document.addEventListener('DOMContentLoaded', function() {
  var lottieContainer = document.getElementById('gauge-pointer-lottie');
  if (lottieContainer && window.lottie) {
    // Define animation data
    const gaugePointerData = {"nm":"Main Scene","ddd":0,"h":500,"w":500,"meta":{"g":"@lottiefiles/creator 1.46.0"},"layers":[{"ty":4,"nm":"Shape Layer 1","sr":1,"st":0,"op":150,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,"ks":{"a":{"a":0,"k":[226.052001953125,198.7285614013672]},"s":{"a":0,"k":[100,100]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[250.052001953125,321.2285614013672]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},"shapes":[{"ty":"gr","bm":0,"hd":false,"nm":"Group 1","it":[{"ty":"sh","bm":0,"hd":false,"nm":"Path 1","d":1,"ks":{"a":0,"k":{"c":true,"i":[[0,0],[0,0],[0.06900000000001683,0.16899999999998272],[0.12899999999999068,0.12899999999999068],[0.16800000000000637,0.0689999999999884],[0.18199999999998795,0],[0,0],[0.22399999999998954,0.1449999999999818],[0.11000000000001364,0.24399999999999977],[-0.04099999999999682,0.26400000000001],[-0.1780000000000257,0.19999999999998863],[0,0],[-0.27299999999999613,0.06699999999997885],[-0.26300000000000523,-0.09999999999999432],[-0.15899999999999181,-0.23099999999999454],[0,-0.2810000000000059],[0,0],[-0.0689999999999884,-0.16900000000001114],[-0.1290000000000191,-0.12899999999999068],[-0.16799999999997794,-0.0689999999999884],[-0.18199999999998795,0],[0,0],[-0.22400000000001796,-0.14500000000001023],[-0.11000000000001364,-0.24399999999999977],[0.04099999999999682,-0.26400000000001],[0.17799999999999727,-0.20000000000001705],[0,0],[0.27299999999999613,-0.06699999999997885],[0.26300000000000523,0.09999999999999432],[0.15899999999999181,0.23100000000002296],[0,0.2810000000000059]],"o":[[0,0],[0,-0.18199999999998795],[-0.06999999999999318,-0.16800000000000637],[-0.12800000000001432,-0.1279999999999859],[-0.16899999999998272,-0.0700000000000216],[0,0],[-0.2669999999999959,0],[-0.22499999999999432,-0.14500000000001023],[-0.10900000000000887,-0.24399999999999977],[0.03999999999999204,-0.2639999999999816],[0,0],[0.18700000000001182,-0.20999999999997954],[0.27300000000002456,-0.06700000000000728],[0.26200000000000045,0.09999999999999432],[0.1599999999999966,0.23199999999999932],[0,0],[0,0.18200000000001637],[0.0700000000000216,0.16800000000000637],[0.1279999999999859,0.1290000000000191],[0.16900000000001114,0.06999999999999318],[0,0],[0.2669999999999959,0],[0.22399999999998954,0.14599999999998658],[0.10899999999998045,0.24399999999999977],[-0.03999999999999204,0.2650000000000148],[0,0],[-0.18700000000001182,0.21100000000001273],[-0.27299999999999613,0.06800000000001205],[-0.26200000000000045,-0.09999999999999432],[-0.160000000000025,-0.23199999999999932],[0,0]],"v":[[218.811,223.436],[218.811,204.153],[218.706,203.622],[218.405,203.172],[217.956,202.872],[217.425,202.766],[207.509,202.766],[206.756,202.544],[206.244,201.948],[206.139,201.17],[206.473,200.459],[230.869,173.016],[231.575,172.591],[232.398,172.642],[233.046,173.15],[233.292,173.937],[233.292,193.219],[233.397,193.75],[233.698,194.2],[234.147,194.5],[234.678,194.606],[244.595,194.606],[245.348,194.828],[245.86,195.424],[245.965,196.202],[245.631,196.913],[221.234,224.357],[220.528,224.783],[219.704,224.733],[219.056,224.224],[218.811,223.436]]}}},{"ty":"fl","bm":0,"hd":false,"nm":"Fill","c":{"a":0,"k":[0,0.8941,0.6471]},"r":1,"o":{"a":0,"k":100}},{"ty":"tr","a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[0,0]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}}]}],"ind":1},{"ty":4,"nm":"Group 2","sr":1,"st":0,"op":150,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,"ks":{"a":{"a":0,"k":[219.69705963134766,182.53960418701172]},"s":{"a":0,"k":[100,100]},"sk":{"a":0,"k":0},"p":{"a":1,"k":[{"o":{"x":0.167,"y":0.167},"i":{"x":0.833,"y":0.833},"s":[270.1038,324.9461],"t":0},{"o":{"x":0.167,"y":0.167},"i":{"x":0.833,"y":0.833},"s":[267.4814,312.1634],"t":30},{"o":{"x":0.167,"y":0.167},"i":{"x":0.833,"y":0.833},"s":[251,301.4104],"t":79},{"s":[234.3162,309.0101],"t":120}]},"r":{"a":1,"k":[{"o":{"x":0.167,"y":0.167},"i":{"x":0.833,"y":0.833},"s":[127],"t":0},{"o":{"x":0.167,"y":0.167},"i":{"x":0.833,"y":0.833},"s":[86],"t":30},{"o":{"x":0.167,"y":0.167},"i":{"x":0.833,"y":0.833},"s":[22],"t":79},{"s":[-40],"t":120}]},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},"shapes":[{"ty":"gr","bm":0,"hd":false,"nm":"Group 2","it":[{"ty":"sh","bm":0,"hd":false,"nm":"Path 2","d":1,"ks":{"a":0,"k":{"c":true,"i":[[0,0],[0,0],[0,0],[0,0],[-12.537000000000006,-3.2660000000000196],[-6.978999999999985,-10.914999999999992],[2.2959999999999923,-12.75],[10.348000000000013,-7.794000000000011],[12.88900000000001,1.3129999999999882],[8.563999999999993,9.721000000000004],[-0.32099999999999795,12.950999999999993],[-9.034999999999997,9.283999999999992],[0,0]],"o":[[0,0],[0,0],[0,0],[11.418000000000006,-6.120999999999981],[12.537000000000006,3.266999999999996],[6.978000000000009,10.91500000000002],[-2.2959999999999923,12.75],[-10.347999999999985,7.7949999999999875],[-12.888000000000005,-1.3120000000000118],[-8.565000000000026,-9.719999999999999],[0.32099999999999795,-12.951999999999998],[0,0],[0,0]],"v":[[189.913,164.521],[161.221,113.302],[202.564,154.992],[202.477,155.057],[239.739,150.616],[270.096,172.677],[277.379,209.489],[257.71,241.447],[221.564,251.53],[188.193,234.368],[175.369,199.102],[189.923,164.513],[189.913,164.521]]}}},{"ty":"st","bm":0,"hd":false,"nm":"Stroke","lc":2,"lj":2,"ml":4,"o":{"a":0,"k":100},"w":{"a":0,"k":5},"c":{"a":0,"k":[0.0902,0.051,0.4039]}},{"ty":"tr","a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[0,0]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}}]}],"ind":2},{"ty":4,"nm":"Group 3","sr":1,"st":0,"op":150,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,"ks":{"a":{"a":0,"k":[56.02748346328735,147.3740463256836]},"s":{"a":0,"k":[100,100]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[80.02748346328735,269.8740463256836]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},"shapes":[{"ty":"gr","bm":0,"hd":false,"nm":"Group 3","it":[{"ty":"sh","bm":0,"hd":false,"nm":"Path 3","d":1,"ks":{"a":0,"k":{"c":true,"i":[[0,0],[0,0],[11.1892,-27.013000000000005],[-0.03848000000000029,-29.239000000000004],[0,0],[-8.349199999999996,20.156000000000006],[-15.447699999999998,15.406000000000006]],"o":[[0,0],[-20.702199999999998,20.647599999999997],[-11.18928,27.013000000000005],[0,0],[-0.028999999999996362,-21.817000000000007],[8.34920000000001,-20.155999999999977],[0,0]],"v":[[108.603,108.604],[68.652,68.649],[20.3431,140.845],[3.45197,226.055],[59.952,226.055],[72.5555,162.474],[108.603,108.604]]}}},{"ty":"st","bm":0,"hd":false,"nm":"Stroke","lc":2,"lj":2,"ml":4,"o":{"a":0,"k":100},"w":{"a":0,"k":5},"c":{"a":0,"k":[0.3922,0.0235,0.7569]}},{"ty":"fl","bm":0,"hd":false,"nm":"Fill","c":{"a":0,"k":[0.4314,0.0235,0.7569]},"r":1,"o":{"a":0,"k":5}},{"ty":"tr","a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[0,0]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}}]}],"ind":3},{"ty":4,"nm":"Group 4","sr":1,"st":0,"op":150,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,"ks":{"a":{"a":0,"k":[396.07249450683594,147.37704467773438]},"s":{"a":0,"k":[100,100]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[420.07249450683594,269.8770446777344]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},"shapes":[{"ty":"gr","bm":0,"hd":false,"nm":"Group 4","it":[{"ty":"sh","bm":0,"hd":false,"nm":"Path 4","d":1,"ks":{"a":0,"k":{"c":true,"i":[[0,0],[0,0],[11.189999999999998,27.011000000000024],[20.700999999999965,20.647099999999995],[0,0],[-8.34899999999999,-20.156000000000006],[0.027999999999963165,-21.817000000000007]],"o":[[0,0],[0.03699999999997772,-29.238],[-11.188999999999965,-27.011999999999986],[0,0],[15.44599999999997,15.406999999999996],[8.348000000000013,20.156000000000006],[0,0]],"v":[[392.146,226.055],[448.646,226.055],[431.753,140.849],[383.446,68.655],[343.499,108.604],[379.543,162.475],[392.146,226.055]]}}},{"ty":"st","bm":0,"hd":false,"nm":"Stroke","lc":2,"lj":2,"ml":4,"o":{"a":0,"k":100},"w":{"a":0,"k":5},"c":{"a":0,"k":[0.3922,0.0235,0.7569]}},{"ty":"fl","bm":0,"hd":false,"nm":"Fill","c":{"a":0,"k":[0.4314,0.0235,0.7569]},"r":1,"o":{"a":0,"k":35}},{"ty":"tr","a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[0,0]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}}]}],"ind":4},{"ty":4,"nm":"Group 5","sr":1,"st":0,"op":150,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,"ks":{"a":{"a":0,"k":[304.75250244140625,56.05055594444275]},"s":{"a":0,"k":[100,100]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[328.75250244140625,178.55055594444275]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},"shapes":[{"ty":"gr","bm":0,"hd":false,"nm":"Group 5","it":[{"ty":"sh","bm":0,"hd":false,"nm":"Path 5","d":1,"ks":{"a":0,"k":{"c":true,"i":[[0,0],[0,0],[27.012999999999977,11.1892],[29.238,-0.03808999999999996],[0,0],[-20.154999999999973,-8.349199999999996],[-15.406000000000006,-15.446399999999997]],"o":[[0,0],[-20.64699999999999,-20.701800000000006],[-27.012,-11.189259999999999],[0,0],[21.816000000000003,-0.02740000000000009],[20.156000000000006,8.349099999999993],[0,0]],"v":[[343.496,108.604],[383.454,68.653],[311.259,20.3447],[226.051,3.45301],[226.051,59.953],[289.628,72.5587],[343.496,108.604]]}}},{"ty":"st","bm":0,"hd":false,"nm":"Stroke","lc":2,"lj":2,"ml":4,"o":{"a":0,"k":100},"w":{"a":0,"k":5},"c":{"a":0,"k":[0.3922,0.0235,0.7569]}},{"ty":"fl","bm":0,"hd":false,"nm":"Fill","c":{"a":0,"k":[0.4314,0.0235,0.7569]},"r":1,"o":{"a":0,"k":25}},{"ty":"tr","a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[0,0]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}}]}],"ind":5},{"ty":4,"nm":"Group 6","sr":1,"st":0,"op":150,"ip":0,"hd":false,"ddd":0,"bm":0,"hasMask":false,"ao":0,"ks":{"a":{"a":0,"k":[147.35400009155273,56.02900171279907]},"s":{"a":0,"k":[100,100]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[171.35400009155273,178.52900171279907]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}},"shapes":[{"ty":"gr","bm":0,"hd":false,"nm":"Group 6","it":[{"ty":"sh","bm":0,"hd":false,"nm":"Path 6","d":1,"ks":{"a":0,"k":{"c":true,"i":[[0,0],[0,0],[27.012,-11.189119999999999],[20.6473,-20.700900000000004],[0,0],[-20.155,8.3493],[-21.816000000000003,-0.027000000000001023]],"o":[[0,0],[-29.238,-0.03703999999999974],[-27.012000000000015,11.1892],[0,0],[15.406000000000006,-15.446300000000008],[20.155,-8.3493],[0,0]],"v":[[226.054,59.953],[226.054,3.453],[140.848,20.3461],[68.654,68.653],[108.609,108.605],[162.477,72.5596],[226.054,59.953]]}}},{"ty":"st","bm":0,"hd":false,"nm":"Stroke","lc":2,"lj":2,"ml":4,"o":{"a":0,"k":100},"w":{"a":0,"k":5},"c":{"a":0,"k":[0.3922,0.0235,0.7569]}},{"ty":"fl","bm":0,"hd":false,"nm":"Fill","c":{"a":0,"k":[0.4314,0.0235,0.7569]},"r":1,"o":{"a":0,"k":15}},{"ty":"tr","a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"sk":{"a":0,"k":0},"p":{"a":0,"k":[0,0]},"r":{"a":0,"k":0},"sa":{"a":0,"k":0},"o":{"a":0,"k":100}}]}],"ind":6}],"v":"5.7.0","fr":30,"op":150,"ip":0,"assets":[]};

    var lottieAnim = lottie.loadAnimation({
      container: lottieContainer,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: gaugePointerData
    });

    lottieAnim.addEventListener('DOMLoaded', function() {
      var totalFrames = lottieAnim.totalFrames;
      var lastFrame = 0;
      var ticking = false;
      var scrollObj = {progress: 0};

      // GSAP scroll scrub: set frame based on scroll progress
      gsap.to(scrollObj, {
        progress: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.first-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          onUpdate: function(self) {
            // Only update frame if user is actively scrolling
            if (!ticking) {
              ticking = true;
              requestAnimationFrame(function() {
                var frame = Math.round(scrollObj.progress * (totalFrames - 1));
                lottieAnim.goToAndStop(frame, true);
                ticking = false;
              });
            }
          }
        }
      });
    });
  }
});


