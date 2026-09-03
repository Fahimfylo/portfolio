import React, { useState, useEffect } from 'react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { WorksSection } from './components/WorksSection';
import { AboutSkillsSection } from './components/AboutSkillsSection';
import { ContactSection } from './components/ContactSection';
import { lazy, Suspense } from 'react';

const TechnologyUniverse = lazy(() =>
  import('./components/tech-universe/TechnologyUniverse').then((m) => ({
    default: m.TechnologyUniverse,
  })),
);
import { Footer } from './components/Footer';
import { CustomizationBar } from './components/CustomizationBar';
import { Preloader } from './components/Preloader';
import { SmoothScrollProvider } from './components/SmoothScroll';
import { CustomCursor } from './components/CustomCursor';
import { AdminApp } from './admin/AdminApp';
import { ContentProvider } from './ContentProvider';

function useHashRoute(): string {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handler = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  return hash;
}

function PortfolioSite() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <SmoothScrollProvider>
      <ContentProvider>
        <div className="min-h-screen bg-[#F0EEE8] text-[#111111] antialiased">
          <CustomCursor />
          <Preloader onComplete={() => setLoadingComplete(true)} />
          <div className={`transition-opacity duration-700 ${loadingComplete ? 'opacity-100' : 'opacity-0'}`}>
            <Nav />
            <main>
              <Hero />
              <ServicesSection />
              <WorksSection />
              <AboutSkillsSection />
              <Suspense fallback={null}>
                <TechnologyUniverse />
              </Suspense>
              <ContactSection />
            </main>
            <Footer />
            <CustomizationBar />
          </div>
        </div>
      </ContentProvider>
    </SmoothScrollProvider>
  );
}

export default function App() {
  const hash = useHashRoute();

  if (hash === '#/admin') {
    return <AdminApp />;
  }

  return <PortfolioSite />;
}
