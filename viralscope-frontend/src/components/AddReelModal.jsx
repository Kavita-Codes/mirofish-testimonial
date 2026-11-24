import React, { useState } from 'react';
import { X, Upload, Video, AlertCircle } from 'lucide-react';

export default function AddReelModal({ campaignId, currentReelsCount, onReelAdded, onClose }) {
  const [topic, setTopic] = useState('');
  const [hook, setHook] = useState('');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic || !hook) {
      setError('Please provide at least a topic and opening hook for the Reel.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('topic', topic);
      formData.append('hook', hook);
      formData.append('caption', caption);
      formData.append('hashtags', hashtags);
      formData.append('description', description);
      if (selectedFile) {
        formData.append('video', selectedFile);
      }

      const res = await fetch(`/api/campaigns/${campaignId}/reels`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to add Reel');
      }

      onReelAdded(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Video className="w-4 h-4 text-indigo-600" />
              <span>Add Unpublished Reel ({currentReelsCount + 1} of 10)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Provide draft video footage, opening hook, and caption for analysis.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Video Upload Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Video Footage (9:16 Vertical)
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-xl p-5 text-center transition-colors bg-slate-50">
              {previewUrl ? (
                <div className="space-y-3">
                  <video 
                    src={previewUrl} 
                    controls 
                    className="max-h-48 rounded-lg mx-auto aspect-[9/16] object-cover border border-slate-200 shadow-sm" 
                  />
                  <div className="text-xs text-slate-700 font-semibold">{selectedFile?.name}</div>
                  <button
                    type="button"
                    onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                    className="text-xs text-red-600 hover:underline font-medium"
                  >
                    Change video
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                  <div className="text-xs text-slate-800 font-semibold">
                    Upload your video file for computer vision frame sampling
                  </div>
                  <p className="text-[11px] text-slate-500">
                    MP4, MOV, or WEBM. If skipped, a high-contrast test video is automatically assigned.
                  </p>
                  <label className="inline-block mt-2 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs">
                    <span>Select Video File</span>
                    <input 
                      type="file" 
                      accept="video/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Topic & Hook */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Reel Topic / Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Relatable College Midterms"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                First 3-Second Hook *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Stop studying like this if you want an A"
                value={hook}
                onChange={(e) => setHook(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Draft Caption
            </label>
            <textarea
              rows={3}
              placeholder="Tag your study group! Save this list for finals week..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-mono"
            />
          </div>

          {/* Hashtags & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Hashtags
              </label>
              <input
                type="text"
                placeholder="#CollegeLife #StudentTips #AITools"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Content Description
              </label>
              <input
                type="text"
                placeholder="Visual breakdown of 3 tools with dynamic cuts"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors shadow-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : 'Save & Analyze'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
