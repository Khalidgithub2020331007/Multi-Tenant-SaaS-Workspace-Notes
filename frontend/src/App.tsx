import { useState } from 'react';
import UserRegister from './login_register/UserRegister';
import Login from './login_register/Login';
import CompanyRegister from './login_register/CompanyRegister';
import OwnerDashboard from './dashboard/owner_components/owner_dashboard';
import MemberDashboard from './dashboard/member_components/member_dashboard';

type Page = 'userRegister' | 'userLogin' | 'companyRegister' | 'memberDashboard' | 'ownerDashboard';
function App() {
  const getInitialPage = (): Page => {
    const savedPage = localStorage.getItem('page') as Page | null;
    if (savedPage) {
      return savedPage;
    }

    const userStr = localStorage.getItem('loggedInUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.role === 'owner' ? 'ownerDashboard' : 'memberDashboard';
    }
    return 'userRegister';
  };
  const handleSetPage = (newPage:Page) => {
    setPage(newPage);
    localStorage.setItem('page', newPage);
  }

  const [page, setPage] = useState<Page>(getInitialPage);

  const showAuthLayout = page !== 'ownerDashboard' && page !== 'memberDashboard';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      {showAuthLayout && (
        <header className="bg-blue-600 text-white p-4 text-center text-xl font-bold">
          Multi-Tenant-SaaS-Workspace-Notes
        </header>
      )}

      {/* ===== 20% / 80% Layout ===== */}
      {showAuthLayout ? (
        <div className="flex min-h-[calc(100vh-64px)]">
          {/* 🔹 Left Sidebar (20%) */}
          <aside className="w-1/5 bg-gray-200 p-4 border-r">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleSetPage('userRegister')}
                className={`px-4 py-2 rounded text-left hover:bg-gray-300 transition
                  ${page === 'userRegister' ? 'bg-gray-300 font-semibold' : ''}`}
              >
                User Register
              </button>

              <button
                onClick={() => handleSetPage('userLogin')}
                className={`px-4 py-2 rounded text-left hover:bg-gray-300 transition
                  ${page === 'userLogin' ? 'bg-gray-300 font-semibold' : ''}`}
              >
                User Login
              </button>

              <button
                onClick={() => handleSetPage('companyRegister')}
                className={`px-4 py-2 rounded text-left hover:bg-gray-300 transition
                  ${page === 'companyRegister' ? 'bg-gray-300 font-semibold' : ''}`}
              >
                Company Register
              </button>
            </div>
          </aside>

          {/* 🔹 Right Content (80%) */}
          <main className="w-4/5 p-6">
            {page === 'userRegister' && <UserRegister goToPage={handleSetPage} />}
            {page === 'userLogin' && <Login goToPage={handleSetPage} />}
            {page === 'companyRegister' && <CompanyRegister goToPage={handleSetPage} />}
          </main>
        </div>
      ) : (
        /* Dashboards (full width) */
        <main className="p-4">
          {page === 'ownerDashboard' && (
            <OwnerDashboard onLogout={() => handleSetPage('userLogin')} />
          )}
          {page === 'memberDashboard' && (
            <MemberDashboard onLogout={() => handleSetPage('userLogin')} />
          )}
        </main>
      )}
    </div>
  );
}
export default App;