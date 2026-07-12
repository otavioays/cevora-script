const yearElement = document.querySelector('#year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const form = document.querySelector('#lead-form');
const emailInput = document.querySelector('#email');
const feedback = document.querySelector('#email-feedback');
const submitButton = form?.querySelector('button[type="submit"]');
const successPanel = document.querySelector('#lead-success');
const submittedEmail = document.querySelector('#submitted-email');
const securityNote = document.querySelector('.checkout-card__security');

const setFeedback = (message = '', type = 'error') => {
  if (!feedback) return;

  feedback.textContent = message;
  feedback.dataset.type = type;
  feedback.style.color = type === 'success' ? '#d7a84d' : '#ff666b';
};

const setLoading = (isLoading) => {
  if (!submitButton) return;

  submitButton.disabled = isLoading;
  submitButton.innerHTML = isLoading
    ? '<span>Abrindo sua oferta...</span>'
    : '<span>Receber material gratuito</span><span aria-hidden="true">↗</span>';
};

const showSuccess = (email) => {
  if (!form || !successPanel || !submittedEmail) return;

  submittedEmail.textContent = email;
  form.hidden = true;

  const cardIntroElements = document.querySelectorAll(
    '.checkout-card__emblem, .checkout-card__kicker, #checkout-title, .checkout-card__description'
  );

  cardIntroElements.forEach((element) => {
    element.hidden = true;
  });

  if (securityNote) {
    securityNote.hidden = true;
  }

  try {
    sessionStorage.setItem('cevoraLeadEmail', email);
    sessionStorage.setItem('cevoraLeadConfirmed', 'true');
  } catch (error) {
    console.warn('Cevora: não foi possível salvar os dados da sessão.', error);
  }

  successPanel.hidden = false;

  window.setTimeout(() => {
    window.location.href = 'oto.html';
  }, 650);
};

emailInput?.addEventListener('input', () => {
  emailInput.classList.remove('is-invalid');
  setFeedback();
});

form?.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = emailInput?.value.trim() || 'preview@cevora.local';

  setLoading(true);
  setFeedback('Modo de visualização ativo. Nenhum e-mail será enviado.', 'success');

  window.setTimeout(() => {
    showSuccess(email);
    setLoading(false);
  }, 250);
});
