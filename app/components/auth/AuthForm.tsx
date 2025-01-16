import { Form, useActionData, useNavigate, useNavigation } from 'react-router';
import { formStyles } from '~/utils/styles';

import logo from '../../logo.png';
import Spinner from '../Spinner';

import { AsYouType } from 'libphonenumber-js';
import { useState } from 'react';

type AuthFormProps = {
  actionUrl: string;
  buttonText: string;
};

export default function AuthForm({ actionUrl, buttonText }: AuthFormProps) {
  const actionData = useActionData<{ error?: string; success?: string }>();
  console.log('<auth form> props:', actionUrl);
  console.log('<auth form> actionData:', actionData);
  const navigate = useNavigate();

  const isRegistration = actionUrl === '/signup';

  const navigation = useNavigation();
  const isLoading = navigation.state === 'submitting';

  // todo: client side validation
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <div className='auth-form mb-10'>
      <Form
        method='post'
        action={actionUrl}
        className='py-8 px-10 bg-white border border-dark border-opacity-50 drop-shadow-lg rounded-lg flex flex-col gap-6'
      >
        <img
          src={logo}
          className='max-w-16 self-center'
          alt='Divine Studio Logo'
        />

        {isRegistration ? (
          <div>
            <h1 className='text-xl text-center font-bold'>
              Register for Access
            </h1>
            <h3 className='text-sm text-center font-cherry'>
              Please register to use our breathing tool
            </h3>
          </div>
        ) : (
          <div>
            <h1 className='text-xl text-center font-bold'>
              Sign in to Breathwork
            </h1>
            <h3 className='text-sm text-center font-cherry'>
              Please sign in to use our breathing tool
            </h3>
          </div>
        )}

        {/* todo: <button
          className={formStyles.outlineButton}
          type='button'
          onClick={() => console.log('google auth')}
          disabled={isLoading}
        >
          Continue with Google
        </button> */}

        <div className='flex flex-col gap-4'>
          {isRegistration && (
            <>
              <div className='flex flex-col'>
                <label className={formStyles.label} htmlFor='name'>
                  Name:
                </label>
                <input
                  type='text'
                  name='name'
                  required
                  className={
                    actionData?.error ? formStyles.inputError : formStyles.input
                  }
                  autoComplete='name'
                />
              </div>
              <div className='flex flex-col'>
                <label className={formStyles.label} htmlFor='phone'>
                  Phone:
                </label>
                <input
                  type='text'
                  name='phone'
                  required
                  className={
                    actionData?.error ? formStyles.inputError : formStyles.input
                  }
                  autoComplete='tel'
                  onChange={(e) => {
                    setPhoneNumber(new AsYouType('US').input(e.target.value));
                  }}
                  value={phoneNumber}
                  maxLength={16}
                />
              </div>
            </>
          )}
          <div className='flex flex-col'>
            <label className={formStyles.label} htmlFor='email'>
              Email:
            </label>
            <input
              type='email'
              name='email'
              required
              className={
                actionData?.error ? formStyles.inputError : formStyles.input
              }
              autoComplete='email'
            />
          </div>
          <div className='flex flex-col'>
            <label className={formStyles.label} htmlFor='password'>
              Password
            </label>
            <input
              type='password'
              name='password'
              required
              className={
                actionData?.error ? formStyles.inputError : formStyles.input
              }
              autoComplete={
                isRegistration ? 'new-password' : 'current-password'
              }
            />
          </div>
        </div>

        {actionData?.error && (
          <div className={formStyles.error}>{actionData.error}</div>
        )}
        {actionData?.success && (
          <div className={`${formStyles.success}`}>Success!</div>
        )}

        <button
          type='submit'
          className={formStyles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : buttonText}
        </button>

        <hr className='h-1 bg-orange drop-shadow shadow-dark rounded' />
        <h3 className='text-sm text-center font-cherry'>
          {isRegistration
            ? 'Already have an account?'
            : "Don't have an account?"}
          <br />
          {isRegistration
            ? 'Please login to use our breathing tool'
            : 'Please sign up to use our breathing tool'}
        </h3>
        <button
          className={formStyles.outlineButton}
          type='button'
          onClick={() => navigate(isRegistration ? '/signin' : '/signup')}
        >
          {isRegistration ? 'Sign In' : 'Sign Up'}
        </button>
      </Form>
    </div>
  );
}
