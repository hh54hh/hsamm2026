// Emergency Recovery Script for 0 FPS Issues
// Users can run this from browser console if the app is frozen

console.log("🚨 Emergency Recovery Script Loaded");

// Enhanced emergency recovery function
window.emergencyRecovery = function () {
  console.log("🔧 Starting emergency recovery...");

  try {
    // 1. Clear problematic intervals
    for (let i = 1; i < 1000; i++) {
      try {
        clearInterval(i);
        clearTimeout(i);
      } catch (e) {}
    }

    // 2. Force garbage collection
    if (window.gc) {
      window.gc();
    }

    // 3. Remove heavy elements
    document.querySelectorAll("iframe, embed, object, video").forEach((el) => {
      el.style.display = "none";
    });

    // 4. Disable animations temporarily
    const style = document.createElement("style");
    style.innerHTML = `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
      }
    `;
    document.head.appendChild(style);

    // 5. Remove problematic third-party scripts
    ["amplitude", "FS", "_fs_debug", "gtag", "fbq", "_hsq", "hstc"].forEach(
      (lib) => {
        if (window[lib]) {
          window[lib] = () => {};
        }
      },
    );

    console.log("✅ Emergency recovery applied");

    // Restore after 10 seconds
    setTimeout(() => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
      document
        .querySelectorAll("iframe, embed, object, video")
        .forEach((el) => {
          el.style.display = "";
        });
      console.log("✅ Normal operation restored");
    }, 10000);
  } catch (error) {
    console.error("❌ Emergency recovery failed:", error);
  }
};

// Function to reload the page as last resort
window.emergencyReload = function () {
  console.log("🔄 Emergency page reload...");
  window.location.reload();
};

// Immediate freeze fix for unresponsive website
window.fixFreeze = function () {
  console.log("🧊 Fixing website freeze...");

  try {
    // 1. Stop all intervals and timeouts immediately
    for (let i = 1; i < 2000; i++) {
      try {
        clearInterval(i);
        clearTimeout(i);
      } catch (e) {}
    }

    // 2. Remove all event listeners that might be causing issues
    document.querySelectorAll("*").forEach((el) => {
      el.onclick = null;
      el.onmousedown = null;
      el.onmouseup = null;
    });

    // 3. Force immediate garbage collection
    if (window.gc) {
      for (let i = 0; i < 5; i++) {
        window.gc();
      }
    }

    // 4. Remove problematic elements
    document.querySelectorAll("iframe, embed, object").forEach((el) => {
      el.remove();
    });

    // 5. Disable all animations
    const style = document.createElement("style");
    style.innerHTML = `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
      }
    `;
    document.head.appendChild(style);

    console.log("✅ Freeze fix applied - website should be responsive now");

    // Auto-reload after 5 seconds
    setTimeout(() => {
      console.log("🔄 Auto-reloading page for complete recovery...");
      window.location.reload();
    }, 5000);
  } catch (error) {
    console.error("❌ Freeze fix failed:", error);
    // Force reload as last resort
    window.location.reload();
  }
};

// Function to disable all MobX warnings
window.disableMobXWarnings = function () {
  console.log("🔇 Disabling MobX warnings...");

  // Override console methods temporarily
  const originalWarn = console.warn;
  const originalError = console.error;

  console.warn = function (...args) {
    const message = args.join(" ");
    if (
      message.includes("mobx") ||
      message.includes("MobX") ||
      message.includes("array index")
    ) {
      return; // Suppress MobX warnings
    }
    originalWarn.apply(console, args);
  };

  console.error = function (...args) {
    const message = args.join(" ");
    if (
      message.includes("mobx") ||
      message.includes("MobX") ||
      message.includes("array index")
    ) {
      return; // Suppress MobX errors
    }
    originalError.apply(console, args);
  };

  console.log("✅ MobX warnings disabled");
};

// Auto-detect and fix 0 FPS
let zeroFPSDetected = 0;
let lastFrameTime = performance.now();

function detectZeroFPS() {
  const currentTime = performance.now();
  const deltaTime = currentTime - lastFrameTime;

  if (deltaTime > 5000) {
    // No frame for 5 seconds
    zeroFPSDetected++;
    console.warn(`⚠️ Potential 0 FPS detected (${zeroFPSDetected})`);

    if (zeroFPSDetected >= 2) {
      console.error("🚨 Critical: Auto-triggering emergency recovery");
      window.emergencyRecovery();
      zeroFPSDetected = 0; // Reset
    }
  }

  lastFrameTime = currentTime;
  requestAnimationFrame(detectZeroFPS);
}

// Start auto-detection
requestAnimationFrame(detectZeroFPS);

// Display help
console.log(`
🆘 EMERGENCY COMMANDS AVAILABLE:
• fixFreeze() - Fix unresponsive website (IMMEDIATE)
• emergencyRecovery() - Fix 0 FPS issues
• emergencyReload() - Reload page
• disableMobXWarnings() - Stop MobX spam
• recoverFromZeroFPS() - Use fixed optimizer (if available)

🚨 IF WEBSITE IS FROZEN: Type fixFreeze() and press Enter
To use: Type the command in console and press Enter
`);
