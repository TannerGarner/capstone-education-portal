<script setup>
    import { ref, onMounted } from 'vue';
    import { useCoursesStore } from '../stores/courses.js';
    import { useEnrollmentStore } from '../stores/enrollment.js';
    import { useUsersStore } from '../stores/users.js';
    const courseStore = useCoursesStore();
    const enrollmentStore = useEnrollmentStore();
    const userStore = useUsersStore();

    onMounted(async () => {
        courseStore.fetchCourses();
    });

    async function register(course_id){
        let userid;
        if(userStore.user.is_admin){
            userid = userStore.editableUser.user_id
        } else {
            userid = userStore.user.user_id
        }
        enrollmentStore.enrollUserInCourse(userid, course_id)
    }

</script>

<template>
    <div class="container">
        <div class="header">
            <h1>Register</h1>
        </div>
        <div class="allCourses">
            <input class="searchBar" type="search" placeholder="Search All Courses"></input>
            <div class="courseList">
                <div class="courseHeader">
                    <p>Course Title</p>
                    <p>Schedule</p>
                    <p>Classroom</p>
                    <p>Credit Hours</p>
                    <p>Enrolled</p>
                    <p>Spots Available</p>
                    <p>Max Capacity</p>
                    <p>Tuition Cost</p>
                </div>
                <div class="course" v-for="course in courseStore.courses" :key="course.course_id">
                    <p>{{course.title}}</p>
                    <p>{{course.schedule}}</p>
                    <p>{{course.classroom_number}}</p>
                    <p>{{course.credit_hours}}</p>
                    <p>{{ course.spots_taken }}</p>
                    <p>{{ course.maximum_capacity-course.spots_taken }}</p>
                    <p>{{course.maximum_capacity}}</p>
                    <p>{{course.tuition_cost}}</p>
                    <button @click="register(course.course_id)">
                        Register
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100vh;
    }

    .allCourses {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 1px 0px 1px;
        flex-grow: 1;
        overflow: hidden;
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
        grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
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
        grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        align-items: center;
    }

    .course > * {
        overflow: hidden;       
        text-overflow: ellipsis; 
        white-space: nowrap;
        margin-left: 20px;
    }

    button {
        transition: background-color 0.3s;
    }

    button:hover {
        background-color: #FE5E41;
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