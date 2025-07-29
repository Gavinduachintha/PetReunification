# 🐾 Lost Pet Detector via QR Tag

A web-based system that helps reunite lost pets with their owners through a unique QR code attached to the pet's collar. When the QR code is scanned, it opens a mobile-friendly webpage showing the pet's profile and the owner's contact information.

---

## 📌 Features

- 🔐 User registration and secure login
- 🐶 Pet profile creation with details and photo upload
- 🧾 Automatic QR code generation per pet
- 📱 Mobile-optimized public pet profile page
- 🖥️ Owner dashboard to view/edit pets and regenerate QR codes
- 📤 Downloadable QR codes for printing and collar attachment
- 🔒 Secure data storage with authentication
- 📨 Optional: “Report Found” button to notify the owner

---

## 🖼️ Screenshots

> 📍 *Add screenshots here once your frontend is complete.*

---

## 🛠️ Tech Stack

| Layer       | Technology            |
|-------------|------------------------|
| Frontend    | React, TypeScript, QRCode.js |
| Backend     | Supabase |
| Database    | Supabse DB |
| Auth        | Supabase Auth|
| Hosting     | Vercel|

---

## 🧭 User Flow

1. User registers/logs in.
2. User adds one or more pets with profile details.
3. System generates a unique QR code per pet.
4. Owner downloads/prints the QR code and attaches it to the pet's collar.
5. If the pet gets lost, anyone who scans the QR sees a public webpage with the pet's info and owner’s contact.
6. Finder contacts owner; pet is safely returned.

---

## ⚙️ Installation & Setup

> ⚠️ Requires Node.js and npm installed

```bash
# Clone the repository
git clone https://github.com/your-username/lost-pet-detector.git
cd lost-pet-detector

# Install dependencies (for Node.js backend)
npm install

# Create environment file
touch .env
