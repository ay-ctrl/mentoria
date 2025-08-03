# Mentoriá 💬

**Mentoriá**, kullanıcıdan gelen mesajlara Gemini API kullanarak yanıtlar veren, bu yanıtları MongoDB'ye kaydeden ve geçmiş mesajlara göre bağlamı koruyan bir sohbet uygulamasıdır. Mentoriá'nın amacı, kullanıcılara motive edici ve destekleyici yanıtlar veren bir "yapay mentor" sunmaktır.

## 🚀 Özellikler

- Kullanıcı mesajlarını MongoDB'ye kaydeder
- Son 10 mesaj üzerinden bağlamı koruyarak Gemini ile yanıt üretir
- Lottie animasyonlu yükleniyor (typing) efekti
- Kullanıcı mesajları sağa, Mentoriá cevapları sola hizalanır
- Mentoriá cevap verene kadar yeni mesaj gönderilemez
- Sade ve şık arayüz (TailwindCSS kullanılarak)

## 🧠 Kullanılan Teknolojiler

- **Frontend:** HTML, CSS (TailwindCSS), JavaScript, Lottie
- **Backend:** Node.js, Express.js
- **Veritabanı:** MongoDB (Mongoose ile)
- **API:** Google Gemini (via `generativelanguage.googleapis.com`)

## 📁 Proje Yapısı
