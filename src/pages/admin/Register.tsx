import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'register' | 'request' | 'complete'>('register');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    reason: '',
  });

  const [userId, setUserId] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
      return;
    }

    if (data.user) {
      setUserId(data.user.id);
      setStep('request');
    }

    setIsLoading(false);
  };

  const handleRequestAccess = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!formData.reason.trim()) {
      setError('Please provide a reason for requesting admin access');
      return;
    }

    setIsLoading(true);

    const { error: requestError } = await supabase.from('admin_requests').insert([
      {
        user_id: userId,
        email: formData.email,
        name: formData.name,
        reason: formData.reason,
      },
    ]);

    if (requestError) {
      setError(requestError.message);
      setIsLoading(false);
      return;
    }

    setStep('complete');
    setIsLoading(false);
  };

  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="font-display text-2xl font-bold">Request Submitted</h1>
          <p className="text-neutral-mid mt-4">
            Your account has been created and your admin access request has been submitted. An administrator will review your request.
          </p>
          <p className="text-sm text-neutral-mid mt-4">
            You'll receive an email once your request is approved.
          </p>
          <Link
            to="/admin/login"
            className="inline-block mt-8 text-orange hover:opacity-80 transition-opacity"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Link
          to="/admin/login"
          className="inline-flex items-center gap-2 text-sm text-neutral-mid hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>

        {step === 'register' && (
          <>
            <div className="mb-8">
              <h1 className="font-display text-2xl font-bold">Create Account</h1>
              <p className="text-neutral-mid mt-2">
                Register to request admin access
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@company.com"
                autoComplete="email"
              />

              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Min. 6 characters"
                autoComplete="new-password"
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Re-enter password"
                autoComplete="new-password"
              />

              {error && (
                <div className="flex items-start gap-2 text-sm text-orange bg-orange/10 px-4 py-3 rounded">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <Button type="submit" variant="primary" isLoading={isLoading} className="w-full">
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </Button>
            </form>

            <p className="text-xs text-neutral-mid text-center mt-8">
              Already have an account?{' '}
              <Link to="/admin/login" className="text-orange hover:opacity-80">
                Sign in
              </Link>
            </p>
          </>
        )}

        {step === 'request' && (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-2 text-green-600 text-sm mb-4">
                <Check className="w-4 h-4" />
                Account created successfully
              </div>
              <h1 className="font-display text-2xl font-bold">Request Admin Access</h1>
              <p className="text-neutral-mid mt-2">
                Tell us why you need admin access
              </p>
            </div>

            <form onSubmit={handleRequestAccess} className="space-y-6">
              <Input
                label="Your Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Full name"
              />

              <Textarea
                label="Reason for Access"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                placeholder="Explain why you need admin access to this system..."
                rows={4}
              />

              {error && (
                <div className="flex items-start gap-2 text-sm text-orange bg-orange/10 px-4 py-3 rounded">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <Button type="submit" variant="primary" isLoading={isLoading} className="w-full">
                Submit Request
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
