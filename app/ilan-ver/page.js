"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  MapPin,
  User,
  Heart,
  Check
} from "lucide-react";
import { useState } from "react";

const interests = [
  "Oyun",
  "Müzik",
  "Kahve",
  "Gezi",
  "Sinema",
  "Kitap",
  "Spor",
  "Futbol",
  "Teknoloji",
  "Fotoğraf",
  "Dans",
  "Film"
];

const cities = [
  "Adana",
  "Adıyaman",
  "Afyonkarahisar",
  "Ağrı",
  "Aksaray",
  "Amasya",
  "Ankara",
  "Antalya",
  "Ardahan",
  "Artvin",
  "Aydın",
  "Balıkesir",
  "Bartın",
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

export default function CreateListing() {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  function toggleInterest(interest) {
    setSelectedInterests((current) => {
      if (current.includes(interest)) {
        return current.filter((item) => item !== interest);
      }

      if (current.length >= 5) {
        return current;
      }

      return [...current, interest];
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
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
            YENİ İLAN
          </div>

          <h1>
            Kendini tanıt,
            <br />
            yeni arkadaşlıklar kur.
          </h1>

          <p>
            İlgi alanlarını ve kendini anlat. Sana uygun
            insanlarla bağlantı kurmaya başla.
          </p>
        </div>

        {submitted ? (
          <div className="success-card">
            <div className="success-icon">
              <Check size={30} />
            </div>

            <h2>İlanın hazır!</h2>

            <p>
              İlan oluşturma formun başarıyla gönderildi.
              Gerçek yayınlama ve hesap sistemi bir sonraki
              aşamada bağlanacak.
            </p>

            <Link href="/" className="success-button">
              İlanlara dön
            </Link>
          </div>
        ) : (
          <form
            className="create-form"
            onSubmit={handleSubmit}
          >
            <div className="form-card">
              <div className="form-card-header">
                <div>
                  <h2>Temel bilgiler</h2>

                  <p>
                    Profilinde görünecek bilgileri gir.
                  </p>
                </div>

                <User size={22} />
              </div>

              <div className="photo-upload">
                <div className="photo-placeholder">
                  <Camera size={27} />
                </div>

                <div>
                  <strong>Profil fotoğrafı</strong>

                  <p>
                    Net ve sana ait bir fotoğraf
                    kullanmanı öneriyoruz.
                  </p>

                  <button
                    type="button"
                    className="upload-button"
                  >
                    Fotoğraf seç
                  </button>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Ad</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Adın"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Yaş</label>

                  <input
                    type="number"
                    name="age"
                    placeholder="Yaşın"
                    min="18"
                    max="99"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Cinsiyet</label>

                  <select name="gender" required defaultValue="">
                    <option value="" disabled>
                      Seç
                    </option>

                    <option value="kadın">
                      Kadın
                    </option>

                    <option value="erkek">
                      Erkek
                    </option>

                    <option value="belirtmek-istemiyorum">
                      Belirtmek istemiyorum
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Şehir</label>

                  <div className="input-with-icon">
                    <MapPin size={17} />

                    <select
                      name="city"
                      required
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Şehir seç
                      </option>

                      {cities.map((city) => (
                        <option
                          key={city}
                          value={city}
                        >
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-card">
              <div className="form-card-header">
                <div>
                  <h2>İlanın</h2>

                  <p>
                    Kendini ve nasıl bir arkadaş aradığını
                    anlat.
                  </p>
                </div>

                <Heart size={22} />
              </div>

              <div className="form-group">
                <label>İlan başlığı</label>

                <input
                  type="text"
                  name="title"
                  placeholder="Örn: Yeni arkadaşlar arıyorum"
                  maxLength="80"
                  required
                />
              </div>

              <div className="form-group">
                <label>Bio / Hakkında</label>

                <textarea
                  name="bio"
                  placeholder="Kendinden, hobilerinden ve nasıl bir arkadaşlık aradığından bahset..."
                  rows="7"
                  maxLength="600"
                  required
                />
              </div>

              <div className="form-group">
                <div className="label-row">
                  <label>İlgi alanların</label>

                  <span>
                    {selectedInterests.length}/5
                  </span>
                </div>

                <div className="interest-selection">
                  {interests.map((interest) => {
                    const selected =
                      selectedInterests.includes(
                        interest
                      );

                    return (
                      <button
                        key={interest}
                        type="button"
                        className={
                          selected
                            ? "interest selected"
                            : "interest"
                        }
                        onClick={() =>
                          toggleInterest(interest)
                        }
                      >
                        {selected && (
                          <Check size={13} />
                        )}

                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="form-card">
              <div className="form-card-header">
                <div>
                  <h2>Arkadaş tercihin</h2>

                  <p>
                    Nasıl insanlarla tanışmak istediğini
                    belirt.
                  </p>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Aradığın arkadaş</label>

                  <select
                    name="friendGender"
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      Seç
                    </option>

                    <option value="kadın">
                      Kadın
                    </option>

                    <option value="erkek">
                      Erkek
                    </option>

                    <option value="farketmez">
                      Fark etmez
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Yaş aralığı</label>

                  <select
                    name="ageRange"
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      Seç
                    </option>

                    <option value="18-25">
                      18 - 25
                    </option>

                    <option value="25-35">
                      25 - 35
                    </option>

                    <option value="35-45">
                      35 - 45
                    </option>

                    <option value="45+">
                      45+
                    </option>

                    <option value="farketmez">
                      Fark etmez
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-footer">
              <div className="form-notice">
                <strong>Güvenli paylaşım</strong>

                <span>
                  Telefon, adres veya özel bilgilerini
                  ilanında paylaşma.
                </span>
              </div>

              <button
                type="submit"
                className="publish-button"
              >
                İlanı Yayınla →
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}