<script setup>
    import { defineProps, defineEmits } from 'vue';
    import { ref } from 'vue';
    import { useEnrollmentStore } from '../../stores/enrollment';
    const enrollmentStore = useEnrollmentStore();

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
        listType: {
            type: String,
            required: true
        }
    });

    // Define emit() function for updating event:
    const emit = defineEmits(['updateEdited']);

    // Define edited items list:
    const editedItems = ref([]);

    // Handle item click:
    const handleItemClick = (item) => {
        editedItems.value.push(item);
        // emit('updateEdited', editedItems.value);
    };

    const testClick = () => console.log("<EnrollmentList> props:", props);
</script>

<template>
    <div class="enrollment-list">
        <h2 @dblclick="testClick">{{ heading }}</h2>
        <ul>
            <li 
                v-for="item in items" 
                :key="item.id" 
                @click="handleItemClick(item)"
                class="list-item"
            >
                <span class="icon">
                    {{ isAdd ? "➕" : "❌" }}
                </span>
                <!-- Assuming items have a name property - adjust based on your data structure -->
                <span>{{ item }}</span>
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
    }

    .list-item:hover {
        background-color: #f0f0f0;
    }

    .icon {
        font-size: 1.2rem;
    }
</style>