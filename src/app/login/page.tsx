"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowLeft, FileText, Sparkles, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { Button, OAuthButton } from "@/components/ui/button";
import { Input, PasswordStrength } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/toast";

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Check for callback errors
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      addToast(
        error === "OAuthAccountNotLinked"
          ? "This email is already registered with a different provider"
          : "Authentication failed. Please try again.",
        "error"
      );
    }
  }, [searchParams, addToast]);

  // Validation
  const validateField = useCallback((field: string, value: string) => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.length < 2) return "Name must be at least 2 characters";
        return "";
      case "email":
        if (!value) return "Email is required";
        if (!emailRegex.test(value)) return "Please enter a valid email";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        return "";
      case "confirmPassword":
        if (!isLogin && !value) return "Please confirm your password";
        if (!isLogin && value !== formData.password) return "Passwords do not match";
        return "";
      default:
        return "";
    }
  }, [isLogin, formData.password]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field as keyof typeof formData]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
    // Also validate confirmPassword when password changes
    if (field === "password" && touched.confirmPassword) {
      const confirmError = validateField("confirmPassword", formData.confirmPassword);
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const validateForm = () => {
    const fields = isLogin ? ["email", "password"] : ["name", "email", "password", "confirmPassword"];
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};

    fields.forEach((field) => {
      newTouched[field] = true;
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) newErrors[field] = error;
    });

    setTouched(newTouched);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast("Please fix the errors in the form", "error");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          addToast("Invalid email or password", "error");
          setErrors({ password: "Invalid email or password" });
        } else {
          addToast("Welcome back!", "success");
          router.push("/documents");
        }
      } else {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (data.error?.includes("email")) {
            setErrors({ email: data.error });
          }
          addToast(data.error || "Registration failed", "error");
        } else {
          addToast("Account created successfully!", "success");
          const result = await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            redirect: false,
          });

          if (result?.ok) {
            router.push("/documents");
          }
        }
      }
    } catch {
      addToast("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setOauthLoading(provider);
    try {
      await signIn(provider, { callbackUrl: "/documents" });
    } catch {
      addToast(`Failed to sign in with ${provider}`, "error");
      setOauthLoading(null);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setTouched({});
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-purple-500/10" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-2 text-gray-900 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to home</span>
          </Link>

          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-900 rounded-2xl">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-bold text-gray-900">Collab Editor</span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              Write together,<br />
              <span className="text-sky-600">in real-time.</span>
            </h1>

            <p className="text-lg text-gray-600 max-w-md">
              Create beautiful documents with your team. See changes instantly,
              collaborate seamlessly, and bring your ideas to life.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-100 rounded-lg">
                  <Sparkles className="w-5 h-5 text-sky-600" />
                </div>
                <span className="text-gray-700">Real-time collaboration with live cursors</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-700">Secure & private document storage</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-gray-700">Lightning-fast sync across devices</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            Trusted by thousands of teams worldwide
          </p>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="p-2 bg-gray-900 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Collab Editor</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-gray-900">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-2 text-gray-600">
              {isLogin
                ? "Sign in to continue to your documents"
                : "Start collaborating with your team today"}
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <OAuthButton
              provider="google"
              onClick={() => handleOAuth("google")}
              loading={oauthLoading === "google"}
              disabled={loading || oauthLoading !== null}
            />
            <OAuthButton
              provider="github"
              onClick={() => handleOAuth("github")}
              loading={oauthLoading === "github"}
              disabled={loading || oauthLoading !== null}
            />
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-sm text-gray-500">
                or continue with email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {!isLogin && (
              <Input
                label="Full Name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                error={touched.name ? errors.name : undefined}
                placeholder="John Doe"
                autoComplete="name"
                required
              />
            )}

            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              error={touched.email ? errors.email : undefined}
              success={touched.email && !errors.email && formData.email.length > 0}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />

            <div className="space-y-2">
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                error={touched.password ? errors.password : undefined}
                placeholder="Enter your password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                showPasswordToggle
                required
              />
              {!isLogin && formData.password && (
                <PasswordStrength password={formData.password} />
              )}
            </div>

            {!isLogin && (
              <Input
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                onBlur={() => handleBlur("confirmPassword")}
                error={touched.confirmPassword ? errors.confirmPassword : undefined}
                success={touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword.length > 0}
                placeholder="Confirm your password"
                autoComplete="new-password"
                showPasswordToggle
                required
              />
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <Checkbox
                  label="Remember me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              disabled={oauthLoading !== null}
              icon={<Mail className="w-5 h-5" />}
            >
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          {/* Toggle Login/Register */}
          <p className="text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={switchMode}
              className="font-semibold text-sky-600 hover:text-sky-700 transition-colors"
            >
              {isLogin ? "Sign up for free" : "Sign in"}
            </button>
          </p>

          {/* Terms */}
          {!isLogin && (
            <p className="text-center text-xs text-gray-500">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-gray-700">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-gray-700">
                Privacy Policy
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
