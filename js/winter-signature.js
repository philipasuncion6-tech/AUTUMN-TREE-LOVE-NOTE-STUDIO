(() => {
  "use strict";

  // Independent visual signature: it appears below the video status
  // without reading or changing the video generator's state.
  const revealSignature = () => {
    const signature = document.getElementById("winterAuthorSignature");
    if (!signature) return;
    signature.classList.add("is-visible");
    signature.setAttribute("aria-hidden", "false");
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", revealSignature, { once: true });
  } else {
    revealSignature();
  }
})();
