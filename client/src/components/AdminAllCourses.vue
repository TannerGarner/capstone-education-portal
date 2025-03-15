<script setup>
    import { ref, onMounted } from 'vue';
    import { useCoursesStore } from '../stores/courses.js';
    import EditCourseModal from './EditCourseModal.vue';
    const courseStore = useCoursesStore();
    const selectedCourse = ref(null);
    const isEditModalOpen = ref(false);

    onMounted(async () => {
        courseStore.fetchCourses();
    });


    function openEditModal(course) {
        selectedCourse.value = { ...course };
        isEditModalOpen.value = true;
    }

    function closeEditModal() {
        isEditModalOpen.value = false;
        selectedCourse.value = null;
    }

    function saveCourse(updatedCourse) {
        console.log('Saving updated course:', updatedCourse);
        closeEditModal();
    }
</script>

<template>
    <div class="container">
        <div class="header">
            <h1>All Courses</h1>
        </div>
        <div class="allCourses">
            <input class="searchBar" type="search" placeholder="Search All Courses"></input>
            <div class="courseList">
                <div class="courseHeader">
                    <p>Course Title</p>
                    <p>Schedule</p>
                    <p>Classroom</p>
                    <p>Credit Hours</p>
                    <p>Maximum Capacity</p>
                    <p>Tuition Cost</p>
                </div>
                <div class="course" v-for="course in courseStore.courses" :key="course.course_id">
                    <p>{{course.title}}</p>
                    <p>{{course.schedule}}</p>
                    <p>{{course.classroom_number}}</p>
                    <p>{{course.credit_hours}}</p>
                    <p>{{course.maximum_capacity}}</p>
                    <p>{{course.tuition_cost}}</p>
                    <button class="details" @click="openEditModal(course)">
                        Edit
                    </button>
                    <button class="delete" @click="deleteCourse(course.course_id)">
                        Delete
                    </button>
                </div>
                
            </div>
        </div>
        <EditCourseModal 
            :course="selectedCourse"
            :isOpen="isEditModalOpen"
            @close="closeEditModal"
            @save="saveCourse"
        />
    </div>
</template>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }

    .header {
        background-color: #FE5E41;
    }

    .allCourses {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 1px 0px 1px;
        height: 86%;
    }

    .courseList{
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 20px, 2px, 0px, 2px;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        position: relative;
    }

    .searchBar {
        padding: 20px 40px;
        border-radius: 50px;
        border: 2px solid #489FB5;
        background-color: rgba(72, 159, 181, 0.25);
        font-size: 24px;
        color: #489FB5;
        display: flex;
        width: 50%;
        margin-bottom: 20px;
    }

    .searchBar::placeholder {
        color: #489FB5;
    }

    .courseHeader{
        display: grid;
        grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        align-items: center;
        background-color: rgb(72, 159, 181);
        color: #F5F1ED;
        padding: 20px;
        border-radius: 1px;
        position: sticky;
        top: 0;
    }

    .courseHeader > * {
        margin-left: 20px;
    }

    .courseHeader > * {
        overflow: hidden;       
        text-overflow: ellipsis; 
        white-space: nowrap;
        margin-left: 20px;
    }

    .course{
        background-color: rgba(72, 159, 181, 0.25);
        border: solid 2px #489FB5;
        padding: 5px;
        margin-top: 1px;
        border-radius: 1px;
        display: grid;
        grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        align-items: center;
    }

    .course > * {
        overflow: hidden;       
        text-overflow: ellipsis; 
        white-space: nowrap;
        margin-left: 20px;
    }

    .details:hover {
        background-color: #FE5E41;
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