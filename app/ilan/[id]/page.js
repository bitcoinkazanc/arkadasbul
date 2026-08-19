"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Heart,
  MapPin,
  MessageCircle,
  ShieldCheck
} from "lucide-react";

import { createClient } from "../../lib/supabase/client";

export default function ListingDetail({ params }) {
  const supabase = createClient();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadListing() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("İlan yüklenemedi:", error);
        setError("İlan bulunamadı.");
        setLoading(false);
        return;
      }

      let profile = null;

      if (data.user_id) {
        const { data: profileData, error: profileError } =
          await supabase
            .from("profiles")
            .select("id, name, avatar_url, age, gender, city")
            .eq("id", data.user_id)
            .maybeSingle();

        if (profileError) {
          console.error(
            "Profil bilgisi alınamadı:",
            profileError
          );
        }

        profile = profileData;
      }

      setListing({
        ...data,
        profile
      });

      setLoading(false);
    }

    loadListing();
  }, [params.id, supabase]);

  if (loading) {
    return (
      <main className="detail-page">
        <header className="header">
          <div className="container navigation">
            <Link className="logo" href="/">
              <span className="logo-icon">♡</span>
              Arkadaş<span>Bul</span>
            </Link>

            <Link href="/" className="back-link">
              <ArrowLeft size={17} />
              İlanlara dön
            </Link>
          </div>
        </header>

        <section className="container detail-container">
          <div className="detail-card">
            <p>İlan yükleniyor...</p>
          </div>
        </section>
      </main>
    );
  }

  if (error || !listing) {
    return (
      <main className="detail-page">
        <div className="container not-found">
          <h1>İlan bulunamadı</h1>

          <p>
            Aradığınız arkadaşlık ilanı mevcut değil veya kaldırılmış
            olabilir.
          </p>

          <Link href="/" className="back-button">
            <ArrowLeft size={17} />
            İlanlara dön
          </Link>
        </div>
      </main>
    );
  }

  const profile = listing.profile;

  const name =
    profile?.name ||
    listing.name ||
    "İsimsiz";

  const age =
    listing.age ||
    profile?.age ||
    "";

  const city =
    listing.city ||
    profile?.city ||
    "";

  const avatarUrl =
    listing.avatar_url ||
    profile?.avatar_url ||
    "";

  const avatarLetter =
    name.trim().charAt(0).toUpperCase() || "?";

  const interests = Array.isArray(listing.interests)
    ? listing.interests
    : [];

  return (
    <main className="detail-page">
      <header className="header">
        <div className="container navigation">
          <Link className="logo" href="/">
            <span className="logo-icon">♡</span>
            Arkadaş<span>Bul</span>
          </Link>

          <Link href="/" className="back-link">
            <ArrowLeft size={17} />
            İlanlara dön
          </Link>
        </div>
      </header>

      <section className="container detail-container">
        <div className="detail-ad">
          <span>REKLAM</span>
        </div>

        <div className="detail-card">
          <div className="detail-top">
            <div className="detail-avatar-wrapper">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name}
                  className="detail-avatar"
                />
              ) : (
                <div className="detail-avatar">
                  {avatarLetter}
                </div>
              )}

              <span className="detail-online" />
            </div>

            <div className="detail-user">
              <h1>
                {name}
                {age ? `, ${age}` : ""}
              </h1>

              {city && (
                <div className="detail-location">
                  <MapPin size={16} />
                  {city}
                </div>
              )}

              <span className="detail-online-text">
                ● Aktif
              </span>
            </div>

            <button
              type="button"
              className="detail-favorite"
              aria-label="Favorilere ekle"
            >
              <Heart size={21} />
            </button>
          </div>

          <div className="detail-content">
            <div>
              <h2>Arkadaşlık ilanı</h2>

              <p>
                {listing.bio ||
                  "Bu kullanıcı henüz açıklama eklememiş."}
              </p>
            </div>

            <div className="detail-interests">
              <h2>İlgi alanları</h2>

              {interests.length > 0 ? (
                <div className="tags">
                  {interests.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              ) : (
                <p>
                  Henüz ilgi alanı eklenmemiş.
                </p>
              )}
            </div>
          </div>

          <div className="detail-actions">
            <button
              type="button"
              className="message-button"
            >
              <MessageCircle size={18} />
              Mesaj Gönder
            </button>

            <button
              type="button"
              className="report-button"
            >
              Şikayet Et
            </button>
          </div>

          <div className="safety-notice">
            <ShieldCheck size={20} />

            <div>
              <strong>Güvenli iletişim</strong>

              <p>
                Kişisel bilgilerini paylaşırken dikkatli ol.
                Şüpheli davranışları bize bildirebilirsin.
              </p>
            </div>
          </div>
        </div>

        <div className="detail-ad">
          <span>REKLAM</span>
        </div>
      </section>
    </main>
  );
}