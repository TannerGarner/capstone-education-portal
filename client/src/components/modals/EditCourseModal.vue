<script setup>
    import { ref, watch } from 'vue';
    import EnrollmentList from './EnrollmentList.vue';
    import { useEnrollmentStore } from '../../stores/enrollment';
    import { useCoursesStore } from '../../stores/courses';
    const enrollmentStore = useEnrollmentStore();
    const coursesStore = useCoursesStore();

    const props = defineProps({
        course: Object,
        isNew: Boolean,  
        isOpen: Boolean  
    });

    const emit = defineEmits(['close']);

    function closeModal() {
        Object.entries(editorState.value).forEach(([key]) => {
            editorState.value[key] = false;
        });

        enrollmentStore.clearState();

        emit('close');
    }

    const enrolledListRef = ref(null);
    const notEnrolledListRef = ref(null);

    async function saveChanges() {
        if (confirm("Are you sure you want to save these changes?")) {
            // Create or update main course info:
            if (props.isNew) coursesStore.createCourse(editCourse.value);
            else coursesStore.updateCourse(editCourse.value);

            // Update enrollments info:
            await enrolledListRef.value?.updateEnrollment(props.course.course_id);
            await notEnrolledListRef.value?.updateEnrollment(props.course.course_id);

            // Close modal:
            closeModal();
        }
    }

    function fixString(string){
        let fixed = string.replaceAll("_", " ")
        fixed = fixed.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
        return fixed;
    }

    const editCourse = ref({});
    const editorState = ref({});

    watch(() => props.isOpen, (newVal) => {
        if (props.isOpen) enrollmentStore.getUsersInCourse(props.course.course_id);

        if (newVal) {
            editCourse.value = { ...props.course };
            if (props.isNew) {
                Object.keys(props.course).forEach(key => {
                    editorState.value[key] = true;
                });
            }
        }
    });
</script>

<template>
    <div v-if="isOpen" class="cover">
        <div class="editCourseModal">
            <div class="courseInfo">
                <div class="smallFields column">
                    <div
                        v-for="key in Object.keys(course).filter((k) => k !== 'description')"
                        :key="key"
                        class="row"
                    >
                        <p>{{ fixString(key) }}</p>
                        <input v-model="editCourse[key]" type="text">
                    </div>
                </div>
                <div class="descriptionBox column">
                    <h3>Description</h3>
                    <textarea v-model="editCourse.description" class="descriptionInput">{{ course.description }}</textarea>
                </div>
            </div>
            <div>
                <EnrollmentList
                    ref="enrolledListRef"
                    heading="Enrolled Students"
                    listType="usersInCourse"
                />
                <EnrollmentList
                    ref="notEnrolledListRef"
                    heading="Add Students"
                    listType="usersNotInCourse"
                />
            </div>
            <div class="modalButtons">
                <button class="cancel" @click="closeModal(course.course_id)">
                    Cancel
                </button>
                <button @click="saveChanges(course.course_id)">
                    Save
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .cover {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: #00000080;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        overflow-y: auto;
        padding: 2rem 0;
    }

    .editCourseModal {
        position: relative;
        width: 70vw;
        min-height: 60vh;
        background-color: #F5F1ED;
        border-radius: 10px;
        padding: 50px;
        box-shadow: 0px 0px 500px #153131;
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin: auto;
        margin-bottom: 4rem;
    }

    .courseInfo {
        display: flex;
        gap: 40px;
        width: 100%;
        padding-bottom: 20px;
    }

    .column{
        flex-grow: 1;
    }

    .row {
        display: grid;
        grid-template-columns: 1fr 1.5fr 1fr;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #489FB5;
    }

    .row button {
        justify-self: end;
    }

    input {
        padding: 5px;
        border: 1px solid #489FB5;
        border-radius: 5px;
    }

    textarea {
        width: 100%; 
        height: 200px; 
        padding: 10px; 
        font-size: 16px; 
        font-family:'Courier New', Courier, monospace;
        border: 2px solid #489FB5; 
        border-radius: 10px; 
        outline: none; 
    }

    .modalButtons{
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }

    button:hover{
        background-color: #489FB5;
    }

    .cancel:hover{
        background-color: #E63946;
    }

    .descriptionBox {
        max-width: 30%;
    }

    .descriptionBox > * {
        margin: 20px 0px;
    }

    .description {
        text-wrap: wrap;
    }
</style>