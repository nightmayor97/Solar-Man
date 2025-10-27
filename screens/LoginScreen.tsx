import React, { useState } from 'react';
import Modal from '../components/Modal';
import { useAppContext } from '../App';

interface LoginScreenProps {
    onLogin: (role: 'customer' | 'admin') => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const { addExpressionOfInterest } = useAppContext();
    const [modalContent, setModalContent] = useState<'forgotPassword' | 'firstAccess' | null>(null);
    
    // Forgot Password State
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotPasswordSubmitted, setForgotPasswordSubmitted] = useState(false);
    
    // Expression of Interest State
    const [eoiName, setEoiName] = useState('');
    const [eoiEmail, setEoiEmail] = useState('');
    const [eoiPhone, setEoiPhone] = useState('');
    const [eoiSubmitted, setEoiSubmitted] = useState(false);

    const handleForgotPassword = (e: React.FormEvent) => {
        e.preventDefault();
        setForgotPasswordSubmitted(true);
    };
    
    const handleEoiSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addExpressionOfInterest(eoiName, eoiEmail, eoiPhone);
        setEoiSubmitted(true);
    };

    const openEoiModal = () => {
        setEoiName('');
        setEoiEmail('');
        setEoiPhone('');
        setEoiSubmitted(false);
        setModalContent('firstAccess');
    };

    const inputClasses = "appearance-none rounded-md relative block w-full px-3 py-2 border border-secondary bg-secondary-dark text-white placeholder-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm";

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-secondary-dark">Solar Man</h2>
                        <p className="text-xl text-gray-500">by Softlogic Energy</p>
                        <p className="mt-4 text-lg text-gray-600">Portal</p>
                    </div>
                    
                    <form className="mt-8 space-y-6">
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <input id="email-address" name="email" type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-secondary bg-secondary-dark text-white placeholder-gray-300 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" placeholder="Email address" defaultValue="user@example.com" />
                            </div>
                            <div>
                                <input id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-secondary bg-secondary-dark text-white placeholder-gray-300 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" placeholder="Password" defaultValue="password" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                             <button type="button" onClick={() => { setModalContent('forgotPassword'); setForgotPasswordSubmitted(false); setForgotEmail(''); }} className="font-medium text-primary-dark hover:text-primary">
                                Forgot your password?
                            </button>
                             <button type="button" onClick={openEoiModal} className="font-medium text-primary-dark hover:text-primary">
                                First-Time Access Enquiry
                            </button>
                        </div>
                    </form>

                    <div className="space-y-4">
                        <button
                            type="button"
                            onClick={() => onLogin('customer')}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light"
                        >
                            Login as Customer
                        </button>
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
            </div>

            <Modal isOpen={modalContent === 'forgotPassword'} onClose={() => setModalContent(null)} title="Reset Password">
                {!forgotPasswordSubmitted ? (
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                        <p className="text-gray-600">Enter the email address associated with your account, and we’ll send you a link to reset your password.</p>
                        <div>
                            <label htmlFor="reset-email" className="sr-only">Email address</label>
                            <input
                                id="reset-email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                className={inputClasses}
                                placeholder="Email address"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light"
                        >
                            Send Reset Link
                        </button>
                    </form>
                ) : (
                    <div className="text-center">
                        <p className="text-lg font-semibold text-secondary-dark">Check your email</p>
                        <p className="text-gray-600 mt-2">If an account with <span className="font-bold">{forgotEmail}</span> exists, you will receive a password reset link shortly.</p>
                        <button
                            type="button"
                            onClick={() => setModalContent(null)}
                            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light"
                        >
                            Close
                        </button>
                    </div>
                )}
            </Modal>
            
             <Modal isOpen={modalContent === 'firstAccess'} onClose={() => setModalContent(null)} title="First-Time Access Enquiry">
                {!eoiSubmitted ? (
                    <form onSubmit={handleEoiSubmit} className="space-y-4">
                        <p className="text-gray-600">Please provide your details below, and our team will contact you to set up your portal access.</p>
                        <div>
                            <label htmlFor="eoi-name" className="sr-only">Full Name</label>
                            <input id="eoi-name" type="text" value={eoiName} onChange={(e) => setEoiName(e.target.value)} placeholder="Full Name" className={inputClasses} required />
                        </div>
                        <div>
                            <label htmlFor="eoi-email" className="sr-only">Email Address</label>
                            <input id="eoi-email" type="email" value={eoiEmail} onChange={(e) => setEoiEmail(e.target.value)} placeholder="Email Address" className={inputClasses} required />
                        </div>
                        <div>
                            <label htmlFor="eoi-phone" className="sr-only">Phone Number</label>
                            <input id="eoi-phone" type="tel" value={eoiPhone} onChange={(e) => setEoiPhone(e.target.value)} placeholder="Phone Number" className={inputClasses} required />
                        </div>
                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light">
                            Submit Enquiry
                        </button>
                    </form>
                ) : (
                    <div className="text-center">
                        <p className="text-lg font-semibold text-secondary-dark">Thank You!</p>
                        <p className="text-gray-600 mt-2">Your enquiry has been submitted successfully. Our team will get in touch with you shortly.</p>
                        <button
                            type="button"
                            onClick={() => setModalContent(null)}
                            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light"
                        >
                            Close
                        </button>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default LoginScreen;