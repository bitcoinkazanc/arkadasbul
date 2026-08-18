"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  MapPin,
  MessageCircle,
  ShieldCheck
} from "lucide-react";

const listings = [
  {
    id: 1,
    name: "Mert",
    age: 24,
    city: "Mardin",
    avatar: "M",
    online: true,
    tags: ["Oyun", "Müzik", "Kahve"],
    text: "Akşamları beraber oyun oynayabileceğim ve sohbet edebileceğim yeni arkadaşlar arıyorum."
  },
  {
    id: 2,
    name: "Elif",
    age: 22,
    city: "Diyarbakır",
    avatar: "E",
    online: true,
    tags: ["Sinema", "Kitap", "Gezi"],
    text: "Hafta sonları yeni yerler keşfetmek ve güzel sohbetler etmek isteyen arkadaşlar arıyorum."
  },
  {
    id: 3,
    name: "Can",
    age: 27,
    city: "Gaziantep",
    avatar: "C",
    online: false,
    tags: ["Spor", "Futbol", "Kahve"],
    text: "Spor yapmayı ve maç izlemeyi seven kafa dengi insanlarla tanışmak istiyorum."
  },
  {
    id: 4,
    name: "Zeynep",
    age: 25,
    city: "Şanlıurfa",
    avatar: "Z",
    online: true,
    tags: ["Müzik", "Fotoğraf", "Gezi"],
    text: "Yeni insanlarla tanışıp birlikte fotoğraf çekebileceğim arkadaşlar arıyorum."
  },
  {
    id: 5,
    name: "Emre",
    age: 29,
    city: "Mardin",
    avatar: "E",
    online: false,
    tags: ["Teknoloji", "Oyun", "Film"],
    text: "Teknoloji ve oyun konuşmayı seven arkadaşlarla tanışmak istiyorum."
  },
  {
    id: 6,
    name: "Derya",
    age: 23,
    city: "Batman",
    avatar: "D",
    online: true,
    tags: ["Dans", "Müzik", "Kahve"],
    text: "Enerjisi yüksek, birlikte etkinliklere katılabileceğim yeni arkadaşlar arıyorum."
  },
  {
    id: 7,
    name: "Burak",
    age: 26,
    city: "Mardin",
    avatar: "B",
    online: true,
    tags: ["Oyun", "Teknoloji", "Film"],
    text: "Oyun oynamayı ve teknoloji hakkında konuşmayı seven insanlarla tanışmak istiyorum."
  },
  {
    id: 8,
    name: "Sena",
    age: 21,
    city: "Diyarbakır",
    avatar: "S",
    online: false,
    tags: ["Kahve", "Gezi", "Müzik"],
    text: "Kahve içip sohbet edebileceğim ve yeni yerler keşfedebileceğim arkadaşlar arıyorum."
  }
];

export default function ListingDetail({ params }) {
  const id = Number(params.id);

  const listing = listings.find((item) => item.id === id);

  if (!listing) {
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
              <div className="detail-avatar">
                {listing.avatar}
              </div>

              {listing.online && (
                <span className="detail-online" />
              )}
            </div>

            <div className="detail-user">
              <h1>
                {listing.name}, {listing.age}
              </h1>

              <div className="detail-location">
                <MapPin size={16} />
                {listing.city}
              </div>

              <span
                className={
                  listing.online
                    ? "detail-online-text"
                    : "detail-offline-text"
                }
              >
                {listing.online
                  ? "● Şu anda çevrimiçi"
                  : "Çevrimdışı"}
              </span>
            </div>

            <button
              className="detail-favorite"
              aria-label="Favorilere ekle"
            >
              <Heart size={21} />
            </button>
          </div>

          <div className="detail-content">
            <div>
              <h2>Arkadaşlık ilanı</h2>

              <p>{listing.text}</p>
            </div>

            <div className="detail-interests">
              <h2>İlgi alanları</h2>

              <div className="tags">
                {listing.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="detail-actions">
            <button className="message-button">
              <MessageCircle size={18} />
              Mesaj Gönder
            </button>

            <button className="report-button">
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