"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Mail, Lock, UserPlus } from "lucide-react";
import { createClient } from "../lib/supabase/client";

export default function RegisterPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      "Kayıt başarılı. E-posta adresini doğrulaman gerekiyorsa gelen kutunu kontrol et."
    );

    setLoading(false);
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
            <UserPlus size={25} />
          </div>

          <div className="auth-heading">
            <div className="section-label">ARKADAŞ BUL</div>

            <h1>Hesabını oluştur</h1>

            <p>
              Arkadaşlık ilanı oluşturmak için ücretsiz hesabını oluştur.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">E-posta</label>

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
              <label htmlFor="password">Şifre</label>

              <div className="auth-input">
                <Lock size={18} />

                <input
                  id="password"
                  type="password"
                  placeholder="En az 6 karakter"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  minLength={6}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="auth-message error">
                {error}
              </div>
            )}

            {message && (
              <div className="auth-message success">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="publish-button auth-submit"
              disabled={loading}
            >
              {loading ? "Hesap oluşturuluyor..." : "Kayıt Ol"}
            </button>
          </form>

          <div className="auth-footer">
            Zaten hesabın var mı?{" "}
            <Link href="/giris">Giriş Yap</Link>
          </div>
        </div>
      </section>
    </main>
  );
}