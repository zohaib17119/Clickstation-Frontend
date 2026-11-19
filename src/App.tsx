import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { RequireAuth } from "./auth/RequireAuth";
import { Layout } from "./components/Layout";
import { AdminPage } from "./pages/AdminPage";
import { AppPage } from "./pages/AppPage";
import { DownloadPage } from "./pages/DownloadPage";
import { ExperiencesPage } from "./pages/ExperiencesPage";
import { FeaturesPage } from "./pages/FeaturesPage";
import { GalleryPage } from "./pages/GalleryPage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { PricingPage } from "./pages/PricingPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { TemplateDesignerPage } from "./pages/TemplateDesignerPage";
import { UseCasesPage } from "./pages/UseCasesPage";
import { ContactPage } from "./pages/ContactPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/template-designer" element={<TemplateDesignerPage />} />
            <Route path="/photo-experiences" element={<ExperiencesPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/use-cases" element={<UseCasesPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/downloads" element={<DownloadPage />} />
            <Route path="/download" element={<Navigate to="/downloads" replace />} />
            <Route path="/windows" element={<Navigate to="/downloads" replace />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<RequireAuth />}>
              <Route path="/app" element={<AppPage />} />
            </Route>
            <Route element={<RequireAuth adminOnly />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}
