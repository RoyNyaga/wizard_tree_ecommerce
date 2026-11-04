# WIZARD TREES // E-COMMERCE & GENETICS PLATFORM

A high-fidelity reproduction and expansion of the **[Wizard Trees](https://wizardtrees.us/)** brand portal, crafted with **Next.js 14 App Router**, **Tailwind CSS**, and **TypeScript**.

Designed with a luxury dark cosmic aesthetic, numbered index navigation, complete strain dossiers, an interactive bag & cart drawer, dispensary locator, lookbook lightbox, and structured data layers ready for Supabase.

---

## ⚡ Quick Start

Open your **PowerShell 7** terminal (which now defaults directly to `D:\`), navigate to this project, and run:

```bash
cd D:\Programming\nextjs\ecomerce
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔮 Key Features Implemented

1. **21+ Age Compliance Verification Modal:**
   - Mandatory adult-use entry gate matching legal cannabis compliance requirements.
   - `localStorage` persistence with "Remember me" option.
2. **Numbered Index Navigation (`01. HOME`, `02. GENETICS`, etc.):**
   - The iconic Wizard Trees signature menu with fullscreen mobile-first drawer.
3. **Genetics & Strains Laboratory (`/strains`):**
   - Complete cultivar profiles: **ZOAP**, **RS-11**, **ZANGRIA**, **STUDIO 54**, **BLACK MAGIC**, **TEA TIME**.
   - Lineage breakdown, collaborative breeder credits (Deep East, Fiya Farmer), and interactive terpene spectrum bars.
4. **Vault & Streetwear Shop (`/shop`):**
   - Filter by Flower Jars, Pre-rolls & Solventless Hash Holes, Breeder Seeds, and Heavyweight French Terry Streetwear.
   - Weight & Size selectors, Quick View modal, and live stock tags.
5. **Interactive Bag & Slide-over Cart Drawer:**
   - Free shipping progress meter.
   - Line-item quantity controls, promo code support (e.g., `WIZARD10`), and a simulated checkout flow with order reservation receipts.
6. **Dispensary & Store Locator (`/locations`):**
   - Multi-state filter (California, Michigan, Florida, Arizona) with search by city/zip and verified cut stock.
7. **Visual Archive & Lookbook (`/gallery`):**
   - Masonry layout with category filtering and fullscreen Lightbox modal zoom.
8. **"Inner Circle" VIP Drops Access:**
   - Instant lead capture for limited seed allocations and streetwear releases.

---

## 🗄️ Architecture & Future Supabase Integration

All data models and queries are decoupled into service layers:
- **`types/index.ts`**: Supabase-ready TypeScript interfaces (`Product`, `Strain`, `StoreLocation`, `GalleryItem`, etc.).
- **`lib/mockData.ts`**: Comprehensive mock catalog.
- **`lib/services.ts`**: Async service methods (`getProducts()`, `getStrains()`, `getStoreLocations()`).

### Connecting Supabase Later
When you're ready to connect a live Supabase database:
1. Install `@supabase/supabase-js`.
2. Add your environment variables in `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
3. Replace the return statements inside `lib/services.ts` with Supabase queries (e.g. `supabase.from('products').select('*')`). **Zero changes to your UI components will be required.**

