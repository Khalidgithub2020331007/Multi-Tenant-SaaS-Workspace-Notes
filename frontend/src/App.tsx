import { useState } from 'react';
import UserRegister from './login_register/UserRegister';
import Login from './login_register/Login';
import CompanyRegister from './login_register/CompanyRegister';
import OwnerDashboard from './dashboard/owner_components/owner_dashboard';
import MemberDashboard from './dashboard/member_components/member_dashboard';

type Page = 'userRegister' | 'userLogin' | 'companyRegister' | 'memberDashboard' | 'ownerDashboard';

function App() {
  // 🔹 Initial page based on logged-in user
  const getInitialPage = (): Page => {
    const userStr = localStorage.getItem('loggedInUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.role === 'owner' ? 'ownerDashboard' : 'memberDashboard';
    }
    return 'userRegister';
  };

  const [page, setPage] = useState<Page>(getInitialPage);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      {page !== 'ownerDashboard' && page !== 'memberDashboard' && (
        <header className="bg-blue-600 text-white p-4 text-center text-xl font-bold">
          Multi-Tenant-SaaS-Workspace-Notes
        </header>
      )}

      {/* Navigation Buttons */}
      {page !== 'ownerDashboard' && page !== 'memberDashboard' && (
        <nav className="bg-gray-200 p-2 flex justify-center gap-4">
          <button
            onClick={() => setPage('userRegister')}
            className="px-4 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            User Register
          </button>
          <button
            onClick={() => setPage('userLogin')}
            className="px-4 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            User Login
          </button>
          <button
            onClick={() => setPage('companyRegister')}
            className="px-4 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            Company Register
          </button>
        </nav>
      )}

      {/* Page Content */}
      <main className="p-4">
        {page === 'userRegister' && <UserRegister goToPage={setPage} />}
        {page === 'userLogin' && <Login goToPage={setPage} />}
        {page === 'companyRegister' && <CompanyRegister goToPage={setPage} />}
        {page === 'ownerDashboard' && <OwnerDashboard onLogout={() => setPage('userLogin')} />}
        {page === 'memberDashboard' && <MemberDashboard onLogout={() => setPage('userLogin')} />}
      </main>
    </div>
  );
}

export default App;
