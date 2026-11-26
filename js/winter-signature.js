(() => {
  "use strict";

  // This enhancement observes the existing completion status only.
  // It does not change the MP4 renderer or any other theme.
  const status = document.getElementById("videoStatus");
  const signature = document.getElementById("winterAuthorSignature");
  if (!status || !signature) return;

  const revealForWinterSuccess = () => {
    const message = status.textContent || "";
    const isWinterReady =
      message.includes("Winter & Snow Bear") &&
      message.includes("MP4 is ready");

    if (isWinterReady && !signature.classList.contains("is-visible")) {
      signature.classList.add("is-visible");
      signature.setAttribute("aria-hidden", "false");
    } else if (!isWinterReady && signature.classList.contains("is-visible")) {
      signature.classList.remove("is-visible");
      signature.setAttribute("aria-hidden", "true");
    }
  };

  new MutationObserver(revealForWinterSuccess).observe(status, {
    childList: true,
    characterData: true,
    subtree: true
  });
  revealForWinterSuccess();
})();
