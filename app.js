/* ====== Mock data ====== */
const TEAM_NAME = "[Your Team Name]";
const players = [
  { id:1, name:"Rohit Sharma", role:"Batsman", img:"assets/player-placeholder.jpg", bio:"Right-handed top-order batsman." },
  { id:2, name:"Jasprit Bumrah", role:"Bowler", img:"assets/player-placeholder.jpg", bio:"Fast bowler, death overs specialist." },
  { id:3, name:"Hardik Pandya", role:"Allrounder", img:"assets/player-placeholder.jpg", bio:"Middle-order hitter and seam bowling." },
  { id:4, name:"Sanju Samson", role:"Wicketkeeper", img:"assets/player-placeholder.jpg", bio:"Explosive batsman and keeper." }
];

const fixtures = [
  { id:1, date:"2025-04-05", opponent:"Mumbai Indians", venue:"Wankhede", time:"19:30", result:null },
  { id:2, date:"2025-04-12", opponent:"Chennai Super Kings", venue:"Eden Gardens", time:"19:30", result:"Won by 6 wickets" },
  { id:3, date:"2025-04-18", opponent:"Delhi Capitals", venue:"Arun Jaitley", time:"15:30", result:null }
];

const news = [
  { id:1, title:"Team announce new jersey for 2025", summary:"New design revealed at the season launch.", date:"2025-03-15" },
  { id:2, title:"Coach Ross appointed for next season", summary:"Former international coach joins the backroom staff.", date:"2025-03-10" }
];

/* ====== DOM refs ====== */
const footerYear = document.getElementById('footer-year');
const teamNameEl = document.getElementById('team-name');
const playersGrid = document.getElementById('players-grid');
const fixturesList = document.getElementById('fixtures-list');
const statsCards = document.getElementById('stats-cards');
const newsList = document.getElementById('news-list');
const playerSearch = document.getElementById('player-search');
const roleFilter = document.getElementById('role-filter');
const matchSearch = document.getElementById('match-search');
const mobileNavToggle = document.getElementById('mobile-nav-toggle');
const pollOptionsWrap = document.getElementById('poll-options');
const pollForm = document.getElementById('poll-form');
const pollResults = document.getElementById('poll-results');
const viewPollResultsBtn = document.getElementById('view-poll-results');
const postForm = document.getElementById('post-form');
const postsList = document.getElementById('posts');
const shareButtons = document.querySelectorAll('[data-share]');

/* ====== Init page ====== */
function init(){
  footerYear.textContent = new Date().getFullYear();
  teamNameEl.textContent = TEAM_NAME;
  renderPlayers(players);
  renderFixtures(fixtures);
  renderStats();
  renderNews(news);
  setupPoll();
  loadPosts();
}
init();

/* ====== Player rendering & filtering ====== */
function renderPlayers(list){
  playersGrid.innerHTML = '';
  if(list.length===0){ playersGrid.innerHTML = '<p class="muted">No players found.</p>'; return; }
  list.forEach(p=>{
    const div = document.createElement('div'); div.className='player card';
    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div>
        <h4>${p.name}</h4>
        <div class="muted">${p.role}</div>
        <p>${p.bio}</p>
        <button class="btn" onclick="viewProfile(${p.id})">View Profile</button>
      </div>
    `;
    playersGrid.appendChild(div);
  });
}

window.viewProfile = function(id){
  const p = players.find(x=>x.id===id);
  if(!p) return alert('Player not found');
  alert(`${p.name}\nRole: ${p.role}\n\n${p.bio}`);
}

playerSearch.addEventListener('input',()=>{
  applyPlayerFilters();
});
roleFilter.addEventListener('change',applyPlayerFilters);

function applyPlayerFilters(){
  const q = playerSearch.value.trim().toLowerCase();
  const role = roleFilter.value;
  const filtered = players.filter(p=>{
    const matchesQ = p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q);
    const matchesRole = role? p.role === role : true;
    return matchesQ && matchesRole;
  });
  renderPlayers(filtered);
}

/* ====== Fixtures ====== */
function renderFixtures(list){
  fixturesList.innerHTML = '';
  list.forEach(m=>{
    const el = document.createElement('div'); el.className='card';
    el.innerHTML = `
      <strong>${m.date} — vs ${m.opponent}</strong>
      <div class="muted">${m.venue} • ${m.time}</div>
      <p>${m.result ? 'Result: '+m.result : 'Upcoming'}</p>
    `;
    fixturesList.appendChild(el);
  });
}
matchSearch && matchSearch.addEventListener('input',()=>{
  const q = matchSearch.value.trim().toLowerCase();
  renderFixtures(fixtures.filter(m=> (m.opponent.toLowerCase().includes(q) || m.date.includes(q) )));
});

/* ====== Stats (mock) ====== */
function renderStats(){
  statsCards.innerHTML = '';
  const cards = [
    {title:"Matches Played", value: 14},
    {title:"Wins", value: 9},
    {title:"Losses", value: 5},
    {title:"Net Run Rate", value: "+0.72"}
  ];
  cards.forEach(c=>{
    const d = document.createElement('div'); d.className='card';
    d.innerHTML = `<h3>${c.value}</h3><div class="muted">${c.title}</div>`;
    statsCards.appendChild(d);
  });
}
document.getElementById('reset-stats')?.addEventListener('click',renderStats);

/* ====== News ====== */
function renderNews(list){
  newsList.innerHTML = '';
  list.forEach(n=>{
    const d = document.createElement('div'); d.className='card';
    d.innerHTML = `
      <h4>${n.title}</h4>
      <div class="muted">${n.date}</div>
      <p>${n.summary}</p>
    `;
    newsList.appendChild(d);
  });
}

/* ====== Poll (localStorage-backed) ====== */
const POLL_KEY = 'ipl_fan_poll_v1';
function setupPoll(){
  const poll = { question:"Who will be Player of the Match next?", options:["Rohit Sharma","Jasprit Bumrah","Hardik Pandya","Other"], votes: {} };
  // load from storage or init
  const stored = JSON.parse(localStorage.getItem(POLL_KEY));
  const state = stored || poll;
  // render options
  pollOptionsWrap.innerHTML = '';
  state.options.forEach((opt, i)=>{
    const id = `opt-${i}`;
    const label = document.createElement('label');
    label.innerHTML = `<input type="radio" name="poll" value="${opt}" id="${id}" required> ${opt}`;
    pollOptionsWrap.appendChild(label);
  });

  pollForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const choice = pollForm.querySelector('input[name="poll"]:checked')?.value;
    if(!choice) return;
    const curr = JSON.parse(localStorage.getItem(POLL_KEY)) || poll;
    curr.votes[choice] = (curr.votes[choice] || 0) + 1;
    localStorage.setItem(POLL_KEY, JSON.stringify(curr));
    alert('Thanks for voting!');
  });
  viewPollResultsBtn.addEventListener('click', showPollResults);
}

function showPollResults(){
  const poll = JSON.parse(localStorage.getItem(POLL_KEY));
  if(!poll){ alert('No votes yet'); return; }
  pollResults.hidden = false;
  pollResults.innerHTML = '';
  const total = Object.values(poll.votes).reduce((a,b)=>a+(b||0),0) || 0;
  const wrapper = document.createElement('div');
  Object.keys(poll.votes).forEach(k=>{
    const count = poll.votes[k] || 0;
    const pct = total ? Math.round((count/total)*100) : 0;
    const p = document.createElement('div');
    p.innerHTML = `<strong>${k}</strong> — ${count} votes (${pct}%)`;
    wrapper.appendChild(p);
  });
  pollResults.appendChild(wrapper);
}

/* ====== Mini forum (client-only) ====== */
const POSTS_KEY = 'ipl_posts_v1';
function loadPosts(){
  const raw = JSON.parse(localStorage.getItem(POSTS_KEY)) || [];
  postsList.innerHTML = '';
  raw.slice().reverse().forEach(p=>{
    const li = document.createElement('li'); li.className='post';
    li.innerHTML = `<strong>${escapeHtml(p.name)}</strong> <div class="muted">${p.time}</div><p>${escapeHtml(p.text)}</p>`;
    postsList.appendChild(li);
  });
}
postForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = document.getElementById('post-name').value.trim();
  const text = document.getElementById('post-text').value.trim();
  if(!name || !text) return alert('Please complete both fields.');
  const posts = JSON.parse(localStorage.getItem(POSTS_KEY)) || [];
  posts.push({ name, text, time: new Date().toLocaleString() });
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  postForm.reset();
  loadPosts();
});

/* ====== Social share (basic) ====== */
shareButtons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const service = btn.dataset.share;
    const shareUrl = encodeURIComponent(location.href);
    const text = encodeURIComponent(`Check out ${TEAM_NAME} Fan Hub!`);
    if(service==='twitter'){
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`,'_blank');
    } else if(service==='facebook'){
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,'_blank');
    }
  });
});

/* ====== Mobile nav toggle ====== */
mobileNavToggle.addEventListener('click', ()=>{
  const opened = document.body.classList.toggle('nav-open');
  mobileNavToggle.setAttribute('aria-expanded', opened ? "true" : "false");
});

/* ====== Utilities ====== */
function escapeHtml(s){ return s.replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]); }

/* ====== Smooth scroll for internal links (progressive enhancement) ====== */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const tgt = document.querySelector(a.getAttribute('href'));
    if(tgt){ e.preventDefault(); tgt.scrollIntoView({behavior:'smooth',block:'start'}); if(document.body.classList.contains('nav-open')){ document.body.classList.remove('nav-open'); mobileNavToggle.setAttribute('aria-expanded','false'); } }
  });
});
