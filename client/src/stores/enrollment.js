import { defineStore } from "pinia";
import { useUsersStore } from "./users";
import { useCoursesStore } from "./courses";

export const useEnrollmentStore = defineStore("enrollment", {
    state: () => ({
        usersInCourse: [],
        usersNotInCourse: [],
        coursesForUser: [],
        coursesNotForUser: []
    }),
    actions: {
        async enrollUserInCourse(user_id, course_id) {
            try {
                const userStore = useUsersStore();

                const response = await fetch(`/api/enrollment/enroll`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userStore.user.token}`
                    },
                    body: JSON.stringify({ user_id, course_id })
                });

                if (!response.ok) throw new Error(await response.json());

                const enrollData = await response.json();

                alert(`Successfully enrolled in ${course_id}`);

                await this.getCoursesForUser(user_id);

                return enrollData;
            } catch (error) {
                console.error("Error enrolling user in course:", error);
                alert(`Failed to enroll in ${course_id}, because ${error}`);
            }
        },
        async dropCourseFromUser(user_id, course_id) {
            try {
                const userStore = useUsersStore();

                const response = await fetch(`/api/enrollment/drop`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userStore.user.token}`
                    },
                    body: JSON.stringify({ user_id, course_id })            
                })

                if(!response.ok) throw new Error("Failed to drop course from user");

                await this.getCoursesForUser(user_id);

                return true;
            } catch (error) {
                console.error("Error dropping course from user:", error);
                return false;
            } 
        },
        async getUsersInCourse(course_id) {
            try {
                const userStore = useUsersStore();

                const response = await fetch(`/api/enrollment/course/${course_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userStore.user.token}`
                    },      
                });

                if (!response.ok) throw new Error(await response.json());

                const enrollmentData = await response.json();

                this.usersInCourse = enrollmentData.usersForCourse;
                this.usersNotInCourse = enrollmentData.usersNotForCourse;

                return enrollmentData;
            } catch (error) {
                console.error(error.message);
                return [];
            } 
        },
        async getCoursesForUser(user_id) {
            try {
                if (user_id) {
                    const userStore = useUsersStore();
                    
                    const response = await fetch(`/api/enrollment/user/${user_id}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${userStore.user.token}`
                        }
                    })
    
                    if (!response.ok) throw new Error(await response.json());
                    
                    const enrollmentData = await response.json();
    
                    this.coursesForUser = enrollmentData.coursesForUser;
                    this.coursesNotForUser = enrollmentData.coursesNotForUser;
    
                    return enrollmentData;
                } else {
                    const courseStore = useCoursesStore();

                    // Assign coursesNotForUser to equal courseStore.courses, and let coursesForUser remain an empty array:
                    this.coursesNotForUser = courseStore.courses;

                    return this.coursesNotForUser;
                }
            } catch (error) {
                console.error(error.message);
                return [];
            } 
        },
        clearState() {
            this.usersInCourse = [];
            this.usersNotInCourse = [];
            this.coursesForUser = [];
            this.coursesNotForUser = [];
        }
    }
});