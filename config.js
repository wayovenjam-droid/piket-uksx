// SUPABASE CONFIG & GLOBAL VARIABLES
const SUPABASE_URL = 'https://xlrpxjtrpqemcaastklo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NilsinR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZil6InhscnB4anRycHFlbWNhYXN0a2xvliwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczNjMzODcslmV4cCI6MjEwMjkzOTM4N30.1V6eTxojH251hm9IHR90JC0nWqcb61eSFXwNov1meq4';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentAdminSession = null;
let isMasterOverride = false;
let allMembers = [];
let selectedHari = 'Senin';
let selectedAdminHari = 'Senin';
let activeDraggedMemberId = null;

// Clock & Time Tracker
setInterval(() => {
  const d = new Date();
  const clockEl = document.getElementById('clockInfo');
  if(clockEl) {
    clockEl.innerHTML = `<i class="fa-regular fa-clock"></i> ${d.toLocaleTimeString('id-ID')}`;
  }
  cekAktifShift();
}, 1000);

function updateDateDisplay() {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateEl = document.getElementById('currentDateDisplay');
  if(dateEl) {
    dateEl.innerText = new Date().toLocaleDateString('id-ID', options);
  }
}

function switchTab(tabName, element) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
  
  const targetView = document.getElementById(`view-${tabName}`);
  if(targetView) targetView.classList.add('active');
  if(element) element.classList.add('active');
}
