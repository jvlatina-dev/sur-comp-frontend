<template>
    <div class="rounded-lg bg-white p-5 select-none" style="height: 71vh;">
        <ArchiveView @new="new_real = true; cut_off_date = ''" ref="archiveView"/>
    </div>

    <HotKeysSection class="mt-5" home/>

    <transition name="slide-in">
        <ModalControl v-if="new_real" :is_visible="new_real" @close="new_real = false" :width="'w-1/3'">
            <p class="text-primary text-xl font-bold text-left">New Realization</p>
            <div class="my-5">
                <DatePickerControl label="Cut-Off Date" fieldId="cut_off_date" v-model="cut_off_date" :maxDate="today" @enter="checkCutOff" autofocus/>
            </div>

            <div class="w-full flex items-center justify-end mt-4" style="gap: 1rem;">
                <ButtonControl variant="primary" @click="checkCutOff" style="width: 7rem;" :disabled="!this.cut_off_date">Proceed</ButtonControl>
                <ButtonControl variant="secondary" @click="new_real = false" style="width: 7rem;">Cancel</ButtonControl>
            </div>
        </ModalControl>
    </transition>

    <transition name="slide-in">
        <ModalControl v-if="realized" :is_visible="realized" @close="closeRealized" :width="'w-90'" :closable="true">
            <p class="text-primary text-xl font-bold text-left">Cut-Off Date: {{ formatDate(this.cut_off_date) }}</p>
            <div class="my-5">
                <DataTableControl :columns="columns" :rows="rows" rowKey="floan_id" :pagination="false" :height="'49vh'" :isSelectionActive="false"/>
            </div>

            <div class="w-full flex items-center justify-end mt-4" style="gap: 1rem;">
                <ButtonControl variant="secondary" @click="exportExcel" style="width: 7rem;">Export</ButtonControl>
                <ButtonControl variant="primary" @click="saveLedger" style="width: 7rem;">Save</ButtonControl>
                <!-- <ButtonControl variant="primary" @click="postLedger" style="width: 7rem;">Post</ButtonControl> -->
            </div>
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
        ArchiveView
    },
    computed: {
        batchHeaders() {
            return this.$store.state.batch_headers || [];
        }
    },
    data() {
        return {
            isOverride: false,
            message_modal: false,
            new_real: false,
            realized: false,
            cut_off_date: '',
            title: '',
            msg: '',
            theme: '',
            positiveBtn: '',
            positiveClick: null,
            negativeBtn: '',
            negativeClick: null,
            modal_action: null,
            existingBatch: null,
            today: new Date().toISOString().split('T')[0],
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
        closeRealized() {
            this.message_modal = true;
            this.theme = "warning";
            this.title = "Are you sure?";
            this.positiveBtn = "Yes";
            this.negativeBtn = "No";
            this.msg = "Are you sure you want to close the realized data? This will not be saved once closed.";
        },
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
        checkCutOff() {
                const existing = this.batchHeaders.find(row => {
                const [datePart] = row.fasu_real_cutoff.split(" ");
                const [month, day, year] = datePart.split("/");
                const cutoffDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

                return cutoffDate === this.cut_off_date &&
                    row.fasu_real_status === "P";
            });



            if (existing) {
                this.theme = "warning";
                this.title = "Override Existing Batch";
                this.msg = "You already have a realization with this Cut-Off Date.\nDo you wish to override?";
                this.positiveBtn = "Yes";
                this.negativeBtn = "No";
                this.modal_action = "override";
                this.message_modal = true;
                this.existingBatch = existing;
            } else {
                console.log("No existing batch found. Proceeding with new realization.");
                this.newReal();
            }
        },
        overrideReal() {
            const rowsToOverride = this.rows.filter(row => !row.isTotalRow);

            console.log("Rows To Override:", rowsToOverride);

            this.setLoading(true);

            window.chrome.webview.postMessage({
                action: "override_surcharge",
                batchNo: this.existingBatch.fasu_real_batch,
                data: rowsToOverride
            });
        },
        newReal() {
            this.rows = [];
            this.setLoading(true);
            this.new_real = false;

            window.chrome.webview.postMessage({
                action: "get_all_records",
                cut_off_date: this.cut_off_date
            });
        },
        saveLedger() {
            const rowsToSave = this.rows.filter(row => !row.isTotalRow);

            console.log("Save Ledger Data Sent:", rowsToSave);

            this.setLoading(true);

            window.chrome.webview.postMessage({
                action: "save_surcharge",
                data: rowsToSave,
                cut_off_date: this.cut_off_date
            });
        },
        postLedger() {
            this.setLoading(true);
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
