import React, { useState } from 'react'
import Navbar from '../components/Navbar';
import '../styles/Resources.css';
import Footer from '../components/Footer';
const Resources = () => {
  const [activeTab, setActiveTab] = useState('features');

  const features = [
    {
      id: 1,
      title: 'Create & Share Posts',
      description: 'Share your projects, ideas, and progress with the Dev-connect community. Get feedback and collaborate with fellow developers.',
      icon: '📝',
      link: '#'
    },
    {
      id: 2,
      title: 'Showcase Projects',
      description: 'Build your portfolio by showcasing your best projects. Get discovered by potential collaborators and employers.',
      icon: '🎯',
      link: '#'
    },
    {
      id: 3,
      title: 'Find & Connect',
      description: 'Discover and connect with developers who share your interests. Build meaningful professional relationships.',
      icon: '🤝',
      link: '#'
    },
    {
      id: 4,
      title: 'Join Communities ( Soon )',
      description: 'Participate in topic-based communities. Learn, share knowledge, and grow together with like-minded developers.',
      icon: '👥',
      link: '#'
    },
    {
      id: 5,
      title: 'Real-time Messaging',
      description: 'Connect instantly with other developers through direct messaging. Collaborate on ideas in real-time.',
      icon: '💬',
      link: '#'
    },
    {
      id: 6,
      title: 'Marketplace ( Soon )',
      description: 'Buy, sell, or trade development services. Monetize your skills or find help for your projects.',
      icon: '🛍️',
      link: '#'
    }
  ];

  const guidelines = [
    {
      id: 1,
      name: 'Community Guidelines',
      description: 'Be respectful, inclusive, and professional. No spam, harassment, or inappropriate content.',
      url: '#'
    },
    {
      id: 2,
      name: 'Posting Standards',
      description: 'Keep posts relevant, clear, and well-formatted. Include proper descriptions and tags.',
      url: '#'
    },
    {
      id: 3,
      name: 'Project Submission ( soon )',
      description: 'Submit projects with documentation, images, and tech stack details for better visibility.',
      url: '#'
    },
    {
      id: 4,
      name: 'Code of Conduct',
      description: 'Uphold ethical standards. Respect intellectual property and maintain professional conduct.',
      url: '#'
    },
    {
      id: 5,
      name: 'Safety & Privacy',
      description: 'Protect your personal information. Never share sensitive data or credentials publicly.',
      url: '#'
    },
    {
      id: 6,
      name: 'Report Issues',
      description: 'Found something inappropriate? Report it to our moderation team immediately.',
      url: '#'
    }
  ];

  const faq = [
    {
      id: 1,
      title: 'How to Create a Project?',
      answer: 'Go to Community > Create Project. Fill in project details, upload images, and publish it. Your project will be visible to all members.'
    },
    {
      id: 2,
      title: 'How to Connect with Other Developers?',
      answer: 'Visit the "Find Friends" page, browse developer profiles, and send connection requests. Once accepted, you can message them directly.'
    },
    {
      id: 3,
      title: 'Can I Monetize My Skills? ( soon )',
      answer: 'Yes! Use the Marketplace to offer services or sell projects. You can set your own prices and manage transactions securely.'
    },
    {
      id: 4,
      title: 'How Do Groups Work? ( soon )',
      answer: 'Join groups based on your interests or create your own. Share resources, collaborate, and discuss topics relevant to the group.'
    },
  ];

  const bestPractices = [
    { 
      id: 1, 
      title: 'Complete Your Profile', 
      tip: 'Add a professional photo, bio, skills, and portfolio links. A complete profile gets 3x more engagement.' 
    },
    { 
      id: 2, 
      title: 'Engage Regularly', 
      tip: 'Post, comment, and respond to others. Active members build stronger networks and opportunities.' 
    },
    { 
      id: 3, 
      title: 'Use Descriptive Titles', 
      tip: 'When posting or sharing projects, use clear titles and descriptions so others can find you easily.' 
    },
    { 
      id: 4, 
      title: 'Respect Others\' Work', 
      tip: 'Give credit where due. Support the community by commenting on and sharing others\' projects.' 
    },
  ];

  return (
    <>
      <Navbar />
      <div className="resources-container">
        {/* Hero Section */}
        <section className="resources-hero">
          <div className="hero-content">
            <h1>Dev-connect Resources</h1>
            <p>Everything you need to make the most of our community platform</p>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="resources-tabs">
          <button 
            className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`}
            onClick={() => setActiveTab('features')}
          >
            ✨ Platform Features
          </button>
          <button 
            className={`tab-btn ${activeTab === 'guidelines' ? 'active' : ''}`}
            onClick={() => setActiveTab('guidelines')}
          >
            📋 Guidelines
          </button>
          <button 
            className={`tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            ❓ FAQ
          </button>
          <button 
            className={`tab-btn ${activeTab === 'bestpractices' ? 'active' : ''}`}
            onClick={() => setActiveTab('bestpractices')}
          >
            💡 Best Practices
          </button>
        </section>

        {/* Content Sections */}
        <div className="resources-content">
          {/* Features Tab */}
          {activeTab === 'features' && (
            <section className="tab-content">
              <h2>Platform Features</h2>
              <div className="resources-grid">
                {features.map(feature => (
                  <div key={feature.id} className="resource-card">
                    <div className="card-header">
                      <span className="card-icon">{feature.icon}</span>
                    </div>
                    <h3>{feature.title}</h3>
                    <p className="description">{feature.description}</p>
                    <a href={feature.link} className="card-link">Learn More →</a>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Guidelines Tab */}
          {activeTab === 'guidelines' && (
            <section className="tab-content">
              <h2>Community Guidelines</h2>
              <div className="guidelines-grid">
                {guidelines.map(guideline => (
                  <div key={guideline.id} className="guideline-card">
                    <div className="guideline-number">{guideline.id}</div>
                    <h3>{guideline.name}</h3>
                    <p>{guideline.description}</p>
                    <a href={guideline.url} className="guideline-link">Read More</a>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <section className="tab-content">
              <h2>Frequently Asked Questions</h2>
              <div className="faq-list">
                {faq.map((item, index) => (
                  <div key={item.id} className="faq-card">
                    <div className="faq-number">{index + 1}</div>
                    <div className="faq-content">
                      <h3>{item.title}</h3>
                      <p>{item.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Best Practices Tab */}
          {activeTab === 'bestpractices' && (
            <section className="tab-content">
              <h2>Best Practices for Dev-connect</h2>
              <div className="practices-list">
                {bestPractices.map(item => (
                  <div key={item.id} className="practice-card">
                    <h3>{item.title}</h3>
                    <p>{item.tip}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* CTA Section */}
        <section className="resources-cta">
          <h2>Ready to Join Dev-connect?</h2>
          <p>Start building your network and showcase your projects today</p>
          <div className="cta-buttons">
            <button className="btn btn-primary">Explore the Platform</button>
            <button className="btn btn-secondary">Connect with Developers</button>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default Resources