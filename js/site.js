// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

$(document).ready(function () {
    const anchorId = document.getElementById("AnchorId").value;
    const anchorElement = document.getElementById(anchorId);
    if (anchorElement !== null) {
        anchorElement.scrollIntoView(true);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const contactTypeRadios = document.querySelectorAll('input[name="ContactType"]');
    const productDropdownContainer = document.getElementById('product-selection-container');
    const productSelect = document.getElementById('ProductName');

    function toggleProductDropdown() {
        const selectedRadio = document.querySelector('input[name="ContactType"]:checked');
        if (selectedRadio && selectedRadio.value === 'Services') {
            productDropdownContainer.style.display = 'block';
        } else {
            productDropdownContainer.style.display = 'none';
        }
    }

    contactTypeRadios.forEach(radio => {
        radio.addEventListener('change', toggleProductDropdown);
    });

    // Initialize visibility
    toggleProductDropdown();

    // Handle pricing button clicks
    const pricingButtons = document.querySelectorAll('.select-product');
    pricingButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const productName = this.getAttribute('data-product');
            productSelect.value = productName;

            // Ensure "Beställ" is selected
            const servicesRadio = document.getElementById('radio-services');
            if (servicesRadio) {
                servicesRadio.checked = true;
                toggleProductDropdown();
            }
        });
    });
});