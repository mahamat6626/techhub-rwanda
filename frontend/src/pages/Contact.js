import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all required fields'); return;
    }
    setLoading(true);
    // Simulate sending (replace with real email API if needed)
    setTimeout(() => {
      setSent(true);
      setLoading(false);
      toast.success('Message sent! We\'ll reply within 24 hours.', { duration: 5000 });
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--slate-50)' }}>

      {/* ── Hero ── */}
      <div className="contact-hero">
        <div className="contact-hero-content">
          <div className="sec-label" style={{ justifyContent: 'center', marginBottom: 14 }}>Get in Touch</div>
          <h1 className="contact-hero-title">We'd Love to <span>Hear From You</span></h1>
          <p className="contact-hero-sub">
            Have a question about a product? Need help with your order?<br />
            Our team in Kigali is ready to help.
          </p>
        </div>
      </div>

      <div className="sec-inner" style={{ padding: '56px 28px' }}>

        {/* ── Info cards row ── */}
        <div className="contact-info-grid">
          {[
            { icon: '📞', title: 'Call Us', lines: ['+250 788 123 456', '+250 722 987 654'], sub: 'Mon–Sat, 8am–8pm' },
            { icon: '📧', title: 'Email Us', lines: ['support@techhub.rw', 'sales@techhub.rw'], sub: 'Reply within 24 hours' },
            { icon: '📍', title: 'Visit Us', lines: ['KG 123 Street, Kimihurura', 'Kigali, Rwanda'], sub: 'Mon–Sat, 9am–7pm' },
            { icon: '💬', title: 'WhatsApp', lines: ['+250 788 123 456'], sub: 'Quick response guaranteed' },
          ].map((c, i) => (
            <div key={i} className="contact-info-card">
              <div className="contact-info-icon">{c.icon}</div>
              <h3 className="contact-info-title">{c.title}</h3>
              {c.lines.map((l, j) => <p key={j} className="contact-info-line">{l}</p>)}
              <p className="contact-info-sub">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Main content: form + map ── */}
        <div className="contact-main-grid">

          {/* Form */}
          <div className="form-block">
            <h2 className="form-block-title">✉️ Send a Message</h2>

            {sent ? (
              <div className="contact-success">
                <span className="contact-success-icon">🎉</span>
                <h3 className="contact-success-title">Message Sent!</h3>
                <p className="contact-success-sub">
                  Thank you, <strong>{form.name}</strong>! We received your message and
                  will reply to <strong>{form.email}</strong> within 24 hours.
                </p>
                <button
                  className="btn-place-order"
                  style={{ marginTop: 20 }}
                  onClick={() => { setSent(false); setForm({ name:'',email:'',phone:'',subject:'',message:'' }); }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="contact-form-row">
                  <div className="form-field">
                    <label className="form-lbl">Full Name *</label>
                    <input name="name" value={form.name} onChange={handle}
                      placeholder="Your full name" className="form-inp" required />
                  </div>
                  <div className="form-field">
                    <label className="form-lbl">Email Address *</label>
                    <input type="email" name="email" value={form.email} onChange={handle}
                      placeholder="your@email.com" className="form-inp" required />
                  </div>
                </div>
                <div className="contact-form-row">
                  <div className="form-field">
                    <label className="form-lbl">Phone Number</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handle}
                      placeholder="0788 123 456" className="form-inp" />
                  </div>
                  <div className="form-field">
                    <label className="form-lbl">Subject</label>
                    <select name="subject" value={form.subject} onChange={handle} className="form-inp">
                      <option value="">Select a topic</option>
                      <option value="order">Order Inquiry</option>
                      <option value="product">Product Question</option>
                      <option value="delivery">Delivery Issue</option>
                      <option value="payment">Payment Problem</option>
                      <option value="return">Return / Refund</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-field">
                  <label className="form-lbl">Message *</label>
                  <textarea name="message" value={form.message} onChange={handle}
                    placeholder="Tell us how we can help you..."
                    className="form-txta" rows={5} required />
                </div>
                <button type="submit" className="btn-place-order" disabled={loading}>
                  {loading
                    ? <><div className="loading-spinner" style={{ width: 18, height: 18, borderWidth: 2, borderTopColor: '#07071a' }} />Sending...</>
                    : <>✉️ Send Message</>
                  }
                </button>
              </form>
            )}
          </div>

          {/* Map + extra info */}
          <div>
            {/* Google Maps embed — Kigali */}
            <div className="contact-map-wrap">
              <iframe
                title="TechHub Rwanda Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63799.41051580917!2d30.0187!3d-1.9441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca4258ed8e797%3A0xe32b4c3ee445c8e2!2sKigali%2C%20Rwanda!5e0!3m2!1sen!2srw!4v1234567890"
                className="contact-map"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* FAQ quick answers */}
            <div className="contact-faq">
              <h3 className="contact-faq-title">Quick Answers</h3>
              {[
                { q: 'How fast is delivery?', a: 'We deliver within Kigali in 24 hours on business days.' },
                { q: 'Do you offer returns?', a: 'Yes — 7-day return policy on all products in original condition.' },
                { q: 'Is payment secure?', a: 'Yes, we use PayPack, Rwanda\'s official Mobile Money gateway.' },
                { q: 'Are products genuine?', a: '100% — all products sourced from official distributors.' },
              ].map((item, i) => (
                <div key={i} className="contact-faq-item">
                  <div className="contact-faq-q">❓ {item.q}</div>
                  <div className="contact-faq-a">{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
