"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Heart,
  Plus,
  SlidersHorizontal,
  Sparkles,
  User,
  LogOut,
  Mars,
  Venus
} from "lucide-react";

import AdSlot from "./components/AdSlot";
import { createClient } from "./lib/supabase/client";

function GenderInfo({ gender }) {
  if (!gender) return null;

  const normalized = String(gender).toLowerCase();

  const isMale =
    normalized.includes("erkek") ||
    normalized === "male";

  const isFemale =
    normalized.includes("kadın") ||
    normalized.includes("kadin") ||
    normalized === "female";

  if (isMale) {
    return (
      <span className="gender-info">
        <Mars size={14} />
        Erkek
      </span>
    );
  }

  if (isFemale) {
    return (
      <span className="gender-info">
        <Venus size={14} />
        Kadın
      </span>
    );
  }

  return (
    <span className="gender-info">
      {gender}
    </span>
  );
}

function ListingCard({ item }) {
  const profile = item.profile || {};

  const name = profile.name || "İsimsiz";
  const age = item.age || profile.age || "";
  const city = item.city || profile.city || "";

  const avatarUrl =
    item.avatar_url ||
    profile.avatar_url ||
    "";

  const interests = Array.isArray(item.interests)
    ? item.interests
    : [];

  const friendGender =
    item.friend_gender || "Fark etmez";

  const ageRange =
    item.age_range || "";

  return (
    <article className="listing-card">

      <div className="listing-header">

        <div className="avatar-container">

          <div className="avatar">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
              />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </div>

          <span className="online-indicator" />

        </div>

        <div className="user-info">

          <h3>
            {name}
            {age ? `, ${age}` : ""}
          </h3>

          <div className="location">
            <MapPin size={14} />
            {city}
          </div>

          <div className="listing-gender">
            <GenderInfo
              gender={
                item.gender ||
                profile.gender
              }
            />
          </div>

        </div>

        <button
          className="favorite-button"
          aria-label="Favorilere ekle"
        >
          <Heart size={19} />
        </button>

      </div>

      <div className="listing-title">

        <h4>
          {item.title ||
            "Yeni arkadaşlar arıyorum"}
        </h4>

      </div>

      <p className="listing-text">
        {item.bio ||
          "Arkadaşlık için yeni insanlarla tanışmak istiyorum."}
      </p>

      {(friendGender || ageRange) && (
        <div className="listing-looking">

          <span className="looking-label">
            Aradığı:
          </span>

          {friendGender && (
            <span className="looking-item">
              {friendGender === "Erkek" && (
                <Mars size={14} />
              )}

              {friendGender === "Kadın" && (
                <Venus size={14} />
              )}

              {friendGender}
            </span>
          )}

          {ageRange && (
            <span className="looking-item">
              {ageRange} yaş
            </span>
          )}

        </div>
      )}

      {interests.length > 0 && (
        <div className="tags">

          {interests
            .slice(0, 5)
            .map((tag) => (
              <span key={tag}>
                {tag}
              </span>
            ))}

        </div>
      )}

      <div className="listing-footer">

        <span className="online-text">
          ● Aktif ilan
        </span>

        <Link
          href={`/ilan/${item.id}`}
          className="profile-button"
        >
          İlanı Gör →
        </Link>

      </div>

    </article>
  );
}

export default function Home() {
  const supabase = createClient();

  const [listings, setListings] = useState([]);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] =
    useState(true);
  const [loadingListings, setLoadingListings] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadPage() {

      const {
        data: {
          user: currentUser
        }
      } = await supabase.auth.getUser();

      if (mounted) {
        setUser(currentUser);
        setCheckingAuth(false);
      }

      const {
        data: listingData,
        error: listingError
      } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", {
          ascending: false
        });

      if (listingError) {

        console.error(
          "İlanlar alınamadı:",
          listingError
        );

        if (mounted) {
          setListings([]);
          setLoadingListings(false);
        }

        return;
      }

      const rows = listingData || [];

      const userIds = [
        ...new Set(
          rows
            .map(
              (listing) =>
                listing.user_id
            )
            .filter(Boolean)
        )
      ];

      let profiles = [];

      if (userIds.length > 0) {

        const {
          data: profileData,
          error: profileError
        } = await supabase
          .from("profiles")
          .select(
            "id, name, age, gender, city, avatar_url"
          )
          .in("id", userIds);

        if (profileError) {

          console.error(
            "Profiller alınamadı:",
            profileError
          );

        } else {

          profiles =
            profileData || [];

        }
      }

      const profileMap = {};

      profiles.forEach((profile) => {
        profileMap[profile.id] =
          profile;
      });

      const combinedListings =
        rows.map((listing) => ({
          ...listing,

          profile:
            profileMap[
              listing.user_id
            ] || null
        }));

      if (mounted) {
        setListings(
          combinedListings
        );

        setLoadingListings(false);
      }
    }

    loadPage();

    const {
      data: {
        subscription
      }
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {

          if (mounted) {
            setUser(
              session?.user ?? null
            );

            setCheckingAuth(false);
          }
        }
      );

    return () => {

      mounted = false;

      subscription.unsubscribe();
    };

  }, [supabase]);

  async function handleLogout() {

    await supabase.auth.signOut();

    window.location.href = "/";
  }

  return (
    <main>

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

          <nav>

            <a href="#ilanlar">
              İlanlar
            </a>

            <a href="#nasil">
              Nasıl Çalışır?
            </a>

          </nav>

          <div className="header-actions">

            <Link
              href="/ilan-ver"
              className="create-button"
            >
              <Plus size={18} />
              İlan Ver
            </Link>

            {checkingAuth
              ? null
              : user
                ? (
                  <>
                    <Link
                      href="/profil"
                      className="account-button"
                    >
                      <User size={17} />
                      Profilim
                    </Link>

                    <button
                      type="button"
                      className="logout-button"
                      onClick={handleLogout}
                    >
                      <LogOut size={17} />
                      Çıkış
                    </button>
                  </>
                )
                : (
                  <>
                    <Link
                      href="/giris"
                      className="login-button"
                    >
                      Giriş Yap
                    </Link>

                    <Link
                      href="/kayit"
                      className="register-button"
                    >
                      Kayıt Ol
                    </Link>
                  </>
                )}

          </div>

        </div>

      </header>

      <section className="hero">

        <div className="hero-background one" />
        <div className="hero-background two" />

        <div className="container hero-content">

          <div className="hero-label">
            <Sparkles size={15} />
            Yeni insanlarla tanış
          </div>

          <h1>
            Aradığın arkadaşlık
            <br />
            <span>
              burada başlayabilir.
            </span>
          </h1>

          <p>
            Ortak ilgi alanlarına sahip
            insanları keşfet,
            arkadaşlık ilanlarını incele
            ve yeni bağlantılar kur.
          </p>

          <div className="search-panel">

            <div className="search-input">
              <Search size={20} />

              <input
                type="text"
                placeholder="Ne tür bir arkadaş arıyorsun?"
              />
            </div>

            <div className="city-input">

              <MapPin size={19} />

              <select defaultValue="">

                <option
                  value=""
                  disabled
                >
                  Şehir seç
                </option>

                <option>
                  Mardin
                </option>

                <option>
                  Diyarbakır
                </option>

                <option>
                  Gaziantep
                </option>

                <option>
                  Şanlıurfa
                </option>

                <option>
                  Batman
                </option>

              </select>

            </div>

            <button className="search-button">
              İlanları Bul
            </button>

          </div>

          <div className="popular-tags">

            <span>
              Popüler:
            </span>

            {[
              "Oyun",
              "Kahve",
              "Gezi",
              "Spor",
              "Sinema"
            ].map((tag) => (
              <button key={tag}>
                {tag}
              </button>
            ))}

          </div>

        </div>

      </section>

      <section
        className="container listings-section"
        id="ilanlar"
      >

        <div className="section-header">

          <div>

            <div className="section-label">
              KEŞFET
            </div>

            <h2>
              Yeni arkadaşlık ilanları
            </h2>

            <p>
              Sana uygun insanları keşfet
              ve yeni bağlantılar kur.
            </p>

          </div>

          <button className="filter-button">

            <SlidersHorizontal size={17} />

            Filtrele

          </button>

        </div>

        {loadingListings ? (

          <div className="empty-state">
            İlanlar yükleniyor...
          </div>

        ) : listings.length === 0 ? (

          <div className="empty-state">
            Henüz ilan bulunmuyor.
          </div>

        ) : (

          <div className="listing-grid">

            {listings.map(
              (item, index) => (

                <div key={item.id}>

                  <ListingCard
                    item={item}
                  />

                  {(index + 1) % 4 === 0 && (
                    <AdSlot
                      size="medium"
                    />
                  )}

                </div>

              )
            )}

          </div>

        )}

      </section>

      <section
        className="how-section"
        id="nasil"
      >

        <div className="container">

          <div className="section-label">
            ÇOK KOLAY
          </div>

          <h2>
            Yeni bir arkadaşlık
            <br />
            3 adım uzağında.
          </h2>

          <div className="steps">

            <div className="step">

              <span>
                01
              </span>

              <h3>
                Keşfet
              </h3>

              <p>
                Şehrini ve ilgi alanlarını
                seçerek sana uygun ilanları bul.
              </p>

            </div>

            <div className="step">

              <span>
                02
              </span>

              <h3>
                Tanış
              </h3>

              <p>
                Profilleri incele, ortak
                noktalarınızı keşfet ve iletişim kur.
              </p>

            </div>

            <div className="step">

              <span>
                03
              </span>

              <h3>
                Bağlan
              </h3>

              <p>
                Yeni arkadaşlığını güzel
                anılara dönüştür.
              </p>

            </div>

          </div>

        </div>

      </section>

      <footer>

        <div className="container footer">

          <div className="logo">

            <span className="logo-icon">
              ♡
            </span>

            Arkadaş
            <span>Bul</span>

          </div>

          <p>
            Yeni arkadaşlıklar,
            gerçek bağlantılar.
          </p>

          <small>
            © 2026 ArkadaşBul
          </small>

        </div>

      </footer>

    </main>
  );
}