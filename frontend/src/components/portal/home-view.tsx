"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  FileText,
  Layers,
  QrCode,
  ArrowRight,
  Calendar,
  Pin,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApp } from "@/lib/store";
import { t } from "@/lib/i18n";
import { directive } from "@/lib/data";
import { activityGroups } from "@/lib/types";
import { ActivityIcon } from "./activity-icon";
import { HarariGate, HarariArchStrip } from "./harari-gate";

interface NewsItem {
  id: string;
  titleEn: string;
  titleAm: string;
  bodyEn: string;
  bodyAm: string;
  category: string;
  pinned: boolean;
  publishedAt: string | null;
}

export function HomeView() {
  const lang = useApp((s) => s.lang);
  const setView = useApp((s) => s.setView);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setNews((data.news || []).slice(0, 6));
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoadingNews(false));
    return () => {
      cancelled = true;
    };
  }, []);

  // Default slides when no news or fallback
  const defaultSlides = [
    {
      title:
        lang === "en"
          ? "Get Your ICT Sector Professional Competence Certificate"
          : lang === "am"
            ? "የአይሲቲ ዘርፍ የሙያ ብቃት ሰርቲፊኬትዎን ያግኙ"
            : "Waraqaa Ragaa Dandeettii Ogummaa Sektara ICT Argadhu",
      summary: lang === "en" ? "PCC Portal" : lang === "am" ? "የPCC ፖርታል" : "Portaala PCC",
      image: "/hero-bg.png",
      action: () => setView({ name: "categories" }),
    },
    {
      title:
        lang === "en"
          ? "Browse 45 ICT License Categories"
          : lang === "am"
            ? "45 የአይሲቲ የፈቃድ ምድቦችን ይመልከቱ"
            : "Ramaddii Hayyama Sektara ICT 45 Ilaali",
      summary: lang === "en" ? "License categories" : lang === "am" ? "የፈቃድ ምድቦች" : "Ramaddii Hayyamaa",
      image: "/hero-bg-2.jpg",
      action: () => setView({ name: "categories" }),
    },
    {
      title:
        lang === "en"
          ? "Apply Online — Track Your Application Status"
          : lang === "am"
            ? "በመስመር ላይ ያመልክቱ — ማመልከቻዎን ይከታተሉ"
            : "Karaa Intarneetiin Iyyadhu — Haala Iyyannoo Kee Hordofi",
      summary: lang === "en" ? "Applications" : lang === "am" ? "ማመልከቻዎች" : "Iyyannoolee",
      image: "/hero-bg.png",
      action: () => setView({ name: "login" }),
    },
  ];

  const slides =
    news.length > 0
      ? news.map((n, index) => {
          const images = ["/hero-bg.png", "/hero-bg-2.jpg"];
          return {
            title: lang === "en" ? n.titleEn : n.titleAm,
            summary: n.category,
            image: images[index % images.length],
            action: () => setView({ name: "news" }),
          };
        })
      : defaultSlides;

  const slideCount = slides.length;

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 6000);
  }, [slideCount]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const goTo = (idx: number) => {
    setCurrentSlide(idx);
    resetTimer();
  };

  const goPrev = () => goTo((currentSlide - 1 + slideCount) % slideCount);
  const goNext = () => goTo((currentSlide + 1) % slideCount);

  const stats = [
    { label: t("home.stats.categories", lang), value: "45", sub: "standardized ICT categories" },
    { label: t("home.stats.validity", lang), value: lang === "en" ? "1 year" : lang === "am" ? "1 ዓመት" : "waggaa 1", sub: "renewable validity" },
    { label: t("home.stats.region", lang), value: lang === "en" ? "Harari" : lang === "am" ? "ሐረሪ" : "Hararii", sub: "regional jurisdiction" },
    { label: t("home.stats.years", lang), value: "2007 E.C.", sub: "Directive in force" },
  ];

  return (
    <div className="flex flex-col">
      {/* ========================================================
          SPLIT DIVISION HERO (Exact layout requested by user)
          ======================================================== */}
      <section className="split-hero">
        {/* LEFT PANEL */}
        <div className="split-hero__left">
          {/* Brand */}
          <div className="split-hero__brand">
            <img src="/logo.png" alt="PCC Logo" />
            <div className="split-hero__brand-text">
              {lang === "en"
                ? "Harari Regional State of Ethiopia"
                : lang === "am"
                  ? "የሐረሪ ሕዝብ ብሔራዊ ክልላዊ መንግሥት"
                  : "Mootummaa Naannoo Hararii Itoophiyaa"}
              <strong>
                {lang === "en"
                  ? "INNOVATION AND TECHNOLOGY AGENCY"
                  : lang === "am"
                    ? "የኢኖቬሽን እና ቴክኖሎጂ ኤጀንሲ"
                    : "EEJANSIIN INOVIISHINII FI TEKNOLOJII"}
              </strong>
            </div>
          </div>

          {/* Title with serif styling & green emphasis */}
          <h1 className="split-hero__title">
            {lang === "en" ? (
              <>
                ICT SECTOR:<br />
                <span>PROFESSIONAL<br />COMPETENCE</span><br />
                CERTIFICATE
              </>
            ) : lang === "am" ? (
              <>
                የአይሲቲ ዘርፍ:<br />
                <span>የሙያ ብቃት</span><br />
                ሰርቲፊኬት
              </>
            ) : (
              <>
                SEKTARA ICT:<br />
                WARAQAA RAGAA<br />
                <span>DANDEETTII OGUMMAA</span>
              </>
            )}
          </h1>

          {/* Quote Block */}
          <div className="split-hero__quote">
            <div className="split-hero__quote-icon">
              “
            </div>
            <p>{t("home.hero.subtitle", lang)}</p>
            <cite>
              —{" "}
              {lang === "en"
                ? "Innovation and Technology Agency"
                : lang === "am"
                  ? "የኢኖቬሽን እና ቴክኖሎጂ ኤጀንሲ"
                  : "Eejansii Inoviishinii fi Teknolojii"}
            </cite>
          </div>

          {/* CTA with Play button */}
          <button
            className="split-hero__cta"
            onClick={() => setView({ name: "categories" })}
          >
            <div className="split-hero__cta-circle">
              <Play size={20} fill="currentColor" />
            </div>
            <span className="split-hero__cta-label">
              {t("home.hero.cta.browse", lang)}
            </span>
          </button>
        </div>

        {/* RIGHT PANEL — Image / News Slider */}
        <div className="split-hero__right">
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`split-hero__slide ${i === currentSlide ? "split-hero__slide--active" : ""}`}
            >
              <img
                src={slide.image}
                alt=""
                className="split-hero__slide-img"
                aria-hidden
              />
              <div className="split-hero__slide-overlay" />
              <div className="split-hero__slide-content">
                <h2 className="split-hero__slide-title">{slide.title}</h2>
                <div className="split-hero__slide-summary">{slide.summary}</div>
                <button className="split-hero__slide-btn" onClick={slide.action}>
                  {lang === "en" ? "READ MORE" : lang === "am" ? "ተጨማሪ ያንብቡ" : "DUBBISI"}
                </button>
              </div>
            </div>
          ))}

          {/* Arrows */}
          <div className="split-hero__arrows">
            <button className="split-hero__arrow" onClick={goPrev} aria-label="Previous slide">
              <ChevronLeft size={20} />
            </button>
            <button className="split-hero__arrow" onClick={goNext} aria-label="Next slide">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Indicators */}
          <div className="split-hero__indicators">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`split-hero__indicator ${i === currentSlide ? "split-hero__indicator--active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          STATS ROW — official metrics strip (solid, no glass)
          ======================================================== */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="container mx-auto max-w-7xl px-4 py-7">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5 md:divide-x md:divide-slate-200 dark:md:divide-slate-800">
            {stats.map((s, i) => (
              <div key={i} className="md:px-6 md:first:pl-0 md:last:pr-0">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {s.label}
                </div>
                <div className="text-2xl md:text-3xl font-extrabold text-primary tabular-nums tracking-tight mt-1">
                  {s.value}
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500">
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          HOW IT WORKS — numbered service steps
          ======================================================== */}
      <section className="py-16 md:py-20 px-4 bg-slate-50/60 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-2xl mb-10">
            <span className="eyebrow-label">
              {t("home.section.how.title", lang)}
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
              {lang === "en"
                ? "How to get your certificate"
                : lang === "am"
                  ? "ሰርቲፊኬቱን እንዴት ማግኘት ይቻላል"
                  : "Waraqaa ragaa akkamiin argattu"}
            </h2>
            <p className="text-base text-slate-500 dark:text-slate-400 mt-2">
              {t("home.section.how.subtitle", lang)}
            </p>
          </div>

          <ol className="grid md:grid-cols-3 gap-6 md:gap-10">
            {[1, 2, 3].map((n) => (
              <li key={n} className="border-t-2 border-slate-200 dark:border-slate-800 pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold tabular-nums">
                    {n}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {lang === "en" ? "Step" : lang === "am" ? "ደረጃ" : "Tarfii"} {n}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {t(`home.step${n}.title`, lang)}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t(`home.step${n}.body`, lang)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ========================================================
          OFFICIAL PORTAL — directive facts + Harari gate motif
          ======================================================== */}
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <span className="eyebrow-label">
                {lang === "en" ? "Official portal" : lang === "am" ? "ይፋዊ ፖርታል" : "Portaala Mootummaa"}
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                {lang === "en"
                  ? "A public service of the Harari Regional State"
                  : lang === "am"
                    ? "የሐረሪ ሕዝብ ብሔራዊ ክልላዊ መንግሥት ይፋዊ አገልግሎት"
                    : "Tajaajila Mootummaa Naannoo Hararii"}
              </h2>

              <ul className="mt-8 flex flex-col gap-6">
                <li className="flex items-start gap-4">
                  <div className="badge-icon-emerald shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {directive.issuing_authority}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                      {directive.legal_basis} · {t("about.effective", lang)}: {directive.effective_date_en}
                    </p>
                    <button
                      onClick={() => setView({ name: "about" })}
                      className="mt-2 text-xs font-semibold text-primary hover:underline underline-offset-4"
                    >
                      {lang === "en" ? "Read the directive" : lang === "am" ? "መመሪያውን ያንብቡ" : "Qajeelfama dubbisi"}
                    </button>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="badge-icon-blue shrink-0">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {lang === "en" ? "45 fixed license categories" : lang === "am" ? "45 ቋሚ የፈቃድ ምድቦች" : "Ramaddii hayyama dhaabbataa 45"}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                      {lang === "en"
                        ? "Every category sets out its qualification criteria in advance — personnel, facilities, equipment, and documents."
                        : lang === "am"
                          ? "እያንዳንዱ ምድብ የብቃት መስፈርቱን በቅድሚያ ይዘረጋግጣል — ሰራተኛ፣ መገኛ፣ መሣሪያ እና ሰነዶች።"
                          : "Ramaddiin hunda ulaagaa dursaatti qopheeffadheera — hojjettoota, dhaabbata, meeshaa, fi sanadootaa."}
                    </p>
                    <button
                      onClick={() => setView({ name: "categories" })}
                      className="mt-2 text-xs font-semibold text-primary hover:underline underline-offset-4"
                    >
                      {lang === "en" ? "View all categories" : lang === "am" ? "ሁሉንም ምድቦች ይመልከቱ" : "Ramaddii hunda ilaali"}
                    </button>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="badge-icon-amber shrink-0">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {lang === "en" ? "QR-verified certificates" : lang === "am" ? "በQR የተረጋገጡ ሰርቲፊኬቶች" : "Mirkanneessa QR qabu"}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                      {lang === "en"
                        ? "Every issued certificate carries a verification code. Anyone can confirm its status on the public verification page."
                        : lang === "am"
                          ? "እያንዳንዱ የተሰጠ ሰርቲፊኬት የማረጋገጫ ኮድ ይይዛል። ሁሉም በይፋዊ የማረጋገጫ ገጹ ላይ ሁኔታውን ማረጋገጥ ይችላል።"
                          : "Waraqaan ragaa hundaan QR kan qabu yoo ta'u, namni hundinuun mirkaneessa ulfaatii ilaala."}
                    </p>
                    <a
                      href="/verify"
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline underline-offset-4"
                    >
                      {lang === "en" ? "Verify a certificate" : lang === "am" ? "ሰርቲፊኬት ያረጋግጡ" : "Waraqaa ragaa mirkaneessi"}
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Animated Harari gate — quiet civic motif */}
            <div className="pcc-card p-8 sm:p-12 flex items-center justify-center">
              <HarariGate />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          ACTIVITY TYPES (Clean Grid of Categories)
          ======================================================== */}
      <section className="py-16 md:py-20 px-4 bg-slate-50/40 dark:bg-slate-900/10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <span className="eyebrow-label">
                {lang === "en" ? "CATEGORIES" : lang === "am" ? "ምድቦች" : "RAMADDII"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                {t("home.section.groups.title", lang)}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {t("home.section.groups.subtitle", lang)}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setView({ name: "categories" })}
              className="text-xs font-semibold gap-1 self-start sm:self-auto border-slate-200 dark:border-slate-800"
            >
              {lang === "en" ? "View all 45 categories" : lang === "am" ? "ሁሉንም 45 ምድቦች ይመልከቱ" : "Ramaddii 45 hunda ilaali"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {activityGroups.map((g) => (
              <button
                key={g.key}
                onClick={() => setView({ name: "categories" })}
                className="pcc-card p-5 text-left flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="h-9 w-9 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                    <ActivityIcon name={g.icon} className="h-4 w-4" />
                  </div>
                  <div className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug line-clamp-2">
                    {g[`label_${lang}` as keyof typeof g]}
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 font-medium mt-4">
                  {g.codes.length} {lang === "en" ? "categories" : lang === "am" ? "ምድቦች" : "ramaddii"}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          NEWS & ANNOUNCEMENTS
          ======================================================== */}
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <span className="eyebrow-label">
                {lang === "en" ? "UPDATES" : lang === "am" ? "ዝመናዎች" : "HAAROMSA"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                {t("home.section.news.title", lang)}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {t("home.section.news.subtitle", lang)}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setView({ name: "news" })}
              className="text-xs font-semibold gap-1.5 self-start sm:self-auto border-slate-200 dark:border-slate-800"
            >
              <Newspaper className="h-3.5 w-3.5" />
              {lang === "en" ? "View all announcements" : lang === "am" ? "ሁሉንም ዜናዎች ይዩ" : "Hunda ilaali"}
            </Button>
          </div>

          {loadingNews ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-44 rounded-md" />
              ))}
            </div>
          ) : news.length === 0 ? (
            <div className="pcc-card p-10 text-center text-sm text-slate-500">
              {lang === "en"
                ? "No announcements published yet."
                : lang === "am"
                  ? "እስካሁን ዜና አልተወጣም።"
                  : "Hanga ammaatti oduun hin maxxanfamne."}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {news.map((n) => (
                <div key={n.id} className="pcc-card p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      {n.pinned && (
                        <Pin className="h-3.5 w-3.5 text-amber-500" aria-hidden />
                      )}
                      <span className="px-2 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                        {n.category}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug mb-2 line-clamp-2">
                      {lang === "en" ? n.titleEn : lang === "am" ? n.titleAm : (n.titleEn || n.titleAm)}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                      {lang === "en" ? n.bodyEn : lang === "am" ? n.bodyAm : (n.bodyEn || n.bodyAm)}
                    </p>
                  </div>
                  {n.publishedAt && (
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <Calendar className="h-3 w-3" />
                      {new Date(n.publishedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          CLOSING CTA — solid agency banner with Harari arch motif
          ======================================================== */}
      <section className="pt-10 pb-16 md:pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-md bg-[#0F6B4A] dark:bg-[#0B5339] text-white shadow-md">
            {/* hairline gold rule */}
            <div className="h-1 bg-[#C89B3C]" aria-hidden />

            {/* Harari arch row, slowed drift along the bottom edge */}
            <HarariArchStrip className="absolute bottom-0 left-0 right-0 opacity-25 text-white pointer-events-none" />

            <div className="relative z-10 px-6 py-12 sm:px-14 sm:py-14 text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 text-white">
                {lang === "en"
                  ? "Start your certificate application today"
                  : lang === "am"
                    ? "የሰርቲፊኬት ማመልከቻዎን ዛሬ ይጀምሩ"
                    : "Iyyannoo waraqaa ragaa kee har'a jalqabi"}
              </h2>
              <p className="text-white/80 text-sm leading-relaxed mb-8">
                {lang === "en"
                  ? "Browse the 45 standardized license categories, check the qualification requirements, and submit your application online."
                  : lang === "am"
                    ? "45 ደረጃቸውን የጠበቁ የፈቃድ ምድቦችን ይመልከቱ፣ የመስፈርት ዝርዝሮችን ያረጋግጡ፣ እና ማመልከቻዎን በመስመር ላይ ያስገቡ።"
                    : "Ramaddii hayyama 45 ilaalaa, ulaagaalee mirkaneessaa, iyyannoo keessan karaa intarneetiin galchi."}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="lg"
                  onClick={() => setView({ name: "categories" })}
                  className="px-7 h-12 text-sm font-semibold bg-white hover:bg-slate-100 text-primary shadow-none gap-2"
                >
                  {t("home.hero.cta.browse", lang)}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setView({ name: "login" })}
                  className="px-6 h-12 text-sm font-semibold border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  {t("nav.login", lang)}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
