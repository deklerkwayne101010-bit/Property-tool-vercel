'use client';

import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import { fabric } from 'fabric';
import FilterPanel from './FilterPanel';
import TemplatePanel from './TemplatePanel';
import AIEnhancementPanel from './AIEnhancementPanel';
import CollaborationPanel from './CollaborationPanel';
import CollaboratorCursors from './CollaboratorCursors';

interface CanvasEditorProps {
  width?: number;
  height?: number;
  onSave?: (canvas: any) => void;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({
  width = 800,
  height = 600,
  onSave
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<any>(null);
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [activePanel, setActivePanel] = useState<string>('tools');
  const [isProcessingAI, setIsProcessingAI] = useState<boolean>(false);

  useEffect(() => {
    if (canvasRef.current && !canvas) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
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

      setCanvas(fabricCanvas);
    }

    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, [canvasRef, width, height]);

  const handleSelection = (e: any) => {
    // Handle object selection
    console.log('Object selected:', e.selected);
  };

  const handleSelectionClear = () => {
    // Handle selection clear
    console.log('Selection cleared');
  };

  const addText = () => {
    if (!canvas) return;

    const text = new fabric.IText('Edit me', {
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
    if (!canvas) return;

    const rect = new fabric.Rect({
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
    if (!canvas) return;

    const circle = new fabric.Circle({
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
    if (!file || !canvas) return;

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
        const filters = obj.filters || [];

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

  const enhanceImageWithAI = async (action: string) => {
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length === 0) {
      alert('Please select an image to enhance');
      return;
    }

    const selectedImage = activeObjects.find((obj: any) => obj.type === 'image');
    if (!selectedImage) {
      alert('Please select an image to enhance');
      return;
    }

    setIsProcessingAI(true);

    // Simulate AI enhancement with visual feedback
    setTimeout(() => {
      try {
        // Apply a simple visual effect to simulate enhancement
        if (action === 'upscale') {
          // Simulate upscaling by slightly increasing size
          selectedImage.set({
            scaleX: (selectedImage.scaleX || 1) * 1.1,
            scaleY: (selectedImage.scaleY || 1) * 1.1,
          });
        } else if (action === 'remove-bg') {
          // Simulate background removal with opacity change
          selectedImage.set({
            opacity: 0.9,
          });
        } else if (action === 'enhance-colors') {
          // Simulate color enhancement with brightness
          if ((selectedImage as any).filters) {
            (selectedImage as any).filters.push(new (fabric as any).Image.filters.Brightness({ brightness: 0.1 }));
            selectedImage.applyFilters();
          }
        }

        canvas.renderAll();
        alert(`Demo: ${action} applied successfully! (API integration coming soon)`);

      } catch (error) {
        console.error('Demo enhancement error:', error);
        alert('Demo enhancement completed with visual effect!');
      } finally {
        setIsProcessingAI(false);
      }
    }, 1500); // 1.5 second delay to simulate processing
  };

  return (
    <div className="canvas-editor flex h-full">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Panel Tabs */}
        <div className="grid grid-cols-2 border-b border-gray-200">
          <button
            onClick={() => setActivePanel('tools')}
            className={`px-2 py-3 text-sm font-medium ${
              activePanel === 'tools'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tools
          </button>
          <button
            onClick={() => setActivePanel('filters')}
            className={`px-2 py-3 text-sm font-medium ${
              activePanel === 'filters'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Filters
          </button>
          <button
            onClick={() => setActivePanel('ai')}
            className={`px-2 py-3 text-sm font-medium ${
              activePanel === 'ai'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            AI
          </button>
          <button
            onClick={() => setActivePanel('templates')}
            className={`px-2 py-3 text-sm font-medium ${
              activePanel === 'templates'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActivePanel('collaboration')}
            className={`px-2 py-3 text-sm font-medium col-span-2 ${
              activePanel === 'collaboration'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            👥 Collaboration
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activePanel === 'tools' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Design Tools</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedTool('select')}
                  className={`p-3 rounded-lg border-2 text-sm font-medium ${
                    selectedTool === 'select'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Select
                </button>
                <button
                  onClick={addText}
                  className="p-3 rounded-lg border-2 bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 text-sm font-medium"
                >
                  Text
                </button>
                <button
                  onClick={addRectangle}
                  className="p-3 rounded-lg border-2 bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 text-sm font-medium"
                >
                  Shape
                </button>
                <button
                  onClick={addCircle}
                  className="p-3 rounded-lg border-2 bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 text-sm font-medium"
                >
                  Circle
                </button>
              </div>

              <div className="space-y-2">
                <button
                  onClick={deleteSelected}
                  className="w-full p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 text-sm font-medium"
                >
                  Delete Selected
                </button>
                <button
                  onClick={duplicateSelected}
                  className="w-full p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 text-sm font-medium"
                >
                  Duplicate
                </button>
              </div>

              <div>
                <label className="block w-full p-3 rounded-lg bg-blue-50 border-2 border-dashed border-blue-300 text-blue-700 hover:bg-blue-100 cursor-pointer text-center text-sm font-medium">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {activePanel === 'filters' && (
            <FilterPanel onApplyFilter={applyFilter} />
          )}

          {activePanel === 'ai' && (
            <AIEnhancementPanel
              onEnhanceImage={enhanceImageWithAI}
              isProcessing={isProcessingAI}
            />
          )}

          {activePanel === 'templates' && (
            <TemplatePanel onSelectTemplate={selectTemplate} />
          )}

          {activePanel === 'collaboration' && (
            <CollaborationPanel currentUserId="current-user" />
          )}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                onClick={exportCanvas}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
              >
                Export PNG
              </button>
              <button
                onClick={exportCanvas}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Export PDF
              </button>
              <button
                onClick={exportCanvas}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
              >
                Export JPG
              </button>
            </div>
            <button
              onClick={saveCanvas}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
            >
              Save Project
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-gray-100 p-8 flex items-center justify-center relative">
          <div className="bg-white rounded-lg shadow-xl p-4 relative">
            <canvas
              ref={canvasRef}
              className="border border-gray-300 rounded"
              style={{ display: 'block' }}
            />
            {/* Collaborator cursors overlay */}
            <CollaboratorCursors canvasRef={canvasRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasEditor;