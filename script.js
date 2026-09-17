document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 1;
  const totalSteps = 4;

  const form = document.getElementById('transport-form');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const submitBtn = document.getElementById('submit-btn');
  const progressBar = document.getElementById('progress-bar');
  const stepIndicatorText = document.getElementById('step-indicator-text');
  const stepPercentage = document.getElementById('step-percentage');
  const modal = document.getElementById('confirmation-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');

  const payCardOption = document.getElementById('pay-card-option');
  const payEftOption = document.getElementById('pay-eft-option');

  // Attach radio listeners for payment options
  if (payCardOption && payEftOption) {
    payCardOption.addEventListener('change', () => togglePaymentFields('card'));
    payEftOption.addEventListener('change', () => togglePaymentFields('eft'));
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  // Dynamically enable/disable card requirements on payment mode switch
  function togglePaymentFields(type) {
    const cardFields = document.getElementById('card-fields');
    const eftFields = document.getElementById('eft-fields');
    const cardInputs = cardFields.querySelectorAll('input');

    if (type === 'card') {
      cardFields.classList.remove('hidden');
      eftFields.classList.add('hidden');
      cardInputs.forEach(input => input.required = true);
    } else {
      cardFields.classList.add('hidden');
      eftFields.classList.remove('hidden');
      cardInputs.forEach(input => input.required = false);
    }
  }

  // Navigation Controls
  nextBtn.addEventListener('click', () => {
    if (validateCurrentStep(currentStep)) {
      if (currentStep < totalSteps) {
        currentStep++;
        updateStepView();
      }
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      updateStepView();
    }
  });

  submitBtn.addEventListener('click', () => {
    if (validateCurrentStep(currentStep)) {
      submitForm();
    }
  });

  function updateStepView() {
    document.querySelectorAll('.step-content').forEach((el, index) => {
      el.classList.toggle('active', index + 1 === currentStep);
    });

    prevBtn.classList.toggle('hidden', currentStep === 1);
    nextBtn.classList.toggle('hidden', currentStep === totalSteps);
    submitBtn.classList.toggle('hidden', currentStep !== totalSteps);

    const percentage = Math.round((currentStep / totalSteps) * 100);
    progressBar.style.width = `${percentage}%`;
    stepPercentage.textContent = `${percentage}% Completed`;

    const stepTitles = ["Parent Details", "Child Details", "Schedule & Services", "Payment Option"];
    stepIndicatorText.textContent = `Step ${currentStep} of ${totalSteps}: ${stepTitles[currentStep - 1]}`;

    for (let i = 1; i <= totalSteps; i++) {
      const tab = document.getElementById(`step-tab-${i}`);
      if (i <= currentStep) {
        tab.className = "text-brand-blueDark font-bold flex flex-col sm:flex-row items-center justify-center gap-1";
      } else {
        tab.className = "text-slate-400 flex flex-col sm:flex-row items-center justify-center gap-1";
      }
    }
  }

  function validateCurrentStep(step) {
    const container = document.getElementById(`step-${step}`);
    const inputs = container.querySelectorAll('input[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!input.checkValidity()) {
        input.reportValidity();
        isValid = false;
      }
    });

    return isValid;
  }

  function submitForm() {
    const parentName = document.getElementById('parent-name').value;
    const childName = document.getElementById('child-name').value;
    const schoolName = document.getElementById('school-name').value;
    const phone = document.getElementById('parent-phone').value;

    // Open Modal
    modal.classList.remove('hidden');

    // WhatsApp Share Trigger
    const whatsappBtn = document.getElementById('whatsapp-trigger-btn');
    whatsappBtn.onclick = () => {
      const message = encodeURIComponent(
        `Hello! I have registered my child ${childName} for transport to ${schoolName}. Contact: ${parentName} (${phone}).`
      );
      window.open(`https://wa.me/?text=${message}`, '_blank');
    };
  }

  function closeModal() {
    modal.classList.add('hidden');
    form.reset();
    currentStep = 1;
    updateStepView();
  }
});