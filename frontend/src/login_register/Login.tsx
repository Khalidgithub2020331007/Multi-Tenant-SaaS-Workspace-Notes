import { useState } from 'react';
import api from '../api/axios';

type Props = {
  goToPage?: (
    page: 'userRegister' | 'userLogin' | 'companyRegister' | 'ownerDashboard' | 'memberDashboard'
  ) => void;
};

const UserLogin = ({ goToPage }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/user/login', { email, password });

      if (!res.data.user) {
        alert('Wrong email or password');
        return;
      }
      console.log(res.data.user)
      const backendUser = res.data.user;
      const user = {
        id: backendUser.id,
        name: backendUser.name,
        email: backendUser.email,
        role: backendUser.role,
        company_hostname: backendUser.companyHostname, // snake_case
      };
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      
      console.log(user)
      alert(res.data.message);

      // Redirect based on role
           if (goToPage) {
  goToPage(res.data.user.role === 'owner' ? 'ownerDashboard' : 'memberDashboard');
}
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
      else alert('Network error');
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto p-4 space-y-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center">User Login</h2>

      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white w-full p-3 rounded">
        Login
      </button>

      {goToPage && (
        <div className="flex justify-between text-blue-500 text-sm mt-2">
          <span className="cursor-pointer" onClick={() => goToPage('userRegister')}>
            Go to Register
          </span>
          <span className="cursor-pointer" onClick={() => goToPage('companyRegister')}>
            Go to Company Register
          </span>
        </div>
      )}
    </form>
  );
};

export default UserLogin;
