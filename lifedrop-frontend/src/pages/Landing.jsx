import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Droplets, Heart, Users, Activity, Shield, Clock,
  ArrowRight, Phone, MapPin, Mail, HandHeart, Stethoscope, Tent
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { inventoryApi, donorApi, campApi } from '../api/api';
import { Reveal, useCountUp } from '../components/Reveal';
import EcgLine from '../components/EcgLine';
import FloatingDrops from '../components/FloatingDrops';
import './Landing.css';

function AnimatedStat({ value, suffix = '', label }) {
  const [ref, display] = useCountUp(value);
  return (
    <div className="hero-stat" ref={ref}>
      <span className="stat-number">{display}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default function Landing() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({ donors: 0, units: 0, camps: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchLandingData();
  }, []);

  const fetchLandingData = async () => {
    try {
      const [invRes, donorsRes, totalRes, campsRes] = await Promise.allSettled([
        inventoryApi.getAllInventory(),
        donorApi.getDonorCount(),
        inventoryApi.getTotalUnits(),
        campApi.getActiveCampCount(),
      ]);
      if (invRes.status === 'fulfilled') setInventory(invRes.value.data);
      setStats({
        donors: donorsRes.status === 'fulfilled' ? donorsRes.value.data.totalDonors : 0,
        units: totalRes.status === 'fulfilled' ? totalRes.value.data.totalUnitsAvailable : 0,
        camps: campsRes.status === 'fulfilled' ? campsRes.value.data.activeCamps : 0,
      });
    } catch (err) {
      console.error('Error loading landing data:', err);
    }
  };

  const getStockLevel = (units) => {
    if (units === 0) return { label: 'EMPTY', color: '#c0392b' };
    if (units < 10) return { label: 'LOW', color: '#f39c12' };
    return { label: 'AVAILABLE', color: '#27ae60' };
  };

  return (
    <div className="landing-page">
      {/* ===== Top Navigation Bar ===== */}
      <nav className="landing-nav">
        <Link to="/" className="landing-brand">
          <Droplets size={28} color="#fff" />
          <span>LifeDrop</span>
        </Link>
        <div className={`landing-nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
          <a href="#inventory" onClick={() => setMobileMenuOpen(false)}>Blood Inventory</a>
          <a href="#how" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
          {user ? (
            <Link to="/dashboard" className="nav-cta-btn" onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="nav-login-btn" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" className="nav-cta-btn" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
        <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* ===== Hero Section ===== */}
      <section className="hero" id="home">
        <div className="hero-overlay" />
        <FloatingDrops />
        <div className="hero-content">
          <span className="hero-badge"><Heart size={14} className="icon-heartbeat" /> Every drop saves a life</span>
          <h1>Donate Blood, <span className="text-accent">Save Lives</span></h1>
          <p>
            Join LifeDrop's mission to connect donors with those in need.
            Your single donation can save up to three lives.
          </p>
          <EcgLine />
          <div className="hero-buttons">
            <Link to="/register" className="btn-hero btn-donate">
              <HandHeart size={20} /> Become a Donor
            </Link>
            <Link to="/register" className="btn-hero btn-request">
              <Stethoscope size={20} /> Need Blood?
            </Link>
          </div>
          <div className="hero-stats">
            <AnimatedStat value={stats.donors} suffix="+" label="Active Donors" />
            <AnimatedStat value={stats.units} label="Units Available" />
            <AnimatedStat value={stats.camps} label="Active Camps" />
          </div>
        </div>
      </section>

      {/* ===== Blood Inventory Section ===== */}
      <section className="section" id="inventory">
        <Reveal className="section-header-center">
          <span className="section-tag">Live Inventory</span>
          <h2>Blood Group Availability</h2>
          <p>Real-time stock levels across all blood types. Updated continuously.</p>
        </Reveal>
        {inventory.length > 0 ? (
          <div className="blood-grid">
            {inventory.map((item, index) => {
              const stock = getStockLevel(item.unitsAvailable);
              return (
                <Reveal key={item.id} className="blood-card" delay={index * 60}>
                  <div className="blood-drop">
                    <Droplets size={32} />
                    <span className="blood-type">{item.bloodGroup.replace('_', '')}</span>
                  </div>
                  <div className="blood-info">
                    <span className="blood-units">{item.unitsAvailable}</span>
                    <span className="blood-units-label">units</span>
                  </div>
                  <span className="stock-badge" style={{ background: `${stock.color}20`, color: stock.color }}>
                    {stock.label}
                  </span>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <Reveal className="inventory-empty">
            <Droplets size={48} />
            <p>Inventory will appear here once the system is live.</p>
          </Reveal>
        )}
      </section>

      {/* ===== How It Works Section ===== */}
      <section className="section how-section" id="how">
        <Reveal className="section-header-center">
          <span className="section-tag">Simple Process</span>
          <h2>How It Works</h2>
          <p>Three easy steps to start saving lives today.</p>
        </Reveal>
        <div className="steps-grid">
          <Reveal className="step-card" delay={0}>
            <div className="step-icon"><Users size={28} /></div>
            <h3>1. Register</h3>
            <p>Sign up as a donor or receiver in less than a minute. Tell us your blood group and contact info.</p>
          </Reveal>
          <Reveal className="step-card" delay={140}>
            <div className="step-icon"><Heart size={28} /></div>
            <h3>2. Donate or Request</h3>
            <p>Donors schedule donations. Receivers submit blood requests. We match them instantly.</p>
          </Reveal>
          <Reveal className="step-card" delay={280}>
            <div className="step-icon"><Activity size={28} /></div>
            <h3>3. Save Lives</h3>
            <p>Track your impact, monitor inventory, and know that you've made a real difference.</p>
          </Reveal>
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section className="section features-section">
        <Reveal className="section-header-center">
          <span className="section-tag">Why LifeDrop</span>
          <h2>Built for Everyone</h2>
        </Reveal>
        <div className="features-grid">
          <Reveal className="feature-card" delay={0}>
            <Shield size={32} />
            <h3>Safe & Verified</h3>
            <p>Every donor and receiver is verified. Track donations with full transparency.</p>
          </Reveal>
          <Reveal className="feature-card" delay={90}>
            <Clock size={32} />
            <h3>Quick Response</h3>
            <p>Emergency blood requests are processed and matched in record time.</p>
          </Reveal>
          <Reveal className="feature-card" delay={180}>
            <MapPin size={32} />
            <h3>Find Camps Near You</h3>
            <p>Discover upcoming blood donation camps in your area and join the movement.</p>
          </Reveal>
          <Reveal className="feature-card" delay={270}>
            <Activity size={32} />
            <h3>Live Tracking</h3>
            <p>Monitor blood inventory levels in real-time across all blood groups.</p>
          </Reveal>
        </div>
      </section>

      {/* ===== About Section ===== */}
      <section className="section about-section" id="about">
        <div className="about-grid">
          <Reveal className="about-left">
            <span className="section-tag">About Us</span>
            <h2>Who We Are</h2>
            <p className="about-lead">
              <strong>LifeDrop</strong> is a full-stack Blood Donation Management System built to bridge the gap between blood donors, hospitals (receivers), and blood banks across India.
            </p>
            <p>
              Every year, India faces a shortage of over 1 million units of blood. Our platform was created to solve this crisis by making blood donation accessible, transparent, and efficient — connecting donors with those who need blood the most.
            </p>
            <div className="about-highlights">
              <div className="about-highlight">
                <span className="about-num">3</span>
                <span className="about-desc">User Roles (Donor, Receiver, Admin)</span>
              </div>
              <div className="about-highlight">
                <span className="about-num">8</span>
                <span className="about-desc">Blood Groups Tracked</span>
              </div>
              <div className="about-highlight">
                <span className="about-num">90</span>
                <span className="about-desc">Days Eligibility Rule</span>
              </div>
            </div>
          </Reveal>
          <Reveal className="about-right" delay={150}>
            <h3>Our Mission</h3>
            <ul className="about-mission-list">
              <li>
                <Heart size={18} />
                <span>Ensure no patient suffers due to unavailability of blood</span>
              </li>
              <li>
                <Users size={18} />
                <span>Build a strong community of regular blood donors across India</span>
              </li>
              <li>
                <Droplets size={18} />
                <span>Maintain real-time blood inventory for all 8 blood groups</span>
              </li>
              <li>
                <Activity size={18} />
                <span>Provide hospitals with a fast and reliable blood request system</span>
              </li>
              <li>
                <Tent size={18} />
                <span>Organize and promote blood donation camps at colleges, offices, and public spaces</span>
              </li>
            </ul>

          </Reveal>
        </div>
      </section>

      {/* ===== CTA Banner ===== */}
      <section className="cta-banner">
        <Reveal className="cta-content">
          <Heart size={48} className="icon-heartbeat" />
          <h2>Ready to Make a Difference?</h2>
          <p>Your donation today could be someone's tomorrow. Join thousands of heroes who donate regularly.</p>
          <Link to="/register" className="btn-hero btn-donate">
            Get Started Now <ArrowRight size={20} />
          </Link>
        </Reveal>
      </section>

      {/* ===== Footer ===== */}
      <footer className="landing-footer">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-brand">
              <Droplets size={24} />
              <span>LifeDrop</span>
            </div>
            <p>Connecting donors and receivers to save lives, one drop at a time.</p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <a href="#home">Home</a>
            <a href="#inventory">Blood Inventory</a>
            <a href="#how">How It Works</a>
            <a href="#about">About Us</a>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <p><Phone size={14} /> +91 98765 43210</p>
            <p><Mail size={14} /> support@lifedrop.org</p>
            <p><MapPin size={14} /> MG Road, Bengaluru, Karnataka 560001</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 LifeDrop Blood Donation. Built with <Heart size={12} fill="#c0392b" /> for a better world.</p>
        </div>
      </footer>
    </div>
  );
}
