"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  MapPin,
  Save,
  LogOut
} from "lucide-react";

import { createClient } from "../lib/supabase/client";

const cities = [
  "Adana",
  "Adıyaman",
  "Afyonkarahisar",
  "Ağrı",
  "Aksaray",
  "Amasya",
  "Ankara",
  "Antalya",
  "Artvin",
  "Aydın",
  "Balıkesir",
  "Batman",
  "Bingöl",
  "Bitlis",
  "Bolu",
  "Burdur",
  "Bursa",
  "Çanakkale",
  "Çankırı",
  "Çorum",
  "Denizli",
  "Diyarbakır",
  "Düzce",
  "Edirne",
  "Elazığ",
  "Erzincan",
  "Erzurum",
  "Eskişehir",
  "Gaziantep",
  "Giresun",
  "Gümüşhane",
  "Hakkari",
  "Hatay",
  "Iğdır",
  "Isparta",
  "İstanbul",
  "İzmir",
  "Kahramanmaraş",
  "Karabük",
  "Karaman",
  "Kars",
  "Kastamonu",
  "Kayseri",
  "Kilis",
  "Kırıkkale",
  "Kırklareli",
  "Kırşehir",
  "Kocaeli",
  "Konya",
  "Kütahya",
  "Malatya",
  "Manisa",
  "Mardin",
  "Mersin",
  "Muğla",
  "Muş",
  "Nevşehir",
  "Niğde",
  "Ordu",
  "Osmaniye",
  "Rize",
  "Sakarya",
  "Samsun",
  "Siirt",
  "Sinop",
  "Sivas",
  "Şanlıurfa",
  "Şırnak",
  "Tekirdağ",
  "Tokat",
  "Trabzon",
  "Tunceli",
  "Uşak",
  "Van",
  "Yalova",
  "Yozgat",
  "Zonguldak"
];

export default function ProfilePage() {
  const supabase = createClient();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/giris";
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data) {
        setName(data.name || "");
        setAge(data.age ? String(data.age) : "");
        setGender(data.gender || "");
        setCity(data.city || "");
        setBio(data.bio || "");
      }

      setLoading(false);
    }

    loadProfile();
  }, [supabase]);

  async function handleSave(event) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Adını girmen gerekiyor.");
      setSaving(false);
      return;
    }

    if (!age) {
      setError("Yaşını girmen gerekiyor.");
      setSaving(false);
      return;
    }

    if (!gender) {
      setError("Cinsiyetini seçmen gerekiyor.");
      setSaving(false);
      return;
    }

    if (!city) {
      setError("Şehrini seçmen gerekiyor.");
      setSaving(false);
      return;
    }

    const ageNumber = Number(age);

    if (ageNumber < 18 || ageNumber > 99) {
      setError("Yaş 18 ile 99 arasında olmalıdır.");
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        name: name.trim(),
        age: ageNumber,
        gender,
        city,
        bio: bio.trim()
      });

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    setMessage("Profilin başarıyla kaydedildi.");
    setSaving(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) {
    return (
      <main className="auth-page">
        <div className="container auth-container">
          <div className="auth-card">
            <p>Profil yükleniyor...</p>
          </div>
        </div>
      </main>
    );
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
        <div className="auth-card profile-card">
          <div className="auth-icon">
            <User size={25} />
          </div>

          <div className="auth-heading">
            <div className="section-label">
              PROFİLİM
            </div>

            <h1>Profil bilgilerin</h1>

            <p>
              Bu bilgiler arkadaşlık ilanlarında
              kullanılacaktır.
            </p>
          </div>

          <div className="profile-email">
            <Mail size={17} />
            <span>{user?.email}</span>
          </div>

          <form
            onSubmit={handleSave}
            className="auth-form"
          >
            <div className="form-group">
              <label htmlFor="name">
                Adın
              </label>

              <div className="auth-input">
                <User size={18} />

                <input
                  id="name"
                  type="text"
                  placeholder="Adın"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  maxLength={50}
                  required
                />
              </div>
            </div>

            <div className="profile-form-row">
              <div className="form-group">
                <label htmlFor="age">
                  Yaş
                </label>

                <div className="auth-input">
                  <input
                    id="age"
                    type="number"
                    placeholder="25"
                    min="18"
                    max="99"
                    value={age}
                    onChange={(event) =>
                      setAge(event.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="gender">
                  Cinsiyet
                </label>

                <div className="auth-input">
                  <select
                    id="gender"
                    value={gender}
                    onChange={(event) =>
                      setGender(event.target.value)
                    }
                    required
                  >
                    <option value="">
                      Seç
                    </option>
                    <option value="Erkek">
                      Erkek
                    </option>
                    <option value="Kadın">
                      Kadın
                    </option>
                    <option value="Belirtmek istemiyorum">
                      Belirtmek istemiyorum
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="city">
                Şehir
              </label>

              <div className="auth-input">
                <MapPin size={18} />

                <select
                  id="city"
                  value={city}
                  onChange={(event) =>
                    setCity(event.target.value)
                  }
                  required
                >
                  <option value="">
                    Şehir seç
                  </option>

                  {cities.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bio">
                Hakkında
              </label>

              <textarea
                id="bio"
                placeholder="Kendinden biraz bahset..."
                value={bio}
                onChange={(event) =>
                  setBio(event.target.value)
                }
                maxLength={500}
                rows={5}
              />
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
              disabled={saving}
            >
              <Save size={18} />

              {saving
                ? "Kaydediliyor..."
                : "Profili Kaydet"}
            </button>
          </form>

          <button
            type="button"
            className="profile-logout"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Çıkış Yap
          </button>
        </div>
      </section>
    </main>
  );
}