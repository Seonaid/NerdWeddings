/* Nerd Weddings: tiny progressive-enhancement script. The page works without it. */
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Mobile nav ------------------------------------------------------ */
  const toggle = $('.nav-toggle');
  const nav = $('#site-nav');
  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
    });
  }

  /* ---- The d20 --------------------------------------------------------- */
  const die = $('[data-d20]');
  const num = $('[data-d20-num]');
  const caption = $('[data-d20-caption]');
  if (die && num && caption) {
    const lines = {
      1: 'Natural 1. Good thing your officiant is licensed to fix that.',
      20: 'Natural 20! Your ceremony is going to be legendary.',
    };
    let busy = false;
    die.addEventListener('click', () => {
      if (busy) return;
      busy = true;
      const result = 1 + Math.floor(Math.random() * 20);
      caption.classList.remove('is-crit');
      caption.textContent = 'Rolling...';
      die.classList.remove('is-rolling');
      void die.offsetWidth; // restart the CSS animation
      if (!reduceMotion) die.classList.add('is-rolling');

      // Flicker through a few numbers, then land on the result.
      let ticks = reduceMotion ? 0 : 9;
      const step = () => {
        if (ticks-- > 0) {
          num.textContent = String(1 + Math.floor(Math.random() * 20));
          setTimeout(step, 70);
          return;
        }
        num.textContent = String(result);
        caption.textContent = lines[result] || `You rolled a ${result}. Let's talk about your ceremony.`;
        if (result === 20) caption.classList.add('is-crit');
        busy = false;
      };
      step();
    });
  }

  /* ---- "Get Started" on a package pre-selects it in the form ------------ */
  const select = $('#f-package');
  $$('[data-package]').forEach((link) => {
    link.addEventListener('click', () => {
      if (!select) return;
      const wanted = link.getAttribute('data-package');
      const option = Array.from(select.options).find((o) => o.text === wanted);
      if (option) select.value = option.value || option.text;
    });
  });

  /* ---- Contact form: builds a mailto: link (no server needed) ----------- */
  const form = $('#contact-form');
  if (form) {
    const to = form.dataset.email;
    const status = $('[data-status]', form);
    const copyBtn = $('[data-copy]', form);
    const originalNote = status ? status.innerHTML : '';

    const compose = () => {
      const val = (id) => ($(id, form)?.value || '').trim();
      const names = val('#f-names');
      const date = val('#f-date');
      const where = val('#f-where');
      const pkg = val('#f-package');
      const vision = val('#f-vision');

      let prettyDate = '';
      if (date) {
        const d = new Date(date + 'T12:00:00');
        prettyDate = isNaN(d) ? date : d.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
      }
      const subject = `Ceremony enquiry${names ? ' from ' + names : ''}`;
      const lines = [
        'Hi!',
        '',
        `We're ${names || '[our names]'} and we'd love to talk about our ceremony.`,
        '',
        `Wedding date: ${prettyDate || 'Not decided yet'}`,
        `City or venue: ${where || 'Not decided yet'}`,
        `Package we're eyeing: ${pkg || 'Not sure yet'}`,
        '',
        'Our vision:',
        vision,
        '',
        'Thanks!',
        names,
      ];
      return { subject, body: lines.join('\n') };
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const { subject, body } = compose();
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (status) {
        status.classList.add('is-ok');
        status.innerHTML = `Your email app should be opening. If nothing happened, use "Copy message instead" and send it to <a href="mailto:${to}">${to}</a>.`;
      }
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        if (!form.reportValidity()) return;
        const { subject, body } = compose();
        const text = `To: ${to}\nSubject: ${subject}\n\n${body}`;
        let ok = false;
        try {
          await navigator.clipboard.writeText(text);
          ok = true;
        } catch (_) {
          const ta = document.createElement('textarea');
          ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
          document.body.appendChild(ta); ta.select();
          try { ok = document.execCommand('copy'); } catch (__) { ok = false; }
          ta.remove();
        }
        if (status) {
          status.classList.toggle('is-ok', ok);
          status.innerHTML = ok
            ? `Copied! Paste it into an email to <a href="mailto:${to}">${to}</a>.`
            : `Couldn't copy automatically. Please email <a href="mailto:${to}">${to}</a> directly.`;
        }
      });
    }

    form.addEventListener('input', () => {
      if (status && status.classList.contains('is-ok')) { status.classList.remove('is-ok'); status.innerHTML = originalNote; }
    });
  }
})();
