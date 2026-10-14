<template>
    <div class="">
        <!-- <p class="text-primary text-lg font-bold">Batch List</p> -->
        <div class="w-full flex flex-row items-center justify-between mb-4">
            <div class="flex flex-row items-center justify-start w-full" style="gap: 0.5rem;">
                <TextControl ref="searchInput" label="Search by Batch No." v-model="search" fieldId="uppercase"
                    @enter="applySearch" style="width: 12rem;" />
                <ComboBoxControl label="Status" fieldId="status" v-model="status" :options="statusOptions"
                    style="width: 10rem;" />
            </div>
            <ButtonControl variant="primary" style="width: 10rem;" @click="$emit('new')">New</ButtonControl>
        </div>

        <DataTableControl :columns="columns" :rows="filteredRows" rowKey="reference_number" :pagination="false"
            :height="'49vh'">
            <template #cell:fasu_real_status="{ row }">
                <span class="px-2 py-1 rounded-full text-xs font-semibold" :class="{
                    'bg-gray-100 text-gray-600': row.fasu_real_status === 'P',
                    'bg-yellow-lightest text-yellow-darker': row.fasu_real_status === 'F',
                    'bg-green-lightest text-green-darker': row.fasu_real_status === 'D'
                }">
                    {{ row.fasu_real_status === 'P'
                        ? 'Pending'
                        : row.fasu_real_status === 'F'
                            ? 'For Posting'
                            : row.fasu_real_status === 'D'
                                ? 'Posted'
                                : row.fasu_real_status }}
                </span>
            </template>

            <template #cell:action="{ row }">
                <div class="flex justify-center" style="gap: 0.5rem;">
                    <button @click="viewBatch(row)" class="toggle-btn" title="View Records" >
                        <img :src="getIcon('view')">
                    </button>

                    <button @click="approveBatch(row)" class="toggle-btn" title="Approve Records" :disabled="isApproveDisabled(row)" :class="{ 'opacity-25': isApproveDisabled(row) }">
                        <img :src="getIcon('approve')">
                    </button>

                    <button @click="postBatch(row)" class="toggle-btn" title="Post JV" :disabled="isPostDisabled(row)" :class="{ 'opacity-25': isPostDisabled(row) }">
                        <img :src="getIcon('post')">
                    </button>
                </div>
            </template>
        </DataTableControl>


        <transition name="slide-in">
            <ModalControl v-if="batch_ledger" :is_visible="batch_ledger" @close="handleBackToBatchReferences"
                :width="'w-90'" :closable="true">
                    <ViewBatchListView v-if="view_action == 'view'"/>
                    <ApproveBatchListView v-if="view_action == 'approve'" @refresh="refreshRecords" @success="getHeaders"/>
                    <PostBatchListView v-if="view_action == 'post'" @success="successPost" @error="handlePostError"/>
            </ModalControl>
        </transition>

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
import HotKeysSection from '@/components/sections/HotKeysSection.vue';

import ViewBatchListView from './ViewBatchListView.vue';
import ApproveBatchListView from './ApproveBatchListView.vue';
import PostBatchListView from './PostBatchListView.vue';

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
        HotKeysSection,

        ViewBatchListView,
        ApproveBatchListView,
        PostBatchListView
    },
    watch: {
        search(newValue) {
            if (newValue.trim() === "") {
                this.appliedSearch = "";
            }
        }
    },
    data() {
        return {
            search: '',
            appliedSearch: "",
            status: 'all',
            view_action: null,
            columns: [
                { label: 'Batch No.', field: 'fasu_real_batch', align: 'center' },
                { label: 'Date', field: 'fasu_real_cutoff', align: 'center' },
                { label: 'Total No.', field: 'fasu_real_rec', align: 'center', formatAmount: false },
                { label: 'Total Amount', field: 'fasu_real_amt', align: 'right' },
                { label: 'JV No.', field: 'fjv_no', align: 'center', align: 'center', formatAmount: false },
                { label: 'JV Date', field: 'fjv_date', align: 'center', align: 'center', formatAmount: false },
                { label: 'Status', field: 'fasu_real_status', align: 'center', align: 'center', formatAmount: false },
                { label: 'Action', field: 'action', align: 'center', formatAmount: false },
            ],
            rows: [],
            statusOptions: [
                { value: 'all', label: 'ALL' },
                { value: 'posted', label: 'POSTED' },
                { value: 'approval', label: 'FOR POSTING' },
                { value: 'pending', label: 'PENDING' }
            ],
            message_modal: false,
            title: '',
            msg: '',
            theme: '',
            positiveBtn: '',
            negativeBtn: '',
            selected_batch: null,
            batch_ledger: false
        };
    },
    computed: {
        filteredRows() {
            const keyword = this.appliedSearch.toLowerCase();

            return this.rows.filter(row => {
                const searchMatch =
                    !keyword ||
                    String(row.fasu_real_batch ?? "")
                        .toLowerCase()
                        .includes(keyword);

                let statusMatch = true;

                if (this.status === "posted") {
                    statusMatch = row.fasu_real_status === "D";
                } else if (this.status === "approval") {
                    statusMatch = row.fasu_real_status === "F";
                } else if (this.status === "pending") {
                    statusMatch = row.fasu_real_status === "P";
                }

                return searchMatch && statusMatch;
            });
        }
    },
    mounted() {
        if (window.chrome?.webview) {
            window.chrome.webview.addEventListener("message", this.handleWebResponse);
        }

        window.addEventListener("keydown", this.handleHotkeys, true);

        this.getHeaders();
    },
    beforeUnmount() {
        if (window.chrome?.webview) {
            window.chrome.webview.removeEventListener("message", this.handleWebResponse);
        }

        window.removeEventListener("keydown", this.handleHotkeys, true);
    },
    methods: {
        isApproveDisabled(row) {
            return row?.fasu_real_status === "F" ||
                row?.fasu_real_status === "D";
        },

        isPostDisabled(row) {
            return row?.fasu_real_status === "P" ||
                row?.fasu_real_status === "D";
        },
        handlePostError() {
            this.batch_ledger = false;
            this.selected_batch = null;
            this.view_action = null;
            this.getHeaders();
        },
        successPost() {
            this.batch_ledger = false;
            this.selected_batch = null;
            this.view_action = null;
            this.getHeaders();
        },
        positiveClick() {
            this.message_modal = false;
        },
        negativeClick() {
            this.message_modal = false;
        },
        getStatusClass(status) {
            switch (status) {
                case "P":
                    return "bg-gray-100 text-gray-700";
                case "F":
                    return "bg-yellow-100 text-yellow-700";
                case "D":
                    return "bg-green-100 text-green-700";
                default:
                    return "bg-gray-50 text-gray-500";
            }
        },
        applySearch() {
            this.appliedSearch = this.search.trim();
        },
        refreshRecords() {
            window.chrome.webview.postMessage({
                action: "view_batch",
                batchNo: this.$store.state.viewed_batch.fasu_real_batch
            });
        },
        viewBatch(row) {
            this.selected_batch = row;
            this.$store.state.viewed_batch = row;
            this.view_action = 'view';

            this.setLoading(true);

            window.chrome.webview.postMessage({
                action: "view_batch",
                batchNo: row.fasu_real_batch
            });
        },
        approveBatch(row) {
            this.selected_batch = row;
            this.$store.state.viewed_batch = row;
            this.view_action = 'approve';

            this.setLoading(true);

            window.chrome.webview.postMessage({
                action: "view_batch",
                batchNo: row.fasu_real_batch
            });
        },
        postBatch(row) {
            this.selected_batch = row;
            this.$store.state.viewed_batch = row;
            this.view_action = 'post';

            this.setLoading(true);

            window.chrome.webview.postMessage({
                action: "view_batch",
                batchNo: row.fasu_real_batch
            });
        },
        handleBackToBatchReferences() {
            this.selected_batch = null;
            this.batch_ledger = false;
        },
        handleWebResponse(event) {
            const msg = event.data;

            if (msg.type === "get_headers") {
                this.setLoading(false);
                if (msg.success) {
                    this.rows = msg.data;
                    this.$store.state.batch_headers = this.rows;
                } else {
                    console.error(msg.message);
                    this.theme = "error";
                    this.title = "Save Failed";
                    this.positiveBtn = "Okay";

                    this.msg = msg.message;

                    this.message_modal = true;
                }
            }

            if (msg.type === "view_batch") {

                this.setLoading(false);

                if (msg.success) {
                    this.$store.state.viewed_records = msg.data;
                    this.batch_ledger = true;

                } else {

                    this.theme = "error";
                    this.title = "Error";
                    this.msg = msg.message;
                    this.positiveBtn = "Okay";
                    this.message_modal = true;
                }
            }

        },
        postLedger() {
            this.jv_modal = true;
            this.$store.state.for_posting = this.batchRows.filter(row => !row.isTotalRow);
            console.log('for posting: ', this.$store.state.for_posting);
            // this.setLoading(true);

            // // Don't include the TOTAL row
            // const rowsToPost = this.batchRows.filter(row => !row.isTotalRow);

            // window.chrome.webview.postMessage({
            //     action: "post_ledger",
            //     data: rowsToPost,
            //     cut_off_date: this.selected_cutoff_date
            // });
            // console.log("Post Ledger Data Sent:", rowsToPost);
        },
        getHeaders() {
            this.setLoading(true);

            window.chrome.webview.postMessage({
                action: "get_headers"
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
        handleHotkeys(event) {

            if (event.key === "F1") {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                this.getHeaders();
                return false;
            }
        },
    }
};
</script>

<style scoped></style>
