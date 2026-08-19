"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  User,
  Users,
  Calendar,
  Heart,
  Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";
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
  "Bayburt",
  "Bilecik",
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

const interests = [
  "Oyun",
  "Müzik",
  "Kahve",
  "Sinema",
  "Kitap",
  "Gezi",
  "Spor",
  "Futbol",
  "Teknoloji",
  "Fotoğraf",
  "Dans",
  "Film"
];

const initialForm = {
  title: "",
  city: "",
  age: "",
  gender: "",
  friend_gender: "Fark etmez",
  age_range: "18-25",
  bio: ""
};

export default function CreateListingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/giris");
        return;
      }

      const { data: profileData, error: profileError } =
        await supabase
          .from("profiles")
          .select(
            "id, name, age, gender, city, avatar_url, bio"
          )
          .eq("id", user.id)
          .maybeSingle();

      if (!mounted) {
        return;
      }

      if (profileError) {
        setError(
          "Profil bilgilerin alınırken bir hata oluştu."
        );
        setLoading(false);
        return;
      }

      setUser(user);
      setProfile(profileData);

      if (profileData) {
        setForm((current) => ({
          ...current,
          city: profileData.city || "",
          age: profileData.age
            ? String(profileData.age)
            : "",
          gender: profileData.gender || ""
        }));
      }

      setLoading(false);
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  function toggleInterest(interest) {
    setSelectedInterests((current) => {
      if (current.includes(interest)) {
        return current.filter((item) => item !== interest);
      }

      if (current.length >= 6) {
        return current;
      }

      return [...current, interest];
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!user) {
      router.replace("/giris");
      return;
    }

    setError("");

    if (!profile) {
      setError(
        "Önce profil bilgilerini tamamlaman gerekiyor."
      );
      return;
    }

    if (!form.title.trim()) {
      setError("İlan başlığını yaz.");
      return;
    }

    if (!form.city) {
      setError("Şehir seç.");
      return;
    }

    if (!form.age) {
      setError("Yaşını gir.");
      return;
    }

    if (!form.gender) {
      setError("Cinsiyetini seç.");
      return;
    }

    if (!form.bio.trim()) {
      setError("İlan açıklamasını yaz.");
      return;
    }

    if (selectedInterests.length === 0) {
      setError("En az bir ilgi alanı seç.");
      return;
    }

    const age = Number(form.age);

    if (age < 18 || age > 99) {
      setError("Yaş 18 ile 99 arasında olmalıdır.");
      return;
    }

    setSaving(true);

    const { data, error: insertError } = await supabase
      .from("listings")
      .insert({
        user_id: user.id,
        title: form.title.trim(),
        bio: form.bio.trim(),
        city: form.city,
        age,
        gender: form.gender,
        friend_gender: form.friend_gender,
        age_range: form.age_range,
        interests: selectedInterests,
        avatar_url: profile.avatar_url || null
      })
      .select("id")
      .single();

    if (insertError) {
      setError(
        insertError.message ||
          "İlan oluşturulurken bir hata oluştu."
      );
      setSaving(false);
      return;
    }

    router.push(`/ilan/${data.id}`);
  }

  if (loading) {
    return (
      <main className="create-page">
        <header className="header">
          <div className="container navigation">
            <Link className="logo" href="/">
              <span className="logo-icon">♡</span>
              Arkadaş<span>Bul</span>
            </Link>
          </div>
        </header>

        <section className="container create-container">
          <div className="create-card">
            <p>İlan formu hazırlanıyor...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="create-page">
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

      <section className="container create-container">
        <div className="create-heading">
          <div className="section-label">
            ARKADAŞ BUL
          </div>

          <h1>Arkadaşlık ilanını oluştur</h1>

          <p>
            Kendini ve aradığın arkadaşlığı anlat.
            İlanın yayınlandıktan sonra diğer kullanıcılar
            tarafından görüntülenebilir.
          </p>
        </div>

        <form
          className="create-form"
          onSubmit={handleSubmit}
        >
          <div className="create-card">
            <div className="create-card-heading">
              <div className="create-card-icon">
                <Heart size={20} />
              </div>

              <div>
                <h2>İlan bilgileri</h2>

                <p>
                  İlanının nasıl görüneceğini belirle.
                </p>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="title">
                İlan başlığı
              </label>

              <input
                id="title"
                type="text"
                placeholder="Örn: Kafa dengi yeni arkadaşlar arıyorum"
                value={form.title}
                onChange={(event) =>
                  updateField(
                    "title",
                    event.target.value
                  )
                }
                maxLength={100}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">
                  <MapPin size={15} />
                  Şehir
                </label>

                <select
                  id="city"
                  value={form.city}
                  onChange={(event) =>
                    updateField(
                      "city",
                      event.target.value
                    )
                  }
                  required
                >
                  <option value="">
                    Şehir seç
                  </option>

                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="age">
                  <Calendar size={15} />
                  Yaş
                </label>

                <input
                  id="age"
                  type="number"
                  min="18"
                  max="99"
                  placeholder="23"
                  value={form.age}
                  onChange={(event) =>
                    updateField(
                      "age",
                      event.target.value
                    )
                  }
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                <User size={15} />
                Cinsiyet
              </label>

              <div className="option-grid">
                {["Erkek", "Kadın"].map(
                  (gender) => (
                    <button
                      key={gender}
                      type="button"
                      className={
                        form.gender === gender
                          ? "option-button active"
                          : "option-button"
                      }
                      onClick={() =>
                        updateField(
                          "gender",
                          gender
                        )
                      }
                    >
                      {gender}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="form-group">
              <label>
                <Users size={15} />
                Aradığın arkadaşın cinsiyeti
              </label>

              <div className="option-grid">
                {[
                  "Fark etmez",
                  "Erkek",
                  "Kadın"
                ].map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    className={
                      form.friend_gender ===
                      gender
                        ? "option-button active"
                        : "option-button"
                    }
                    onClick={() =>
                      updateField(
                        "friend_gender",
                        gender
                      )
                    }
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Aradığın yaş aralığı</label>

              <div className="option-grid">
                {[
                  "18-25",
                  "25-35",
                  "35-45",
                  "45+"
                ].map((range) => (
                  <button
                    key={range}
                    type="button"
                    className={
                      form.age_range === range
                        ? "option-button active"
                        : "option-button"
                    }
                    onClick={() =>
                      updateField(
                        "age_range",
                        range
                      )
                    }
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>İlgi alanların</label>

              <p className="form-hint">
                En fazla 6 tane seçebilirsin.
              </p>

              <div className="interest-grid">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    className={
                      selectedInterests.includes(
                        interest
                      )
                        ? "interest-button active"
                        : "interest-button"
                    }
                    onClick={() =>
                      toggleInterest(interest)
                    }
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bio">
                Kendinden bahset
              </label>

              <textarea
                id="bio"
                rows="7"
                placeholder="Nasıl bir arkadaşlık aradığını, neler yapmaktan hoşlandığını anlat..."
                value={form.bio}
                onChange={(event) =>
                  updateField(
                    "bio",
                    event.target.value
                  )
                }
                maxLength={1000}
                required
              />

              <p className="form-hint">
                En fazla 1000 karakter.
              </p>
            </div>

            {error && (
              <div className="auth-message error">
                {error}
              </div>
            )}

            <div className="create-submit-area">
              <button
                type="submit"
                className="publish-button"
                disabled={saving}
              >
                <Sparkles size={18} />

                {saving
                  ? "İlan yayınlanıyor..."
                  : "İlanı Yayınla"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}