import './globals.css';
import ChipiProviders from './ChipiProviders';
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* Run as early as possible to strip extension-injected attributes before React hydrates */}
        <Script id="pre-hydration-cleanup" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              var re = /^(bis_|__processed_)/;
              // iterate elements shallow-first to avoid touching large trees unnecessarily
              var walker = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT, null, false);
              var el;
              while ((el = walker.nextNode())) {
                var attrs = el.attributes;
                for (var j = attrs.length - 1; j >= 0; j--) {
                  var name = attrs[j].name;
                  if (re.test(name)) el.removeAttribute(name);
                }
              }
            } catch (e) { console && console.warn && console.warn('head pre-hydration cleanup failed', e); }
          })();
        ` }} />
      </head>
      <body>
        <ChipiProviders>{children}</ChipiProviders>
      </body>
    </html>
  );
}
