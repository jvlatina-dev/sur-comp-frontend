<template>
    <div class="">
        <div class="flex flex-row items-center justify-between mb-5">
            <p class="text-primary text-xl font-bold text-left">Add Entry</p>
        </div>


        <div class="flex flex-wrap items-center justify-start mb-4" style="gap: 1rem 2rem;">
            <!-- Step 1: Search User -->
            <div class="flex flex-row items-center text-sm" :class="['search_user', 'select_loan', 'select_template'].includes(tab)
                ? 'text-primary font-bold'
                : 'text-gray-400'">
                <div class="w-5 h-5 rounded-full p-1 flex items-center justify-center mr-2 text-white flex-shrink-0"
                    :class="['search_user', 'select_loan', 'select_template'].includes(tab)
                        ? 'bg-primary'
                        : 'bg-gray-400'">
                    1
                </div>
                <span>Search User</span>
            </div>

            <!-- Step 2: Select Loan -->
            <div class="flex flex-row items-center text-sm" :class="['select_loan', 'select_template'].includes(tab)
                ? 'text-primary font-bold'
                : 'text-gray-400'">
                <div class="w-5 h-5 rounded-full p-1 flex items-center justify-center mr-2 text-white flex-shrink-0"
                    :class="['select_loan', 'select_template'].includes(tab)
                        ? 'bg-primary'
                        : 'bg-gray-400'">
                    2
                </div>
                <span>Select Loan</span>
            </div>

            <!-- Step 3: Select Template -->
            <div class="flex flex-row items-center text-sm" :class="tab === 'select_template'
                ? 'text-primary font-bold'
                : 'text-gray-400'">
                <div class="w-5 h-5 rounded-full p-1 flex items-center justify-center mr-2 text-white flex-shrink-0"
                    :class="tab === 'select_template'
                        ? 'bg-primary'
                        : 'bg-gray-400'">
                    3
                </div>
                <span>Select Template</span>
            </div>
        </div>

        <div v-if="tab === 'search_user'">
            <div class="w-full flex flex-row items-center justify-center mb-4" style="gap: 1rem;">
                <TextControl ref="searchUserInput" label="Search User" v-model="search"
                    :placeholder="'Search by Account/Serial Number or Member Name'" fieldId="uppercase"
                    @enter="triggerSearch" />
                <div class="flex flex-row items-center justify-center" style="gap: 1rem;">
                    <ButtonControl variant="primary" style="width: 9rem;" @click="triggerSearch">Search</ButtonControl>
                    <ButtonControl variant="secondary" style="width: 9rem;" @click="clearSearch">Clear</ButtonControl>
                </div>
            </div>

            <DataTableControl :columns="columns" :rows="rows" rowKey="reference_number" :pagination="false"
                :highlight-selected-row="true" :height="'50vh'" @row-enter="selectMember" @row-click="selectMember" />

        </div>

        <div v-if="tab === 'select_loan'">
            <div class="flex flex-row items-center justify-between mb-4">
                <div class="flex flex-col items-start justify-start">
                    <p class="text-xxs text-primary mb-1 font-bold">Member's Name</p>
                    <p class="text-gray-500 text-sm font-bold">{{ this.selected_member.fname }}</p>
                </div>

                <div class="flex flex-row" style="gap: 2rem;">
                    <div class="flex flex-col items-end justify-end">
                        <p class="text-xxs text-primary mb-1 font-bold">Account No.</p>
                        <p class="text-gray-500 text-sm font-bold">{{ this.selected_member.fmemnr }}</p>
                    </div>

                    <div class="flex flex-col items-end justify-end">
                        <p class="text-xxs text-primary mb-1 font-bold">Serial No.</p>
                        <p class="text-gray-500 text-sm font-bold">{{ this.selected_member.fserial }}</p>
                    </div>
                </div>
            </div>

            <DataTableControl :columns="loan_columns" :rows="loan_rows" rowKey="reference_number" :pagination="false"
                :height="'50vh'" @row-enter="selectLoan" @row-click="selectLoan" :highlight-selected-row="true"/>

        </div>

        <div v-if="tab === 'select_template'">
            <div class="w-full border-2 rounded overflow-y-auto overflow-x-auto" style="max-height: 60vh;">
                <FPMaturedView v-if="selected_template === 'fp_matured'" />
                <FPNotMaturedView v-if="selected_template === 'fp_not_matured'" />
            </div>

            <div class="w-full flex flex-row items-center justify-between mt-4">
                <ComboBoxControl label="Select Template" v-model="selected_template" :options="template_options"
                    fieldId="template" style="width: 30rem;" />
                <div class="w-full flex items-center" style="gap: 1rem; width: 20rem;">
                    <ButtonControl variant="secondary">Print Only</ButtonControl>
                    <ButtonControl variant="primary">Save and Close</ButtonControl>
                </div>
            </div>
        </div>

        <transition name="slide-in">
            <MessageBoxControl v-if="message_modal" :is_visible="message_modal" :positiveButton="positiveBtn"
                @positiveClick="positiveClick()" :negativeButton="negativeBtn" @negativeClick="negativeClick()"
                :theme="theme" :title="title" :message="msg" style="z-index: 99999999999999 !important;">
            </MessageBoxControl>
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

import FPMaturedView from '../templates/FPMaturedView.vue';
import FPNotMaturedView from '../templates/FPNotMaturedView.vue';

import mixin from "@/mixins/controls.js";

export default {
    name: 'AddEntry',
    inject: ['setLoading'],
    mixins: [mixin],
    components: {
        ButtonControl,
        ModalControl,
        DataTableControl,
        ComboBoxControl,
        TextControl,
        MessageBoxControl,

        FPMaturedView,
        FPNotMaturedView

    },

    data() {
        return {
            pin_modal: false,
            tab: 'search_user',
            selected_member: null,
            selected_loan: null,
            search: '',
            columns: [
                { label: '#', field: 'act_code', align: 'center', formatAmount: false, width: '90px' },
                { label: "Member's Name", field: 'fname', align: 'left', formatAmount: false },
                { label: 'Account No.', field: 'fmemnr', align: 'center', formatAmount: false, width: '150px' },
                { label: 'Serial No.', field: 'fserial', align: 'center', formatAmount: false, width: '150px' },
            ],
            loan_columns: [
                { label: 'Loan ID', field: 'loan_id', align: 'center', formatAmount: false },
                { label: "Dedcode", field: 'fdedcode', align: 'center', formatAmount: false },
                { label: 'Gross Amount', field: 'fgross', align: 'right', formatAmount: true },
                { label: 'Terms', field: 'terms', align: 'center', formatAmount: false },
                { label: 'Loan Balance', field: 'loan_balance', align: 'right', formatAmount: true },
                { label: 'Loan Date', field: 'loan_date', align: 'center', formatAmount: false },
            ],
            rows: [],
            loan_rows: [],
            today: new Date().toISOString().split('T')[0],
            message_modal: false,
            action: null,
            template_options: [
                { label: 'Full Payment - Matured Loan', value: 'fp_matured' },
                { label: 'Full Payment - Not Matured Loan', value: 'fp_not_matured' },
            ],
            selected_template: 'fp_matured',

        };
    },
    computed: {

    },
    mounted() {
        this.$nextTick(() => {
            this.$refs.searchUserInput?.focus();
        });

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
        clearSearch() {
            this.search = '';
            this.rows = [];
        },
        triggerSearch() {
            this.$refs.searchUserInput?.blur();

            if (!this.search) return;

            this.setLoading(true);
            window.chrome.webview.postMessage({
                action: 'search_member_info',
                query: this.search,
            });
        },
        formatDate(date) {
            if (!date) return '';

            const d = new Date(date);

            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const year = d.getFullYear();

            return `${month}/${day}/${year}`;
        },
        selectMember(row) {
            this.selected_member = { ...row };
            this.$store.state.selected_member = this.selected_member;
            this.getLoans();
        },
        selectLoan(row) {
            this.selected_loan = { ...row };
            this.$store.state.selected_loan = this.selected_loan;
            this.tab = 'select_template';
        },
        getLoans() {
            if (!this.selected_member) return;

            this.setLoading(true);
            window.chrome.webview.postMessage({
                action: "get_loans",
                fkey: this.selected_member.fkey
            });
        },
        handleWebResponse(event) {
            const msg = event.data;

            if (msg?.type === "query_results") {
                this.rows = msg.data || [];
                this.total = msg.data?.length || 0;
                this.setLoading(false);
            }

            if (msg?.type === "get_loans") {
                if (!msg.success) {
                    console.error("Failed to retrieve loans:", msg.message);
                    return;
                }

                this.setLoading(false);
                this.tab = 'select_loan';
                this.loan_rows = (msg.data || []).map(loan => ({
                    ...loan,
                    loan_date: this.formatDate(loan.loan_date)
                }));

                return;
            }
        },
        handleHotkeys(event) {


        },
    }
};
</script>

<style scoped></style>
