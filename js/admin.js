// Admin functions

const Admin = {
    // Get all users
    getAllUsers() {
        if (!Auth.isAdmin()) {
            return [];
        }
        return Storage.getCollection('users');
    },

    // Get all jobs
    getAllJobs() {
        if (!Auth.isAdmin()) {
            return [];
        }
        return Storage.getCollection('jobs');
    },

    // Get all applications
    getAllApplications() {
        if (!Auth.isAdmin()) {
            return [];
        }
        return Storage.getCollection('applications');
    },

    // Delete user
    deleteUser(userId) {
        if (!Auth.isAdmin()) {
            return { success: false, message: 'Unauthorized' };
        }

        Storage.deleteItem('users', userId);
        return { success: true };
    },

    // Verify employer
    verifyEmployer(userId) {
        if (!Auth.isAdmin()) {
            return { success: false, message: 'Unauthorized' };
        }

        Storage.updateItem('users', userId, { verified: true });
        return { success: true };
    },

    // Get platform statistics
    getStatistics() {
        if (!Auth.isAdmin()) {
            return null;
        }

        const users = Storage.getCollection('users');
        const jobs = Storage.getCollection('jobs');
        const applications = Storage.getCollection('applications');

        return {
            totalUsers: users.length,
            jobSeekers: users.filter(u => u.type === 'job_seeker').length,
            employers: users.filter(u => u.type === 'employer').length,
            totalJobs: jobs.length,
            totalApplications: applications.length,
            activeJobs: jobs.filter(j => {
                const daysSincePosted = (new Date() - new Date(j.createdAt)) / (1000 * 60 * 60 * 24);
                return daysSincePosted <= 30;
            }).length
        };
    }
};

