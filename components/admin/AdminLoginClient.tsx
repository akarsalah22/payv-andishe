"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, User, KeyRound, Eye, EyeOff, Loader2, AlertCircle, ShieldAlert } from 'lucide-react';

export function AdminLoginClient() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [retryAfterSeconds, setRetryAfterSeconds] = useState<number | null>(null);

  // Countdown timer if locked out
  useEffect(() => {
    if (!retryAfterSeconds || retryAfterSeconds <= 0) return;

    const interval = setInterval(() => {
      setRetryAfterSeconds((prev) => {
        if (!prev || prev <= 1) {
          clearInterval(interval);
          setIsLockedOut(false);
          setErrorMessage(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [retryAfterSeconds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isLockedOut) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        // Success: refresh to load server-rendered AdminDashboard
        window.location.reload();
        return;
      }

      if (res.status === 429) {
        setIsLockedOut(true);
        setRetryAfterSeconds(data.retryAfterSeconds || 900);
        setErrorMessage(data.error || 'هەژمارەکەت بەهۆی ٥ هەوڵی هەڵە قفڵ کرا.');
      } else {
        setErrorMessage(data.error || 'ناوی بەکارهێنەر یان تێپەڕەوشە هەڵەیە!');
      }
    } catch {
      setErrorMessage('هەڵەیەک لە پەیوەندی بە سێرڤەر ڕوویدا، تکایە دووبارە هەوڵبدەرەوە.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatLockoutTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <main
      dir="rtl"
      className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-20 min-h-[75vh] text-right select-none"
    >
      <div className="w-full max-w-md mx-auto bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-lg dark:bg-zinc-900/90 dark:border-zinc-800 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400 flex items-center justify-center mx-auto shadow-xs">
            {isLockedOut ? (
              <ShieldAlert className="w-7 h-7 text-rose-600 dark:text-rose-400" strokeWidth={1.75} />
            ) : (
              <Lock className="w-7 h-7" strokeWidth={1.75} />
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-bold font-peshang tracking-normal text-stone-900 dark:text-zinc-100">
            چوونەژوورەوەی بەڕێوەبەر
          </h1>
          <p className="text-xs sm:text-sm font-normal font-sirwan text-stone-600 dark:text-zinc-400 leading-relaxed">
            {isLockedOut
              ? 'دەستگەیشتن بەهۆی هەوڵی شکستخواردووی زۆر قفڵ کراوە'
              : 'تکایە ناوی بەکارهێنەر و تێپەڕەوشە بنووسە'}
          </p>
        </div>

        {/* Error / Rate Limit Alert Banner */}
        {errorMessage && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-semibold font-sirwan text-right animate-in fade-in duration-200 flex items-start gap-2.5 ${
              isLockedOut
                ? 'bg-rose-100/80 border-rose-300 text-rose-800 dark:bg-rose-950/60 dark:border-rose-800/80 dark:text-rose-300'
                : 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/25 dark:text-rose-400'
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p>{errorMessage}</p>
              {isLockedOut && retryAfterSeconds && (
                <p className="font-mono text-[11px] font-bold text-rose-700 dark:text-rose-300" dir="ltr">
                  کاتی چاوەڕوانی: {formatLockoutTime(retryAfterSeconds)}
                </p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Field 1: Username */}
          <div className="space-y-1.5">
            <label
              htmlFor="usernameInput"
              className="block text-xs font-semibold font-sirwan text-stone-700 dark:text-zinc-300"
            >
              ناوی بەکارهێنەر
            </label>
            <div className="relative w-full">
              <input
                id="usernameInput"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errorMessage && !isLockedOut) setErrorMessage(null);
                }}
                disabled={isSubmitting || isLockedOut}
                placeholder="ناوی بەکارهێنەر..."
                className="w-full pr-10 pl-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 placeholder-stone-400 dark:bg-zinc-950/80 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:focus:border-amber-500 dark:focus:ring-amber-500 transition-colors font-sans disabled:opacity-60 disabled:cursor-not-allowed"
                autoFocus
                required
                autoComplete="username"
                dir="ltr"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-zinc-500 pointer-events-none">
                <User className="w-4 h-4" strokeWidth={1.75} />
              </div>
            </div>
          </div>

          {/* Field 2: Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="passwordInput"
              className="block text-xs font-semibold font-sirwan text-stone-700 dark:text-zinc-300"
            >
              تێپەڕەوشە
            </label>
            <div className="relative w-full">
              <input
                id="passwordInput"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage && !isLockedOut) setErrorMessage(null);
                }}
                disabled={isSubmitting || isLockedOut}
                placeholder="تێپەڕەوشە..."
                className="w-full pr-10 pl-11 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 placeholder-stone-400 dark:bg-zinc-950/80 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:focus:border-amber-500 dark:focus:ring-amber-500 transition-colors font-sans disabled:opacity-60 disabled:cursor-not-allowed"
                required
                autoComplete="current-password"
                dir="ltr"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-zinc-500 pointer-events-none">
                <KeyRound className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting || isLockedOut}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors p-1 cursor-pointer disabled:opacity-50"
                aria-label={showPassword ? 'شاردنەوەی تێپەڕەوشە' : 'پیشاندانی تێپەڕەوشە'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || isLockedOut}
              className="w-full py-3 rounded-xl bg-[#d49757] hover:bg-[#c28747] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-zinc-950 font-bold font-sirwan text-sm tracking-normal shadow-sm transition-transform duration-150 ease-out cursor-pointer touch-manipulation tap-highlight-transparent flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>پشکنینی زانیارییەکان...</span>
                </>
              ) : isLockedOut ? (
                <span>دەستگەیشتن قفڵە</span>
              ) : (
                <span>چوونە ناو پەنێڵ</span>
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-stone-200 dark:border-zinc-800">
          <Link
            href="/"
            className="text-xs font-sirwan text-stone-500 hover:text-stone-800 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
          >
            گەڕانەوە بۆ لاپەڕەی سەرەکی
          </Link>
        </div>
      </div>
    </main>
  );
}

