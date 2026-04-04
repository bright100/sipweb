import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HomePage from "./pages/Home";
import FeaturesPage from "./pages/Features";
import CommandsPage from "./pages/Commands";
import ManifestPage from "./pages/Manifest";
import CppSupportPage from "./pages/CppSupport";
import InstallPage from "./pages/Install";
import DocsPage from "./pages/Docs";
import DocDetailPage from "./pages/DocDetail";
import PackagesPage from "./pages/Packages";
import PackageDetail from "./pages/PackageDetail";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import MouseTrail from "./components/MouseTrail";
import KonamiEgg from "./components/KonamiEgg";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <MouseTrail />
        <KonamiEgg />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Nav />
          <div className="app-content" style={{ minHeight: '100vh' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/packages/:name" element={<PackageDetail />} />
              <Route path="/commands" element={<CommandsPage />} />
              <Route path="/manifest" element={<ManifestPage />} />
              <Route path="/cpp" element={<CppSupportPage />} />
              <Route path="/install" element={<InstallPage />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/docs/:slug" element={<DocDetailPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
