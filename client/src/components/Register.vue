<script setup>
    import { ref } from 'vue';
    const allCourses = ref([
        {
            string_id:"CSCI-1001",
            title:"Introduction to Computer Science",
            description:"This course will introduce students to the fundamental concepts behind computers and computer programming. Topics covered include basic programming logic, algorithm development, computer architecture, and software engineering.",
            schedule:"MWF 9-10",
            classroom_number:"LAB-123",
            maximum_capacity:"2",
            credit_hours:"3",
            tuition_cost: 900.00
        },
        {
            string_id:"CSCI-2001",
            title:"Data Structures",
            description:"This course will cover the basics of data structures, algorithms, and data manipulation. Topics covered include linked lists, stacks, queues, trees, and hash tables. Students will also learn algorithms for sorting and searching data.",
            schedule:"TTH 10-11",
            classroom_number:"LAB-456",
            maximum_capacity:"30",
            credit_hours:"3",
            tuition_cost: 900.00
        }
    ]);

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
                <div class="course" v-for="course in allCourses" :key="course.string_id">
                    <p>{{course.title}}</p>
                    <p>{{course.schedule}}</p>
                    <p>{{course.classroom_number}}</p>
                    <p>{{course.credit_hours}}</p>
                    <p>{{course.maximum_capacity}}</p>
                    <p>${{course.tuition_cost}}</p>
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
        padding: 50px 0px;
    }

    .courseList{
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 20px 0px;
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