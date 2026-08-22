function cekAktifShift() {
  const now = new Date();
  const day = now.getDay();
  const timeStr = now.toTimeString().substring(0, 5);
  let isShiftOpen = false;

  if (day === 1 && ((timeStr >= "09:05" && timeStr <= "09:35") || (timeStr >= "12:15" && timeStr <= "13:00"))) {
    isShiftOpen = true;
  } else if (day >= 2 && day <= 4 && ((timeStr >= "09:20" && timeStr <= "09:50") || (timeStr >= "11:50" && timeStr <= "12:50"))) {
    isShiftOpen = true;
  } else if (day === 5 && (timeStr >= "09:00" && timeStr <= "09:40")) {
    isShiftOpen = true;
  }

  if (isMasterOverride) isShiftOpen = true;

  const selectPiket = document.getElementById('selectNamaPiket');
  if (selectPiket) selectPiket.disabled = !isShiftOpen;
}

function populateDropdownPiket() {
  const select = document.getElementById('selectNamaPiket');
  if (!select) return;
  select.innerHTML = '<option value="">-- Pilih Nama Petugas --</option>';
  allMembers.forEach(m => {
    select.innerHTML += `<option value="${m.nama}">${m.nama} (Fase ${m.fase} - ${m.hari})</option>`;
  });
}
