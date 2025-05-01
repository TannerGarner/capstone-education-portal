<script setup>
    import { defineProps, watch } from "vue";
    import { ref } from "vue";
    import { useEnrollmentStore } from "../../stores/enrollment";
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
                "usersInCourse",
                "usersNotInCourse",
                "coursesForUser",
                "coursesNotForUser"
            ].includes(value)
        }
    });

    // Declare state from data in the enrollment list:
    const itemsState = ref([]);
    watch(
        () => enrollmentStore[props.listType],
        (newItems) => {
            itemsState.value = newItems.map((item) => ({
                name: item.course_id ?? item.user_id, // NOTE: cannot change item.course_id without making other notable changes as well.
                isSelected: false
            }));
        },
        // Have this run immediately when the component mounts:
        { immediate: true }
    );

    // Handle item click:
    function handleItemClick(item) {
        item.isSelected = !item.isSelected;
    };

    // This gets the proper icon for the list being used:
    function getIcon(listType) {
        return ["usersInCourse", "coursesForUser"].includes(listType) ? "❌" : "➕";
    };

    // Update DB as modal parent closes:
    async function updateEnrollment(userID) {
        const selectedItems = itemsState.value.filter((item) => console.log("item:", item) || item.isSelected);

        switch (props.listType) {
            case "coursesForUser": {
                for (const item of selectedItems) await enrollmentStore.dropCourseFromUser(userID, item.name);
                break;
            }
            case "coursesNotForUser": {
                for (const item of selectedItems) await enrollmentStore.enrollUserInCourse(userID, item.name);
                break;
            }
            default: {}
        }
    }
    defineExpose({ updateEnrollment });

    // DELETE this later:
    function testClick() {
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
                :class="['list-item', { selected: item.isSelected }]"
            >
                <span class="icon">{{ getIcon(listType) }}</span>
                <span>{{ item.name }}</span>
            </li>
        </ul>
    </div>
</template>

<style scoped>
    .enrollment-list {
        padding: 1rem;
        max-width: 100%;
    }

    .enrollment-list ul {
        max-height: 6.25rem;
        overflow-y: auto;
        padding: 0.5rem;
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