function bukaModalLogin() { document.getElementById('modalLogin').style.display = 'flex'; }
function tutupModalLogin() { document.getElementById('modalLogin').style.display = 'none'; }
function bukaModalGantiPass() { document.getElementById('modalGantiPass').style.display = 'flex'; }
function tutupModalGantiPass() { document.getElementById('modalGantiPass').style.display = 'none'; }

async function prosesLoginAdmin() {
  const u = document.getElementById('admUser').value;
  const p = document.getElementById('admPass').value;
  const { data, error } = await sb.from('admins').select('*').eq('username', u).eq('password', p).single();

  if (error || !data) {
    alert("Username / Password Admin Salah!");
    return;
  }

  currentAdminSession = data;
  tutupModalLogin();
  masukPortalSiswa();

  document.getElementById('tabAdminBtn').style.display = 'flex';
  document.getElementById('adminWelcome').innerText = `Selamat Datang, ${data.nama}`;
  document.getElementById('adminRole').innerText = `Jabatan: ${data.jabatan} (@${data.username})`;

  if (data.id === 1 || data.id === "1") {
    document.getElementById('masterOverrideBox').style.display = 'flex';
  } else {
    document.getElementById('masterOverrideBox').style.display = 'none';
  }

  switchTab('admin', document.getElementById('tabAdminBtn'));
  muatKelolaAdmin();
}

async function prosesGantiPassword() {
  const passLama = document.getElementById('passLama').value;
  const passBaru = document.getElementById('passBaru').value;
  if (!passLama || !passBaru) { alert("Harap isi password lama dan password baru!"); return; }
  if (passLama !== currentAdminSession.password) { alert("Password lama yang kamu masukkan salah!"); return; }

  const { error } = await sb.from('admins').update({ password: passBaru }).eq('id', currentAdminSession.id);
  if (error) {
    alert("Gagal mengubah password: " + error.message);
  } else {
    alert("Password berhasil diperbarui! Gunakan password baru ini untuk login berikutnya.");
    currentAdminSession.password = passBaru;
    tutupModalGantiPass();
    document.getElementById('passLama').value = '';
    document.getElementById('passBaru').value = '';
  }
}

function toggleMasterOverride() {
  isMasterOverride = !isMasterOverride;
  const btn = document.getElementById('btnMasterOverride');
  const badge = document.getElementById('masterTestingBadge');
  if (isMasterOverride) {
    btn.innerText = "Lock Form (Testing: ON)";
    btn.style.background = "#D93025";
    badge.style.display = 'flex';
  } else {
    btn.innerText = "Buka Lock Form (Testing: OFF)";
    btn.style.background = "#1A73E8";
    badge.style.display = 'none';
    cekAktifShift();
  }
}

function logoutAdmin() {
  currentAdminSession = null;
  isMasterOverride = false;
  document.getElementById('tabAdminBtn').style.display = 'none';
  document.getElementById('masterOverrideBox').style.display = 'none';
  document.getElementById('masterTestingBadge').style.display = 'none';
  switchTab('siswa', document.getElementById('tabSiswaBtn'));
}

function pilihHariAdmin(hari, el) {
  selectedAdminHari = hari;
  document.querySelectorAll('#view-admin .day-chip').forEach(c => c.classList.remove('active'));
  if(el) el.classList.add('active');
  document.getElementById('lblAdminDay').innerText = hari;
  if (hari === 'Jumat') {
    document.getElementById('shift2Zone').style.display = 'none';
  } else {
    document.getElementById('shift2Zone').style.display = 'flex';
  }
  renderAdminBoxes();
}

async function muatKelolaAdmin() {
  const { data } = await sb.from('members').select('*').order('nama', { ascending: true });
  if (data) {
    allMembers = data;
    renderAdminBoxes();
  }
}

function renderAdminBoxes() {
  const boxE = document.getElementById('boxFaseE');
  const boxF = document.getElementById('boxFaseF');
  const listS1 = document.getElementById('shift1List');
  const listS2 = document.getElementById('shift2List');

  if(!boxE || !boxF || !listS1 || !listS2) return;

  boxE.innerHTML = ''; boxF.innerHTML = ''; listS1.innerHTML = ''; listS2.innerHTML = '';
  let countE = 0, countF = 0, countS1 = 0, countS2 = 0;

  allMembers.forEach(m => {
    const card = document.createElement('div');
    card.className = 'draggable-card';
    card.setAttribute('draggable', 'true');
    card.dataset.memberId = m.id;

    card.addEventListener('dragstart', (e) => {
      activeDraggedMemberId = m.id;
      e.dataTransfer.setData("text/plain", m.id.toString());
      e.dataTransfer.effectAllowed = "move";
    });

    card.addEventListener('dragend', () => {
      document.querySelectorAll('.col-box').forEach(b => b.classList.remove('drag-over'));
    });

    const isShift2Avail = selectedAdminHari !== 'Jumat';
    card.innerHTML = `
      <div class="card-top">
        <span>${m.nama} <small style="color:#888;">(Fase ${m.fase})</small></span>
        <i class="fa-solid fa-trash delete-btn" onclick="hapusAnggota(${m.id}, '${m.nama}')"></i>
      </div>
      <select class="quick-move-select" onchange="quickPindahShift(${m.id}, this.value)">
        <option value="0" ${m.shift === 0 || m.hari !== selectedAdminHari ? 'selected' : ''}>Unassigned</option>
        <option value="1" ${m.shift === 1 && m.hari === selectedAdminHari ? 'selected' : ''}>Shift 1</option>
        ${isShift2Avail ? `<option value="2" ${m.shift === 2 && m.hari === selectedAdminHari ? 'selected' : ''}>Shift 2</option>` : ''}
      </select>
    `;

    if (m.hari === selectedAdminHari && m.shift === 1) {
      listS1.appendChild(card); countS1++;
    } else if (m.hari === selectedAdminHari && m.shift === 2 && isShift2Avail) {
      listS2.appendChild(card); countS2++;
    } else {
      if (m.fase === 'E') { boxE.appendChild(card); countE++; }
      else { boxF.appendChild(card); countF++; }
    }
  });

  document.getElementById('countE').innerText = countE;
  document.getElementById('countF').innerText = countF;
  document.getElementById('countS1').innerText = countS1;
  document.getElementById('countS2').innerText = countS2;

  attachBoxDragListeners();
}

function attachBoxDragListeners() {
  document.querySelectorAll('.col-box').forEach(box => {
    box.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      box.classList.add('drag-over');
    });
    box.addEventListener('dragenter', (e) => {
      e.preventDefault();
      box.classList.add('drag-over');
    });
    box.addEventListener('dragleave', (e) => {
      if (!box.contains(e.relatedTarget)) box.classList.remove('drag-over');
    });
    box.addEventListener('drop', async (e) => {
      e.preventDefault();
      box.classList.remove('drag-over');
      const memberIdStr = e.dataTransfer.getData("text/plain") || activeDraggedMemberId;
      if (!memberIdStr) return;

      const memberId = parseInt(memberIdStr);
      const targetShift = parseInt(box.dataset.targetShift);

      await sb.from('members').update({ hari: selectedAdminHari, shift: targetShift }).eq('id', memberId);
      activeDraggedMemberId = null;
      muatKelolaAdmin();
    });
  });
}

async function quickPindahShift(memberId, val) {
  const shiftNum = parseInt(val);
  await sb.from('members').update({ hari: selectedAdminHari, shift: shiftNum }).eq('id', memberId);
  muatKelolaAdmin();
}

const formTambah = document.getElementById('formTambahAnggota');
if(formTambah) {
  formTambah.onsubmit = async (e) => {
    e.preventDefault();
    const nama = document.getElementById('namaBaru').value;
    const fase = document.getElementById('faseBaru').value;
    await sb.from('members').insert([{ nama, fase, hari: selectedAdminHari, shift: 0 }]);
    document.getElementById('namaBaru').value = '';
    muatKelolaAdmin();
  };
}

async function hapusAnggota(id, nama) {
  if (confirm(`Hapus ${nama} dari sistem?`)) {
    await sb.from('members').delete().eq('id', id);
    muatKelolaAdmin();
  }
}
