// Search and filtering functionality

const Search = {
    // Skill synonyms mapping
    skillSynonyms: {
        'javascript': ['js', 'ecmascript', 'node.js', 'nodejs'],
        'react': ['reactjs', 'react.js'],
        'python': ['py'],
        'node.js': ['nodejs', 'node'],
        'ui/ux': ['ui', 'ux', 'user interface', 'user experience'],
        'frontend': ['front-end', 'front end'],
        'backend': ['back-end', 'back end']
    },

    // Normalize search term
    normalizeTerm(term) {
        return term.toLowerCase().trim();
    },

    // Check if term matches skill (with synonyms)
    matchesSkill(term, skills) {
        const normalizedTerm = this.normalizeTerm(term);
        const normalizedSkills = skills.map(s => this.normalizeTerm(s));

        // Direct match
        if (normalizedSkills.some(s => s.includes(normalizedTerm) || normalizedTerm.includes(s))) {
            return true;
        }

        // Synonym match
        for (const [key, synonyms] of Object.entries(this.skillSynonyms)) {
            if (normalizedTerm === key || synonyms.includes(normalizedTerm)) {
                if (normalizedSkills.some(s => s.includes(key) || key.includes(s))) {
                    return true;
                }
            }
            if (normalizedSkills.some(s => s === key || synonyms.includes(s))) {
                if (normalizedTerm === key || synonyms.includes(normalizedTerm)) {
                    return true;
                }
            }
        }

        return false;
    },

    // Advanced search
    searchJobs(query, filters = {}) {
        let jobs = Jobs.getAllJobs();

        // Text search
        if (query) {
            const normalizedQuery = this.normalizeTerm(query);
            jobs = jobs.filter(job => {
                const searchableText = [
                    job.title,
                    job.description,
                    job.location,
                    job.industry,
                    ...(job.skills || [])
                ].join(' ').toLowerCase();

                return searchableText.includes(normalizedQuery) ||
                       this.matchesSkill(normalizedQuery, job.skills || []);
            });
        }

        // Apply filters
        if (filters.location) {
            jobs = jobs.filter(job => 
                job.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        if (filters.jobType) {
            jobs = jobs.filter(job => job.jobType === filters.jobType);
        }

        if (filters.experienceLevel) {
            jobs = jobs.filter(job => job.experienceLevel === filters.experienceLevel);
        }

        if (filters.industry) {
            jobs = jobs.filter(job => job.industry === filters.industry);
        }

        if (filters.remote !== undefined) {
            jobs = jobs.filter(job => job.remote === filters.remote);
        }

        if (filters.minSalary) {
            jobs = jobs.filter(job => {
                const salaryMatch = job.salary.match(/\$?(\d+),?(\d+)?/);
                if (salaryMatch) {
                    const salary = parseInt(salaryMatch[1] + (salaryMatch[2] || ''));
                    return salary >= filters.minSalary;
                }
                return true;
            });
        }

        if (filters.skills && filters.skills.length > 0) {
            jobs = jobs.filter(job => {
                return filters.skills.some(skill => 
                    this.matchesSkill(skill, job.skills || [])
                );
            });
        }

        return jobs;
    },

    // Save search criteria
    saveSearchCriteria(criteria) {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) return;

        const savedSearches = Storage.getCollection('savedSearches') || [];
        const searchData = {
            userId: currentUser.id,
            criteria: criteria,
            createdAt: new Date().toISOString()
        };
        Storage.addItem('savedSearches', searchData);
    },

    // Get saved searches for user
    getSavedSearches() {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) return [];

        const savedSearches = Storage.getCollection('savedSearches') || [];
        return savedSearches.filter(s => s.userId === currentUser.id);
    }
};

