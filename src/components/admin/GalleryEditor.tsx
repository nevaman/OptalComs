import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Upload, X, GripVertical, Plus, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';

type GalleryImage = {
  url: string;
  caption?: string;
};

type GalleryEditorProps = {
  images: GalleryImage[];
  onUpdate: (images: GalleryImage[]) => void;
};

export function GalleryEditor({ images, onUpdate }: GalleryEditorProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newImages: GalleryImage[] = [...images];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError.message);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      newImages.push({ url: publicUrl, caption: '' });
    }

    onUpdate(newImages);
    setIsUploading(false);
    // Reset input
    e.target.value = '';
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onUpdate(items);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onUpdate(newImages);
  };

  const updateCaption = (index: number, caption: string) => {
    const newImages = images.map((img, i) => 
      i === index ? { ...img, caption } : img
    );
    onUpdate(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-neutral-mid uppercase tracking-wider">
          Gallery Images
        </label>
        <div className="relative">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <Button variant="secondary" size="sm" type="button" isLoading={isUploading}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Images
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="gallery-images" direction="vertical">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {images.map((image, index) => (
                <Draggable key={image.url} draggableId={image.url} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="flex items-center gap-4 p-3 bg-surface border border-neutral-light rounded group"
                    >
                      <div {...provided.dragHandleProps} className="text-neutral-mid hover:text-primary">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      
                      <div className="w-20 h-20 shrink-0 bg-neutral-light rounded overflow-hidden">
                        <img
                          src={image.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <input
                          type="text"
                          value={image.caption || ''}
                          onChange={(e) => updateCaption(index, e.target.value)}
                          placeholder="Add a caption..."
                          className="w-full bg-transparent border-none text-sm focus:ring-0 placeholder:text-neutral-mid/50"
                        />
                      </div>

                      <button
                        onClick={() => removeImage(index)}
                        className="p-2 text-neutral-mid hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              
              {images.length === 0 && !isUploading && (
                <div className="text-center py-12 border-2 border-dashed border-neutral-light rounded">
                  <p className="text-neutral-mid text-sm">No images in gallery yet</p>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

