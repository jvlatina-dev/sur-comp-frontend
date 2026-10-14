```vue
<template>
    <div class="matured-page">
        <div class="report-wrapper">
            <div class="report">

                <div class="w-full flex items-center justify-center">
                    <img src="@/assets/images/papsi_header.png" alt="Logo" class="" />
                </div>

                <!-- REPORT TITLE -->
                <div class="section-bar report-title">
                    COMPUTATION OF SURCHARGE
                    <br />
                    NOT MATURED LOAN
                </div>

                <!-- MEMBER INFORMATION -->
                <div class="member-section">
                    <div class="member-name">
                        ELLEN LYNN A VILLANUEVA
                    </div>

                    <div class="member-address">
                        B10 L9 YALE ST GOLDEN MEADOWS EXE SAN ANTONIO BIÑAN LAGUNA
                    </div>

                    <div class="member-info-grid">
                        <div class="info-cell">
                            <span class="info-label">Loan Type</span>
                            <span class="colon">:</span>
                            <span>Multi-Purpose Loan</span>
                        </div>

                        <div class="info-cell">
                            <span class="info-label">Gross Amount</span>
                            <span class="colon">:</span>
                            <span class="value">120,000.00</span>
                        </div>

                        <div class="info-cell">
                            <span class="info-label">Email</span>
                            <span class="colon">:</span>
                            <span></span>
                        </div>

                        <div class="info-cell">
                            <span class="info-label">Serial Number</span>
                            <span class="colon">:</span>
                            <span class="value-left">S00494</span>
                        </div>

                        <div class="info-cell">
                            <span class="info-label">Loan Date</span>
                            <span class="colon">:</span>
                            <span>October 11, 2019</span>
                        </div>

                        <div class="info-cell">
                            <span class="info-label">Term</span>
                            <span class="colon">:</span>
                            <span class="value">24</span>
                        </div>

                        <div class="info-cell">
                            <span class="info-label">Account Number</span>
                            <span class="colon">:</span>
                            <span class="value-left">S00494</span>
                        </div>

                        <div class="info-cell">
                            <span class="info-label">Monthly</span>
                            <span class="colon">:</span>
                            <span class="value">5,000.00</span>
                        </div>

                        <div class="info-cell">
                            <span class="info-label">PSO</span>
                            <span class="colon">:</span>
                            <span>Fort Bonifacio</span>
                        </div>

                        <div class="info-cell">
                            <span class="info-label">Bill Date</span>
                            <span class="colon">:</span>
                            <span>December 30, 2019</span>
                        </div>

                        <div class="info-cell">
                            <span class="info-label">Maturity Date</span>
                            <span class="colon">:</span>
                            <span>November 29, 2021</span>
                        </div>
                    </div>
                </div>

                <!-- LOAN DETAILS -->
                <div class="section-bar">Loan Details</div>

                <div class="loan-details">
                    <div class="amount-row">
                        <span>Gross Amount</span>
                        <span class="amount">120,000.00</span>
                    </div>

                    <div class="amount-row">
                        <span>Less: Payroll deduction (remittance)</span>
                        <span class="date-column">December 1, 2019</span>
                        <span class="date-column">February 1, 2020</span>
                        <span class="installment-count">3</span>
                        <span class="amount">15,000.00</span>
                    </div>

                    <div class="amount-row subtotal-row">
                        <span>Subtotal</span>
                        <span class="amount">105,000.00</span>
                    </div>

                    <div class="details-subheading">
                        Less: Collected payment for the amount due
                    </div>

                    <div class="amount-row indent-row">
                        <span>Regular Savings Deposit adjustments</span>
                        <span class="amount">1,000.00</span>
                    </div>

                    <div class="amount-row indent-row">
                        <span>Direct Payment</span>
                        <span class="amount">-</span>
                    </div>

                    <div class="amount-row indent-row">
                        <span>Remittance</span>
                        <span class="amount">-</span>
                    </div>

                    <div class="amount-row indent-row">
                        <span>Retirement Claims</span>
                        <span class="amount">-</span>
                        <span class="amount secondary-amount">1,000.00</span>
                    </div>

                    <div class="amount-row balance-row">
                        <span>LOAN BALANCE</span>
                        <span class="amount">104,000.00</span>
                    </div>

                    <div class="amount-row">
                        <span>Add: Amount of Surcharge</span>
                        <span class="amount">1,740.00</span>
                    </div>

                    <div class="amount-row total-balance-row">
                        <span>TOTAL OUTSTANDING LOAN BALANCE</span>
                        <span class="amount highlighted-amount">105,740.00</span>
                    </div>
                </div>

                <!-- COMPUTATION OF SURCHARGE -->
                <div class="section-bar">Computation of Surcharge</div>

                <div class="computation-section">
                    <div class="computation-heading">
                        A. Number of months of delinquency
                    </div>

                    <div class="computation-row">
                        <span class="computation-label"></span>
                        <span class="computation-value">March 31, 2020</span>
                        <span class="computation-value">December 31, 2020</span>
                        <span class="computation-result">10</span>
                    </div>

                    <div class="computation-row">
                        <span class="computation-label">Less: 4-month moratorium</span>
                        <span></span>
                        <span></span>
                        <span class="computation-result negative-value">(4)</span>
                    </div>

                    <div class="computation-row">
                        <span class="computation-label">Subtotal</span>
                        <span></span>
                        <span></span>
                        <span class="computation-result underlined">6</span>
                    </div>

                    <div class="computation-row">
                        <span class="computation-label">Multiply by the Standard Rate (SR)</span>
                        <span></span>
                        <span></span>
                        <span class="computation-result">1%</span>
                    </div>

                    <div class="computation-row">
                        <span class="computation-label">Equivalent Surcharge Rate (ESR)</span>
                        <span></span>
                        <span></span>
                        <span class="computation-result underlined">6%</span>
                    </div>

                    <div class="computation-heading second-heading">
                        B. Amount of delinquency
                    </div>

                    <div class="computation-row">
                        <span class="computation-label">Less: Collected payment for the unpaid deductions</span>
                        <span class="formula-value">5,000.00</span>
                        <span class="formula-symbol">× 6</span>
                        <span class="computation-result">30,000.00</span>
                    </div>

                    <div class="computation-row">
                        <span class="computation-label">Loan Balance</span>
                        <span></span>
                        <span></span>
                        <span class="computation-result negative-value">(1,000.00)</span>
                    </div>

                    <div class="computation-row">
                        <span class="computation-label">Multiply by Equivalent Surcharge Rate (ESR)</span>
                        <span></span>
                        <span></span>
                        <span class="computation-result underlined">29,000.00</span>
                    </div>

                    <div class="computation-row">
                        <span class="computation-label">SURCHARGE as of</span>
                        <span></span>
                        <span></span>
                        <span class="computation-result">6%</span>
                    </div>

                    <div class="computation-row">
                        <span class="computation-label">Less: Reported Surcharge</span>
                        <span></span>
                        <span></span>
                        <span class="computation-result">1,740.00</span>
                    </div>

                    <div class="computation-row">
                        <span class="computation-label">Total amount of Surcharge for application</span>
                        <span class="computation-value">December 1, 2019</span>
                        <span></span>
                        <span class="computation-result final-surcharge">459.00</span>
                    </div>
                </div>

                <!-- ADDITIONAL INFORMATION -->
                <div class="section-bar">Additional Information</div>

                <div class="additional-info">
                    <p>• 4-month moratorium April, May, November and December 2020</p>
                    <p>• Discharged 2024</p>
                    <p>• For full payment effective April 2025, PAFCPIC loan renewal</p>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import TextControl from '@/components/controls/TextControl.vue';
import ComboBoxControl from '@/components/controls/ComboBoxControl.vue';

import mixin from '@/mixins/controls.js';

export default {
    name: 'FPNotMatured',
    inject: ['setLoading'],
    mixins: [mixin],

    components: {
        ComboBoxControl,
        TextControl,
    },

    data() {
        return {
            rows: [],
            total: 0,
        };
    },

    computed: {},

    mounted() {
        if (window.chrome?.webview) {
            window.chrome.webview.addEventListener(
                'message',
                this.handleWebResponse
            );
        }

        window.addEventListener('keydown', this.handleHotkeys, true);
    },

    beforeUnmount() {
        if (window.chrome?.webview) {
            window.chrome.webview.removeEventListener(
                'message',
                this.handleWebResponse
            );
        }

        window.removeEventListener('keydown', this.handleHotkeys, true);
    },

    methods: {
        handleWebResponse(event) {
            const msg = event.data;

            if (msg?.type === 'query_results') {
                this.rows = msg.data || [];
                this.total = this.rows.length;
                this.setLoading(false);
            }
        },

        handleHotkeys(event) {
            // Add report-specific hotkeys here.
        },
    },
};
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.matured-page {
    width: 100%;
    min-height: 100%;
    padding: 12px;
    background: #f3f4f6;
    font-family: Arial, Helvetica, sans-serif;
    color: #000;
}

.report-wrapper {
    width: 100%;
    overflow-x: auto;
    background: #fff;
    border: 1px solid #d1d5db;
}

.report {
    width: 100%;
    min-width: 780px;
    padding: 0;
    background: #fff;
    font-size: 11px;
    line-height: 1.15;
}

/* HEADER */

.report-header {
    display: grid;
    grid-template-columns: 90px minmax(0, 1fr) 76px;
    align-items: center;
    min-height: 115px;
    padding: 7px 10px;
    border-bottom: 3px solid #087500;
    text-align: center;
}

.header-logo,
.header-mascot {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.seal {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 67px;
    height: 67px;
    border: 3px double #9a7910;
    border-radius: 50%;
    background: #f8edac;
    color: #075d00;
    text-align: center;
    font-weight: bold;
    transform: rotate(-5deg);
}

.seal-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 43px;
    height: 35px;
    border: 2px solid #075d00;
    border-radius: 50%;
    background: #fff;
    font-size: 12px;
}

.seal-caption {
    margin-top: 2px;
    font-size: 7px;
}

.seal-year {
    font-size: 6px;
}

.header-title h1 {
    margin: 0;
    color: #087500;
    font-size: clamp(14px, 1.65vw, 22px);
    font-weight: 900;
    line-height: 1.3;
    white-space: nowrap;
}

.office-name {
    margin: 3px 0 0;
    font-size: 12px;
    font-style: italic;
}

.header-title p:not(.office-name) {
    margin: 1px 0 0;
    font-size: 11px;
}

.mascot {
    font-size: 39px;
    line-height: 1.1;
}

.header-mascot strong {
    font-size: 11px;
    letter-spacing: 1px;
}

/* SECTION HEADERS */

.section-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 17px;
    padding: 2px 4px;
    background: #087500;
    color: #fff;
    font-size: 11px;
    font-weight: bold;
    text-align: center;
}

.report-title {
    min-height: 30px;
    font-size: 13px;
    line-height: 1.1;
}

/* MEMBER INFORMATION */

.member-section {
    padding: 5px 3px 7px;
}

.member-name,
.member-address {
    min-height: 15px;
    overflow-wrap: anywhere;
}

.member-name {
    font-size: 11px;
}

.member-address {
    margin-bottom: 7px;
}

.member-info-grid {
    display: grid;
    grid-template-columns: 1.1fr 1fr 1fr;
    grid-auto-flow: row;
    column-gap: 12px;
    row-gap: 2px;
}

.info-cell {
    display: grid;
    grid-template-columns: minmax(78px, 0.95fr) 8px minmax(0, 1.5fr);
    align-items: center;
    min-height: 13px;
    column-gap: 3px;
    white-space: nowrap;
}

.info-label {
    overflow: hidden;
    text-overflow: clip;
}

.colon {
    text-align: center;
}

.value {
    text-align: right;
    padding-right: 4px;
}

.value-left {
    padding-left: 4px;
}

/* LOAN DETAILS */

.loan-details {
    padding: 2px 3px 4px;
}

.amount-row {
    display: grid;
    grid-template-columns: minmax(220px, 1fr) 100px 100px 24px 125px;
    align-items: center;
    min-height: 13px;
    column-gap: 3px;
}

.amount-row > span:first-child {
    grid-column: 1;
}

.amount {
    grid-column: 5;
    text-align: right;
    padding: 0 5px;
    white-space: nowrap;
}

.date-column {
    text-align: center;
    white-space: nowrap;
}

.installment-count {
    text-align: center;
}

.subtotal-row .amount,
.balance-row .amount,
.total-balance-row .amount {
    border-top: 1px solid #000;
}

.details-subheading {
    min-height: 14px;
    padding-top: 2px;
}

.indent-row > span:first-child {
    padding-left: 24px;
}

.indent-row .amount {
    grid-column: 3;
}

.indent-row .secondary-amount {
    grid-column: 5;
}

.balance-row {
    min-height: 15px;
}

.balance-row > span:first-child {
    font-weight: normal;
}

.total-balance-row {
    min-height: 17px;
    font-weight: bold;
}

.highlighted-amount {
    padding: 2px 5px;
    background: #ffe878;
}

/* SURCHARGE COMPUTATION */

.computation-section {
    padding: 3px 4px 4px;
}

.computation-heading {
    min-height: 14px;
    font-weight: normal;
}

.second-heading {
    margin-top: 3px;
}

.computation-row {
    display: grid;
    grid-template-columns: minmax(220px, 1fr) 130px 130px 125px;
    align-items: center;
    min-height: 13px;
    column-gap: 4px;
}

.computation-label {
    min-width: 0;
}

.computation-value {
    text-align: center;
    white-space: nowrap;
}

.computation-result {
    min-height: 13px;
    padding: 0 5px;
    text-align: right;
    white-space: nowrap;
}

.formula-value {
    text-align: right;
    padding-right: 5px;
}

.formula-symbol {
    text-align: center;
}

.negative-value {
    color: #b00000;
}

.underlined {
    border-bottom: 1px solid #000;
}

.final-surcharge {
    border-top: 1px solid #000;
    font-weight: bold;
}

/* ADDITIONAL INFORMATION */

.additional-info {
    padding: 4px 5px 6px;
}

.additional-info p {
    margin: 2px 0;
    line-height: 1.2;
}

/* RESPONSIVE */

@media (max-width: 850px) {
    .matured-page {
        padding: 4px;
    }

    .report {
        min-width: 780px;
    }

    .report-header {
        grid-template-columns: 75px minmax(0, 1fr) 60px;
        min-height: 100px;
        padding: 6px;
    }

    .seal {
        width: 56px;
        height: 56px;
    }

    .seal-inner {
        width: 36px;
        height: 28px;
        font-size: 10px;
    }

    .mascot {
        font-size: 30px;
    }
}

@media print {
    .matured-page {
        padding: 0;
        background: #fff;
    }

    .report-wrapper {
        overflow: visible;
        border: none;
    }

    .report {
        min-width: 0;
        width: 100%;
        font-size: 9px;
    }

    .report-header {
        min-height: 95px;
    }

    .section-bar {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
    }

    .highlighted-amount {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
    }
}
</style>
```
