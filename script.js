document.addEventListener("DOMContentLoaded", () => {

  /* ---- Mobile menu toggle ---- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    // Close the menu when the window is resized to desktop width
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900 && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      }
    });
  }

  /* ---- Image placeholders ----
     Shows the gray "Image" box until a real image file loads.
     Drop your photos into /images with the filenames used in index.html. */
  document.querySelectorAll(".img-slot img").forEach((img) => {
    const slot = img.closest(".img-slot");
    const onLoad = () => slot.classList.add("has-image");
    const onError = () => img.remove();

    if (img.complete) {
      img.naturalWidth > 0 ? onLoad() : onError();
    } else {
      img.addEventListener("load", onLoad);
      img.addEventListener("error", onError);
    }
  });

});


/* ---- Contact form ---- */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = form.querySelector(".form-status");
  const button = form.querySelector(".submit-btn");

  const say = (text, isError = false) => {
    status.textContent = text;
    status.classList.toggle("is-error", isError);
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    say("");

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const endpoint = form.dataset.endpoint;

    // No form service set up yet: open the visitor's email app instead
    if (!endpoint) {
      const name = `${data.get("first-name")} ${data.get("last-name")}`;
      const body = `${data.get("message")}\n\n${name}\n${data.get("email")}`;
      window.location.href =
        `mailto:${form.dataset.mailto}` +
        `?subject=${encodeURIComponent("Website enquiry from " + name)}` +
        `&body=${encodeURIComponent(body)}`;
      return;
    }

    button.disabled = true;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(response.statusText);
      form.reset();
      say("Message sent. We’ll get back to you soon.");
    } catch (err) {
      say("Your message wasn’t sent. Please try again or email us directly.", true);
    } finally {
      button.disabled = false;
    }
  });
});


/* ---- Gallery lightbox (gallery.html) ---- */
document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return; // not on this page

  const lightboxImage = document.getElementById("lightbox-image");
  const closeBtn = document.getElementById("lightbox-close");
  const tiles = Array.from(document.querySelectorAll(".full-gallery-grid .tile"));
  let lastFocused = null;

  const open = (tile) => {
    const img = tile.querySelector("img");
    // Nothing to enlarge if the real photo hasn't loaded yet (still a placeholder)
    if (!tile.classList.contains("has-image") || !img) return;

    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lastFocused = tile;
    closeBtn.focus();
  };

  const close = () => {
    lightbox.hidden = true;
    lightboxImage.src = "";
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  };

  tiles.forEach((tile) => {
    tile.addEventListener("click", () => open(tile));
  });

  closeBtn.addEventListener("click", close);

  // Click outside the photo (on the dark backdrop) closes it too
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) close();
  });
});
