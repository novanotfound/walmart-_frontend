import React from 'react';
import { useNavigate } from 'react-router-dom';

const WalmartRecycling = () => {
  const navigate = useNavigate();

  const handleKioskMode = () => {
    alert('Launching Kiosk Mode…');
  };

 const handleLaunchKiosk = () => {
  navigate('/kiosk-auth'); // Navigate to QR authentication first
  alert('Kiosk Mode Launched! Please scan your QR code to authenticate.');
};

  
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <style jsx>{`
        :root {
          --blue: #2e62d3;
          --yellow: #ffc220;
          --dark: #111;
          --light: #f5f5f5;
          --white: #fff;
          --gray: #666;
        }
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: "Inter", sans-serif;
          background: var(--light);
          color: var(--dark);
          line-height: 1.6;
        }

        /* Re‑usable max‑width wrapper */
        .container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* ───────── HEADER ───────── */
        header {
          background: var(--white);
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .logo {
          display: flex;
          align-items: center;
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--blue);
          gap: 0.45rem;
        }
        
        .logo img {
          width: 22px;
          height: 22px;
          animation: spin 6s linear infinite;
        }
        
        nav a {
          margin-left: 1.5rem;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--dark);
          transition: 0.3s;
          cursor: pointer;
        }
        
        nav a:hover {
          color: var(--blue);
        }

        /* ───────── HERO ───────── */
        .hero {
          background: linear-gradient(120deg, var(--yellow), var(--blue));
          color: var(--white);
          text-align: center;
          padding: 5rem 0 4rem;
        }
        
        .hero h1 {
          font-size: 2.6rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }
        
        .hero p {
          font-size: 1.05rem;
          margin-bottom: 2.1rem;
        }
        
        .btn {
          display: inline-block;
          border: none;
          cursor: pointer;
          font-weight: 600;
          border-radius: 10px;
          transition: 0.25s;
        }
        
        .btn-light {
          background: var(--white);
          color: var(--blue);
          padding: 1rem 2.4rem;
          font-size: 1rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .btn-light:hover {
          background: var(--yellow);
          color: var(--dark);
          transform: translateY(-2px);
        }

        /* ───────── EXPERIENCE SPLIT ───────── */
        .experience {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2.5rem;
          padding: 3rem 0;
          flex-wrap: wrap;
        }

        .exp-text {
          flex: 1;
          min-width: 300px;
          max-width: 520px;
        }
        
        .exp-text h2 {
          font-size: 1.7rem;
          margin-bottom: 1rem;
          color: var(--blue);
        }
        
        .exp-text p {
          margin-bottom: 1.1rem;
          color: #444;
        }
        
        .exp-text ul {
          list-style: none;
          padding: 0;
        }
        
        .exp-text li {
          position: relative;
          margin: 0.45rem 0;
          padding-left: 1.4rem;
          font-size: 0.95rem;
        }
        
        .exp-text li::before {
          content: "✔";
          position: absolute;
          left: 0;
          color: var(--blue);
          font-weight: 700;
        }
        
        .exp-demo {
          flex: 1;
          min-width: 300px;
          height: 360px;
          background: #eee;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ───────── HOW IT WORKS ───────── */
        .hiw {
          background: #fff;
          text-align: center;
          padding: 3.5rem 0;
        }
        
        .hiw h2 {
          font-size: 1.9rem;
          margin-bottom: 2.3rem;
          color: var(--blue);
        }
        
        .steps {
          display: flex;
          justify-content: center;
          gap: 3rem;
          flex-wrap: wrap;
        }
        
        .step {
          width: 230px;
        }
        
        .step img {
          width: 60px;
          margin-bottom: 1rem;
        }
        
        .step h3 {
          font-size: 1.05rem;
          margin-bottom: 0.5rem;
        }
        
        .step p {
          font-size: 0.9rem;
          color: #444;
        }

        /* ───────── CTA BANNER ───────── */
        .cta {
          background: linear-gradient(120deg, var(--yellow), var(--blue));
          color: var(--white);
          text-align: center;
          padding: 4rem 0;
        }
        
        .cta h2 {
          font-size: 1.55rem;
          margin-bottom: 1rem;
        }
        
        .cta p {
          margin-bottom: 2rem;
        }
        
        .btn-primary {
          background: var(--white);
          color: var(--blue);
          padding: 1rem 2.4rem;
          font-size: 1.05rem;
          border-radius: 8px;
        }
        
        .btn-primary:hover {
          background: var(--yellow);
          color: var(--dark);
          transform: translateY(-2px);
        }

        /* ───────── FOOTER ───────── */
        footer {
          background: #111;
          color: #ccc;
          padding: 3rem 0;
        }
        
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        }
        
        footer h4 {
          color: #fff;
          font-size: 1rem;
          margin-bottom: 1rem;
        }
        
        footer ul {
          list-style: none;
          padding: 0;
        }
        
        footer li {
          margin: 0.45rem 0;
          font-size: 0.9rem;
        }
        
        footer a {
          color: #ccc;
          text-decoration: none;
          font-size: 0.9rem;
          cursor: pointer;
        }
        
        footer a:hover {
          color: var(--yellow);
        }
        
        .footer-brand {
          display: flex;
          align-items: center;
          font-weight: 700;
          font-size: 1rem;
          gap: 0.45rem;
          margin-bottom: 0.8rem;
        }
        
        .footer-brand img {
          width: 20px;
          height: 20px;
        }
        
        .copy {
          grid-column: 1/-1;
          text-align: center;
          font-size: 0.8rem;
          color: #777;
          margin-top: 2rem;
        }

        /* ───────── UTILITIES ───────── */
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        @media (max-width: 800px) {
          .experience {
            flex-direction: column;
            text-align: center;
          }
          .exp-demo {
            height: 200px;
          }
          .steps {
            gap: 2rem;
          }
        }
        
        /* NEW — add anywhere in <style> */
        @keyframes swapSides {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .hero,
        .cta {
          /* your two‑color gradient */
          background: linear-gradient(120deg, var(--yellow), var(--blue));
          /* make the gradient sheet big enough to slide */
          background-size: 200% 200%;
          /* animate:   name        duration  easing         repeat  */
          animation: swapSides 4s ease-in-out infinite;
        }
      `}</style>

      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      {/* ========== HEADER ========== */}
      <header>
        <div className="logo">
          <img src="https://pics.clipartpng.com/Green_Recycle_Logo_PNG_Clip_Art-3212.png" alt="♻" />
          Walmart Recycling
        </div>
        <nav>
          <a onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a>
          <a onClick={(e) => { e.preventDefault(); scrollToSection('how'); }}>How It Works</a>
          <a onClick={(e) => { e.preventDefault(); scrollToSection('rewards'); }}>Rewards</a>
          <a onClick={(e) => { e.preventDefault(); scrollToSection('support'); }}>Support</a>
        </nav>
      </header>

      {/* ========== HERO ========== */}
      <section className="hero" id="home">
        <div className="container">
          <h1>Walmart Smart Recycling Kiosk</h1>
          <p>Scan. Recycle. Earn Rewards.</p>
          <button className="btn btn-light" onClick={handleKioskMode}>Enter Kiosk Mode</button>
        </div>
      </section>

      {/* ========== EXPERIENCE SPLIT ========== */}
      <section className="experience">
        <div className="container experience">
          <div className="exp-text">
            <h2>Experience the Future of Recycling</h2>
            <p>Our smart kiosk makes recycling easy and rewarding. Simply scan your items, drop them in the designated slots, and earn instant rewards for your environmental efforts.</p>
            <div style={{ gridColumn: '1/-1', height: '10px' }}></div>
            <ul>
              <li>Instant barcode scanning</li>
              <div style={{ gridColumn: '1/-1', height: '10px' }}></div>
              <li>Real‑time reward calculation</li>
              <div style={{ gridColumn: '1/-1', height: '10px' }}></div>
              <li>Touch‑friendly interface</li>
            </ul>
          </div>
          <div style={{ gridColumn: '1/-1', height: '10px' }}></div>
          <div className="exp-demo">
            <img
              src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGxmY2xtOWhjbjcxZnB2bGhiZjhxenF3a2RpY3Z6N3FjbmpyMzV3bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2Z8gvu6xRbqCHA0bYh/giphy.gif"
              alt="Recycle GIF"
              style={{ width: '100%', height: '120%', objectFit: 'cover', borderRadius: '12px' }}
            />
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="hiw" id="how">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <img src="https://img.icons8.com/ios/60/4a90e2/barcode-scanner--v1.png" alt="" />
              <h3>Scan Items</h3>
              <p>Use the built‑in scanner to identify recyclable items and calculate their value.</p>
            </div>
            <div className="step">
              <img src="https://img.icons8.com/ios/60/4a90e2/trash--v1.png" alt="" />
              <h3>Drop & Recycle</h3>
              <p>Place items in the appropriate recycling compartments for processing.</p>
            </div>
            <div className="step">
              <img src="https://img.icons8.com/ios/60/4a90e2/gift--v1.png" alt="" />
              <h3>Earn Rewards</h3>
              <p>Receive instant rewards and discounts for your recycling contributions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA BANNER ========== */}
      <section className="cta" id="rewards">
        <div className="container">
          <h2>Ready to Start Recycling?</h2>
          <p>Join thousands of customers who are making a difference while earning rewards.</p>
          <button className="btn btn-primary" onClick={handleLaunchKiosk}>Launch Kiosk Experience</button>
        </div>
      </section>

      {/* ========== SUPPORT SECTION ========== */}
      <section id="support">
      </section>

      {/* ========== FOOTER ========== */}
      <footer>
        <div className="container footer-grid">
          <div>
            <div className="footer-brand">
              <img src="https://cdn-icons-png.flaticon.com/512/187/187906.png" alt="" />
              Walmart Recycling
            </div>
            <p style={{ fontSize: '0.9rem' }}>Making recycling easier and more rewarding for everyone.</p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><a onClick={(e) => { e.preventDefault(); scrollToSection('how'); }}>How It Works</a></li>
              <li><a onClick={(e) => { e.preventDefault(); scrollToSection('rewards'); }}>Rewards Program</a></li>
              <li><a onClick={(e) => { e.preventDefault(); scrollToSection('support'); }}>Locations</a></li>
            </ul>
          </div>

          <div>
            <h4>Support</h4>
            <ul>
              <li><a onClick={(e) => { e.preventDefault(); scrollToSection('support'); }}>Help Center</a></li>
              <li><a onClick={(e) => { e.preventDefault(); scrollToSection('support'); }}>Contact Us</a></li>
              <li><a onClick={(e) => { e.preventDefault(); scrollToSection('support'); }}>Report Issue</a></li>
            </ul>
          </div>

          <div>
            <h4>Connect</h4>
            <ul style={{ display: 'flex', gap: '1rem' }}>
              <li><a href="#"><img src="https://img.icons8.com/ios-glyphs/24/ffffff/facebook-new.png" alt="Facebook logo" /></a></li>
              <li><a href="#"><img src="https://img.icons8.com/ios-glyphs/24/ffffff/twitter--v1.png" alt="" /></a></li>
              <li><a href="#"><img src="https://img.icons8.com/ios-glyphs/24/ffffff/instagram-new.png" alt="" /></a></li>
            </ul>
          </div>

          {/* Add space between footer columns */}
          <div style={{ gridColumn: '1/-1', height: '10px' }}></div>
        </div>

        <hr style={{ width: '90vw', border: 'none', height: '1px', background: '#444', margin: '0 auto' }} />

        <div className="copy">© 2025 Walmart Inc. All rights reserved.</div>
        <div className="copy">
          <ul>
            <li><a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default WalmartRecycling;