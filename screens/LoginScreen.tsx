
import React, { useState } from 'react';
import { useAppContext } from '../App';
import Card from '../components/Card';

interface LoginScreenProps {
    onLogin: (role: 'customer' | 'admin', credentials?: { email?: string; password?: string }) => void;
}

const inputClasses = "mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm";

const ForgotPasswordForm: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [forgotEmail, setForgotEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <Card title="Reset Password">
            {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-gray-600">Enter the email address associated with your account, and we’ll send you a link to reset your password.</p>
                    <div>
                        <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mt-2">
                            Email address
                        </label>
                        <input
                            id="reset-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            className={inputClasses}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                         <button
                            type="button"
                            onClick={onBack}
                            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
                        >
                            Back to Login
                        </button>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
                        >
                            Send Reset Link
                        </button>
                    </div>
                </form>
            ) : (
                <div className="text-center">
                    <p className="text-lg font-semibold text-secondary-dark">Check your email</p>
                    <p className="text-gray-600 mt-2">If an account with <span className="font-bold">{forgotEmail}</span> exists, you will receive a password reset link shortly.</p>
                    <button
                        type="button"
                        onClick={onBack}
                        className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg-secondary-dark"
                    >
                        Return to Login
                    </button>
                </div>
            )}
        </Card>
    );
};

const FirstTimeAccessForm: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const { addExpressionOfInterest } = useAppContext();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addExpressionOfInterest(name, email, phone);
        setSubmitted(true);
    };

    return (
         <Card title="First-Time Access Enquiry">
            {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-gray-600">Please provide your details below, and our team will contact you to set up your portal access.</p>
                    <div>
                        <label htmlFor="eoi-name" className="block text-sm font-medium text-gray-700 mt-2">Full Name</label>
                        <input id="eoi-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClasses} required />
                    </div>
                    <div>
                        <label htmlFor="eoi-email" className="block text-sm font-medium text-gray-700 mt-2">Email Address</label>
                        <input id="eoi-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} required />
                    </div>
                    <div>
                        <label htmlFor="eoi-phone" className="block text-sm font-medium text-gray-700 mt-2">Phone Number</label>
                        <input id="eoi-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClasses} required />
                    </div>
                     <div className="flex items-center space-x-2">
                        <button
                            type="button"
                            onClick={onBack}
                            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
                        >
                            Back to Login
                        </button>
                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark">
                            Submit Enquiry
                        </button>
                    </div>
                </form>
            ) : (
                <div className="text-center">
                    <p className="text-lg font-semibold text-secondary-dark">Thank You!</p>
                    <p className="text-gray-600 mt-2">Your enquiry has been submitted successfully. Our team will get in touch with you shortly.</p>
                    <button
                        type="button"
                        onClick={onBack}
                        className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg-secondary-dark"
                    >
                        Return to Login
                    </button>
                </div>
            )}
        </Card>
    );
};


const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [view, setView] = useState<'login' | 'forgotPassword' | 'firstAccess'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleCustomerLogin = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin('customer', { email, password });
    };

    const renderLoginView = () => (
         <div className="p-8 space-y-8 bg-white rounded-2xl shadow-lg">
            <div className="text-center">
                <h2 className="text-4xl font-bold text-secondary-dark">Solar Man</h2>
                <p className="text-xl text-gray-500">by Softlogic Energy</p>
                <p className="mt-4 text-lg text-gray-600">Portal</p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleCustomerLogin}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <input 
                            id="email-address" 
                            name="email" 
                            type="email" 
                            autoComplete="email" 
                            required 
                            className={inputClasses} 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password"  className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input 
                            id="password" 
                            name="password" 
                            type="password" 
                            autoComplete="current-password" 
                            required 
                            className={inputClasses}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                     <button type="button" onClick={() => setView('forgotPassword')} className="font-medium text-primary-dark hover:text-primary">
                        Forgot your password?
                    </button>
                     <button type="button" onClick={() => setView('firstAccess')} className="font-medium text-primary-dark hover:text-primary">
                        First-Time Access Enquiry
                    </button>
                </div>
                <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light"
                >
                    Login as Customer
                </button>
            </form>

            <div className="space-y-4">
                <button
                    type="button"
                    onClick={() => onLogin('admin')}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light"
                >
                    Login as Admin
                </button>
            </div>

            <p className="mt-6 text-center text-xs text-gray-500">
                Prepared for: Solar Man - Softlogic Energy
                <br />
                Date of submission: 03/10/2025
            </p>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 relative">
            <div className="w-full max-w-md">
                {view === 'login' && renderLoginView()}
                {view === 'forgotPassword' && <ForgotPasswordForm onBack={() => setView('login')} />}
                {view === 'firstAccess' && <FirstTimeAccessForm onBack={() => setView('login')} />}
            </div>
        </div>
    );
};

export default LoginScreen;
