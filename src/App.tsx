import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { ProfilePage } from './pages/ProfilePage'
import { AppShell } from './components/layout/AppShell'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { WizardPage } from './pages/wizard/WizardPage'
import { Step1DadosGerais } from './pages/wizard/Step1DadosGerais'
import { Step2Responsavel } from './pages/wizard/Step2Responsavel'
import { Step3Contratante } from './pages/wizard/Step3Contratante'
import { Step4Contratada } from './pages/wizard/Step4Contratada'
import { Step5Imovel } from './pages/wizard/Step5Imovel'
import { Step6Confrontantes } from './pages/wizard/Step6Confrontantes'
import { Step7Revisao } from './pages/wizard/Step7Revisao'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/laudo/:id" element={<WizardPage />}>
              <Route path="step/1" element={<Step1DadosGerais />} />
              <Route path="step/2" element={<Step2Responsavel />} />
              <Route path="step/3" element={<Step3Contratante />} />
              <Route path="step/4" element={<Step4Contratada />} />
              <Route path="step/5" element={<Step5Imovel />} />
              <Route path="step/6" element={<Step6Confrontantes />} />
              <Route path="step/7" element={<Step7Revisao />} />
              <Route index element={<Navigate to="step/1" replace />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
