// Core functionality and utilities

// Application management
const Applications = {
    // Apply to job
    applyToJob(jobId, coverLetter, resume = null) {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser || currentUser.type !== 'job_seeker') {
            return { success: false, message: 'Only job seekers can apply' };
        }

        // Check if already applied
        const applications = Storage.getCollection('applications');
        const existing = applications.find(a => 
            a.jobId === jobId && a.jobSeekerId === currentUser.id
        );

        if (existing) {
            return { success: false, message: 'You have already applied to this job' };
        }

        const application = {
            jobId: jobId,
            jobSeekerId: currentUser.id,
            coverLetter: coverLetter,
            resume: resume,
            status: 'Pending',
            createdAt: new Date().toISOString()
        };

        Storage.addItem('applications', application);

        // Increment application count for job
        const job = Storage.getItemById('jobs', jobId);
        if (job) {
            Storage.updateItem('jobs', jobId, { 
                applications: (job.applications || 0) + 1 
            });
        }

        return { success: true, application };
    },

    // Get applications for current job seeker
    getMyApplications() {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser || currentUser.type !== 'job_seeker') {
            return [];
        }

        const applications = Storage.getCollection('applications');
        return applications
            .filter(a => a.jobSeekerId === currentUser.id)
            .map(app => {
                const job = Storage.getItemById('jobs', app.jobId);
                return { ...app, job };
            })
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    // Get applications for job (employer view)
    getJobApplications(jobId) {
        const currentUser = Auth.getCurrentUser();
        const job = Storage.getItemById('jobs', jobId);

        if (!job || (job.employerId !== currentUser.id && !Auth.isAdmin())) {
            return [];
        }

        const applications = Storage.getCollection('applications');
        return applications
            .filter(a => a.jobId === jobId)
            .map(app => {
                const jobSeeker = Storage.getItemById('users', app.jobSeekerId);
                return { ...app, jobSeeker };
            })
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    // Update application status
    updateStatus(applicationId, status) {
        const currentUser = Auth.getCurrentUser();
        const application = Storage.getItemById('applications', applicationId);
        const job = Storage.getItemById('jobs', application.jobId);

        if (!job || (job.employerId !== currentUser.id && !Auth.isAdmin())) {
            return { success: false, message: 'Unauthorized' };
        }

        Storage.updateItem('applications', applicationId, { status });
        return { success: true };
    }
};

// Bookmarks management
const Bookmarks = {
    // Bookmark job
    bookmarkJob(jobId) {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) {
            return { success: false, message: 'Not authenticated' };
        }

        const bookmarks = Storage.getCollection('bookmarks');
        const existing = bookmarks.find(b => 
            b.userId === currentUser.id && b.jobId === jobId
        );

        if (existing) {
            return { success: false, message: 'Job already bookmarked' };
        }

        Storage.addItem('bookmarks', {
            userId: currentUser.id,
            jobId: jobId,
            createdAt: new Date().toISOString()
        });

        return { success: true };
    },

    // Remove bookmark
    removeBookmark(jobId) {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) return { success: false };

        const bookmarks = Storage.getCollection('bookmarks');
        const bookmark = bookmarks.find(b => 
            b.userId === currentUser.id && b.jobId === jobId
        );

        if (bookmark) {
            Storage.deleteItem('bookmarks', bookmark.id);
            return { success: true };
        }

        return { success: false };
    },

    // Check if job is bookmarked
    isBookmarked(jobId) {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) return false;

        const bookmarks = Storage.getCollection('bookmarks');
        return bookmarks.some(b => b.userId === currentUser.id && b.jobId === jobId);
    },

    // Get bookmarked jobs
    getBookmarkedJobs() {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) return [];

        const bookmarks = Storage.getCollection('bookmarks');
        const userBookmarks = bookmarks.filter(b => b.userId === currentUser.id);
        
        return userBookmarks.map(bookmark => {
            const job = Storage.getItemById('jobs', bookmark.jobId);
            return { ...bookmark, job };
        }).filter(b => b.job); // Filter out deleted jobs
    }
};

// Job alerts
const JobAlerts = {
    // Create job alert
    createAlert(criteria) {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) {
            return { success: false, message: 'Not authenticated' };
        }

        const alert = {
            userId: currentUser.id,
            criteria: criteria,
            active: true,
            createdAt: new Date().toISOString()
        };

        Storage.addItem('alerts', alert);
        return { success: true, alert };
    },

    // Get alerts for user
    getUserAlerts() {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) return [];

        const alerts = Storage.getCollection('alerts');
        return alerts.filter(a => a.userId === currentUser.id && a.active);
    },

    // Check alerts and return matching jobs
    checkAlerts() {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) return [];

        const alerts = this.getUserAlerts();
        const matchingJobs = [];

        alerts.forEach(alert => {
            const jobs = Search.searchJobs(alert.criteria.query || '', alert.criteria);
            matchingJobs.push(...jobs.map(job => ({ alert, job })));
        });

        return matchingJobs;
    }
};

// Utility functions
const Utils = {
    // Show toast notification
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Validate email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication on protected pages
    const protectedPages = [
        'job-seeker-dashboard.html',
        'employer-dashboard.html',
        'profile.html',
        'applications.html',
        'messages.html',
        'admin-dashboard.html',
        'post-job.html'
    ];

    const currentPage = window.location.pathname.split('/').pop();
    if (protectedPages.includes(currentPage)) {
        if (!Auth.isAuthenticated()) {
            window.location.href = 'login.html';
        }
    }

    // Update navigation based on auth status
    updateNavigation();
});

// Update navigation
function updateNavigation() {
    const currentUser = Auth.getCurrentUser();
    const navLinks = document.querySelectorAll('.nav-auth');
    
    navLinks.forEach(link => {
        if (currentUser) {
            if (link.classList.contains('nav-login')) {
                link.style.display = 'none';
            }
            if (link.classList.contains('nav-user')) {
                link.style.display = 'block';
                const userName = link.querySelector('.user-name');
                if (userName) {
                    userName.textContent = currentUser.name || currentUser.companyName || 'User';
                }
            }
        } else {
            if (link.classList.contains('nav-login')) {
                link.style.display = 'block';
            }
            if (link.classList.contains('nav-user')) {
                link.style.display = 'none';
            }
        }
    });
}

