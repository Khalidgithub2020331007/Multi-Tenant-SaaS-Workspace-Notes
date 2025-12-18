import { useState } from 'react';
import type { User } from '../types';
import api from '../api/axios';

type Props = {
  goToPage?: (page: 'userRegister' | 'userLogin' | 'companyRegister') => void;
};

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const UserRegister = ({ goToPage }: Props) => {
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    password: '',
    company_hostname: '',
    role: 'member',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof User, string>>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
    setApiError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError('');
    setSuccessMessage('');

    // Frontend validation
    if (user.name.trim().length < 2) {
      setErrors({ name: 'Name must be at least 2 characters' });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(user.email)) {
      setErrors({ email: 'Invalid email' });
      return;
    }
    if (!PASSWORD_REGEX.test(user.password)) {
      setErrors({
        password:
          'Password must contain uppercase, lowercase, number & special character',
      });
      return;
    }
    if (!user.company_hostname.trim()) {
      setErrors({ company_hostname: 'Company hostname is required' });
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/user/register', user);
      setSuccessMessage(res.data.message);
      setUser({
        name: '',
        email: '',
        password: '',
        company_hostname: '',
        role: 'member',
      });
      setTimeout(() => goToPage?.('userLogin'), 1000);
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 space-y-4 bg-white shadow-lg rounded-lg"
    >
      <h2 className="text-2xl font-bold text-center">User Registration</h2>

      {apiError && <p className="text-red-500 text-center">{apiError}</p>}
      {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

      <div>
        <input
          name="name"
          placeholder="Name"
          value={user.name}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <div>
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      </div>

      <div>
        <input
          name="company_hostname"
          placeholder="Company Hostname"
          value={user.company_hostname}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        {errors.company_hostname && (
          <p className="text-red-500 text-sm">{errors.company_hostname}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full p-3 rounded text-white ${
          loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {loading ? 'Registering...' : 'Register User'}
      </button>

      {goToPage && (
        <div className="flex justify-between text-blue-500 text-sm mt-2">
          <span className="cursor-pointer" onClick={() => goToPage('userLogin')}>
            Go to Login
          </span>
          <span className="cursor-pointer" onClick={() => goToPage('companyRegister')}>
            Go to Company Register
          </span>
        </div>
      )}
    </form>
  );
};

export default UserRegister;
