"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, User } from "lucide-react";
import { createClient } from "../lib/supabase/client";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [profileData, setProfileData] = useState(null);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");

  const [error, setError] = useState("");
  const [debug, setDebug] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient();

        setLoading(true);
        setError("");
        setDebug("");

        const {
          data: {
            session
          },
          error: sessionError
        } = await supabase.auth.getSession();

        if (sessionError) {
          setError(
            "Oturum okunamadı: " +
              sessionError.message
          );

          setLoading(false);
          return;
        }

        if (!session?.user) {
          setError(
            "Aktif kullanıcı oturumu bulunamadı."
          );

          setLoading(false);
          return;
        }

        const currentUser = session.user;

        setUserId(currentUser.id);
        setUserEmail(currentUser.email || "");

        const {
          data,
          error: profileError
        } = await supabase
          .from("profiles")
          .select(
            "id, name, age, gender, city, bio"
          )
          .eq(
            "id",
            currentUser.id
          )
          .maybeSingle();

        if (profileError) {
          console.error(
            "PROFILE ERROR:",
            profileError
          );

          setError(
            "Profil sorgusu hata verdi: " +
              profileError.message
          );

          setDebug(
            JSON.stringify(
              profileError,
              null,
              2
            )
          );

          setLoading(false);
          return;
        }

        if (!data) {
          setError(
            "Supabase sorgusu başarılı fakat bu kullanıcı için profil bulunamadı."
          );

          setDebug(
            "Aranan kullanıcı ID:\n" +
              currentUser.id
          );

          setLoading(false);
          return;
        }

        console.log(
          "SUPABASE PROFILE DATA:",
          data
        );

        setProfileData(data);

        setName(
          data.name || ""
        );

        setAge(
          data.age !== null &&
          data.age !== undefined
            ? String(data.age)
            : ""
        );

        setGender(
          data.gender || ""
        );

        setCity(
          data.city || ""
        );

        setBio(
          data.bio || ""
        );

        setDebug(
          JSON.stringify(
            data,
            null,
            2
          )
        );

        setLoading(false);
      } catch (err) {
        console.error(
          "PROFILE LOAD ERROR:",
          err
        );

        setError(
          "Beklenmeyen hata: " +
            err.message
        );

        setDebug(
          JSON.stringify(
            {
              message: err.message,
              stack: err.stack
            },
            null,
            2
          )
        );

        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <main className="auth-page">
        <header className="header">
          <div className="container navigation">
            <Link
              className="logo"
              href="/"
            >
              <span className="logo-icon">
                ♡
              </span>
              Arkadaş
              <span>Bul</span>
            </Link>
          </div>
        </header>

        <section className="container auth-container">
          <div className="auth-card">
            <div className="auth-icon">
              <User size={25} />
            </div>

            <h1>
              Profil yükleniyor...
            </h1>

            <p>
              Supabase profil bilgileri
              okunuyor.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <header className="header">
        <div className="container navigation">
          <Link
            className="logo"
            href="/"
          >
            <span className="logo-icon">
              ♡
            </span>
            Arkadaş
            <span>Bul</span>
          </Link>

          <Link
            href="/"
            className="back-link"
          >
            <ArrowLeft size={17} />
            Ana sayfaya dön
          </Link>
        </div>
      </header>

      <section className="container auth-container">
        <div className="auth-card">

          <div className="auth-icon">
            <User size={25} />
          </div>

          <div className="auth-heading">
            <div className="section-label">
              PROFİLİM
            </div>

            <h1>
              Profil bilgilerin
            </h1>

            <p>
              Profil bilgilerin Supabase'den
              okunuyor.
            </p>
          </div>

          {error && (
            <div className="auth-message error">
              {error}
            </div>
          )}

          <div
            style={{
              marginBottom: "20px",
              padding: "15px",
              background: "#f5f5f5",
              borderRadius: "12px",
              fontSize: "13px",
              wordBreak: "break-all"
            }}
          >
            <strong>
              Oturumdaki kullanıcı ID:
            </strong>

            <div>
              {userId || "YOK"}
            </div>

            <br />

            <strong>
              E-posta:
            </strong>

            <div>
              {userEmail || "YOK"}
            </div>
          </div>

          <div
            style={{
              marginBottom: "20px",
              padding: "15px",
              background: "#f5f5f5",
              borderRadius: "12px",
              fontSize: "13px",
              wordBreak: "break-word"
            }}
          >
            <strong>
              Supabase'den gelen profil:
            </strong>

            <pre
              style={{
                whiteSpace: "pre-wrap",
                marginTop: "10px"
              }}
            >
              {debug || "VERİ YOK"}
            </pre>
          </div>

          <form className="auth-form">
            <div className="form-group">
              <label htmlFor="name">
                Adın
              </label>

              <input
                id="name"
                type="text"
                value={name}
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">
                Yaş
              </label>

              <input
                id="age"
                type="text"
                value={age}
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">
                Cinsiyet
              </label>

              <input
                id="gender"
                type="text"
                value={gender}
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">
                Şehir
              </label>

              <input
                id="city"
                type="text"
                value={city}
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">
                Hakkında
              </label>

              <textarea
                id="bio"
                value={bio}
                readOnly
                rows={5}
              />
            </div>
          </form>

        </div>
      </section>
    </main>
  );
}