import './globals.css';
import ChipiProviders from './ChipiProviders';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ChipiProviders>{children}</ChipiProviders>
      </body>
    </html>
  );
}
