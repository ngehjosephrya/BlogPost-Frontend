import { UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  Field,
  Input,
  PasswordInput,
  Button,
  ErrorBanner,
} from "../../src/components/ui";
import { LogoMark } from "../../src/components/auth/LogoMark";
import { RightPanel } from "../../src/components/auth/RightPanel";
import { useAuth } from "../../src/hooks/useAuths";

export default function Register() {
  const { signUp, isAuthenticated, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) navigate("/", { replace: true });
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (error) clearError();
  }, [form.name, form.email, form.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (submitting) return;
    try {
      setSubmitting(true);
      await signUp(form.name, form.email, form.password);
      navigate("/", { replace: true });
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-sm text-gray-300">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-2">
      {/* Left Panel */}
      <div className="flex flex-col justify-between px-12 py-10 dark:bg-gray-900">
        <LogoMark linkDisabled/>

        <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
          <h1 className="text-2xl font-meduim text-gray-900 dark:text-white mb-1.5">
            Create an Account
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-8 leading-relaxed">
            Join thousands of writers and readers today.
          </p>

          {error && <ErrorBanner message={error} />}

          <Field label="Full name">
            <Input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Ngeh Ryan"
              required
              autoComplete="name"
            />
          </Field>

          <Field label="Email address">
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              autoComplete="email"
              error={!!error}
            />
          </Field>

          <Field label="Password">
            <PasswordInput
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="........"
              required
              autoComplete="new-password"
              minLength={6}
              error={!!error}
            />
          </Field>

          <Button type="submit" loading={submitting} fullwidth>
            <UserPlus size={15} />
            Create account
          </Button>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-gray-900 font-medium underline underline-offset-2 dark:text-white"
            >
              Sign in
            </Link>
          </p>
        </form>

        <p className="text-xs text-gray-300 dark:text-gray-600">
          © 2025 Blog Template. All rights reserved.
        </p>
      </div>
      {/* Right Panel */}
      <RightPanel
        quote="A reader lives a thousand lives before he dies."
        author="Goerge R.R Martin"
      />
    </div>
  );
}
