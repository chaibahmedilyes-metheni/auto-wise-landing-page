import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import AppPreview from './components/AppPreview';
import GarageBenefits from './components/GarageBenefits';
import TrustSection from './components/TrustSection';
import RegistrationForm from './components/RegistrationForm';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

// A simple layout for the public landing page
function PublicLanding() {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <AppPreview />
        <GarageBenefits />
        <TrustSection />
        <RegistrationForm />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

// Admin layout placeholder
import AdminDashboard from './admin/AdminDashboard';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <Routes>
      <Route path="/" element={<PublicLanding />} />
      <Route path="/admin/*" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
