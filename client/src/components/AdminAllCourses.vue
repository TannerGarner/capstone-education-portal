<script setup>
    import { ref, onMounted, watch } from 'vue';
    import EditCourseModal from './modals/EditCourseModal.vue';
    import { useCoursesStore } from '../stores/courses.js';
    import { useUsersStore } from '../stores/users.js';
    const coursesStore = useCoursesStore();
    const usersStore = useUsersStore();
    const selectedCourse = ref(null);
    const isEditModalOpen = ref(false);
    const isNew = ref(false);
    const renderedCourses = ref([]);
    const searchQuery = ref("");

    onMounted(async () => {
        await coursesStore.fetchCourses();
        filterRenderedCourses();
    });

    watch(searchQuery, filterRenderedCourses);
    watch(() => coursesStore.courses, filterRenderedCourses);

    function openEditModal(course) {
        selectedCourse.value = { ...course };
        isEditModalOpen.value = true;
    }

    function closeEditModal() {
        isNew.value = false;
        isEditModalOpen.value = false;
        selectedCourse.value = null;
    }

    function createCourse(){
        isNew.value = true;
        const coursePattern = {
            course_id: "",
            title: "",
            schedule: "",
            classroom_number: "",
            maximum_capacity: "",
            credit_hours: "",
            description: "",
            tuition_cost: ""
        }
        // selectedCourse.value = { ...coursePattern };
        openEditModal(coursePattern);
    }

    async function deleteCourse(course_id) {
        if (confirm(`Are you sure you want to delete course with courseid: ${course_id}`)) {
            const deleted = await coursesStore.deleteCourse(course_id);
            // alert(`${deleted ? "Failed to Delete" :  "Deleted Successfully"}`);
            // router.push("/auth");
        }
    }

    function filterRenderedCourses() {
        if (searchQuery.value === "") {
            renderedCourses.value = [...coursesStore.courses];
        } else {
            const searchQueryLower = searchQuery.value.toLowerCase();

            renderedCourses.value = coursesStore.courses.filter((course) => (
                course.title.toLowerCase().includes(searchQueryLower) || course.course_id.toLowerCase().includes(searchQueryLower)
            ));
        }
    }

    function tempDebugTesting() {
        console.log("=".repeat(25));
        console.log("searchQuery.value:", searchQuery.value);
        console.log("renderedCourses.value:", renderedCourses.value);
        console.log("=".repeat(25));
    }
</script>

<template>
    <div v-if="usersStore.user.is_admin" class="container">
        <div class="header">
            <h2 @dblclick="tempDebugTesting()">Manage Courses</h2>
            <input
                class="searchBar"
                type="search"
                v-model="searchQuery"
                placeholder="Search All Courses"
            />
            <p @click="createCourse" class="createCourse">+ Create a Course</p>
        </div>
        <div class="allCourses">
            <div class="courseList">
                <div class="courseHeader">
                    <p>Course Title</p>
                    <p>Course ID</p>
                    <p>Enrolled</p>
                    <p>Schedule</p>
                    <p>Credits</p>
                    <p>Tuition</p>
                </div>
                <div
                    class="course"
                    v-for="(course, index) in renderedCourses"
                    :key="course.course_id"
                    :class="{ firstCourse: index === 0 }"
                >
                    <h4>{{ course.title }}</h4>
                    <p>{{ course.course_id }}</p>
                    <p>{{ course.spots_taken }}/{{course.maximum_capacity}}</p>
                    <p>{{ course.schedule }}</p>
                    <p>{{ course.credit_hours }}</p>
                    <p>{{ course.tuition_cost }}</p>
                    <span class="material-symbols-outlined details" @click="openEditModal(course)">
                        edit_square
                    </span>
                    <!-- <button class="delete" @click="deleteCourse(course.course_id)">
                        Delete
                    </button> -->
                </div>
            </div>
        </div>
        <EditCourseModal
            v-if="isEditModalOpen"
            :course="selectedCourse"
            :isNew="isNew"
            @close="closeEditModal"
        />
            <!-- :isOpen="isEditModalOpen" -->
            <!-- @save="saveCourse" -->
    </div>
</template>

<style scoped>
    .allCourses {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-grow: 1;
        overflow: hidden;
    }

    .createCourse{
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
        color: #FE5E41;
    }

    .createCourse:hover{
        color: #153131;
    }

    .courseList{
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 0px 2px 0px 2px;
        flex-grow: 1;
        overflow-y: auto;
        overflow-x: hidden;
        position: relative;
    }

    .courseHeader{
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 0.5fr;
        align-items: center;
        background-color: #F5F1ED;
        color: #153131;
        padding: 20px 5px;
        border-bottom: #489FB5 2px solid;
        position: sticky;
        top: 0;
    }

    .courseHeader > * {
        overflow: hidden;       
        text-overflow: ellipsis; 
        white-space: nowrap;
        margin-left: 20px;
    }


    .course{
        border-top: solid 2px #489FB5;
        padding: 15px;
        border-radius: 1px;
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 0.5fr;
        align-items: center;
    }

    .course.firstCourse {
        border: none;
    }


    .course > * {
        overflow: hidden;       
        text-overflow: ellipsis; 
        white-space: nowrap;
        margin-left: 20px;
    }

    .details {
        color: #FE5E41;
        cursor: pointer;
    }

    .delete {
        background-color: #E63946;
    }

    .delete:hover {
        box-shadow: 0px 0px 5px #153131;
    }

    @media screen and (max-width: 1200px) {
        .searchBar {
            width: 80%;
        }

        .courseHeader > * {
            margin-left: 0;
        }

        .course > * {
            margin-left: 0;
        }
    }
</style>