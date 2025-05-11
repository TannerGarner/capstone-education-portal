<script setup>
    import { computed, watch } from "vue";
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

    // Define whether or not the list adds or removes students from a course:
    const isListARemovingList = computed(() => ["usersInCourse", "coursesForUser"].includes(props.listType));

    // Create state for data in the enrollment list:
    const list = ref([]);
    watch(
        () => enrollmentStore[props.listType],
        (newList) => {
            list.value = newList.map((item) => ({
                id: item.course_id ?? item.user_id,
                name: item.title ?? `${item.first_name} ${item.last_name}`,
                isSelected: false
            }));
        },
        // Have this run immediately when the component mounts:
        { immediate: true }
    );

    // Handle item click:
    function handleItemClick(item) {
        item.isSelected = !item.isSelected;
    }

    // Update DB as modal parent closes:
    async function updateEnrollment(id) {
        const selectedItems = list.value.filter((item) => item.isSelected);

        switch (props.listType) {
            case "usersInCourse": {
                const courseID = id;
                for (const item of selectedItems) {
                    const userID = item.id;
                    await enrollmentStore.dropCourseFromUser(userID, courseID);
                }
                break;
            }
            case "usersNotInCourse": {
                const courseID = id;
                for (const item of selectedItems) {
                    const userID = item.id;
                    await enrollmentStore.enrollUserInCourse(userID, courseID);
                }
                break;
            }
            case "coursesForUser": {
                const userID = id;
                for (const item of selectedItems) {
                    const courseID = item.id;
                    await enrollmentStore.dropCourseFromUser(userID, courseID);
                }
                break;
            }
            case "coursesNotForUser": {
                const userID = id;
                for (const item of selectedItems) {
                    const courseID = item.id;
                    await enrollmentStore.enrollUserInCourse(userID, courseID);
                }
                break;
            }
            default: {}
        }
    }
    defineExpose({ updateEnrollment });
</script>

<template>
    <div class="enrollment-list">
        <h2>{{ heading }}</h2>
        <ul v-if="list.length">
            <li 
                v-for="item in list"
                :key="item.name"
                @click="handleItemClick(item)"
                :class="[{ selected: item.isSelected }]"
            >
                <span class="icon">{{ isListARemovingList ? "❌" : "➕" }}</span>
                <span>{{ item.id }} | {{ item.name }}</span>
            </li>
        </ul>
        <div v-else class="empty-list-message">None</div>
    </div>
</template>

<style scoped>
    .enrollment-list {
        padding: 1rem;
        max-width: 100%;
    }

    ul, .empty-list-message {
        max-height: 6.25rem;
        overflow-y: auto;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin: 0;
        list-style: none;
    }

    li {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        cursor: pointer;
        transition: background-color 0.2s;
        border-radius: 4px;
    }

    li:hover {
        background-color: #ffcfcf;
    }

    li.selected {
        background-color: #ffe6e6;
        border: 1px solid #ffcfcf;
    }

    .icon {
        font-size: 1.2rem;
    }

    ul::-webkit-scrollbar {
        width: 8px;
    }

    ul::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }

    ul::-webkit-scrollbar-thumb {
        background: #ddd;
        border-radius: 4px;
    }

    ul::-webkit-scrollbar-thumb:hover {
        background: #ccc;
    }
</style>