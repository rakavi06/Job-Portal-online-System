// Authentication logic

const Auth = {
    // Register new user
    register(userData) {
        const users = Storage.getCollection('users');
        
        // Check if email already exists
        if (users.find(u => u.email === userData.email)) {
            return { success: false, message: 'Email already registered' };
        }

        const newUser = {
            ...userData,
            id: Storage.generateId(),
            createdAt: new Date().toISOString()
        };

        Storage.addItem('users', newUser);
        return { success: true, user: newUser };
    },

    // Login user
    login(email, password) {
        const users = Storage.getCollection('users');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Remove password from stored user object
            const { password: _, ...userWithoutPassword } = user;
            Storage.setCurrentUser(userWithoutPassword);
            return { success: true, user: userWithoutPassword };
        }

        return { success: false, message: 'Invalid email or password' };
    },

    // Logout user
    logout() {
        Storage.clearCurrentUser();
        return { success: true };
    },

    // Check if user is authenticated
    isAuthenticated() {
        return Storage.getCurrentUser() !== null;
    },

    // Get current user
    getCurrentUser() {
        return Storage.getCurrentUser();
    },

    // Check if user is admin
    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.type === 'admin';
    },

    // Check if user is employer
    isEmployer() {
        const user = this.getCurrentUser();
        return user && user.type === 'employer';
    },

    // Check if user is job seeker
    isJobSeeker() {
        const user = this.getCurrentUser();
        return user && user.type === 'job_seeker';
    },

    // Require authentication (redirect if not logged in)
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    // Require specific user type
    requireUserType(type) {
        if (!this.requireAuth()) return false;
        
        const user = this.getCurrentUser();
        if (user.type !== type) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }
};

