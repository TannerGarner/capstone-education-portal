<script setup>
    import { ref } from 'vue';
    const courses = ref([
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
    ])

</script>

<template>
    <div class="container">
        <div class="header">
            <h1>Registered Courses</h1>
        </div>
        <div class="courseList">
            <div class="courseDisplay" v-for="course in courses" :key="course.string_id">
                <h2>{{course.title}}</h2>
                <p>Schedule: {{course.schedule}}</p>
                <p>Classroom: {{course.classroom_number}}</p>
                <p>Credit Hours: {{course.credit_hours}}</p>
                <button>\/</button>
                <div class="dropdown">
                    <p>{{course.description}}</p>
                    <p>Maximum Capacity: {{course.maximum_capacity}}</p>
                    <p>Tuition Cost: ${{course.tuition_cost}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .container{
        background-color: #F5F1ED;
        display: flex;
        flex-direction: column;
    }

    .header{
        background-color: #489FB5;
        color: #F5F1ED;
        padding: 20px;
    }

    .courseList{
        display: grid;
        grid-template-rows: repeat(minmax(300px, 1fr));
        gap: 20px;
        padding: 20px;
    }

    .courseDisplay{
        background-color: #F5F1ED;
        border: 2px solid #489FB5;
        border-left: 10px solid #489FB5;
        padding: 20px;
        border-radius: 1px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        align-items: center;
    }

    .courseDisplay > * {
        flex-grow: 1;
    }

    .dropdown{
        display: none;
    }
</style>