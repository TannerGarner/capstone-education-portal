<script setup>
    import { defineProps, defineEmits } from 'vue';
    const props = defineProps({
        course: Object,  
        isOpen: Boolean  
    });

    const emit = defineEmits(['close', 'save']);

    function closeModal() {
        emit('close');
    }

    function saveChanges() {
        emit('save', props.course);
    }

    function fixString(string){
        let fixed = string.replace("_", " ")
        fixed = fixed.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
        return fixed;
    }

</script>


<template>
    <div v-if="isOpen" class="cover">
        <div class="editCourseModal">
            <div class="courseInfo">
                <div class="smallFields column">
                    <div 
                    v-for="([key, value]) in Object.entries(course).filter(([k]) => k !== 'description')"
                    :key="key" 
                    class="row">
                        <p>{{ fixString(key) }}</p>
                        <p>{{ value }}</p>
                        <button>
                            Edit
                        </button>
                    </div>
                </div>
                <div class="descriptionBox column">
                    <h3>Description</h3>
                    <p class="description">{{ course.description }}</p>
                    <button>
                        Edit Description
                    </button>
                </div>
            </div>
            <div class="modalButtons">
                <button @click="closeModal(course.course_id)">
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
    .cover{
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .editCourseModal {
        position: relative;
        width: 85vw;
        height: 80vh;
        background-color: #F5F1ED;
        border-radius: 10px;
        padding: 50px;
        box-shadow: 0px 0px 500px #153131;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .courseInfo {
        display: flex;
        gap: 40px;
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

    .modalButtons{
        display: flex;
        justify-content: flex-end;
        gap: 10px;
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