<template>
    <div class="rounded-lg bg-white p-5 select-none" style="height: 71vh;">
        <ArchiveView @new="new_batch = true;" ref="archiveView"/>
    </div>

    <HotKeysSection class="mt-5" home/>

    <transition name="slide-in">
        <ModalControl v-if="new_batch" :is_visible="new_batch" @close="new_batch = false" :width="'w-4/5'">
            <CreateNewBatchView @close="new_batch = false;"/>
        </ModalControl>
    </transition>

    <transition name="slide-in">
        <MessageBoxControl v-if="message_modal" :is_visible="message_modal" :positiveButton="positiveBtn"
            @positiveClick="positiveClickMethod()" :negativeButton="negativeBtn" @negativeClick="negativeClickMethod()" :theme="theme"
            :title="title" :message="msg" style="z-index: 99999999999999 !important;">
        </MessageBoxControl>
    </transition>


</template>



<script>
import MessageBoxControl from '@/components/controls/MessageBoxControl.vue';
import ModalControl from '@/components/controls/ModalControl.vue';
import DataTableControl from '@/components/controls/DataTableControl.vue';
import DatePickerControl from '@/components/controls/DatePickerControl.vue';
import ButtonControl from '@/components/controls/ButtonControl.vue';
import HotKeysSection from '@/components/sections/HotKeysSection.vue';
import ArchiveView from './sections/ArchiveView.vue';
import CreateNewBatchView from './sections/CreateNewBatchView.vue';

export default {
    name: 'Dashboard',
    inject: ['setLoading'],
    components: {
        MessageBoxControl,
        HotKeysSection,
        ButtonControl,
        DataTableControl,
        ModalControl,
        DatePickerControl,
        ArchiveView,
        CreateNewBatchView
    },
    computed: {
        batchHeaders() {
            return this.$store.state.batch_headers || [];
        }
    },
    data() {
        return {
            message_modal: false,
            new_batch: false,
            title: '',
            msg: '',
            theme: '',
            positiveBtn: '',
            positiveClick: null,
            negativeBtn: '',
            negativeClick: null,
            modal_action: null,
            columns: [
                { label: 'Member Key', field: 'fkey', align: 'center', formatAmount: false },
                { label: 'Acct. No.', field: 'facct_no', align: 'center', formatAmount: false },
                { label: 'Name', field: 'fname', formatAmount: false },
                { label: 'DedCode', field: 'fdedcode', align: 'center', formatAmount: false },
                { label: 'Date', field: 'fdate', align: 'center', formatAmount: false },
                { label: 'Amount', field: 'amount', align: 'right' },
                { label: 'Reference', field: 'freference', align: 'left', formatAmount: false },
                { label: 'Loan ID', field: 'floan_id', align: 'center', formatAmount: false },
                { label: 'BR', field: 'fbr_code', align: 'center', formatAmount: false },
                { label: 'Terms', field: 'fterms', align: 'center', formatAmount: false },
                { label: 'Balance', field: 'balance', align: 'right' },
            ],
            rows: []
        };
    },
    mounted() {
        if (window.chrome?.webview) {
            window.chrome.webview.addEventListener("message", this.handleWebResponse);
        }
        window.addEventListener("keydown", this.handleHotkeys, true);
    },
    beforeUnmount() {
        if (window.chrome?.webview) {
            window.chrome.webview.removeEventListener('message', this.handleWebResponse);
        }

        window.removeEventListener("keydown", this.handleHotkeys, true);
    },
    methods: {
        positiveClickMethod() {
            if (this.modal_action === 'saved') {
                this.$refs.archiveView?.getHeaders();
                this.realized = false;
            } else if (this.modal_action === 'override') {
                this.isOverride = true;
                this.realized = false;
                this.newReal();
            }

            this.realized = false;
            this.message_modal = false;
            this.modal_action = null;
        },
        negativeClickMethod() {
            this.message_modal = false;
            this.modal_action = null;
        },
        exportExcel() {
            this.setLoading(true);

            window.chrome.webview.postMessage({
                action: "export_excel",
                data: this.rows,
                cut_off_date: this.cut_off_date
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
        handleWebResponse(event) {
            const msg = event.data;
            console.log("WebView Message Received:", msg);

            if (msg.type === "get_records") {
                const records = msg.data || [];

                const totalAmount = records.reduce(
                    (sum, row) => sum + (Number(row.amount) || 0),
                    0
                );

                const totalBalance = records.reduce(
                    (sum, row) => sum + (Number(row.balance) || 0),
                    0
                );

                this.rows = [
                    ...records,
                    {
                        isTotalRow: true,
                        fname: "TOTAL",
                        amount: totalAmount,
                        balance: totalBalance
                    }
                ];

                if (this.isOverride) {
                    this.isOverride = false;
                    this.overrideReal();
                    return;
                }

                this.realized = true;
                this.setLoading(false);
            }

            if (msg.type === "get_records_error") {
                this.message_modal = true;
                this.msg = "An error ocurred while fetching the data. Please try again."
                this.setLoading(false);
            }

            if (msg.type === "save_surcharge") {
                    this.setLoading(false);
                    this.realized = false;
                    if (msg.success) {

                        this.theme = "success";
                        this.title = "Save Successful";
                        this.positiveBtn = "Okay";
                        this.negativeBtn = null;
                        this.modal_action = 'saved';

                        this.msg =
                            `Realization has been successfully saved.\nBatch No: ${msg.batchNo}`;

                        this.message_modal = true;
                    }
                    else {

                        this.theme = "error";
                        this.title = "Save Failed";
                        this.positiveBtn = "Okay";

                        this.msg = msg.message;

                        this.message_modal = true;
                    }
            }

            if (msg.type === "excel_exported") {
                this.message_modal = true;
                this.setLoading(false);
                this.theme = "success";
                this.positiveBtn = 'Okay';
                this.title = "Export Successful";
                this.msg = `File saved to Downloads Folder.`;
            }

            if (msg.type === "override_surcharge") {
                this.setLoading(false);

                if (msg.success) {

                    this.realized = false;

                    this.theme = "success";
                    this.title = "Override Successful";
                    this.positiveBtn = "Okay";
                    this.negativeBtn = null;

                    this.modal_action = "saved";

                    this.msg =
                        `Realization has been successfully overridden.\nBatch No: ${msg.batchNo}`;

                    this.message_modal = true;
                }
                else {

                    this.theme = "error";
                    this.title = "Override Failed";
                    this.positiveBtn = "Okay";
                    this.negativeBtn = null;

                    this.msg = msg.message;

                    this.message_modal = true;
                }
            }
        },
        handleHotkeys(event) {

            
        },
    }
};
</script>

<style scoped>
.cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

.cards-row {
    display: flex;
    justify-content: center;
    /* centers the 2 cards */
    gap: 16px;
}
</style>
