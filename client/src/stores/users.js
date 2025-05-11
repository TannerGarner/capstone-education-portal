import { defineStore } from "pinia";

export const useUsersStore = defineStore('users',{
    state: () => ({
        users: [],
        user: JSON.parse(localStorage.getItem("user")) || {},
        editableUser: {}
    }),
    actions: {
        async verifyToken() {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) return false;

            const user = JSON.parse(storedUser);
            const token = user?.token;
            if (!token) return false;

            try {
                const response = await fetch("/api/verify-token", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    }
                });
                if (!response.ok) throw new Error ("Invalid token");

                return true;
            } catch (error) {
                console.error("Error verifying token:", error.message);
                return false;
            }
        },
        async fetchUsers() {
            try {
                this.users = await (await fetch("/api/users", {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${this.user.token}`
                    },
                })).json();
                // return this.users;
            } catch (error) {
                console.error("Error fetching users:", error.message);
            }
        },
        async fetchUser(userID) {
            if (!userID && userID !== 0) {
                console.error("fetchUser: No userID provided");
                return;
            }
        
            try {
                const response = await fetch(`/api/users/${userID}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${this.user.token}`,
                    },
                });
        
                if (!response.ok) throw new Error("Failed to fetch user");
        
                const userData = await response.json();
                this.user = { ...this.user, ...userData };                
                return true;
            } catch (error) {
                console.error("Error fetching user:", error.message);
                this.user = {};
                localStorage.removeItem("user"); 
                return false;
            }
        },
        async updateAllUserState() {
            if (this.user.is_admin) this.fetchUsers();

            this.fetchUser(this.user.user_id);
        },
        async createUser(newUser) {
            try {
                const response = await fetch("/api/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newUser),
                });

                if (!response.ok) {
                    const { errorMessage } = await response.json();
                    throw new Error(errorMessage);
                }
                const tokenAndUser = await response.json();

                const { password, ...userWithoutPassword } = newUser;
                if (!this.user.is_admin){
                    this.user = { 
                        ...userWithoutPassword, 
                        user_id: tokenAndUser.user_id,
                        password_length: password.length,
                        token: tokenAndUser.token,
                    };

                    localStorage.setItem("user", JSON.stringify(this.user));

                    this.users.push(this.user);
                } else {
                    this.users.push({
                        ...userWithoutPassword, 
                        user_id: tokenAndUser.user_id
                    });
                }

                return {
                    user_id: tokenAndUser.user_id,
                    errorMessage: null
                }
            } catch (error) {
                console.error("Failed to create user:", error.message);
                return {
                    user_id: null,
                    errorMessage: error.message
                }
            }
        },
        async updateUser(updateValues) {
            try {
                console.log("updateValues:", updateValues);

                // Make request to update user in database:
                const response = await fetch(`/api/users/${updateValues.user_id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${this.user.token}`,
                    },
                    body: JSON.stringify(updateValues),
                });

                // Check if response is okay:
                if (!response.ok) {
                    const { errorMessage } = await response.json();
                    throw new Error(errorMessage);
                }

                // Update user and users state:
                this.updateAllUserState();

                // Return an error message of null:
                return null;
            } catch (error) {
                console.error("Update failed:", error.message);
                return error.message;
            }
        },
        async deleteUser(userID) {
            const index = this.users.findIndex(user => user.user_id === userID);
            console.log(index)
            console.log(this.user)
            if (index === -1) return false;

            const oldUser = { ...this.users[index] };

            this.users.splice(index, 1);

            try {
                const response = await fetch(`/api/users/${userID}`, {
                    method: "DELETE",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${this.user.token}`,
                    },
                });

                if (!response.ok) throw new Error("Failed to delete user");

                // Return boolean confirmation of success to delete user:
                return true;
            } catch (error) {
                console.error("Delete failed, rolling back:", error.message);
                this.users.splice(index, 0, oldUser);

                // Return boolean confirmation of failure to delete user:
                return false;
            }
        },
        async login(credentials) {
            try {
                const response = await fetch("/api/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(credentials),
                });

                if (!response.ok) throw new Error("Login failed");

                const { token, user } = await response.json();

                this.user = {
                    ... user,
                    password_length: credentials.password.length,
                    token: token,
                };

                localStorage.setItem("user", JSON.stringify(this.user));
                return true;
            } catch (error) {
                console.error("Login failed:", error.message);
                return false;
            }
        },
        async logout() {
            this.user = {};
            localStorage.removeItem("user");
        },
    },
});