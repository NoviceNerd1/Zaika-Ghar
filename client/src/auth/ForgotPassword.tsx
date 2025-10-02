import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, ArrowLeft, ShieldQuestion } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/user/forgot-password`;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  /** Common POST helper with safe JSON parsing */
  const postEmail = async () => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      // log raw text for debugging backend errors
      const text = await res.text();
      throw new Error(`Request failed ${res.status}: ${text || "No body"}`);
    }
    return res.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email address");

    setLoading(true);
    try {
      const data = await postEmail();
      if (data.success) {
        setIsSubmitted(true);
        toast.success("Password reset link sent to your email!");
      } else {
        toast.error(data.message || "Failed to send reset link");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Forgot password error:", err.message);
        toast.error(err.message || "Something went wrong. Please try again.");
      } else {
        console.error("Unknown error:", err);
        toast.error("Unexpected error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      const data = await postEmail();
      if (data.success) {
        toast.success("Reset link sent again!");
      } else {
        toast.error(data.message || "Failed to resend email");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Forgot password error:", err.message);
        toast.error(err.message || "Something went wrong. Pleasr try again.");
      } else {
        console.error("Unknown error:", err);
        toast.error("Unexpected error. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-orange-50/20 dark:from-gray-900 dark:to-gray-800 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-2xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Mail className="size-10 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h1 className="font-bold text-2xl text-card-foreground mb-3">
              Check Your Email
            </h1>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              We’ve sent a password reset link to <br />
              <span className="font-semibold text-card-foreground">
                {email}
              </span>
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              The link will expire in 1 hour for security reasons.
            </p>
            <div className="space-y-3">
              <Button
                onClick={handleResend}
                disabled={loading}
                className="w-full bg-orange hover:bg-hoverOrange dark:bg-amber-600 dark:hover:bg-amber-700 h-11 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Resend Email"
                )}
              </Button>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-xl border-border"
                >
                  <ArrowLeft className="mr-2 size-4" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-orange-50/20 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-orange/10 dark:bg-orange/20 rounded-2xl flex items-center justify-center">
                <ShieldQuestion className="size-8 text-orange dark:text-amber-400" />
              </div>
            </div>
            <h1 className="font-bold text-2xl text-card-foreground mb-2">
              Forgot Password?
            </h1>
            <p className="text-muted-foreground text-sm">
              No worries! Enter your email and we’ll send you reset
              instructions.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-card-foreground"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="pl-10 h-11 focus-visible:ring-2 focus-visible:ring-orange/20 dark:focus-visible:ring-amber-400/20 bg-background"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-orange hover:bg-hoverOrange dark:bg-amber-600 dark:hover:bg-amber-700 h-11 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Sending Reset Link…
                </>
              ) : (
                "Send Reset Instructions"
              )}
            </Button>
            <div className="text-center pt-4">
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-card-foreground transition-colors duration-200"
                  disabled={loading}
                >
                  <ArrowLeft className="mr-2 size-4" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </form>
          <div className="mt-6 p-4 bg-muted/50 dark:bg-muted/20 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              💡 Check your spam folder if you don’t see the email in your
              inbox.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
