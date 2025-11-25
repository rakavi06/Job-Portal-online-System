// localStorage utilities and data management

const Storage = {
    // Initialize storage with default structure
    init() {
        if (!localStorage.getItem('jobPortalData')) {
            const defaultData = {
                users: [],
                jobs: [],
                applications: [],
                messages: [],
                bookmarks: [],
                alerts: [],
                reviews: [],
                currentUser: null
            };
            this.saveData(defaultData);
            this.initMockData();
        }
    },

    // Get all data
    getData() {
        const data = localStorage.getItem('jobPortalData');
        return data ? JSON.parse(data) : null;
    },

    // Save all data
    saveData(data) {
        localStorage.setItem('jobPortalData', JSON.stringify(data));
    },

    // Get specific collection
    getCollection(collectionName) {
        const data = this.getData();
        return data ? data[collectionName] || [] : [];
    },

    // Save collection
    saveCollection(collectionName, items) {
        const data = this.getData();
        data[collectionName] = items;
        this.saveData(data);
    },

    // Add item to collection
    addItem(collectionName, item) {
        const collection = this.getCollection(collectionName);
        item.id = this.generateId();
        item.createdAt = new Date().toISOString();
        collection.push(item);
        this.saveCollection(collectionName, collection);
        return item;
    },

    // Update item in collection
    updateItem(collectionName, id, updates) {
        const collection = this.getCollection(collectionName);
        const index = collection.findIndex(item => item.id === id);
        if (index !== -1) {
            collection[index] = { ...collection[index], ...updates, updatedAt: new Date().toISOString() };
            this.saveCollection(collectionName, collection);
            return collection[index];
        }
        return null;
    },

    // Delete item from collection
    deleteItem(collectionName, id) {
        const collection = this.getCollection(collectionName);
        const filtered = collection.filter(item => item.id !== id);
        this.saveCollection(collectionName, filtered);
    },

    // Get item by ID
    getItemById(collectionName, id) {
        const collection = this.getCollection(collectionName);
        return collection.find(item => item.id === id) || null;
    },

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Get current user
    getCurrentUser() {
        const data = this.getData();
        return data ? data.currentUser : null;
    },

    // Set current user
    setCurrentUser(user) {
        const data = this.getData();
        data.currentUser = user;
        this.saveData(data);
    },

    // Clear current user
    clearCurrentUser() {
        const data = this.getData();
        data.currentUser = null;
        this.saveData(data);
    },

    // Initialize mock data for demonstration
    initMockData() {
        // Mock users
        const mockUsers = [
            {
                id: 'user1',
                type: 'job_seeker',
                email: 'john@example.com',
                password: 'password123',
                name: 'John Doe',
                phone: '+1234567890',
                location: 'New York, NY',
                skills: ['JavaScript', 'React', 'Node.js', 'Python'],
                experience: [
                    {
                        company: 'Tech Corp',
                        position: 'Senior Developer',
                        duration: '2020-2023',
                        description: 'Led development team'
                    }
                ],
                education: [
                    {
                        degree: 'BS Computer Science',
                        school: 'State University',
                        year: '2018'
                    }
                ],
                resume: null,
                createdAt: new Date().toISOString()
            },
            {
                id: 'user2',
                type: 'employer',
                email: 'hr@techcorp.com',
                password: 'password123',
                companyName: 'Tech Corp',
                companyDescription: 'Leading technology company',
                logo: null,
                location: 'San Francisco, CA',
                website: 'https://techcorp.com',
                industry: 'Technology',
                createdAt: new Date().toISOString()
            },
            {
                id: 'admin1',
                type: 'admin',
                email: 'admin@jobportal.com',
                password: 'admin123',
                name: 'Admin User',
                createdAt: new Date().toISOString()
            }
        ];

        // Mock jobs
        const mockJobs = [
            {
                id: 'job1',
                employerId: 'user2',
                title: 'Senior Frontend Developer',
                description: 'We are looking for an experienced frontend developer to join our team. You will work on cutting-edge web applications using React and modern JavaScript.',
                location: 'San Francisco, CA',
                salary: '$120,000 - $150,000',
                experienceLevel: 'Senior (5+ years)',
                jobType: 'Full-time',
                industry: 'Technology',
                skills: ['JavaScript', 'React', 'TypeScript', 'CSS'],
                remote: true,
                views: 45,
                applications: 12,
                createdAt: new Date().toISOString()
            },
            {
                id: 'job2',
                employerId: 'user2',
                title: 'Backend Developer',
                description: 'Join our backend team to build scalable APIs and microservices. Experience with Node.js and cloud platforms required.',
                location: 'Remote',
                salary: '$100,000 - $130,000',
                experienceLevel: 'Mid-level (3-5 years)',
                jobType: 'Full-time',
                industry: 'Technology',
                skills: ['Node.js', 'Python', 'AWS', 'Docker'],
                remote: true,
                views: 38,
                applications: 8,
                createdAt: new Date().toISOString()
            },
            {
                id: 'job3',
                employerId: 'user2',
                title: 'UI/UX Designer',
                description: 'Creative UI/UX designer needed to design beautiful and functional user interfaces for our products.',
                location: 'New York, NY',
                salary: '$90,000 - $110,000',
                experienceLevel: 'Mid-level (2-4 years)',
                jobType: 'Full-time',
                industry: 'Design',
                skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
                remote: false,
                views: 52,
                applications: 15,
                createdAt: new Date().toISOString()
            }
        ];

        const data = this.getData();
        data.users = mockUsers;
        data.jobs = mockJobs;
        this.saveData(data);
    }
};

// Initialize storage on load
if (typeof window !== 'undefined') {
    Storage.init();
}

