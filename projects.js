const projects = window.GH_PROJECTS; // each project lives in projects/<id>.js

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;",
  "'": "&#39;"
})[character]);

// Media is authored in projects.html inside <div data-media="project-id"> blocks.
const getMedia = (id) => {
  const root = document.querySelector(`[data-media="${CSS.escape(id)}"]`);
  const images = [...(root?.querySelectorAll("img") || [])].slice(0, 5).map((img) => img.getAttribute("src") || "");
  const videoEl = root?.querySelector("video");
  const video = videoEl?.querySelector("source")?.getAttribute("src") || videoEl?.getAttribute("src") || "";
  const videoPoster = videoEl?.getAttribute("poster") || "";
  return { images, video, videoPoster };
};
projects.forEach((project) => Object.assign(project, getMedia(project.id)));

const directory = document.querySelector("#project-directory");
if (directory) {
  directory.innerHTML = projects.map((project) => `
    <article class="project-listing">
      ${project.images?.[0] ? `<img class="project-listing-thumb img-fluid rounded-3" src="${escapeHtml(project.images[0])}" alt="${escapeHtml(project.title)}" loading="lazy" decoding="async">` : ""}
      <span class="project-listing-icon"><i class="bi ${escapeHtml(project.icon)}" aria-hidden="true"></i></span>
      <div class="project-listing-copy">
        <h2>${escapeHtml(project.title)}</h2>
        <p>${escapeHtml(project.summary)}</p>
        ${window.ghProgress(project)}
      </div>
      <a class="project-listing-link" href="projects.html?id=${encodeURIComponent(project.id)}" aria-label="View project: ${escapeHtml(project.title)}"><i class="bi bi-eye-fill" aria-hidden="true"></i><span>View project</span></a>
    </article>`).join("");
}

const detail = document.querySelector("#project-detail");
if (detail) {
  const projectId = new URLSearchParams(window.location.search).get("id");
  if (projectId) {
    directory.hidden = true;
    document.querySelector("#projects-heading").hidden = true;
    detail.hidden = false;
  } else {
    detail.hidden = true;
  }
  const projectIndex = projects.findIndex((project) => project.id === projectId);
  const project = projects[projectIndex];

  if (projectId && !project) {
    detail.innerHTML = '<a class="back-link" href="projects.html"><i class="bi bi-arrow-left" aria-hidden="true"></i> All projects</a><section class="project-not-found"><h1>Project not found</h1><p>Choose another initiative from the project directory.</p><a class="btn-primary" href="projects.html">Browse projects</a></section>';
  } else if (project) {
    const projectLink = `projects.html?id=${encodeURIComponent(project.id)}`;
    const imagePaths = Array.from({ length: Math.max(4, project.images.length) }, (_, index) => project.images[index] || "");
    const imageSlots = imagePaths.map((imagePath, index) => imagePath
      ? `<img class="detail-project-image" src="${escapeHtml(imagePath)}" alt="${escapeHtml(project.title)} project photo ${index + 1}" loading="lazy" decoding="async">`
      : `<div class="detail-image-placeholder" role="img" aria-label="Project photo ${index + 1}"><i class="bi bi-image" aria-hidden="true"></i><span>Project photo ${index + 1}</span></div>`).join("");
    const video = project.video
      ? `<video class="detail-project-video" controls preload="metadata"${project.videoPoster ? ` poster="${escapeHtml(project.videoPoster)}"` : ""}><source src="${escapeHtml(project.video)}">Your browser does not support embedded video.</video>`
      : '<div class="detail-video-placeholder"><i class="bi bi-camera-video" aria-hidden="true"></i><span>Project video</span></div>';
    const relatedProjects = [1, 2, 3].map((offset) => projects[(projectIndex + offset) % projects.length]);

    document.title = `${project.title} — GlobalHope`;
    detail.innerHTML = `
      <a class="back-link" href="projects.html"><i class="bi bi-arrow-left" aria-hidden="true"></i> All projects</a>
      <section class="project-detail-hero">
        <span class="project-detail-icon"><i class="bi ${escapeHtml(project.icon)}" aria-hidden="true"></i></span>
        <span class="eyebrow">GlobalHope initiative</span>
        <h1>${escapeHtml(project.title)}</h1>
        <p>${escapeHtml(project.summary)}</p>
        <a class="project-contribute-btn" href="payment.html?project=${encodeURIComponent(project.id)}&amp;amount=25"><i class="bi bi-heart-fill" aria-hidden="true"></i><span>Contribute to this project</span><i class="bi bi-arrow-right" aria-hidden="true"></i></a>
      </section>
      <section class="project-detail-section">
        <div class="project-section-heading"><span class="eyebrow">Why this project matters</span><h2>Purpose and need</h2><p>${escapeHtml(project.why)}</p></div>
      </section>
      <section class="project-detail-section">
        <div class="project-section-heading"><span class="eyebrow">What this initiative may support</span><h2>Areas of focus</h2></div>
        <ul class="project-focus-list">${project.examples.map((example) => `<li><i class="bi bi-check2-circle" aria-hidden="true"></i>${escapeHtml(example)}</li>`).join("")}</ul>
      </section>
      <section class="project-detail-section">
        <div class="project-section-heading"><span class="eyebrow">Funding progress</span><h2>Where this project stands</h2></div>
        ${window.ghProgress(project)}
      </section>
      <section class="project-detail-section">
        <div class="project-section-heading"><span class="eyebrow">Stories from the work 📸</span><h2>Project photos</h2><p>Community updates and approved project stories will be shared here.</p></div>
        <div class="detail-image-grid">${imageSlots}</div>
      </section>
      <section class="project-detail-section project-video-section">
        <div class="project-section-heading"><span class="eyebrow">From the community 🎥</span><h2>Project video</h2><p>Stories from community projects help show the work and the people behind it.</p></div>
        ${video}
        <p class="project-edit-note"><strong>Update this project’s media:</strong> In <code>projects.html</code>, find the <code>data-media="${escapeHtml(project.id)}"</code> block and set the <code>src</code> of its four <code>&lt;img&gt;</code> tags and the <code>&lt;video&gt;</code> source.</p>
      </section>
      <section class="related-projects">
        <div class="project-section-heading"><span class="eyebrow">Keep exploring</span><h2>Related initiatives</h2></div>
        <div class="related-project-links">${relatedProjects.map((related) => `<a href="projects.html?id=${encodeURIComponent(related.id)}"><i class="bi ${escapeHtml(related.icon)}" aria-hidden="true"></i>${escapeHtml(related.title)}<i class="bi bi-arrow-up-right" aria-hidden="true"></i></a>`).join("")}</div>
        <a class="back-link related-back" href="projects.html"><i class="bi bi-grid" aria-hidden="true"></i> View all 15 projects</a>
      </section>
      <section class="project-share"><span>Share this initiative</span><a href="https://wa.me/?text=${encodeURIComponent(`${project.title} — ${new URL(projectLink, window.location.href).href}`)}" target="_blank" rel="noopener" aria-label="Share on WhatsApp"><i class="bi bi-whatsapp" aria-hidden="true"></i></a><a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(new URL(projectLink, window.location.href).href)}" target="_blank" rel="noopener" aria-label="Share on Facebook"><i class="bi bi-facebook" aria-hidden="true"></i></a></section>`;
  }
}
