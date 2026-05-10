import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { LogIn } from "lucide-react";
import { useAuth } from "../../src/globally/hooks/useAuths";
import {
  Field,
  Input,
  PasswordInput,
  Button,
  ErrorBanner,
} from "../../src/components/ui";
import { LogoMark } from "../../src/components/auth/LogoMark";
import { RightPanel } from "../../src/components/auth/RightPanel";

export default function Login() {
  const { signIn, isAuthenticated, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  //redirect user if already Logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) navigate("/", { replace: true });
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (error) clearError();
  }, [form.email, form.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      await signIn(form.email, form.password);
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
      {/*Left Panel */}
      <div className="flex flex-col justify-between px-12 py-10 dark:bg-gray-900">
        <LogoMark linkDisabled/>

        <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white mb-1.5">
            Welcome back
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-8 leading-relaxed">
            Sign in to your account to continue reading and writing.
          </p>

          {error && <ErrorBanner message={error} />}

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
              placeholder="........."
              required
              autoComplete="current-passaword"
              error={!!error}
            />
          </Field>

          <Button type="submit" loading={submitting} fullwidth>
            <LogIn size={15} />
            Sign in
          </Button>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-gray-900 font-medium underline underline-offset-2 dark:text-white"
            >
              Sign up
            </Link>
          </p>
        </form>

        <p className="text-xs text-gray-300 dark:text-gray-600">
          © 2025 Blog Template. All rights reserved.
        </p>
      </div>
      {/*Right Panel */}
      <RightPanel
        quote="Writing is the painting of the voice."
        author="Voltaire"
      />
    </div>
  );
}
