import { useSession, signIn } from 'next-auth/react';
import Nav from '@/components/Nav';
import React, { useState } from 'react';
import Logo from '@/components/Logo';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
  const router = useRouter();
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const { email, password } = values;
  const [error, setError] = useState(null);

  const [showNav, setShowNav] = useState(false);
  const { data: session } = useSession();

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('All fields are required');
      return;
    }

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    if (res.error) {
      setError(res.error);
      return;
    }

    setValues({ email: '', password: '' });
    router.replace('/');
  };

  if (!session) {
    return (
      <>
        <form
          style={{ maxWidth: '576px', margin: 'auto', marginTop: '10%' }}
          onSubmit={handleSubmit}
        >
          {/* <h3 className='text-center my-5'>Log into your account</h3> */}
          <div className='mb-3'>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              className='form-control'
              name='email'
              value={email}
              onChange={handleChange}
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              className='form-control'
              name='password'
              value={password}
              onChange={handleChange}
            />
          </div>
          {error && <p className='text-danger text-center'>{error}</p>}
          <div className='mb-3 text-center'>
            <button className='btn btn-secondary btn-sm '>Login</button>
          </div>
        </form>
      </>
    );
  }

  return (
    <div className='bg-bgGray min-h-screen '>
      <div className='block md:hidden  items-center p-4'>
        <button onClick={() => setShowNav(true)}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='w-6 h-6'
          >
            <path
              fillRule='evenodd'
              d='M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z'
              clipRule='evenodd'
            />
          </svg>
        </button>
        <div className='flex grow justify-center mr-6'>
          <Logo />
        </div>
      </div>
      <div className='flex'>
        <Nav show={showNav} />
        <div className='flex-grow p-4'>{children}</div>
      </div>
    </div>
  );
}
