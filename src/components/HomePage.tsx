"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Instagram, MapPin, Pause, Play } from "lucide-react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import SmokeBackground from "./SmokeBackground";

const media = {
  galleryVideo: "/media/video/gallery-atmosphere.mp4",
  menuVideo: "/media/video/coffee-roast-background.mp4",
  menuVideoMobile: "/media/video/coffee-roast-background-mobile.mp4",
  espressoDetailsVideo: "/media/video/espresso-details.mp4",
  brandedLatte: "/media/gallery/branded-latte-crop.webp",
  espressoPour: "/media/gallery/espresso-pour-crop.webp",
  espressoPourMobile: "/media/gallery/espresso-pour-mobile.webp",
  coffeeBeansCup: "/media/gallery/coffee-beans-cup-crop.webp",
  coffeeStory: "/media/gallery/coffee-story-crop.webp",
  coffeeStoryMobile: "/media/gallery/coffee-story-mobile.webp",
  heroPoster: "/media/hero/hero-poster.webp",
  locationTexture: "/media/location/visit-cappuccino-background.jpg",
};

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Gallery", href: "#gallery" },
  { label: "Menu", href: "#menu" },
  { label: "Visit", href: "#visit" },
];

const menuCategories = [
  {
    name: "Espresso",
    items: [
      { name: "Espresso", price: "€2.50" },
      { name: "Double Espresso", price: "€3.00" },
      { name: "Americano", price: "€3.20" },
      { name: "Macchiato", price: "€3.00" },
    ],
  },
  {
    name: "Milk Coffee",
    items: [
      { name: "Cappuccino", price: "€3.80" },
      { name: "Caffè Latte", price: "€4.00" },
      { name: "Flat White", price: "€4.20" },
      { name: "Mocha", price: "€4.50" },
    ],
  },
  {
    name: "Iced Coffee",
    items: [
      { name: "Iced Americano", price: "€3.80" },
      { name: "Iced Latte", price: "€4.50" },
      { name: "Freddo Espresso", price: "€3.80" },
      { name: "Freddo Cappuccino", price: "€4.20" },
    ],
  },
  {
    name: "Signature Drinks",
    items: [
      { name: "Polo Signature Coffee", price: "€5.00", signature: true },
      { name: "Venezia Cream Latte", price: "€5.50", signature: true },
      { name: "Caramel Espresso", price: "€5.20" },
      { name: "Chocolate Coffee", price: "€5.20" },
    ],
  },
  {
    name: "Pastries",
    items: [
      { name: "Croissant", price: "€3.00" },
      { name: "Chocolate Croissant", price: "€3.50" },
      { name: "Muffin", price: "€3.00" },
      { name: "Cake Slice", price: "€4.50" },
    ],
  },
  {
    name: "Light Bites",
    items: [
      { name: "Toast", price: "€4.50" },
      { name: "Sandwich", price: "€5.50" },
      { name: "Italian Panini", price: "€6.50" },
      { name: "Breakfast Plate", price: "€7.50" },
    ],
  },
];

const storyLines = [
  "Caffe Polo Venezia began as a quiet idea: a place where coffee could feel both familiar and cinematic.",
  "Inspired by Italian cafe rituals and the warm rhythm of Limassol, every cup is shaped around pause, aroma, and conversation.",
  "The name carries a sense of travel, craft, and old-world charm, but the experience is made for today.",
  "Here, espresso is not rushed; it is watched, poured, and served with care.",
  "The space is designed for morning regulars, late afternoon meetings, and those small moments that turn into routines.",
  "From the first crema to the last sip, the story is simple: thoughtful coffee, warm atmosphere, and a reason to return.",
  "Caffe Polo Venezia is still growing, but its heart is already clear: every cup should feel personal.",
];

const storySliderImages = [
  { src: media.brandedLatte, alt: "Branded latte cup" },
  { src: media.coffeeStoryMobile, alt: "Fresh cappuccino" },
  { src: media.coffeeStory, alt: "Cappuccino in a cafe setting" },
  { src: media.coffeeBeansCup, alt: "Coffee cup with roasted beans" },
  { src: media.heroPoster, alt: "Coffee atmosphere" },
  { src: media.brandedLatte, alt: "Caffe Polo Venezia latte" },
];

const heroPolaroids = [
  {
    src: media.brandedLatte,
    alt: "Branded latte cup at Caffè Polo Venezia",
  },
  {
    src: media.espressoPourMobile,
    alt: "Espresso pour with crema and steam",
  },
  {
    src: media.coffeeStoryMobile,
    alt: "Cappuccino with a warm cafe setting",
  },
  {
    src: media.coffeeBeansCup,
    alt: "Coffee cup and roasted beans",
  },
];

const polaroidCorners = [
  { className: "polaroid-top-left", rotation: "-7deg" },
  { className: "polaroid-top-right", rotation: "5deg" },
  { className: "polaroid-bottom-left", rotation: "6deg" },
  { className: "polaroid-bottom-right", rotation: "-5deg" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function AmbientVideo({
  src,
  mobileSrc,
  poster,
  className,
  preload = "metadata",
}: {
  src: string;
  mobileSrc?: string;
  poster: string;
  className?: string;
  preload?: "none" | "metadata";
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (video.readyState === 0) video.load();
          video.play().catch(() => undefined);
          setPaused(false);
        } else {
          video.pause();
          setPaused(true);
        }
      },
      { rootMargin: isMobile ? "200px 0px" : "220px 0px", threshold: 0 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`video-shell ${className ?? ""}`}>
      <video ref={videoRef} autoPlay muted loop playsInline preload={preload} poster={poster}>
        {mobileSrc && <source src={mobileSrc} type="video/mp4" media="(max-width: 768px)" />}
        <source src={src} type="video/mp4" />
      </video>
      <span className="video-state" aria-hidden="true">
        {paused ? <Pause /> : <Play />}
      </span>
    </div>
  );
}

function PersistentHeader() {
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    const updateHeader = () => {
      setShowTitle(window.scrollY > window.innerHeight * 0.72);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    window.addEventListener("resize", updateHeader);

    return () => {
      window.removeEventListener("scroll", updateHeader);
      window.removeEventListener("resize", updateHeader);
    };
  }, []);

  return (
    <header
      className={`persistent-cafe-header ${showTitle ? "show-title" : ""}`}
      aria-label="Caffè Polo Venezia header"
    >
      <a
        className="instagram-fixed-link"
        href="https://www.instagram.com/polocafelimassol/"
        target="_blank"
        rel="noreferrer"
        aria-label="Open Caffè Polo Venezia on Instagram"
      >
        <Instagram />
      </a>
      <a className="persistent-cafe-name" href="#home" aria-label="Back to homepage">
        Caffè Polo Venezia
      </a>
    </header>
  );
}

function HeroPolaroids() {
  const [active, setActive] = useState({ image: 0, corner: 0, key: 0 });

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActive((current) => {
        let nextImage = Math.floor(Math.random() * heroPolaroids.length);
        let nextCorner = Math.floor(Math.random() * polaroidCorners.length);

        if (heroPolaroids.length > 1) {
          while (nextImage === current.image) {
            nextImage = Math.floor(Math.random() * heroPolaroids.length);
          }
        }

        if (polaroidCorners.length > 1) {
          while (nextCorner === current.corner) {
            nextCorner = Math.floor(Math.random() * polaroidCorners.length);
          }
        }

        return { image: nextImage, corner: nextCorner, key: current.key + 1 };
      });
    }, 2000);

    return () => window.clearInterval(interval);
  }, []);

  const photo = heroPolaroids[active.image];
  const corner = polaroidCorners[active.corner];

  return (
    <div className="hero-polaroid-layer" aria-hidden="true">
      <AnimatePresence mode="wait">
        <motion.figure
          key={active.key}
          className={`hero-polaroid ${corner.className}`}
          style={{ "--polaroid-rotation": corner.rotation } as CSSProperties & {
            "--polaroid-rotation": string;
          }}
          initial={{ opacity: 0, scale: 0.94, y: 14, rotate: "calc(var(--polaroid-rotation) - 4deg)" }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: "var(--polaroid-rotation)" }}
          exit={{ opacity: 0, scale: 0.97, y: -8, rotate: "calc(var(--polaroid-rotation) + 3deg)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 720px) 36vw, 220px" />
          </div>
        </motion.figure>
      </AnimatePresence>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="hero-section" id="home">
      <SmokeBackground smokeColor="#c9002b" />
      <HeroPolaroids />
      <div className="hero-mystery-overlay" />

      <div className="mystery-hero-content">
        <h1>Caffè Polo Venezia</h1>
        <nav className="hero-choice-actions" aria-label="Homepage choices">
          <a href="#menu" className="hero-choice">
            Menu
          </a>
          <a href="#visit" className="hero-choice">
            Location
          </a>
        </nav>
      </div>
    </section>
  );
}

function GallerySection() {
  const sliderItems = [...storySliderImages, ...storySliderImages];

  return (
    <section className="story-section" id="gallery">
      <motion.div
        className="story-copy"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        variants={fadeUp}
      >
        <p className="eyebrow">Behind The Cup</p>
        <h2>What&apos;s Our Story</h2>
        <div className="story-lines">
          {storyLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </motion.div>

      <div className="story-slider" aria-label="Caffe Polo Venezia image slider">
        <div className="story-slider-track">
          {sliderItems.map((item, index) => (
            <div className="story-slide" key={`${item.src}-${index}`}>
              <Image src={item.src} alt={item.alt} fill sizes="(max-width: 720px) 68vw, 360px" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function MenuSection() {
  return (
    <section className="menu-section section-pad" id="menu">
      <div className="menu-video-bg">
        <AmbientVideo src={media.menuVideo} mobileSrc={media.menuVideoMobile} poster={media.espressoPour} preload="none" />
      </div>
      <div className="espresso-divider" aria-hidden="true" />

      <motion.div
        className="section-heading"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        <p className="eyebrow">Crafted Daily</p>
        <h2>The Menu</h2>
        <p>
          Classic coffee favourites, signature drinks, and simple bites crafted for your daily
          coffee ritual.
        </p>
      </motion.div>

      <motion.div
        className="menu-constellation"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.16 }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        <div className="menu-constellation-title" aria-hidden="true">
          Menu
        </div>
        {menuCategories.map((category, categoryIndex) => (
          <motion.article
            className={`menu-constellation-panel menu-star-${categoryIndex}`}
            key={category.name}
            variants={{
              hidden: { opacity: 0, y: 38, scale: 0.94, filter: "blur(10px)" },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            <div className="menu-constellation-index">
              <span>{String(categoryIndex + 1).padStart(2, "0")}</span>
              <i />
            </div>
            <h3>{category.name}</h3>
            <div className="menu-constellation-items">
              {category.items.map((item) => (
                <div className="menu-constellation-item" key={item.name}>
                  <span>
                    {item.name}
                    {"signature" in item && item.signature ? <em>Signature</em> : null}
                  </span>
                  <strong>{item.price}</strong>
                </div>
              ))}
            </div>
          </motion.article>
        ))}
      </motion.div>

      <motion.p
        className="menu-showcase-note"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ delay: 0.42, duration: 0.45 }}
      >
        Full menu coming soon.
      </motion.p>
    </section>
  );
}
function VisitSection() {
  return (
    <section className="visit-section" id="visit">
      <motion.div
        className="section-heading visit-heading"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        <p className="eyebrow">Limassol, Cyprus</p>
        <h2>Where To Find Us</h2>
      </motion.div>

      <div className="visit-grid section-pad">
        <motion.div
          className="map-panel"
          initial={{ opacity: 0, x: -44 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
        >
          <span className="map-pin" aria-hidden="true">
            <MapPin />
          </span>
          {/* Replace the Limassol city query with the exact street address when it is available. */}
          <iframe
            title="Map showing Limassol, Cyprus"
            src="https://www.google.com/maps?q=Limassol%2C%20Cyprus&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>

        <motion.div
          className="visit-image-panel"
          initial={{ opacity: 0, y: 42 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <Image src={media.locationTexture} alt="" fill sizes="(max-width: 1020px) 100vw, 48vw" />
          <div className="visit-card">
            <p className="eyebrow">Details</p>
            <p>Your next coffee stop is waiting.</p>

            <dl>
              <div>
                <dt>Address</dt>
                <dd>Limassol, Cyprus</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>Coming soon</dd>
              </div>
              <div>
                <dt>Hours</dt>
                <dd>Coming soon</dd>
              </div>
              <div>
                <dt>Instagram</dt>
                <dd>@polocafelimassol</dd>
              </div>
            </dl>

            <div className="visit-actions">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Limassol%2C%20Cyprus"
                target="_blank"
                rel="noreferrer"
                className="primary-action"
              >
                Open in Google Maps
                <MapPin />
              </a>
              <a
                href="https://www.instagram.com/polocafelimassol/"
                target="_blank"
                rel="noreferrer"
                className="secondary-action"
              >
                Follow on Instagram
                <Instagram />
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      <footer className="polo-footer">
        <div>
          <strong>Caffè Polo Venezia</strong>
          <span>Limassol, Cyprus</span>
        </div>
        <nav aria-label="Footer navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <a href="https://www.instagram.com/polocafelimassol/" target="_blank" rel="noreferrer">
            Instagram
          </a>
        </nav>
      </footer>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <PersistentHeader />
      <main>
        <HeroSection />
        <GallerySection />
        <MenuSection />
        <VisitSection />
      </main>
    </>
  );
}

