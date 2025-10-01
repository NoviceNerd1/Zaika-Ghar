import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/useUserStore";
import { Loader2, Mail, ShieldCheck } from "lucide-react";
import { type FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRef = useRef<HTMLInputElement[]>([]);
  const { loading, verifyEmail } = useUserStore();
  const navigate = useNavigate();

  const handleChange = (index: number, value: string) => {
    if (/^[a-zA-Z0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to the next input field if a digit is entered
      if (value !== "" && index < 5) {
        inputRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRef.current[index - 1]?.focus();
    }

    // Handle paste event
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const pastedArray = pastedData.split("");

    const newOtp = [...otp];
    pastedArray.forEach((char, index) => {
      if (index < 6 && /^[a-zA-Z0-9]$/.test(char)) {
        newOtp[index] = char;
      }
    });

    setOtp(newOtp);

    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex((val) => val === "");
    if (nextEmptyIndex !== -1) {
      inputRef.current[nextEmptyIndex]?.focus();
    } else {
      inputRef.current[5]?.focus();
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const verificationCode = otp.join("");

    if (verificationCode.length !== 6) {
      return;
    }

    try {
      await verifyEmail(verificationCode);
      navigate("/");
    } catch (error) {
      console.error("Verification error:", error);
      // Optionally clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      inputRef.current[0]?.focus();
    }
  };

  const isSubmitDisabled = otp.join("").length !== 6 || loading;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-orange-50/20 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-orange/10 dark:bg-orange/20 rounded-2xl flex items-center justify-center">
                  <Mail className="size-8 text-orange dark:text-amber-400" />
                </div>
                <ShieldCheck className="absolute -bottom-1 -right-1 size-5 text-green-500 bg-white dark:bg-gray-800 rounded-full p-0.5" />
              </div>
            </div>
            <h1 className="font-bold text-2xl text-card-foreground mb-2">
              Verify Your Email
            </h1>
            <p className="text-muted-foreground text-sm">
              We've sent a 6-digit verification code to your email address
            </p>
          </div>

          {/* OTP Form */}
          <form onSubmit={submitHandler} className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between gap-2" onPaste={handlePaste}>
                {otp.map((digit: string, idx: number) => (
                  <Input
                    key={idx}
                    ref={(el) => {
                      if (el) inputRef.current[idx] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange(idx, e.target.value)
                    }
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                      handleKeyDown(idx, e)
                    }
                    onFocus={(e) => e.target.select()}
                    className="w-12 h-12 text-center text-xl font-semibold rounded-xl border-2 border-input focus:border-orange dark:focus:border-amber-400 focus:ring-0 transition-all duration-200 bg-background text-card-foreground"
                    autoComplete="one-time-code"
                    inputMode="numeric"
                  />
                ))}
              </div>

              {/* Helper Text */}
              <p className="text-xs text-muted-foreground text-center">
                Can't find the code? Check your spam folder or{" "}
                <button
                  type="button"
                  className="text-orange dark:text-amber-400 hover:underline font-medium"
                  onClick={() => console.log("Resend code")}
                >
                  resend code
                </button>
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full bg-orange hover:bg-hoverOrange dark:bg-amber-600 dark:hover:bg-amber-700 h-11 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Having trouble?{" "}
              <button
                type="button"
                className="text-orange dark:text-amber-400 hover:underline font-medium"
                onClick={() => navigate("/contact")}
              >
                Contact support
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
