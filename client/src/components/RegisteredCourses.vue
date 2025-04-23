<script setup>
    import { onMounted, ref } from 'vue';
    import { useEnrollmentStore } from '../stores/enrollment';
    import { useCoursesStore } from '../stores/courses.js';
    import { useUsersStore } from '../stores/users.js';
    import CourseEnrollmentModal from './modals/CourseEnrollmentModal.vue';
    
    const enrollmentStore = useEnrollmentStore();
    const courseStore = useCoursesStore();
    const userStore = useUsersStore();

    const enrollModalOpen = ref(false);
    const selectedCourse = ref(null);
    const addCourseModalOpen = ref(false);

    let userid;
    onMounted(async ()=>{ 
        if(userStore.user.is_admin){
            userid = userStore.editableUser.user_id
        } else {
            userid = userStore.user.user_id
        }
        enrollmentStore.getCoursesForUser(userid)
    })

    function calculateCredits() {
        const courses = enrollmentStore.coursesForUser;
        return Array.isArray(courses) ? courses.reduce((total, course) => total + course.credit_hours, 0) : 0;
    }

    function calculateTuition() {
        const courses = enrollmentStore.coursesForUser;
        return Array.isArray(courses) ? courses.reduce((total, course) => total + Number(course.tuition_cost.replace(/[^0-9.-]+/g, "")), 0) : 0;
    }

    function addCourseModal() {
        alert("Add Course Modal Clicked")
    }

    function detailsModal(course) {
        if (enrollModalOpen.value === false) {
            selectedCourse.value = { ...course };
            enrollModalOpen.value = true;
        } else {
            enrollModalOpen.value = false;
        }    
    }

</script>

<template>
    <div class="container">
        <div class="header">
            <h2>Registered Courses</h2>
            <p>Courses: {{ enrollmentStore.coursesForUser.length }}</p>
            <p>Credits: {{ calculateCredits() }}</p>
            <p>Tuition: ${{ calculateTuition() }}</p>
            <h2 class="addCourseModal" @click="addCourseModal()">+ Add a Course</h2>
        </div>
        <div class="courseList">
            <div class="courseCard" v-for="course in enrollmentStore.coursesForUser" :key="course.course_id">
                <h3>{{course.title}}</h3>
                <p class="data">
                    <span class="material-symbols-outlined icon">
                        schedule
                    </span> 
                    {{course.schedule}}</p>
                <p class="data">
                    <span class="material-symbols-outlined icon">
                        location_on
                    </span> 
                    {{course.classroom_number}}
                </p>
                <button @click="detailsModal(course)">
                    Details
                </button>
            </div>
        </div>
        <CourseEnrollmentModal
            :course="selectedCourse"
            :isEnrolled="true" 
            :isOpen="enrollModalOpen" 
            @close="detailsModal(course)"
        />
    </div>
</template>

<style scoped>
    .container{
        background-color: #F5F1ED;
        display: flex;
        flex-direction: column;
    }

    .header > *{
        color: #489FB5;
    }

    .header > p{
        font-size: 20px;
    }

    .courseList{
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 5%;
        padding: 50px;
        overflow-y: auto;
    }

    .courseList > :last-child{
        align-self: flex-start;
    }

    .courseCard{
        background-color: #F5F1ED;
        border: 2px solid #489FB5;
        border-radius: 10px;
        padding: 30px;
        height: 200px;
        width: 200px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: start;
        box-shadow: 0px 4px 10px rgba(21, 49, 49, 20%);
        transition: transform 0.3s, box-shadow 0.3s;
    }

    .courseCard:hover{
        transform: scale(1.02);
        box-shadow: 0 4px 8px rgba(21, 49, 49, 20%);
    }

    .data{
        display: flex;
        align-items: center;
        font-size: 18px;
        gap: 10px;
    }

    .addCourseModal{
        color: #FE5E41;
        cursor: pointer;
    }

    .dropCourse{
        background-color: #E63946;
    }
    
    button {
        background-color: #F5F1ED;
        color: #FE5E41;
        border: #FE5E41 2px solid;
        transition: background-color 0.3s;
        font-weight: bold;
        width: 100%;
    }

    button:hover {
        background-color: #FE5E41;
        color: #F5F1ED;
    }

    @media screen and (max-width: 900px) {
    .header > p {
        display: none;
    }
}
</style>