"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Lock,
  LogIn
} from "lucide-react";
import { createClient } from "../lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password
      });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/";
  }

  return (
    <main className="auth-page">
      <header className="header">
        <div className="container navigation">
          <Link className="logo" href="/">
            <span className="logo-icon">♡</span>
            Arkadaş<span>Bul</span>
          </Link>

          <Link href="/" className="back-link">
            <ArrowLeft size={17} />
            Ana sayfaya dön
          </Link>
        </div>
      </header>

      <section className="container auth-container">
        <div className="auth-card">
          <div className="auth-icon">
            <LogIn size={25} />
          </div>

          <div className="auth-heading">
            <div className="section-label">
              ARKADAŞ BUL
            </div>

            <h1>Tekrar hoş geldin</h1>

            <p>
              Hesabına giriş yap ve arkadaşlık
              ilanlarını keşfet.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="auth-form"
          >
            <div className="form-group">
              <label htmlFor="email">
                E-posta
              </label>

              <div className="auth-input">
                <Mail size={18} />

                <input
                  id="email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Şifre
              </label>

              <div className="auth-input">
                <Lock size={18} />

                <input
                  id="password"
                  type="password"
                  placeholder="Şifren"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                />
              </div>
            </div>

            {error && (
              <div className="auth-message error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="publish-button auth-submit"
              disabled={loading}
            >
              {loading
                ? "Giriş yapılıyor..."
                : "Giriş Yap"}
            </button>
          </form>

          <div className="auth-footer">
            Hesabın yok mu?{" "}
            <Link href="/kayit">
              Kayıt Ol
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}