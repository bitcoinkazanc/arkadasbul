"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  User,
  Heart,
  Users,
  ShieldCheck,
  ArrowRight,
  LogOut
} from "lucide-react";

import AdSlot from "./components/AdSlot";
import { createClient } from "./lib/supabase/client";

function ListingCard({ item }) {
  const profile = item.profile || {};

  const name = profile.name || "İsimsiz";
  const avatar = profile.avatar_url || item.avatar_url || "";

  return (
    <article className="listing-card">

      <div className="listing-card-header">

        <div className="listing-avatar">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
            />
          ) : (
            <User size={28} />
          )}
        </div>

        <div className="listing-user-info">

          <h3>
            {name}
          </h3>

          <div className="listing-meta">

            {item.age && (
              <span>
                {item.age} yaş
              </span>
            )}

            {item.city && (
              <span>
                <MapPin size={13} />
                {item.city}
              </span>
            )}

          </div>

        </div>

      </div>

      <div className="listing-card-body">

        <h4>
          {item.title || "Arkadaşlık İlanı"}
        </h4>

        <p>
          {item.bio ||
            "Arkadaşlık için yeni insanlarla tanışmak istiyorum."}
        </p>

        {Array.isArray(item.interests) &&
          item.interests.length > 0 && (
            <div className="tags">

              {item.interests
                .slice(0, 5)
                .map((interest) => (
                  <span key={interest}>
                    {interest}
                  </span>
                ))}

            </div>
          )}

      </div>

      <div className="listing-card-footer">

        <span className="listing-gender">
          {item.gender || ""}
        </span>

        <Link
          href={`/ilan/${item.id}`}
          className="profile-button"
        >
          İlanı Gör
          <ArrowRight size={15} />
        </Link>

      </div>

    </article>
  );
}

export default function HomePage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadPage() {
      const supabase = createClient();

      try {
        const {
          data: {
            user: currentUser
          }
        } = await supabase.auth.getUser();

        setUser(currentUser || null);

        const {
          data: listingsData,
          error: listingsError
        } = await supabase
          .from("listings")
          .select("*")
          .order("created_at", {
            ascending: false
          });

        if (listingsError) {
          throw listingsError;
        }

        const listingRows = listingsData || [];

        /*
         * İlanların sahibi profiles tablosunda tutuluyor.
         * Her ilan için user_id üzerinden profil bilgilerini alıyoruz.
         */
        const userIds = [
          ...new Set(
            listingRows
              .map((item) => item.user_id)
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
              "id, name, avatar_url, age, gender, city"
            )
            .in("id", userIds);

          if (profileError) {
            console.error(
              "Profil bilgileri alınamadı:",
              profileError
            );
          } else {
            profiles = profileData || [];
          }
        }

        const profileMap = {};

        profiles.forEach((profile) => {
          profileMap[profile.id] = profile;
        });

        const combinedListings =
          listingRows.map((listing) => ({
            ...listing,
            profile:
              profileMap[listing.user_id] || null
          }));

        setListings(combinedListings);

      } catch (err) {
        console.error(
          "Ana sayfa yükleme hatası:",
          err
        );

        setError(
          "İlanlar yüklenirken bir hata oluştu."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, []);

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    window.location.href = "/";
  }

  return (
    <main>

      <header className="header">

        <div className="container navigation">

          <Link
            href="/"
            className="logo"
          >
            <span className="logo-icon">
              ♡
            </span>

            Arkadaş
            <span>Bul</span>
          </Link>

          <nav className="nav-links">

            <Link href="/">
              İlanlar
            </Link>

            {user ? (
              <>
                <Link href="/profil">
                  Profilim
                </Link>

                <Link href="/ilan-ver">
                  İlan Ver
                </Link>

                <button
                  type="button"
                  className="nav-logout"
                  onClick={handleLogout}
                >
                  <LogOut size={15} />
                  Çıkış
                </button>
              </>
            ) : (
              <>
                <Link href="/giris">
                  Giriş Yap
                </Link>

                <Link
                  href="/kayit"
                  className="nav-button"
                >
                  Kayıt Ol
                </Link>
              </>
            )}

          </nav>

        </div>

      </header>


      <section className="hero">

        <div className="container hero-content">

          <div className="section-label">
            ARKADAŞLIK PLATFORMU
          </div>

          <h1>
            Yeni insanlarla
            <br />
            <span>tanış.</span>
          </h1>

          <p>
            Ortak ilgi alanlarına sahip
            insanları bul, sohbet et ve
            yeni arkadaşlıklar kur.
          </p>

          <div className="hero-actions">

            <Link
              href="#ilanlar"
              className="publish-button"
            >
              İlanları Keşfet
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/ilan-ver"
              className="secondary-button"
            >
              İlan Ver
            </Link>

          </div>

        </div>

      </section>


      <section
        className="search-section"
        id="ilanlar"
      >

        <div className="container">

          <div className="search-box">

            <div className="search-input-wrapper">

              <Search size={19} />

              <input
                type="text"
                placeholder="Şehir, ilgi alanı veya yaş ara..."
              />

            </div>

            <button
              type="button"
              className="search-button"
            >
              Ara
            </button>

          </div>

        </div>

      </section>


      <section className="listings-section">

        <div className="container">

          <div className="section-header">

            <div>

              <div className="section-label">
                SON İLANLAR
              </div>

              <h2>
                Arkadaşını bul
              </h2>

            </div>

            <span className="listing-count">
              {listings.length} ilan
            </span>

          </div>


          {loading && (
            <div className="empty-state">
              <p>
                İlanlar yükleniyor...
              </p>
            </div>
          )}


          {!loading && error && (
            <div className="empty-state">
              <p>
                {error}
              </p>
            </div>
          )}


          {!loading &&
            !error &&
            listings.length === 0 && (
              <div className="empty-state">

                <User size={30} />

                <h3>
                  Henüz ilan yok
                </h3>

                <p>
                  İlk ilanı sen ver.
                </p>

                <Link
                  href="/ilan-ver"
                  className="publish-button"
                >
                  İlan Ver
                </Link>

              </div>
            )}


          {!loading &&
            !error &&
            listings.length > 0 && (

              <div className="listings-grid">

                {listings.map(
                  (item, index) => (
                    <div
                      key={item.id}
                    >

                      <ListingCard
                        item={item}
                      />

                      {(index + 1) % 4 ===
                        0 && (
                        <div
                          style={{
                            marginTop:
                              "20px",
                            marginBottom:
                              "20px"
                          }}
                        >
                          <AdSlot />
                        </div>
                      )}

                    </div>
                  )
                )}

              </div>

            )}

        </div>

      </section>


      <section className="popular-section">

        <div className="container">

          <div className="section-label">
            POPÜLER İLGİ ALANLARI
          </div>

          <div className="popular-tags">

            {[
              "Oyun",
              "Müzik",
              "Kahve",
              "Sinema",
              "Kitap",
              "Gezi",
              "Spor",
              "Teknoloji"
            ].map(
              (item) => (
                <span key={item}>
                  {item}
                </span>
              )
            )}

          </div>

        </div>

      </section>


      <section className="how-section">

        <div className="container">

          <div className="section-header">

            <div>

              <div className="section-label">
                NASIL ÇALIŞIR?
              </div>

              <h2>
                Arkadaş bulmak çok kolay
              </h2>

            </div>

          </div>


          <div className="steps-grid">

            <div className="step-card">

              <div className="step-icon">
                <User size={23} />
              </div>

              <span>
                01
              </span>

              <h3>
                Profilini oluştur
              </h3>

              <p>
                Kendinden bahset ve
                ilgi alanlarını seç.
              </p>

            </div>


            <div className="step-card">

              <div className="step-icon">
                <Search size={23} />
              </div>

              <span>
                02
              </span>

              <h3>
                İlanları keşfet
              </h3>

              <p>
                Sana uygun insanları
                şehir ve ilgi alanına
                göre bul.
              </p>

            </div>


            <div className="step-card">

              <div className="step-icon">
                <Heart size={23} />
              </div>

              <span>
                03
              </span>

              <h3>
                Bağlantı kur
              </h3>

              <p>
                İlgini çeken kişiye
                ulaş ve tanış.
              </p>

            </div>

          </div>

        </div>

      </section>


      <footer className="footer">

        <div className="container footer-content">

          <div>

            <Link
              href="/"
              className="logo"
            >
              <span className="logo-icon">
                ♡
              </span>

              Arkadaş
              <span>Bul</span>
            </Link>

            <p>
              Yeni arkadaşlıkların
              başlangıç noktası.
            </p>

          </div>

          <div className="footer-links">

            <Link href="/">
              Ana Sayfa
            </Link>

            <Link href="/profil">
              Profilim
            </Link>

            <Link href="/ilan-ver">
              İlan Ver
            </Link>

          </div>

        </div>

        <div className="container footer-bottom">

          <span>
            © 2026 ArkadaşBul
          </span>

          <span>
            <ShieldCheck size={14} />
            Güvenli arkadaşlık
          </span>

        </div>

      </footer>

    </main>
  );
}