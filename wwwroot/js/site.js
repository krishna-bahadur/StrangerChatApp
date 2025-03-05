"use strict";

// Show Modal If user dont agree terms and conditions
if (!localStorage.getItem('ageAgrement')) {
    var agreementModal = new bootstrap.Modal(document.getElementById('ageAgreementModal'), {
        keyboard: false
    });

    agreementModal.show();
}

document.getElementById('ageConfirm').addEventListener('change', function () {
    document.getElementById('agreeBtn').disabled = !this.checked;
});

document.getElementById('agreeBtn').addEventListener('click', function () {
    localStorage.setItem('ageAgrement', true);
    var agreementModal = document.getElementById("ageAgreementModal");

    var modal = bootstrap.Modal.getInstance(agreementModal);
    modal.hide();
});