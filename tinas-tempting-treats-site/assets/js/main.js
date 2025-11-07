/* Tina's Tempting Treats — JS
   - Category filter
   - Contact form: mailto fallback + optional Formspree/EmailJS
*/

// Category filter on treats.html
function initFilters(){
  const buttons = document.querySelectorAll('[data-filter]');
  const cards = document.querySelectorAll('[data-category]');
  if(!buttons.length) return;

  buttons.forEach(btn=>{
    btn.addEventListener('click',()=>{
      buttons.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      cards.forEach(card=>{
        card.style.display = (cat==='all' || card.dataset.category.includes(cat)) ? '' : 'none';
      })
    })
  });
}

// Simple helper to build a mailto link from form fields
function buildMailto(data){
  const subject = encodeURIComponent(`[Order Inquiry] ${data.name} — ${data.category} (${data.qty})`);
  const lines = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || 'N/A'}`,
    `Category: ${data.category}`,
    `Quantity: ${data.qty}`,
    `Pickup/Delivery: ${data.fulfillment}`,
    `Event Date: ${data.eventDate || 'N/A'}`,
    `Details:\n${data.details || '- none -'}`
  ];
  const body = encodeURIComponent(lines.join('\n'));
  return `mailto:tinastemptingtreats@gmail.com?subject=${subject}&body=${body}`;
}

// Optional: If you later set FORMSPREE_ENDPOINT, we'll POST there and fallback to mailto on error.
const FORMSPREE_ENDPOINT = ""; // e.g., "https://formspree.io/f/xxxxxxxx"

async function submitInquiry(e){
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  const data = Object.fromEntries(fd.entries());

  // Very light client validation
  if(!data.name || !data.email){
    alert("Please include your name and email so Tina can reply. 😊");
    return;
  }

  if(FORMSPREE_ENDPOINT){
    try{
      const res = await fetch(FORMSPREE_ENDPOINT,{
        method:'POST',
        headers:{'Accept':'application/json'},
        body: fd
      });
      if(res.ok){
        form.reset();
        alert("Thanks! Your inquiry was sent. Tina will reply soon.");
        return;
      }
      // fallthrough to mailto on non-ok
    }catch(err){
      // fallthrough to mailto on error
    }
  }

  // Default mailto fallback (opens the user's email client pre-filled)
  const link = buildMailto(data);
  window.location.href = link;
}

function attachInquiryHandler(){
  const form = document.querySelector('#order-inquiry-form');
  if(form){ form.addEventListener('submit', submitInquiry); }
}

document.addEventListener('DOMContentLoaded', ()=>{
  initFilters();
  attachInquiryHandler();
});

// Smooth scroll to Order Inquiry section (with slight offset for sticky header)
const orderLinks = document.querySelectorAll('a[href="#inquiry"]');
orderLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector('#inquiry');
    const headerOffset = 90; // adjust if header height changes
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  });
});
