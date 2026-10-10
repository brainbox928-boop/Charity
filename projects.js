const projects = [
  {
    id: "food-security",
    title: "Food Security & Agricultural Development",
    icon: "bi-basket2-fill",
    summary: "Support practical community efforts that improve access to nourishing food and strengthen local food systems.",
    why: "Reliable access to nutritious food supports health, stability, and opportunity. This initiative can connect community kitchens, local food providers, and growers with practical tools and resources.",
    examples: ["Community kitchen infrastructure", "Pantry distribution", "Micro-farm hydroponic tools"]
  },
  {
    id: "healthcare",
    title: "Healthcare & Medical Access",
    icon: "bi-heart-pulse-fill",
    summary: "Help community partners expand access to essential care, supplies, and health services.",
    why: "Distance, cost, and limited equipment can make healthcare difficult to reach. Support can help local partners strengthen basic services and connect more people with appropriate care.",
    examples: ["Rural clinic supplies", "Telehealth hardware", "Prescription micro-grant pools"]
  },
  {
    id: "shelter-housing",
    title: "Emergency Shelter & Affordable Housing",
    icon: "bi-house-heart-fill",
    summary: "Support safer temporary shelter and practical paths toward stable, affordable housing.",
    why: "Safe shelter gives people a foundation for health, education, and work. This initiative focuses on practical building needs, protection from harsh weather, and help for young people transitioning to housing.",
    examples: ["Structural building materials", "Winterization kits", "Transitional youth housing deposits"]
  },
  {
    id: "education",
    title: "Education & Literacy Programs",
    icon: "bi-book-half",
    summary: "Help learners access educational resources, literacy support, and opportunities to build future skills.",
    why: "Access to books, technology, and welcoming learning environments can open pathways for children and adults. Support can help educators and community partners respond to the needs they identify locally.",
    examples: ["Student tech bundles", "STEM classroom equipment", "Underrepresented developer micro-endowments"]
  },
  {
    id: "clean-water",
    title: "Clean Water & Sanitation Access",
    icon: "bi-droplet-half",
    summary: "Support community-led improvements to safe water, filtration, and public sanitation.",
    why: "Reliable clean water and sanitation are essential for everyday health and dignity. This initiative aims to help local partners improve water access, filtration, and hygiene infrastructure.",
    examples: ["Community well drilling", "Water filtration kits", "Public hygiene stations"]
  },
  {
    id: "animal-welfare",
    title: "Animal Welfare & Rescue",
    icon: "bi-heart-fill",
    summary: "Help local rescue and animal-care groups provide humane, practical support.",
    why: "Animal rescue organizations often need practical help to provide humane treatment and safe placements. Support can contribute to preventative care, rehabilitation, and adoption services.",
    examples: ["Stray sterilization", "Wildlife rehabilitation", "Pet adoption medical funding"]
  },
  {
    id: "environment",
    title: "Environmental Conservation & Climate Tech",
    icon: "bi-tree-fill",
    summary: "Back community projects that care for local ecosystems and explore practical climate solutions.",
    why: "Healthy local environments support livelihoods and community wellbeing. This initiative can equip local groups to care for natural spaces and test appropriate, community-led climate solutions.",
    examples: ["Community reforestation", "Beach cleanup equipment", "Urban solar installations"]
  },
  {
    id: "disaster-relief",
    title: "Disaster Relief & Emergency Response",
    icon: "bi-life-preserver",
    summary: "Help response teams and local partners prepare for urgent needs during emergencies.",
    why: "When emergencies happen, timely transport, medical logistics, and trained response resources matter. Contributions can help local partners prepare and respond to needs they verify on the ground.",
    examples: ["Search and rescue supplies", "Field hospital logistics", "Evacuation transport pools"]
  },
  {
    id: "arts-culture",
    title: "Arts, Culture & Heritage Preservation",
    icon: "bi-palette-fill",
    summary: "Support creative programs and community efforts to preserve and share local heritage.",
    why: "Arts and heritage help communities tell their stories, preserve knowledge, and create shared spaces. This initiative supports locally chosen cultural projects and opportunities for young creators.",
    examples: ["Community mural funding", "Local museum digitizing projects", "Youth theater equipment"]
  },
  {
    id: "elderly-support",
    title: "Elderly Support & Senior Care",
    icon: "bi-person-hearts",
    summary: "Help older adults stay connected, supported, and able to participate in community life.",
    why: "Many older adults benefit from practical access support and regular human connection. Community programs can make it easier to receive meals, navigate spaces, and stay socially engaged.",
    examples: ["Meal delivery mileage pools", "Accessibility ramp building", "Senior companion programs"]
  },
  {
    id: "veterans-first-responders",
    title: "Veterans & First Responder Assistance",
    icon: "bi-shield-heart-fill",
    summary: "Support wellbeing and transition resources for veterans and first responders.",
    why: "People who have served their communities may need support with wellbeing, accessibility, and the transition to new work. This initiative can help partners offer tailored resources.",
    examples: ["Service dog training", "Mental health retreat sponsorships", "Transition career training"]
  },
  {
    id: "legal-aid",
    title: "Legal Aid & Social Justice Advocacy",
    icon: "bi-people-fill",
    summary: "Help communities access practical legal support and public-interest advocacy.",
    why: "Documentation costs and limited access to advice can make it harder for people to understand and exercise their rights. Community legal partners can use support to improve access to assistance and public information.",
    examples: ["Bail fund pools", "Pro-bono documentation processing fees", "Public awareness ad spend"]
  },
  {
    id: "mental-health",
    title: "Mental Health & Suicide Prevention",
    icon: "bi-chat-heart-fill",
    summary: "Strengthen access to compassionate mental-health resources and community support.",
    why: "Accessible, culturally responsive support can help people find care and connection earlier. This initiative supports community spaces and services led by qualified partners.",
    examples: ["24/7 crisis hotline operations", "Free therapy session pools", "Wellness community spaces"]
  },
  {
    id: "economic-empowerment",
    title: "Economic Empowerment & Micro-Loans",
    icon: "bi-graph-up-arrow",
    summary: "Support community economic opportunity and locally led small-business growth.",
    why: "Small businesses and local makers can face barriers to capital, customers, and shared infrastructure. Community-designed financing and marketplaces may help more people build sustainable livelihoods.",
    examples: ["Interest-free small business grants", "Local artisan marketplace infrastructure"]
  },
  {
    id: "youth-mentorship",
    title: "Youth Mentorship & After-School Programs",
    icon: "bi-stars",
    summary: "Help young people find supportive mentors, enriching activities, and places to grow.",
    why: "Safe, engaging after-school programs give young people opportunities to learn, build confidence, and connect with caring mentors. Local organizations can shape activities around what youth want and need.",
    examples: ["Community sports equipment drives", "Leadership camp sponsorships"]
  }
];

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;",
  "'": "&#39;"
})[character]);

const directory = document.querySelector("#project-directory");
if (directory) {
  directory.innerHTML = projects.map((project) => `
    <article class="project-listing">
      <span class="project-listing-icon"><i class="bi ${escapeHtml(project.icon)}" aria-hidden="true"></i></span>
      <div class="project-listing-copy">
        <h2>${escapeHtml(project.title)}</h2>
        <p>${escapeHtml(project.summary)}</p>
      </div>
      <a class="project-listing-link" href="projects.html?id=${encodeURIComponent(project.id)}" aria-label="Read about ${escapeHtml(project.title)}"><i class="bi bi-arrow-up-right" aria-hidden="true"></i></a>
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
    const imagePaths = [0, 1, 2, 3].map((index) => project.images?.[index] || "");
    const imageSlots = imagePaths.map((imagePath, index) => imagePath
      ? `<img class="detail-project-image" src="${escapeHtml(imagePath)}" alt="${escapeHtml(project.title)} project photo ${index + 1}" loading="lazy">`
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
        <div class="project-section-heading"><span class="eyebrow">Stories from the work</span><h2>Project photos</h2><p>Community updates and approved project stories will be shared here.</p></div>
        <div class="detail-image-grid">${imageSlots}</div>
      </section>
      <section class="project-detail-section project-video-section">
        <div class="project-section-heading"><span class="eyebrow">From the community</span><h2>Project video</h2><p>Stories from community projects help show the work and the people behind it.</p></div>
        ${video}
      </section>
      <section class="related-projects">
        <div class="project-section-heading"><span class="eyebrow">Keep exploring</span><h2>Related initiatives</h2></div>
        <div class="related-project-links">${relatedProjects.map((related) => `<a href="projects.html?id=${encodeURIComponent(related.id)}"><i class="bi ${escapeHtml(related.icon)}" aria-hidden="true"></i>${escapeHtml(related.title)}<i class="bi bi-arrow-up-right" aria-hidden="true"></i></a>`).join("")}</div>
        <a class="back-link related-back" href="projects.html"><i class="bi bi-grid" aria-hidden="true"></i> View all 15 projects</a>
      </section>
      <section class="project-share"><span>Share this initiative</span><a href="https://wa.me/?text=${encodeURIComponent(`${project.title} — ${new URL(projectLink, window.location.href).href}`)}" target="_blank" rel="noopener" aria-label="Share on WhatsApp"><i class="bi bi-whatsapp" aria-hidden="true"></i></a><a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(new URL(projectLink, window.location.href).href)}" target="_blank" rel="noopener" aria-label="Share on Facebook"><i class="bi bi-facebook" aria-hidden="true"></i></a></section>`;
  }
}
