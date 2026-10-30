// Builds the funding progress bar for a project; goal/raised are set in projects/<id>.js.
window.ghProgress = (project) => {
  const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[c]);
  const money = (value) => new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
  const goal = Math.max(0, Number(project.goal) || 0);
  const raised = Math.max(0, Number(project.raised) || 0);

  if (goal <= 0) {
    return '<div class="gh-progress-block"><div class="gh-progress-meta"><span>Funding goal to be announced</span></div><div class="gh-progress" aria-hidden="true"><span style="width:0%"></span></div></div>';
  }
  const percent = Math.min(100, Math.round((raised / goal) * 1000) / 10);
  return `<div class="gh-progress-block"><div class="gh-progress-meta"><strong>${money(raised)} raised</strong><span>${percent}% of ${money(goal)}</span></div><div class="gh-progress" role="progressbar" aria-label="Funding progress for ${escape(project.title)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><span style="width:${percent}%"></span></div></div>`;
};
