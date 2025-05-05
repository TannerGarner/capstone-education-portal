<script setup>
    import { ElSwitch } from "element-plus";

    const props = defineProps({
        label: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true,
            validator: (value) => ["text", "number", "boolean", "schedule", "email"].includes(value)
        },
        modelValue: {
            type: null,  // type of any
            required: true
        }
    });

    const emit = defineEmits(["update:modelValue"]);

    // Handle value changes:
    const handleInput = (event) => {
        let newValue = event;
        
        // Handle different input types:
        if (props.type !== "boolean" && props.type !== "schedule") {
            newValue = event.target.value;
            
            // Convert to number if type is number:
            if (props.type === "number") {
                newValue = Number(newValue);
            }
        }
        
        emit("update:modelValue", newValue);
    };
</script>

<template>
    <span>{{ label }}</span>

    <el-switch
        v-if="type === 'boolean'"
        :model-value="modelValue"
        @update:model-value="handleInput"
    />
    <select
        v-else-if="type === 'schedule'"
        :value="modelValue"
        @change="handleInput"
    >
        <option value="A">Option A</option>
        <option value="B">Option B</option>
        <option value="C">Option C</option>
    </select>
    <input
        v-else
        :type="type"
        :value="modelValue"
        @input="handleInput"
    />
</template>

<style scoped>
    input, select {
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        width: 100%;
    }

    select {
        background-color: white;
    }
</style>