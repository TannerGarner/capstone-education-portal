<script setup>
    import { onMounted, ref } from 'vue';
    import { useEnrollmentStore } from '../../stores/enrollment.js';
    import { useUsersStore } from '../../stores/users.js';
    import { useCoursesStore } from '../../stores/courses.js';
    import CourseEnrollmentModal from './CourseEnrollmentModal.vue';

    const emit = defineEmits(['close']);

    const enrollmentStore = useEnrollmentStore();
    const courseStore = useCoursesStore();
    const userStore = useUsersStore();

    const enrollModalOpen = ref(false);
    const selectedCourse = ref(null);
    const searchQuery = ref('');
    const sortOrder = ref(true); // true for ascending, false for descending
    const sortField = ref('title'); 
    const isEnrolled = ref(false);
    const userid = ref(null);

    onMounted(async () => { 
        userid.value = userStore.user.is_admin 
            ? userStore.editableUser.user_id 
            : userStore.user.user_id;
        await enrollmentStore.getCoursesForUser(userid.value);
        await courseStore.fetchCourses();
    });

    function closeModal() {
        emit('close');
    }

    function addCourse(course) {
        if (confirm(`Are you sure you want to enroll in course with courseId: ${course.course_id}`)) {
            const enrolled = enrollmentStore.enrollUserInCourse(userid.value, course.course_id);
            alert(`${enrolled ? "Enrolled Successfully" : "Failed to Enroll"}`);
            emit('close');
        }
    }

    function dropCourse(course) {
        if (confirm(`Are you sure you want to drop course with courseId: ${course.course_id}`)) {
            const dropped = enrollmentStore.dropCourseFromUser(userid.value, course.course_id);
            alert(`${dropped ? "Dropped Successfully" : "Failed to Drop"}`);
            emit('close');
        }
    }

    function courseIncluded(selectedCourse) {
        return enrollmentStore.coursesForUser.some(course => course.course_id === selectedCourse.course_id);
    }

    function detailsModal(course) {
        if (enrollModalOpen.value === false) {
            selectedCourse.value = { ...course };
            isEnrolled.value = courseIncluded(course);
            enrollModalOpen.value = true;
        } else {
            selectedCourse.value = null;
            isEnrolled.value = false;
            enrollModalOpen.value = false;
        }    
    }

    function sort(field) {
        if (sortField?.value === field) {
            sortOrder.value = !sortOrder.value; // Toggle sort order if the same field is clicked
        } else {
            sortOrder.value = true; // Reset to ascending order for a new field
        }
        courseStore.sortCourses(field, sortOrder.value);
        sortField.value = field;
    }

    async function filter(searchTerm) {
        await courseStore.filterCourses(searchTerm);
    }
</script>

<template>
    <div class="cover">
        <div class="addCourseModal">
            <h1> Add Courses </h1>
            <span class="material-symbols-outlined close" @click="closeModal()">
                close
            </span>
            <div class="courseList">
                <div class="tableHeader">
                    <h3 @click="sort('title')">
                        Course Title
                        <span class="material-symbols-outlined">
                            swap_vert
                        </span>
                    </h3>
                    <h3 @click="sort('enrolled')">
                        Enrolled
                        <span class="material-symbols-outlined">
                            swap_vert
                        </span>
                    </h3>
                    <h3 @click="sort('schedule')">
                        Schedule
                        <span class="material-symbols-outlined">
                            swap_vert
                        </span>
                    </h3>
                    <h3 @click="sort('credits')">
                        Credits
                        <span class="material-symbols-outlined">
                            swap_vert
                        </span>
                    </h3>
                    <h3 @click="sort('tuition')">
                        Tuition
                        <span class="material-symbols-outlined">
                            swap_vert
                        </span>
                    </h3>
                    <input v-model="searchQuery" @input="filter(searchQuery)" type="search" placeholder="Search Courses" class="search-bar"></input>
                </div>
                <div class="row" v-for="course in courseStore.courses" :key="course.course_id">
                    <p class="title">{{ course.title }} </p>
                    <p class="enrolled">{{ course.spots_taken }}/{{ course.maximum_capacity }} </p>
                    <p class="schedule">{{ course.schedule }} </p>
                    <p class="credits">{{ course.credit_hours }} </p>
                    <p class="tuition">{{ course.tuition_cost }} </p>
                    <span class="material-symbols-outlined icon" @click="detailsModal(course)">
                        more_horiz
                    </span>
                    <span v-if="courseIncluded(course)" class="material-symbols-outlined delete icon" @click="dropCourse(course)">
                        delete
                    </span>
                    <span v-else class="material-symbols-outlined add icon" @click="addCourse(course)">
                        add_circle
                    </span>
                </div>
            </div>
        </div>
    </div>
    <CourseEnrollmentModal
        v-if="enrollModalOpen"
        :course="selectedCourse"
        :isEnrolled="isEnrolled" 
        @close="detailsModal(null)"
    />
</template>

<style scoped>
    .addCourseModal{
        position: relative;
        width: 80vw;
        height: 80vh;
        background-color: #F5F1ED;
        border-radius: 10px;
        padding-top: 50px;
        box-shadow: 0px 0px 500px #153131;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
    }
    
    .close {
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 30px;
        cursor: pointer;
    }

    .courseList{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .tableHeader{
        top: 0;
        position: sticky;
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr 1fr 2fr;
        justify-content: space-between;
        align-items: center;
        padding: 30px 50px;
        background-color: #F5F1ED;
        border-bottom: 2px solid rgba(72, 159, 181, 0.5);
    }

    .tableHeader > h3{
        display: flex;
        align-items: center;
    }

    .search-bar{
        height: 40px;
        border-radius: 50px;
        border: 1px solid #489FB5;
        padding: 15px;
        font-size: 16px;
    }

    .tableHeader > h3:hover{
        cursor: pointer;
    }

    .row{
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr;
        padding: 30px 50px;
        border-bottom: 2px solid rgba(72, 159, 181, 0.5);
    }

    .icon{
        justify-self: center;
    }

    .icon:hover{
        cursor: pointer;
    }

    .delete{
        color: #E63946;
    }

    .add{
        color: #489FB5;
    }

</style>
