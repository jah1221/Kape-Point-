# Agent Instructions: Static Website Project

## 1. Project Overview
- **Project Name:** Kape Point Cafe
- **Category:** Local Business
- **Description:** A cozy neighborhood cafe and workspace celebrating single-origin Philippine coffee beans, handcrafted specialty drinks, and artisanal fresh pastries. Target audience includes coffee enthusiasts, remote workers, students, and local community members seeking high-quality brews in a warm, welcoming space.
- **Primary Goal:** Drive customer foot traffic, showcase signature menu offerings with transparent pricing, provide clear operating hours and location details, and enable easy table reservations and inquiries.

## 2. Technical Stack & Constraints
- **Core Stack:** Plain HTML5, CSS3, Vanilla JavaScript (ES6+).
- **Zero External Dependencies:** Do NOT use external build tools, package managers (npm/yarn), or third-party CSS/JS frameworks (no Tailwind CDN, Bootstrap, React, or jQuery).
- **Font & Icon Constraints:** Modern web-safe system font stacks or Google Fonts via `<link>` tag (e.g., Playfair Display + Inter). Use inline SVGs or local SVG files in `assets/` for icons.
- **Paths:** All internal links, stylesheets, scripts, and asset references must use **relative paths** (e.g., `./assets/logo.svg`, `./style.css`, `./script.js`) to ensure compatibility with GitHub Pages subdirectory hosting.

## 3. Directory Layout
```text
my-website/
├── AGENTS.md
├── index.html
├── style.css
├── script.js
└── assets/
    ├── logo.svg
    ├── hero-cafe.svg
    ├── espresso.svg
    ├── cold-brew.svg
    └── pastry.svg
```

## 4. UI/UX & Design Guidelines
- **Color Palette (Light Theme):**
  - **Primary:** `#3B2219` (Deep Roasted Coffee)
  - **Secondary:** `#6F4E37` (Warm Espresso Bean)
  - **Accent / CTA:** `#D97736` (Warm Caramel Amber)
  - **Accent Hover:** `#B85D22` (Rich Terracotta)
  - **Background:** `#FAF7F2` (Warm Cream)
  - **Surface / Card:** `#FFFFFF` (Crisp White)
  - **Text:** `#231815` (Dark Roast Charcoal)
  - **Muted Text:** `#6C625E` (Warm Slate Gray)
  - **Border:** `#E8E0D5` (Soft Sandstone)
- **Color Palette (Dark Theme / Roast Mode):**
  - **Primary:** `#F7EFE9` (Warm Golden Cream)
  - **Secondary:** `#D4B299` (Soft Cafe Au Lait)
  - **Accent / CTA:** `#E28743` (Rich Caramel Amber)
  - **Background:** `#140E0C` (Dark Roasted Charcoal)
  - **Surface / Card:** `#221815` (Deep Espresso Surface)
  - **Text:** `#F5EFEB` (Warm Off-White)
  - **Muted Text:** `#B4A79F` (Soft Slate)
  - **Border:** `#3A2B24` (Subtle Dark Roast Border)
- **Typography:**
  - **Heading Font:** `'Playfair Display', Georgia, serif`
  - **Body Font:** `'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Layout Approach:** Mobile-first design using CSS Flexbox and CSS Grid.
- **Responsiveness:** Fluid breakpoints (Mobile: < 640px, Tablet: 640px - 1024px, Desktop: > 1024px).

## 5. Required Sections
- **Header / Navbar:** Brand logo (`assets/logo.svg`), brand title ("Kape Point Cafe"), navigation links (Home, Menu, About, Hours & Location, FAQ, Contact), responsive mobile hamburger menu toggle, and dark/light theme switch toggle (`#themeToggle`).
- **Hero Section:** Clear value proposition ("Brewed with Passion, Rooted in Local Tradition"), short descriptive text about ethically sourced Philippine highlands coffee (Sagada, Benguet, Bukidnon), and dual Call-to-Action (CTA) buttons ("View Menu" and "Reserve a Table").
- **Core Content Section (Local Business):**
  - **Products / Menu Showcase:** Tabbed or categorized layout for:
    - *Espresso & Hot Brews* (Single-Origin Barako, Cafe Latte, Spanish Latte, Flat White)
    - *Cold Brew & Signature Drinks* (24h Cold Brew, Salted Caramel Cream Cold Foam, Matcha Espresso Fusion)
    - *Artisanal Pastries & Brunch* (Butter Croissants, Ube Cheese Pandesal, Sourdough Avocado Toast)
    - Each item displays title, description, badge tags (e.g., "Signature", "Bestseller"), and prices in Philippine Peso (₱).
  - **About & Heritage:** Brief story on partnering with local Filipino coffee farmers, small-batch roasting, and providing a community-focused sanctuary with fast Wi-Fi and power outlets.
  - **Store Hours & Location Card:** Operating hours (Mon–Fri: 7:00 AM – 9:00 PM, Sat–Sun: 8:00 AM – 10:00 PM), physical address, interactive Google Maps placeholder link, and amenity badges (Free High-Speed Wi-Fi, Pet Friendly, Outdoor Patio, Power Outlets).
- **Interactive Feature:**
  - **Dark / Light Mode Toggle:** Smooth client-side theme switcher persisting user preference in `localStorage` with OS `prefers-color-scheme` auto-detection.
  - **Interactive FAQ Accordion:** Collapsible questions and answers covering table bookings, Wi-Fi speed, beans purchase, vegan/oat milk options, and parking.
  - **Table Reservation Modal:** Pop-up modal opened by "Reserve a Table" buttons, complete with static client-side validation, date/time picker, party size, and submission confirmation toast.
- **Contact / CTA Section:** Working static contact form UI (Name, Email, Inquiry Type dropdown, Message) alongside direct contact info cards (phone number, email, social links, location).
- **Footer:** Copyright notice, quick navigation links, opening hours summary, and social media icon links.

## 6. Agent Rules of Engagement
- Always generate complete, functional code blocks—avoid placeholders, ellipsis comments (`/* code continues here */`), or truncated snippets.
- Ensure semantic HTML tags are prioritized (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- Keep CSS organized with clear section headers, CSS custom properties (`:root`), and smooth transitions.
- Keep JavaScript modular, event-driven, and scoped without polluting global namespace.
- Make sure to list your actual assets inside **Section 3** so the AI agent knows the exact filenames available to reference in the HTML `<img>` tags.
