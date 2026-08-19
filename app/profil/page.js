"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  MapPin,
  Save,
  LogOut,
  Camera,
  Pencil,
  Eye
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
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    city: "",
    bio: "",
    avatar_url: ""
  });

  const [myListings, setMyListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();

      try {
        const {
          data: {
            user: currentUser
          },
          error: userError
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!currentUser) {
          window.location.href = "/giris";
          return;
        }

        setUser(currentUser);

        const {
          data,
          error: profileError
        } = await supabase
          .from("profiles")
          .select(
            "id, name, age, gender, city, bio, avatar_url"
          )
          .eq(
            "id",
            currentUser.id
          )
          .single();

        if (profileError) {
          throw profileError;
        }

        setForm({
          name: data?.name || "",
          age:
            data?.age !== null &&
            data?.age !== undefined
              ? String(data.age)
              : "",
          gender: data?.gender || "",
          city: data?.city || "",
          bio: data?.bio || "",
          avatar_url:
            data?.avatar_url || ""
        });

        const {
          data: listingsData,
          error: listingsError
        } = await supabase
          .from("listings")
          .select(
            "id, title, bio, city, age, gender, friend_gender, age_range, interests, avatar_url, created_at"
          )
          .eq(
            "user_id",
            currentUser.id
          )
          .order(
            "created_at",
            {
              ascending: false
            }
          );

        if (listingsError) {
          console.error(
            "İlanlar yüklenemedi:",
            listingsError
          );
        } else {
          setMyListings(
            listingsData || []
          );
        }

      } catch (err) {
        console.error(
          "Profil yükleme hatası:",
          err
        );

        setError(
          "Profil yüklenirken hata oluştu: " +
            err.message
        );
      } finally {
        setLoading(false);
        setListingsLoading(false);
      }
    }

    loadProfile();
  }, []);

  function updateField(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value
    }));
  }

  async function handleSave(event) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    if (!user) {
      setError(
        "Kullanıcı oturumu bulunamadı."
      );
      setSaving(false);
      return;
    }

    const ageNumber = Number(
      form.age
    );

    if (!form.name.trim()) {
      setError(
        "Adını girmen gerekiyor."
      );
      setSaving(false);
      return;
    }

    if (
      !form.age ||
      ageNumber < 18 ||
      ageNumber > 99
    ) {
      setError(
        "Yaş 18 ile 99 arasında olmalıdır."
      );
      setSaving(false);
      return;
    }

    if (!form.gender) {
      setError(
        "Cinsiyetini seçmen gerekiyor."
      );
      setSaving(false);
      return;
    }

    if (!form.city) {
      setError(
        "Şehrini seçmen gerekiyor."
      );
      setSaving(false);
      return;
    }

    const supabase = createClient();

    const {
      error: saveError
    } = await supabase
      .from("profiles")
      .update({
        name: form.name.trim(),
        age: ageNumber,
        gender: form.gender,
        city: form.city,
        bio: form.bio.trim(),
        avatar_url:
          form.avatar_url.trim() || null
      })
      .eq(
        "id",
        user.id
      );

    if (saveError) {
      setError(
        saveError.message
      );

      setSaving(false);
      return;
    }

    setForm((previous) => ({
      ...previous,
      age: String(ageNumber)
    }));

    setMessage(
      "Profilin başarıyla güncellendi."
    );

    setSaving(false);

    setTimeout(() => {
      setMessage("");
      setEditing(false);
    }, 700);
  }

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    window.location.href = "/";
  }

  if (loading) {
    return (
      <main className="auth-page">
        <section className="container auth-container">
          <div className="auth-card">
            <div className="auth-icon">
              <User size={25} />
            </div>

            <h1>
              Profil yükleniyor...
            </h1>

            <p>
              Profil bilgilerin getiriliyor.
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

        <div className="auth-card profile-card">

          {error && (
            <div className="auth-message error">
              {error}
            </div>
          )}

          {!editing ? (
            <>
              <div className="auth-heading">

                <div className="section-label">
                  PROFİLİM
                </div>

                <h1>
                  {form.name}
                </h1>

                <p>
                  Arkadaşlık profilin
                </p>

              </div>

              <div className="profile-avatar-area">

                <div className="profile-avatar">

                  {form.avatar_url ? (
                    <img
                      src={form.avatar_url}
                      alt="Profil fotoğrafı"
                    />
                  ) : (
                    <User size={42} />
                  )}

                </div>

                <div>
                  <strong>
                    Profil fotoğrafı
                  </strong>

                  <p
                    style={{
                      margin: "5px 0 0",
                      color: "#8a837c",
                      fontSize: "12px"
                    }}
                  >
                    Fotoğraf yükleme
                    özelliği yakında
                    eklenecek.
                  </p>
                </div>

              </div>

              <div className="profile-email">
                <Mail size={17} />

                <span>
                  {user?.email}
                </span>
              </div>

              <div className="profile-info-list">

                <div className="profile-info-item">
                  <span>Yaş</span>

                  <strong>
                    {form.age}
                  </strong>
                </div>

                <div className="profile-info-item">
                  <span>Cinsiyet</span>

                  <strong>
                    {form.gender}
                  </strong>
                </div>

                <div className="profile-info-item">
                  <span>Şehir</span>

                  <strong>
                    <MapPin size={15} />
                    {form.city}
                  </strong>
                </div>

                <div className="profile-info-item profile-bio">
                  <span>Hakkında</span>

                  <p>
                    {form.bio ||
                      "Henüz bir açıklama eklenmemiş."}
                  </p>
                </div>

              </div>

              {message && (
                <div className="auth-message success">
                  {message}
                </div>
              )}

              <button
                type="button"
                className="publish-button auth-submit"
                onClick={() => {
                  setMessage("");
                  setEditing(true);
                }}
              >
                <Pencil size={18} />
                Profili Düzenle
              </button>

              <div className="my-listings-section">

                <div className="my-listings-heading">
                  <div>
                    <div className="section-label">
                      İLANLARIM
                    </div>

                    <h2>
                      Verdiğim ilanlar
                    </h2>
                  </div>

                  <Link
                    href="/ilan-ver"
                    className="my-listing-add-button"
                  >
                    + İlan Ver
                  </Link>
                </div>

                {listingsLoading ? (
                  <div className="my-listings-empty">
                    <p>
                      İlanların yükleniyor...
                    </p>
                  </div>
                ) : myListings.length === 0 ? (
                  <div className="my-listings-empty">
                    <p>
                      Henüz bir ilan vermedin.
                    </p>

                    <Link
                      href="/ilan-ver"
                      className="profile-button"
                    >
                      İlk İlanını Ver →
                    </Link>
                  </div>
                ) : (
                  <div className="my-listings-list">

                    {myListings.map(
                      (listing) => {

                        const interests =
                          Array.isArray(
                            listing.interests
                          )
                            ? listing.interests
                            : [];

                        return (
                          <article
                            key={listing.id}
                            className="my-listing-card"
                          >

                            <div className="my-listing-card-top">

                              <div>
                                <h3>
                                  {listing.title}
                                </h3>

                                <div className="my-listing-location">
                                  <MapPin size={14} />
                                  {listing.city}
                                </div>
                              </div>

                              <span className="my-listing-age">
                                {listing.age}
                              </span>

                            </div>

                            <p>
                              {listing.bio}
                            </p>

                            {interests.length > 0 && (
                              <div className="tags">
                                {interests
                                  .slice(0, 6)
                                  .map(
                                    (interest) => (
                                      <span
                                        key={interest}
                                      >
                                        {interest}
                                      </span>
                                    )
                                  )}
                              </div>
                            )}

                            <div className="my-listing-footer">

                              <span>
                                {listing.gender}
                              </span>

                              <Link
                                href={`/ilan/${listing.id}`}
                                className="profile-button"
                              >
                                <Eye size={15} />
                                İlanı Gör
                              </Link>

                            </div>

                          </article>
                        );
                      }
                    )}

                  </div>
                )}

              </div>

            </>
          ) : (
            <>
              <div className="auth-heading">

                <div className="section-label">
                  PROFİLİ DÜZENLE
                </div>

                <h1>
                  Profil bilgilerin
                </h1>

                <p>
                  Bilgilerini buradan
                  güncelleyebilirsin.
                </p>

              </div>

              <div className="profile-avatar-area">

                <div className="profile-avatar">

                  {form.avatar_url ? (
                    <img
                      src={form.avatar_url}
                      alt="Profil fotoğrafı"
                    />
                  ) : (
                    <User size={42} />
                  )}

                </div>

                <button
                  type="button"
                  className="profile-photo-button"
                  onClick={() =>
                    setMessage(
                      "Fotoğraf yükleme sistemi bir sonraki adımda aktif edilecek."
                    )
                  }
                >
                  <Camera size={17} />
                  Profil fotoğrafı ekle
                </button>

              </div>

              <div className="profile-email">

                <Mail size={17} />

                <span>
                  {user?.email}
                </span>

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
                      value={form.name}
                      onChange={(event) =>
                        updateField(
                          "name",
                          event.target.value
                        )
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
                        min="18"
                        max="99"
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

                    <label htmlFor="gender">
                      Cinsiyet
                    </label>

                    <div className="auth-input">

                      <select
                        id="gender"
                        value={form.gender}
                        onChange={(event) =>
                          updateField(
                            "gender",
                            event.target.value
                          )
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

                      {cities.map(
                        (item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        )
                      )}

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
                    value={form.bio}
                    onChange={(event) =>
                      updateField(
                        "bio",
                        event.target.value
                      )
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

                <button
                  type="button"
                  className="profile-logout"
                  onClick={() => {
                    setMessage("");
                    setEditing(false);
                  }}
                >
                  Vazgeç
                </button>

              </form>
            </>
          )}

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