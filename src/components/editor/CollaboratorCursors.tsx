'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import collaborationManager, { UserPresence } from '@/lib/collaboration-manager';

interface CollaboratorCursorsProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const CollaboratorCursors: React.FC<CollaboratorCursorsProps> = ({ canvasRef }) => {
  const [cursors, setCursors] = useState<Map<string, UserPresence>>(new Map());

  useEffect(() => {
    const handleCursorUpdate = (data: { userId: string; cursor: { x: number; y: number } }) => {
      setCursors(prev => {
        const newCursors = new Map(prev);
        const existingUser = newCursors.get(data.userId);

        if (existingUser) {
          newCursors.set(data.userId, {
            ...existingUser,
            cursor: data.cursor,
            lastSeen: new Date()
          });
        }

        return newCursors;
      });
    };

    const handleCollaboratorJoined = (user: UserPresence) => {
      setCursors(prev => new Map(prev.set(user.id, user)));
    };

    const handleCollaboratorLeft = (user: UserPresence) => {
      setCursors(prev => {
        const newCursors = new Map(prev);
        newCursors.delete(user.id);
        return newCursors;
      });
    };

    // Listen for collaboration events
    collaborationManager.on('cursor-update', handleCursorUpdate as any);
    collaborationManager.on('collaborator-joined', handleCollaboratorJoined as any);
    collaborationManager.on('collaborator-left', handleCollaboratorLeft as any);

    // Initialize with existing collaborators
    const initialCursors = new Map();
    collaborationManager.getCollaborators().forEach(user => {
      initialCursors.set(user.id, user);
    });
    setCursors(initialCursors);

    return () => {
      collaborationManager.off('cursor-update', handleCursorUpdate as any);
      collaborationManager.off('collaborator-joined', handleCollaboratorJoined as any);
      collaborationManager.off('collaborator-left', handleCollaboratorLeft as any);
    };
  }, []);

  // Track mouse movement to update current user's cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Only update if cursor is within canvas bounds
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          collaborationManager.updateCursorPosition(x, y);
        }
      }
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [canvasRef]);

  // Clean up old cursors (users who haven't moved in 30 seconds)
  useEffect(() => {
    const cleanup = setInterval(() => {
      setCursors(prev => {
        const newCursors = new Map();
        const now = new Date();

        prev.forEach((user, userId) => {
          const timeDiff = now.getTime() - user.lastSeen.getTime();
          if (timeDiff < 30000) { // 30 seconds
            newCursors.set(userId, user);
          }
        });

        return newCursors;
      });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(cleanup);
  }, []);

  if (!canvasRef.current) return null;

  const canvasRect = canvasRef.current.getBoundingClientRect();

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        position: 'absolute',
        top: canvasRect.top,
        left: canvasRect.left,
        width: canvasRect.width,
        height: canvasRect.height,
        zIndex: 1000
      }}
    >
      {Array.from(cursors.entries()).map(([userId, user]) => (
        <div
          key={userId}
          className="absolute pointer-events-none"
          style={{
            left: user.cursor.x,
            top: user.cursor.y,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {/* Cursor */}
          <div
            className="relative"
            style={{
              color: user.color,
              filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.3))'
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="transform rotate-45"
            >
              <path d="M7 2l15 15-7 4-4-7-4-4z" />
            </svg>
          </div>

          {/* User label */}
          <div
            className="absolute top-6 left-2 px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap"
            style={{
              backgroundColor: user.color,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              transform: 'translateX(-50%)'
            }}
          >
            {user.name}
          </div>

          {/* Pulse effect */}
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{
              backgroundColor: user.color,
              transform: 'scale(1.5)'
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default CollaboratorCursors;