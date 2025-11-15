import React from 'react';

const Footer = () => {
  const sections = [
    {
      title: 'Platform',
      links: ['Marketplace', 'Community', 'Chat Spaces', 'Dashboard'],
    },
    {
      title: 'Resources',
      links: ['Documentation', 'API Reference', 'Guides', 'Support'],
    },
    {
      title: 'Company',
      links: ['About', 'Contact', 'Careers', 'Press'],
    },
    {
      title: 'Legal',
      links: ['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Compliance'],
    },
  ];

  return (
    <footer className="py-12 px-6 border-t border-white/10 bg-[rgba(11,19,43,0.6)]">
      <div className="max-w-7xl justify-items-center mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className="transition-transform hover:-translate-y-1 duration-200"
          >
            <h3 className="text-lg font-semibold text-[var(--color-text-strong)] mb-4">
              {section.title}
            </h3>
            <ul className="space-y-2">
              {section.links.map((link, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-white/70 hover:text-[var(--color-text-strong)] transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-white/60">
        © {new Date().getFullYear()} DevConnect. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;