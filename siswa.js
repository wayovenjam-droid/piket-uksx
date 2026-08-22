function masukPortalSiswa() {
  document.getElementById('welcomeScreen').style.display = 'none';
  document.getElementById('mainApp').style.display = 'block';
  updateDateDisplay();
  
  const daysArr = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const today = daysArr[new Date().getDay()];
  if (['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].includes(today)) selectedHari = today;
  
  updateUIHariSiswa();
  muatDataSiswa();
}

function pilihHari(hari, el) {
  selectedHari = hari;
  document.querySelectorAll('#view-siswa .day-chip').forEach(c => c.classList.remove('active'));
  if(el) el.classList.add('active');
  updateUIHariSiswa();
  renderShiftSiswa();
}

function updateUIHariSiswa() {
  const lbl = document.getElementById('lblSelectedDay');
  if(lbl) lbl.innerText = selectedHari;

  const shift2Box = document.getElementById('siswaShift2Box');
  const gridContainer = document.getElementById('siswaGridContainer');

  if (selectedHari === 'Jumat') {
    if(shift2Box) shift2Box.style.display = 'none';
    if(gridContainer) gridContainer.style.gridTemplateColumns = '1fr';
  } else {
    if(shift2Box) shift2Box.style.display = 'block';
    if(gridContainer) gridContainer.style.gridTemplateColumns = '1fr 1fr';
  }
}

async function muatDataSiswa() {
  const { data } = await sb.from('members').select('*');
  if (data) {
    allMembers = data;
    renderShiftSiswa();
    populateDropdownPiket();
  }
}

function renderShiftSiswa() {
  const s1 = allMembers.filter(m => m.hari === selectedHari && m.shift === 1);
  const s2 = allMembers.filter(m => m.hari === selectedHari && m.shift === 2);
  
  const list1 = document.getElementById('listShift1Siswa');
  const list2 = document.getElementById('listShift2Siswa');

  if(list1) {
    list1.innerHTML = s1.length 
      ? s1.map(m => `<div style="padding:4px 0">${m.nama} (Fase ${m.fase})</div>`).join('') 
      : '<span style="color:#aaa; font-size:12px;">Tidak ada petugas</span>';
  }
    
  if(list2) {
    list2.innerHTML = s2.length 
      ? s2.map(m => `<div style="padding:4px 0">${m.nama} (Fase ${m.fase})</div>`).join('') 
      : '<span style="color:#aaa; font-size:12px;">Tidak ada petugas</span>';
  }
}
