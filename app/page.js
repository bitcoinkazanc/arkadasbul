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
LogOut
} from "lucide-react";

import AdSlot from "./components/AdSlot";
import { createClient } from "./lib/supabase/client";

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

function ListingCard({ item }) {
return (
<article className="listing-card">
<div className="listing-header">
<div className="avatar-container">
<div className="avatar">{item.avatar}</div>

{item.online && <span className="online-indicator" />}  
    </div>  

    <div className="user-info">  
      <h3>  
        {item.name}, {item.age}  
      </h3>  

      <div className="location">  
        <MapPin size={14} />  
        {item.city}  
      </div>  
    </div>  

    <button  
      className="favorite-button"  
      aria-label="Favorilere ekle"  
    >  
      <Heart size={19} />  
    </button>  
  </div>  

  <p className="listing-text">  
    {item.text}  
  </p>  

  <div className="tags">  
    {item.tags.map((tag) => (  
      <span key={tag}>{tag}</span>  
    ))}  
  </div>  

  <div className="listing-footer">  
    <span  
      className={  
        item.online  
          ? "online-text"  
          : "offline-text"  
      }  
    >  
      {item.online  
        ? "● Çevrimiçi"  
        : "Çevrimdışı"}  
    </span>  

    <Link  
      href={`/ilan/${item.id}`}  
      className="profile-button"  
    >  
      Profili Gör →  
    </Link>  
  </div>  
</article>

);
}

export default function Home() {
const supabase = createClient();

const [user, setUser] = useState(null);
const [checkingAuth, setCheckingAuth] = useState(true);

useEffect(() => {
let mounted = true;

async function loadUser() {  
  const {  
    data: { user }  
  } = await supabase.auth.getUser();  

  if (mounted) {  
    setUser(user);  
    setCheckingAuth(false);  
  }  
}  

loadUser();  

const {  
  data: { subscription }  
} = supabase.auth.onAuthStateChange(  
  (_event, session) => {  
    setUser(session?.user ?? null);  
    setCheckingAuth(false);  
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
<Link className="logo" href="/">
<span className="logo-icon">♡</span>
Arkadaş<span>Bul</span>
</Link>

<nav>  
        <a href="#ilanlar">İlanlar</a>  
        <a href="#nasil">Nasıl Çalışır?</a>  
      </nav>  

      <div className="header-actions">  
        <Link  
          href="/ilan-ver"  
          className="create-button"  
        >  
          <Plus size={18} />  
          İlan Ver  
        </Link>  

        {checkingAuth ? null : user ? (  
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
        ) : (  
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
        <span>burada başlayabilir.</span>  
      </h1>  

      <p>  
        Ortak ilgi alanlarına sahip insanları keşfet,  
        arkadaşlık ilanlarını incele ve yeni bağlantılar kur.  
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
            <option value="" disabled>  
              Şehir seç  
            </option>  

            <option>Mardin</option>  
            <option>Diyarbakır</option>  
            <option>Gaziantep</option>  
            <option>Şanlıurfa</option>  
            <option>Batman</option>  
          </select>  
        </div>  

        <button className="search-button">  
          İlanları Bul  
        </button>  
      </div>  

      <div className="popular-tags">  
        <span>Popüler:</span>  

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
          Sana uygun insanları keşfet ve yeni  
          bağlantılar kur.  
        </p>  
      </div>  

      <button className="filter-button">  
        <SlidersHorizontal size={17} />  
        Filtrele  
      </button>  
    </div>  

    <div className="listing-grid">  
      {listings.map((item, index) => (  
        <div key={item.id}>  
          <ListingCard item={item} />  

          {(index + 1) % 4 === 0 && (  
            <AdSlot size="medium" />  
          )}  
        </div>  
      ))}  
    </div>  
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
          <span>01</span>  

          <h3>Keşfet</h3>  

          <p>  
            Şehrini ve ilgi alanlarını seçerek  
            sana uygun ilanları bul.  
          </p>  
        </div>  

        <div className="step">  
          <span>02</span>  

          <h3>Tanış</h3>  

          <p>  
            Profilleri incele, ortak noktalarınızı  
            keşfet ve iletişim kur.  
          </p>  
        </div>  

        <div className="step">  
          <span>03</span>  

          <h3>Bağlan</h3>  

          <p>  
            Yeni arkadaşlığını güzel anılara  
            dönüştür.  
          </p>  
        </div>  
      </div>  
    </div>  
  </section>  

  <footer>  
    <div className="container footer">  
      <div className="logo">  
        <span className="logo-icon">♡</span>  
        Arkadaş<span>Bul</span>  
      </div>  

      <p>  
        Yeni arkadaşlıklar, gerçek bağlantılar.  
      </p>  

      <small>  
        © 2026 ArkadaşBul  
      </small>  
    </div>  
  </footer>  
</main>

);
}