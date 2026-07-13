import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { dashboardInfo } from "../../helpers/dashboardApi";
import moment from "moment";

/* ─────────────────────────────────────────────────────────────
   Font loader
───────────────────────────────────────────────────────────── */
const loadFonts = () => {
  if (document.getElementById("dash-fonts")) return;
  const link = document.createElement("link");
  link.id = "dash-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap";
  document.head.appendChild(link);
};

/* ─────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────── */
function fmt(n) {
  if (n === undefined || n === null) return "—";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/* ─────────────────────────────────────────────────────────────
   CSS (injected once into <head>)
───────────────────────────────────────────────────────────── */
const CSS = `
.db {
  font-family: 'Inter', sans-serif;
  background: #F4F6FB;
  min-height: 100%;
  /* top padding clears the fixed 70px header + 24px gutter, same as .page-content */
  padding: calc(70px + 24px) 32px 56px;
  font-size: 15px;
}
@media (max-width: 991px) {
  .db { padding: calc(70px + 16px) 18px 40px; }
}

/* ── Hero ── */
.db-hero {
  position: relative;
  overflow: hidden;
  border-radius: 22px;
  padding: 30px 34px;
  margin-bottom: 26px;
  background: linear-gradient(120deg, #1E2B5E 0%, #2D3F8F 45%, #6C4BD6 100%);
  box-shadow: 0 18px 40px -18px rgba(45,63,143,.55);
}
.db-hero::after {
  content: "";
  position: absolute; right: -60px; top: -80px;
  width: 280px; height: 280px; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,.18), transparent 65%);
}
.db-hero::before {
  content: "";
  position: absolute; left: 30%; bottom: -120px;
  width: 240px; height: 240px; border-radius: 50%;
  background: radial-gradient(circle, rgba(108,75,214,.45), transparent 60%);
}
.db-hero-inner {
  position: relative; z-index: 2;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 18px;
}
.db-hi-greet { font-size: 14px; color: #C9D2F2; font-weight: 500; margin: 0 0 6px; }
.db-hi-title {
  font-family: 'Poppins', sans-serif;
  font-size: 30px; font-weight: 800; color: #fff;
  letter-spacing: -0.5px; margin: 0 0 8px;
}
.db-hi-sub { font-size: 14.5px; color: #B9C2EC; margin: 0; max-width: 460px; }
.db-hi-date {
  background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.18);
  backdrop-filter: blur(6px);
  border-radius: 14px; padding: 14px 20px; text-align: center; color: #fff;
}
.db-hi-date-day { font-family: 'Poppins', sans-serif; font-size: 26px; font-weight: 700; line-height: 1; }
.db-hi-date-rest { font-size: 13px; color: #C9D2F2; margin-top: 4px; }

/* section label */
.db-sl {
  font-size: 12.5px; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase; color: #98A2C0; margin: 0 0 14px;
  display: flex; align-items: center; gap: 8px;
}
.db-sl::after { content: ""; flex: 1; height: 1px; background: #E4E8F2; }

/* ── primary stat grid ── */
.db-stats {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px; margin-bottom: 30px;
}
@media (max-width: 1280px) { .db-stats { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 760px)  { .db-stats { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 460px)  { .db-stats { grid-template-columns: 1fr; } }

.db-card {
  background: #fff;
  border: 1px solid #ECEFF6;
  border-radius: 18px;
  padding: 20px;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  transition: box-shadow .2s, transform .18s, border-color .2s;
}
.db-card:hover {
  box-shadow: 0 14px 34px -14px rgba(40,55,120,.35);
  transform: translateY(-4px);
  border-color: #DDE3F2;
  text-decoration: none;
}
.db-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.db-card-icon {
  width: 44px; height: 44px; border-radius: 13px;
  display: flex; align-items: center; justify-content: center;
}
.db-card-arrow {
  width: 26px; height: 26px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  background: #F4F6FB; color: #A6AEC7; transition: background .2s, color .2s;
}
.db-card:hover .db-card-arrow { background: #EEF1FB; color: #6C4BD6; }
.db-card-label { font-size: 13.5px; color: #8A93AD; margin-bottom: 6px; font-weight: 500; }
.db-card-value {
  font-family: 'Poppins', sans-serif;
  font-size: 30px; font-weight: 700; color: #1B2240;
  letter-spacing: -0.6px; line-height: 1;
}

/* ── analytics row: chart + radial + finance ── */
.db-analytics {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 16px; margin-bottom: 30px;
}
@media (max-width: 1100px) { .db-analytics { grid-template-columns: 1fr; } }

.db-panel {
  background: #fff;
  border: 1px solid #ECEFF6;
  border-radius: 18px;
  overflow: hidden;
}
.db-ph {
  padding: 18px 22px;
  border-bottom: 1px solid #F1F3F9;
  display: flex; align-items: center; justify-content: space-between;
}
.db-pt {
  font-family: 'Poppins', sans-serif;
  font-size: 16px; font-weight: 600; color: #1B2240;
  display: flex; align-items: center; gap: 10px;
}
.db-pt-badge {
  font-size: 11px; font-weight: 700;
  background: #FFF0E0; color: #B45309;
  border-radius: 20px; padding: 3px 11px;
}
.db-pb { padding: 22px; }

/* donut layout */
.db-donut-wrap { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
.db-legend { flex: 1; min-width: 160px; display: flex; flex-direction: column; gap: 12px; }
.db-leg-row { display: flex; align-items: center; gap: 11px; }
.db-leg-dot { width: 11px; height: 11px; border-radius: 4px; flex-shrink: 0; }
.db-leg-lbl { font-size: 14px; color: #6B7392; flex: 1; }
.db-leg-val { font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 700; color: #1B2240; }

/* completion radial side */
.db-radial-foot {
  display: grid; grid-template-columns: 1fr 1fr; gap: 1px;
  background: #EEF1F7; border-top: 1px solid #F1F3F9;
}
.db-rf-cell { background: #fff; padding: 16px 22px; }
.db-rf-num { font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 700; color: #1B2240; }
.db-rf-lbl { font-size: 12.5px; color: #8A93AD; margin-top: 2px; }

/* ── finance mini cards ── */
.db-mini {
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px; margin-bottom: 30px;
}
@media (max-width: 1100px) { .db-mini { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 520px)  { .db-mini { grid-template-columns: 1fr; } }

.db-mini-card {
  position: relative; overflow: hidden;
  border-radius: 16px; padding: 18px 20px; color: #fff;
}
.db-mini-card.m1 { background: linear-gradient(135deg, #0E9F6E, #057A55); }
.db-mini-card.m2 { background: linear-gradient(135deg, #3F83F8, #1C64F2); }
.db-mini-card.m3 { background: linear-gradient(135deg, #9061F9, #6C2BD9); }
.db-mini-card.m4 { background: linear-gradient(135deg, #FF8A4C, #E3651D); }
.db-mini-card::after {
  content: ""; position: absolute; right: -30px; top: -30px;
  width: 110px; height: 110px; border-radius: 50%;
  background: rgba(255,255,255,.12);
}
.db-mini-lbl { font-size: 13px; opacity: .85; margin-bottom: 8px; position: relative; z-index: 1; }
.db-mini-val { font-family: 'Poppins', sans-serif; font-size: 24px; font-weight: 700; letter-spacing: -0.4px; position: relative; z-index: 1; }
.db-mini-sub { font-size: 12px; opacity: .8; margin-top: 5px; position: relative; z-index: 1; }

/* ── quick links ── */
.db-quick {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 14px; margin-bottom: 30px;
}
@media (max-width: 1280px) { .db-quick { grid-template-columns: repeat(5, 1fr); } }
@media (max-width: 860px)  { .db-quick { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 560px)  { .db-quick { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 380px)  { .db-quick { grid-template-columns: repeat(2, 1fr); } }

.db-ql {
  background: #fff; border: 1px solid #ECEFF6; border-radius: 16px;
  padding: 18px 12px; text-decoration: none; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  transition: transform .16s, box-shadow .2s, border-color .2s;
}
.db-ql:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 26px -14px rgba(40,55,120,.4);
  border-color: #DDE3F2; text-decoration: none;
}
.db-ql-icon {
  width: 46px; height: 46px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
}
.db-ql-lbl { font-size: 12.5px; font-weight: 600; color: #4B5572; line-height: 1.25; }

/* ── pending orders table overrides ── */
.db-pending-wrap { padding: 4px 0 0; }
.db-pending-wrap .table thead th {
  font-size: 12.5px; font-weight: 700; color: #8A93AD;
  text-transform: uppercase; letter-spacing: 0.05em;
  border-bottom: 1px solid #F0F2F7; background: #FAFBFE; padding: 11px 14px;
}
.db-pending-wrap .table tbody td {
  font-size: 14.5px; color: #333; padding: 12px 14px;
  vertical-align: middle; border-bottom: 1px solid #F5F6FA;
}
.db-pending-wrap .table tbody tr:last-child td { border-bottom: none; }
.db-pending-wrap .table tbody tr:hover td { background: #FAFBFE; }

/* status pills */
.db-status-pill {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 12.5px; font-weight: 600; padding: 4px 10px; border-radius: 20px;
}
.db-status-pending   { background: #FEF3C7; color: #92400E; }
.db-status-active    { background: #DBEAFE; color: #1E40AF; }
.db-status-completed { background: #D1FAE5; color: #065F46; }
.db-status-cancelled { background: #FEE2E2; color: #991B1B; }
.db-status-default   { background: #F3F4F6; color: #6B7280; }

.db-booking-num {
  font-size: 14px; font-weight: 700; color: #185FA5;
  background: #EFF6FF; padding: 3px 8px; border-radius: 6px; display: inline-block;
}
.db-user-cell { display: flex; align-items: center; gap: 9px; }
.db-user-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg, #6C4BD6, #3F83F8);
  display: flex; align-items: center; justify-content: center;
  font-size: 12.5px; font-weight: 700; color: #fff; flex-shrink: 0;
}
.db-user-name  { font-size: 14.5px; font-weight: 600; color: #222; }
.db-user-phone { font-size: 12px; color: #A6AEC7; }

.db-empty { text-align: center; padding: 44px 20px; color: #B4BBD0; font-size: 14px; }
.db-empty-icon { font-size: 34px; margin-bottom: 10px; }

.db-store-filter {
  margin-bottom: 16px; display: flex; gap: 10px; align-items: center;
}
.db-store-filter label { font-size: 13px; font-weight: 600; color: #6B7392; white-space: nowrap; }
.db-store-filter select {
  padding: 7px 12px; font-size: 13px; border: 1px solid #E2E6F0;
  border-radius: 9px; cursor: pointer; background: #fff; color: #333; font-weight: 500;
}

.db-view-btn {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 600; color: #3F4D86;
  background: #EEF1FB; border: 1px solid #E2E6F4;
  padding: 5px 12px; border-radius: 9px; cursor: pointer;
  transition: background .15s, border-color .15s;
}
.db-view-btn:hover { background: #E2E7FA; border-color: #CBD3EF; }
`;

function injectCSS() {
  if (document.getElementById("dash-css")) return;
  const s = document.createElement("style");
  s.id = "dash-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/* ─────────────────────────────────────────────────────────────
   Inline SVG icons
───────────────────────────────────────────────────────────── */
const ic = (path, c, sw = 2) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {path}
  </svg>
);
const Icon = {
  users: (c) => ic(<><circle cx="9" cy="7" r="4" /><path d="M2 21c0-4 3-6 7-6s7 2 7 6" /><path d="M16 3.5a4 4 0 010 7M22 21c0-3-1.5-5-4-5.5" /></>, c),
  vendor: (c) => ic(<><path d="M3 9l1-5h16l1 5" /><path d="M4 9v11h16V9" /><path d="M3 9h18" /><path d="M9 20v-6h6v6" /></>, c),
  calendar: (c) => ic(<><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>, c),
  box: (c) => ic(<><path d="M21 16V8a2 2 0 00-1-1.7l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.7l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><path d="M3.3 7L12 12l8.7-5M12 22V12" /></>, c),
  truck: (c) => ic(<><rect x="1" y="6" width="13" height="11" rx="1" /><path d="M14 9h4l3 3v5h-7" /><circle cx="6" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>, c),
  clock: (c) => ic(<><circle cx="12" cy="12" r="9" /><polyline points="12,7 12,12 15,14" /></>, c, 2),
  arrow: (c) => ic(<><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13,6 19,12 13,18" /></>, c),
  ecom: (c) => ic(<><circle cx="9" cy="21" r="1.5" /><circle cx="18" cy="21" r="1.5" /><path d="M2 3h3l2.5 13h11l2-9H6" /></>, c),
  food: (c) => ic(<><path d="M4 3v8a3 3 0 006 0V3M7 3v18M17 3c-1.5 0-2.5 2-2.5 5s1 4 2.5 4 2.5-1 2.5-4-1-5-2.5-5zM17 12v9" /></>, c),
  qcom: (c) => ic(<><path d="M13 2L3 14h7l-1 8 10-12h-7z" /></>, c),
  coupon: (c) => ic(<><path d="M3 8a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 000 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 000-4z" /><line x1="12" y1="7" x2="12" y2="17" strokeDasharray="2 2" /></>, c),
  banner: (c) => ic(<><rect x="3" y="4" width="18" height="14" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="M21 15l-5-5L5 18" /></>, c),
  review: (c) => ic(<><polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9" /></>, c),
  wallet: (c) => ic(<><path d="M3 7a2 2 0 012-2h13a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><path d="M16 12h4M3 9h18" /><circle cx="16.5" cy="12.5" r="1" /></>, c),
  bell: (c) => ic(<><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 01-3.4 0" /></>, c),
  store: (c) => ic(<><path d="M3 9l1-5h16l1 5" /><path d="M4 9v11h16V9" /><path d="M3 9h18" /></>, c),
  gear: (c) => ic(<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-2.7 1.1V21a2 2 0 11-4 0v-.1A1.6 1.6 0 005 19.4l-.1.1a2 2 0 11-2.8-2.8l.1-.1A1.6 1.6 0 003.6 14H3a2 2 0 110-4h.1A1.6 1.6 0 005 8.6l-.1-.1a2 2 0 112.8-2.8l.1.1A1.6 1.6 0 0010 5.6V5a2 2 0 114 0v.1a1.6 1.6 0 002.7 1.1l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8" /></>, c),
  eye: (c) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
};

/* ─────────────────────────────────────────────────────────────
   Status helpers
───────────────────────────────────────────────────────────── */
const getStatusClass = (status) => {
  if (!status) return "db-status-default";
  const s = status.toLowerCase();
  if (s === "p" || s === "pending" || s === "pp") return "db-status-pending";
  if (s === "a" || s === "active" || s === "o") return "db-status-active";
  if (s === "c" || s === "completed") return "db-status-completed";
  if (s === "x" || s === "cancelled" || s === "r" || s === "rejected") return "db-status-cancelled";
  return "db-status-default";
};
const getPaymentClass = (status) => {
  if (!status) return "db-status-default";
  const s = status.toLowerCase();
  if (s === "pending") return "db-status-pending";
  if (s === "paid") return "db-status-completed";
  if (s === "failed") return "db-status-cancelled";
  return "db-status-default";
};

/* ─────────────────────────────────────────────────────────────
   Quick Links config
───────────────────────────────────────────────────────────── */
const QUICK_LINKS = [
  { to: "/users", label: "Users", icon: Icon.users, c: "#0F6E56", bg: "#E1F5EE" },
  { to: "/vendors", label: "Vendors", icon: Icon.store, c: "#534AB7", bg: "#EEEDFE" },
  { to: "/addresses", label: "Addresses", icon: Icon.box, c: "#185FA5", bg: "#E6F1FB" },
  { to: "/coupons", label: "Coupons", icon: Icon.coupon, c: "#BE185D", bg: "#FCE7F1" },
  { to: "/banner", label: "Banners", icon: Icon.banner, c: "#1D4ED8", bg: "#E4EAFE" },
  { to: "/wallet/transactions", label: "Wallet", icon: Icon.wallet, c: "#047857", bg: "#DCFCE9" },
  { to: "/wallet/withdrawal/requests", label: "Withdrawals", icon: Icon.wallet, c: "#B45309", bg: "#FAEEDA" },
  { to: "/notifications", label: "Notifications", icon: Icon.bell, c: "#4338CA", bg: "#E7E8FD" },
  { to: "/help-support", label: "Help & Support", icon: Icon.review, c: "#CA8A04", bg: "#FEF6DA" },
  { to: "/app-setting", label: "Settings", icon: Icon.gear, c: "#475569", bg: "#EEF1F7" },
];

/* ─────────────────────────────────────────────────────────────
   Dashboard
───────────────────────────────────────────────────────────── */
const Dashboard = (props) => {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    loadFonts();
    injectCSS();
  }, []);

  // Load summary stats once on mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await dashboardInfo();
        if (res.type === "success") setCounts(res.stats || {});
      } catch (_) { }
    };
    load();
  }, []);

  const s = counts;
  const now = new Date();

  // This backend's dashboard stats endpoint returns { totalUsers, totalVendors }.
  const PRIMARY = [
    { to: "/users", label: "Total Users", value: fmt(s.totalUsers), icon: Icon.users, c: "#0F6E56", bg: "#E1F5EE" },
    { to: "/vendors", label: "Total Vendors", value: fmt(s.totalVendors), icon: Icon.vendor, c: "#534AB7", bg: "#EEEDFE" },
  ];

  return (
    <div className="db">

      {/* ── Hero ─────────────────────────────────────── */}
      <div className="db-hero">
        <div className="db-hero-inner">
          <div>
            <p className="db-hi-greet">{greeting()}, Admin 👋</p>
            <h1 className="db-hi-title">{props.t("Dashboard")}</h1>
            <p className="db-hi-sub">
              Here's what's happening across Your Admin Panel today — track users, vendors, orders and revenue at a glance.
            </p>
          </div>
          <div className="db-hi-date">
            <div className="db-hi-date-day">{moment(now).format("DD")}</div>
            <div className="db-hi-date-rest">{moment(now).format("MMM YYYY · ddd")}</div>
          </div>
        </div>
      </div>

      {/* ── Quick Links ──────────────────────────────── */}
      <div className="db-sl">Quick Links</div>
      <div className="db-quick">
        {QUICK_LINKS.map((q) => (
          <Link key={q.label} to={q.to} className="db-ql">
            <span className="db-ql-icon" style={{ background: q.bg }}>{q.icon(q.c)}</span>
            <span className="db-ql-lbl">{q.label}</span>
          </Link>
        ))}
      </div>

      {/* ── Primary stat cards ───────────────────────── */}
      <div className="db-sl">Overview</div>
      <div className="db-stats">
        {PRIMARY.map((p) => (
          <Link key={p.label} to={p.to} className="db-card">
            <div className="db-card-top">
              <div className="db-card-icon" style={{ background: p.bg }}>{p.icon(p.c)}</div>
              <div className="db-card-arrow">{Icon.arrow("currentColor")}</div>
            </div>
            <div className="db-card-label">{p.label}</div>
            <div className="db-card-value">{p.value}</div>
          </Link>
        ))}
      </div>

    </div>
  );
};

Dashboard.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(Dashboard);
