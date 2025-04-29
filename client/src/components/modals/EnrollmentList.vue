<script setup>
    import { defineProps, defineEmits } from 'vue';
    import { ref } from 'vue';

    // Props definition:
    const props = defineProps({
        heading: {
            type: String,
            required: true
        },
        isAdd: {
            type: Boolean,
            required: true
        },
        items: {
            type: Array,
            required: true
        }
    });

    //
    const itemsState = ref(props.items.map((item) => ({ name: item.title ?? item.user_id, isSelected: false })));

    // Define emit() function for updating event:
    // const emit = defineEmits(['updateEdited']);

    // // Define edited items list:
    // const editedItems = ref([]);

    // Handle item click:
    const handleItemClick = (item) => {
        item.isSelected = !item.isSelected;
        // emit('updateSelected', itemsState.value.filter(item => item.isSelected));
    };

    const testClick = () => {
        console.log("<EnrollmentList> props:", props);
        console.log("<EnrollmentList> itemsState:", itemsState.value);
    };
</script>

<template>
    <div class="enrollment-list">
        <h2 @dblclick="testClick">{{ heading }}</h2>
        <ul>
            <li 
                v-for="item in itemsState"
                :key="item.name"
                @click="handleItemClick(item)"
                :class="['list-item', { 'selected': item.isSelected }]"
            >
                <span class="icon">
                    {{ isAdd ? "➕" : "❌" }}
                </span>
                <span>{{ item.name }}</span>
            </li>
        </ul>
    </div>
</template>

<style scoped>
    .enrollment-list {
        padding: 1rem;
    }

    .list-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        cursor: pointer;
        transition: background-color 0.2s;
        border-radius: 4px;
    }

    .list-item:hover {
        background-color: #ffcfcf;
    }

    .list-item.selected {
        background-color: #ffe6e6;
        border: 1px solid #ffcfcf;
    }

    .icon {
        font-size: 1.2rem;
    }
</style>