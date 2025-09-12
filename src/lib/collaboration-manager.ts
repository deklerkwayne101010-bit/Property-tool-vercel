/* eslint-disable @typescript-eslint/no-explicit-any */

export interface UserPresence {
  id: string;
  name: string;
  color: string;
  cursor: { x: number; y: number };
  lastSeen: Date;
}

export interface CanvasEvent {
  type: 'add' | 'modify' | 'delete' | 'clear';
  objectId?: string;
  objectData?: unknown;
  userId: string;
  timestamp: Date;
}

class CollaborationManager {
  private socket: unknown = null;
  private currentUser: UserPresence | null = null;
  private collaborators: Map<string, UserPresence> = new Map();
  private eventListeners: Map<string, ((...args: unknown[]) => void)[]> = new Map();

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    // In a real implementation, this would connect to your Socket.io server
    // For now, we'll simulate the functionality
    console.log('Collaboration manager initialized');
  }

  // User management
  setCurrentUser(user: Omit<UserPresence, 'cursor' | 'lastSeen'>) {
    this.currentUser = {
      ...user,
      cursor: { x: 0, y: 0 },
      lastSeen: new Date()
    };
  }

  updateCursorPosition(x: number, y: number) {
    if (this.currentUser) {
      this.currentUser.cursor = { x, y };
      this.currentUser.lastSeen = new Date();

      // Emit cursor update to other users
      this.emit('cursor-update', {
        userId: this.currentUser.id,
        cursor: this.currentUser.cursor
      });
    }
  }

  // Event handling
  on(event: string, callback: (...args: unknown[]) => void) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: (...args: unknown[]) => void) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Canvas synchronization
  broadcastCanvasEvent(event: CanvasEvent) {
    // In a real implementation, this would send to the server
    console.log('Broadcasting canvas event:', event);
    this.emit('canvas-event', event);
  }

  // Collaborator management
  addCollaborator(user: UserPresence) {
    this.collaborators.set(user.id, user);
    this.emit('collaborator-joined', user);
  }

  removeCollaborator(userId: string) {
    const user = this.collaborators.get(userId);
    if (user) {
      this.collaborators.delete(userId);
      this.emit('collaborator-left', user);
    }
  }

  getCollaborators(): UserPresence[] {
    return Array.from(this.collaborators.values());
  }

  // Utility methods
  generateUserColor(): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  isOnline(userId: string): boolean {
    const user = this.collaborators.get(userId);
    if (!user) return false;

    const now = new Date();
    const timeDiff = now.getTime() - user.lastSeen.getTime();
    return timeDiff < 30000; // 30 seconds timeout
  }
}

// Singleton instance
export const collaborationManager = new CollaborationManager();
export default collaborationManager;