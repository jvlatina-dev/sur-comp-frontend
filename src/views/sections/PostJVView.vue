<template>
    <div class="">
        <p class="text-primary text-xl font-bold">Journal Voucher Posting</p>
        <div class="w-full flex flex-row items-center justify-between my-4"
            style="display: grid; gap: 0.75rem; grid-template-columns: repeat(6, minmax(0, 1fr));">
            <TextControl ref="jv_no" label="JV No." v-model="jv_no" fieldId="uppercase" disabled />
            <DatePickerControl label="JV Date" fieldId="jv_date" v-model="jv_date" :maxDate="today"
                @enter="generateCutOff" />
            <TextControl ref="cut_off" label="Cut-Off" v-model="cut_off" fieldId="uppercase" disabled />
            <TextControl ref="payee" label="Payee" v-model="payee" fieldId="uppercase" disabled
                style="grid-column: span 2 / span 2;" />
            <TextControl ref="tran_type" label="Transaction Type" v-model="tran_type" fieldId="uppercase" disabled />
            <TextControl ref="remarks" label="Remarks" v-model="remarks" fieldId="uppercase"
                style="grid-column: span 5 / span 5;" :maxLength="255" />
            <TextControl ref="user" label="User" v-model="user" fieldId="uppercase" disabled
                style="grid-column: span 1 / span 1;" />

        </div>

        <DataTableControl
            :columns="columns"
            :rows="rows"
            rowKey="reference_number"
            :pagination="false"
            :height="'30vh'"
        />

        <div class="w-full flex items-center justify-between mt-4">

            <div></div>

            <div class="flex flex-row items-center justify-center" style="gap: 1rem;">
                <ButtonControl variant="secondary" @click="this.$emit('close')" style="width: 7rem;">Cancel</ButtonControl>
                <ButtonControl variant="primary" @click="pin_modal = true" style="width: 7rem;">Post JV</ButtonControl>
            </div>
        </div>

        <transition name="slide-in">
            <MessageBoxControl v-if="message_modal" :is_visible="message_modal" :positiveButton="positiveBtn"
                @positiveClick="positiveClick()" :negativeButton="negativeBtn" @negativeClick="negativeClick()"
                :theme="theme" :title="title" :message="msg" style="z-index: 99999999999999 !important;">
            </MessageBoxControl>
        </transition>

        <transition name="slide-in">
            <ModalControl v-if="signatories_modal" :is_visible="signatories_modal" :closable="false"
                :width="'w-1/2'">
                <SignatoriesView @print="printJV"/>
            </ModalControl>
        </transition>

        <transition name="slide-in">
            <ModalControl v-if="pin_modal" :is_visible="pin_modal" @close="pin_modal = false" :width="'w-1/4'">
                <PINValidationView @validated="postLedger"/>
            </ModalControl>
        </transition>

    </div>
</template>


<script>
import ButtonControl from '@/components/controls/ButtonControl.vue';
import ModalControl from '@/components/controls/ModalControl.vue';
import DataTableControl from '@/components/controls/DataTableControl.vue';
import TextControl from '@/components/controls/TextControl.vue';
import ComboBoxControl from '@/components/controls/ComboBoxControl.vue';
import MessageBoxControl from '@/components/controls/MessageBoxControl.vue';
import DatePickerControl from '@/components/controls/DatePickerControl.vue';
import SignatoriesView from './SignatoriesView.vue';
import PINValidationView from '@/components/controls/PINValidationView.vue';


import mixin from "@/mixins/controls.js";

export default {
    name: 'Archive',
    inject: ['setLoading'],
    mixins: [mixin],
    components: {
        ButtonControl,
        ModalControl,
        DataTableControl,
        ComboBoxControl,
        TextControl,
        MessageBoxControl,
        DatePickerControl,
        SignatoriesView,
        PINValidationView
    },
    watch: {
        jv_date(newValue) {
            this.updateCutOff(newValue);
        }
    },
    data() {
        return {
            pin_modal: false,
            columns: [
                { label: 'Act. Code', field: 'act_code', align: 'center', formatAmount: false },
                { label: 'RC Code', field: 'rc_code', align: 'center', formatAmount: false },
                { label: 'SL Code', field: 'sl_code', align: 'center', formatAmount: false },
                { label: 'Particular', field: 'particular', formatAmount: false },
                { label: 'Debit', field: 'debit', align: 'right' },
                { label: 'Credit', field: 'credit', align: 'right' },
            ],
            rows: [],
            today: new Date().toISOString().split('T')[0],
            jv_date: new Date().toISOString().split('T')[0],
            jv_no: null,
            cut_off: null,
            tran_type: 'JV',
            payee: null,
            remarks: 'TO RECORD REALIZATION OF A/P SURCHARGE TO OTHER INCOME-SURCHARGE FOR THE MONTH OF ',
            user: this.$store.state.system_info?.username || '',
            message_modal: false,
            signatories_modal: false,
            action: null,

        };
    },
    computed: {

    },
    mounted() {
        this.updateCutOff(this.jv_date);
        this.updatePayee();
        this.getEntries();

        if (window.chrome?.webview) {
            window.chrome.webview.addEventListener("message", this.handleWebResponse);
        }

        window.addEventListener("keydown", this.handleHotkeys, true);
    },
    beforeUnmount() {
        if (window.chrome?.webview) {
            window.chrome.webview.removeEventListener("message", this.handleWebResponse);
        }

        window.removeEventListener("keydown", this.handleHotkeys, true);
    },
    methods: {
        printJV(signatories) {
            this.setLoading(true);
            const selectedJV =
                this.$store.state.viewed_records.selected_jv || [];

            if (selectedJV.length === 0) {
                this.msg = "No records selected for Journal Voucher printing.";
                this.title = "Print Journal Voucher";
                this.theme = "error";
                this.positiveBtn = "OK";
                this.negativeBtn = "";
                this.message_modal = true;
                return;
            }

            const totalAmount = selectedJV.reduce((sum, item) => {
                return sum + Number(item.amount || 0);
            }, 0);

            const debitRow = this.rows[0] || {};
            const creditRow = this.rows[1] || {};

            window.chrome.webview.postMessage({
                action: "print_jv",

                jv_number: this.jv_no,
                jv_date: this.jv_date,
                payee_name: this.payee,
                jv_remarks: this.remarks,

                cash_actcode: debitRow.act_code || "",
                cash_in: debitRow.particular || "",

                ecollect_actcode: creditRow.act_code || "",
                ecollect: creditRow.particular || "",

                total_amount: totalAmount,

                prepared_by: signatories.prepared_by || "",
                prepared_by_position: signatories.prepared_by_position || "",

                checked_by: signatories.checked_by || "",
                checked_by_position: signatories.checked_by_position || "",

                approved_by: signatories.approved_by || "",
                approved_by_position: signatories.approved_by_position || ""
            });
        },
        getEntries() {
            window.chrome.webview.postMessage({
                action: "get_entries",
            });
        },
        updatePayee() {
            const records = (this.$store.state.viewed_records.selected_jv || []);

            if (records.length === 0) {
                this.payee = "";
                return;
            }

            const firstName = records[0].fname || "";

            if (records.length === 1) {
                this.payee = firstName;
            } else {
                const otherText = records.length === 2 ? "OTHER" : "OTHERS";
                this.payee = `${firstName} AND ${records.length - 1} ${otherText}`;
            }
        },
        updateCutOff(date) {
            if (!date) {
                this.cut_off = "";
                return;
            }

            // Handles both "YYYY-MM-DD" and "MM/DD/YYYY"
            let year, month;

            if (date.includes("-")) {
                // YYYY-MM-DD
                [year, month] = date.split("-");
            } else if (date.includes("/")) {
                // MM/DD/YYYY
                const parts = date.split("/");
                month = parts[0].padStart(2, "0");
                year = parts[2];
            }

            this.cut_off = `${year}${month}`;
        },
        generateCutOff() {
            this.updateCutOff(this.jv_date);
        },
        positiveClick() {
            if (this.action === "post_jv") {
                this.message_modal = false;
                this.signatories_modal = true;
                
            } else if (this.theme === "error" && this.action === "print_jv") {
                this.message_modal = false;
                this.signatories_modal = false;
                this.$emit('close');
            } else if (this.action === "print_jv") {
                this.message_modal = false;
                this.$emit('success');
            } else {
                this.message_modal = false;
            } 

            this.action = null;
        },
        negativeClick() {
            this.message_modal = false;
        },
        postLedger() {
            this.pin_modal = false;
            this.setLoading(true);
            const selectedJV = this.$store.state.viewed_records.selected_jv || [];

            if (selectedJV.length === 0) {
                this.msg = "No records selected for Journal Voucher posting.";
                this.title = "Post Journal Voucher";
                this.theme = "error";
                this.positiveBtn = "OK";
                this.negativeBtn = "";
                this.message_modal = true;
                return;
            }

            if (!this.jv_date) {
                this.msg = "JV Date is required.";
                this.title = "Post Journal Voucher";
                this.theme = "error";
                this.positiveBtn = "OK";
                this.negativeBtn = "";
                this.message_modal = true;
                return;
            }

            if (!this.cut_off) {
                this.msg = "Cut-Off is required.";
                this.title = "Post Journal Voucher";
                this.theme = "error";
                this.positiveBtn = "OK";
                this.negativeBtn = "";
                this.message_modal = true;
                return;
            }

            if (!this.remarks) {
                this.msg = "Remarks is required.";
                this.title = "Post Journal Voucher";
                this.theme = "error";
                this.positiveBtn = "OK";
                this.negativeBtn = "";
                this.message_modal = true;
                return;
            }

            const firstRecord = selectedJV[0];

            const memberKey = firstRecord.fkey || "";
            const batchNo = firstRecord.fasu_real_batch || "";
            const selectedRecordKeys = selectedJV
                .map(item => item.fpk)
                .filter(key => key);

            if (!memberKey) {
                this.msg = "Member key (fkey) is missing from the selected record.";
                this.title = "Post Journal Voucher";
                this.theme = "error";
                this.positiveBtn = "OK";
                this.negativeBtn = "";
                this.message_modal = true;
                return;
            }

            if (!batchNo) {
                this.msg = "Realization batch number is missing.";
                this.title = "Post Journal Voucher";
                this.theme = "error";
                this.positiveBtn = "OK";
                this.negativeBtn = "";
                this.message_modal = true;
                return;
            }

            if (selectedRecordKeys.length !== selectedJV.length) {
                this.msg = "One or more selected records are missing their record key.";
                this.title = "Post Journal Voucher";
                this.theme = "error";
                this.positiveBtn = "OK";
                this.negativeBtn = "";
                this.message_modal = true;
                return;
            }

            window.chrome.webview.postMessage({
                action: "post_jv",

                header: {
                    payee: this.payee,
                    remarks: this.remarks,
                    cut_off: this.cut_off,
                    jv_date: this.jv_date,
                    tran_type: this.tran_type,
                    user: this.user,
                    fkey: memberKey,
                    batch_no: batchNo,
                    selected_record_keys: selectedRecordKeys
                },

                // MJV_DL
                details: [
                    {
                        act_code: this.rows[0].act_code,
                        particular: this.rows[0].particular,
                        debit: Number(this.rows[0].debit || 0),
                        credit: Number(this.rows[0].credit || 0)
                    },
                    {
                        act_code: this.rows[1].act_code,
                        particular: this.rows[1].particular,
                        debit: Number(this.rows[1].debit || 0),
                        credit: Number(this.rows[1].credit || 0)
                    }
                ],

                // MJV_DLN
                dlnDetails: [
                    {
                        act_code: this.rows[0].act_code,
                        act_desc: this.rows[0].particular,
                        debit: Number(this.rows[0].debit || 0),
                        credit: Number(this.rows[0].credit || 0)
                    },
                    {
                        act_code: this.rows[1].act_code,
                        act_desc: this.rows[1].particular,
                        debit: Number(this.rows[1].debit || 0),
                        credit: Number(this.rows[1].credit || 0)
                    }
                ],

                // Needed for MJV_RECD and succeeding tables
                selectedRecords: selectedJV
            });
        },
        handleWebResponse(event) {
            const msg = event.data;

            if (msg.type === "get_entries") {
                const selectedJV = this.$store.state.viewed_records.selected_jv || [];

                if (selectedJV.length === 0) {
                    this.rows = [];
                    this.rows_dln = [];
                    return;
                }

                // ============================================================
                // TOTAL AMOUNT
                // ============================================================

                const totalAmount = selectedJV.reduce((sum, item) => {
                    return sum + Number(item.amount || 0);
                }, 0);


                // ============================================================
                // DL - SUMMARIZED
                // ============================================================

                this.rows = [
                    {
                        act_code: msg.data[0].act_code,
                        rc_code: "",
                        particular: msg.data[0].particular,
                        debit: totalAmount,
                        credit: 0,
                    },
                    {
                        act_code: msg.data[1].act_code,
                        rc_code: "15-12-0200",
                        particular: msg.data[1].particular,
                        debit: 0,
                        credit: totalAmount,
                    },
                    {
                        isTotalRow: true,
                        act_code: "",
                        rc_code: "",
                        particular: "TOTAL",
                        debit: totalAmount,
                        credit: totalAmount,
                    }
                ];


            }


            if (msg.type === "post_jv") {
                this.setLoading(false);
                if (msg.success) {

                    this.jv_no = msg.fj_nr;

                    this.signatories_modal = false;

                    this.msg = `Journal Voucher ${msg.fj_nr} was successfully posted.`;
                    this.title = "Success";
                    this.theme = "success";
                    this.positiveBtn = "Print";
                    this.negativeBtn = "";
                    this.message_modal = true;
                    this.action = "post_jv";

                } else {

                    this.msg = msg.message || "Failed to post Journal Voucher.";
                    this.title = "Post Journal Voucher";
                    this.theme = "error";
                    this.positiveBtn = "OK";
                    this.negativeBtn = "";
                    this.message_modal = true;

                }
            }

            if (msg.type === "print_jv") {

                this.setLoading(false);
                this.action = "print_jv";

                if (msg.success) {

                    this.signatories_modal = false;

                    this.msg = "Journal Voucher was successfully printed.";
                    this.title = "Print Journal Voucher";
                    this.theme = "success";
                    this.positiveBtn = "OK";
                    this.negativeBtn = "";
                    this.message_modal = true;


                } else {

                    this.msg = msg.message || "Failed to print Journal Voucher.";
                    this.title = "Print Journal Voucher";
                    this.theme = "error";
                    this.positiveBtn = "OK";
                    this.negativeBtn = "";
                    this.message_modal = true;

                }
            }

        },
        handleHotkeys(event) {


        },
    }
};
</script>

<style scoped></style>
