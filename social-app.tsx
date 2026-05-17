import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Pacifico&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --coral: #FF6B6B;
    --yellow: #FFE66D;
    --mint: #4ECDC4;
    --sky: #45B7D1;
    --lavender: #C3A6FF;
    --peach: #FFB347;
    --white: #FFFFFF;
    --off-white: #FFF9F5;
    --gray-light: #F5F0FF;
    --gray-mid: #E8E0FF;
    --text-dark: #2D2140;
    --text-mid: #6B5B8C;
    --text-light: #9B8CBB;
    --shadow: 0 8px 32px rgba(45,33,64,0.12);
    --shadow-sm: 0 4px 16px rgba(45,33,64,0.08);
    --radius: 20px;
    --radius-sm: 12px;
    --nav-height: 72px;
  }

  body {
    font-family: 'Nunito', sans-serif;
    background: var(--off-white);
    color: var(--text-dark);
    min-height: 100vh;
    overflow-x: hidden;
  }

  .app {
    max-width: 430px;
    margin: 0 auto;
    min-height: 100vh;
    background: var(--off-white);
    position: relative;
    overflow: hidden;
  }

  /* ===== SPLASH SCREEN ===== */
  .splash {
    position: fixed; inset: 0;
    background: linear-gradient(145deg, #FF6B6B 0%, #FFB347 40%, #FFE66D 70%, #4ECDC4 100%);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    z-index: 1000;
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .splash.hidden { opacity: 0; transform: scale(1.05); pointer-events: none; }
  .splash-logo {
    font-family: 'Pacifico', cursive;
    font-size: 52px;
    color: white;
    text-shadow: 0 4px 20px rgba(0,0,0,0.2);
    animation: splashPop 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.3s both;
  }
  .splash-tagline {
    color: rgba(255,255,255,0.9);
    font-size: 17px;
    font-weight: 600;
    margin-top: 12px;
    animation: splashFade 0.5s ease 0.8s both;
  }
  .splash-dots {
    display: flex; gap: 8px; margin-top: 40px;
    animation: splashFade 0.5s ease 1s both;
  }
  .splash-dot {
    width: 10px; height: 10px; border-radius: 50%;
    background: rgba(255,255,255,0.6);
    animation: pulse 1.2s ease-in-out infinite;
  }
  .splash-dot:nth-child(2) { animation-delay: 0.2s; }
  .splash-dot:nth-child(3) { animation-delay: 0.4s; }

  /* ===== AUTH SCREENS ===== */
  .auth-screen {
    min-height: 100vh;
    display: flex; flex-direction: column;
    padding: 0 24px 40px;
    background: linear-gradient(180deg, #FFF5F0 0%, #FFF9F5 100%);
  }
  .auth-header {
    padding-top: 60px;
    text-align: center;
    margin-bottom: 40px;
  }
  .auth-logo {
    font-family: 'Pacifico', cursive;
    font-size: 40px;
    background: linear-gradient(135deg, var(--coral), var(--peach), var(--yellow));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .auth-subtitle { color: var(--text-mid); font-size: 15px; font-weight: 600; margin-top: 6px; }
  .auth-illustration {
    display: flex; justify-content: center; gap: 10px;
    margin-bottom: 32px;
  }
  .auth-bubble {
    border-radius: 18px;
    overflow: hidden;
    position: relative;
  }
  .auth-bubble-inner {
    width: 80px; height: 80px;
    display: flex; align-items: center; justify-content: center;
    font-size: 36px;
    border-radius: 18px;
  }
  .auth-form { display: flex; flex-direction: column; gap: 14px; }
  .input-group { position: relative; }
  .input-label {
    display: block;
    font-size: 13px; font-weight: 700;
    color: var(--text-mid);
    margin-bottom: 6px;
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .input-field {
    width: 100%;
    padding: 14px 18px;
    border: 2.5px solid var(--gray-mid);
    border-radius: var(--radius-sm);
    font-family: 'Nunito', sans-serif;
    font-size: 15px; font-weight: 600;
    color: var(--text-dark);
    background: white;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .input-field:focus {
    border-color: var(--coral);
    box-shadow: 0 0 0 4px rgba(255,107,107,0.1);
  }
  .btn-primary {
    padding: 16px;
    background: linear-gradient(135deg, var(--coral), var(--peach));
    color: white;
    border: none; border-radius: var(--radius-sm);
    font-family: 'Nunito', sans-serif;
    font-size: 16px; font-weight: 800;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(255,107,107,0.4);
    transition: transform 0.15s, box-shadow 0.15s;
    margin-top: 6px;
    letter-spacing: 0.3px;
  }
  .btn-primary:active { transform: scale(0.97); box-shadow: 0 3px 10px rgba(255,107,107,0.3); }
  .auth-switch {
    text-align: center; margin-top: 20px;
    color: var(--text-mid); font-size: 14px; font-weight: 600;
  }
  .auth-link { color: var(--coral); cursor: pointer; font-weight: 800; }
  .auth-divider {
    display: flex; align-items: center; gap: 12px; margin: 20px 0;
  }
  .auth-divider-line { flex: 1; height: 2px; background: var(--gray-mid); border-radius: 1px; }
  .auth-divider-text { color: var(--text-light); font-size: 13px; font-weight: 700; }
  .btn-social {
    padding: 14px;
    background: white;
    border: 2.5px solid var(--gray-mid);
    border-radius: var(--radius-sm);
    font-family: 'Nunito', sans-serif;
    font-size: 15px; font-weight: 700;
    color: var(--text-dark);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: border-color 0.2s, background 0.2s;
  }
  .btn-social:active { background: var(--gray-light); }

  /* ===== TOP NAV ===== */
  .top-nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,249,245,0.9);
    backdrop-filter: blur(20px);
    padding: 14px 20px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 2px solid var(--gray-mid);
  }
  .nav-logo {
    font-family: 'Pacifico', cursive;
    font-size: 26px;
    background: linear-gradient(135deg, var(--coral), var(--peach));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .nav-actions { display: flex; gap: 6px; }
  .icon-btn {
    width: 40px; height: 40px;
    border-radius: 50%;
    border: none; background: white;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 18px;
    box-shadow: var(--shadow-sm);
    transition: transform 0.15s, box-shadow 0.15s;
    position: relative;
  }
  .icon-btn:active { transform: scale(0.9); }
  .notif-badge {
    position: absolute; top: -2px; right: -2px;
    width: 16px; height: 16px;
    background: var(--coral);
    border-radius: 50%; border: 2px solid white;
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; color: white; font-weight: 800;
  }

  /* ===== STORIES ===== */
  .stories-row {
    display: flex; gap: 12px;
    padding: 16px 20px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .stories-row::-webkit-scrollbar { display: none; }
  .story-item { display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; flex-shrink: 0; }
  .story-ring {
    width: 66px; height: 66px; border-radius: 50%;
    padding: 3px;
    background: linear-gradient(135deg, var(--coral), var(--yellow), var(--mint));
  }
  .story-ring.seen { background: var(--gray-mid); }
  .story-ring.add-story { background: linear-gradient(135deg, var(--sky), var(--lavender)); }
  .story-avatar {
    width: 100%; height: 100%; border-radius: 50%;
    background: white; border: 3px solid white;
    display: flex; align-items: center; justify-content: center;
    font-size: 28px; overflow: hidden;
    position: relative;
  }
  .story-add-icon {
    position: absolute; bottom: -2px; right: -2px;
    width: 22px; height: 22px;
    background: var(--coral); color: white;
    border-radius: 50%; border: 2.5px solid white;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 800;
  }
  .story-name { font-size: 11px; font-weight: 700; color: var(--text-mid); max-width: 66px; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  /* ===== POSTS ===== */
  .feed { padding: 0 0 calc(var(--nav-height) + 20px); }
  .post-card {
    background: white;
    border-radius: var(--radius);
    margin: 0 16px 16px;
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    animation: postIn 0.4s ease both;
  }
  .post-header {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 16px;
  }
  .post-avatar {
    width: 42px; height: 42px; border-radius: 50%;
    background: linear-gradient(135deg, var(--coral), var(--yellow));
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; flex-shrink: 0;
    border: 2.5px solid var(--gray-mid);
  }
  .post-user-info { flex: 1; }
  .post-username { font-size: 14px; font-weight: 800; color: var(--text-dark); }
  .post-location { font-size: 12px; color: var(--text-light); font-weight: 600; }
  .post-menu { color: var(--text-light); font-size: 20px; cursor: pointer; padding: 4px; }
  .post-media {
    width: 100%;
    aspect-ratio: 1;
    position: relative;
    overflow: hidden;
    background: var(--gray-light);
    display: flex; align-items: center; justify-content: center;
  }
  .post-media-emoji { font-size: 80px; }
  .post-media-gradient {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 80px;
  }
  .post-video-badge {
    position: absolute; top: 12px; right: 12px;
    background: rgba(0,0,0,0.6);
    color: white; border-radius: 20px;
    padding: 4px 10px; font-size: 11px; font-weight: 700;
    display: flex; align-items: center; gap: 4px;
  }
  .post-actions {
    display: flex; align-items: center; gap: 4px;
    padding: 12px 16px 8px;
  }
  .action-btn {
    display: flex; align-items: center; gap: 5px;
    padding: 8px 12px;
    border: none; background: transparent;
    cursor: pointer; border-radius: 20px;
    font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 700; color: var(--text-mid);
    transition: background 0.15s, transform 0.15s;
  }
  .action-btn:active { transform: scale(0.9); }
  .action-btn.liked { color: var(--coral); }
  .action-btn.liked .action-icon { animation: heartPop 0.3s cubic-bezier(0.34,1.56,0.64,1); }
  .action-icon { font-size: 20px; }
  .action-spacer { flex: 1; }
  .post-caption { padding: 0 16px 10px; font-size: 14px; font-weight: 600; color: var(--text-dark); line-height: 1.5; }
  .post-caption span { font-weight: 800; }
  .post-hashtags { color: var(--sky); font-weight: 700; }
  .post-time { padding: 0 16px 14px; font-size: 11px; color: var(--text-light); font-weight: 600; }
  .post-likes { padding: 0 16px 4px; font-size: 13px; font-weight: 700; color: var(--text-dark); }

  /* ===== REEL CARD ===== */
  .reel-card {
    background: var(--text-dark);
    border-radius: var(--radius);
    margin: 0 16px 16px;
    overflow: hidden;
    aspect-ratio: 9/16;
    position: relative;
    box-shadow: var(--shadow);
  }
  .reel-bg {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 120px;
  }
  .reel-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%);
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 20px;
  }
  .reel-user {
    display: flex; align-items: center; gap: 10px; margin-bottom: 10px;
  }
  .reel-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    background: linear-gradient(135deg, var(--coral), var(--yellow));
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; border: 2.5px solid white;
  }
  .reel-username { color: white; font-size: 14px; font-weight: 800; }
  .reel-follow { color: var(--yellow); font-size: 13px; font-weight: 700; cursor: pointer; margin-left: 4px; }
  .reel-caption { color: rgba(255,255,255,0.9); font-size: 13px; font-weight: 600; margin-bottom: 8px; }
  .reel-music {
    display: flex; align-items: center; gap: 6px;
    color: rgba(255,255,255,0.7); font-size: 12px; font-weight: 600;
  }
  .reel-actions {
    position: absolute; right: 16px; bottom: 100px;
    display: flex; flex-direction: column; gap: 18px; align-items: center;
  }
  .reel-action { display: flex; flex-direction: column; align-items: center; gap: 2px; cursor: pointer; }
  .reel-action-icon { font-size: 28px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4)); }
  .reel-action-count { color: white; font-size: 12px; font-weight: 700; }
  .reel-play-btn {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
    width: 64px; height: 64px; border-radius: 50%;
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(8px);
    border: 2.5px solid rgba(255,255,255,0.5);
    display: flex; align-items: center; justify-content: center;
    font-size: 28px; cursor: pointer;
    transition: transform 0.2s;
  }
  .reel-play-btn:active { transform: translate(-50%,-50%) scale(0.9); }

  /* ===== BOTTOM NAV ===== */
  .bottom-nav {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; max-width: 430px;
    height: var(--nav-height);
    background: rgba(255,249,245,0.95);
    backdrop-filter: blur(20px);
    border-top: 2px solid var(--gray-mid);
    display: flex; align-items: center; justify-content: space-around;
    padding: 0 10px 8px;
    z-index: 100;
  }
  .nav-item {
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    cursor: pointer; padding: 8px 14px; border-radius: 16px;
    transition: background 0.2s, transform 0.15s;
    position: relative;
    flex: 1;
  }
  .nav-item:active { transform: scale(0.9); }
  .nav-item.active { background: rgba(255,107,107,0.1); }
  .nav-icon { font-size: 22px; transition: transform 0.2s; }
  .nav-item.active .nav-icon { transform: scale(1.2); }
  .nav-label { font-size: 10px; font-weight: 700; color: var(--text-light); }
  .nav-item.active .nav-label { color: var(--coral); }
  .nav-post-btn {
    width: 52px; height: 52px; border-radius: 50%;
    background: linear-gradient(135deg, var(--coral), var(--peach));
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; color: white;
    box-shadow: 0 6px 20px rgba(255,107,107,0.4);
    transition: transform 0.2s, box-shadow 0.2s;
    margin-top: -24px;
    flex-shrink: 0;
  }
  .nav-post-btn:active { transform: scale(0.92); box-shadow: 0 3px 10px rgba(255,107,107,0.3); }

  /* ===== EXPLORE ===== */
  .explore-search {
    padding: 14px 20px;
    position: sticky; top: 0; z-index: 10;
    background: rgba(255,249,245,0.95);
    backdrop-filter: blur(20px);
  }
  .search-box {
    display: flex; align-items: center; gap: 10px;
    background: white;
    border: 2.5px solid var(--gray-mid);
    border-radius: 50px;
    padding: 10px 18px;
    box-shadow: var(--shadow-sm);
  }
  .search-input {
    flex: 1; border: none; outline: none;
    font-family: 'Nunito', sans-serif;
    font-size: 15px; font-weight: 600;
    color: var(--text-dark); background: transparent;
  }
  .search-input::placeholder { color: var(--text-light); }
  .explore-tags {
    display: flex; gap: 8px; padding: 0 20px 16px;
    overflow-x: auto; scrollbar-width: none;
  }
  .explore-tags::-webkit-scrollbar { display: none; }
  .tag-chip {
    padding: 8px 16px;
    border-radius: 50px; border: none;
    font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 700;
    cursor: pointer; white-space: nowrap;
    transition: transform 0.15s;
    flex-shrink: 0;
  }
  .tag-chip:active { transform: scale(0.95); }
  .tag-chip.active { background: var(--coral); color: white; box-shadow: 0 4px 12px rgba(255,107,107,0.3); }
  .tag-chip:not(.active) { background: white; color: var(--text-mid); box-shadow: var(--shadow-sm); }
  .explore-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3px;
    padding: 0 0 calc(var(--nav-height) + 10px);
  }
  .grid-item {
    aspect-ratio: 1;
    background: var(--gray-light);
    display: flex; align-items: center; justify-content: center;
    font-size: 40px; cursor: pointer;
    position: relative; overflow: hidden;
    transition: opacity 0.2s;
  }
  .grid-item:active { opacity: 0.8; }
  .grid-item.big { grid-column: span 2; grid-row: span 2; font-size: 70px; }
  .grid-item-badge {
    position: absolute; top: 6px; right: 6px;
    background: rgba(0,0,0,0.5); color: white;
    border-radius: 10px; padding: 2px 6px;
    font-size: 10px; font-weight: 700;
  }
  .grid-item-likes {
    position: absolute; bottom: 6px; left: 6px;
    background: rgba(0,0,0,0.5); color: white;
    border-radius: 10px; padding: 2px 6px;
    font-size: 10px; font-weight: 700;
  }

  /* ===== PROFILE ===== */
  .profile-header {
    background: linear-gradient(160deg, #FFB347 0%, #FF6B6B 60%, #C3A6FF 100%);
    padding: 60px 20px 24px;
    position: relative;
  }
  .profile-cover-emoji {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: flex-end;
    padding: 20px;
    font-size: 60px; opacity: 0.3;
    pointer-events: none;
  }
  .profile-info { display: flex; flex-direction: column; align-items: center; }
  .profile-avatar-wrap {
    position: relative; margin-bottom: 14px;
  }
  .profile-avatar {
    width: 90px; height: 90px; border-radius: 50%;
    background: white;
    display: flex; align-items: center; justify-content: center;
    font-size: 44px;
    border: 4px solid white;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  }
  .profile-avatar-ring {
    position: absolute; inset: -5px; border-radius: 50%;
    background: linear-gradient(135deg, var(--yellow), var(--coral), var(--lavender));
    z-index: -1;
  }
  .profile-name { font-size: 22px; font-weight: 900; color: white; text-shadow: 0 2px 8px rgba(0,0,0,0.2); }
  .profile-handle { color: rgba(255,255,255,0.8); font-size: 14px; font-weight: 600; margin-top: 2px; }
  .profile-bio { color: rgba(255,255,255,0.9); font-size: 13px; font-weight: 600; text-align: center; margin-top: 8px; max-width: 240px; }
  .profile-stats {
    display: flex; justify-content: center; gap: 32px;
    background: white; margin: 0 16px;
    border-radius: var(--radius); padding: 16px;
    box-shadow: var(--shadow-sm);
    margin-top: -1px;
    border-top-left-radius: 0; border-top-right-radius: 0;
    border-radius: 0 0 var(--radius) var(--radius);
  }
  .stat { text-align: center; cursor: pointer; }
  .stat-num { font-size: 20px; font-weight: 900; color: var(--text-dark); }
  .stat-label { font-size: 11px; font-weight: 700; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.3px; }
  .profile-actions {
    display: flex; gap: 10px; padding: 16px 20px;
  }
  .btn-edit {
    flex: 1; padding: 12px;
    background: white; border: 2.5px solid var(--gray-mid);
    border-radius: var(--radius-sm);
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800;
    color: var(--text-dark); cursor: pointer;
    transition: background 0.2s;
  }
  .btn-edit:active { background: var(--gray-light); }
  .btn-share {
    width: 46px; height: 46px;
    background: white; border: 2.5px solid var(--gray-mid);
    border-radius: var(--radius-sm);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; cursor: pointer;
  }
  .highlights-row {
    display: flex; gap: 14px; padding: 0 20px 16px;
    overflow-x: auto; scrollbar-width: none;
  }
  .highlights-row::-webkit-scrollbar { display: none; }
  .highlight {
    display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer;
    flex-shrink: 0;
  }
  .highlight-ring {
    width: 64px; height: 64px; border-radius: 50%;
    padding: 3px;
    background: linear-gradient(135deg, var(--peach), var(--coral));
  }
  .highlight-inner {
    width: 100%; height: 100%; border-radius: 50%;
    background: white; border: 3px solid white;
    display: flex; align-items: center; justify-content: center;
    font-size: 26px;
  }
  .highlight-label { font-size: 11px; font-weight: 700; color: var(--text-mid); max-width: 64px; text-align: center; }
  .profile-tabs {
    display: flex; border-bottom: 2px solid var(--gray-mid);
    margin: 0 20px;
  }
  .profile-tab {
    flex: 1; padding: 12px; text-align: center;
    font-size: 18px; cursor: pointer;
    border-bottom: 3px solid transparent;
    margin-bottom: -2px;
    transition: border-color 0.2s;
  }
  .profile-tab.active { border-bottom-color: var(--coral); }
  .profile-grid {
    display: grid; grid-template-columns: repeat(3,1fr); gap: 3px;
    padding: 3px 0 calc(var(--nav-height) + 20px);
  }
  .profile-grid-item {
    aspect-ratio: 1;
    background: var(--gray-light);
    display: flex; align-items: center; justify-content: center;
    font-size: 36px; cursor: pointer;
    transition: opacity 0.2s;
  }
  .profile-grid-item:active { opacity: 0.7; }

  /* ===== NOTIFICATIONS ===== */
  .notif-section { padding: 16px 20px 8px; }
  .notif-section-title { font-size: 13px; font-weight: 800; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
  .notif-item {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 0;
    border-bottom: 1.5px solid var(--gray-mid);
    cursor: pointer;
    transition: background 0.15s;
  }
  .notif-avatar {
    width: 48px; height: 48px; border-radius: 50%;
    background: linear-gradient(135deg, var(--coral), var(--yellow));
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; flex-shrink: 0;
    position: relative;
  }
  .notif-type-badge {
    position: absolute; bottom: -2px; right: -2px;
    width: 20px; height: 20px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; border: 2px solid white;
  }
  .notif-type-badge.like { background: var(--coral); }
  .notif-type-badge.comment { background: var(--sky); }
  .notif-type-badge.follow { background: var(--mint); }
  .notif-type-badge.reel { background: var(--lavender); }
  .notif-text { flex: 1; font-size: 13px; font-weight: 600; color: var(--text-dark); line-height: 1.4; }
  .notif-text strong { font-weight: 800; }
  .notif-time { font-size: 11px; color: var(--text-light); font-weight: 600; }
  .notif-thumb {
    width: 44px; height: 44px; border-radius: 10px;
    background: var(--gray-light);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; flex-shrink: 0;
  }
  .follow-btn {
    padding: 7px 14px;
    border-radius: 20px; border: none;
    font-family: 'Nunito', sans-serif;
    font-size: 12px; font-weight: 800;
    cursor: pointer; transition: transform 0.15s;
  }
  .follow-btn:active { transform: scale(0.93); }
  .follow-btn.following { background: var(--gray-mid); color: var(--text-mid); }
  .follow-btn.follow { background: linear-gradient(135deg, var(--coral), var(--peach)); color: white; box-shadow: 0 4px 12px rgba(255,107,107,0.3); }

  /* ===== POST MODAL ===== */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(8px);
    display: flex; align-items: flex-end;
    animation: fadeIn 0.2s ease;
  }
  .modal-sheet {
    width: 100%; max-width: 430px; margin: 0 auto;
    background: white;
    border-radius: var(--radius) var(--radius) 0 0;
    padding: 20px;
    animation: slideUp 0.3s cubic-bezier(0.34,1.2,0.64,1);
    max-height: 90vh; overflow-y: auto;
  }
  .modal-handle {
    width: 40px; height: 5px;
    background: var(--gray-mid); border-radius: 3px;
    margin: 0 auto 20px;
  }
  .modal-title { font-size: 18px; font-weight: 900; color: var(--text-dark); margin-bottom: 20px; }
  .post-type-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 20px; }
  .post-type-btn {
    aspect-ratio: 1;
    border-radius: var(--radius-sm);
    border: none; cursor: pointer;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 8px;
    font-family: 'Nunito', sans-serif;
    font-size: 12px; font-weight: 800;
    transition: transform 0.15s;
  }
  .post-type-btn:active { transform: scale(0.95); }
  .post-type-icon { font-size: 32px; }
  .post-type-btn.photo { background: linear-gradient(135deg, #FFE0E0, #FFB3B3); color: #C0392B; }
  .post-type-btn.video { background: linear-gradient(135deg, #E0F0FF, #B3D9FF); color: #2980B9; }
  .post-type-btn.reel { background: linear-gradient(135deg, #F0E0FF, #D9B3FF); color: #8E44AD; }
  .post-type-btn.story { background: linear-gradient(135deg, #FFF4E0, #FFD9B3); color: #E67E22; }
  .post-type-btn.live { background: linear-gradient(135deg, #E0FFE0, #B3FFB3); color: #27AE60; }
  .post-type-btn.text { background: linear-gradient(135deg, #E0FFFE, #B3FFFC); color: #16A085; }

  /* ===== STORY VIEWER ===== */
  .story-viewer {
    position: fixed; inset: 0; z-index: 300;
    background: black;
    display: flex; flex-direction: column;
  }
  .story-progress-bars {
    display: flex; gap: 4px; padding: 12px 12px 0;
  }
  .story-progress-bar {
    flex: 1; height: 3px;
    background: rgba(255,255,255,0.3); border-radius: 2px;
    overflow: hidden;
  }
  .story-progress-fill {
    height: 100%; background: white; border-radius: 2px;
    width: 0%;
    transition: width linear;
  }
  .story-progress-fill.complete { width: 100%; }
  .story-progress-fill.animating { width: 100%; transition: width 4s linear; }
  .story-header {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 16px;
  }
  .story-user-info { flex: 1; }
  .story-user-name { color: white; font-size: 14px; font-weight: 800; }
  .story-user-time { color: rgba(255,255,255,0.7); font-size: 12px; font-weight: 600; }
  .story-close { color: white; font-size: 24px; cursor: pointer; padding: 4px; }
  .story-content {
    flex: 1;
    display: flex; align-items: center; justify-content: center;
    font-size: 120px;
    position: relative;
  }
  .story-gradient {
    position: absolute; inset: 0;
  }
  .story-reply {
    padding: 16px;
    display: flex; gap: 10px;
  }
  .story-reply-input {
    flex: 1; padding: 12px 16px;
    background: rgba(255,255,255,0.15);
    border: 1.5px solid rgba(255,255,255,0.3);
    border-radius: 50px; color: white;
    font-family: 'Nunito', sans-serif; font-size: 14px;
    outline: none;
  }
  .story-reply-input::placeholder { color: rgba(255,255,255,0.6); }
  .story-reply-btn {
    width: 44px; height: 44px; border-radius: 50%;
    background: white; border: none;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; cursor: pointer;
  }

  /* ===== EMPTY STATE ===== */
  .empty-state {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 60px 20px;
    text-align: center;
  }
  .empty-emoji { font-size: 64px; margin-bottom: 16px; }
  .empty-title { font-size: 20px; font-weight: 900; color: var(--text-dark); margin-bottom: 8px; }
  .empty-subtitle { color: var(--text-light); font-size: 14px; font-weight: 600; }

  /* ===== ANIMATIONS ===== */
  @keyframes splashPop {
    from { transform: scale(0.5); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes splashFade {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.6; }
    50% { transform: scale(1.4); opacity: 1; }
  }
  @keyframes postIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes heartPop {
    0% { transform: scale(1); }
    50% { transform: scale(1.5); }
    100% { transform: scale(1); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
`;

// ===== DATA =====
const USERS = [
  { id: 1, name: "Alex Rivera", handle: "@alexr", avatar: "🦊", gradient: "linear-gradient(135deg, #FF6B6B, #FFE66D)" },
  { id: 2, name: "Mia Chen", handle: "@mia.c", avatar: "🌸", gradient: "linear-gradient(135deg, #C3A6FF, #45B7D1)" },
  { id: 3, name: "Jordan K", handle: "@jordank", avatar: "🐻", gradient: "linear-gradient(135deg, #4ECDC4, #FFE66D)" },
  { id: 4, name: "Sofia L", handle: "@sofial", avatar: "🦋", gradient: "linear-gradient(135deg, #FFB347, #FF6B6B)" },
  { id: 5, name: "Noah M", handle: "@noahm", avatar: "🐺", gradient: "linear-gradient(135deg, #45B7D1, #C3A6FF)" },
];

const STORIES = [
  { id: 0, name: "Your Story", avatar: "😊", isOwn: true, gradient: "linear-gradient(135deg, #FF6B6B, #FFE66D)", content: "🌅", bg: "linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)" },
  { id: 1, name: "Alex", avatar: "🦊", gradient: "linear-gradient(135deg, #FF6B6B, #FFE66D)", content: "🦊", bg: "linear-gradient(135deg, #FF6B6B 0%, #FFB347 100%)", seen: false },
  { id: 2, name: "Mia", avatar: "🌸", gradient: "linear-gradient(135deg, #C3A6FF, #45B7D1)", content: "🌸", bg: "linear-gradient(135deg, #C3A6FF 0%, #45B7D1 100%)", seen: false },
  { id: 3, name: "Jordan", avatar: "🐻", gradient: "linear-gradient(135deg, #4ECDC4, #FFE66D)", content: "🐻", bg: "linear-gradient(135deg, #4ECDC4 0%, #FFE66D 100%)", seen: true },
  { id: 4, name: "Sofia", avatar: "🦋", gradient: "linear-gradient(135deg, #FFB347, #FF6B6B)", content: "🦋", bg: "linear-gradient(135deg, #FFB347 0%, #FF6B6B 100%)", seen: false },
  { id: 5, name: "Noah", avatar: "🐺", gradient: "linear-gradient(135deg, #45B7D1, #C3A6FF)", content: "🐺", bg: "linear-gradient(135deg, #45B7D1 0%, #C3A6FF 100%)", seen: true },
];

const POSTS = [
  { id: 1, user: USERS[0], location: "📍 Tokyo, Japan", media: "🗼", bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", likes: 2847, caption: "Golden hour in Tokyo never disappoints ✨ Every corner here is pure magic!", hashtags: "#tokyo #travel #goldenhour", time: "2 hours ago", isReel: false, liked: false, saved: false },
  { id: 2, user: USERS[1], location: "📍 Bali, Indonesia", media: "🌊", bg: "linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)", likes: 1523, caption: "The ocean called and I answered 🌊 Best decision ever!", hashtags: "#bali #ocean #paradise", time: "4 hours ago", isReel: false, liked: true, saved: false },
  { id: 3, user: USERS[2], location: "📍 NYC, USA", media: "🎭", bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", likes: 934, caption: "City lights and late nights 🌃 This city never sleeps!", hashtags: "#nyc #citylife #nightout", time: "6 hours ago", isReel: true, liked: false, saved: true },
  { id: 4, user: USERS[3], location: "📍 Paris, France", media: "🥐", bg: "linear-gradient(135deg, #FFB347 0%, #FFE66D 100%)", likes: 4201, caption: "Morning croissants in Paris hit different ☕ Bonjour world!", hashtags: "#paris #breakfast #france", time: "8 hours ago", isReel: false, liked: false, saved: false },
  { id: 5, user: USERS[4], location: "📍 Sydney, Australia", media: "🦘", bg: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", likes: 756, caption: "Made a friend today 🦘 Australia is absolutely wild (literally)!", hashtags: "#sydney #australia #kangaroo", time: "12 hours ago", isReel: true, liked: true, saved: false },
];

const REELS = [
  { id: 1, user: USERS[0], media: "🏄", bg: "linear-gradient(135deg, #0f3460 0%, #16213e 100%)", caption: "Catching the biggest wave of my life! 🏄‍♂️", music: "🎵 Good Vibes — Summer Mix", likes: "48.2K", comments: "1.2K", shares: "892", saved: false },
  { id: 2, user: USERS[1], media: "💃", bg: "linear-gradient(135deg, #c94b4b 0%, #4b134f 100%)", caption: "POV: you learned this dance in 10 minutes 💃", music: "🎵 Trending Sound #viral", likes: "124K", comments: "3.4K", shares: "5.6K", saved: false },
  { id: 3, user: USERS[2], media: "🍜", bg: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)", caption: "Secret ramen spot in Shibuya 🍜 NO TOURISTS ever!", music: "🎵 Lo-fi Chill Beats", likes: "31.7K", comments: "987", shares: "2.1K", saved: true },
];

const NOTIFS = [
  { id: 1, user: USERS[0], type: "like", text: "liked your photo", time: "2m", thumb: "🗼", new: true },
  { id: 2, user: USERS[1], type: "follow", text: "started following you", time: "15m", new: true, followed: false },
  { id: 3, user: USERS[2], type: "comment", text: 'commented: "This is so beautiful! 😍"', time: "1h", thumb: "🌊", new: true },
  { id: 4, user: USERS[3], type: "like", text: "and 47 others liked your reel", time: "2h", thumb: "🎭", new: false },
  { id: 5, user: USERS[4], type: "reel", text: "shared a new reel you might like", time: "3h", thumb: "🦘", new: false },
  { id: 6, user: USERS[0], type: "follow", text: "started following you", time: "5h", new: false, followed: true },
  { id: 7, user: USERS[1], type: "comment", text: 'replied to your comment: "Facts! 🙌"', time: "8h", thumb: "🥐", new: false },
];

const EXPLORE_ITEMS = [
  { id: 1, emoji: "🌋", big: true, video: false, likes: "12.4K" },
  { id: 2, emoji: "🐠", big: false, video: false, likes: "4.2K" },
  { id: 3, emoji: "🎪", big: false, video: true, likes: "8.9K" },
  { id: 4, emoji: "🦁", big: false, video: false, likes: "3.1K" },
  { id: 5, emoji: "🏔️", big: false, video: true, likes: "22.7K" },
  { id: 6, emoji: "🎨", big: false, video: false, likes: "5.5K" },
  { id: 7, emoji: "🌺", big: true, video: false, likes: "9.8K" },
  { id: 8, emoji: "🦚", big: false, video: false, likes: "7.3K" },
  { id: 9, emoji: "🎡", big: false, video: true, likes: "15.2K" },
  { id: 10, emoji: "🍣", big: false, video: false, likes: "6.1K" },
  { id: 11, emoji: "🌙", big: false, video: false, likes: "11.4K" },
  { id: 12, emoji: "🎸", big: false, video: true, likes: "18.9K" },
];

// ===== COMPONENTS =====

function StoryViewer({ story, onClose }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setProgress(0);
    const t = setTimeout(() => setProgress(100), 50);
    const close = setTimeout(onClose, 4100);
    return () => { clearTimeout(t); clearTimeout(close); };
  }, [story]);

  return (
    <div className="story-viewer">
      <div className="story-progress-bars">
        {[0,1,2].map(i => (
          <div key={i} className="story-progress-bar">
            <div className="story-progress-fill" style={i === 0 ? { width: `${progress}%`, transition: progress === 0 ? 'none' : 'width 4s linear' } : i < 0 ? { width: '100%' } : {}} />
          </div>
        ))}
      </div>
      <div className="story-header">
        <div className="post-avatar" style={{ background: story.gradient }}>{story.avatar}</div>
        <div className="story-user-info">
          <div className="story-user-name">{story.name}</div>
          <div className="story-user-time">Just now</div>
        </div>
        <div className="story-close" onClick={onClose}>✕</div>
      </div>
      <div className="story-content">
        <div className="story-gradient" style={{ background: story.bg }} />
        <span style={{ position: 'relative', zIndex: 1 }}>{story.content}</span>
      </div>
      <div className="story-reply">
        <input className="story-reply-input" placeholder={`Reply to ${story.name}...`} />
        <button className="story-reply-btn">❤️</button>
      </div>
    </div>
  );
}

function PostCard({ post, onLike, onSave }) {
  return (
    <div className="post-card" style={{ animationDelay: `${post.id * 0.05}s` }}>
      <div className="post-header">
        <div className="post-avatar" style={{ background: post.user.gradient }}>{post.user.avatar}</div>
        <div className="post-user-info">
          <div className="post-username">{post.user.name}</div>
          <div className="post-location">{post.location}</div>
        </div>
        <div className="post-menu">···</div>
      </div>
      <div className="post-media">
        <div className="post-media-gradient" style={{ background: post.bg }}>{post.media}</div>
        {post.isReel && <div className="post-video-badge">▶ Reel</div>}
      </div>
      <div className="post-actions">
        <button className={`action-btn ${post.liked ? 'liked' : ''}`} onClick={() => onLike(post.id)}>
          <span className="action-icon">{post.liked ? '❤️' : '🤍'}</span>
        </button>
        <button className="action-btn">
          <span className="action-icon">💬</span>
        </button>
        <button className="action-btn">
          <span className="action-icon">📤</span>
        </button>
        <div className="action-spacer" />
        <button className={`action-btn`} onClick={() => onSave(post.id)}>
          <span className="action-icon">{post.saved ? '🔖' : '🏷️'}</span>
        </button>
      </div>
      <div className="post-likes">{(post.likes + (post.liked ? 1 : 0)).toLocaleString()} likes</div>
      <div className="post-caption">
        <span>{post.user.name.split(' ')[0]}</span> {post.caption} <span className="post-hashtags">{post.hashtags}</span>
      </div>
      <div className="post-time">{post.time}</div>
    </div>
  );
}

function ReelCard({ reel, onLike, onSave }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(reel.saved);
  const [followed, setFollowed] = useState(false);
  return (
    <div className="reel-card">
      <div className="reel-bg" style={{ background: reel.bg }}>{reel.media}</div>
      <div className="reel-play-btn">▶</div>
      <div className="reel-actions">
        <div className="reel-action" onClick={() => setLiked(!liked)}>
          <div className="reel-action-icon">{liked ? '❤️' : '🤍'}</div>
          <div className="reel-action-count">{reel.likes}</div>
        </div>
        <div className="reel-action">
          <div className="reel-action-icon">💬</div>
          <div className="reel-action-count">{reel.comments}</div>
        </div>
        <div className="reel-action">
          <div className="reel-action-icon">📤</div>
          <div className="reel-action-count">{reel.shares}</div>
        </div>
        <div className="reel-action" onClick={() => setSaved(!saved)}>
          <div className="reel-action-icon">{saved ? '🔖' : '🏷️'}</div>
        </div>
      </div>
      <div className="reel-overlay">
        <div className="reel-user">
          <div className="reel-avatar" style={{ background: reel.user.gradient }}>{reel.user.avatar}</div>
          <span className="reel-username">{reel.user.name}</span>
          {!followed && <span className="reel-follow" onClick={() => setFollowed(true)}>+ Follow</span>}
        </div>
        <div className="reel-caption">{reel.caption}</div>
        <div className="reel-music">{reel.music}</div>
      </div>
    </div>
  );
}

// ===== SCREENS =====

function HomeScreen() {
  const [posts, setPosts] = useState(POSTS);
  const [activeStory, setActiveStory] = useState(null);

  const handleLike = (id) => {
    setPosts(p => p.map(post => post.id === id ? { ...post, liked: !post.liked } : post));
  };
  const handleSave = (id) => {
    setPosts(p => p.map(post => post.id === id ? { ...post, saved: !post.saved } : post));
  };

  return (
    <div style={{ paddingBottom: 0 }}>
      {activeStory && <StoryViewer story={activeStory} onClose={() => setActiveStory(null)} />}
      <div className="stories-row">
        {STORIES.map(s => (
          <div key={s.id} className="story-item" onClick={() => !s.isOwn && setActiveStory(s)}>
            <div className={`story-ring ${s.seen ? 'seen' : ''} ${s.isOwn ? 'add-story' : ''}`}>
              <div className="story-avatar">
                {s.avatar}
                {s.isOwn && <div className="story-add-icon">+</div>}
              </div>
            </div>
            <div className="story-name">{s.name}</div>
          </div>
        ))}
      </div>
      <div className="feed">
        {posts.map(post => (
          <PostCard key={post.id} post={post} onLike={handleLike} onSave={handleSave} />
        ))}
      </div>
    </div>
  );
}

function ReelsScreen() {
  return (
    <div style={{ padding: '16px 0 calc(var(--nav-height) + 20px)' }}>
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'Pacifico, cursive', fontSize: 22, background: 'linear-gradient(135deg, #FF6B6B, #C3A6FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Reels</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="icon-btn">📹</div>
          </div>
        </div>
      </div>
      {REELS.map(reel => <ReelCard key={reel.id} reel={reel} />)}
    </div>
  );
}

function ExploreScreen() {
  const [activeTag, setActiveTag] = useState("All");
  const tags = ["All", "Travel", "Food", "Art", "Music", "Nature", "Fashion", "Sports"];
  return (
    <div>
      <div className="explore-search">
        <div className="search-box">
          <span style={{ fontSize: 18 }}>🔍</span>
          <input className="search-input" placeholder="Search people, places, tags..." />
        </div>
      </div>
      <div className="explore-tags">
        {tags.map(tag => (
          <button key={tag} className={`tag-chip ${activeTag === tag ? 'active' : ''}`} onClick={() => setActiveTag(tag)}>{tag}</button>
        ))}
      </div>
      <div className="explore-grid">
        {EXPLORE_ITEMS.map((item, i) => (
          <div key={item.id} className={`grid-item ${item.big ? 'big' : ''}`}
            style={{ background: `linear-gradient(${i * 35}deg, hsl(${i * 30},70%,85%), hsl(${i * 30 + 60},70%,90%))` }}>
            {item.emoji}
            {item.video && <div className="grid-item-badge">▶ Reel</div>}
            <div className="grid-item-likes">❤️ {item.likes}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsScreen() {
  const [notifs, setNotifs] = useState(NOTIFS);
  const toggleFollow = (id) => {
    setNotifs(n => n.map(notif => notif.id === id ? { ...notif, followed: !notif.followed } : notif));
  };
  const newNotifs = notifs.filter(n => n.new);
  const oldNotifs = notifs.filter(n => !n.new);
  const typeIcons = { like: '❤️', comment: '💬', follow: '👤', reel: '▶️' };
  const typeColors = { like: 'like', comment: 'comment', follow: 'follow', reel: 'reel' };

  const renderNotif = (notif) => (
    <div key={notif.id} className="notif-item">
      <div className="notif-avatar" style={{ background: notif.user.gradient }}>
        {notif.user.avatar}
        <div className={`notif-type-badge ${typeColors[notif.type]}`}>{typeIcons[notif.type]}</div>
      </div>
      <div className="notif-text">
        <strong>{notif.user.name}</strong> {notif.text}
        <div className="notif-time">{notif.time} ago</div>
      </div>
      {notif.thumb ? (
        <div className="notif-thumb">{notif.thumb}</div>
      ) : (
        <button className={`follow-btn ${notif.followed ? 'following' : 'follow'}`}
          onClick={() => toggleFollow(notif.id)}>
          {notif.followed ? 'Following' : 'Follow'}
        </button>
      )}
    </div>
  );

  return (
    <div style={{ paddingBottom: 'calc(var(--nav-height) + 20px)' }}>
      <div className="notif-section">
        <div className="notif-section-title">🔥 New</div>
        {newNotifs.map(renderNotif)}
      </div>
      <div className="notif-section">
        <div className="notif-section-title">Earlier</div>
        {oldNotifs.map(renderNotif)}
      </div>
    </div>
  );
}

function ProfileScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const profileEmojis = ["🌅","🏔️","🎨","🦊","🌊","🎭","🥐","🦘","🌙","🎸","🌺","🎡"];
  return (
    <div style={{ paddingBottom: 'calc(var(--nav-height) + 20px)' }}>
      <div className="profile-header">
        <div className="profile-cover-emoji">✨</div>
        <div className="profile-info">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar-ring" />
            <div className="profile-avatar">😊</div>
          </div>
          <div className="profile-name">You</div>
          <div className="profile-handle">@yourhandle</div>
          <div className="profile-bio">✨ Living life one photo at a time 📸 | Adventure seeker 🌍</div>
        </div>
      </div>
      <div className="profile-stats">
        <div className="stat"><div className="stat-num">247</div><div className="stat-label">Posts</div></div>
        <div className="stat"><div className="stat-num">12.4K</div><div className="stat-label">Followers</div></div>
        <div className="stat"><div className="stat-num">891</div><div className="stat-label">Following</div></div>
      </div>
      <div className="profile-actions">
        <button className="btn-edit">Edit Profile</button>
        <div className="btn-share">📤</div>
        <div className="btn-share">⚙️</div>
      </div>
      <div className="highlights-row">
        {[["🌍","Travel"],["🍕","Food"],["🎨","Art"],["🏋️","Fitness"],["+ New","Add"]].map(([icon, label]) => (
          <div key={label} className="highlight">
            <div className="highlight-ring">
              <div className="highlight-inner">{icon}</div>
            </div>
            <div className="highlight-label">{label}</div>
          </div>
        ))}
      </div>
      <div className="profile-tabs">
        {["⊞", "🎬", "🔖"].map((icon, i) => (
          <div key={i} className={`profile-tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>{icon}</div>
        ))}
      </div>
      <div className="profile-grid">
        {profileEmojis.map((emoji, i) => (
          <div key={i} className="profile-grid-item"
            style={{ background: `linear-gradient(${i * 30}deg, hsl(${i * 25},65%,82%), hsl(${i * 25 + 50},65%,88%))` }}>
            {emoji}
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== MAIN APP =====
export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [screen, setScreen] = useState("login"); // login | signup | main
  const [activeTab, setActiveTab] = useState("home");
  const [showPostModal, setShowPostModal] = useState(false);
  const [notifCount] = useState(3);

  useEffect(() => {
    const t = setTimeout(() => setSplashDone(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const tabs = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "explore", icon: "🔍", label: "Explore" },
    null, // post button
    { id: "reels", icon: "▶️", label: "Reels" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  const renderScreen = () => {
    if (screen === "login") return <LoginScreen onLogin={() => setScreen("main")} onSwitch={() => setScreen("signup")} />;
    if (screen === "signup") return <SignupScreen onSignup={() => setScreen("main")} onSwitch={() => setScreen("login")} />;
    if (activeTab === "home") return <HomeScreen />;
    if (activeTab === "explore") return <ExploreScreen />;
    if (activeTab === "reels") return <ReelsScreen />;
    if (activeTab === "notifications") return <NotificationsScreen />;
    if (activeTab === "profile") return <ProfileScreen />;
  };

  const isMain = screen === "main";

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* Splash */}
        <div className={`splash ${splashDone ? 'hidden' : ''}`}>
          <div className="splash-logo">Vibe</div>
          <div className="splash-tagline">Share your world 🌍</div>
          <div className="splash-dots">
            <div className="splash-dot" /><div className="splash-dot" /><div className="splash-dot" />
          </div>
        </div>

        {/* Top Nav */}
        {isMain && (
          <div className="top-nav">
            <div className="nav-logo">Vibe</div>
            <div className="nav-actions">
              <div className="icon-btn" onClick={() => setActiveTab("notifications")}>
                🔔
                {notifCount > 0 && <div className="notif-badge">{notifCount}</div>}
              </div>
              <div className="icon-btn">💬</div>
            </div>
          </div>
        )}

        {/* Content */}
        <div style={{ overflowY: 'auto', height: isMain ? 'calc(100vh - 56px)' : '100vh' }}>
          {renderScreen()}
        </div>

        {/* Bottom Nav */}
        {isMain && (
          <div className="bottom-nav">
            {tabs.map((tab, i) => tab === null ? (
              <button key="post" className="nav-post-btn" onClick={() => setShowPostModal(true)}>＋</button>
            ) : (
              <div key={tab.id} className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}>
                <div className="nav-icon">{tab.icon}</div>
                <div className="nav-label">{tab.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Post Modal */}
        {showPostModal && (
          <div className="modal-overlay" onClick={() => setShowPostModal(false)}>
            <div className="modal-sheet" onClick={e => e.stopPropagation()}>
              <div className="modal-handle" />
              <div className="modal-title">Create New Post</div>
              <div className="post-type-grid">
                {[
                  { cls: "photo", icon: "📷", label: "Photo" },
                  { cls: "video", icon: "🎬", label: "Video" },
                  { cls: "reel", icon: "🎞️", label: "Reel" },
                  { cls: "story", icon: "✨", label: "Story" },
                  { cls: "live", icon: "🔴", label: "Go Live" },
                  { cls: "text", icon: "💬", label: "Text" },
                ].map(t => (
                  <button key={t.cls} className={`post-type-btn ${t.cls}`} onClick={() => setShowPostModal(false)}>
                    <div className="post-type-icon">{t.icon}</div>
                    {t.label}
                  </button>
                ))}
              </div>
              <button className="btn-primary" onClick={() => setShowPostModal(false)} style={{ marginTop: 0 }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function LoginScreen({ onLogin, onSwitch }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  return (
    <div className="auth-screen">
      <div className="auth-header">
        <div className="auth-logo">Vibe</div>
        <div className="auth-subtitle">Share your world 🌍</div>
      </div>
      <div className="auth-illustration">
        {["🌅","📸","🎭","🌊","✨"].map((e, i) => (
          <div key={i} className="auth-bubble">
            <div className="auth-bubble-inner" style={{ background: `hsl(${i * 50 + 10},80%,88%)` }}>{e}</div>
          </div>
        ))}
      </div>
      <div className="auth-form">
        <div className="input-group">
          <label className="input-label">Email or Username</label>
          <input className="input-field" type="text" placeholder="you@vibe.app" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="input-group">
          <label className="input-label">Password</label>
          <input className="input-field" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={onLogin}>Log In 🚀</button>
        <div style={{ textAlign: 'right', marginTop: 4 }}>
          <span style={{ color: 'var(--coral)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Forgot password?</span>
        </div>
        <div className="auth-divider">
          <div className="auth-divider-line" />
          <div className="auth-divider-text">or</div>
          <div className="auth-divider-line" />
        </div>
        <button className="btn-social">🌐 Continue with Google</button>
        <button className="btn-social">🍎 Continue with Apple</button>
      </div>
      <div className="auth-switch">
        Don't have an account? <span className="auth-link" onClick={onSwitch}>Sign up</span>
      </div>
    </div>
  );
}

function SignupScreen({ onSignup, onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  return (
    <div className="auth-screen">
      <div className="auth-header">
        <div className="auth-logo">Vibe</div>
        <div className="auth-subtitle">Join the community 🎉</div>
      </div>
      <div className="auth-form">
        <div className="input-group">
          <label className="input-label">Full Name</label>
          <input className="input-field" type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="input-group">
          <label className="input-label">Email</label>
          <input className="input-field" type="email" placeholder="you@vibe.app" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="input-group">
          <label className="input-label">Password</label>
          <input className="input-field" type="password" placeholder="Min 8 characters" value={pass} onChange={e => setPass(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={onSignup}>Create Account 🎉</button>
        <div className="auth-divider">
          <div className="auth-divider-line" />
          <div className="auth-divider-text">or</div>
          <div className="auth-divider-line" />
        </div>
        <button className="btn-social">🌐 Sign up with Google</button>
        <button className="btn-social">🍎 Sign up with Apple</button>
        <div style={{ fontSize: 11, color: 'var(--text-light)', textAlign: 'center', fontWeight: 600, marginTop: 4 }}>
          By signing up you agree to our Terms & Privacy Policy
        </div>
      </div>
      <div className="auth-switch">
        Already have an account? <span className="auth-link" onClick={onSwitch}>Log in</span>
      </div>
    </div>
  );
}
