<script setup>
    import { ref, watch } from 'vue';
    import EnrollmentList from './EnrollmentList.vue';
    import { useEnrollmentStore } from '../../stores/enrollment';
    const enrollmentStore = useEnrollmentStore();

    const props = defineProps({
        user: Object,
        isNew: Boolean,  
        isOpen: Boolean  
    });

    const emit = defineEmits(['close', 'save']);

    function closeModal() {
        Object.entries(editorState.value).forEach(([key]) => {
            editorState.value[key] = false;
        });
        emit('close');
    }

    function saveChanges() {
        emit('save', editUser.value);
    }

    function fixString(string){
        let fixed = string.replaceAll("_", " ");
        fixed = fixed.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
        fixed = fixed.replaceAll(/Or\b/g, "or");
        return fixed;
    }

    const editUser = ref({});
    const editorState = ref({});

    watch(() => props.isOpen, (newVal) => {
        if (props.isOpen) enrollmentStore.getCoursesForUser(props.user.user_id);

        if (newVal) {
            editUser.value = { ...props.user };
            if (props.isNew) {
                Object.keys(props.user).forEach(key => {
                    if (key === 'address') {
                        editorState.value.address = {};
                        Object.keys(props.user.address).forEach(addressKey => {
                            editorState.value.address[addressKey] = true;
                        });
                    } else {
                        editorState.value[key] = true;
                    }
                });
            }
        }
    });
</script>

<template>
    <div v-if="isOpen" class="cover">
        <div class="editStudentModal">
            <div class="studentInfo">
                <div class="smallFields column">
                    <div 
                        v-for="key in Object.keys(user).filter((k) => k !== 'user_id')"
                        :key="key"
                        class="row"
                    >
                        <p>{{ fixString(key) }}</p>
                        <input v-model="editUser[key]" type="text">
                    </div>
                </div>
            </div>
            <div>
                <EnrollmentList
                    heading="Enrolled Courses"
                    listType="coursesForUser"
                />
                <EnrollmentList
                    heading="Available Courses"
                    listType="coursesNotForUser"
                />
            </div>
            <div class="modalButtons">
                <button class="cancel" @click="closeModal(user.user_id)">
                    Cancel
                </button>
                <button @click="saveChanges(user.user_id)">
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

    .editStudentModal {
        position: relative;
        width: 70vw;
        height: 60vh;
        background-color: #F5F1ED;
        border-radius: 10px;
        padding: 50px;
        box-shadow: 0px 0px 500px #153131;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 20px;
    }

    .studentInfo {
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