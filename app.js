(function () {
  function byId(id) {
    return document.getElementById(id);
  }

  function formatINR(value) {
    if (!Number.isFinite(value)) {
      return "-";
    }
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(value);
  }

  function setText(id, value) {
    var el = byId(id);
    if (el) {
      el.textContent = value;
    }
  }

  function sanitizeText(value) {
    return (value || "").toString().trim();
  }

  function formatCurrency(value) {
    return "₹ " + formatINR(value);
  }

  function formatDateLong(value) {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(value);
  }

  function numberToWordsIndian(value) {
    var ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen"
    ];
    var tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    function underHundred(number) {
      if (number < 20) {
        return ones[number];
      }
      return tens[Math.floor(number / 10)] + (number % 10 ? " " + ones[number % 10] : "");
    }

    function underThousand(number) {
      if (number < 100) {
        return underHundred(number);
      }
      return ones[Math.floor(number / 100)] + " Hundred" + (number % 100 ? " " + underHundred(number % 100) : "");
    }

    var number = Math.floor(Math.abs(value || 0));
    if (number === 0) {
      return "Zero";
    }

    var parts = [];
    var crore = Math.floor(number / 10000000);
    number %= 10000000;
    var lakh = Math.floor(number / 100000);
    number %= 100000;
    var thousand = Math.floor(number / 1000);
    number %= 1000;
    var remainder = number;

    if (crore) {
      parts.push(underHundred(crore) + " Crore");
    }
    if (lakh) {
      parts.push(underHundred(lakh) + " Lakh");
    }
    if (thousand) {
      parts.push(underHundred(thousand) + " Thousand");
    }
    if (remainder) {
      parts.push(underThousand(remainder));
    }

    return parts.join(" ").replace(/\s+/g, " ").trim();
  }

  function bindGeneratorActions(downloadBtnId, printBtnId, getDocumentData) {
    var downloadBtn = byId(downloadBtnId);
    var printBtn = byId(printBtnId);

    if (downloadBtn) {
      downloadBtn.addEventListener("click", function () {
        var data = getDocumentData();
        if (!data || !data.lines || !data.lines.length) {
          return;
        }
        downloadPdfDocument(data.title, data.filename, data.lines);
      });
    }

    if (printBtn) {
      printBtn.addEventListener("click", function () {
        var data = getDocumentData();
        if (!data || !data.previewHtml) {
          return;
        }
        printDocumentPreview(data.title, data.previewHtml);
      });
    }
  }

  window.bindGeneratorActions = bindGeneratorActions;

  function downloadPdfDocument(title, filename, lines) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      window.print();
      return;
    }

    var doc = new window.jspdf.jsPDF({ unit: "pt", format: "a4" });
    var pageHeight = doc.internal.pageSize.getHeight();
    var margin = 44;
    var y = margin;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, margin, y);
    y += 24;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    lines.forEach(function (line) {
      var safeLine = line || " ";
      var wrapped = doc.splitTextToSize(safeLine, 515);
      if (y + wrapped.length * 14 > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(wrapped, margin, y);
      y += wrapped.length * 14;
    });

    doc.save(filename);
  }

  function printDocumentPreview(title, previewHtml) {
    var printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(
      "<!DOCTYPE html><html><head><title>" + title + "</title><style>" +
      "body{font-family:Arial,sans-serif;margin:32px;color:#222;}" +
      ".document-preview{border:1px solid #d5e2d9;border-radius:16px;padding:24px;box-shadow:none;}" +
      ".document-meta-grid,.signature-row{display:grid;gap:12px;grid-template-columns:repeat(2,minmax(0,1fr));}" +
      ".document-meta-item,.salary-grid > div{border:1px solid #d5e2d9;border-radius:12px;padding:10px 12px;background:#f8faf7;}" +
      ".amortization-table{width:100%;border-collapse:collapse;margin-top:12px;}" +
      ".amortization-table th,.amortization-table td{border:1px solid #d5e2d9;padding:8px 10px;text-align:left;}" +
      ".amortization-table th{background:#f0f7f3;}" +
      ".signature-box{padding-top:28px;border-top:1px solid #1b2b22;}" +
      ".preview-note{color:#4d6357;font-size:14px;}" +
      "@media print{body{margin:0;padding:16px;}}" +
      "</style></head><body>" + previewHtml + "</body></html>"
    );
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  function bindActiveNav() {
    var current = window.location.pathname.split("/").pop() || "index.html";
    var onBlogPage = window.location.pathname.indexOf("/blog/") !== -1;
    var links = document.querySelectorAll(".site-nav a");
    links.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      var target = href.split("/").pop();
      var isActive = target === current || (current === "" && target === "index.html");

      if (!isActive && onBlogPage && sanitizeText(link.textContent) === "Blog") {
        isActive = true;
      }

      if (isActive) {
        link.classList.add("active");
        var dropdown = link.closest(".nav-dropdown");
        if (dropdown) {
          var toggle = dropdown.querySelector(".nav-dropdown-toggle");
          if (toggle) {
            toggle.classList.add("active");
          }
        }
      }
    });
  }

  function buildHeaderNavigation() {
    var nav = document.querySelector(".site-nav");
    if (!nav) {
      return;
    }

    var brand = document.querySelector(".brand");
    if (brand) {
      brand.textContent = "CalcVerse";
      brand.setAttribute("aria-label", "CalcVerse Home");
    }

    var onBlogPage = window.location.pathname.indexOf("/blog/") !== -1;
    var prefix = onBlogPage ? "../" : "";

    var primaryLinks = [
      { href: "index.html", label: "Home" },
      { href: "gst-calculator.html", label: "GST Calculator" },
      { href: "rent-receipt-generator.html", label: "Rent Receipt" },
      { href: "salary-slip-generator.html", label: "Salary Slip" },
      { href: "blog/index.html", label: "Blog" }
    ];

    var moreLinks = [
      { href: "gst-invoice-generator.html", label: "GST Invoice" },
      { href: "emi-calculator.html", label: "EMI Calculator" },
      { href: "income-tax-calculator.html", label: "Income Tax Calculator" },
      { href: "sip-calculator.html", label: "SIP Calculator" },
      { href: "home-loan-calculator.html", label: "Home Loan Calculator" },
      { href: "personal-loan-calculator.html", label: "Personal Loan Calculator" },
      { href: "age-calculator.html", label: "Age Calculator" },
      { href: "salary-calculator.html", label: "Salary Calculator" },
      { href: "electricity-bill-calculator.html", label: "Electricity Bill" },
      { href: "fuel-cost-calculator.html", label: "Fuel Cost" }
    ];

    function createTopLink(item) {
      var link = document.createElement("a");
      link.href = prefix + item.href;
      link.textContent = item.label;
      return link;
    }

    function createDropdown(label, items) {
      var wrapper = document.createElement("div");
      wrapper.className = "nav-dropdown";
      if (label === "More") {
        wrapper.classList.add("nav-dropdown--panel");
      }

      var toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "nav-dropdown-toggle";
      toggle.setAttribute("aria-haspopup", "true");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = label;

      var menu = document.createElement("div");
      menu.className = "nav-dropdown-menu";
      items.forEach(function (item) {
        var link = document.createElement("a");
        link.href = prefix + item.href;
        link.textContent = item.label;
        menu.appendChild(link);
      });

      wrapper.appendChild(toggle);
      wrapper.appendChild(menu);
      return wrapper;
    }

    nav.innerHTML = "";
    primaryLinks.forEach(function (item) {
      nav.appendChild(createTopLink(item));
    });
    nav.appendChild(createDropdown("More", moreLinks));
  }

  function setupHeaderDropdowns() {
    var dropdowns = document.querySelectorAll(".nav-dropdown");
    if (!dropdowns.length) {
      return;
    }

    function closeDropdowns() {
      dropdowns.forEach(function (dropdown) {
        dropdown.classList.remove("is-open");
        var toggle = dropdown.querySelector(".nav-dropdown-toggle");
        if (toggle) {
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    dropdowns.forEach(function (dropdown) {
      var toggle = dropdown.querySelector(".nav-dropdown-toggle");
      if (!toggle) {
        return;
      }

      toggle.addEventListener("click", function (event) {
        if (!dropdown.classList.contains("nav-dropdown--panel")) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        var shouldOpen = !dropdown.classList.contains("is-open");
        closeDropdowns();

        if (shouldOpen) {
          dropdown.classList.add("is-open");
          toggle.setAttribute("aria-expanded", "true");
        }
      });
    });

    document.addEventListener("click", function (event) {
      if (!event.target.closest(".nav-dropdown")) {
        closeDropdowns();
      }
    });
  }

  function optimizePageAssets() {
    document.querySelectorAll("img").forEach(function (img) {
      if (!img.getAttribute("loading")) {
        img.setAttribute("loading", "lazy");
      }
      if (!img.getAttribute("decoding")) {
        img.setAttribute("decoding", "async");
      }
    });
  }

  function enhanceFooterLinks() {
    var footerLinks = document.querySelector(".footer-links");
    if (!footerLinks) {
      return;
    }

    var onBlogPage = window.location.pathname.indexOf("/blog/") !== -1;
    var prefix = onBlogPage ? "../" : "";
    var linksToAdd = [
      { href: "privacy-policy.html", label: "Privacy Policy" },
      { href: "terms.html", label: "Terms" },
      { href: "about.html", label: "About" },
      { href: "contact.html", label: "Contact" },
      { href: "disclaimer.html", label: "Disclaimer" }
    ];

    var existing = Array.prototype.slice.call(footerLinks.querySelectorAll("a")).map(function (link) {
      return link.getAttribute("href");
    });

    linksToAdd.forEach(function (item) {
      var href = prefix + item.href;
      if (existing.indexOf(href) !== -1) {
        return;
      }
      var link = document.createElement("a");
      link.href = href;
      link.textContent = item.label;
      footerLinks.appendChild(link);
    });
  }

  function setupGlobalAdContainers() {
    var main = document.querySelector("main");
    if (!main) {
      return;
    }

    var primaryContainer = main.querySelector(".container") || main;

    function findNextAdSibling(startEl, maxSteps) {
      var cursor = startEl;
      var steps = 0;
      while (cursor && steps < maxSteps) {
        cursor = cursor.nextElementSibling;
        if (!cursor) {
          return null;
        }
        if (cursor.classList && cursor.classList.contains("ad-container")) {
          return cursor;
        }
        steps += 1;
      }
      return null;
    }

    function createAd(slot) {
      var ad = document.createElement("div");
      ad.className = "ad-container auto-ad";
      ad.textContent = "Ad Space";
      ad.setAttribute("aria-label", "Advertisement placeholder");
      ad.setAttribute("data-ad-slot", slot);
      return ad;
    }

    function claimOrInsert(slot, existingEl, insertTarget, mode) {
      if (existingEl) {
        existingEl.setAttribute("data-ad-slot", slot);
        existingEl.classList.add("auto-ad");
        return;
      }

      if (!insertTarget || primaryContainer.querySelector('.ad-container[data-ad-slot="' + slot + '"]')) {
        return;
      }

      var ad = createAd(slot);
      if (mode === "after") {
        insertTarget.insertAdjacentElement("afterend", ad);
      } else if (mode === "before") {
        insertTarget.insertAdjacentElement("beforebegin", ad);
      } else {
        insertTarget.appendChild(ad);
      }
    }

    var hero = primaryContainer.querySelector(".hero");
    var titleAd = hero ? findNextAdSibling(hero, 2) : primaryContainer.querySelector('.ad-container[data-ad-slot="below-title"]');
    claimOrInsert("below-title", titleAd, hero || primaryContainer.firstElementChild, "after");

    var resultBoxes = primaryContainer.querySelectorAll(".result-box");
    var resultAnchor = resultBoxes.length ? resultBoxes[resultBoxes.length - 1] : null;
    var resultAd = resultAnchor ? findNextAdSibling(resultAnchor, 2) : null;
    claimOrInsert("after-result", resultAd, resultAnchor, "after");

    var existingAds = Array.prototype.slice.call(primaryContainer.querySelectorAll(".ad-container"));
    var middleExisting = existingAds.length >= 3 ? existingAds[Math.floor(existingAds.length / 2)] : null;
    var sections = primaryContainer.querySelectorAll("section");
    var middleAnchor = sections.length ? sections[Math.floor(sections.length / 2)] : null;
    claimOrInsert("middle-content", middleExisting, middleAnchor || primaryContainer, middleAnchor ? "after" : "append");

    var footer = document.querySelector("footer.site-footer");
    var bottomExisting = existingAds.length ? existingAds[existingAds.length - 1] : null;
    claimOrInsert("bottom-page", bottomExisting, footer || main, footer ? "before" : "append");
  }

  function initGSTCalculator() {
    var amountEl = byId("gstAmount");
    if (!amountEl) {
      return;
    }

    var rateEl = byId("gstRate");
    var modeEls = document.querySelectorAll('input[name="gstMode"]');
    var errorEl = byId("gstError");

    function calculateGST() {
      var amount = parseFloat(amountEl.value);
      var rate = parseFloat(rateEl.value);
      var mode = document.querySelector('input[name="gstMode"]:checked').value;

      if (!Number.isFinite(amount) || amount <= 0) {
        errorEl.textContent = "Please enter a valid amount greater than 0.";
        setText("gstValue", "-");
        setText("gstTotal", "-");
        setText("gstTaxable", "-");
        setText("gstSteps", "Enter values to see GST calculation steps.");
        return;
      }

      errorEl.textContent = "";

      var gstAmount;
      var totalAmount;
      var taxableAmount;

      if (mode === "exclusive") {
        gstAmount = amount * (rate / 100);
        totalAmount = amount + gstAmount;
        taxableAmount = amount;
        setText(
          "gstSteps",
          "Exclusive GST: GST = Taxable Amount × Rate/100, then Total = Taxable + GST."
        );
      } else {
        taxableAmount = amount / (1 + rate / 100);
        gstAmount = amount - taxableAmount;
        totalAmount = amount;
        setText(
          "gstSteps",
          "Inclusive GST: Taxable = Total / (1 + Rate/100), then GST = Total - Taxable."
        );
      }

      setText("gstTaxable", "₹ " + formatINR(taxableAmount));
      setText("gstValue", "₹ " + formatINR(gstAmount));
      setText("gstTotal", "₹ " + formatINR(totalAmount));
    }

    amountEl.addEventListener("input", calculateGST);
    rateEl.addEventListener("change", calculateGST);
    modeEls.forEach(function (el) {
      el.addEventListener("change", calculateGST);
    });

    document.querySelectorAll("[data-gst-rate]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        rateEl.value = btn.getAttribute("data-gst-rate");
        calculateGST();
      });
    });

    calculateGST();
  }

  function initEMICalculator() {
    var principalEl = byId("loanAmount");
    if (!principalEl) {
      return;
    }

    var rateEl = byId("interestRate");
    var tenureEl = byId("tenure");
    var prepayTypeEl = byId("prepaymentType");
    var prepayBehaviorEl = byId("prepaymentBehavior");
    var loanAmountRangeEl = byId("loanAmountRange");
    var interestRateRangeEl = byId("interestRateRange");
    var tenureRangeEl = byId("tenureRange");
    var lumpSumFieldsEl = byId("lumpSumFields");
    var monthlyExtraFieldsEl = byId("monthlyExtraFields");
    var lumpSumAmountEl = byId("lumpSumAmount");
    var lumpSumMonthEl = byId("lumpSumMonth");
    var monthlyExtraAmountEl = byId("extraEMI");
    var lumpSumAmountRangeEl = byId("lumpSumAmountRange");
    var lumpSumMonthRangeEl = byId("lumpSumMonthRange");
    var extraEmiRangeEl = byId("extraEMIRange");
    var errorEl = byId("emiError");

    function formatCurrency(value) {
      return "₹ " + formatINR(Math.round(value));
    }

    function toTenureLabel(months) {
      var safeMonths = Math.max(0, Math.round(months));
      var years = Math.floor(safeMonths / 12);
      var remMonths = safeMonths % 12;
      if (years === 0) {
        return safeMonths + " months";
      }
      if (remMonths === 0) {
        return years + " years";
      }
      return years + " years " + remMonths + " months";
    }

    function showPrepaymentFields() {
      var type = prepayTypeEl.value;
      lumpSumFieldsEl.classList.toggle("is-hidden", type !== "lump");
      monthlyExtraFieldsEl.classList.toggle("is-hidden", type !== "monthly");
    }

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }

    function syncNumberAndRange(numberEl, rangeEl, onChange) {
      if (!numberEl || !rangeEl) {
        return;
      }

      function syncFromNumber() {
        var min = parseFloat(rangeEl.min);
        var max = parseFloat(rangeEl.max);
        var value = parseFloat(numberEl.value);

        if (!Number.isFinite(value)) {
          return;
        }

        value = clamp(value, min, max);
        numberEl.value = value;
        rangeEl.value = value;
      }

      function syncFromRange() {
        numberEl.value = rangeEl.value;
      }

      numberEl.addEventListener("input", function () {
        syncFromNumber();
        onChange();
      });

      rangeEl.addEventListener("input", function () {
        syncFromRange();
        onChange();
      });

      if (numberEl.value === "") {
        numberEl.value = rangeEl.value;
      }
      syncFromNumber();
    }

    function updatePrepaymentBounds() {
      var loanAmount = parseFloat(principalEl.value);
      var tenureYears = parseFloat(tenureEl.value);
      var tenureMonths = Math.max(1, Math.round((Number.isFinite(tenureYears) ? tenureYears : 1) * 12));

      lumpSumMonthEl.max = String(tenureMonths);
      if (lumpSumMonthRangeEl) {
        lumpSumMonthRangeEl.max = String(tenureMonths);
      }

      if (Number.isFinite(parseFloat(lumpSumMonthEl.value))) {
        lumpSumMonthEl.value = clamp(parseFloat(lumpSumMonthEl.value), 1, tenureMonths);
      }
      if (lumpSumMonthRangeEl) {
        lumpSumMonthRangeEl.value = lumpSumMonthEl.value || "1";
      }

      if (Number.isFinite(loanAmount) && loanAmount > 0) {
        var maxLump = Math.max(10000, Math.round(loanAmount));
        lumpSumAmountEl.max = String(maxLump);
        if (lumpSumAmountRangeEl) {
          lumpSumAmountRangeEl.max = String(maxLump);
          lumpSumAmountRangeEl.step = String(Math.max(1000, Math.round(maxLump / 200)));
        }
      }

      if (Number.isFinite(parseFloat(lumpSumAmountEl.value))) {
        var lumpMax = Number.isFinite(parseFloat(lumpSumAmountEl.max)) ? parseFloat(lumpSumAmountEl.max) : 1000000;
        lumpSumAmountEl.value = clamp(parseFloat(lumpSumAmountEl.value), 0, lumpMax);
      }
      if (lumpSumAmountRangeEl) {
        lumpSumAmountRangeEl.value = lumpSumAmountEl.value || "0";
      }
    }

    function resetEmiOutputs() {
      setText("emiResult", "-");
      setText("tenureResult", "-");
      setText("updatedEmi", "-");
      setText("tenureSaved", "-");
      setText("emiReduction", "-");
      setText("interestSaved", "-");
      setText("emiInterest", "-");
      setText("emiTotal", "-");
      setText("baselineEmi", "-");
      setText("baselineTenure", "-");
      setText("baselineInterest", "-");
      setText("compareEmi", "-");
      setText("compareTenure", "-");
      setText("compareInterest", "-");
      setText("benefitSummary", "Add optional prepayment details to see potential benefits.");
      setText("strategyBadge", "Tip: Prepayment is optional");
      setText("strategyHint", "Choose a prepayment plan to see a recommended strategy.");
      setText("amortizationRows", "");
      var amortizationBody = byId("amortizationRows");
      if (amortizationBody) {
        amortizationBody.innerHTML = '<tr><td colspan="5">Enter values to view schedule.</td></tr>';
      }
    }

    function renderAmortization(principal, monthlyRate, totalMonths, emi) {
      var amortizationBody = byId("amortizationRows");
      if (!amortizationBody) {
        return;
      }

      var rows = [];
      var balance = principal;
      var maxMonths = Math.min(12, totalMonths);

      for (var month = 1; month <= maxMonths; month += 1) {
        var interest = balance * monthlyRate;
        var principalPart = emi - interest;

        if (principalPart < 0) {
          principalPart = 0;
        }
        if (principalPart > balance) {
          principalPart = balance;
        }

        balance -= principalPart;

        rows.push(
          "<tr>" +
            "<td>" + month + "</td>" +
            "<td>" + formatCurrency(emi) + "</td>" +
            "<td>" + formatCurrency(principalPart) + "</td>" +
            "<td>" + formatCurrency(interest) + "</td>" +
            "<td>" + formatCurrency(Math.max(0, balance)) + "</td>" +
          "</tr>"
        );
      }

      amortizationBody.innerHTML = rows.join("");
    }

    function baseEmiFromInputs(principal, monthlyRate, months) {
      if (monthlyRate === 0) {
        return principal / months;
      }
      var factor = Math.pow(1 + monthlyRate, months);
      return (principal * monthlyRate * factor) / (factor - 1);
    }

    function simulateReduceTenure(principal, monthlyRate, fixedEmi, prepayType, lumpAmount, lumpMonth, extraMonthly, limit) {
      var balance = principal;
      var paidInterest = 0;
      var monthsTaken = 0;

      while (balance > 0.01 && monthsTaken < limit) {
        monthsTaken += 1;
        var interest = balance * monthlyRate;
        var principalPart = fixedEmi - interest;

        if (principalPart <= 0) {
          return null;
        }

        if (prepayType === "monthly") {
          principalPart += extraMonthly;
        }

        if (prepayType === "lump" && monthsTaken === lumpMonth) {
          principalPart += lumpAmount;
        }

        if (principalPart > balance) {
          principalPart = balance;
        }

        paidInterest += interest;
        balance -= principalPart;
      }

      if (monthsTaken >= limit && balance > 0.01) {
        return null;
      }

      return {
        monthsTaken: monthsTaken,
        paidInterest: paidInterest,
        updatedEmi: fixedEmi
      };
    }

    function simulateFixedTenure(principal, monthlyRate, months, fixedEmi, prepayType, lumpAmount, lumpMonth, extraMonthly) {
      var balance = principal;
      var paidInterest = 0;
      var month;

      for (month = 1; month <= months; month += 1) {
        if (balance <= 0.01) {
          break;
        }

        var interest = balance * monthlyRate;
        var principalPart = fixedEmi - interest;

        if (principalPart <= 0) {
          return null;
        }

        if (prepayType === "monthly") {
          principalPart += extraMonthly;
        }

        if (prepayType === "lump" && month === lumpMonth) {
          principalPart += lumpAmount;
        }

        if (principalPart > balance) {
          principalPart = balance;
        }

        paidInterest += interest;
        balance -= principalPart;
      }

      return {
        balance: balance,
        paidInterest: paidInterest
      };
    }

    function solveUpdatedEmi(principal, monthlyRate, months, prepayType, lumpAmount, lumpMonth, extraMonthly, baseEmi) {
      var lo = 0;
      var hi = baseEmi;
      var i;

      for (i = 0; i < 60; i += 1) {
        var mid = (lo + hi) / 2;
        var trial = simulateFixedTenure(
          principal,
          monthlyRate,
          months,
          mid,
          prepayType,
          lumpAmount,
          lumpMonth,
          extraMonthly
        );

        if (!trial) {
          lo = mid;
          continue;
        }

        if (trial.balance > 0.01) {
          lo = mid;
        } else {
          hi = mid;
        }
      }

      var solvedEmi = hi;
      var finalRun = simulateFixedTenure(
        principal,
        monthlyRate,
        months,
        solvedEmi,
        prepayType,
        lumpAmount,
        lumpMonth,
        extraMonthly
      );

      if (!finalRun || finalRun.balance > 1) {
        return null;
      }

      return {
        updatedEmi: solvedEmi,
        paidInterest: finalRun.paidInterest,
        monthsTaken: months
      };
    }

    function buildPlanByBehavior(behavior, principal, monthlyRate, totalMonths, prepaymentType, safeLump, lumpSumMonth, safeExtra, emi, limit) {
      if (behavior === "reduce-emi" && prepaymentType !== "none") {
        return solveUpdatedEmi(
          principal,
          monthlyRate,
          totalMonths,
          prepaymentType,
          safeLump,
          lumpSumMonth,
          safeExtra,
          emi
        );
      }

      return simulateReduceTenure(
        principal,
        monthlyRate,
        emi,
        prepaymentType,
        safeLump,
        lumpSumMonth,
        safeExtra,
        limit
      );
    }

    function calculateEMIWithPrepayment() {
      var loanAmount = parseFloat(principalEl.value);
      var annualRate = parseFloat(rateEl.value);
      var tenureYears = parseFloat(tenureEl.value);
      var prepaymentType = prepayTypeEl.value;
      var prepaymentBehavior = prepayBehaviorEl.value;
      var lumpSumAmount = parseFloat(lumpSumAmountEl.value);
      var lumpSumMonth = parseInt(lumpSumMonthEl.value, 10);
      var extraEMI = parseFloat(monthlyExtraAmountEl.value);

      if (!Number.isFinite(loanAmount) || loanAmount <= 0 || !Number.isFinite(annualRate) || annualRate < 0 || !Number.isFinite(tenureYears) || tenureYears <= 0) {
        errorEl.textContent = "Enter valid loan amount, annual interest, and tenure in years.";
        resetEmiOutputs();
        setText("emiSteps", "Provide valid values to compute EMI with prepayment.");
        return;
      }

      if (prepaymentType === "lump") {
        if (!Number.isFinite(lumpSumAmount) || lumpSumAmount <= 0) {
          errorEl.textContent = "Enter a valid lump sum amount greater than 0.";
          resetEmiOutputs();
          return;
        }
        if (!Number.isInteger(lumpSumMonth) || lumpSumMonth <= 0) {
          errorEl.textContent = "Enter a valid lump sum month number.";
          resetEmiOutputs();
          return;
        }
      }

      if (prepaymentType === "monthly") {
        if (!Number.isFinite(extraEMI) || extraEMI <= 0) {
          errorEl.textContent = "Enter a valid monthly extra EMI amount greater than 0.";
          resetEmiOutputs();
          return;
        }
      }

      errorEl.textContent = "";

      var monthlyRate = annualRate / 12 / 100;
      var totalMonths = Math.round(tenureYears * 12);
      if (totalMonths <= 0) {
        errorEl.textContent = "Tenure must result in at least 1 month.";
        resetEmiOutputs();
        return;
      }

      if (prepaymentType === "lump" && lumpSumMonth > totalMonths) {
        errorEl.textContent = "Lump sum month must be within total tenure.";
        resetEmiOutputs();
        return;
      }

      var emi = baseEmiFromInputs(loanAmount, monthlyRate, totalMonths);

      var baseInterest = emi * totalMonths - loanAmount;
      var limit = 2400;
      var safeExtra = Number.isFinite(extraEMI) && extraEMI > 0 ? extraEMI : 0;
      var safeLump = Number.isFinite(lumpSumAmount) && lumpSumAmount > 0 ? lumpSumAmount : 0;

      var plan = buildPlanByBehavior(
        prepaymentBehavior,
        loanAmount,
        monthlyRate,
        totalMonths,
        prepaymentType,
        safeLump,
        lumpSumMonth,
        safeExtra,
        emi,
        limit
      );

      if (!plan) {
        errorEl.textContent = "Calculation stopped due to input constraints. Please review inputs.";
        resetEmiOutputs();
        return;
      }

      var savedInterest = Math.max(0, baseInterest - plan.paidInterest);
      var monthsSaved = Math.max(0, totalMonths - plan.monthsTaken);
      var emiReduction = Math.max(0, emi - plan.updatedEmi);

      renderAmortization(loanAmount, monthlyRate, totalMonths, emi);

      setText("emiResult", formatCurrency(emi));
      setText("tenureResult", toTenureLabel(plan.monthsTaken));
      setText("updatedEmi", formatCurrency(plan.updatedEmi));
      setText("tenureSaved", monthsSaved > 0 ? toTenureLabel(monthsSaved) : "No change");
      setText("emiReduction", emiReduction > 0 ? formatCurrency(emiReduction) : "No change");
      setText("interestSaved", formatCurrency(savedInterest));
      setText("emiInterest", formatCurrency(baseInterest));
      setText("emiTotal", formatCurrency(loanAmount + baseInterest));
      setText("baselineEmi", formatCurrency(emi));
      setText("baselineTenure", toTenureLabel(totalMonths));
      setText("baselineInterest", formatCurrency(baseInterest));
      setText("compareEmi", formatCurrency(plan.updatedEmi));
      setText("compareTenure", toTenureLabel(plan.monthsTaken));
      setText("compareInterest", formatCurrency(plan.paidInterest));

      var behaviorLabel = prepaymentBehavior === "reduce-emi"
        ? "keep tenure constant, recalculate EMI"
        : "keep EMI constant, reduce tenure";

      if (prepaymentType === "none") {
        setText("strategyBadge", "Tip: Prepayment is optional");
        setText("strategyHint", "Choose Monthly Extra or Lump Sum to see which strategy may benefit you more.");
      } else {
        var otherBehavior = prepaymentBehavior === "reduce-emi" ? "reduce-tenure" : "reduce-emi";
        var otherPlan = buildPlanByBehavior(
          otherBehavior,
          loanAmount,
          monthlyRate,
          totalMonths,
          prepaymentType,
          safeLump,
          lumpSumMonth,
          safeExtra,
          emi,
          limit
        );

        var selectedSaved = savedInterest;
        var selectedMonthsSaved = monthsSaved;
        var selectedEmiDrop = emiReduction;

        var recommendedBehavior = prepaymentBehavior;
        var recommendedSaved = selectedSaved;
        var recommendedMonthsSaved = selectedMonthsSaved;
        var recommendedEmiDrop = selectedEmiDrop;

        if (otherPlan) {
          var otherSaved = Math.max(0, baseInterest - otherPlan.paidInterest);
          var otherMonthsSaved = Math.max(0, totalMonths - otherPlan.monthsTaken);
          var otherEmiDrop = Math.max(0, emi - otherPlan.updatedEmi);

          if (otherSaved > selectedSaved * 1.02 + 1) {
            recommendedBehavior = otherBehavior;
            recommendedSaved = otherSaved;
            recommendedMonthsSaved = otherMonthsSaved;
            recommendedEmiDrop = otherEmiDrop;
          }
        }

        if (recommendedBehavior === "reduce-tenure") {
          setText("strategyBadge", "Recommended: Close Loan Earlier");
          setText(
            "strategyHint",
            "Best for maximum savings: around " + formatCurrency(recommendedSaved) +
              " interest saved and about " +
              (recommendedMonthsSaved > 0 ? toTenureLabel(recommendedMonthsSaved) + " faster closure." : "similar closure time.")
          );
        } else {
          setText("strategyBadge", "Recommended: Lower Monthly EMI");
          setText(
            "strategyHint",
            "Best for cash flow: around " + formatCurrency(recommendedEmiDrop) +
              " lower EMI each month with about " + formatCurrency(recommendedSaved) + " interest savings."
          );
        }
      }

      setText(
        "emiSteps",
        "Calculated with monthly rate " + monthlyRate.toFixed(6) + ", baseline tenure " +
          totalMonths + " months, prepayment mode: " + prepaymentType +
          ", behavior: " + behaviorLabel + "."
      );

      if (prepaymentType === "none") {
        setText("benefitSummary", "You selected normal EMI with no prepayment. Add optional prepayment to compare savings.");
      } else if (prepaymentBehavior === "reduce-tenure") {
        setText(
          "benefitSummary",
          "With prepayment, you can close the loan about " +
            (monthsSaved > 0 ? toTenureLabel(monthsSaved) + " earlier" : "at similar time") +
            " and save around " + formatCurrency(savedInterest) + " in interest."
        );
      } else {
        setText(
          "benefitSummary",
          "With prepayment, your EMI can reduce by about " + formatCurrency(emiReduction) +
            " per month while keeping tenure same, and you may save around " +
            formatCurrency(savedInterest) + " in interest."
        );
      }
    }

    prepayTypeEl.addEventListener("change", function () {
      showPrepaymentFields();
      calculateEMIWithPrepayment();
    });
    prepayBehaviorEl.addEventListener("change", calculateEMIWithPrepayment);

    syncNumberAndRange(principalEl, loanAmountRangeEl, function () {
      updatePrepaymentBounds();
      calculateEMIWithPrepayment();
    });
    syncNumberAndRange(rateEl, interestRateRangeEl, calculateEMIWithPrepayment);
    syncNumberAndRange(tenureEl, tenureRangeEl, function () {
      updatePrepaymentBounds();
      calculateEMIWithPrepayment();
    });
    syncNumberAndRange(lumpSumAmountEl, lumpSumAmountRangeEl, calculateEMIWithPrepayment);
    syncNumberAndRange(lumpSumMonthEl, lumpSumMonthRangeEl, calculateEMIWithPrepayment);
    syncNumberAndRange(monthlyExtraAmountEl, extraEmiRangeEl, calculateEMIWithPrepayment);

    document.querySelectorAll("[data-tenure-months]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var months = parseInt(btn.getAttribute("data-tenure-months"), 10);
        if (Number.isInteger(months) && months > 0) {
          tenureEl.value = Math.round((months / 12) * 100) / 100;
          if (tenureRangeEl) {
            tenureRangeEl.value = clamp(parseFloat(tenureEl.value), parseFloat(tenureRangeEl.min), parseFloat(tenureRangeEl.max));
          }
          updatePrepaymentBounds();
          calculateEMIWithPrepayment();
        }
      });
    });

    showPrepaymentFields();
    updatePrepaymentBounds();
    calculateEMIWithPrepayment();
  }

  function initPercentageCalculator() {
    var xEl = byId("percentX");
    if (!xEl) {
      return;
    }

    var yEl = byId("percentY");
    var oldValEl = byId("oldValue");
    var newValEl = byId("newValue");

    function calculateWhatIsPercent() {
      var x = parseFloat(xEl.value);
      var y = parseFloat(yEl.value);

      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        setText("percentResult", "-");
        return;
      }

      var result = (x / 100) * y;
      setText("percentResult", formatINR(result));
    }

    function calculateChange() {
      var oldVal = parseFloat(oldValEl.value);
      var newVal = parseFloat(newValEl.value);

      if (!Number.isFinite(oldVal) || !Number.isFinite(newVal) || oldVal === 0) {
        setText("changeResult", "-");
        setText("changeType", "-");
        return;
      }

      var diff = newVal - oldVal;
      var pct = (diff / oldVal) * 100;
      var type = pct >= 0 ? "Increase" : "Decrease";

      setText("changeType", type);
      setText("changeResult", Math.abs(pct).toFixed(2) + "%");
    }

    [xEl, yEl].forEach(function (el) {
      el.addEventListener("input", calculateWhatIsPercent);
    });

    [oldValEl, newValEl].forEach(function (el) {
      el.addEventListener("input", calculateChange);
    });

    calculateWhatIsPercent();
    calculateChange();
  }

  function initAgeCalculator() {
    var dobEl = byId("dob");
    if (!dobEl) {
      return;
    }

    var asOfEl = byId("asOfDate");
    var buttonEl = byId("calculateAgeBtn");
    var resultEl = byId("ageResult");
    var extraEl = byId("ageExtra");
    var errorEl = byId("ageError");

    function formatDateInput(dateObj) {
      var y = dateObj.getFullYear();
      var m = String(dateObj.getMonth() + 1).padStart(2, "0");
      var d = String(dateObj.getDate()).padStart(2, "0");
      return y + "-" + m + "-" + d;
    }

    function calculateAge() {
      var dobValue = dobEl.value;
      var asOfValue = asOfEl.value;
      var today = new Date();
      var todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      if (!dobValue) {
        errorEl.textContent = "Please select your date of birth.";
        resultEl.textContent = "Your Age: -";
        extraEl.textContent = "Total months: - | Total days: -";
        return;
      }

      var dobDate = new Date(dobValue + "T00:00:00");
      var asOfDate = asOfValue ? new Date(asOfValue + "T00:00:00") : todayOnly;

      if (dobDate > todayOnly) {
        errorEl.textContent = "Date of birth cannot be in the future.";
        resultEl.textContent = "Your Age: -";
        extraEl.textContent = "Total months: - | Total days: -";
        return;
      }

      if (asOfDate > todayOnly) {
        errorEl.textContent = "As-of date cannot be in the future.";
        resultEl.textContent = "Your Age: -";
        extraEl.textContent = "Total months: - | Total days: -";
        return;
      }

      if (asOfDate < dobDate) {
        errorEl.textContent = "As-of date must be after date of birth.";
        resultEl.textContent = "Your Age: -";
        extraEl.textContent = "Total months: - | Total days: -";
        return;
      }

      errorEl.textContent = "";

      var years = asOfDate.getFullYear() - dobDate.getFullYear();
      var months = asOfDate.getMonth() - dobDate.getMonth();
      var days = asOfDate.getDate() - dobDate.getDate();

      if (days < 0) {
        var prevMonthLastDay = new Date(asOfDate.getFullYear(), asOfDate.getMonth(), 0).getDate();
        days += prevMonthLastDay;
        months -= 1;
      }

      if (months < 0) {
        months += 12;
        years -= 1;
      }

      var totalMonths = years * 12 + months;
      var msPerDay = 24 * 60 * 60 * 1000;
      var totalDays = Math.floor((asOfDate - dobDate) / msPerDay);

      resultEl.textContent = "Your Age: " + years + " years, " + months + " months, " + days + " days";
      extraEl.textContent = "Total months: " + totalMonths + " | Total days: " + totalDays;
    }

    asOfEl.value = formatDateInput(new Date());
    dobEl.max = formatDateInput(new Date());
    asOfEl.max = formatDateInput(new Date());

    buttonEl.addEventListener("click", calculateAge);
  }

  // Copy to Clipboard Handler
  function getResultTextByButtonId(buttonId) {
    var textToCopy = "";

    if (buttonId === "copyGstResultBtn") {
      var taxable = byId("gstTaxable").textContent;
      var gst = byId("gstValue").textContent;
      var total = byId("gstTotal").textContent;
      textToCopy = "GST Calculation Results:\nTaxable Amount: " + taxable + "\nGST Amount: " + gst + "\nTotal Amount: " + total;
    } else if (buttonId === "copyEmiResultBtn") {
      var emi = byId("emiResult").textContent;
      var interest = byId("emiInterest").textContent;
      var payment = byId("emiTotal").textContent;
      textToCopy = "EMI Calculation Results:\nMonthly EMI: " + emi + "\nTotal Interest: " + interest + "\nTotal Payment: " + payment;
    } else if (buttonId === "copyPercentResultBtn") {
      var percentResult = byId("percentResult").textContent;
      textToCopy = "Percentage Result: " + percentResult;
    } else if (buttonId === "copyChangeResultBtn") {
      var changeType = byId("changeType").textContent;
      var changeResult = byId("changeResult").textContent;
      textToCopy = "Percentage Change:\nType: " + changeType + "\nPercentage: " + changeResult;
    } else if (buttonId === "copyAgeResultBtn") {
      var ageResult = byId("ageResult").textContent;
      var ageExtra = byId("ageExtra").textContent;
      textToCopy = ageResult + "\n" + ageExtra;
    } else if (buttonId === "copySipResultBtn") {
      var sipInvested = byId("sipInvested").textContent;
      var sipReturns = byId("sipReturns").textContent;
      var sipFinal = byId("sipFinal").textContent;
      textToCopy = "SIP Results:\nTotal Invested: " + sipInvested + "\nEstimated Returns: " + sipReturns + "\nFinal Value: " + sipFinal;
    } else if (buttonId === "copyFdResultBtn") {
      var fdPrincipal = byId("fdPrincipal").textContent;
      var fdInterest = byId("fdInterest").textContent;
      var fdMaturity = byId("fdMaturity").textContent;
      textToCopy = "FD Results:\nPrincipal: " + fdPrincipal + "\nInterest: " + fdInterest + "\nMaturity Amount: " + fdMaturity;
    } else if (buttonId === "copyLoanEligResultBtn") {
      var eligibleEmi = byId("eligibleEmi").textContent;
      var maxLoanAmount = byId("maxLoanAmount").textContent;
      textToCopy = "Loan Eligibility:\nEligible EMI: " + eligibleEmi + "\nMax Loan Amount: " + maxLoanAmount;
    } else if (buttonId === "copySalaryResultBtn") {
      var annualTakeHome = byId("annualTakeHome").textContent;
      var monthlyInHand = byId("monthlyInHand").textContent;
      var totalDeductions = byId("totalDeductions").textContent;
      textToCopy = "Salary Details:\nAnnual Take Home: " + annualTakeHome + "\nMonthly In-Hand: " + monthlyInHand + "\nTotal Deductions: " + totalDeductions;
    } else if (buttonId === "copyTaxResultBtn") {
      var incomeTax = byId("incomeTax").textContent;
      var surcharge = byId("surcharge").textContent;
      var educationCess = byId("educationCess").textContent;
      var totalTaxPayable = byId("totalTaxPayable").textContent;
      var netIncome = byId("netIncome").textContent;
      var effectiveTaxRate = byId("effectiveTaxRate").textContent;
      textToCopy = "Tax Calculation:\nIncome Tax: " + incomeTax + "\nSurcharge: " + surcharge + "\nEducation Cess: " + educationCess + "\nTotal Tax: " + totalTaxPayable + "\nNet Income: " + netIncome + "\nEffective Tax Rate: " + effectiveTaxRate;
    } else if (buttonId === "copyElectricityResultBtn") {
      var elecEnergy = byId("elecEnergyCharge").textContent;
      var elecTotal = byId("elecTotalBill").textContent;
      textToCopy = "Electricity Bill:\nEnergy Charge: " + elecEnergy + "\nTotal Bill: " + elecTotal;
    } else if (buttonId === "copyPpfResultBtn") {
      var ppfInvested = byId("ppfInvested").textContent;
      var ppfInterest = byId("ppfInterest").textContent;
      var ppfMaturity = byId("ppfMaturity").textContent;
      textToCopy = "PPF Results:\nTotal Invested: " + ppfInvested + "\nInterest Earned: " + ppfInterest + "\nMaturity Value: " + ppfMaturity;
    } else if (buttonId === "copyRdResultBtn") {
      var rdInvested = byId("rdInvested").textContent;
      var rdInterest = byId("rdInterest").textContent;
      var rdMaturity = byId("rdMaturity").textContent;
      textToCopy = "RD Results:\nTotal Invested: " + rdInvested + "\nInterest Earned: " + rdInterest + "\nMaturity Value: " + rdMaturity;
    } else if (buttonId === "copyGratuityResultBtn") {
      var gratuityAmount = byId("gratuityAmount").textContent;
      textToCopy = "Gratuity Estimate: " + gratuityAmount;
    } else if (buttonId === "copyFuelResultBtn") {
      var fuelNeeded = byId("fuelNeeded").textContent;
      var fuelPerKm = byId("fuelPerKm").textContent;
      var fuelTripCost = byId("fuelTripCost").textContent;
      textToCopy = "Fuel Cost Estimate:\nFuel Needed: " + fuelNeeded + "\nCost Per Km: " + fuelPerKm + "\nTotal Fuel Cost: " + fuelTripCost;
    } else if (buttonId === "copySimpleInterestResultBtn") {
      var siInterest = byId("siInterest").textContent;
      var siTotal = byId("siTotal").textContent;
      textToCopy = "Simple Interest Results:\nInterest Earned: " + siInterest + "\nTotal Amount: " + siTotal;
    } else if (buttonId === "copyCompoundInterestResultBtn") {
      var ciInterest = byId("ciInterest").textContent;
      var ciMaturity = byId("ciMaturity").textContent;
      textToCopy = "Compound Interest Results:\nInterest Earned: " + ciInterest + "\nMaturity Amount: " + ciMaturity;
    } else if (buttonId === "copyBmiResultBtn") {
      var bmiValue = byId("bmiValue").textContent;
      var bmiCategory = byId("bmiCategory").textContent;
      textToCopy = "BMI Result:\nBMI: " + bmiValue + "\nCategory: " + bmiCategory;
    } else if (buttonId === "copyDiscountResultBtn") {
      var discountAmount = byId("discountAmount").textContent;
      var discountFinal = byId("discountFinal").textContent;
      textToCopy = "Discount Results:\nDiscount Amount: " + discountAmount + "\nFinal Price: " + discountFinal;
    } else if (buttonId === "copyBreakEvenResultBtn") {
      var beUnits = byId("beUnits").textContent;
      var beRevenue = byId("beRevenue").textContent;
      textToCopy = "Break-Even Results:\nBreak-Even Units: " + beUnits + "\nBreak-Even Revenue: " + beRevenue;
    }

    return textToCopy;
  }

  function setupCopyButtons() {
    var copyButtons = document.querySelectorAll(".copy-btn");
    copyButtons.forEach(function (btn) {
      var feedbackEl = btn.parentElement.querySelector('.copy-feedback[data-for="' + btn.id + '"]');
      if (!feedbackEl) {
        feedbackEl = document.createElement("span");
        feedbackEl.className = "copy-feedback";
        feedbackEl.setAttribute("data-for", btn.id);
        feedbackEl.setAttribute("aria-live", "polite");
        feedbackEl.textContent = "";
        btn.insertAdjacentElement("afterend", feedbackEl);
      }

      btn.addEventListener("click", function () {
        var textToCopy = getResultTextByButtonId(btn.id);

        if (!textToCopy) {
          return;
        }

        if (!navigator.clipboard || !navigator.clipboard.writeText) {
          feedbackEl.textContent = "Copy not supported in this browser";
          setTimeout(function () {
            feedbackEl.textContent = "";
          }, 1800);
          return;
        }

        navigator.clipboard.writeText(textToCopy).then(function () {
          feedbackEl.textContent = "Copied successfully";
          setTimeout(function () {
            feedbackEl.textContent = "";
          }, 1800);
        }).catch(function (err) {
          console.error("Failed to copy:", err);
          feedbackEl.textContent = "Unable to copy";
          setTimeout(function () {
            feedbackEl.textContent = "";
          }, 1800);
        });
      });
    });
  }

  function setupShareButtons() {
    var copyButtons = document.querySelectorAll(".copy-btn");
    copyButtons.forEach(function (copyBtn) {
      var existingShare = copyBtn.parentElement.querySelector(".share-btn[data-for='" + copyBtn.id + "']");
      if (existingShare) {
        return;
      }

      var shareBtn = document.createElement("button");
      shareBtn.type = "button";
      shareBtn.className = "secondary share-btn";
      shareBtn.setAttribute("data-for", copyBtn.id);
      shareBtn.style.marginLeft = "8px";
      shareBtn.textContent = "Share Result";

      shareBtn.addEventListener("click", function () {
        var textToShare = getResultTextByButtonId(copyBtn.id) || "Check this calculator: " + window.location.href;
        if (navigator.share) {
          navigator.share({
            title: document.title,
            text: textToShare,
            url: window.location.href
          }).catch(function () {
            // ignore cancelled share
          });
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textToShare + "\n" + window.location.href).then(function () {
            var originalText = shareBtn.textContent;
            shareBtn.textContent = "✓ Shared";
            setTimeout(function () {
              shareBtn.textContent = originalText;
            }, 2000);
          });
        }
      });

      copyBtn.insertAdjacentElement("afterend", shareBtn);
    });
  }

  function initElectricityBillCalculator() {
    var unitsEl = byId("elecUnits");
    if (!unitsEl) return;

    var rateEl = byId("elecRate");
    var fixedEl = byId("elecFixed");
    var errorEl = byId("elecError");

    function calculate() {
      var units = parseFloat(unitsEl.value);
      var rate = parseFloat(rateEl.value);
      var fixed = parseFloat(fixedEl.value);

      if (!Number.isFinite(units) || units < 0 || !Number.isFinite(rate) || rate < 0 || !Number.isFinite(fixed) || fixed < 0) {
        errorEl.textContent = "Enter valid values for units, rate, and fixed charges.";
        setText("elecEnergyCharge", "-");
        setText("elecTotalBill", "-");
        return;
      }

      errorEl.textContent = "";
      var energy = units * rate;
      var total = energy + fixed;
      setText("elecEnergyCharge", "₹ " + formatINR(energy));
      setText("elecTotalBill", "₹ " + formatINR(total));
    }

    [unitsEl, rateEl, fixedEl].forEach(function (el) {
      el.addEventListener("input", calculate);
    });
    calculate();
  }

  function initPpfCalculator() {
    var annualEl = byId("ppfAnnual");
    if (!annualEl) return;

    var yearsEl = byId("ppfYears");
    var rateEl = byId("ppfRate");
    var errorEl = byId("ppfError");

    function calculate() {
      var annual = parseFloat(annualEl.value);
      var years = parseInt(yearsEl.value, 10);
      var rate = parseFloat(rateEl.value);

      if (!Number.isFinite(annual) || annual <= 0 || !Number.isFinite(years) || years <= 0 || !Number.isFinite(rate) || rate < 0) {
        errorEl.textContent = "Enter valid annual contribution, years, and rate.";
        setText("ppfInvested", "-");
        setText("ppfInterest", "-");
        setText("ppfMaturity", "-");
        return;
      }

      errorEl.textContent = "";
      var r = rate / 100;
      var maturity = r === 0 ? annual * years : annual * ((Math.pow(1 + r, years) - 1) / r);
      var invested = annual * years;
      var interest = maturity - invested;

      setText("ppfInvested", "₹ " + formatINR(invested));
      setText("ppfInterest", "₹ " + formatINR(interest));
      setText("ppfMaturity", "₹ " + formatINR(maturity));
    }

    [annualEl, yearsEl, rateEl].forEach(function (el) {
      el.addEventListener("input", calculate);
    });
    calculate();
  }

  function initRdCalculator() {
    var monthlyEl = byId("rdMonthly");
    if (!monthlyEl) return;

    var monthsEl = byId("rdMonths");
    var rateEl = byId("rdRate");
    var errorEl = byId("rdError");

    function calculate() {
      var monthly = parseFloat(monthlyEl.value);
      var months = parseInt(monthsEl.value, 10);
      var rate = parseFloat(rateEl.value);

      if (!Number.isFinite(monthly) || monthly <= 0 || !Number.isFinite(months) || months <= 0 || !Number.isFinite(rate) || rate < 0) {
        errorEl.textContent = "Enter valid monthly amount, months, and rate.";
        setText("rdInvested", "-");
        setText("rdInterest", "-");
        setText("rdMaturity", "-");
        return;
      }

      errorEl.textContent = "";
      var monthlyRate = rate / 1200;
      var maturity = 0;
      for (var i = 0; i < months; i += 1) {
        maturity = (maturity + monthly) * (1 + monthlyRate);
      }
      var invested = monthly * months;
      var interest = maturity - invested;

      setText("rdInvested", "₹ " + formatINR(invested));
      setText("rdInterest", "₹ " + formatINR(interest));
      setText("rdMaturity", "₹ " + formatINR(maturity));
    }

    [monthlyEl, monthsEl, rateEl].forEach(function (el) {
      el.addEventListener("input", calculate);
    });
    calculate();
  }

  function initGratuityCalculator() {
    var salaryEl = byId("gratuitySalary");
    if (!salaryEl) return;

    var yearsEl = byId("gratuityYears");
    var errorEl = byId("gratuityError");

    function calculate() {
      var salary = parseFloat(salaryEl.value);
      var years = parseFloat(yearsEl.value);

      if (!Number.isFinite(salary) || salary <= 0 || !Number.isFinite(years) || years <= 0) {
        errorEl.textContent = "Enter valid last drawn salary and service years.";
        setText("gratuityAmount", "-");
        return;
      }

      errorEl.textContent = "";
      var gratuity = (15 / 26) * salary * years;
      setText("gratuityAmount", "₹ " + formatINR(gratuity));
    }

    [salaryEl, yearsEl].forEach(function (el) {
      el.addEventListener("input", calculate);
    });
    calculate();
  }

  function initFuelCostCalculator() {
    var distanceEl = byId("fuelDistance");
    if (!distanceEl) return;

    var mileageEl = byId("fuelMileage");
    var priceEl = byId("fuelPrice");
    var errorEl = byId("fuelError");

    function calculate() {
      var distance = parseFloat(distanceEl.value);
      var mileage = parseFloat(mileageEl.value);
      var price = parseFloat(priceEl.value);

      if (!Number.isFinite(distance) || distance <= 0 || !Number.isFinite(mileage) || mileage <= 0 || !Number.isFinite(price) || price <= 0) {
        errorEl.textContent = "Enter valid distance, mileage, and fuel price values.";
        setText("fuelNeeded", "-");
        setText("fuelPerKm", "-");
        setText("fuelTripCost", "-");
        return;
      }

      errorEl.textContent = "";
      var litres = distance / mileage;
      var totalCost = litres * price;
      var perKm = totalCost / distance;

      setText("fuelNeeded", litres.toFixed(2) + " L");
      setText("fuelPerKm", "Rs " + formatINR(perKm));
      setText("fuelTripCost", "Rs " + formatINR(totalCost));
    }

    [distanceEl, mileageEl, priceEl].forEach(function (el) {
      el.addEventListener("input", calculate);
    });

    calculate();
  }

  // SIP Calculator
  function initSipCalculator() {
    var monthlyEl = byId("sipMonthly");
    if (!monthlyEl) return;

    var rateEl = byId("sipRate");
    var yearsEl = byId("sipYears");
    var errorEl = byId("sipError");

    function syncSipInputs(source) {
      if (source === "number-monthly") {
        var monthlyVal = parseFloat(monthlyEl.value);
        byId("sipMonthlyRange").value = monthlyVal;
      } else if (source === "range-monthly") {
        monthlyEl.value = byId("sipMonthlyRange").value;
      } else if (source === "number-rate") {
        rateEl.value = parseFloat(rateEl.value);
        byId("sipRateRange").value = rateEl.value;
      } else if (source === "range-rate") {
        rateEl.value = byId("sipRateRange").value;
      } else if (source === "number-years") {
        yearsEl.value = parseInt(yearsEl.value);
        byId("sipYearsRange").value = yearsEl.value;
      } else if (source === "range-years") {
        yearsEl.value = byId("sipYearsRange").value;
      }
      calculateSip();
    }

    function calculateSip() {
      var monthly = parseFloat(monthlyEl.value);
      var rate = parseFloat(rateEl.value);
      var years = parseInt(yearsEl.value);

      if (!Number.isFinite(monthly) || monthly <= 0) {
        errorEl.textContent = "Please enter a valid monthly investment greater than 0.";
        setText("sipInvested", "-");
        setText("sipReturns", "-");
        setText("sipFinal", "-");
        return;
      }
      if (!Number.isFinite(rate) || rate < 0) {
        errorEl.textContent = "Please enter a valid return rate (0% or higher).";
        setText("sipInvested", "-");
        setText("sipReturns", "-");
        setText("sipFinal", "-");
        return;
      }
      if (!Number.isFinite(years) || years <= 0) {
        errorEl.textContent = "Please enter a valid period (1 year or more).";
        setText("sipInvested", "-");
        setText("sipReturns", "-");
        setText("sipFinal", "-");
        return;
      }

      errorEl.textContent = "";

      var monthlyRate = rate / 100 / 12;
      var months = years * 12;
      var totalInvested = monthly * months;

      var fv;
      if (monthlyRate === 0) {
        fv = totalInvested;
      } else {
        var numerator = Math.pow(1 + monthlyRate, months) - 1;
        var denominator = monthlyRate;
        fv = monthly * (numerator / denominator) * (1 + monthlyRate);
      }

      var returns = fv - totalInvested;

      setText("sipInvested", formatINR(totalInvested));
      setText("sipReturns", formatINR(returns));
      setText("sipFinal", formatINR(fv));
    }

    monthlyEl.addEventListener("input", function () { syncSipInputs("number-monthly"); });
    byId("sipMonthlyRange").addEventListener("input", function () { syncSipInputs("range-monthly"); });
    rateEl.addEventListener("input", function () { syncSipInputs("number-rate"); });
    byId("sipRateRange").addEventListener("input", function () { syncSipInputs("range-rate"); });
    yearsEl.addEventListener("input", function () { syncSipInputs("number-years"); });
    byId("sipYearsRange").addEventListener("input", function () { syncSipInputs("range-years"); });

    calculateSip();
  }

  // FD Calculator
  function initFdCalculator() {
    var amountEl = byId("fdAmount");
    if (!amountEl) return;

    var rateEl = byId("fdRate");
    var yearsEl = byId("fdYears");
    var compoundingEls = document.querySelectorAll('input[name="fdCompounding"]');
    var errorEl = byId("fdError");

    function calculateFd() {
      var amount = parseFloat(amountEl.value);
      var rate = parseFloat(rateEl.value);
      var years = parseFloat(yearsEl.value);
      var compounding = document.querySelector('input[name="fdCompounding"]:checked').value;

      if (!Number.isFinite(amount) || amount <= 0) {
        errorEl.textContent = "Please enter a valid principal amount greater than 0.";
        setText("fdPrincipal", "-");
        setText("fdInterest", "-");
        setText("fdMaturity", "-");
        return;
      }
      if (!Number.isFinite(rate) || rate < 0) {
        errorEl.textContent = "Please enter a valid interest rate (0% or higher).";
        setText("fdPrincipal", "-");
        setText("fdInterest", "-");
        setText("fdMaturity", "-");
        return;
      }
      if (!Number.isFinite(years) || years <= 0) {
        errorEl.textContent = "Please enter a valid time period (greater than 0).";
        setText("fdPrincipal", "-");
        setText("fdInterest", "-");
        setText("fdMaturity", "-");
        return;
      }

      errorEl.textContent = "";

      var n = compounding === "quarterly" ? 4 : 1;
      var r = rate / 100;
      var maturity = amount * Math.pow(1 + r / n, n * years);
      var interest = maturity - amount;

      setText("fdPrincipal", formatINR(amount));
      setText("fdInterest", formatINR(interest));
      setText("fdMaturity", formatINR(maturity));
    }

    amountEl.addEventListener("input", calculateFd);
    byId("fdAmountRange").addEventListener("input", function () {
      amountEl.value = byId("fdAmountRange").value;
      calculateFd();
    });
    rateEl.addEventListener("input", calculateFd);
    byId("fdRateRange").addEventListener("input", function () {
      rateEl.value = byId("fdRateRange").value;
      calculateFd();
    });
    yearsEl.addEventListener("input", calculateFd);
    byId("fdYearsRange").addEventListener("input", function () {
      yearsEl.value = byId("fdYearsRange").value;
      calculateFd();
    });
    compoundingEls.forEach(function (el) {
      el.addEventListener("change", calculateFd);
    });

    calculateFd();
  }

  // Loan Eligibility Calculator
  function initLoanEligibilityCalculator() {
    var incomeEl = byId("monthlyIncome");
    if (!incomeEl) return;

    var emiEl = byId("existingEmi");
    var rateEl = byId("loanRate2");
    var tenureEl = byId("loanTenure2");
    var errorEl = byId("loanEligError");

    function calculateLoanEligibility() {
      var income = parseFloat(incomeEl.value);
      var existingEmi = parseFloat(emiEl.value);
      var rate = parseFloat(rateEl.value);
      var tenure = parseInt(tenureEl.value);

      if (!Number.isFinite(income) || income <= 0) {
        errorEl.textContent = "Please enter a valid monthly income greater than 0.";
        setText("eligibleEmi", "-");
        setText("maxLoanAmount", "-");
        return;
      }
      if (!Number.isFinite(existingEmi) || existingEmi < 0) {
        errorEl.textContent = "Please enter valid existing EMIs (0 or higher).";
        setText("eligibleEmi", "-");
        setText("maxLoanAmount", "-");
        return;
      }
      if (existingEmi > income * 0.5) {
        errorEl.textContent = "Existing EMIs exceed 50% of income. No loan eligibility.";
        setText("eligibleEmi", "-");
        setText("maxLoanAmount", "-");
        return;
      }
      if (!Number.isFinite(rate) || rate < 0) {
        errorEl.textContent = "Please enter a valid interest rate.";
        setText("eligibleEmi", "-");
        setText("maxLoanAmount", "-");
        return;
      }
      if (!Number.isFinite(tenure) || tenure <= 0) {
        errorEl.textContent = "Please enter a valid tenure (1 year or more).";
        setText("eligibleEmi", "-");
        setText("maxLoanAmount", "-");
        return;
      }

      errorEl.textContent = "";

      var maxAllowedEmi = income * 0.5;
      var eligibleEmi = maxAllowedEmi - existingEmi;

      var monthlyRate = rate / 100 / 12;
      var months = tenure * 12;

      var loanAmount;
      if (monthlyRate === 0) {
        loanAmount = eligibleEmi * months;
      } else {
        var numerator = (1 + monthlyRate) ** months - 1;
        var denominator = monthlyRate * (1 + monthlyRate) ** months;
        loanAmount = eligibleEmi * (numerator / denominator);
      }

      setText("eligibleEmi", formatINR(eligibleEmi));
      setText("maxLoanAmount", formatINR(loanAmount));
    }

    incomeEl.addEventListener("input", calculateLoanEligibility);
    byId("monthlyIncomeRange").addEventListener("input", function () {
      incomeEl.value = byId("monthlyIncomeRange").value;
      calculateLoanEligibility();
    });
    emiEl.addEventListener("input", calculateLoanEligibility);
    byId("existingEmiRange").addEventListener("input", function () {
      emiEl.value = byId("existingEmiRange").value;
      calculateLoanEligibility();
    });
    rateEl.addEventListener("input", calculateLoanEligibility);
    byId("loanRate2Range").addEventListener("input", function () {
      rateEl.value = byId("loanRate2Range").value;
      calculateLoanEligibility();
    });
    tenureEl.addEventListener("input", calculateLoanEligibility);
    byId("loanTenure2Range").addEventListener("input", function () {
      tenureEl.value = byId("loanTenure2Range").value;
      calculateLoanEligibility();
    });

    calculateLoanEligibility();
  }

  // Salary Calculator
  function initSalaryCalculator() {
    var ctcEl = byId("ctcSalary");
    if (!ctcEl) return;

    var bonusEl = byId("bonusSalary");
    var pfEl = byId("pfPercentage");
    var regimeEls = document.querySelectorAll('input[name="taxRegime"]');
    var errorEl = byId("salaryError");

    function calculateSalary() {
      var ctc = parseFloat(ctcEl.value);
      var bonus = parseFloat(bonusEl.value);
      var pfPercent = parseFloat(pfEl.value);
      var regime = document.querySelector('input[name="taxRegime"]:checked').value;

      if (!Number.isFinite(ctc) || ctc < 0) {
        errorEl.textContent = "Please enter a valid CTC.";
        return;
      }

      errorEl.textContent = "";

      var totalIncome = ctc + bonus;
      var basicSalary = totalIncome * 0.4;
      var pfDeduction = basicSalary * (pfPercent / 100);
      var grossSalary = totalIncome - pfDeduction;

      var taxableIncome, incomeTax;

      if (regime === "new") {
        taxableIncome = grossSalary - 50000;
      } else {
        taxableIncome = grossSalary - (pfDeduction * 12) - 50000 - 50000;
      }

      if (taxableIncome <= 0) {
        incomeTax = 0;
      } else if (taxableIncome <= 2500000) {
        var slab1 = Math.min(taxableIncome, 250000) * 0;
        var slab2 = Math.max(0, Math.min(taxableIncome - 250000, 250000)) * 0.05;
        var slab3 = Math.max(0, Math.min(taxableIncome - 500000, 250000)) * 0.1;
        var slab4 = Math.max(0, Math.min(taxableIncome - 750000, 250000)) * 0.15;
        var slab5 = Math.max(0, Math.min(taxableIncome - 1000000, 250000)) * 0.2;
        var slab6 = Math.max(0, Math.min(taxableIncome - 1250000, 250000)) * 0.25;
        var slab7 = Math.max(0, taxableIncome - 1500000) * 0.3;
        incomeTax = slab1 + slab2 + slab3 + slab4 + slab5 + slab6 + slab7;
      } else {
        incomeTax = (250000 * 0) + (250000 * 0.05) + (250000 * 0.1) + (250000 * 0.15) + (250000 * 0.2) + (250000 * 0.25) + ((taxableIncome - 1500000) * 0.3);
      }

      var cess = incomeTax * 0.03;
      var totalTax = incomeTax + cess;
      var monthlyInHand = (totalIncome - pfDeduction - (incomeTax / 12) - (cess / 12)) / 12;
      var annualTakeHome = totalIncome - (pfDeduction * 12) - totalTax;

      setText("monthlyInHand", formatINR(monthlyInHand));
      setText("annualTakeHome", formatINR(annualTakeHome));
      setText("totalDeductions", formatINR((pfDeduction * 12) + totalTax));
    }

    ctcEl.addEventListener("input", calculateSalary);
    byId("ctcSalaryRange").addEventListener("input", function () {
      ctcEl.value = byId("ctcSalaryRange").value;
      calculateSalary();
    });
    bonusEl.addEventListener("input", calculateSalary);
    byId("bonusSalaryRange").addEventListener("input", function () {
      bonusEl.value = byId("bonusSalaryRange").value;
      calculateSalary();
    });
    pfEl.addEventListener("input", calculateSalary);
    byId("pfPercentageRange").addEventListener("input", function () {
      pfEl.value = byId("pfPercentageRange").value;
      calculateSalary();
    });
    regimeEls.forEach(function (el) {
      el.addEventListener("change", calculateSalary);
    });

    calculateSalary();
  }

  // Income Tax Calculator
  function initIncomeTaxCalculator() {
    var incomeEl = byId("taxableIncome");
    if (!incomeEl) return;

    var section80cEl = byId("section80cDeduction");
    var section80dEl = byId("section80dDeduction");
    var regimeEls = document.querySelectorAll('input[name="taxRegime2"]');
    var errorEl = byId("taxError");

    function calculateTax() {
      var income = parseFloat(incomeEl.value);
      var section80c = parseFloat(section80cEl.value);
      var section80d = parseFloat(section80dEl.value);
      var regime = document.querySelector('input[name="taxRegime2"]:checked').value;

      if (!Number.isFinite(income) || income < 0) {
        errorEl.textContent = "Please enter a valid annual taxable income.";
        setText("incomeTax", "-");
        setText("surcharge", "-");
        setText("educationCess", "-");
        setText("totalTaxPayable", "-");
        setText("netIncome", "-");
        setText("effectiveTaxRate", "-");
        return;
      }

      errorEl.textContent = "";

      var taxableIncome, incomeTax, surcharge;

      if (regime === "new") {
        taxableIncome = income - 50000;
      } else {
        taxableIncome = income - section80c - section80d - 50000;
      }

      if (taxableIncome <= 0) {
        incomeTax = 0;
      } else if (taxableIncome <= 2500000) {
        var slab1 = Math.min(taxableIncome, 250000) * 0;
        var slab2 = Math.max(0, Math.min(taxableIncome - 250000, 250000)) * 0.05;
        var slab3 = Math.max(0, Math.min(taxableIncome - 500000, 250000)) * 0.1;
        var slab4 = Math.max(0, Math.min(taxableIncome - 750000, 250000)) * 0.15;
        var slab5 = Math.max(0, Math.min(taxableIncome - 1000000, 250000)) * 0.2;
        var slab6 = Math.max(0, Math.min(taxableIncome - 1250000, 250000)) * 0.25;
        var slab7 = Math.max(0, taxableIncome - 1500000) * 0.3;
        incomeTax = slab1 + slab2 + slab3 + slab4 + slab5 + slab6 + slab7;
      } else {
        incomeTax = (250000 * 0) + (250000 * 0.05) + (250000 * 0.1) + (250000 * 0.15) + (250000 * 0.2) + (250000 * 0.25) + ((taxableIncome - 1500000) * 0.3);
      }

      if (income > 10000000) {
        surcharge = incomeTax * 0.25;
      } else if (income > 5000000) {
        surcharge = incomeTax * 0.15;
      } else if (income > 1000000) {
        surcharge = incomeTax * 0.1;
      } else {
        surcharge = 0;
      }

      var cess = (incomeTax + surcharge) * 0.03;
      var totalTax = incomeTax + surcharge + cess;
      var netIncome = income - totalTax;
      var effectiveRate = (totalTax / income) * 100;

      setText("incomeTax", formatINR(incomeTax));
      setText("surcharge", formatINR(surcharge));
      setText("educationCess", formatINR(cess));
      setText("totalTaxPayable", formatINR(totalTax));
      setText("netIncome", formatINR(netIncome));
      setText("effectiveTaxRate", effectiveRate.toFixed(2) + "%");
    }

    incomeEl.addEventListener("input", calculateTax);
    byId("taxableIncomeRange").addEventListener("input", function () {
      incomeEl.value = byId("taxableIncomeRange").value;
      calculateTax();
    });
    section80cEl.addEventListener("input", calculateTax);
    byId("section80cDeductionRange").addEventListener("input", function () {
      section80cEl.value = byId("section80cDeductionRange").value;
      calculateTax();
    });
    section80dEl.addEventListener("input", calculateTax);
    byId("section80dDeductionRange").addEventListener("input", function () {
      section80dEl.value = byId("section80dDeductionRange").value;
      calculateTax();
    });
    regimeEls.forEach(function (el) {
      el.addEventListener("change", calculateTax);
    });

    calculateTax();
  }

  function initSimpleInterestCalculator() {
    var principalEl = byId("siPrincipal");
    if (!principalEl) return;

    var rateEl = byId("siRate");
    var yearsEl = byId("siYears");
    var errorEl = byId("siError");

    function calculate() {
      var principal = parseFloat(principalEl.value);
      var rate = parseFloat(rateEl.value);
      var years = parseFloat(yearsEl.value);

      if (!Number.isFinite(principal) || principal <= 0 || !Number.isFinite(rate) || rate < 0 || !Number.isFinite(years) || years <= 0) {
        errorEl.textContent = "Enter valid principal, rate, and years.";
        setText("siInterest", "-");
        setText("siTotal", "-");
        return;
      }

      errorEl.textContent = "";
      var interest = principal * (rate / 100) * years;
      var total = principal + interest;

      setText("siInterest", "Rs " + formatINR(interest));
      setText("siTotal", "Rs " + formatINR(total));
    }

    [principalEl, rateEl, yearsEl].forEach(function (el) {
      el.addEventListener("input", calculate);
    });
    calculate();
  }

  function initCompoundInterestCalculator() {
    var principalEl = byId("ciPrincipal");
    if (!principalEl) return;

    var rateEl = byId("ciRate");
    var yearsEl = byId("ciYears");
    var compoundingEl = byId("ciCompounding");
    var errorEl = byId("ciError");

    function calculate() {
      var principal = parseFloat(principalEl.value);
      var rate = parseFloat(rateEl.value);
      var years = parseFloat(yearsEl.value);
      var n = parseInt(compoundingEl.value, 10);

      if (!Number.isFinite(principal) || principal <= 0 || !Number.isFinite(rate) || rate < 0 || !Number.isFinite(years) || years <= 0 || !Number.isFinite(n) || n <= 0) {
        errorEl.textContent = "Enter valid principal, rate, years, and compounding.";
        setText("ciInterest", "-");
        setText("ciMaturity", "-");
        return;
      }

      errorEl.textContent = "";
      var maturity = principal * Math.pow(1 + (rate / 100) / n, n * years);
      var interest = maturity - principal;

      setText("ciInterest", "Rs " + formatINR(interest));
      setText("ciMaturity", "Rs " + formatINR(maturity));
    }

    [principalEl, rateEl, yearsEl, compoundingEl].forEach(function (el) {
      el.addEventListener("input", calculate);
      el.addEventListener("change", calculate);
    });
    calculate();
  }

  function initBmiCalculator() {
    var weightEl = byId("bmiWeight");
    if (!weightEl) return;

    var heightEl = byId("bmiHeight");
    var errorEl = byId("bmiError");

    function getCategory(bmi) {
      if (bmi < 18.5) return "Underweight";
      if (bmi < 25) return "Normal";
      if (bmi < 30) return "Overweight";
      return "Obese";
    }

    function calculate() {
      var weight = parseFloat(weightEl.value);
      var heightCm = parseFloat(heightEl.value);

      if (!Number.isFinite(weight) || weight <= 0 || !Number.isFinite(heightCm) || heightCm <= 0) {
        errorEl.textContent = "Enter valid weight and height values.";
        setText("bmiValue", "-");
        setText("bmiCategory", "-");
        return;
      }

      errorEl.textContent = "";
      var heightM = heightCm / 100;
      var bmi = weight / (heightM * heightM);
      setText("bmiValue", bmi.toFixed(2));
      setText("bmiCategory", getCategory(bmi));
    }

    [weightEl, heightEl].forEach(function (el) {
      el.addEventListener("input", calculate);
    });
    calculate();
  }

  function initDiscountCalculator() {
    var originalEl = byId("discountOriginal");
    if (!originalEl) return;

    var percentEl = byId("discountPercent");
    var errorEl = byId("discountError");

    function calculate() {
      var original = parseFloat(originalEl.value);
      var percent = parseFloat(percentEl.value);

      if (!Number.isFinite(original) || original < 0 || !Number.isFinite(percent) || percent < 0 || percent > 100) {
        errorEl.textContent = "Enter valid price and discount (0 to 100).";
        setText("discountAmount", "-");
        setText("discountFinal", "-");
        return;
      }

      errorEl.textContent = "";
      var discount = original * (percent / 100);
      var finalPrice = original - discount;

      setText("discountAmount", "Rs " + formatINR(discount));
      setText("discountFinal", "Rs " + formatINR(finalPrice));
    }

    [originalEl, percentEl].forEach(function (el) {
      el.addEventListener("input", calculate);
    });
    calculate();
  }

  function initBreakEvenCalculator() {
    var fixedCostEl = byId("beFixedCost");
    if (!fixedCostEl) return;

    var variableCostEl = byId("beVariableCost");
    var sellingPriceEl = byId("beSellingPrice");
    var errorEl = byId("beError");

    function calculate() {
      var fixed = parseFloat(fixedCostEl.value);
      var variable = parseFloat(variableCostEl.value);
      var selling = parseFloat(sellingPriceEl.value);

      if (!Number.isFinite(fixed) || fixed < 0 || !Number.isFinite(variable) || variable < 0 || !Number.isFinite(selling) || selling <= 0) {
        errorEl.textContent = "Enter valid fixed cost, variable cost, and selling price.";
        setText("beUnits", "-");
        setText("beRevenue", "-");
        return;
      }

      var contribution = selling - variable;
      if (contribution <= 0) {
        errorEl.textContent = "Selling price must be greater than variable cost for break-even.";
        setText("beUnits", "-");
        setText("beRevenue", "-");
        return;
      }

      errorEl.textContent = "";
      var units = fixed / contribution;
      var revenue = units * selling;

      setText("beUnits", units.toFixed(2) + " units");
      setText("beRevenue", "Rs " + formatINR(revenue));
    }

    [fixedCostEl, variableCostEl, sellingPriceEl].forEach(function (el) {
      el.addEventListener("input", calculate);
    });
    calculate();
  }

  function initRentReceiptGenerator() {
    var tenantEl = byId("rentTenantName");
    if (!tenantEl) {
      return;
    }

    var ownerEl = byId("rentOwnerName");
    var addressEl = byId("rentPropertyAddress");
    var rentEl = byId("rentMonthlyAmount");
    var monthEl = byId("rentMonth");
    var yearEl = byId("rentYear");
    var paymentEl = byId("rentPaymentMode");
    var errorEl = byId("rentReceiptError");
    var previewEl = byId("rentReceiptPreview");
    var currentData = null;

    function getData() {
      var tenant = sanitizeText(tenantEl.value);
      var owner = sanitizeText(ownerEl.value);
      var address = sanitizeText(addressEl.value);
      var rent = parseFloat(rentEl.value);
      var month = sanitizeText(monthEl.value);
      var year = sanitizeText(yearEl.value);
      var paymentMode = sanitizeText(paymentEl.value);

      if (!tenant || !owner || !address || !month || !year || !Number.isFinite(rent) || rent <= 0) {
        return null;
      }

      var receiptDate = new Date();
      var receiptNumber = "RR-" + year + "-" + month.slice(0, 3).toUpperCase() + "-" + String(Math.round(rent)).slice(-4);
      var amountWords = numberToWordsIndian(rent);
      return {
        title: "Rent Receipt",
        filename: "rent-receipt-" + month.toLowerCase() + "-" + year + ".pdf",
        receiptDate: formatDateLong(receiptDate),
        receiptNumber: receiptNumber,
        tenant: tenant,
        owner: owner,
        address: address,
        rent: rent,
        month: month,
        year: year,
        paymentMode: paymentMode,
        amountWords: amountWords,
        lines: [
          "Rent Receipt",
          "Receipt No: " + receiptNumber,
          "Date: " + formatDateLong(receiptDate),
          "",
          "Received from: " + tenant,
          "Landlord/Owner: " + owner,
          "Property Address: " + address,
          "Rent Month: " + month + " " + year,
          "Payment Mode: " + paymentMode,
          "Amount Received: " + formatCurrency(rent),
          "Amount in Words: Rupees " + amountWords + " Only",
          "",
          "Tenant Signature: ____________________",
          "Owner Signature: _____________________"
        ]
      };
    }

    function render() {
      currentData = getData();
      if (!currentData) {
        errorEl.textContent = "Enter tenant, owner, address, rent, month, and year to generate the receipt.";
        return;
      }

      errorEl.textContent = "";
      setText("rentReceiptDate", currentData.receiptDate);
      setText("rentReceiptNumber", currentData.receiptNumber);
      setText("rentReceiptTenant", currentData.tenant);
      setText("rentReceiptOwner", currentData.owner);
      setText("rentReceiptAddress", currentData.address);
      setText("rentReceiptPeriod", currentData.month + " " + currentData.year);
      setText("rentReceiptMode", currentData.paymentMode);
      setText("rentReceiptAmount", formatCurrency(currentData.rent));
      setText("rentReceiptAmountWords", "Rupees " + currentData.amountWords + " Only");
      previewEl.classList.remove("is-hidden");
    }

    [tenantEl, ownerEl, addressEl, rentEl, monthEl, yearEl, paymentEl].forEach(function (el) {
      el.addEventListener("input", render);
      el.addEventListener("change", render);
    });

    bindGeneratorActions("downloadRentReceiptBtn", "printRentReceiptBtn", function () {
      return currentData ? {
        title: currentData.title,
        filename: currentData.filename,
        lines: currentData.lines,
        previewHtml: previewEl.outerHTML
      } : null;
    });

    render();
  }

  function initGstInvoiceGenerator() {
    var businessEl = byId("invoiceBusinessName");
    if (!businessEl) {
      return;
    }

    var gstNumberEl = byId("invoiceGstNumber");
    var customerEl = byId("invoiceCustomerName");
    var itemEl = byId("invoiceItemName");
    var quantityEl = byId("invoiceQuantity");
    var priceEl = byId("invoicePricePerItem");
    var rateEl = byId("invoiceGstRate");
    var errorEl = byId("gstInvoiceError");
    var previewEl = byId("gstInvoicePreview");
    var currentData = null;

    function getData() {
      var businessName = sanitizeText(businessEl.value);
      var gstNumber = sanitizeText(gstNumberEl.value);
      var customerName = sanitizeText(customerEl.value);
      var itemName = sanitizeText(itemEl.value);
      var quantity = parseFloat(quantityEl.value);
      var price = parseFloat(priceEl.value);
      var rate = parseFloat(rateEl.value);

      if (!businessName || !gstNumber || !customerName || !itemName || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(price) || price <= 0 || !Number.isFinite(rate) || rate < 0) {
        return null;
      }

      var subtotal = quantity * price;
      var gstAmount = subtotal * (rate / 100);
      var total = subtotal + gstAmount;
      var invoiceNumber = "GST-" + String(Date.now()).slice(-6);
      return {
        title: "GST Invoice",
        filename: "gst-invoice-" + invoiceNumber.toLowerCase() + ".pdf",
        invoiceDate: formatDateLong(new Date()),
        invoiceNumber: invoiceNumber,
        businessName: businessName,
        gstNumber: gstNumber,
        customerName: customerName,
        itemName: itemName,
        quantity: quantity,
        price: price,
        rate: rate,
        subtotal: subtotal,
        gstAmount: gstAmount,
        total: total,
        lines: [
          "GST Invoice",
          "Invoice No: " + invoiceNumber,
          "Invoice Date: " + formatDateLong(new Date()),
          "",
          "Business Name: " + businessName,
          "GST Number: " + gstNumber,
          "Customer Name: " + customerName,
          "",
          "Item: " + itemName,
          "Quantity: " + quantity,
          "Price per Item: " + formatCurrency(price),
          "Subtotal: " + formatCurrency(subtotal),
          "GST (" + rate + "%): " + formatCurrency(gstAmount),
          "Total Amount: " + formatCurrency(total)
        ]
      };
    }

    function render() {
      currentData = getData();
      if (!currentData) {
        errorEl.textContent = "Fill business, GST number, customer, item, quantity, price, and GST rate to build the invoice.";
        return;
      }

      errorEl.textContent = "";
      setText("invoicePreviewBusiness", currentData.businessName);
      setText("invoicePreviewGstNumber", currentData.gstNumber);
      setText("invoicePreviewCustomer", currentData.customerName);
      setText("invoicePreviewDate", currentData.invoiceDate);
      setText("invoicePreviewNumber", currentData.invoiceNumber);
      setText("invoicePreviewItem", currentData.itemName);
      setText("invoicePreviewQuantity", currentData.quantity.toFixed(2).replace(/\.00$/, ""));
      setText("invoicePreviewPrice", formatCurrency(currentData.price));
      setText("invoicePreviewSubtotal", formatCurrency(currentData.subtotal));
      setText("invoicePreviewRate", currentData.rate.toFixed(2).replace(/\.00$/, "") + "%");
      setText("invoicePreviewGst", formatCurrency(currentData.gstAmount));
      setText("invoicePreviewTotal", formatCurrency(currentData.total));
      previewEl.classList.remove("is-hidden");
    }

    [businessEl, gstNumberEl, customerEl, itemEl, quantityEl, priceEl, rateEl].forEach(function (el) {
      el.addEventListener("input", render);
      el.addEventListener("change", render);
    });

    bindGeneratorActions("downloadGstInvoiceBtn", "printGstInvoiceBtn", function () {
      return currentData ? {
        title: currentData.title,
        filename: currentData.filename,
        lines: currentData.lines,
        previewHtml: previewEl.outerHTML
      } : null;
    });

    render();
  }

  function initSalarySlipGenerator() {
    var employeeEl = byId("salarySlipEmployeeName");
    if (!employeeEl) {
      return;
    }

    var companyEl = byId("salarySlipCompanyName");
    var basicEl = byId("salarySlipBasic");
    var hraEl = byId("salarySlipHra");
    var allowanceEl = byId("salarySlipAllowances");
    var deductionEl = byId("salarySlipDeductions");
    var errorEl = byId("salarySlipError");
    var previewEl = byId("salarySlipPreview");
    var currentData = null;

    function getData() {
      var employeeName = sanitizeText(employeeEl.value);
      var companyName = sanitizeText(companyEl.value);
      var basic = parseFloat(basicEl.value);
      var hra = parseFloat(hraEl.value);
      var allowances = parseFloat(allowanceEl.value);
      var deductions = parseFloat(deductionEl.value);

      if (!employeeName || !companyName || !Number.isFinite(basic) || basic < 0 || !Number.isFinite(hra) || hra < 0 || !Number.isFinite(allowances) || allowances < 0 || !Number.isFinite(deductions) || deductions < 0) {
        return null;
      }

      var gross = basic + hra + allowances;
      var net = gross - deductions;
      return {
        title: "Salary Slip",
        filename: "salary-slip-" + employeeName.toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".pdf",
        period: new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(new Date()),
        employeeName: employeeName,
        companyName: companyName,
        basic: basic,
        hra: hra,
        allowances: allowances,
        deductions: deductions,
        gross: gross,
        net: net,
        lines: [
          "Salary Slip",
          "Pay Period: " + new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(new Date()),
          "Employee Name: " + employeeName,
          "Company Name: " + companyName,
          "",
          "Basic Salary: " + formatCurrency(basic),
          "HRA: " + formatCurrency(hra),
          "Allowances: " + formatCurrency(allowances),
          "Total Earnings: " + formatCurrency(gross),
          "Deductions (PF/Tax): " + formatCurrency(deductions),
          "Net Salary: " + formatCurrency(net)
        ]
      };
    }

    function render() {
      currentData = getData();
      if (!currentData) {
        errorEl.textContent = "Enter employee, company, earnings, and deductions to generate the salary slip.";
        return;
      }

      errorEl.textContent = "";
      setText("salarySlipPreviewCompany", currentData.companyName);
      setText("salarySlipPreviewEmployee", currentData.employeeName);
      setText("salarySlipPreviewPeriod", currentData.period);
      setText("salarySlipPreviewBasic", formatCurrency(currentData.basic));
      setText("salarySlipPreviewHra", formatCurrency(currentData.hra));
      setText("salarySlipPreviewAllowances", formatCurrency(currentData.allowances));
      setText("salarySlipPreviewGross", formatCurrency(currentData.gross));
      setText("salarySlipPreviewDeductions", formatCurrency(currentData.deductions));
      setText("salarySlipPreviewNet", formatCurrency(currentData.net));
      previewEl.classList.remove("is-hidden");
    }

    [employeeEl, companyEl, basicEl, hraEl, allowanceEl, deductionEl].forEach(function (el) {
      el.addEventListener("input", render);
      el.addEventListener("change", render);
    });

    bindGeneratorActions("downloadSalarySlipBtn", "printSalarySlipBtn", function () {
      return currentData ? {
        title: currentData.title,
        filename: currentData.filename,
        lines: currentData.lines,
        previewHtml: previewEl.outerHTML
      } : null;
    });

    render();
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildHeaderNavigation();
    setupHeaderDropdowns();
    bindActiveNav();
    optimizePageAssets();
    enhanceFooterLinks();
    setupGlobalAdContainers();
    initGSTCalculator();
    initEMICalculator();
    initPercentageCalculator();
    initAgeCalculator();
    initSipCalculator();
    initFdCalculator();
    initLoanEligibilityCalculator();
    initSalaryCalculator();
    initIncomeTaxCalculator();
    initElectricityBillCalculator();
    initFuelCostCalculator();
    initPpfCalculator();
    initRdCalculator();
    initGratuityCalculator();
    initSimpleInterestCalculator();
    initCompoundInterestCalculator();
    initBmiCalculator();
    initDiscountCalculator();
    initBreakEvenCalculator();
    initRentReceiptGenerator();
    initGstInvoiceGenerator();
    initSalarySlipGenerator();
    setupCopyButtons();
    setupShareButtons();
  });
})();
