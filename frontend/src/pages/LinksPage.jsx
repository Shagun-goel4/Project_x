import React, { useEffect, useState, useRef } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { usePreview } from '../context/PreviewContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Link2, GripVertical } from 'lucide-react';
import api from '../utils/api';

const linkSchema = z.object({
  id: z.string().optional(),
  platform: z.string(),
  url: z.string().url('Please enter a valid URL'),
  orderIndex: z.number().optional()
});

const schema = z.object({
  links: z.array(linkSchema)
});

const PLATFORMS = ['GitHub', 'FrontendMentor', 'Twitter', 'LinkedIn', 'YouTube', 'Facebook', 'Twitch', 'Dev.to', 'Codewars', 'Codepen', 'freeCodeCamp', 'GitLab', 'Hashnode', 'Stack Overflow', 'Other'];

export const LinksPage = () => {
  const { linksPreview, setLinksPreview, isSyncing } = usePreview();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [localLinksLoaded, setLocalLinksLoaded] = useState(false);
  const savedLinkIdsRef = useRef([]);

  const { register, control, handleSubmit, watch, setValue, reset, getValues, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      links: []
    }
  });

  // Whenever the PreviewContext links load, initialize the form
  useEffect(() => {
    if (!localLinksLoaded && linksPreview && linksPreview.length > 0) {
      reset({ links: linksPreview });
      savedLinkIdsRef.current = linksPreview.map(l => l.id).filter(Boolean);
      setLocalLinksLoaded(true);
    }
  }, [linksPreview, localLinksLoaded, reset]);

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'links'
  });

  // Subscribe to form changes without causing re-renders
  useEffect(() => {
    const subscription = watch((values) => {
      if (localLinksLoaded) {
        setLinksPreview(structuredClone(values.links || []));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setLinksPreview, localLinksLoaded]);

  const detectPlatformFromUrl = (url) => {
    if (!url) return null;
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('github.com')) return 'GitHub';
    if (lowerUrl.includes('frontendmentor.io')) return 'FrontendMentor';
    if (lowerUrl.includes('twitter.com')) return 'Twitter';
    if (lowerUrl.includes('linkedin.com')) return 'LinkedIn';
    if (lowerUrl.includes('youtube.com')) return 'YouTube';
    if (lowerUrl.includes('facebook.com')) return 'Facebook';
    return null;
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    move(result.source.index, result.destination.index);
  };

  const onSubmit = async (data) => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      // Find deleted links by comparing against the original saved IDs
      const currentIds = data.links.map(l => l.id).filter(Boolean);
      const deletedIds = savedLinkIdsRef.current.filter(id => !currentIds.includes(id));

      // 1. Delete removed links
      for (const id of deletedIds) {
        await api.delete(`/links/${id}`);
      }

      // 2. Create/Update links sequentially
      const updatedLinks = [];
      for (let i = 0; i < data.links.length; i++) {
        const linkPayload = { ...data.links[i], orderIndex: i };
        if (linkPayload.id) {
          const res = await api.put(`/links/${linkPayload.id}`, linkPayload);
          updatedLinks.push(res.data);
        } else {
          // New links don't pass 'id'
          delete linkPayload.id;
          const res = await api.post(`/links`, linkPayload);
          updatedLinks.push(res.data);
        }
      }

      // 3. Reorder logic just as a safety net if bulk ordering was requested
      const reorderPayload = updatedLinks.map((l, idx) => ({ id: l.id, orderIndex: idx }));
      await api.put('/links/reorder', { updates: reorderPayload });

      // Refresh form, context, and saved IDs reference
      setLinksPreview(updatedLinks);
      savedLinkIdsRef.current = updatedLinks.map(l => l.id).filter(Boolean);
      reset({ links: updatedLinks });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving links", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isSyncing) return null;

  return (
    <div className="flex flex-col h-full animate-fade-in relative pb-10 md:pb-0">
      <div className="flex flex-col gap-2 mb-10">
        <h1 className="text-[32px] font-bold text-slate-900 leading-tight mt-0">Customize your links</h1>
        <p className="text-slate-500 text-base">Add/edit/remove links below and then share all your profiles with the world!</p>
      </div>

      <Button 
        type="button" 
        variant="outline" 
        className="w-full mb-6" 
        onClick={() => {
           append({ platform: 'GitHub', url: '', orderIndex: fields.length });
           setLocalLinksLoaded(true); // Treat as loaded once user interacts
        }}
      >
        + Add new link
      </Button>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 gap-6">
        
        {fields.length === 0 ? (
           <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center gap-4 bg-slate-50/50 my-6">
             <h2 className="text-2xl font-bold text-slate-700 mt-6">Let's get you started</h2>
             <p className="text-slate-500 max-w-sm mb-6">Use the "Add new link" button to get started. Once you have more than one link, you can reorder and edit them.</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="links-list">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-6 flex-1 max-h-[100%] overflow-y-visible">
                  {fields.map((field, index) => (
                    <Draggable key={field.id || `temp-${index}`} draggableId={field.id || `temp-${index}`} index={index}>
                      {(provided, snapshot) => (
                         <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`bg-slate-50 p-5 rounded-2xl flex flex-col gap-4 border border-slate-100 transition-shadow ${snapshot.isDragging ? 'shadow-xl ring-2 ring-primary-500 z-50' : 'shadow-sm z-0'}`}
                        >
                          <div className="flex items-center justify-between text-slate-500 font-semibold mb-1">
                            <div className="flex items-center gap-2 cursor-grab active:cursor-grabbing p-1 -ml-1 hover:text-primary-600 transition-colors" {...provided.dragHandleProps}>
                              <GripVertical size={16} />
                              <span>Link #{index + 1}</span>
                            </div>
                            <button type="button" onClick={() => remove(index)} className="text-slate-400 font-normal hover:text-red-500 transition-colors text-sm">
                              Remove
                            </button>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-slate-600 font-medium">Platform</label>
                            <Controller
                              control={control}
                              name={`links.${index}.platform`}
                              render={({ field }) => {
                                const isCustom = !PLATFORMS.includes(field.value) && field.value !== 'Other';
                                return (
                                  <div className="flex flex-col gap-2">
                                    <select 
                                      value={isCustom ? 'Other' : field.value}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === 'Other') {
                                          field.onChange('');
                                        } else {
                                          field.onChange(val);
                                        }
                                        setTimeout(() => setLinksPreview(structuredClone(getValues('links') || [])), 0);
                                      }}
                                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20"
                                    >
                                      {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                    {(field.value === '' || isCustom) && (
                                      <input
                                        type="text"
                                        value={isCustom ? field.value : ''}
                                        onChange={(e) => {
                                          field.onChange(e.target.value);
                                          setTimeout(() => setLinksPreview(structuredClone(getValues('links') || [])), 0);
                                        }}
                                        placeholder="Enter custom platform name"
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 animate-fade-in"
                                      />
                                    )}
                                  </div>
                                );
                              }}
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-slate-600 font-medium">Link</label>
                            <Input 
                              icon={Link2}
                              placeholder="e.g. https://www.github.com/johnsmith"
                              {...register(`links.${index}.url`, {
                                onChange: (e) => {
                                   const predicted = detectPlatformFromUrl(e.target.value);
                                   if (predicted) setValue(`links.${index}.platform`, predicted);
                                }
                              })}
                              error={errors.links?.[index]?.url?.message}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}

        {(isDirty || saveSuccess) && (
        <div className="mt-auto pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-end gap-4 pb-2 animate-slide-up">
           {saveSuccess && <span className="text-slate-500 font-medium animate-fade-in flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            Successfully saved!
          </span>}
          <Button type="submit" isLoading={isSaving} className="w-full md:w-auto px-10">
            Save
          </Button>
        </div>
        )}
      </form>
    </div>
  );
};
