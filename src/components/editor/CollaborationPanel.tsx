'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import collaborationManager, { UserPresence } from '@/lib/collaboration-manager';

interface CollaborationPanelProps {
  currentUserId?: string;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({ currentUserId }) => {
  const [collaborators, setCollaborators] = useState<UserPresence[]>([]);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Set up current user (in a real app, this would come from auth)
    if (currentUserId) {
      collaborationManager.setCurrentUser({
        id: currentUserId,
        name: 'You',
        color: collaborationManager.generateUserColor()
      });
    }

    // Listen for collaborator updates
    const handleCollaboratorJoined = (user: UserPresence) => {
      setCollaborators(prev => [...prev, user]);
    };

    const handleCollaboratorLeft = (user: UserPresence) => {
      setCollaborators(prev => prev.filter(c => c.id !== user.id));
    };

    collaborationManager.on('collaborator-joined', handleCollaboratorJoined as any);
    collaborationManager.on('collaborator-left', handleCollaboratorLeft as any);

    // Add some mock collaborators for demonstration
    const mockUsers: UserPresence[] = [
      {
        id: 'user1',
        name: 'Alice Johnson',
        color: '#FF6B6B',
        cursor: { x: 150, y: 200 },
        lastSeen: new Date()
      },
      {
        id: 'user2',
        name: 'Bob Smith',
        color: '#4ECDC4',
        cursor: { x: 300, y: 150 },
        lastSeen: new Date()
      }
    ];

    mockUsers.forEach(user => {
      collaborationManager.addCollaborator(user);
    });

    // Update collaborators list
    setCollaborators(collaborationManager.getCollaborators());

    return () => {
      collaborationManager.off('collaborator-joined', handleCollaboratorJoined as any);
      collaborationManager.off('collaborator-left', handleCollaboratorLeft as any);
    };
  }, [currentUserId]);

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    // In a real implementation, this would update the user's online status
  };

  return (
    <div className="collaboration-panel bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <span className="mr-2">👥</span>
          Collaboration
        </h3>
        <button
          onClick={toggleOnlineStatus}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isOnline
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {isOnline ? 'Online' : 'Offline'}
        </button>
      </div>

      {/* Current User */}
      <div className="mb-4">
        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: collaborationManager.generateUserColor() }}
          ></div>
          <span className="text-sm font-medium text-blue-900">You</span>
          <div className="flex-1"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </div>

      {/* Collaborators */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Active Collaborators ({collaborators.length})
        </h4>

        {collaborators.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">No collaborators online</p>
            <p className="text-xs mt-1">Share the project link to invite others</p>
          </div>
        ) : (
          collaborators.map((collaborator) => (
            <div
              key={collaborator.id}
              className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: collaborator.color }}
              ></div>
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">
                  {collaborator.name}
                </span>
                <div className="text-xs text-gray-500">
                  Cursor: ({Math.round(collaborator.cursor.x)}, {Math.round(collaborator.cursor.y)})
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Collaboration Actions */}
      <div className="mt-6 pt-4 border-t">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Actions</h4>
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
            📋 Copy project link
          </button>
          <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
            📧 Invite collaborators
          </button>
          <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
            💬 Open chat
          </button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Connection</span>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-green-600">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationPanel;