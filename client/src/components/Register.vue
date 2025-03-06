<script setup>
    import { ref, onMounted } from 'vue';
    import { useCoursesStore } from '../stores/courses.js';
    const courseStore = useCoursesStore();

    onMounted(async () => {
        courseStore.fetchCourses();
    });

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
                    <p>Maximum Capacity</p>
                    <p>Tuition Cost</p>
                </div>
                <div class="course" v-for="course in courseStore.courses" :key="course.string_id">
                    <p>{{course.title}}</p>
                    <p>{{course.schedule}}</p>
                    <p>{{course.classroom_number}}</p>
                    <p>{{course.credit_hours}}</p>
                    <p>{{course.maximum_capacity}}</p>
                    <p>{{course.tuition_cost}}</p>
                    <button>
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
        height: 100%;
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
        grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr;
        align-items: center;
        background-color: rgb(72, 159, 181);
        color: #F5F1ED;
        padding: 5px;
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
        grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr;
        align-items: center;
    }

    .course > * {
        overflow: hidden;       
        text-overflow: ellipsis; 
        white-space: nowrap;
        margin-left: 20px;
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