import { defineStore } from "pinia";

export const useCoursesStore = defineStore("courses",{
    state: () => ({
        courses: [],
        course: {},
        loading: false,
    }),
    actions: {
        async fetchCourses() {
            const token = JSON.parse(localStorage.getItem('user')).token
            try {
                this.courses = await (await fetch("/api/courses", {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                })).json();
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        },
        async fetchCourse(courseID) {
            try {
                const token = JSON.parse(localStorage.getItem('user')).token
                this.course = await (await fetch(`/api/courses/?searchTerm=${courseID}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json", 
                        "Authorization": `Bearer ${token}`
                    },
                })).json();

        
                return this.course;
            } catch (error) {
                console.error("Error fetching course:", error);
            }
        },
        async createCourse(newCourse) {
            try {
                const token = JSON.parse(localStorage.getItem('user')).token
                const response = await fetch("/api/courses", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                    },
                    body: JSON.stringify(newCourse),
                });
        
                if (!response.ok) {
                    throw new Error("Failed to create course");
                }
        
                this.courses.push(newCourse);

                // Return an error message of null:
                return null;
            } catch (error) {
                console.error("Failed to create course:", error.message);
                return error.message;
            }
        },
        async updateCourse(updateValues) {
            const token = JSON.parse(localStorage.getItem('user')).token
            const index = this.courses.findIndex(course => course.course_id === updateValues.course_id);
            if (index === -1) return;
                
            this.courses[index] = { ...this.courses[index], ...updateValues };
        
            try {
                const response = await fetch(`/api/courses/${updateValues.course_id}`, {
                    method: "PUT",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                    },
                    body: JSON.stringify(updateValues),
                });
        
                if (!response.ok) {
                    throw new Error("Failed to update course");
                }

                // Update course state:
                await this.fetchCourses();

                // Return an error message of null:
                return null;
            } catch (error) {
                console.error("Update failed:", error.message);
                return error.message;
            }
        },
        async deleteCourse(courseID) {
            const index = this.courses.findIndex(course => course.course_id === courseID);
            if (index === -1) return;
        
            const oldCourse = { ...this.courses[index] };
        
            this.courses.splice(index, 1);
            console.log(courseID)
        
            try {
                const token = JSON.parse(localStorage.getItem('user')).token
                const response = await fetch(`/api/courses/${courseID}`, {
                    method: "DELETE",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                    },
                });
                console.log(response)
        
                if (!response.ok) {
                    throw new Error("Failed to delete course");
                }

                // Return boolean confirmation of success to delete course:
                return true;
            } catch (error) {
                console.error("Delete failed, rolling back:", error);
                this.courses.splice(index, 0, oldCourse);

                // Return boolean confirmation of failure to delete course:
                return false;
            }
        },
        sortCourses(sortBy) {
            if (sortBy === "title") {
                this.courses.sort((a, b) => a.title.localeCompare(b.title));
            } else if (sortBy === "course_id") {
                this.courses.sort((a, b) => a.course_id.localeCompare(b.course_id));
            } else if (sortBy === "enrolled") {
                this.courses.sort((a, b) => a.spots_taken - b.spots_taken);
            } else if (sortBy === "schedule") {
                this.courses.sort((a, b) => a.schedule.localeCompare(b.schedule));
            } else if (sortBy === "credits") {
                this.courses.sort((a, b) => a.credit_hours - b.credit_hours);
            } else if (sortBy === "tuition") {
                this.courses.sort((a, b) => a.tuition_cost.localeCompare(b.tuition_cost));
            }
        }
    },
});