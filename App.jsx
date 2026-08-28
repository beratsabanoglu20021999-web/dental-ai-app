import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// ─── DATA ────────────────────────────────────────────────────────────────────

const PATIENTS = [
  { id: 1, name: 'Anna Müller', phone: '+49 170 1234567', email: 'anna@email.de', lastTreatment: 'Diş çekimi', lastVisit: '27 Ağu', lang: 'DE', ybd: '€8.200', status: 'active', doctor: 'Schmidt', allergy: 'Penisilin', visits: 22 },
  { id: 2, name: 'Hans Weber', phone: '+49 160 9876543', email: 'hans@web.de', lastTreatment: 'Muayene', lastVisit: '25 Ağu', lang: 'DE', ybd: '€1.800', status: 'followup', doctor: 'Schmidt', allergy: null, visits: 8 },
  { id: 3, name: 'James Davies', phone: '+44 7700 123456', email: 'j.davies@uk.com', lastTreatment: 'İmplant', lastVisit: '20 Ağu', lang: 'EN', ybd: '€12.400', status: 'active', doctor: 'Müller', allergy: null, visits: 14 },
  { id: 4, name: 'Pieter van den Berg', phone: '+31 6 12345678', email: 'p.berg@nl.nl', lastTreatment: 'Kron', lastVisit: '15 Ağu', lang: 'NL', ybd: '€3.100', status: 'noshow', doctor: 'Schmidt', allergy: 'İbuprofen', visits: 6 },
  { id: 5, name: 'Sophie Klein', phone: '+49 151 5678901', email: 's.klein@mail.de', lastTreatment: 'Kanal', lastVisit: '10 Ağu', lang: 'DE', ybd: '€4.800', status: 'active', doctor: 'Müller', allergy: null, visits: 11 },
];

const APPOINTMENTS = [
  { time: '09:00', name: 'Anna Müller', treatment: 'Diş çekimi', duration: '60dk', doctor: 'Dr. Schmidt', sms: true, status: 'came' },
  { time: '10:20', name: 'Hans Weber', treatment: 'Muayene', duration: '20dk', doctor: 'Dr. Schmidt', sms: true, status: 'waiting' },
  { time: '11:00', name: 'Sophie Klein', treatment: 'Kanal tedavisi', duration: '90dk', doctor: 'Dr. Müller', sms: true, status: 'confirmed' },
  { time: '14:30', name: 'Klaus Bauer', treatment: 'Dolgu', duration: '60dk', doctor: 'Dr. Schmidt', sms: true, status: 'confirmed' },
  { time: '16:00', name: 'Emma Fischer', treatment: 'Diş temizliği', duration: '60dk', doctor: 'Dr. Müller', sms: true, status: 'noshow' },
];

const PLANS = [
  { name: 'Peter Hoffmann', treatment: 'İmplant + kanal', amount: '€3.200', sent: '20 Ağu', day: 7, progress: 70, status: 'followup7' },
  { name: 'Maria Schmidt', treatment: 'Zirkonyum kron', amount: '€1.800', sent: '24 Ağu', day: 3, progress: 40, status: 'followup3' },
  { name: 'Thomas Braun', treatment: 'Üst çene implant', amount: '€5.500', sent: '26 Ağu', day: 1, progress: 15, status: 'followup1' },
  { name: 'Lisa Wagner', treatment: 'Diş beyazlatma', amount: '€450', sent: '13 Ağu', day: 14, progress: 95, status: 'last' },
];

const SATISFACTION_DATA = [
  { month: 'Mar', score: 3.8 }, { month: 'Nis', score: 4.0 }, { month: 'May', score: 4.1 },
  { month: 'Haz', score: 4.3 }, { month: 'Tem', score: 4.2 }, { month: 'Ağu', score: 4.6 },
];

const REVENUE_DATA = [
  { month: 'Mar', gelir: 5800 }, { month: 'Nis', gelir: 6200 }, { month: 'May', gelir: 6900 },
  { month: 'Haz', gelir: 7100 }, { month: 'Tem', gelir: 7000 }, { month: 'Ağu', gelir: 8240 },
];

const LENA_DATA = [
  { name: 'Randevu', value: 38, color: '#3b82f6' },
  { name: 'Fiyat', value: 25, color: '#f59e0b' },
  { name: 'Bilgi', value: 20, color: '#22c55e' },
  { name: 'Acil', value: 7, color: '#ef4444' },
  { name: 'Diğer', value: 10, color: '#6b7280' },
];

const MORNING_APTS = [
  { time: '09:00', name: 'Anna Müller', treatment: 'Diş çekimi', note: 'PENİSİLİN ALERJİSİ', alert: true },
  { time: '10:20', name: 'Hans Weber', treatment: 'Muayene', note: 'İlk ziyaret', alert: false },
  { time: '11:00', name: 'Sophie Klein', treatment: 'Kanal 2. seans', note: '3 seanslık tedavi', alert: false },
  { time: '14:30', name: 'Klaus Bauer', treatment: 'Dolgu', note: 'Kronik ağrı şikayeti', alert: false },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const Badge = ({ type, children }) => <span className={`badge badge-${type}`}>{children}</span>;

const statusBadge = (s) => {
  const map = { active: ['success','Aktif'], followup: ['warning','Takipte'], noshow: ['danger','Gelmedi'], came: ['success','Geldi'], waiting: ['warning','Bekliyor'], confirmed: ['accent','Onaylı'], followup1: ['accent','G.1'], followup3: ['accent','G.3'], followup7: ['warning','G.7'], last: ['danger','G.14'] };
  const [t, l] = map[s] || ['gray', s];
  return <Badge type={t}>{l}</Badge>;
};

const Avatar = ({ name, size = 28, color = 'accent' }) => (
  <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.35, background: `var(--${color}-bg)`, borderColor: `var(--${color}-border)`, color: `var(--${color})` }}>
    {name?.split(' ').map(w => w[0]).slice(0, 2).join('')}
  </div>
);

const ProgressBar = ({ value }) => (
  <div className="progress"><div className="progress-fill" style={{ width: `${value}%` }} /></div>
);

// ─── PAGES ────────────────────────────────────────────────────────────────────

const Dashboard = ({ role }) => (
  <div>
    {role === 'doctor' && (
      <div className="morning-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <i className="ti ti-sun" style={{ fontSize: 18, color: 'var(--accent)' }} />
          <span style={{ fontWeight: 600, fontSize: 13 }}>Sabah Özeti — Dr. Schmidt</span>
          <Badge type="accent">27 Ağu</Badge>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
          {MORNING_APTS.map((a, i) => (
            <div key={i} style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 8, border: a.alert ? '1px solid var(--danger)' : '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 2 }}>{a.time}</div>
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>{a.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 4 }}>{a.treatment}</div>
              {a.alert ? <Badge type="danger"><i className="ti ti-alert-triangle" style={{ fontSize: 9 }} /> {a.note}</Badge> : <span style={{ fontSize: 10, color: 'var(--text3)' }}>{a.note}</span>}
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="stats-grid stats-4">
      <div className="stat"><div className="stat-label">Bugünkü hastalar</div><div className="stat-value">{role === 'doctor' ? '4' : '12'}</div><div className="stat-sub stat-up"><i className="ti ti-arrow-up" style={{ fontSize: 10 }} /> +3</div></div>
      {role !== 'reception' && <div className="stat"><div className="stat-label">Bu ay gelir</div><div className="stat-value">€8.240</div><div className="stat-sub stat-up"><i className="ti ti-arrow-up" style={{ fontSize: 10 }} /> +18%</div></div>}
      {role !== 'reception' && <div className="stat"><div className="stat-label">Bekleyen planlar</div><div className="stat-value">€47.000</div><div className="stat-sub stat-dn">8 karar bekliyor</div></div>}
      <div className="stat"><div className="stat-label">Google puanı</div><div className="stat-value">4.8 ★</div><div className="stat-sub stat-up">14 yorum</div></div>
    </div>

    <div className="grid-2">
      <div className="card">
        <div className="card-header"><div className="card-title">Bugünkü randevular</div><Badge type="accent">{role === 'doctor' ? '4' : '12'}</Badge></div>
        {APPOINTMENTS.slice(0, 4).map((a, i) => (
          <div key={i} className="row-item">
            <div style={{ fontSize: 10, color: 'var(--text3)', width: 36, flexShrink: 0 }}>{a.time}</div>
            <div className="row-info"><div className="row-name">{a.name}</div><div className="row-detail">{a.treatment} — {a.duration}</div></div>
            {statusBadge(a.status)}
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Otomasyon durumu</div></div>
        {[
          ['ti-mail','E-posta otomasyonu','success','Aktif'],
          ['ti-brand-whatsapp','WhatsApp Lena','warning','API bekleniyor'],
          ['ti-message','SMS hatırlatıcılar','warning','Twilio bekleniyor'],
          ['ti-phone','Voice AI (Lena)','warning','Vapi bağlanıyor'],
          ['ti-scan','Röntgen YZ analizi','success','Aktif'],
          ['ti-database','Google Sheets CRM','success','Aktif'],
        ].map(([icon, label, type, status]) => (
          <div key={label} className="row-item">
            <i className={`ti ${icon}`} style={{ fontSize: 13, color: `var(--${type === 'success' ? 'accent' : 'text2'})` }} />
            <div className="row-info"><div className="row-name">{label}</div></div>
            <Badge type={type}>{status}</Badge>
          </div>
        ))}
      </div>
    </div>

    {role !== 'reception' && (
      <div className="grid-2">
        <div className="card">
          <div className="card-header"><div className="card-title">Bekleyen tedavi planları</div><Badge type="warning">8 plan</Badge></div>
          {PLANS.slice(0, 3).map((p, i) => (
            <div key={i} className="row-item">
              <div className="row-info">
                <div className="row-name">{p.name}</div>
                <div className="row-detail">{p.treatment} — Gün {p.day}</div>
                <ProgressBar value={p.progress} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', flexShrink: 0 }}>{p.amount}</div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Son bildirimler</div><Badge type="danger">4 yeni</Badge></div>
          {[
            ['ti-phone-incoming','danger','Acil — Sophie Klein','5 dk önce'],
            ['ti-check','success','Plan kabul — Peter Hoffmann €3.200','23 dk önce'],
            ['ti-calendar-x','warning','Gelmedi — Emma Fischer 16:00','1 saat önce'],
            ['ti-brand-whatsapp','accent','Yeni randevu — Hans Weber Cuma','2 saat önce'],
          ].map(([icon, color, title, time]) => (
            <div key={title} className="row-item">
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: `var(--${color}-bg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className={`ti ${icon}`} style={{ fontSize: 12, color: `var(--${color})` }} />
              </div>
              <div className="row-info"><div className="row-name">{title}</div><div className="row-detail">{time}</div></div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

const Patients = ({ role, onProfile }) => (
  <div>
    <div className="card">
      <div className="card-header">
        <div className="card-title">{role === 'doctor' ? 'Hastalarım — Dr. Schmidt' : 'Hasta listesi'}</div>
        <div style={{ display: 'flex', gap: 6 }}>
          <input placeholder="Ara..." className="form-input" style={{ width: 140, padding: '4px 8px' }} />
          <button className="btn btn-primary btn-sm"><i className="ti ti-plus" /> Ekle</button>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: '25%' }}>Hasta</th>
              <th style={{ width: '17%' }}>Telefon</th>
              <th style={{ width: '14%' }}>Son tedavi</th>
              <th style={{ width: '11%' }}>Son ziyaret</th>
              <th style={{ width: '7%' }}>Dil</th>
              {role !== 'reception' && <th style={{ width: '9%' }}>YBD</th>}
              <th style={{ width: '9%' }}>Durum</th>
              <th style={{ width: '8%' }}></th>
            </tr>
          </thead>
          <tbody>
            {PATIENTS.filter(p => role !== 'doctor' || p.doctor === 'Schmidt').map(p => (
              <tr key={p.id}>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Avatar name={p.name} size={24} />
                  {p.name}
                  {p.allergy && <i className="ti ti-alert-triangle" style={{ fontSize: 11, color: 'var(--danger)' }} title={`Alerji: ${p.allergy}`} />}
                </div></td>
                <td>{p.phone}</td>
                <td>{p.lastTreatment}</td>
                <td>{p.lastVisit}</td>
                <td><Badge type="accent">{p.lang}</Badge></td>
                {role !== 'reception' && <td style={{ fontWeight: 600, color: 'var(--accent)' }}>{p.ybd}</td>}
                <td>{statusBadge(p.status)}</td>
                <td><button className="btn btn-sm" onClick={() => onProfile(p)}>Profil</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const PatientProfile = ({ patient, onBack }) => {
  const [selectedTreat, setSelectedTreat] = useState(null);
  const [sent, setSent] = useState(false);

  return (
    <div>
      <button className="btn btn-sm" onClick={onBack} style={{ marginBottom: 12 }}><i className="ti ti-arrow-left" /> Geri</button>
      <div className="profile-grid">
        <div>
          <div className="card" style={{ textAlign: 'center' }}>
            <Avatar name={patient.name} size={54} />
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 8 }}>{patient.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>Hasta — {patient.visits} ziyaret</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 8 }}>
              <Badge type="success">Aktif</Badge>
              <Badge type="accent">{patient.lang}</Badge>
              {patient.ybd && parseInt(patient.ybd.replace('€','').replace('.','')) > 5000 && <Badge type="pro">VIP</Badge>}
            </div>
            {patient.allergy && (
              <div className="allergy-alert" style={{ marginTop: 12 }}>
                <i className="ti ti-alert-triangle" /> Alerji: {patient.allergy}
              </div>
            )}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 10, textAlign: 'left' }}>
              {[['Telefon', patient.phone], ['E-posta', patient.email], ['Doktor', `Dr. ${patient.doctor}`], ['Ziyaret', patient.visits]].map(([k, v]) => (
                <div key={k} className="row-item" style={{ padding: '4px 0' }}>
                  <div style={{ fontSize: 10, color: 'var(--text3)', width: 70 }}>{k}</div>
                  <div style={{ fontSize: 11 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: 10 }}>Hızlı tedavi seç</div>
            <div className="quick-treat">
              {['Çekim','Dolgu','Kanal','İmplant','Kron','Temizlik'].map(t => (
                <div key={t} className={`qt-btn ${selectedTreat === t ? 'selected' : ''}`} onClick={() => { setSelectedTreat(t); setSent(false); }}>
                  <i className="ti ti-tooth" style={{ fontSize: 16, display: 'block', marginBottom: 2 }} />
                  {t}
                </div>
              ))}
            </div>
            {selectedTreat && (
              <div style={{ marginTop: 10 }}>
                {sent
                  ? <div style={{ background: 'var(--success-bg)', color: 'var(--success)', borderRadius: 'var(--radius)', padding: '8px 12px', fontSize: 11, textAlign: 'center' }}>
                      <i className="ti ti-check" /> {selectedTreat} bakım talimatı {patient.name}'e WhatsApp ile gönderildi
                    </div>
                  : <button className="btn btn-success" style={{ width: '100%', justifyContent: 'center', marginTop: 6 }} onClick={() => setSent(true)}>
                      <i className="ti ti-send" /> Bakım talimatı gönder
                    </button>
                }
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: 10 }}>Hasta portali</div>
            <div className="qr-display" style={{ marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 32, marginBottom: 4 }}>▓▒░▓▒</div>
                <div style={{ fontSize: 9, color: '#666' }}>QR Kod</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text2)', textAlign: 'center', marginBottom: 8 }}>
              Hasta bu QR kodu tarayarak kendi tedavi geçmişini ve faturalarını görebilir.
            </div>
            <button className="btn" style={{ width: '100%', justifyContent: 'center' }}><i className="ti ti-download" /> QR İndir</button>
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="card-header">
              <div className="card-title">Diş haritası</div>
              <div style={{ display: 'flex', gap: 8, fontSize: 10, color: 'var(--text2)' }}>
                {[['Sağlıklı','success'],['Dolgu','warning'],['Kanal','danger'],['Kron','pro']].map(([l,c]) => (
                  <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: `var(--${c}-bg)`, border: `1px solid var(--${c})`, display: 'inline-block' }} />
                    {l}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4, paddingLeft: 8 }}>Üst çene</div>
            <div className="tooth-map">
              {[{n:'18',s:'healthy'},{n:'17',s:'healthy'},{n:'16',s:'filling'},{n:'15',s:'filling'},{n:'14',s:'healthy'},{n:'13',s:'healthy'},{n:'12',s:'healthy'},{n:'11',s:'healthy'}].map(t => (
                <div key={t.n} className={`tooth ${t.s}`} title={t.n}><span className="tooth-num">{t.n}</span><span className="tooth-ico">🦷</span></div>
              ))}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text3)', margin: '6px 0 4px', paddingLeft: 8 }}>Alt çene</div>
            <div className="tooth-map">
              {[{n:'48',s:'missing'},{n:'47',s:'healthy'},{n:'46',s:'healthy'},{n:'36',s:'canal'},{n:'35',s:'crown'},{n:'34',s:'healthy'},{n:'33',s:'healthy'},{n:'32',s:'healthy'}].map(t => (
                <div key={t.n} className={`tooth ${t.s}`} title={t.n}><span className="tooth-num">{t.n}</span><span className="tooth-ico">{t.s === 'missing' ? '○' : '🦷'}</span></div>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginBottom: 12 }}>
            <div className="card-header"><div className="card-title">Tedavi notu</div></div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 6 }}>27 Ağu 2026 — Dr. Schmidt</div>
            <textarea className="form-input" defaultValue="27 Ağu: Alt sol 36 nolu dişe kanal tedavisi uygulandı. Hasta prosedürü iyi tolere etti. Ağrı giderek azalıyor. 2 hafta sonra kontrol randevusu planlandı. Penisilin alerjisi nedeniyle Klindamisin yazıldı." />
            <button className="btn btn-primary btn-sm" style={{ marginTop: 8 }}><i className="ti ti-device-floppy" /> Notu kaydet</button>
          </div>

          <div className="card" style={{ marginBottom: 12 }}>
            <div className="card-header"><div className="card-title">Reçete / İlaç takibi</div><button className="btn btn-primary btn-sm"><i className="ti ti-plus" /> Ekle</button></div>
            {[
              { name: 'Klindamisin 300mg', detail: '3x1, 5 gün — 27 Ağu 2026', status: 'warning' },
              { name: 'İbuprofen 400mg', detail: '2x1 (ağrıya göre) — 27 Ağu 2026', status: 'success' },
            ].map(r => (
              <div key={r.name} className="rx-row">
                <i className="ti ti-pill" style={{ fontSize: 15, color: `var(--${r.status})` }} />
                <div className="row-info"><div className="row-name">{r.name}</div><div className="row-detail">{r.detail}</div></div>
                <Badge type={r.status}>{r.status === 'warning' ? 'Aktif' : 'Bitti'}</Badge>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginBottom: 12 }}>
            <div className="card-header"><div className="card-title">Önce / Sonra fotoğraflar</div><button className="btn btn-sm"><i className="ti ti-upload" /> Yükle</button></div>
            <div className="before-after">
              <div>
                <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4, textAlign: 'center' }}>Önce</div>
                <div className="photo-slot"><i className="ti ti-camera" style={{ fontSize: 22 }} /><span>Fotoğraf yükle</span></div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4, textAlign: 'center' }}>Sonra</div>
                <div className="photo-slot"><i className="ti ti-camera" style={{ fontSize: 22 }} /><span>Fotoğraf yükle</span></div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title">Tedavi geçmişi</div><button className="btn btn-primary btn-sm"><i className="ti ti-plus" /> Ekle</button></div>
            {[
              { title: 'Diş çekimi — Alt sol 36', detail: 'Dr. Schmidt • €180', date: '27 Ağu 2026' },
              { title: 'Dolgu — Üst sağ 15, 16', detail: 'Dr. Schmidt • €320', date: '12 May 2026' },
              { title: 'Kanal tedavisi — 36 (3 seans)', detail: 'Dr. Schmidt • €650', date: 'Jan–Mar 2026' },
              { title: 'Diş temizliği + kontrol', detail: 'Dr. Schmidt • €120', date: 'Ağu 2025' },
            ].map((item, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-info">
                  <div className="timeline-title">{item.title}</div>
                  <div className="timeline-detail">{item.detail}</div>
                  <div className="timeline-date">{item.date}</div>
                </div>
                <Badge type="success">Bitti</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Calendar = () => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button className="btn btn-icon"><i className="ti ti-chevron-left" /></button>
        <span style={{ fontSize: 13, fontWeight: 600 }}>27 Ağu — 1 Eyl 2026</span>
        <button className="btn btn-icon"><i className="ti ti-chevron-right" /></button>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button className="btn btn-sm">Günlük</button>
        <button className="btn btn-primary btn-sm">Haftalık</button>
        <button className="btn btn-sm">Aylık</button>
      </div>
    </div>
    <div className="cal-grid">
      <div className="cal-header" />
      {['Pzt 27','Sal 28','Çar 29','Per 30','Cum 31','Cmt 1'].map(d => <div key={d} className="cal-header">{d}</div>)}
      <div className="cal-time">09:00</div>
      <div className="cal-cell"><div className="apt-block apt-green">Anna M. — Çekim</div></div>
      <div className="cal-cell"><div className="apt-block apt-blue">Klaus B. — Dolgu</div></div>
      <div className="cal-cell" />
      <div className="cal-cell"><div className="apt-block apt-blue">Lisa W. — Kontrol</div></div>
      <div className="cal-cell" />
      <div className="cal-cell"><div className="apt-block apt-orange">Maria K. — Muayene</div></div>
      <div className="cal-time">10:00</div>
      <div className="cal-cell"><div className="apt-block apt-orange">Hans W. — Muayene</div></div>
      <div className="cal-cell" />
      <div className="cal-cell"><div className="apt-block apt-blue">Peter H. — İmplant</div></div>
      <div className="cal-cell" />
      <div className="cal-cell"><div className="apt-block apt-blue">James D. — Kontrol</div></div>
      <div className="cal-cell"><div className="apt-block apt-blue">Thomas B. — Dolgu</div></div>
      <div className="cal-time">11:00</div>
      <div className="cal-cell"><div className="apt-block apt-blue">Sophie K. — Kanal</div></div>
      <div className="cal-cell"><div className="apt-block apt-blue">Emma F. — Beyazlatma</div></div>
      <div className="cal-cell"><div className="apt-block apt-blue">Sophie K. — Kanal 2</div></div>
      <div className="cal-cell"><div className="apt-block apt-blue">Hans W. — Dolgu</div></div>
      <div className="cal-cell" />
      <div className="cal-cell" />
      <div className="cal-time">14:00</div>
      <div className="cal-cell"><div className="apt-block apt-blue">Klaus B. — Kron</div></div>
      <div className="cal-cell" />
      <div className="cal-cell"><div className="apt-block apt-blue">Pieter V. — Kontrol</div></div>
      <div className="cal-cell"><div className="apt-block apt-blue">Anna M. — Kontrol</div></div>
      <div className="cal-cell"><div className="apt-block apt-blue">Maria S. — Kron</div></div>
      <div className="cal-cell" />
      <div className="cal-time">16:00</div>
      <div className="cal-cell"><div className="apt-block apt-red">Emma F. — GELMEDİ</div></div>
      <div className="cal-cell" /><div className="cal-cell" /><div className="cal-cell" /><div className="cal-cell" /><div className="cal-cell" />
    </div>
    <div style={{ display: 'flex', gap: 14, fontSize: 10, color: 'var(--text2)' }}>
      {[['success','Tamamlandı'],['accent','Onaylı'],['warning','Bekliyor'],['danger','Gelmedi']].map(([c,l]) => (
        <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 9, height: 9, borderRadius: 2, background: `var(--${c}-bg)`, display: 'inline-block' }} />{l}
        </span>
      ))}
    </div>
  </div>
);

const Appointments = ({ role }) => (
  <div>
    <div className="stats-grid stats-3">
      <div className="stat"><div className="stat-label">Bugün</div><div className="stat-value">{role === 'doctor' ? '4' : '12'}</div></div>
      <div className="stat"><div className="stat-label">Bu hafta</div><div className="stat-value">{role === 'doctor' ? '18' : '47'}</div></div>
      <div className="stat"><div className="stat-label">Gelmeme oranı</div><div className="stat-value">8%</div><div className="stat-sub stat-up">Geçen ay 14%</div></div>
    </div>
    <div className="card">
      <div className="card-header"><div className="card-title">Randevular — 27 Ağu</div><button className="btn btn-primary btn-sm"><i className="ti ti-plus" /> Ekle</button></div>
      <div className="table-wrap">
        <table>
          <thead><tr>
            <th style={{ width: '8%' }}>Saat</th>
            <th style={{ width: '20%' }}>Hasta</th>
            <th style={{ width: '18%' }}>Tedavi</th>
            <th style={{ width: '8%' }}>Süre</th>
            <th style={{ width: '12%' }}>Doktor</th>
            <th style={{ width: '10%' }}>SMS</th>
            <th style={{ width: '10%' }}>Durum</th>
            <th style={{ width: '14%' }}></th>
          </tr></thead>
          <tbody>
            {APPOINTMENTS.map((a, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{a.time}</td>
                <td>{a.name}</td>
                <td>{a.treatment}</td>
                <td>{a.duration}</td>
                <td>{a.doctor}</td>
                <td><Badge type="success"><i className="ti ti-check" style={{ fontSize: 9 }} /> Gönderildi</Badge></td>
                <td>{statusBadge(a.status)}</td>
                <td>
                  {a.status === 'noshow'
                    ? <button className="btn btn-sm" style={{ color: 'var(--accent)' }}><i className="ti ti-brand-whatsapp" /> WA gönder</button>
                    : <button className="btn btn-sm">Detay</button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const Plans = () => (
  <div>
    <div className="stats-grid stats-4">
      <div className="stat"><div className="stat-label">Bekleyen</div><div className="stat-value">8</div></div>
      <div className="stat"><div className="stat-label">Toplam değer</div><div className="stat-value">€47.000</div></div>
      <div className="stat"><div className="stat-label">Bu ay kabul</div><div className="stat-value">€18.200</div><div className="stat-sub stat-up">5 plan</div></div>
      <div className="stat"><div className="stat-label">Kabul oranı</div><div className="stat-value">62%</div><div className="stat-sub stat-up">+14%</div></div>
    </div>
    <div className="card">
      <div className="card-header"><div className="card-title">Tedavi kabul takibi</div><button className="btn btn-primary btn-sm"><i className="ti ti-plus" /> Yeni plan</button></div>
      <div className="table-wrap">
        <table>
          <thead><tr>
            <th style={{ width: '18%' }}>Hasta</th>
            <th style={{ width: '22%' }}>Tedavi</th>
            <th style={{ width: '10%' }}>Tutar</th>
            <th style={{ width: '10%' }}>Gönderilme</th>
            <th style={{ width: '8%' }}>Gün</th>
            <th style={{ width: '15%' }}>İlerleme</th>
            <th style={{ width: '17%' }}>Durum</th>
          </tr></thead>
          <tbody>
            {PLANS.map((p, i) => (
              <tr key={i}>
                <td>{p.name}</td>
                <td>{p.treatment}</td>
                <td style={{ fontWeight: 600, color: 'var(--accent)' }}>{p.amount}</td>
                <td>{p.sent}</td>
                <td>{p.day}</td>
                <td><ProgressBar value={p.progress} /></td>
                <td>{statusBadge(p.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const Xray = () => (
  <div>
    <div className="card">
      <div className="card-header"><div className="card-title">Röntgen YZ analizi</div><button className="btn btn-primary btn-sm"><i className="ti ti-upload" /> Röntgen yükle</button></div>
      <div className="grid-3">
        {[
          { name: 'Anna Müller', date: '27 Ağu — Üst çene', condition: 'Dolgu', cost: '€300-500', status: 'warning' },
          { name: 'Peter Hoffmann', date: '20 Ağu — Alt çene', condition: 'Kanal', cost: '€800-1200', status: 'danger' },
          { name: 'James Davies', date: '15 Ağu — Panoramik', condition: 'Normal', cost: 'Kontrol önerilir', status: 'success' },
        ].map(x => (
          <div key={x.name} style={{ background: 'var(--surface2)', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <div style={{ height: 110, background: 'var(--surface3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, color: 'var(--text3)' }}>
              <i className="ti ti-scan" />
            </div>
            <div style={{ padding: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 500 }}>{x.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 6 }}>{x.date}</div>
              <div style={{ display: 'flex', gap: 5 }}>
                <Badge type={x.status}>{x.condition}</Badge>
                <Badge type="accent">{x.cost}</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const WhatsApp = () => {
  const [messages, setMessages] = useState([
    { from: 'patient', name: 'Anna Müller', text: 'Yarın randevumu iptal edebilir miyim?', time: '14:32', status: 'replied' },
    { from: 'lena', text: 'Tabii ki, yeni bir tarih önerebilir miyim? En yakın müsait tarihimiz 30 Ağustos Pazar saat 10:00.', time: '14:32' },
    { from: 'patient', name: 'Sophie Klein', text: 'Dişim çok ağrıyor, acil randevu alabilir miyim?', time: '11:47', status: 'emergency' },
    { from: 'lena', text: 'ACİL: Lütfen hemen +49 30 1234567 numaralı acil hattımızı arayın.', time: '11:47', emergency: true },
    { from: 'patient', name: 'Hans Weber', text: 'İmplant için fiyat bilgisi alabilir miyim?', time: '13:15', status: 'replied' },
    { from: 'lena', text: 'İmplant tedavisi €1.500\'den başlamaktadır. Kesin fiyat muayene sonrası belirlenir. Randevu almak ister misiniz?', time: '13:15' },
  ]);

  const [doctorReply, setDoctorReply] = useState('');
  const [showBridge, setShowBridge] = useState(false);

  return (
    <div>
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-header">
          <div className="card-title">WhatsApp — Lena</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <Badge type="warning">API bağlantısı bekleniyor</Badge>
            <button className="btn btn-sm btn-primary" onClick={() => setShowBridge(!showBridge)}>
              <i className="ti ti-messages" /> Canlı köprü {showBridge ? 'kapat' : 'aç'}
            </button>
          </div>
        </div>
        <div style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning)', borderRadius: 'var(--radius)', padding: '7px 10px', marginBottom: 12, fontSize: 11, color: 'var(--warning)' }}>
          <i className="ti ti-alert-triangle" style={{ fontSize: 11, marginRight: 4 }} />
          Meta Business API tokeni alındığında canlı mesajlar burada görünecek.
        </div>
        <div style={{ maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 0, padding: '0 4px' }}>
          {messages.map((m, i) => (
            <div key={i}>
              {m.from === 'patient' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, marginTop: i > 0 ? 12 : 0 }}>
                  <Avatar name={m.name} size={20} />
                  <span style={{ fontSize: 11, fontWeight: 500 }}>{m.name}</span>
                  <span style={{ fontSize: 10, color: 'var(--text3)' }}>{m.time}</span>
                  {m.status === 'emergency' && <Badge type="danger">ACİL</Badge>}
                </div>
              )}
              <div className={`chat-bubble ${m.from === 'patient' ? 'chat-patient' : m.emergency ? 'chat-doctor' : 'chat-lena'}`}>
                {m.from !== 'patient' && <div style={{ fontSize: 9, fontWeight: 600, marginBottom: 3, opacity: 0.7 }}>{m.from === 'lena' ? 'Lena (YZ)' : 'Dr. Schmidt'}</div>}
                {m.text}
              </div>
            </div>
          ))}
        </div>
        {showBridge && (
          <div style={{ marginTop: 12, padding: 12, background: 'var(--surface2)', borderRadius: 'var(--radius)', border: '1px solid var(--accent-border)' }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent)', marginBottom: 8 }}>
              <i className="ti ti-stethoscope" /> Doktor cevap köprüsü — mesajınız WhatsApp üzerinden hastaya iletilecek
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="form-input" placeholder="Hastaya mesaj yaz..." value={doctorReply} onChange={e => setDoctorReply(e.target.value)} style={{ flex: 1 }} />
              <button className="btn btn-success" onClick={() => {
                if (doctorReply.trim()) {
                  setMessages(prev => [...prev, { from: 'doctor', text: doctorReply, time: 'Şimdi' }]);
                  setDoctorReply('');
                }
              }}><i className="ti ti-send" /> Gönder</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Calls = () => (
  <div>
    <div className="stats-grid stats-3">
      <div className="stat"><div className="stat-label">Bugünkü aramalar</div><div className="stat-value">7</div><div className="stat-sub">Lena karşıladı</div></div>
      <div className="stat"><div className="stat-label">Randevu alındı</div><div className="stat-value">3</div></div>
      <div className="stat"><div className="stat-label">Ort. süre</div><div className="stat-value">2:34</div></div>
    </div>
    <div className="card">
      <div className="card-header"><div className="card-title">Arama kaydı — Voice AI Lena</div><Badge type="warning">Vapi bekleniyor</Badge></div>
      <div className="table-wrap">
        <table>
          <thead><tr>
            <th style={{ width: '18%' }}>Numara</th>
            <th style={{ width: '30%' }}>Özet</th>
            <th style={{ width: '8%' }}>Süre</th>
            <th style={{ width: '10%' }}>Saat</th>
            <th style={{ width: '14%' }}>Randevu</th>
            <th style={{ width: '20%' }}>Durum</th>
          </tr></thead>
          <tbody>
            <tr><td>+49 170 9876</td><td style={{ color: 'var(--text2)' }}>Diş temizliği, Cuma istedi</td><td>2:15</td><td>09:23</td><td style={{ fontWeight: 600, color: 'var(--accent)' }}>Evet</td><td><Badge type="success">Randevu alındı</Badge></td></tr>
            <tr><td>+49 151 3456</td><td style={{ color: 'var(--text2)' }}>İmplant fiyatı sordu</td><td>1:48</td><td>11:05</td><td style={{ color: 'var(--text2)' }}>Hayır</td><td><Badge type="accent">Bilgi verildi</Badge></td></tr>
            <tr><td>+49 160 2345</td><td style={{ color: 'var(--text2)' }}>Cevap vermedi</td><td>—</td><td>13:42</td><td style={{ color: 'var(--text2)' }}>—</td><td><Badge type="warning">WA gönderildi</Badge></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const Satisfaction = () => (
  <div>
    <div className="stats-grid stats-4">
      <div className="stat"><div className="stat-label">Bu ay ort.</div><div className="stat-value">4.6 ★</div><div className="stat-sub stat-up">Geçen ay 4.2</div></div>
      <div className="stat"><div className="stat-label">Anket gönderildi</div><div className="stat-value">38</div></div>
      <div className="stat"><div className="stat-label">Yanıt oranı</div><div className="stat-value">71%</div></div>
      <div className="stat"><div className="stat-label">5 yıldız</div><div className="stat-value">64%</div></div>
    </div>
    <div className="grid-2">
      <div className="card">
        <div className="card-header"><div className="card-title">Aylık memnuniyet trendi</div></div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={SATISFACTION_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text3)' }} />
            <YAxis domain={[3, 5]} tick={{ fontSize: 10, fill: 'var(--text3)' }} />
            <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 8, fontSize: 11 }} />
            <Line type="monotone" dataKey="score" stroke="var(--accent)" strokeWidth={2} dot={{ r: 4, fill: 'var(--accent)' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Son anket sonuçları</div></div>
        {[['Anna Müller','Diş çekimi',5,'success'],['Hans Weber','Muayene',4,'warning'],['James Davies','İmplant',5,'success'],['Sophie Klein','Kanal',3,'danger']].map(([n,t,s,c]) => (
          <div key={n} className="row-item">
            <div className="row-info"><div className="row-name">{n}</div><div className="row-detail">{t}</div></div>
            <span style={{ fontSize: 14, fontWeight: 600, color: `var(--${c})` }}>{s} ★</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Lena = () => (
  <div>
    <div className="stats-grid stats-4">
      <div className="stat"><div className="stat-label">Bu ay mesaj</div><div className="stat-value">342</div><div className="stat-sub stat-up">+24%</div></div>
      <div className="stat"><div className="stat-label">Doğru yanıt</div><div className="stat-value">94%</div></div>
      <div className="stat"><div className="stat-label">Randevu aldı</div><div className="stat-value">47</div></div>
      <div className="stat"><div className="stat-label">Acil yönlendirme</div><div className="stat-value">8</div></div>
    </div>
    <div className="grid-2">
      <div className="card">
        <div className="card-header"><div className="card-title">Mesaj kategorileri</div></div>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={LENA_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value">
              {LENA_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 8, fontSize: 11 }} />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Performans özeti</div></div>
        {[['Randevu sorguları','130','accent'],['Fiyat soruları','86','accent'],['Genel bilgi','68','accent'],['Acil yönlendirme','8','danger'],['İnsan müdahalesi','20','warning']].map(([l,v,c]) => (
          <div key={l} className="row-item">
            <div className="row-info"><div className="row-name">{l}</div></div>
            <span style={{ fontSize: 13, fontWeight: 600, color: `var(--${c})` }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const VideoLibrary = () => (
  <div>
    <div className="card">
      <div className="card-header"><div className="card-title">Tedavi video kütüphanesi</div><button className="btn btn-primary btn-sm"><i className="ti ti-upload" /> Video ekle</button></div>
      <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 12 }}>Lena tedavi sonrası ilgili videoyu otomatik WhatsApp ile gönderir.</div>
      <div className="grid-3">
        {[
          { emoji: '🦷', title: 'Diş çekimi sonrası bakım', dur: '2:34', views: 142 },
          { emoji: '🔧', title: 'Kanal tedavisi nedir?', dur: '3:15', views: 89 },
          { emoji: '⚙️', title: 'İmplant süreci', dur: '4:02', views: 234 },
          { emoji: '💎', title: 'Zirkonyum kron bakımı', dur: '1:58', views: 67 },
          { emoji: '✨', title: 'Diş beyazlatma rehberi', dur: '2:20', views: 156 },
          { emoji: '🧼', title: 'Günlük diş bakımı', dur: '1:45', views: 312 },
        ].map(v => (
          <div key={v.title} className="video-card">
            <div className="video-thumb">
              <span>{v.emoji}</span>
              <div className="video-play"><i className="ti ti-player-play" /></div>
            </div>
            <div className="video-info">
              <div style={{ fontSize: 11, fontWeight: 500, marginBottom: 4 }}>{v.title}</div>
              <div style={{ display: 'flex', gap: 8, fontSize: 10, color: 'var(--text3)' }}>
                <span><i className="ti ti-clock" /> {v.dur}</span>
                <span><i className="ti ti-eye" /> {v.views}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const LifetimeValue = () => (
  <div>
    <div className="stats-grid stats-3">
      <div className="stat"><div className="stat-label">Ort. YBD</div><div className="stat-value">€3.840</div><div className="stat-sub stat-up">+12%</div></div>
      <div className="stat"><div className="stat-label">En değerli</div><div className="stat-value">€12.400</div><div className="stat-sub">James Davies</div></div>
      <div className="stat"><div className="stat-label">Tekrar ziyaret</div><div className="stat-value">68%</div></div>
    </div>
    <div className="card">
      <div className="card-header"><div className="card-title">Hasta yaşam boyu değeri</div></div>
      <div className="table-wrap">
        <table>
          <thead><tr>
            <th style={{ width: '22%' }}>Hasta</th>
            <th style={{ width: '12%' }}>İlk ziyaret</th>
            <th style={{ width: '12%' }}>Ziyaret</th>
            <th style={{ width: '18%' }}>Toplam</th>
            <th style={{ width: '18%' }}>Son 12 ay</th>
            <th style={{ width: '18%' }}>Kategori</th>
          </tr></thead>
          <tbody>
            <tr><td>James Davies</td><td>Mar 2023</td><td>14</td><td style={{ fontWeight: 600, color: 'var(--accent)' }}>€12.400</td><td style={{ fontWeight: 500 }}>€6.500</td><td><Badge type="pro">VIP hasta</Badge></td></tr>
            <tr><td>Anna Müller</td><td>Haz 2022</td><td>22</td><td style={{ fontWeight: 600, color: 'var(--accent)' }}>€8.200</td><td style={{ fontWeight: 500 }}>€4.200</td><td><Badge type="accent">Düzenli hasta</Badge></td></tr>
            <tr><td>Sophie Klein</td><td>Mar 2024</td><td>11</td><td style={{ fontWeight: 600, color: 'var(--accent)' }}>€4.800</td><td style={{ fontWeight: 500 }}>€2.900</td><td><Badge type="warning">Gelişen</Badge></td></tr>
            <tr><td>Peter Hoffmann</td><td>Oca 2024</td><td>6</td><td style={{ fontWeight: 600, color: 'var(--accent)' }}>€3.200</td><td style={{ fontWeight: 500 }}>€3.200</td><td><Badge type="warning">Gelişen</Badge></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const Report = () => (
  <div>
    <div className="stats-grid stats-4">
      <div className="stat"><div className="stat-label">Toplam gelir</div><div className="stat-value">€8.240</div><div className="stat-sub stat-up">+18%</div></div>
      <div className="stat"><div className="stat-label">Yeni hastalar</div><div className="stat-value">14</div><div className="stat-sub stat-up">+3</div></div>
      <div className="stat"><div className="stat-label">Gelmeme oranı</div><div className="stat-value">8%</div><div className="stat-sub stat-up">-6%</div></div>
      <div className="stat"><div className="stat-label">En çok tedavi</div><div className="stat-value">Dolgu</div><div className="stat-sub">34 işlem</div></div>
    </div>
    <div className="grid-2">
      <div className="card">
        <div className="card-header"><div className="card-title">Aylık gelir trendi</div><button className="btn btn-sm"><i className="ti ti-download" /> PDF</button></div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={REVENUE_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text3)' }} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--text3)' }} />
            <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 8, fontSize: 11 }} formatter={v => [`€${v.toLocaleString()}`, 'Gelir']} />
            <Bar dataKey="gelir" fill="var(--accent)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Tedavi dağılımı</div></div>
        {[['Dolgu', 68, 34], ['Diş çekimi', 44, 22], ['Kanal', 28, 14], ['İmplant', 18, 9], ['Kron/Veneer', 12, 6]].map(([n, p, c]) => (
          <div key={n} className="row-item">
            <div className="row-info"><div className="row-name">{n}</div><ProgressBar value={p} /></div>
            <div style={{ fontSize: 11, fontWeight: 500, width: 20, flexShrink: 0 }}>{c}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Reminder = () => (
  <div>
    <div className="card">
      <div className="card-header"><div className="card-title">Otomatik mesaj takvimi — önümüzdeki 7 gün</div></div>
      <div className="table-wrap">
        <table>
          <thead><tr>
            <th style={{ width: '10%' }}>Tarih</th>
            <th style={{ width: '18%' }}>Hasta</th>
            <th style={{ width: '18%' }}>Tür</th>
            <th style={{ width: '10%' }}>Kanal</th>
            <th style={{ width: '30%' }}>İçerik</th>
            <th style={{ width: '14%' }}>Durum</th>
          </tr></thead>
          <tbody>
            {[
              ['Bugün','Anna Müller','Randevu hatırlatıcı','SMS','Yarın 09:00 randevunuz var','success'],
              ['Yarın','Hans Weber','6 ay geri çağırma','SMS','6 aylık kontrol zamanı','accent'],
              ['30 Ağu','Emma Fischer','Doğum günü','WhatsApp','Doğum günü kutlaması','accent'],
              ['31 Ağu','Peter Hoffmann','Tedavi planı takip','WhatsApp','İmplant — Gün 11 takip','accent'],
              ['2 Eyl','Lisa Wagner','Ödeme hatırlatıcı','SMS','€450 taksit, 5 Eyl vadeli','accent'],
              ['3 Eyl','Sophie Klein','Memnuniyet anketi','WhatsApp','1-5 yıldız derecelendirme','accent'],
            ].map(([d, n, t, c, ic, s]) => (
              <tr key={n + d}>
                <td style={{ fontWeight: 500 }}>{d}</td>
                <td>{n}</td>
                <td>{t}</td>
                <td><Badge type={c === 'SMS' ? 'accent' : 'success'}>{c}</Badge></td>
                <td style={{ color: 'var(--text2)' }}>{ic}</td>
                <td>{statusBadge(s)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const Referral = () => (
  <div>
    <div className="stats-grid stats-3">
      <div className="stat"><div className="stat-label">Bu ay referral</div><div className="stat-value">8</div><div className="stat-sub stat-up">yeni hasta</div></div>
      <div className="stat"><div className="stat-label">Referral geliri</div><div className="stat-value">€3.200</div></div>
      <div className="stat"><div className="stat-label">En çok referral</div><div className="stat-value">Anna M.</div><div className="stat-sub">3 kişi</div></div>
    </div>
    <div className="card">
      <div className="card-header"><div className="card-title">Referral takibi</div></div>
      <div className="table-wrap">
        <table>
          <thead><tr>
            <th style={{ width: '20%' }}>Veren</th>
            <th style={{ width: '20%' }}>Gelen hasta</th>
            <th style={{ width: '12%' }}>Tarih</th>
            <th style={{ width: '18%' }}>Tedavi</th>
            <th style={{ width: '14%' }}>Gelir</th>
            <th style={{ width: '16%' }}>Durum</th>
          </tr></thead>
          <tbody>
            <tr><td>Anna Müller</td><td>Klaus Bauer</td><td>20 Ağu</td><td>Dolgu</td><td style={{ fontWeight: 600, color: 'var(--accent)' }}>€350</td><td><Badge type="success">Tamamlandı</Badge></td></tr>
            <tr><td>Anna Müller</td><td>Maria Klein</td><td>22 Ağu</td><td>Muayene</td><td style={{ fontWeight: 600, color: 'var(--accent)' }}>€80</td><td><Badge type="success">Tamamlandı</Badge></td></tr>
            <tr><td>James Davies</td><td>Robert Smith</td><td>25 Ağu</td><td>İmplant</td><td style={{ fontWeight: 600, color: 'var(--accent)' }}>€2.800</td><td><Badge type="warning">Devam ediyor</Badge></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const Payment = () => (
  <div>
    <div className="stats-grid stats-3">
      <div className="stat"><div className="stat-label">Bekleyen ödemeler</div><div className="stat-value">€4.200</div><div className="stat-sub stat-dn">5 hasta</div></div>
      <div className="stat"><div className="stat-label">Bu ay tahsil</div><div className="stat-value">€8.240</div><div className="stat-sub stat-up">+18%</div></div>
      <div className="stat"><div className="stat-label">Online ödeme</div><div style={{ marginTop: 6 }}><Badge type="warning">Stripe bekleniyor</Badge></div></div>
    </div>
    <div className="card">
      <div className="card-header"><div className="card-title">Ödeme takibi</div></div>
      <div className="table-wrap">
        <table>
          <thead><tr>
            <th style={{ width: '20%' }}>Hasta</th>
            <th style={{ width: '18%' }}>Tedavi</th>
            <th style={{ width: '12%' }}>Tutar</th>
            <th style={{ width: '14%' }}>Vade</th>
            <th style={{ width: '18%' }}>SMS</th>
            <th style={{ width: '18%' }}>Durum</th>
          </tr></thead>
          <tbody>
            <tr><td>Peter Hoffmann</td><td>İmplant</td><td style={{ fontWeight: 600, color: 'var(--accent)' }}>€1.600</td><td>1 Eyl</td><td><Badge type="accent">Planlandı</Badge></td><td><Badge type="warning">Bekliyor</Badge></td></tr>
            <tr><td>Lisa Wagner</td><td>Beyazlatma</td><td style={{ fontWeight: 600, color: 'var(--accent)' }}>€450</td><td>5 Eyl</td><td><Badge type="accent">Planlandı</Badge></td><td><Badge type="warning">Bekliyor</Badge></td></tr>
            <tr><td>Anna Müller</td><td>Kanal + dolgu</td><td style={{ fontWeight: 600, color: 'var(--success)' }}>€800</td><td>15 Ağu</td><td><Badge type="success">Gönderildi</Badge></td><td><Badge type="success">Ödendi</Badge></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const LabTracking = () => (
  <div>
    <div className="stats-grid stats-3">
      <div className="stat"><div className="stat-label">Aktif siparişler</div><div className="stat-value">5</div></div>
      <div className="stat"><div className="stat-label">Bu hafta teslim</div><div className="stat-value">2</div><div className="stat-sub stat-up">Hazır</div></div>
      <div className="stat"><div className="stat-label">Geciken</div><div className="stat-value">1</div><div className="stat-sub stat-dn">Kontrol et</div></div>
    </div>
    <div className="card">
      <div className="card-header"><div className="card-title">Laboratuvar siparişleri</div><button className="btn btn-primary btn-sm"><i className="ti ti-plus" /> Sipariş ekle</button></div>
      {[
        { patient: 'Anna Müller', item: 'Zirkonyum kron — 15 nolu diş', lab: 'Berlin Dental Lab', ordered: '20 Ağu', delivery: '30 Ağu', status: 'success', label: 'Hazır' },
        { patient: 'Hans Weber', item: 'Metal kron — 36 nolu diş', lab: 'Premium Lab GmbH', ordered: '22 Ağu', delivery: '2 Eyl', status: 'warning', label: 'Üretimde' },
        { patient: 'Sophie Klein', item: 'Veneer — 11, 12, 21, 22', lab: 'Berlin Dental Lab', ordered: '15 Ağu', delivery: '28 Ağu', status: 'danger', label: 'Gecikti' },
        { patient: 'James Davies', item: 'İmplant altyapısı', lab: 'Swiss Implant Co.', ordered: '25 Ağu', delivery: '5 Eyl', status: 'accent', label: 'Sipariş verildi' },
      ].map(l => (
        <div key={l.patient} className="lab-row">
          <i className="ti ti-flask" style={{ fontSize: 18, color: `var(--${l.status})`, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500 }}>{l.patient} — {l.item}</div>
            <div style={{ fontSize: 10, color: 'var(--text2)', marginTop: 2 }}>{l.lab} | Sipariş: {l.ordered} | Teslim: {l.delivery}</div>
          </div>
          <Badge type={l.status}>{l.label}</Badge>
        </div>
      ))}
    </div>
  </div>
);

const DoctorPerformance = () => (
  <div>
    <div className="stats-grid stats-4">
      <div className="stat"><div className="stat-label">Bu ay hasta</div><div className="stat-value">87</div><div className="stat-sub stat-up">+12%</div></div>
      <div className="stat"><div className="stat-label">Bu ay tedavi</div><div className="stat-value">124</div></div>
      <div className="stat"><div className="stat-label">Memnuniyet</div><div className="stat-value">4.8 ★</div></div>
      <div className="stat"><div className="stat-label">Referral</div><div className="stat-value">6</div><div className="stat-sub stat-up">bu ay</div></div>
    </div>
    <div className="grid-2">
      <div className="card">
        <div className="card-header"><div className="card-title">Dr. Schmidt — Aylık özet</div></div>
        {[['Dolgu','45'],['Diş çekimi','22'],['Kanal','14'],['İmplant','8'],['Muayene','35']].map(([t, c]) => (
          <div key={t} className="row-item">
            <div className="row-info"><div className="row-name">{t}</div></div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{c}</span>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Dr. Müller — Aylık özet</div></div>
        {[['Dolgu','28'],['Diş çekimi','15'],['Kanal','8'],['İmplant','4'],['Muayene','18']].map(([t, c]) => (
          <div key={t} className="row-item">
            <div className="row-info"><div className="row-name">{t}</div></div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{c}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Team = () => (
  <div>
    <div className="card">
      <div className="card-header"><div className="card-title">Ekip yönetimi</div><button className="btn btn-primary btn-sm"><i className="ti ti-plus" /> Kullanıcı ekle</button></div>
      <div className="table-wrap">
        <table>
          <thead><tr>
            <th style={{ width: '22%' }}>Kullanıcı</th>
            <th style={{ width: '22%' }}>E-posta</th>
            <th style={{ width: '12%' }}>Rol</th>
            <th style={{ width: '30%' }}>Erişim</th>
            <th style={{ width: '14%' }}></th>
          </tr></thead>
          <tbody>
            <tr><td><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Avatar name="Admin" size={22} /><span>Admin</span></div></td><td>admin@smile.de</td><td><Badge type="pro">Admin</Badge></td><td style={{ color: 'var(--text2)' }}>Her şey — gelir, ayarlar, ekip</td><td><button className="btn btn-sm">Düzenle</button></td></tr>
            <tr><td><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Avatar name="Dr Schmidt" size={22} /><span>Dr. Schmidt</span></div></td><td>schmidt@smile.de</td><td><Badge type="accent">Doktor</Badge></td><td style={{ color: 'var(--text2)' }}>Kendi hastaları, not, diş haritası</td><td><button className="btn btn-sm">Düzenle</button></td></tr>
            <tr><td><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Avatar name="Dr Müller" size={22} /><span>Dr. Müller</span></div></td><td>muller@smile.de</td><td><Badge type="accent">Doktor</Badge></td><td style={{ color: 'var(--text2)' }}>Kendi hastaları, not, diş haritası</td><td><button className="btn btn-sm">Düzenle</button></td></tr>
            <tr><td><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Avatar name="Resepsiyon" size={22} /><span>Resepsiyon</span></div></td><td>info@smile.de</td><td><Badge type="warning">Resepsiyon</Badge></td><td style={{ color: 'var(--text2)' }}>Randevular, hasta ekle — gelir göremez</td><td><button className="btn btn-sm">Düzenle</button></td></tr>
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 14, background: 'var(--surface2)', borderRadius: 'var(--radius)', padding: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 8 }}>Rol izin matrisi</div>
        <table>
          <thead><tr>
            <th style={{ width: '28%' }}>Özellik</th>
            <th style={{ width: '24%' }}>Admin</th>
            <th style={{ width: '24%' }}>Doktor</th>
            <th style={{ width: '24%' }}>Resepsiyon</th>
          </tr></thead>
          <tbody>
            {[
              ['Dashboard','Tüm klinik','Sadece kendisi','Randevular'],
              ['Hastalar','Herkes','Kendi hastaları','Herkes (YBD yok)'],
              ['Gelir / Ödeme','Görür','Göremez','Göremez'],
              ['Tedavi notu / Diş haritası','Görür','Görür & düzenler','Göremez'],
              ['Ayarlar / Ekip','Tam erişim','Göremez','Göremez'],
            ].map(([f,a,d,r]) => (
              <tr key={f}>
                <td style={{ fontWeight: 500 }}>{f}</td>
                <td><Badge type="success">{a}</Badge></td>
                <td><Badge type={d.includes('Göremez') ? 'danger' : 'warning'}>{d}</Badge></td>
                <td><Badge type={r.includes('Göremez') ? 'danger' : 'accent'}>{r}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const Settings = () => (
  <div>
    <div className="grid-2">
      <div className="card">
        <div className="card-header"><div className="card-title">Klinik bilgileri</div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Klinik adı</label><input className="form-input" defaultValue="Smile Dental Clinic" /></div><div className="form-group"><label className="form-label">Doktor adı</label><input className="form-input" defaultValue="Dr. Schmidt" /></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label">Telefon</label><input className="form-input" defaultValue="+49 30 1234567" /></div><div className="form-group"><label className="form-label">Varsayılan dil</label><select className="form-input"><option>Almanca (DE)</option><option selected>İngilizce (EN)</option><option>Hollandaca (NL)</option><option>Türkçe (TR)</option></select></div></div>
        <div className="form-group"><label className="form-label">Adres</label><input className="form-input" defaultValue="Hauptstraße 45, 10115 Berlin" /></div>
        <div className="form-group"><label className="form-label">Çalışma saatleri</label><input className="form-input" defaultValue="Pzt-Cum 09:00-18:00, Cts 09:00-13:00" /></div>
        <div className="form-group"><label className="form-label">Google Review linki</label><input className="form-input" defaultValue="https://g.page/r/PENDING" /></div>
        <div className="form-group"><label className="form-label">Online ödeme linki (Stripe/Wise)</label><input className="form-input" placeholder="https://buy.stripe.com/..." /></div>
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 6 }}>Kaydet</button>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">API bağlantıları</div></div>
        {[
          ['WhatsApp Business API','Meta token gerekli','warning'],
          ['Twilio SMS','Telefon numarası bekleniyor','warning'],
          ['Vapi Voice AI','1bf3dd26...','success'],
          ['Gemini AI','AQ.Ab8RN6...','success'],
          ['Claude (Anthropic)','sk-ant-api03...','success'],
          ['Google Sheets CRM','1Y-0B6MpJ5...','success'],
          ['Stripe Ödeme','Online ödeme linki','warning'],
        ].map(([name, detail, status]) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px', background: 'var(--surface2)', borderRadius: 'var(--radius)', marginBottom: 6, border: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500 }}>{name}</div>
              <div style={{ fontSize: 10, color: 'var(--text3)' }}>{detail}</div>
            </div>
            <Badge type={status}>{status === 'success' ? 'Bağlı' : 'Bekleniyor'}</Badge>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Blocked = () => (
  <div className="access-blocked">
    <i className="ti ti-lock" style={{ fontSize: 48, color: 'var(--text3)', marginBottom: 12 }} />
    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Erişim kısıtlı</div>
    <div style={{ fontSize: 13, color: 'var(--text2)', maxWidth: 280 }}>Bu sayfayı görüntülemek için gereken izniniz yok. Admin ile iletişime geçin.</div>
  </div>
);

// ─── NAV CONFIG ───────────────────────────────────────────────────────────────

const NAV = {
  admin: [
    { section: 'Genel', items: [
      { id: 'dashboard', icon: 'ti-layout-dashboard', label: 'Dashboard' },
      { id: 'patients', icon: 'ti-users', label: 'Hastalar' },
      { id: 'calendar', icon: 'ti-calendar', label: 'Takvim' },
      { id: 'appointments', icon: 'ti-list', label: 'Randevular' },
    ]},
    { section: 'Tedavi', items: [
      { id: 'plans', icon: 'ti-file-text', label: 'Tedavi planları' },
      { id: 'xray', icon: 'ti-scan', label: 'Röntgen' },
      { id: 'videolib', icon: 'ti-video', label: 'Video kütüphanesi' },
      { id: 'lab', icon: 'ti-flask', label: 'Laboratuvar' },
    ]},
    { section: 'İletişim', items: [
      { id: 'whatsapp', icon: 'ti-brand-whatsapp', label: 'WhatsApp' },
      { id: 'calls', icon: 'ti-phone', label: 'Aramalar' },
    ]},
    { section: 'Analiz', items: [
      { id: 'satisfaction', icon: 'ti-star', label: 'Memnuniyet' },
      { id: 'lena', icon: 'ti-robot', label: 'Lena' },
      { id: 'lifetime', icon: 'ti-chart-bar', label: 'Hasta değeri' },
      { id: 'report', icon: 'ti-file-analytics', label: 'Aylık rapor' },
      { id: 'reminder', icon: 'ti-bell', label: 'Hatırlatıcılar' },
      { id: 'referral', icon: 'ti-share', label: 'Referral' },
      { id: 'payment', icon: 'ti-credit-card', label: 'Ödemeler' },
      { id: 'docperf', icon: 'ti-trophy', label: 'Doktor performansı' },
    ]},
    { section: 'Sistem', items: [
      { id: 'team', icon: 'ti-users-group', label: 'Ekip' },
      { id: 'settings', icon: 'ti-settings', label: 'Ayarlar' },
    ]},
  ],
  doctor: [
    { section: 'Benim', items: [
      { id: 'dashboard', icon: 'ti-layout-dashboard', label: 'Günüm' },
      { id: 'patients', icon: 'ti-users', label: 'Hastalarım' },
      { id: 'calendar', icon: 'ti-calendar', label: 'Takvimim' },
      { id: 'appointments', icon: 'ti-list', label: 'Randevularım' },
    ]},
    { section: 'Tedavi', items: [
      { id: 'xray', icon: 'ti-scan', label: 'Röntgen' },
      { id: 'videolib', icon: 'ti-video', label: 'Video kütüphanesi' },
      { id: 'lab', icon: 'ti-flask', label: 'Laboratuvar' },
    ]},
    { section: 'Araçlar', items: [
      { id: 'reminder', icon: 'ti-bell', label: 'Hatırlatıcılar' },
      { id: 'whatsapp', icon: 'ti-brand-whatsapp', label: 'WhatsApp köprüsü' },
    ]},
  ],
  reception: [
    { section: 'Genel', items: [
      { id: 'dashboard', icon: 'ti-layout-dashboard', label: 'Dashboard' },
      { id: 'patients', icon: 'ti-users', label: 'Hastalar' },
      { id: 'calendar', icon: 'ti-calendar', label: 'Takvim' },
      { id: 'appointments', icon: 'ti-list', label: 'Randevular' },
    ]},
    { section: 'İletişim', items: [
      { id: 'whatsapp', icon: 'ti-brand-whatsapp', label: 'WhatsApp' },
      { id: 'calls', icon: 'ti-phone', label: 'Aramalar' },
    ]},
    { section: 'Takip', items: [
      { id: 'reminder', icon: 'ti-bell', label: 'Hatırlatıcılar' },
    ]},
  ],
};

const BLOCKED_PAGES = {
  doctor: ['plans', 'satisfaction', 'lifetime', 'report', 'referral', 'payment', 'docperf', 'team', 'settings'],
  reception: ['plans', 'xray', 'satisfaction', 'lena', 'lifetime', 'report', 'referral', 'payment', 'docperf', 'team', 'settings', 'videolib', 'lab'],
};

const PAGE_TITLES = {
  dashboard: 'Dashboard', patients: 'Hastalar', profile: 'Hasta Profili',
  calendar: 'Takvim', appointments: 'Randevular', plans: 'Tedavi Planları',
  xray: 'Röntgen Analizi', videolib: 'Video Kütüphanesi', lab: 'Laboratuvar',
  whatsapp: 'WhatsApp', calls: 'Aramalar', satisfaction: 'Memnuniyet',
  lena: 'Lena Performansı', lifetime: 'Hasta Değeri', report: 'Aylık Rapor',
  reminder: 'Hatırlatıcı Takvimi', referral: 'Referral', payment: 'Ödemeler',
  docperf: 'Doktor Performansı', team: 'Ekip Yönetimi', settings: 'Ayarlar', blocked: 'Erişim Kısıtlı',
};

// ─── WIZARD ──────────────────────────────────────────────────────────────────

const Wizard = ({ onDone }) => {
  const [step, setStep] = useState(0);
  const [langs, setLangs] = useState(['EN']);

  const toggleLang = (l) => setLangs(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: 16, padding: 28, width: 480, maxWidth: '95vw', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🦷</div>
          <div><div style={{ fontSize: 16, fontWeight: 700 }}>Dental AI Kurulum</div><div style={{ fontSize: 11, color: 'var(--text2)' }}>5 adımda kliniğinizi kurun</div></div>
        </div>

        <div className="wizard-steps">
          {['Klinik','Dil','Saatler','Doktor','Hazır'].map((s, i) => (
            <React.Fragment key={s}>
              <div className={`wstep ${i === step ? 'active' : i < step ? 'done' : ''}`}>
                <div className="wstep-num">{i < step ? <i className="ti ti-check" style={{ fontSize: 10 }} /> : i + 1}</div>
                <span>{s}</span>
              </div>
              {i < 4 && <div className="wstep-line" />}
            </React.Fragment>
          ))}
        </div>

        {step === 0 && (
          <div>
            <div className="form-row"><div className="form-group"><label className="form-label">Klinik adı</label><input className="form-input" defaultValue="Smile Dental Clinic" /></div><div className="form-group"><label className="form-label">Adres</label><input className="form-input" defaultValue="Hauptstraße 45, Berlin" /></div></div>
            <div className="form-row"><div className="form-group"><label className="form-label">Acil telefon</label><input className="form-input" defaultValue="+49 30 1234567" /></div><div className="form-group"><label className="form-label">Google Review linki</label><input className="form-input" placeholder="https://g.page/r/..." /></div></div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 12 }}>Lena hangi dillerde yanıt versin?</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[['🇩🇪','Almanca','DE'],['🇬🇧','İngilizce','EN'],['🇳🇱','Hollandaca','NL'],['🇫🇷','Fransızca','FR'],['🇹🇷','Türkçe','TR']].map(([f,l,c]) => (
                <div key={c} onClick={() => toggleLang(c)} style={{ padding: 10, textAlign: 'center', border: langs.includes(c) ? '2px solid var(--accent)' : '1px solid var(--border2)', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: 13, background: langs.includes(c) ? 'var(--accent-bg)' : 'var(--surface2)', color: langs.includes(c) ? 'var(--accent)' : 'var(--text2)' }}>
                  {f} {l}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 10 }}>Lena hastanın dilini otomatik algılar — seçtiğiniz diller öncelikli olur.</div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="form-row"><div className="form-group"><label className="form-label">Hafta içi başlangıç</label><input className="form-input" defaultValue="09:00" /></div><div className="form-group"><label className="form-label">Hafta içi bitiş</label><input className="form-input" defaultValue="18:00" /></div></div>
            <div className="form-row"><div className="form-group"><label className="form-label">Cumartesi başlangıç</label><input className="form-input" defaultValue="09:00" /></div><div className="form-group"><label className="form-label">Cumartesi bitiş</label><input className="form-input" defaultValue="13:00" /></div></div>
            <div className="form-row"><div className="form-group"><label className="form-label">Muayene süresi (dk)</label><input className="form-input" defaultValue="20" type="number" /></div><div className="form-group"><label className="form-label">Pazar</label><select className="form-input"><option>Kapalı</option><option>Açık</option></select></div></div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 12 }}>Kliniğinizdeki doktorları ekleyin</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
              <Avatar name="Dr Schmidt" size={28} />
              <input className="form-input" defaultValue="Dr. Schmidt" style={{ flex: 1 }} />
              <input className="form-input" defaultValue="schmidt@smile.de" style={{ flex: 1 }} />
            </div>
            <button className="btn btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}><i className="ti ti-plus" /> Doktor ekle</button>
          </div>
        )}

        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <i className="ti ti-circle-check" style={{ fontSize: 52, color: 'var(--success)', display: 'block', marginBottom: 12 }} />
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Klinik hazır!</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 16 }}>Dental AI sisteminiz kuruldu. WhatsApp ve SMS entegrasyonları için Ayarlar bölümüne gidin.</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, textAlign: 'left' }}>
              <div style={{ background: 'var(--success-bg)', borderRadius: 'var(--radius)', padding: '8px 10px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--success)', marginBottom: 3 }}>✓ Aktif</div>
                <div style={{ fontSize: 11, color: 'var(--success)' }}>E-posta otomasyonu, Röntgen YZ, CRM</div>
              </div>
              <div style={{ background: 'var(--warning-bg)', borderRadius: 'var(--radius)', padding: '8px 10px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--warning)', marginBottom: 3 }}>⚠ Bağlantı bekliyor</div>
                <div style={{ fontSize: 11, color: 'var(--warning)' }}>WhatsApp API, Twilio SMS, Voice AI</div>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
          <button className="btn" style={{ visibility: step === 0 ? 'hidden' : 'visible' }} onClick={() => setStep(s => s - 1)}><i className="ti ti-arrow-left" /> Geri</button>
          {step < 4
            ? <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}>Devam et <i className="ti ti-arrow-right" /></button>
            : <button className="btn btn-primary" onClick={onDone}>Panele geç <i className="ti ti-arrow-right" /></button>
          }
        </div>
      </div>
    </div>
  );
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────

const Login = ({ onLogin }) => {
  const [role, setRole] = useState('admin');
  return (
    <div className="login-screen">
      <div className="login-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🦷</div>
          <div><div style={{ fontSize: 16, fontWeight: 700 }}>Dental AI</div><div style={{ fontSize: 11, color: 'var(--text2)' }}>Smile Dental Clinic</div></div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 8 }}>Rol seç — her rol farklı içerik görür:</div>
        <div className="role-grid">
          {[['admin','ti-shield','Admin','Klinik sahibi'],['doctor','ti-stethoscope','Doktor','Dr. Schmidt'],['reception','ti-user','Resepsiyon','Tam erişim yok']].map(([r, icon, label, sub]) => (
            <div key={r} className={`role-btn ${role === r ? 'selected' : ''}`} onClick={() => setRole(r)}>
              <i className={`ti ${icon}`} style={{ fontSize: 16, display: 'block', marginBottom: 3 }} />
              <div style={{ fontWeight: 500 }}>{label}</div>
              <div style={{ fontSize: 9, opacity: 0.7, marginTop: 1 }}>{sub}</div>
            </div>
          ))}
        </div>
        <div className="form-group"><label className="form-label">E-posta</label><input className="form-input" defaultValue="admin@smiledental.de" /></div>
        <div className="form-group"><label className="form-label">Şifre</label><input className="form-input" type="password" defaultValue="••••••••" /></div>
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }} onClick={() => onLogin(role)}>Giriş yap</button>
        <div style={{ marginTop: 12, background: 'var(--surface2)', borderRadius: 'var(--radius)', padding: '8px 10px', fontSize: 10, color: 'var(--text3)' }}>
          <strong style={{ color: 'var(--text)' }}>Admin:</strong> Tüm veriler, gelir, ayarlar<br />
          <strong style={{ color: 'var(--text)' }}>Doktor:</strong> Sadece kendi hastaları + sabah özeti<br />
          <strong style={{ color: 'var(--text)' }}>Resepsiyon:</strong> Randevular, hasta ekle
        </div>
      </div>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState('wizard');
  const [role, setRole] = useState('admin');
  const [page, setPage] = useState('dashboard');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profilePatient, setProfilePatient] = useState(null);

  const handleLogin = (r) => { setRole(r); setScreen('app'); setPage('dashboard'); };

  const navigate = (pageId) => {
    if (profilePatient) setProfilePatient(null);
    if (BLOCKED_PAGES[role]?.includes(pageId)) { setPage('blocked'); return; }
    setPage(pageId);
    setNotifOpen(false);
  };

  const renderPage = () => {
    if (profilePatient) return <PatientProfile patient={profilePatient} onBack={() => setProfilePatient(null)} />;
    switch (page) {
      case 'dashboard': return <Dashboard role={role} />;
      case 'patients': return <Patients role={role} onProfile={p => setProfilePatient(p)} />;
      case 'calendar': return <Calendar />;
      case 'appointments': return <Appointments role={role} />;
      case 'plans': return <Plans />;
      case 'xray': return <Xray />;
      case 'videolib': return <VideoLibrary />;
      case 'lab': return <LabTracking />;
      case 'whatsapp': return <WhatsApp />;
      case 'calls': return <Calls />;
      case 'satisfaction': return <Satisfaction />;
      case 'lena': return <Lena />;
      case 'lifetime': return <LifetimeValue />;
      case 'report': return <Report />;
      case 'reminder': return <Reminder />;
      case 'referral': return <Referral />;
      case 'payment': return <Payment />;
      case 'docperf': return <DoctorPerformance />;
      case 'team': return <Team />;
      case 'settings': return <Settings />;
      case 'blocked': return <Blocked />;
      default: return <Dashboard role={role} />;
    }
  };

  if (screen === 'wizard') return <Wizard onDone={() => setScreen('login')} />;
  if (screen === 'login') return <Login onLogin={handleLogin} />;

  const roleLabels = { admin: 'Klinik Admin', doctor: 'Dr. Schmidt', reception: 'Resepsiyon' };
  const roleAvatars = { admin: 'AD', doctor: 'DS', reception: 'RE' };

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🦷</div>
          <div>
            <div className="sidebar-logo-name">Dental AI</div>
            <div className="sidebar-logo-sub">Smile Dental Clinic</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {NAV[role].map(section => (
            <React.Fragment key={section.section}>
              <div className="nav-section">{section.section}</div>
              {section.items.map(item => (
                <div key={item.id} className={`nav-item ${(profilePatient ? 'profile' : page) === item.id ? 'active' : ''}`} onClick={() => navigate(item.id)}>
                  <i className={`ti ${item.icon}`} />
                  <span>{item.label}</span>
                  {item.id === 'whatsapp' && <span className="nav-badge">3</span>}
                </div>
              ))}
            </React.Fragment>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{roleAvatars[role]}</div>
            <div style={{ fontSize: 11, fontWeight: 500 }}>{roleLabels[role]}</div>
          </div>
          <button className="btn btn-sm" onClick={() => setScreen('login')}>Çıkış</button>
        </div>
      </div>

      <div className="main">
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="topbar-title">{profilePatient ? `Hasta: ${profilePatient.name}` : PAGE_TITLES[page] || page}</div>
            <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 10, fontWeight: 600, background: role === 'admin' ? 'var(--pro-bg)' : role === 'doctor' ? 'var(--accent-bg)' : 'var(--warning-bg)', color: role === 'admin' ? 'var(--pro)' : role === 'doctor' ? 'var(--accent)' : 'var(--warning)' }}>
              {roleLabels[role]}
            </span>
          </div>
          <div className="topbar-right">
            <span style={{ fontSize: 10, color: 'var(--text3)' }}>27 Ağu 2026</span>
            <button className="btn btn-icon" style={{ position: 'relative' }} onClick={() => setNotifOpen(o => !o)}>
              <i className="ti ti-bell" style={{ fontSize: 15 }} />
              <span style={{ position: 'absolute', top: 2, right: 2, width: 7, height: 7, borderRadius: '50%', background: 'var(--danger)' }} />
            </button>
            <button className="btn btn-primary btn-sm">
              <i className="ti ti-plus" />
              {role === 'doctor' ? 'Randevu ekle' : 'Yeni hasta'}
            </button>
          </div>

          <div className={`notif-panel ${notifOpen ? 'open' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600 }}>Bildirimler</span>
              <span style={{ fontSize: 10, color: 'var(--accent)', cursor: 'pointer' }} onClick={() => setNotifOpen(false)}>Okundu</span>
            </div>
            {[
              ['ti-phone-incoming','danger','Acil — Sophie Klein','Şiddetli ağrı, Lena yönlendirdi','5 dk'],
              ['ti-check','success','Plan kabul — Peter Hoffmann','€3.200 implant planı kabul edildi','23 dk'],
              ['ti-calendar-x','warning','Gelmedi — Emma Fischer','16:00 randevusu, WA gönderildi','1 sa'],
              ['ti-brand-whatsapp','accent','Yeni randevu — Hans Weber','Cuma 10:00 WhatsApp\'tan aldı','2 sa'],
            ].map(([icon, color, title, detail, time]) => (
              <div key={title} className="notif-item">
                <div className="notif-icon" style={{ background: `var(--${color}-bg)` }}>
                  <i className={`ti ${icon}`} style={{ fontSize: 12, color: `var(--${color})` }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 500 }}>{title}</div>
                  <div style={{ fontSize: 10, color: 'var(--text2)' }}>{detail}</div>
                  <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 1 }}>{time} önce</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="content" onClick={() => notifOpen && setNotifOpen(false)}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
