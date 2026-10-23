const $ = s => document.querySelector(s);
const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2200); };

const events = [
  {t:'CodeStorm Hackathon', type:'Hackathon', d:'12 Nov', info:'24-hour build event. Teams of 3-4.'},
  {t:'Summer Internship at TechNova', type:'Internship', d:'Apply by 30 Oct', info:'Frontend and data roles, 2 months.'},
  {t:'AI Workshop with Industry Experts', type:'Event', d:'5 Nov', info:'Hands-on session in Seminar Hall.'},
  {t:'Smart India Internship Drive', type:'Internship', d:'Apply by 8 Nov', info:'Open for 2nd and 3rd year students.'}
];
let tickets = [
  {id:101, issue:'Projector not working', place:'Lab 3', status:'In progress'},
  {id:102, issue:'Water leakage', place:'Block B, 2nd floor', status:'Open'}
];
let jobs = [{f:'DBMS_Unit3_Notes.pdf', pages:24, status:'Ready for pickup'}];
let filter = 'All';

const days = ['Mon','Tue','Wed','Thu','Fri'];
const tt = [
  ['Maths','DBMS','OS','Lab','Lab','Free'],
  ['OS','Maths','DBMS','Networks','Free','Mentor hour'],
  ['Networks','OS','Lab','Lab','Lab','Free'],
  ['DBMS','Networks','Maths','OS','Seminar','Free'],
  ['Maths','Free','Networks','DBMS','Project','Project']
];
const slots = ['9:00','10:00','11:00','12:00','2:00','3:00'];

const mentors = [
  {n:'Group A: Web Development', m:'Dr. Ramesh', s:'Next meet: Sat 10 AM', c:12},
  {n:'Group B: Data and AI', m:'Prof. Anitha', s:'Next meet: Fri 4 PM', c:9},
  {n:'Group C: Placement Prep', m:'Mr. Karthik', s:'Next meet: Mon 3 PM', c:15}
];

const pages = {
  Home: () => `
    <div class="grid">
      <div class="card"><p>Next class</p><div class="big">DBMS</div><p>11:00 AM, Room 204</p></div>
      <div class="card"><p>Open maintenance tickets</p><div class="big">${tickets.filter(t=>t.status!=='Resolved').length}</div><p>We will notify you on updates</p></div>
      <div class="card"><p>Print jobs ready</p><div class="big">${jobs.filter(j=>j.status.startsWith('Ready')).length}</div><p>Collect from the library counter</p></div>
    </div>
    <h2 style="margin:28px 0 12px">Coming up</h2>
    <div class="card">${events.slice(0,3).map(e=>`<div class="row"><div><b>${e.t}</b><p>${e.d}</p></div><span class="tag gold">${e.type}</span></div>`).join('')}</div>`,

  Printouts: () => `
    <div class="grid">
      <div class="card"><h3>Send a print request</h3>
        <label>Document</label><input type="file" id="pf">
        <label>Copies</label><input type="number" id="pc" value="1" min="1">
        <label>Type</label><select id="pt"><option>Black and white</option><option>Colour</option></select>
        <br><br><button class="cta" onclick="addPrint()">Send request</button></div>
      <div class="card"><h3>Your requests</h3>
        ${jobs.map(j=>`<div class="row"><div><b>${j.f}</b><p>${j.pages} pages</p></div><span class="tag">${j.status}</span></div>`).join('')}</div>
    </div>`,

  Timetable: () => `
    <table><tr><th></th>${slots.map(s=>`<th>${s}</th>`).join('')}</tr>
    ${tt.map((r,i)=>`<tr><th>${days[i]}</th>${r.map(c=>`<td class="${c==='Free'?'':'cls'}">${c}</td>`).join('')}</tr>`).join('')}</table>`,

  Mentors: () => `<div class="grid">${mentors.map(g=>`
    <div class="card"><h3>${g.n}</h3><p>Mentor: ${g.m}</p><p>${g.s}</p><br>
    <span class="tag">${g.c} members</span> <button class="ghost" onclick="toast('Joined ${g.n}')">Join group</button></div>`).join('')}</div>`,

  Opportunities: () => `
    <div class="chips">${['All','Hackathon','Internship','Event'].map(f=>`<button class="${f===filter?'on':''}" onclick="setFilter('${f}')">${f}</button>`).join('')}</div>
    <div class="grid">${events.filter(e=>filter==='All'||e.type===filter).map(e=>`
      <div class="card"><span class="tag gold">${e.type}</span><h3 style="margin-top:10px">${e.t}</h3><p>${e.info}</p><br>
      <div class="row" style="padding:0;border:0"><b>${e.d}</b><button class="ghost" onclick="toast('Reminder set')">Remind me</button></div></div>`).join('')}</div>`,

  Maintenance: () => `
    <div class="grid">
      <div class="card"><h3>Report a problem</h3>
        <label>What is wrong?</label><input id="mi" placeholder="e.g. Fan not working">
        <label>Where?</label><input id="mp" placeholder="e.g. Room 204">
        <br><br><button class="cta" onclick="addTicket()">Submit report</button></div>
      <div class="card"><h3>Your reports</h3>
        ${tickets.map(t=>`<div class="row"><div><b>${t.issue}</b><p>${t.place}</p></div><span class="tag ${t.status==='Open'?'red':''}">${t.status}</span></div>`).join('')}</div>
    </div>`,

  'Staff Location': () => `<div class="hold"><h2>Staff location is coming soon</h2><p class="muted">This feature is on hold for the demo.</p></div>`
};

function render(name){
  $('#title').textContent = name;
  $('#view').innerHTML = pages[name]();
  document.querySelectorAll('nav button').forEach(b => b.classList.toggle('on', b.dataset.p === name));
  current = name;
}
let current = 'Home';
function setFilter(f){ filter = f; render('Opportunities'); }
function addPrint(){
  const f = $('#pf').files[0];
  jobs.unshift({f: f ? f.name : 'Untitled.pdf', pages: 10 * ($('#pc').value||1), status:'Queued'});
  toast('Print request sent'); render('Printouts');
}
function addTicket(){
  const i = $('#mi').value.trim(), p = $('#mp').value.trim();
  if(!i || !p) return toast('Enter the problem and the location');
  tickets.unshift({id:Date.now(), issue:i, place:p, status:'Open'});
  toast('Report submitted'); render('Maintenance');
}

$('#nav').innerHTML = Object.keys(pages).map(k =>
  `<button data-p="${k}">${k}${k==='Staff Location'?'<small>on hold</small>':''}</button>`).join('');
$('#nav').addEventListener('click', e => { const b = e.target.closest('button'); if(b) render(b.dataset.p); });
render('Home');
