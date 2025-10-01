import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/useUserStore";
import { Loader2, LockKeyhole, ArrowLeft, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { loading, resetPassword } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      console.error("No reset token found");
      return;
    }

    if (!newPassword) {
      console.error("Password is required");
      return;
    }

    try {
      await resetPassword(token, newPassword);
      navigate("/login");
    } catch (error) {
      console.error("Password reset failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-orange-50/20 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-orange/10 dark:bg-orange/20 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="size-8 text-orange dark:text-amber-400" />
              </div>
            </div>
            <h1 className="font-bold text-2xl text-card-foreground mb-2">
              Reset Password
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter your new password to secure your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-5" />
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className="pl-11 focus-visible:ring-2 focus-visible:ring-orange/20 transition-all duration-200 bg-background"
                required
                minLength={6}
              />
            </div>

            {/* Password Requirements Hint */}
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">
                Make sure your new password is strong and different from
                previous ones.
              </p>
            </div>

            {/* Submit Button */}
            {loading ? (
              <Button
                disabled
                type="submit"
                className="w-full bg-orange hover:bg-hoverOrange dark:bg-amber-600 dark:hover:bg-amber-700 h-11 rounded-xl transition-all duration-200"
              >
                <Loader2 className="mr-2 size-4 animate-spin" />
                Resetting password...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-orange hover:bg-hoverOrange dark:bg-amber-600 dark:hover:bg-amber-700 h-11 rounded-xl font-medium transition-all duration-200 hover:shadow-lg"
                disabled={!newPassword || !token}
              >
                Reset Password
              </Button>
            )}

            {/* Back to Login */}
            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <ArrowLeft className="mr-2 size-4" />
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
