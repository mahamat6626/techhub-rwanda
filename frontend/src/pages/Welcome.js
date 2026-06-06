import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div className="welcome-page">
      {/* Animated background orbs */}
      <div className="welcome-orb welcome-orb-1" />
      <div className="welcome-orb welcome-orb-2" />
      <div className="welcome-orb welcome-orb-3" />
      <div className="welcome-orb welcome-orb-4" />

      {/* Grid overlay */}
      <div className="welcome-grid" />

      <div className={`welcome-content ${visible ? 'welcome-visible' : ''}`}>

        {/* Logo */}
        <div className="welcome-logo-wrap">
          <div className="welcome-logo-icon">⚡</div>
          <span className="welcome-logo-text">TechHub <span>Rwanda</span></span>
        </div>

        {/* Headline */}
        <h1 className="welcome-title">
          Rwanda's #1<br />
          <span className="welcome-title-accent">Electronics Store</span>
        </h1>

        <p className="welcome-subtitle">
          Phones · Laptops · TVs · Audio · Accessories<br />
          Genuine products. Best prices. Delivered in Kigali.
        </p>

        {/* Stats row */}
        <div className="welcome-stats">
          <div className="welcome-stat">
            <span className="welcome-stat-num">45+</span>
            <span className="welcome-stat-lbl">Products</span>
          </div>
          <div className="welcome-stat">
            <span className="welcome-stat-num">5</span>
            <span className="welcome-stat-lbl">Categories</span>
          </div>
          <div className="welcome-stat">
            <span className="welcome-stat-num">24h</span>
            <span className="welcome-stat-lbl">Delivery</span>
          </div>
          <div className="welcome-stat">
            <span className="welcome-stat-num">100%</span>
            <span className="welcome-stat-lbl">Genuine</span>
          </div>
        </div>

        {/* CTA */}
        <button
          className="welcome-btn"
          onClick={() => navigate('/home')}
        >
          <span>Enter Store</span>
          <span className="welcome-btn-arrow">→</span>
        </button>

        <p className="welcome-tagline">🇷🇼 Proudly serving Kigali, Rwanda</p>
      </div>

      {/* Floating product icons */}
      <div className="welcome-float welcome-float-1">📱</div>
      <div className="welcome-float welcome-float-2">💻</div>
      <div className="welcome-float welcome-float-3">🎧</div>
      <div className="welcome-float welcome-float-4">📺</div>
      <div className="welcome-float welcome-float-5">⌚</div>
      <div className="welcome-float welcome-float-6">🔌</div>
    </div>
  );
};

export default Welcome;
