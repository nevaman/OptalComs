import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/layout/Layout';
import { AdminLayout } from './components/admin/AdminLayout';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { Home } from './pages/Home';
import { Work } from './pages/Work';
import { CaseStudy } from './pages/CaseStudy';
import { Services } from './pages/Services';
import { About } from './pages/About';
import { Team } from './pages/Team';
import { Insights } from './pages/Insights';
import { InsightDetail } from './pages/InsightDetail';
import { Contact } from './pages/Contact';
import { Login } from './pages/admin/Login';
import { Register } from './pages/admin/Register';
import { Dashboard } from './pages/admin/Dashboard';
import { ProjectsList } from './pages/admin/ProjectsList';
import { ProjectEditor } from './pages/admin/ProjectEditor';
import { TeamList } from './pages/admin/TeamList';
import { TeamEditor } from './pages/admin/TeamEditor';
import { InsightsList } from './pages/admin/InsightsList';
import { InsightEditor } from './pages/admin/InsightEditor';
import { Settings } from './pages/admin/Settings';
import { ContactSubmissions } from './pages/admin/ContactSubmissions';
import { AccessRequests } from './pages/admin/AccessRequests';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:slug" element={<CaseStudy />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/insights/:slug" element={<InsightDetail />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/register" element={<Register />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<ProjectsList />} />
            <Route path="projects/new" element={<ProjectEditor />} />
            <Route path="projects/:id" element={<ProjectEditor />} />
            <Route path="team" element={<TeamList />} />
            <Route path="team/new" element={<TeamEditor />} />
            <Route path="team/:id" element={<TeamEditor />} />
            <Route path="insights" element={<InsightsList />} />
            <Route path="insights/new" element={<InsightEditor />} />
            <Route path="insights/:id" element={<InsightEditor />} />
            <Route path="submissions" element={<ContactSubmissions />} />
            <Route path="access-requests" element={<AccessRequests />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
