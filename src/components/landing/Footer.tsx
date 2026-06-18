import { Sparkles } from 'lucide-react';

const footerLinks = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'Agents', href: '#agents' },
    { label: 'Blueprint OS', href: '#blueprint' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'API', href: '#', badge: 'coming soon' },
  ],
  resources: [
    { label: 'Documentation', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Changelog', href: '#' },
    { label: 'Status', href: '#' },
    { label: 'Community', href: '#' },
  ],
  company: [
    { label: 'About', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer
      id="footer"
      className="border-t border-white/[0.06] bg-[#09090b]"
    >
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* ─── Grid ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1 — Brand */}
          <div className="col-span-2 md:col-span-1">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group mb-4">
              <span className="relative flex items-center justify-center w-8 h-8">
                <span className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300" />
                <Sparkles className="relative w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300" />
              </span>
              <span className="text-xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  JINI
                </span>
                <span className="text-zinc-500 font-normal">.ai</span>
              </span>
            </a>

            <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
              From Idea To Execution.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                id="footer-social-github"
                href="#"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-500 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-200"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a
                id="footer-social-twitter"
                href="#"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-500 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-200"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                id="footer-social-linkedin"
                href="#"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-500 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-200"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2 — Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-0.5">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors duration-200 block py-1"
                  >
                    {link.label}
                    {link.badge && (
                      <span className="ml-2 text-[10px] text-indigo-400/70 bg-indigo-500/10 px-1.5 py-0.5 rounded-full font-medium">
                        {link.badge}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              Resources
            </h4>
            <ul className="space-y-0.5">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors duration-200 block py-1"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-0.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors duration-200 block py-1"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ─── Bottom Bar ─── */}
        <div className="border-t border-white/[0.06] mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} JINI Intelligence. All rights reserved.
          </p>
          <p className="text-xs text-zinc-600 flex items-center gap-1.5">
            Built with
            <Sparkles className="w-3 h-3 text-indigo-500/50" />
            JINI Intelligence
          </p>
        </div>
      </div>
    </footer>
  );
}
