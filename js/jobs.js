// Job listing management

const Jobs = {
    // Create new job
    createJob(jobData) {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser || currentUser.type !== 'employer') {
            return { success: false, message: 'Only employers can post jobs' };
        }

        const newJob = {
            ...jobData,
            employerId: currentUser.id,
            views: 0,
            applications: 0,
            createdAt: new Date().toISOString()
        };

        const job = Storage.addItem('jobs', newJob);
        return { success: true, job };
    },

    // Get all jobs
    getAllJobs() {
        return Storage.getCollection('jobs');
    },

    // Get job by ID
    getJobById(id) {
        const job = Storage.getItemById('jobs', id);
        if (job) {
            // Increment views
            this.incrementViews(id);
        }
        return job;
    },

    // Get jobs by employer
    getJobsByEmployer(employerId) {
        const jobs = this.getAllJobs();
        return jobs.filter(job => job.employerId === employerId);
    },

    // Update job
    updateJob(id, updates) {
        const currentUser = Auth.getCurrentUser();
        const job = Storage.getItemById('jobs', id);

        if (!job) {
            return { success: false, message: 'Job not found' };
        }

        if (job.employerId !== currentUser.id && !Auth.isAdmin()) {
            return { success: false, message: 'Unauthorized' };
        }

        const updated = Storage.updateItem('jobs', id, updates);
        return { success: true, job: updated };
    },

    // Delete job
    deleteJob(id) {
        const currentUser = Auth.getCurrentUser();
        const job = Storage.getItemById('jobs', id);

        if (!job) {
            return { success: false, message: 'Job not found' };
        }

        if (job.employerId !== currentUser.id && !Auth.isAdmin()) {
            return { success: false, message: 'Unauthorized' };
        }

        Storage.deleteItem('jobs', id);
        return { success: true };
    },

    // Increment job views
    incrementViews(id) {
        const job = Storage.getItemById('jobs', id);
        if (job) {
            Storage.updateItem('jobs', id, { views: (job.views || 0) + 1 });
        }
    },

    // Get employer info for job
    getEmployerInfo(employerId) {
        return Storage.getItemById('users', employerId);
    }
};

