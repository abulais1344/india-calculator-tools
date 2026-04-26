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

  function bindActiveNav() {
    var current = window.location.pathname.split("/").pop() || "index.html";
    var links = document.querySelectorAll(".site-nav a");
    links.forEach(function (link) {
      var href = link.getAttribute("href");
      if (href === current || (current === "" && href === "index.html")) {
        link.classList.add("active");
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

  function setupAfterResultAds() {
    var copyButtons = document.querySelectorAll(".copy-btn");
    copyButtons.forEach(function (button) {
      var next = button.nextElementSibling;
      if (next && next.classList && next.classList.contains("ad-container")) {
        return;
      }

      var ad = document.createElement("div");
      ad.className = "ad-container";
      ad.textContent = "Ad Space";
      ad.setAttribute("aria-label", "Advertisement placeholder");
      ad.style.marginTop = "14px";
      button.insertAdjacentElement("afterend", ad);
    });
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
  function setupCopyButtons() {
    var copyButtons = document.querySelectorAll(".copy-btn");
    copyButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var textToCopy = "";
        var buttonId = btn.id;

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
        }

        if (textToCopy && navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textToCopy).then(function () {
            var originalText = btn.textContent;
            btn.textContent = "✓ Copied!";
            setTimeout(function () {
              btn.textContent = originalText;
            }, 2000);
          }).catch(function (err) {
            console.error("Failed to copy:", err);
          });
        } else if (textToCopy) {
          // Fallback for older browsers
          var textarea = document.createElement("textarea");
          textarea.value = textToCopy;
          document.body.appendChild(textarea);
          textarea.select();
          try {
            document.execCommand("copy");
            var originalText = btn.textContent;
            btn.textContent = "✓ Copied!";
            setTimeout(function () {
              btn.textContent = originalText;
            }, 2000);
          } catch (err) {
            console.error("Failed to copy:", err);
          }
          document.body.removeChild(textarea);
        }
      });
    });
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

  document.addEventListener("DOMContentLoaded", function () {
    bindActiveNav();
    optimizePageAssets();
    setupAfterResultAds();
    initGSTCalculator();
    initEMICalculator();
    initPercentageCalculator();
    initAgeCalculator();
    initSipCalculator();
    initFdCalculator();
    initLoanEligibilityCalculator();
    initSalaryCalculator();
    initIncomeTaxCalculator();
    setupCopyButtons();
  });
})();
