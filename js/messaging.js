// Messaging system

const Messaging = {
    // Send message
    sendMessage(toUserId, subject, message, jobId = null) {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) {
            return { success: false, message: 'Not authenticated' };
        }

        const newMessage = {
            fromUserId: currentUser.id,
            toUserId: toUserId,
            subject: subject,
            message: message,
            jobId: jobId,
            read: false,
            createdAt: new Date().toISOString()
        };

        Storage.addItem('messages', newMessage);
        return { success: true, message: newMessage };
    },

    // Get messages for current user
    getMessages() {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) return [];

        const messages = Storage.getCollection('messages');
        return messages.filter(m => 
            m.fromUserId === currentUser.id || m.toUserId === currentUser.id
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    // Get conversation between two users
    getConversation(otherUserId) {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) return [];

        const messages = Storage.getCollection('messages');
        return messages.filter(m => 
            (m.fromUserId === currentUser.id && m.toUserId === otherUserId) ||
            (m.fromUserId === otherUserId && m.toUserId === currentUser.id)
        ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    },

    // Mark message as read
    markAsRead(messageId) {
        Storage.updateItem('messages', messageId, { read: true });
    },

    // Get unread count
    getUnreadCount() {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) return 0;

        const messages = Storage.getCollection('messages');
        return messages.filter(m => 
            m.toUserId === currentUser.id && !m.read
        ).length;
    },

    // Get user info for message
    getUserInfo(userId) {
        return Storage.getItemById('users', userId);
    }
};

