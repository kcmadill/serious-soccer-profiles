function resolveSlug() {
  const querySlug = new URLSearchParams(window.location.search).get('player');
  if (querySlug) {
    return querySlug;
  }

  const pathParts = window.location.pathname.split('/').filter(Boolean);
  return pathParts[pathParts.length - 1] || '';
}

function positionLabel(profile) {
  return [profile.primaryPosition, profile.secondaryPosition].filter(Boolean).join(' / ') || 'TBD';
}

function bestFilmLink(profile) {
  return profile.reelUrl || profile.highlightVideoUrl || '';
}

function renderEmpty(slug) {
  return `
    <div class="empty-card">
      <p class="eyebrow">Serious Soccer</p>
      <h1>Player profile not found</h1>
      <p class="body-copy">No public player profile is available for <strong>${slug || 'this URL'}</strong> yet.</p>
    </div>
  `;
}

function renderProfile(profile) {
  const headshot = profile.headshotUrl
    ? `<img class="headshot" src="${profile.headshotUrl}" alt="${profile.displayName}" />`
    : `<div class="headshot empty">No Headshot</div>`;

  return `
    <section class="hero">
      ${headshot}
      <div>
        <p class="eyebrow">Serious Soccer Recruiting Profile</p>
        <h1>${profile.displayName}</h1>
        <div class="meta">${positionLabel(profile)} · Class of ${profile.graduationYear}</div>
        <div class="meta">${profile.highSchool || 'High school TBD'} · ${profile.clubName || 'Club TBD'}</div>
        <div class="meta">GPA ${profile.gpa || 'TBD'} · ${profile.playerEmail || 'Email TBD'} · ${profile.playerPhone || 'Phone TBD'}</div>
      </div>
    </section>
    <section class="grid">
      <article class="panel">
        <h2>Player Snapshot</h2>
        <div class="stats">
          <div class="stat"><div class="stat-label">Jersey</div><div class="stat-value">#${profile.jerseyNumber || '--'}</div></div>
          <div class="stat"><div class="stat-label">Foot</div><div class="stat-value">${profile.dominantFoot || 'TBD'}</div></div>
          <div class="stat"><div class="stat-label">Height</div><div class="stat-value">${profile.height || 'TBD'}</div></div>
          <div class="stat"><div class="stat-label">Weight</div><div class="stat-value">${profile.weight || 'TBD'}</div></div>
          <div class="stat"><div class="stat-label">Major</div><div class="stat-value">${profile.intendedMajor || 'TBD'}</div></div>
          <div class="stat"><div class="stat-label">Club</div><div class="stat-value">${profile.clubName || 'TBD'}</div></div>
        </div>
        <h2 style="margin-top:24px;">About</h2>
        <div class="body-copy">${profile.bio || 'A recruiting bio has not been published yet.'}</div>
      </article>
      <article class="panel">
        <h2>Film and Links</h2>
        <div class="link-list">
          ${profile.profileShareUrl ? `<a href="${profile.profileShareUrl}" target="_blank" rel="noreferrer">Digital profile link</a>` : ''}
          ${bestFilmLink(profile) ? `<a href="${bestFilmLink(profile)}" target="_blank" rel="noreferrer">Highlight film / reel</a>` : ''}
          ${profile.recruitingInstagramUrl ? `<a href="${profile.recruitingInstagramUrl}" target="_blank" rel="noreferrer">Recruiting Instagram</a>` : ''}
          ${profile.recruitingTwitterUrl ? `<a href="${profile.recruitingTwitterUrl}" target="_blank" rel="noreferrer">Recruiting X / Twitter</a>` : ''}
          ${profile.recruitingTikTokUrl ? `<a href="${profile.recruitingTikTokUrl}" target="_blank" rel="noreferrer">Recruiting TikTok</a>` : ''}
        </div>
      </article>
    </section>
  `;
}

async function main() {
  const app = document.getElementById('app');
  const slug = resolveSlug();

  const response = await fetch('/player-profiles.json');
  const payload = await response.json();
  const profile = payload.profiles.find((item) => item.slug === slug) || payload.profiles[0];

  app.innerHTML = profile ? renderProfile(profile) : renderEmpty(slug);
}

main().catch(() => {
  document.getElementById('app').innerHTML = renderEmpty(resolveSlug());
});
