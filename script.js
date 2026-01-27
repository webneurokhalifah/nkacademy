// NAV SCROLL
const nav = document.querySelector('.nav');
const burger = document.querySelector('.burger');
const links = document.querySelector('.links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

burger?.addEventListener('click', () => {
  links.classList.toggle('open');
});

document.querySelectorAll('.links a').forEach(a => {
  a.addEventListener('click', () => links.classList.remove('open'));
});

// REVEAL ON SCROLL
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('active');
  });
}, {threshold: 0.12});
reveals.forEach(el => io.observe(el));

// TESTIMONIAL SLIDER
// Desktop/tablet: show 3 cards as grid (no translate).
// Mobile: enable carousel (1 card per view) with dots + auto slide.
const slides = document.querySelector('#testimonials .slides');
const dotsWrap = document.querySelector('#testimonials .slider-controls');
const dots = Array.from(document.querySelectorAll('#testimonials .dotbtn'));

let idx = 0;
let autoTimer = null;

function go(i){
  if(!slides || dots.length === 0) return;
  idx = (i + dots.length) % dots.length;
  slides.style.transform = `translateX(-${idx * 100}%)`;
  dots.forEach((d,di)=>d.classList.toggle('active', di===idx));
}

function enableMobileSlider(){
  if(!slides || dots.length === 0) return;
  dotsWrap && (dotsWrap.style.display = 'flex');
  // bind once
  if(!slides.dataset.bound){
    dots.forEach((d,i)=>d.addEventListener('click', ()=>go(i)));
    slides.dataset.bound = '1';
  }
  // reset
  idx = 0;
  go(0);
  if(autoTimer) clearInterval(autoTimer);
  autoTimer = setInterval(()=>go(idx+1), 6500);
}

function disableMobileSlider(){
  if(!slides) return;
  if(autoTimer) clearInterval(autoTimer);
  autoTimer = null;
  slides.style.transform = 'none';
  dotsWrap && (dotsWrap.style.display = 'none');
}

// Only run slider on small screens
const mqTesti = window.matchMedia('(max-width: 900px)');
function handleTestiMq(e){
  if(e.matches) enableMobileSlider();
  else disableMobileSlider();
}
handleTestiMq(mqTesti);
mqTesti.addEventListener?.('change', handleTestiMq);

// LIGHTBOX
const lightbox = document.querySelector('.lightbox');
const lightImg = document.querySelector('.lightbox img');
document.querySelectorAll('.gitem img').forEach(img => {
  img.addEventListener('click', () => {
    lightImg.src = img.src;
    lightbox.classList.add('active');
  });
});
document.querySelector('.lightbox .x')?.addEventListener('click', ()=>lightbox.classList.remove('active'));
lightbox?.addEventListener('click', (e)=>{ if(e.target === lightbox) lightbox.classList.remove('active'); });

// GALLERY CAROUSEL: auto-slide bila scroll sampai section Galeri
const gallerySection = document.querySelector('#gallery');
const galleryTrack = document.querySelector('.gallery-track');

let rafId = null;
let autoDir = 1; // 1: kanan, -1: kiri
const AUTO_SPEED = 2.2; // px per frame (smooth) - faster
let restartTimer = null;

function startAutoSlide(){
  if(!galleryTrack) return;
  if(rafId) return;

  const step = ()=>{
    const maxScroll = galleryTrack.scrollWidth - galleryTrack.clientWidth;
    if(maxScroll <= 0){
      rafId = null;
      return;
    }

    galleryTrack.scrollLeft += autoDir * AUTO_SPEED;

    // bounce di hujung
    if(galleryTrack.scrollLeft >= maxScroll - 2) autoDir = -1;
    if(galleryTrack.scrollLeft <= 2) autoDir = 1;

    rafId = requestAnimationFrame(step);
  };

  rafId = requestAnimationFrame(step);
}

function stopAutoSlide(){
  if(rafId){ cancelAnimationFrame(rafId); rafId = null; }
}

function scheduleRestart(){
  if(restartTimer) clearTimeout(restartTimer);
  restartTimer = setTimeout(()=>{
    // restart only if section still visible
    if(gallerySection?.classList.contains('inview')) startAutoSlide();
  }, 1400);
}

// Start/stop bila section galeri masuk viewport
if(gallerySection && galleryTrack){
  const ioGallery = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        gallerySection.classList.add('inview');
        startAutoSlide();
      }else{
        gallerySection.classList.remove('inview');
        stopAutoSlide();
      }
    });
  }, { threshold: 0.25 });
  ioGallery.observe(gallerySection);

  // Bila user interact (scroll/drag), stop sekejap dan sambung balik
  ['wheel','pointerdown','touchstart'].forEach(ev=>{
    galleryTrack.addEventListener(ev, ()=>{
      stopAutoSlide();
      scheduleRestart();
    }, {passive:true});
  });
}

// STATS COUNTUP
function countUp(el, target){
  const dur = 1200;
  const start = performance.now();
  function step(t){
    const p = Math.min(1, (t-start)/dur);
    const val = Math.floor(p*target);
    el.textContent = val.toLocaleString();
    if(p<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const statNums = document.querySelectorAll('[data-count]');
const io2 = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const n = Number(e.target.getAttribute('data-count')||'0');
      countUp(e.target, n);
      io2.unobserve(e.target);
    }
  })
},{threshold:.4});
statNums.forEach(s=>io2.observe(s));

// WhatsApp number (ADMIN) - tanpa "+"
const WA_NUMBER = '60142753958';

// FORM -> WhatsApp Admin
const form = document.querySelector('#regForm');
const success = document.querySelector('.success');

function openWhatsApp(messageText){
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(messageText)}`;
  const win = window.open(url, '_blank', 'noopener');
  if(!win) window.location.href = url;
}

form?.addEventListener('submit', (e)=>{
  e.preventDefault();

  const parentName  = (document.querySelector('#parentName')?.value || '').trim();
  const parentPhone = (document.querySelector('#parentPhone')?.value || '').trim();
  const studentName = (document.querySelector('#studentName')?.value || '').trim();
  const tahap       = (document.querySelector('#tahap')?.value || '').trim();
  const kelas       = (document.querySelector('#kelas')?.value || '').trim();
  const cawangan    = (document.querySelector('#cawangan')?.value || '').trim();
  const subjects    = (document.querySelector('#subjects')?.value || '').trim();
  const note        = (document.querySelector('#note')?.value || '').trim();

  if(!parentName || !parentPhone || !studentName || !tahap || !kelas || !cawangan){
    alert('Sila lengkapkan maklumat wajib.');
    return;
  }

  const msg =
`Assalamualaikum Admin NeuroKhalifah Academy. Saya ingin buat pendaftaran.\n\n`+
`Nama Ibu/Bapa: ${parentName}\n`+
`No. WhatsApp: ${parentPhone}\n`+
`Nama Pelajar: ${studentName}\n`+
`Tahap: ${tahap}\n`+
`Kelas: ${kelas}\n`+
`Cawangan: ${cawangan}\n`+
`Subjek Berminat: ${subjects || '-'}\n`+
`Nota: ${note || '-'}\n\n`+
`(Sumber: Website NKA)`;

  openWhatsApp(msg);

  success && (success.style.display='block');
  success?.scrollIntoView({behavior:'smooth', block:'center'});
  form.reset();
});

// PRICING CTA scroll
document.querySelectorAll('[data-scroll-to]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const id = btn.getAttribute('data-scroll-to');
    document.querySelector(id)?.scrollIntoView({behavior:'smooth'});
  });
});

// WhatsApp floating button
const waLink = document.querySelector('#waLink');
if(waLink){
  const msg = encodeURIComponent('Assalamualaikum. Saya nak tanya tentang pendaftaran NeuroKhalifah Academy.');
  waLink.href = `https://wa.me/${WA_NUMBER}?text=${msg}`;
}
const waFooter=document.querySelector('#waLinkFooter'); if(waFooter) waFooter.href = waLink ? waLink.href : '#';
