<template>
    <div class="">
        <p class="text-primary text-xl font-bold">Signatories</p>
        <div class="w-full flex flex-row items-center justify-between my-4"
            style="display: grid; gap: 0.75rem; grid-template-columns: repeat(2, minmax(0, 1fr));">
            <TextControl ref="prepared_by" label="Prepared By" v-model="prepared_by" fieldId="uppercase" />
            <TextControl ref="prepared_position" label="Title" v-model="prepared_position" fieldId="uppercase" />

            <TextControl ref="checked_by" label="Checked By" v-model="checked_by" fieldId="uppercase" />
            <TextControl ref="checked_position" label="Title" v-model="checked_position" fieldId="uppercase" />

            <TextControl ref="approved_by" label="Approved By" v-model="approved_by" fieldId="uppercase" />
            <TextControl ref="approved_position" label="Title" v-model="approved_position" fieldId="uppercase" />
        </div>

        <div class="w-full flex items-center justify-end mt-4" style="gap: 1rem;">
            <ButtonControl variant="primary" @click="printJV" style="width: 7rem;" :disabled="!isFormComplete">Print JV</ButtonControl>
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
import DatePickerControl from '@/components/controls/DatePickerControl.vue';


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
        DatePickerControl
    },
    watch: {
        jv_date(newValue) {
            this.updateCutOff(newValue);
        }
    },
    data() {
        return {
            prepared_by: null,
            prepared_position: null,
            checked_by: null,
            checked_position: null,
            approved_by: null,
            approved_position: null,
            message_modal: false,

        };
    },
    computed: {
        isFormComplete() {
            return !!(
                this.prepared_by?.trim() &&
                this.prepared_position?.trim() &&
                this.checked_by?.trim() &&
                this.checked_position?.trim() &&
                this.approved_by?.trim() &&
                this.approved_position?.trim()
            );
        }
    },
    mounted() {
        this.getSignatories();

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
        getSignatories() {
            window.chrome.webview.postMessage({
                action: "get_signatories",
            });
        },
        positiveClick() {
            this.message_modal = false;
        },
        negativeClick() {
            this.message_modal = false;
        },
        printJV() {
            this.$emit('print', {
                prepared_by: this.prepared_by,
                prepared_by_position: this.prepared_position,

                checked_by: this.checked_by,
                checked_by_position: this.checked_position,

                approved_by: this.approved_by,
                approved_by_position: this.approved_position
            });
        },
        handleWebResponse(event) {
            const msg = event.data;

            if (msg.type === "get_signatories") {
                    this.prepared_by = msg.data.prepared_by;
                    this.prepared_position = msg.data.prepared_position;
                    this.checked_by = msg.data.checked_by;
                    this.checked_position = msg.data.checked_position;
                    this.approved_by = msg.data.approved_by;
                    this.approved_position = msg.data.approved_position;
            }

        },
        handleHotkeys(event) {


        },
    }
};
</script>

<style scoped></style>
