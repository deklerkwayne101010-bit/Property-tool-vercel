'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fabric from 'fabric';
import IconLibrary from './IconLibrary';
import LayoutPresets from './LayoutPresets';
import ContextMenu from './ContextMenu';

// Enhanced toolbar tools with categories
const TOOLBAR_TOOLS = {
  select: { icon: 'cursor', label: 'Select', category: 'basic', shortcut: 'V' },
  text: { icon: 'type', label: 'Text', category: 'content', shortcut: 'T' },
  shapes: { icon: 'square', label: 'Shapes', category: 'content', shortcut: 'S' },
  images: { icon: 'image', label: 'Images', category: 'content', shortcut: 'I' },
  icons: { icon: 'star', label: 'Icons', category: 'content', shortcut: 'U' },
  templates: { icon: 'layout', label: 'Templates', category: 'design', shortcut: 'L' },
  brush: { icon: 'paint-brush', label: 'Brush', category: 'creative', shortcut: 'B' },
  eraser: { icon: 'eraser', label: 'Eraser', category: 'creative', shortcut: 'E' }
};

const TOOL_CATEGORIES = {
  basic: { label: 'Basic', icon: 'cursor' },
  content: { label: 'Content', icon: 'plus' },
  design: { label: 'Design', icon: 'palette' },
  creative: { label: 'Creative', icon: 'sparkles' }
};

// Helper function to get tool icons
const getToolIcon = (iconName: string) => {
  const icons: Record<string, React.ReactElement> = {
    cursor: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
    type: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>,
    square: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth={2} /></svg>,
    image: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    star: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
    layout: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>,
    'paint-brush': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" /></svg>,
    eraser: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
  };
  return icons[iconName] || <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
};

// Helper function to get category icons
const getCategoryIcon = (iconName: string) => {
  const icons: Record<string, React.ReactElement> = {
    cursor: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
    plus: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
    palette: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" /></svg>,
    sparkles: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
  };
  return icons[iconName] || <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
};

interface CanvasEditorProps {
  width?: number;
  height?: number;
  onSave?: (canvas: any) => void;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({
  width = 1000,
  height = 600,
  onSave
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<any>(null);
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [activePanel, setActivePanel] = useState<string>('elements');
  const [showGuides, setShowGuides] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeCategory, setActiveCategory] = useState<string>('basic');
  const [contextMenu, setContextMenu] = useState<{
    isVisible: boolean;
    position: { x: number; y: number };
    items: any[];
  }>({
    isVisible: false,
    position: { x: 0, y: 0 },
    items: []
  });

  useEffect(() => {
    // Only initialize canvas if it doesn't exist and we have a canvas element
    if (canvasRef.current && !canvas && fabric && !canvasRef.current.hasAttribute('data-fabric-initialized')) {
      // Mark canvas as being initialized to prevent double initialization
      canvasRef.current.setAttribute('data-fabric-initialized', 'true');

      const fabricCanvas = new (fabric as any).Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff',
      });

      // Enable object selection
      fabricCanvas.selection = true;

      // Add event listeners
      fabricCanvas.on('selection:created', handleSelection);
      fabricCanvas.on('selection:updated', handleSelection);
      fabricCanvas.on('selection:cleared', handleSelectionClear);

      // Add right-click context menu
      fabricCanvas.on('mouse:down', (options: any) => {
        if (options.e.button === 2) { // Right click
          const target = options.target;
          if (target && fabricCanvas.setActiveObject) {
            fabricCanvas.setActiveObject(target);
            fabricCanvas.renderAll();
          }
        }
      });

      // Add alignment guides
      if (showGuides) {
        // Add center guidelines
        const centerX = width / 2;
        const centerY = height / 2;

        // Vertical center line
        const vLine = new (fabric as any).Line([centerX, 0, centerX, height], {
          stroke: '#e5e7eb',
          strokeWidth: 1,
          strokeDashArray: [5, 5],
          selectable: false,
          evented: false,
          opacity: 0.5
        });

        // Horizontal center line
        const hLine = new (fabric as any).Line([0, centerY, width, centerY], {
          stroke: '#e5e7eb',
          strokeWidth: 1,
          strokeDashArray: [5, 5],
          selectable: false,
          evented: false,
          opacity: 0.5
        });

        fabricCanvas.add(vLine);
        fabricCanvas.add(hLine);
        // Send guides to back to keep them behind other objects
        if (fabricCanvas.sendToBack) {
          fabricCanvas.sendToBack(vLine);
          fabricCanvas.sendToBack(hLine);
        }
      }

      setCanvas(fabricCanvas);
    }

    return () => {
      if (canvas) {
        canvas.dispose();
        // Clear the initialization marker when disposing
        if (canvasRef.current) {
          canvasRef.current.removeAttribute('data-fabric-initialized');
        }
      }
    };
  }, [width, height, canvas, showGuides]);

  const handleSelection = (e: any) => {
    // Handle object selection
    console.log('Object selected:', e.selected);
  };

  const handleSelectionClear = () => {
    // Handle selection clear
    console.log('Selection cleared');
  };

  const addText = () => {
    if (!canvas || !fabric) return;

    const text = new (fabric as any).IText('Edit me', {
      left: 100,
      top: 100,
      fontSize: 24,
      fill: '#000000',
      fontFamily: 'Arial',
    });

    canvas.add(text);
    canvas.setActiveObject(text);
  };

  const addRectangle = () => {
    if (!canvas || !fabric) return;

    const rect = new (fabric as any).Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: '#ff0000',
      stroke: '#000000',
      strokeWidth: 2,
    });

    canvas.add(rect);
    canvas.setActiveObject(rect);
  };

  const addCircle = () => {
    if (!canvas || !fabric) return;

    const circle = new (fabric as any).Circle({
      radius: 50,
      left: 100,
      top: 100,
      fill: '#00ff00',
      stroke: '#000000',
      strokeWidth: 2,
    });

    canvas.add(circle);
    canvas.setActiveObject(circle);
  };

  const deleteSelected = () => {
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    activeObjects.forEach((obj: any) => {
      canvas.remove(obj);
    });
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  const duplicateSelected = () => {
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    activeObjects.forEach((obj: any) => {
      obj.clone((cloned: any) => {
        cloned.set({
          left: (cloned.left || 0) + 10,
          top: (cloned.top || 0) + 10,
        });
        canvas.add(cloned);
      });
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !canvas || !fabric) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imgUrl = e.target?.result as string;
      (fabric as any).Image.fromURL(imgUrl, (img: any) => {
        img.scaleToWidth(200);
        canvas.add(img);
        canvas.setActiveObject(img);
      });
    };
    reader.readAsDataURL(file);
  };

  const exportCanvas = () => {
    if (!canvas) return;

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1
    });

    const link = document.createElement('a');
    link.download = 'canvas-export.png';
    link.href = dataURL;
    link.click();
  };

  const saveCanvas = () => {
    if (canvas && onSave) {
      onSave(canvas);
    }
  };

  const applyFilter = (filterType: string, value?: number) => {
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length === 0) return;

    activeObjects.forEach((obj: any) => {
      if (obj.type === 'image') {

        switch (filterType) {
          case 'brightness':
            if (value !== undefined) {
              obj.filters = obj.filters || [];
              obj.filters[0] = new (fabric as any).Image.filters.Brightness({ brightness: value / 100 });
            }
            break;
          case 'contrast':
            if (value !== undefined) {
              obj.filters[1] = new (fabric as any).Image.filters.Contrast({ contrast: value / 100 });
            }
            break;
          case 'saturation':
            if (value !== undefined) {
              obj.filters[2] = new (fabric as any).Image.filters.Saturation({ saturation: value / 100 });
            }
            break;
          case 'hue':
            if (value !== undefined) {
              obj.filters[3] = new (fabric as any).Image.filters.HueRotation({ rotation: value });
            }
            break;
          case 'blur':
            if (value !== undefined) {
              obj.filters[4] = new (fabric as any).Image.filters.Blur({ blur: value });
            }
            break;
          case 'sepia':
            if (value !== undefined) {
              obj.filters[5] = new (fabric as any).Image.filters.Sepia();
            }
            break;
          case 'reset':
            obj.filters = [];
            break;
          // Preset filters
          case 'vintage':
            obj.filters = [
              new (fabric as any).Image.filters.Sepia(),
              new (fabric as any).Image.filters.Brightness({ brightness: 0.1 }),
              new (fabric as any).Image.filters.Contrast({ contrast: 0.2 })
            ];
            break;
          case 'blackwhite':
            obj.filters = [new (fabric as any).Image.filters.Grayscale()];
            break;
          case 'cool':
            obj.filters = [
              new (fabric as any).Image.filters.HueRotation({ rotation: -10 }),
              new (fabric as any).Image.filters.Saturation({ saturation: 0.1 })
            ];
            break;
          case 'warm':
            obj.filters = [
              new (fabric as any).Image.filters.HueRotation({ rotation: 10 }),
              new (fabric as any).Image.filters.Saturation({ saturation: 0.2 })
            ];
            break;
          case 'dramatic':
            obj.filters = [
              new (fabric as any).Image.filters.Contrast({ contrast: 0.3 }),
              new (fabric as any).Image.filters.Brightness({ brightness: -0.1 })
            ];
            break;
        }

        obj.applyFilters();
        canvas.renderAll();
      }
    });
  };

  const selectTemplate = (templateId: string) => {
    console.log('Selected template:', templateId);
    // TODO: Implement template loading logic
    // This would load predefined furniture arrangements, colors, etc.
  };

  // Handle icon selection from library
  const handleIconSelect = useCallback((iconData: any) => {
    if (!canvas || !fabric) return;

    const text = new (fabric as any).IText(iconData.icon, {
      left: 100,
      top: 100,
      fontSize: 48,
      fill: '#000000',
      fontFamily: 'Arial',
      selectable: true,
      evented: true,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  }, [canvas]);

  // Handle layout preset selection
  const handleLayoutSelect = useCallback((layout: any) => {
    if (!canvas || !fabric) return;

    // Clear existing objects
    canvas.clear();

    // Add layout elements
    layout.elements.forEach((element: any) => {
      let obj: any;

      switch (element.type) {
        case 'rectangle':
          obj = new (fabric as any).Rect({
            left: element.x,
            top: element.y,
            width: element.width,
            height: element.height,
            ...element.properties,
            selectable: true,
            evented: true,
          });
          break;
        case 'text':
          obj = new (fabric as any).IText(
            element.properties?.text || 'Sample Text',
            {
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
              ...element.properties,
              selectable: true,
              evented: true,
            }
          );
          break;
        case 'image':
          // Placeholder for image elements
          obj = new (fabric as any).Rect({
            left: element.x,
            top: element.y,
            width: element.width,
            height: element.height,
            fill: '#f3f4f6',
            stroke: '#d1d5db',
            strokeDashArray: [5, 5],
            selectable: true,
            evented: true,
          });
          break;
      }

      if (obj) {
        canvas.add(obj);
      }
    });

    canvas.renderAll();
  }, [canvas]);

  // Handle right-click context menu
  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();

    if (!canvas) return;

    const rect = canvas.getElement().getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const pointer = canvas.getPointer(event.nativeEvent);
    const target = canvas.findTarget(event.nativeEvent);

    const menuItems = [
      {
        id: 'duplicate',
        label: 'Duplicate',
        icon: '📋',
        action: () => {
          if (target && target.clone) {
            target.clone((cloned: any) => {
              cloned.set({
                left: (cloned.left || 0) + 20,
                top: (cloned.top || 0) + 20,
              });
              canvas.add(cloned);
              canvas.setActiveObject(cloned);
              canvas.renderAll();
            });
          }
        },
        disabled: !target
      },
      {
        id: 'bring-to-front',
        label: 'Bring to Front',
        icon: '⬆️',
        action: () => {
          if (target && canvas.bringToFront) {
            canvas.bringToFront(target);
            canvas.renderAll();
          }
        },
        disabled: !target
      },
      {
        id: 'send-to-back',
        label: 'Send to Back',
        icon: '⬇️',
        action: () => {
          if (target && canvas.sendToBack) {
            canvas.sendToBack(target);
            canvas.renderAll();
          }
        },
        disabled: !target
      },
      { id: 'separator1', separator: true },
      {
        id: 'delete',
        label: 'Delete',
        icon: '🗑️',
        action: () => {
          if (target && canvas.remove) {
            canvas.remove(target);
            canvas.renderAll();
          }
        },
        disabled: !target
      }
    ];

    setContextMenu({
      isVisible: true,
      position: { x: event.clientX, y: event.clientY },
      items: menuItems
    });
  }, [canvas]);

  // Close context menu
  const closeContextMenu = useCallback(() => {
    setContextMenu(prev => ({ ...prev, isVisible: false }));
  }, []);

  // Handle zoom
  const handleZoom = useCallback((direction: 'in' | 'out') => {
    const newZoom = direction === 'in'
      ? Math.min(zoomLevel + 25, 200)
      : Math.max(zoomLevel - 25, 25);

    setZoomLevel(newZoom);

    if (canvas) {
      canvas.setZoom(newZoom / 100);
      canvas.renderAll();
    }
  }, [zoomLevel, canvas]);

  return (
    <div className="flyer-editor h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar - Canva Style */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">FlyerPro</h1>
          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm text-gray-600">Untitled Design</span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-1">
            <button
              onClick={() => handleZoom('out')}
              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-900"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-12 text-center">{zoomLevel}%</span>
            <button
              onClick={() => handleZoom('in')}
              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-900"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>

          {/* Guides Toggle */}
          <button
            onClick={() => setShowGuides(!showGuides)}
            className={`px-3 py-1 rounded text-sm font-medium ${
              showGuides
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Guides
          </button>

          {/* Export Options */}
          <div className="flex space-x-2">
            <button
              onClick={exportCanvas}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              Share
            </button>
            <button
              onClick={exportCanvas}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Elements & Tools */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActivePanel('elements')}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activePanel === 'elements'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Elements
            </button>
            <button
              onClick={() => setActivePanel('layouts')}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activePanel === 'layouts'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Layouts
            </button>
            <button
              onClick={() => setActivePanel('uploads')}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activePanel === 'uploads'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Uploads
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto">
            {activePanel === 'elements' && (
              <IconLibrary onIconSelect={handleIconSelect} />
            )}

            {activePanel === 'layouts' && (
              <LayoutPresets onLayoutSelect={handleLayoutSelect} />
            )}

            {activePanel === 'uploads' && (
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Upload Media</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block w-full p-4 rounded-lg bg-gray-50 border-2 border-dashed border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400 cursor-pointer text-center transition-colors">
                      <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-sm font-medium">Upload Images</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        multiple
                      />
                    </label>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-2">Or drag and drop files here</p>
                    <p className="text-xs text-gray-400">Supported: JPG, PNG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col bg-gray-100">
          {/* Enhanced Canvas Toolbar */}
          <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              {/* Left Section - Tool Categories */}
              <div className="flex items-center space-x-6">
                {/* Category Tabs */}
                <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                  {Object.entries(TOOL_CATEGORIES).map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => setActiveCategory(key)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${
                        activeCategory === key
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{getCategoryIcon(category.icon)}</span>
                      <span>{category.label}</span>
                    </button>
                  ))}
                </div>

                <div className="h-8 w-px bg-gray-300"></div>

                {/* Tools for Active Category */}
                <div className="flex items-center space-x-2">
                  {Object.entries(TOOLBAR_TOOLS)
                    .filter(([_, tool]) => tool.category === activeCategory)
                    .map(([key, tool]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedTool(key)}
                        className={`group relative p-3 rounded-lg transition-all duration-200 ${
                          selectedTool === key
                            ? 'bg-blue-100 text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                        title={`${tool.label} (${tool.shortcut})`}
                      >
                        <span className="text-xl">{getToolIcon(tool.icon)}</span>
                        {selectedTool === key && (
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                        )}
                      </button>
                    ))}
                </div>
              </div>

              {/* Right Section - Actions */}
              <div className="flex items-center space-x-4">
                {/* Quick Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={addText}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm"
                  >
                    <span className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Add Text</span>
                    </span>
                  </button>
                  <button
                    onClick={addRectangle}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-sm"
                  >
                    <span className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      <span>Add Shape</span>
                    </span>
                  </button>
                  <button
                    onClick={deleteSelected}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-sm"
                  >
                    <span className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete</span>
                    </span>
                  </button>
                </div>

                <div className="h-8 w-px bg-gray-300"></div>

                {/* Canvas Info */}
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">Canvas Size:</span>
                  <span className="text-sm font-medium text-gray-900">{width} × {height}px</span>
                </div>
              </div>
            </div>
          </div>

          {/* Canvas Container */}
          <div className="flex-1 flex items-center justify-center p-8 bg-gray-100">
            <div
              className="relative bg-white shadow-2xl rounded-lg overflow-hidden"
              style={{ width: width + 40, height: height + 40 }}
              onContextMenu={handleContextMenu}
            >
              {/* Canvas Guidelines Overlay */}
              {showGuides && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Center crosshairs */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-blue-300 opacity-50" style={{ transform: 'translateX(-0.5px)' }}></div>
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-blue-300 opacity-50" style={{ transform: 'translateY(-0.5px)' }}></div>

                  {/* Thirds grid */}
                  <div className="absolute left-1/3 top-0 bottom-0 w-px bg-blue-200 opacity-30"></div>
                  <div className="absolute left-2/3 top-0 bottom-0 w-px bg-blue-200 opacity-30"></div>
                  <div className="absolute top-1/3 left-0 right-0 h-px bg-blue-200 opacity-30"></div>
                  <div className="absolute top-2/3 left-0 right-0 h-px bg-blue-200 opacity-30"></div>
                </div>
              )}

              <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className="block"
                style={{ cursor: selectedTool === 'select' ? 'default' : 'crosshair' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      <ContextMenu
        items={contextMenu.items}
        position={contextMenu.position}
        onClose={closeContextMenu}
        isVisible={contextMenu.isVisible}
      />
    </div>
  );
};

export default CanvasEditor;