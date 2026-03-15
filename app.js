function getBasePath() {
  return window.__SERIOUS_SOCCER_PUBLIC_BASE_PATH__ || '';
}

function resolveSlug() {
  const querySlug = new URLSearchParams(window.location.search).get('player');
  if (querySlug) {
    return querySlug;
  }

  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const basePath = getBasePath();
  const baseSegment = basePath.replace(/^\//, '');
  const normalizedParts = pathParts.filter((part, index) => !(index === 0 && part === baseSegment));
  const playerIndex = normalizedParts.indexOf('player');

  if (playerIndex >= 0) {
    return normalizedParts[playerIndex + 1] || '';
  }

  if (normalizedParts.length <= 1) {
    return '';
  }

  return normalizedParts[normalizedParts.length - 1] || '';
}

function positionLabel(profile) {
  return [profile.primaryPosition, profile.secondaryPosition].filter(Boolean).join(' / ') || 'TBD';
}

function bestFilmLink(profile) {
  return profile.reelUrl || profile.highlightVideoUrl || '';
}

function formatStat(value, fallback = 'TBD') {
  return value || value === 0 ? value : fallback;
}

function buildContactLine(profile) {
  if (!profile.showContactInfo) {
    return 'Contact shared on request';
  }

  return [profile.playerEmail, profile.playerPhone].filter(Boolean).join(' · ') || 'Contact shared on request';
}

function buildQuickFacts(profile) {
  return [
    { label: 'Class', value: profile.graduationYear || 'TBD' },
    { label: 'Primary Pos', value: profile.primaryPosition || 'TBD' },
    { label: 'Secondary Pos', value: profile.secondaryPosition || 'TBD' },
    { label: 'Foot', value: profile.dominantFoot || 'TBD' },
    { label: 'Height', value: profile.height || 'TBD' },
    { label: 'Weight', value: profile.weight || 'TBD' },
  ];
}

function buildAcademicFacts(profile) {
  const facts = [
    { label: 'Intended Major', value: profile.intendedMajor || 'TBD' },
    { label: 'Hometown', value: profile.hometown || 'TBD' },
    { label: 'High School', value: profile.highSchool || 'TBD' },
    { label: 'Club Team', value: profile.teamName || profile.clubName || 'TBD' },
  ];

  if (profile.showAcademicMetrics) {
    facts.unshift({ label: 'GPA', value: formatStat(profile.gpa) });
  }

  return facts;
}

function renderFactGrid(items) {
  return `
    <div class="stats">
      ${items
        .map(
          (item) => `
            <div class="stat">
              <div class="stat-label">${item.label}</div>
              <div class="stat-value">${item.value}</div>
            </div>
          `
        )
        .join('')}
    </div>
  `;
}

function renderLinks(profile) {
  const links = [
    { href: bestFilmLink(profile), label: 'Highlight Film / Reel', emphasis: 'primary' },
    { href: profile.recruitingInstagramUrl, label: 'Recruiting Instagram' },
    { href: profile.recruitingTwitterUrl, label: 'Recruiting X / Twitter' },
    { href: profile.recruitingTikTokUrl, label: 'Recruiting TikTok' },
  ].filter((item) => item.href);

  if (!links.length) {
    return `<div class="empty-note">No public recruiting links have been published yet.</div>`;
  }

  return `
    <div class="link-stack">
      ${links
        .map(
          (item) => `
            <a class="link-card ${item.emphasis || ''}" href="${item.href}" target="_blank" rel="noreferrer">
              <span>${item.label}</span>
              <span class="link-arrow">Open</span>
            </a>
          `
        )
        .join('')}
    </div>
  `;
}

function renderHonors(profile) {
  if (!profile.honors || !profile.honors.length) {
    return `<div class="empty-note">No honors or notable achievements published yet.</div>`;
  }

  return `
    <ul class="honors-list">
      ${profile.honors.map((item) => `<li>${item}</li>`).join('')}
    </ul>
  `;
}

function renderCoachContact(profile) {
  const details = [profile.coachContactEmail, profile.coachContactPhone].filter(Boolean).join(' · ');

  if (!profile.coachContactName && !details) {
    return `<div class="empty-note">Coach contact will be shared directly with verified college staff.</div>`;
  }

  return `
    <div class="contact-card coach-card">
      <div class="contact-label">Club Recruiting Contact</div>
      <div class="contact-value">${profile.coachContactName || 'Staff contact'}</div>
      <div class="contact-subvalue">${details || 'Direct contact details available on request'}</div>
    </div>
  `;
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
  const contactLine = buildContactLine(profile);

  return `
    <section class="hero">
      <div class="hero-media">
        ${headshot}
        <div class="badge-row">
          <span class="player-badge">#${profile.jerseyNumber || '--'}</span>
          <span class="player-badge muted">${positionLabel(profile)}</span>
        </div>
      </div>
      <div class="hero-copy">
        <p class="eyebrow">Serious Soccer Recruiting Profile</p>
        <h1>${profile.displayName}</h1>
        <div class="meta">Class of ${profile.graduationYear || 'TBD'} · ${profile.highSchool || 'High school TBD'}</div>
        <div class="meta">${profile.clubName || 'Club TBD'} · ${profile.teamName || 'Team TBD'}</div>
        <div class="meta">${contactLine}</div>
        <p class="hero-summary">${profile.bio || 'A recruiting bio has not been published yet.'}</p>
        <div class="hero-actions">
          ${
            bestFilmLink(profile)
              ? `<a class="cta primary" href="${bestFilmLink(profile)}" target="_blank" rel="noreferrer">Watch Film</a>`
              : ''
          }
          ${
            profile.recruitingInstagramUrl
              ? `<a class="cta" href="${profile.recruitingInstagramUrl}" target="_blank" rel="noreferrer">Recruiting Instagram</a>`
              : ''
          }
          <button class="cta ghost" type="button" onclick="window.print()">Download Player Card PDF</button>
        </div>
      </div>
    </section>
    <section class="grid">
      <article class="panel">
        <div class="panel-header">
          <p class="eyebrow">Snapshot</p>
          <h2>Quick Facts</h2>
        </div>
        ${renderFactGrid(buildQuickFacts(profile))}
        <div class="panel-header split">
          <div>
            <p class="eyebrow">Academics</p>
            <h2>School Fit Context</h2>
          </div>
        </div>
        ${renderFactGrid(buildAcademicFacts(profile))}
        <div class="panel-header split">
          <div>
            <p class="eyebrow">Honors</p>
            <h2>Achievements</h2>
          </div>
        </div>
        ${renderHonors(profile)}
      </article>
      <article class="panel">
        <div class="panel-header">
          <p class="eyebrow">Actions</p>
          <h2>Film and Recruiting Links</h2>
        </div>
        ${renderLinks(profile)}
        <div class="contact-card">
          <div class="contact-label">Player contact</div>
          <div class="contact-value">${contactLine}</div>
        </div>
        ${renderCoachContact(profile)}
      </article>
    </section>
  `;
}

async function main() {
  const app = document.getElementById('app');
  const slug = resolveSlug();
  const basePath = getBasePath();

  const response = await fetch(`${basePath}/player-profiles.json`);
  const payload = await response.json();
  const profile = payload.profiles.find((item) => item.slug === slug) || payload.profiles[0];

  app.innerHTML = profile ? renderProfile(profile) : renderEmpty(slug);
}

main().catch(() => {
  document.getElementById('app').innerHTML = renderEmpty(resolveSlug());
});
