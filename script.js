document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const links = document.querySelector(".nav-links");
      const cta = document.querySelector(".nav-cta");
      const open = links.style.display === "flex";
      links.style.display = open ? "none" : "flex";
      cta.style.display = open ? "none" : "inline-block";
      links.style.flexDirection = "column";
      links.style.position = "absolute";
      links.style.top = "72px";
      links.style.left = "0";
      links.style.right = "0";
      links.style.background = "#fff";
      links.style.padding = "20px 24px";
      links.style.borderBottom = "1px solid #e2e8e0";
    });
  }

  const campaignTracker = document.querySelector("#campaign-tracker");
  if (campaignTracker) {
    const raised = Math.max(0, Number(campaignTracker.dataset.raised) || 0);
    const goal = Math.max(0, Number(campaignTracker.dataset.goal) || 0);
    const percent = goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0;
    const formatMoney = (value) => new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
    const progress = campaignTracker.querySelector('[role="progressbar"]');
    const raisedText = document.querySelector("#campaign-raised");
    const goalText = document.querySelector("#campaign-goal");
    const percentText = document.querySelector("#campaign-percent");
    const emptyText = document.querySelector("#campaign-empty");

    if (goal > 0) {
      raisedText.textContent = `${formatMoney(raised)} raised`;
      goalText.textContent = `Goal: ${formatMoney(goal)}`;
      percentText.textContent = `${percent}% funded`;
      progress.setAttribute("aria-valuenow", String(percent));
      document.querySelector("#campaign-progress-bar").style.width = `${percent}%`;
      emptyText.hidden = true;
    }

    const deadline = campaignTracker.dataset.deadline;
    const countdown = document.querySelector("#campaign-countdown");
    if (deadline) {
      const deadlineDate = new Date(`${deadline}T23:59:59`);
      if (!Number.isNaN(deadlineDate.getTime())) {
        const daysLeft = Math.ceil((deadlineDate.getTime() - Date.now()) / 86400000);
        countdown.hidden = false;
        countdown.textContent = daysLeft >= 0 ? `${daysLeft} days left` : "Campaign ended";
      }
    }
  }

  const checkout = document.querySelector("#checkout-form");
  if (!checkout) return;

  const supportEmail = "contributions@globalhope.org";
  const causes = {
    "food-security": "Food Security & Agricultural Development",
    healthcare: "Healthcare & Medical Access",
    "shelter-housing": "Emergency Shelter & Affordable Housing",
    education: "Education & Literacy Programs",
    "clean-water": "Clean Water & Sanitation Access",
    "animal-welfare": "Animal Welfare & Rescue",
    environment: "Environmental Conservation & Climate Tech",
    "disaster-relief": "Disaster Relief & Emergency Response",
    "arts-culture": "Arts, Culture & Heritage Preservation",
    "elderly-support": "Elderly Support & Senior Care",
    "veterans-first-responders": "Veterans & First Responder Assistance",
    "legal-aid": "Legal Aid & Social Justice Advocacy",
    "mental-health": "Mental Health & Suicide Prevention",
    "economic-empowerment": "Economic Empowerment & Micro-Loans",
    "youth-mentorship": "Youth Mentorship & After-School Programs",
    general: "General support — where needed most"
  };
  const params = new URLSearchParams(window.location.search);
  const cause = causes[params.get("project")] ? params.get("project") : "general";
  const amountFromLink = Number(params.get("amount"));
  const amountInput = document.querySelector("#amount");
  const purposeInput = document.querySelector("#purpose");
  if (amountFromLink >= 1 && amountFromLink <= 100000) amountInput.value = amountFromLink.toFixed(2);
  purposeInput.value = cause;

  const amountButtons = [...document.querySelectorAll(".amount-preset")];
  const updateAmountButtons = () => {
    amountButtons.forEach((button) => {
      const isSelected = button.dataset.amount === "other"
        ? ![25, 50, 100].includes(Number(amountInput.value))
        : Number(button.dataset.amount) === Number(amountInput.value);
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    });
  };

  amountButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.amount === "other") {
        amountInput.value = "";
        amountInput.focus();
      } else {
        amountInput.value = Number(button.dataset.amount).toFixed(2);
      }
      updateAmountButtons();
    });
  });
  amountInput.addEventListener("input", updateAmountButtons);
  updateAmountButtons();

  const steps = [...document.querySelectorAll(".checkout-step")];
  const progressItems = [...document.querySelectorAll(".checkout-progress li")];
  const errorOne = document.querySelector("#err-1");
  let selectedMethod = "";
  let selectedCrypto = "";

  const goToStep = (stepNumber) => {
    steps.forEach((step, index) => step.classList.toggle("is-active", index === stepNumber - 1));
    progressItems.forEach((item, index) => {
      item.classList.toggle("is-active", index === stepNumber - 1);
      item.classList.toggle("is-complete", index < stepNumber - 1);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getSummary = () => {
    const currency = document.querySelector("#currency").value;
    const amount = Number(amountInput.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const monthlyNote = document.querySelector("#monthly-intent").checked ? " · monthly giving interest" : "";
    const projectTitle = causes[purposeInput.value] || causes.general;
    return `${currency} ${amount} · ${projectTitle}${monthlyNote}`;
  };

  const updateSummaries = () => {
    document.querySelectorAll(".js-summary").forEach((summary) => {
      summary.textContent = getSummary();
    });
  };

  purposeInput.addEventListener("change", updateSummaries);

  checkout.addEventListener("submit", (event) => {
    event.preventDefault();
    errorOne.textContent = "";
    if (!checkout.reportValidity()) return;
    updateSummaries();
    goToStep(2);
  });

  document.querySelectorAll("[data-method]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedCrypto = "";
      selectedMethod = button.dataset.method;
      document.querySelectorAll("[data-method]").forEach((methodButton) => {
        methodButton.classList.toggle("is-selected", methodButton === button);
        methodButton.setAttribute("aria-pressed", String(methodButton === button));
      });
      renderInstructions();
      updateSummaries();
      goToStep(3);
    });
  });

  const instructions = document.querySelector("#instructions-body");
  const methodNames = { bank: "Bank transfer", paypal: "PayPal", crypto: "Cryptocurrency" };
  const cryptoOptions = {
    bitcoin: {
      name: "Bitcoin",
      ticker: "BTC",
      image: "Image/Bitcoin%20QR%20code.jpg",
      address: "3DfMVLhNfUAQrhRSxy341KVsJnQpuDQx2o"
    },
    ethereum: {
      name: "Ethereum",
      ticker: "ETH",
      image: "Image/ETHERUM%20QR%20CODE.JPG",
      address: "0xe968AE33B8a46f45cec836eFe852Ce7267f47a31"
    },
    litecoin: {
      name: "Litecoin",
      ticker: "LTC",
      image: "Image/Litecoin%20QR%20code.jpg",
      address: "MMuJ4C35oTyEF67xrdEk9CmF9npzUPDMyY"
    }
  };

  const renderInstructions = () => {
    document.querySelector("#instructions-title").textContent = `${methodNames[selectedMethod]} instructions`;
    if (selectedMethod === "crypto") {
      instructions.innerHTML = `
        <div class="checkout-instructions">
          <h3>Select one cryptocurrency</h3>
          <p>Choose the currency you intend to send. Only its wallet address and QR code will be shown.</p>
          <label class="form-label" for="crypto-currency">Cryptocurrency</label>
          <select class="form-select" id="crypto-currency">
            <option value="" selected disabled>Choose Bitcoin, Ethereum, or Litecoin</option>
            <option value="bitcoin">Bitcoin (BTC)</option>
            <option value="ethereum">Ethereum (ETH)</option>
            <option value="litecoin">Litecoin (LTC)</option>
          </select>
          <div id="crypto-wallet-details" class="crypto-wallet-details" aria-live="polite"></div>
          <p id="crypto-selection-error" class="checkout-notice" hidden>Please choose a cryptocurrency to continue.</p>
          <p class="checkout-notice">Verify these wallet addresses belong to GlobalHope before sending. Record your transaction ID for the confirmation step.</p>
        </div>`;

      const currencySelect = instructions.querySelector("#crypto-currency");
      const walletDetails = instructions.querySelector("#crypto-wallet-details");
      currencySelect.addEventListener("change", () => {
        selectedCrypto = currencySelect.value;
        const crypto = cryptoOptions[selectedCrypto];
        walletDetails.innerHTML = `
          <div class="crypto-choice">
            <strong>${crypto.name} (${crypto.ticker})</strong>
            <img class="crypto-qr" src="${crypto.image}" alt="${crypto.name} wallet QR code">
            <label class="form-label" for="crypto-wallet-address">Wallet address</label>
            <div class="checkout-address">
              <input class="form-control" id="crypto-wallet-address" value="${crypto.address}" readonly aria-label="${crypto.name} wallet address">
              <button class="btn checkout-btn checkout-btn-ghost" type="button" data-copy-value="${crypto.address}" aria-label="Copy ${crypto.name} address"><i class="bi bi-copy" aria-hidden="true"></i></button>
            </div>
          </div>`;
        instructions.querySelector("#crypto-selection-error").hidden = true;
        walletDetails.querySelector("[data-copy-value]").addEventListener("click", async (event) => {
          const copyButton = event.currentTarget;
          try {
            await navigator.clipboard.writeText(copyButton.dataset.copyValue);
            copyButton.innerHTML = '<i class="bi bi-check2" aria-hidden="true"></i>';
            copyButton.setAttribute("aria-label", "Address copied");
          } catch {
            const addressInput = walletDetails.querySelector("input");
            addressInput.select();
            document.execCommand("copy");
          }
        });
      });
    } else if (selectedMethod === "bank") {
      instructions.innerHTML = `
        <div class="checkout-instructions">
          <h3>Verified bank transfer details</h3>
          <p>Use these details to make your bank transfer. Enter your transfer reference on the next step and upload its receipt for manual review.</p>
          <dl class="bank-detail-list">
            <div><dt>Bank name</dt><dd>Lead Bank<button class="bank-copy" type="button" data-copy-value="Lead Bank" aria-label="Copy bank name"><i class="bi bi-copy" aria-hidden="true"></i></button></dd></div>
            <div><dt>Account number</dt><dd>216353255646<button class="bank-copy" type="button" data-copy-value="216353255646" aria-label="Copy account number"><i class="bi bi-copy" aria-hidden="true"></i></button></dd></div>
            <div><dt>Routing number</dt><dd>101019644<button class="bank-copy" type="button" data-copy-value="101019644" aria-label="Copy routing number"><i class="bi bi-copy" aria-hidden="true"></i></button></dd></div>
            <div><dt>Bank address</dt><dd>9450 Southwest Gemini Drive, Beaverton, OR, 97008, USA<button class="bank-copy" type="button" data-copy-value="9450 Southwest Gemini Drive, Beaverton, OR, 97008, USA" aria-label="Copy bank address"><i class="bi bi-copy" aria-hidden="true"></i></button></dd></div>
          </dl>
          <p class="checkout-notice">This website does not initiate the bank transfer. Check the transfer details before sending and submit your payment receipt on the next step.</p>
        </div>`;
      instructions.querySelectorAll(".bank-copy").forEach((button) => {
        button.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(button.dataset.copyValue);
            button.innerHTML = '<i class="bi bi-check2" aria-hidden="true"></i>';
            button.setAttribute("aria-label", "Copied");
          } catch {
            button.setAttribute("aria-label", "Copy unavailable; select the bank detail text");
          }
        });
      });
    } else {
      instructions.innerHTML = `<div class="checkout-instructions"><h3>Request the verified PayPal link</h3><p>A PayPal account has not been configured on this page. Email <a href="mailto:${supportEmail}">${supportEmail}</a> to request the official donation link before sending funds.</p></div>`;
    }
  };

  document.querySelector("#paid-btn").addEventListener("click", () => {
    if (selectedMethod === "crypto" && !selectedCrypto) {
      instructions.querySelector("#crypto-selection-error").hidden = false;
      instructions.querySelector("#crypto-currency").focus();
      return;
    }
    document.querySelector("#ref-label").textContent = selectedMethod === "crypto" ? "Transaction ID / hash" : "Payment reference";
    goToStep(4);
  });

  document.querySelectorAll("[data-back]").forEach((button) => {
    button.addEventListener("click", () => goToStep(Number(button.dataset.back)));
  });

  document.querySelector("#step-4").addEventListener("submit", (event) => {
    const form = event.currentTarget;
    const error = document.querySelector("#err-4");
    error.hidden = true;
    if (!form.reportValidity()) {
      event.preventDefault();
      error.textContent = "Add the required payment reference and upload your payment evidence to continue.";
      error.hidden = false;
      return;
    }

    const monthlyInterest = document.querySelector("#monthly-intent").checked;
    const receiptRequested = document.querySelector("#receipt-request").checked;
    const donorConsent = document.querySelector("#donor-public").checked;
    const currency = document.querySelector("#currency").value;
    document.querySelector("#submission-name").value = document.querySelector("#payer-name").value.trim();
    document.querySelector("#submission-email").value = document.querySelector("#payer-email").value.trim();
    document.querySelector("#submission-amount").value = amountInput.value;
    document.querySelector("#submission-currency").value = currency;
    document.querySelector("#submission-project").value = causes[purposeInput.value] || causes.general;
    document.querySelector("#submission-method").value = `${methodNames[selectedMethod]}${selectedCrypto ? ` (${cryptoOptions[selectedCrypto].name} / ${cryptoOptions[selectedCrypto].ticker})` : ""}`;
    document.querySelector("#submission-crypto").value = selectedCrypto ? cryptoOptions[selectedCrypto].name : "Not applicable";
    document.querySelector("#submission-monthly").value = monthlyInterest ? "Interested; contact me about options" : "No";
    document.querySelector("#submission-receipt").value = receiptRequested ? "Yes, after manual review" : "No";
    document.querySelector("#submission-consent").value = donorConsent ? "Yes, first name and amount after verification" : "No, keep anonymous";
  });

  updateSummaries();
});