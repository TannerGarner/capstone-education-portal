<script setup>
    import { defineProps, defineEmits, watch } from 'vue';
    import { ref } from 'vue';
    import { useEnrollmentStore } from '../../stores/enrollment';
    const enrollmentStore = useEnrollmentStore();

    // Props definition:
    const props = defineProps({
        heading: {
            type: String,
            required: true
        },
        listType: {
            type: String,
            required: true,
            validator: (value) => [
                'usersInCourse',
                'usersNotInCourse',
                'coursesForUser',
                'coursesNotForUser'
            ].includes(value)
        }
    });

    // Declare state from data in the enrollment list:
    const itemsState = ref([]);
    watch(
        () => enrollmentStore[props.listType],
        (newItems) => {
            itemsState.value = newItems.map((item) => ({
                name: item.title ?? item.user_id,
                isSelected: false
            }));
        },
        // Have this run immediately when the component mounts:
        { immediate: true }
    );

    // Define emit() function for updating event:
    // const emit = defineEmits(['updateEdited']);

    // Handle item click:
    const handleItemClick = (item) => {
        item.isSelected = !item.isSelected;
        // emit('updateSelected', itemsState.value.filter((item) => item.isSelected));
    };

    // This gets the proper icon for the list being used:
    const getIcon = (listType) => {
        return ['usersInCourse', 'coursesForUser'].includes(listType) ? '❌' : '➕';
    };

    // DELETE this later:
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
                <span class="icon">{{ getIcon(listType) }}</span>
                <span>{{ item.name }}</span>
            </li>
        </ul>
    </div>
</template>

<style scoped>
    .enrollment-list {
        max-width: 100%;
        display: flex;
        flex-direction: column;
        gap:5px;
    }

    .enrollment-list ul {
        overflow-y: auto;
        height: 30vh;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin: 0;
        list-style: none;
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

    .enrollment-list ul::-webkit-scrollbar {
        width: 8px;
    }

    .enrollment-list ul::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }

    .enrollment-list ul::-webkit-scrollbar-thumb {
        background: #ddd;
        border-radius: 4px;
    }

    .enrollment-list ul::-webkit-scrollbar-thumb:hover {
        background: #ccc;
    }
</style>