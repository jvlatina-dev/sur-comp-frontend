<template>
    <div class="edit-pass w-full">
        <p class="text-primary text-2xl font-bold">Verification</p>
        <p class="text-grey-dark mb-6 text-sm mt-2">To confirm your action, please verify your
            identity to proceed.</p>
        <form @submit.prevent="validate()" class="w-full">
            <TextControl
                ref="pin2"
                label="PIN 2"
                fieldId="confirm_pin_2"
                class="w-full"
                required
                is_pin
                :maxLength="10"
                v-model="confirm_pin_2"
                @input="error_message = ''"
                @keyup.enter="validate"
            />
            <div v-show="error_message" class="w-full flex items-center justify-center text-center mt-4 text-sm">
                <p
                    class="bg-error-light border-2 border-error text-error px-2 py-2 lg:px-3 lg:py-2 rounded text-sm">
                    {{ error_message }}</p>
            </div>

            <ButtonControl variant="primary" type="submit" class="mt-4" :disabled="!enableButton">Verify
            </ButtonControl>
        </form>
    </div>
</template>

<script>
import mixin from "@/mixins/controls.js";
import TextControl from "@/components/controls/TextControl.vue";
import ButtonControl from "@/components/controls/ButtonControl.vue";

export default {
    name: "AddUserView",
    mixins: [mixin],
    components: {
        TextControl,
        ButtonControl,
    },
    mounted() {
        if (window.chrome?.webview) {
            window.chrome.webview.addEventListener("message", this.handleWebResponse);
        }

        this.$nextTick(() => {
            this.$refs.pin2?.focus();
        });
    },
    beforeUnmount() {
        if (window.chrome?.webview) {
            window.chrome.webview.removeEventListener(
                "message",
                this.handleWebResponse
            );
        }
    },
    computed: {
        enableButton() {
            return this.confirm_pin_2.length > 0;
        },
    },
    data() {
        return {
            error_message: "",
            confirm_pin_2: "",
        };
    },
    methods: {
        handleWebResponse(event) {
        const message = event.data;
        console.log('message', message);
            if (message === "incorrect_user_pin_2") {
                this.error_message = "Incorrect PIN2. Please try again.";
                this.confirm_pin_2 = "";
                this.$nextTick(() => this.$refs.pin2?.focus());
            } else if (message === "correct_user_pin_2") {
                this.$emit("validated");
            }
        },
        validate() {
            this.error_message = "";

            const payload = {
                    action: "validate_pin_2",
                    validate: {
                        employee_key: this.$store.state.system_info.employee_key,
                        pin_2: this.confirm_pin_2
                    }
                };
                window.chrome?.webview?.postMessage(payload);
            
        },
    },
};
</script>

<style scoped>
.pw-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}

.col-span-2 {
    grid-column: span 2;
}

.list-disc {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 2rem;
}

@media screen and (max-width: 1100px) {
    .pw-grid {
        gap: 0.5rem;
    }
}
</style>
