(() => {
  // SOCIAL LINKS: paste your profile URLs here; icons appear only for filled-in entries.
  const SOCIAL = {
    facebook: "",
    instagram: "",
    x: "",
    youtube: ""
  };
  const socialIcons = { facebook: "bi-facebook", instagram: "bi-instagram", x: "bi-twitter-x", youtube: "bi-youtube" };

  const EMAIL = "globalhopeonline@gmail.com";
  const PAGES = [
    ["index.html", "Home"],
    ["projects.html", "Projects"],
    ["updates.html", "Updates"],
    ["faq.html", "FAQ"],
    ["contact.html", "Contact"]
  ];
  const current = location.pathname.split("/").pop() || "index.html";

  const build = (html) => {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
  };

  const skip = build(`<a class="skip-link" href="${location.pathname}${location.search}#main-content">Skip to main content</a>`);
  const navItems = PAGES.map(([href, label]) => `<li><a href="${href}"${href === current ? ' aria-current="page"' : ""}>${label}</a></li>`).join("");
  const header = build(`
    <header class="gh-header">
      <div class="gh-header-inner">
        <a class="gh-logo" href="index.html">Global<span>Hope</span></a>
        <ul class="gh-nav" id="gh-nav">${navItems}<li class="gh-nav-cta"><a class="gh-cta" href="projects.html">Give to a project</a></li></ul>
        <a class="gh-cta" href="projects.html">Give to a project <i class="bi bi-arrow-up-right" aria-hidden="true"></i></a>
        <button class="gh-toggle" type="button" aria-label="Toggle navigation" aria-controls="gh-nav" aria-expanded="false"><i class="bi bi-list" aria-hidden="true"></i></button>
      </div>
    </header>`);

  const follow = Object.entries(SOCIAL).filter(([, url]) => url)
    .map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener" aria-label="Follow GlobalHope on ${name}"><i class="bi ${socialIcons[name]}" aria-hidden="true"></i></a>`).join("");

  const footer = build(`
    <div class="gh-footer" role="contentinfo">
      <div class="gh-footer-inner">
        <div class="gh-footer-grid">
          <div>
            <div class="gh-footer-logo">Global<span>Hope</span></div>
            <p>A community-support platform connecting people with locally led initiatives around the world.</p>
            <p><a href="mailto:${EMAIL}">${EMAIL}</a> &middot; <a href="tel:+16815056975">+1 681 505 6975</a><br>9450 Southwest Gemini Drive, Beaverton, OR 97008, USA</p>
            ${follow ? `<div class="gh-follow">${follow}</div>` : ""}
          </div>
          <div>
            <h2>Explore</h2>
            <ul>
              <li><a href="projects.html">Our projects</a></li>
              <li><a href="updates.html">Updates</a></li>
              <li><a href="faq.html">FAQ</a></li>
              <li><a href="contact.html">Contact us</a></li>
              <li><a href="terms.html">Contribution terms</a></li>
              <li><a href="terms.html#refunds">Refund policy</a></li>
              <li><a href="privacy.html">Privacy</a></li>
            </ul>
          </div>
          <div>
            <h2>Project updates by email</h2>
            <form class="gh-newsletter" name="newsletter" method="POST" action="index.html" data-ajax novalidate>
              <input type="hidden" name="form-name" value="newsletter">
              <input type="text" name="bot-field" tabindex="-1" autocomplete="off" style="display:none" aria-hidden="true">
              <label class="visually-hidden" for="gh-newsletter-email">Email address</label>
              <input id="gh-newsletter-email" type="email" name="email" placeholder="you@example.com" autocomplete="email" required>
              <button type="submit">Subscribe</button>
            </form>
            <p class="gh-form-note">Occasional project updates only. Unsubscribe any time by emailing us. See our <a href="privacy.html">Privacy Policy</a>.</p>
            <p class="gh-form-status" role="status" aria-live="polite"></p>
          </div>
        </div>
        <div class="gh-footer-bottom"><span>&copy; 2026 GlobalHope Foundation. All rights reserved.</span><span>No card payment is processed on this website.</span></div>
      </div>
    </div>`);

  document.body.prepend(header);
  document.body.prepend(skip);
  document.body.appendChild(footer);

  const main = document.querySelector("main") || document.querySelector(".hero") || header.nextElementSibling;
  if (main && !document.getElementById("main-content")) {
    main.id = "main-content";
    main.setAttribute("tabindex", "-1");
  }

  const toggle = header.querySelector(".gh-toggle");
  toggle.addEventListener("click", () => {
    const open = header.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  header.querySelectorAll(".gh-nav a").forEach((link) => link.addEventListener("click", () => {
    header.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }));

  // AJAX submit for Netlify forms (newsletter, contact).
  document.querySelectorAll("form[data-ajax]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const status = form.parentElement.querySelector(".gh-form-status") || form.querySelector(".gh-form-status");
      if (!form.reportValidity()) return;
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      try {
        const response = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(new FormData(form)).toString()
        });
        if (!response.ok) throw new Error("Request failed");
        form.reset();
        status.textContent = form.dataset.success || "Thank you. You are subscribed.";
        status.className = status.className.replace(/ is-(ok|error)/g, "") + " is-ok";
      } catch {
        const fields = Object.fromEntries(new FormData(form));
        const subject = encodeURIComponent(form.name === "contact" ? `Website message: ${fields.topic || ""}` : "Newsletter signup");
        const body = encodeURIComponent(form.name === "contact" ? `${fields.message || ""}\n\n${fields.name || ""} (${fields.email || ""})` : `Please add ${fields.email || "my email"} to project updates.`);
        status.innerHTML = `Sorry, that did not go through. <a href="mailto:${EMAIL}?subject=${subject}&body=${body}">Send it by email instead</a>.`;
        status.className = status.className.replace(/ is-(ok|error)/g, "") + " is-error";
      } finally {
        button.disabled = false;
      }
    });
  });

  // Share buttons: any <div data-share> receives social + copy-link buttons.
  document.querySelectorAll("[data-share]").forEach((box) => {
    const url = encodeURIComponent(location.href.split("#")[0]);
    const text = encodeURIComponent(document.title);
    box.classList.add("gh-share");
    box.innerHTML = `<span>Share GlobalHope</span>
      <a href="https://wa.me/?text=${text}%20${url}" target="_blank" rel="noopener" aria-label="Share on WhatsApp"><i class="bi bi-whatsapp" aria-hidden="true"></i></a>
      <a href="https://www.facebook.com/sharer/sharer.php?u=${url}" target="_blank" rel="noopener" aria-label="Share on Facebook"><i class="bi bi-facebook" aria-hidden="true"></i></a>
      <a href="https://twitter.com/intent/tweet?text=${text}&url=${url}" target="_blank" rel="noopener" aria-label="Share on X"><i class="bi bi-twitter-x" aria-hidden="true"></i></a>
      <a href="mailto:?subject=${text}&body=${url}" aria-label="Share by email"><i class="bi bi-envelope" aria-hidden="true"></i></a>
      <button type="button" aria-label="Copy page link"><i class="bi bi-link-45deg" aria-hidden="true"></i></button>`;
    const copy = box.querySelector("button");
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(location.href.split("#")[0]);
        copy.innerHTML = '<i class="bi bi-check2" aria-hidden="true"></i>';
        copy.setAttribute("aria-label", "Link copied");
      } catch {
        copy.setAttribute("aria-label", "Could not copy link");
      }
    });
  });

  // Contact form success message after a non-AJAX redirect.
  if (new URLSearchParams(location.search).get("sent") === "1") {
    const sent = document.querySelector("[data-sent-message]");
    if (sent) sent.hidden = false;
  }
})();
