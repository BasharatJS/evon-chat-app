'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useChatStore } from '@/store/chatStore';
import AnimatedBackground from '@/components/ui/AnimatedBackground';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { signUp, loginWithGoogle, isAuthenticated, initializeAuth } = useChatStore();

  // Initialize auth listener
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard/chat');
    }
  }, [isAuthenticated, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      await signUp(email, password, name);
      router.push('/dashboard/chat');
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    setLoading(true);
    
    try {
      await loginWithGoogle();
      router.push('/dashboard/chat');
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Left Column - Branding & Content */}
      <motion.div 
        className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 z-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="max-w-lg text-center">
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-12"
          >
            <motion.h1 
              className="text-6xl xl:text-7xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                backgroundSize: '200% 200%',
              }}
            >
              EvonChat
            </motion.h1>
            
            {/* Animated Dots */}
            <div className="flex justify-center space-x-2 mb-8">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-blue-400 animate-pulse" />
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse delay-100" />
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse delay-200" />
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              Join the
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent"> Community</span>
            </h2>
            
            <p className="text-xl text-blue-200 leading-relaxed">
              Experience seamless communication with our modern chat platform. 
              Stay connected, share moments, and build lasting relationships.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 gap-4 mt-12">
              <motion.div
                whileHover={{ scale: 1.05, x: 10 }}
                className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center space-x-4"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Real-time Messaging</h3>
                  <p className="text-blue-200 text-sm">Instant delivery and read receipts</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, x: 10 }}
                transition={{ delay: 0.1 }}
                className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center space-x-4"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Secure & Private</h3>
                  <p className="text-blue-200 text-sm">End-to-end encryption for your privacy</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, x: 10 }}
                transition={{ delay: 0.2 }}
                className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center space-x-4"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Group Conversations</h3>
                  <p className="text-blue-200 text-sm">Create groups and chat with multiple friends</p>
                </div>
              </motion.div>
            </div>

            {/* Bottom spacing content to align with right side */}
            <motion.div 
              className="mt-12 pt-8 border-t border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="text-center space-y-4">
                <div className="flex justify-center items-center space-x-4">
                  <div className="w-12 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full opacity-50" />
                  <div className="text-white/60 text-sm">Trusted by thousands</div>
                  <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-50" />
                </div>
                <p className="text-blue-200/60 text-sm">
                  Join our growing community of chat enthusiasts
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Column - Register Form */}
      <motion.div 
        className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 z-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center lg:hidden mb-8"
          >
            <motion.h1 
              className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                backgroundSize: '200% 200%',
              }}
            >
              EvonChat
            </motion.h1>
          </motion.div>

          {/* Form Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              Create Account
            </h2>
            <p className="text-blue-200 text-lg">
              Join EvonChat and start messaging today
            </p>
          </motion.div>

          {/* Glass morphism form container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-6 lg:p-8 space-y-6"
            style={{
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            }}
          >
          {/* Google Register Button */}
          <motion.button
            onClick={handleGoogleRegister}
            disabled={loading}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center px-6 py-4 backdrop-blur-sm bg-white/20 border border-white/30 rounded-2xl text-sm font-medium text-white hover:bg-white/30 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <motion.div
              className="bg-white p-2 rounded-full mr-3"
              whileHover={{ rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </motion.div>
            <span className="group-hover:text-emerald-100 transition-colors">
              {loading ? 'Creating account...' : 'Continue with Google'}
            </span>
          </motion.button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/30" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 backdrop-blur-sm bg-white/10 text-blue-200 rounded-full">
                or
              </span>
            </div>
          </div>

          {/* Registration Form */}
          <motion.form 
            onSubmit={handleRegister} 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-sm bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-2xl text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="name" className="block text-sm font-medium text-emerald-200 mb-3">
                Full name
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-4 pl-12 backdrop-blur-sm bg-white/10 border border-white/30 rounded-2xl text-white placeholder-blue-200 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all duration-300"
                  placeholder="Enter your full name"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-emerald-200 mb-3">
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 pl-12 backdrop-blur-sm bg-white/10 border border-white/30 rounded-2xl text-white placeholder-blue-200 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all duration-300"
                  placeholder="Enter your email"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-emerald-200 mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 pl-12 backdrop-blur-sm bg-white/10 border border-white/30 rounded-2xl text-white placeholder-blue-200 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all duration-300"
                  placeholder="Create a password"
                  minLength={6}
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-emerald-200 mb-3">
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-4 pl-12 backdrop-blur-sm bg-white/10 border border-white/30 rounded-2xl text-white placeholder-blue-200 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all duration-300"
                  placeholder="Confirm your password"
                  minLength={6}
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                required
                className="h-4 w-4 text-emerald-400 focus:ring-emerald-400 bg-white/10 border-white/30 rounded"
              />
              <label htmlFor="agree-terms" className="ml-3 block text-sm text-blue-200">
                I agree to the{' '}
                <motion.a 
                  href="#" 
                  className="text-emerald-300 hover:text-emerald-200 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  Terms of Service
                </motion.a>{' '}
                and{' '}
                <motion.a 
                  href="#" 
                  className="text-emerald-300 hover:text-emerald-200 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  Privacy Policy
                </motion.a>
              </label>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 text-white py-4 px-6 rounded-2xl font-semibold hover:from-emerald-600 hover:via-blue-600 hover:to-purple-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:shadow-2xl"
              style={{
                backgroundSize: '200% 200%',
                animation: loading ? 'none' : 'gradient-x 3s ease infinite',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <span className="flex items-center justify-center">
                {loading && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {loading ? 'Creating account...' : 'Create account'}
              </span>
            </motion.button>
          </motion.form>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            <div className="text-sm text-blue-200">
              Already have an account?{' '}
              <Link 
                href="/auth/login" 
                className="font-semibold text-emerald-300 hover:text-emerald-200 transition-colors relative inline-block"
              >
                <span className="relative z-10">Sign in</span>
                <motion.div
                  className="absolute inset-0 bg-emerald-500/20 rounded-lg -z-10"
                  whileHover={{ scale: 1.1, opacity: 1 }}
                  initial={{ scale: 0.8, opacity: 0 }}
                />
              </Link>
            </div>
          </motion.div>
          </motion.div>
        </div>
      </motion.div>

    </div>
  );
}