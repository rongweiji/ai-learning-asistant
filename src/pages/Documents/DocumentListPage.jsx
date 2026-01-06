import React, { useState, useEffect } from 'react'
import { Plus, Upload, Trash2, FileText, X } from 'lucide-react'
import toast from 'react-hot-toast'

import documentService from '../../services/documentService'
import Spinner from '../../Components/common/Spinner'
import Button from '../../Components/common/Button'
import DocumentCard from '../../Components/documents/DocumentCard'

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)


  // state for upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // state for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);


  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocuments()
      console.log('Documents fetched:', data)
      setDocuments(data?.data || data || [])
    } catch (error) {
      console.error("Error fetching documents:", error)
      toast.error(error.message || "Failed to load documents")
    } finally {
      setLoading(false)
    }

  };


  useEffect(() => {
    fetchDocuments();
  }, []);


  const setFileAndTitle = (file) => {
    if (file) {
      setUploadFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileAndTitle(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    setFileAndTitle(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle.trim()) {
      toast.error("Please provide a file and title");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadTitle.trim());
    try {
      await documentService.uploadDocument(formData);
      toast.success("Document uploaded successfully");
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle('');
      setLoading(true);
      fetchDocuments();
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error(error.message || "Failed to upload document");
    } finally {
      setUploading(false);
    }


  };



  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  }


  const handleComfirmDelete = async () => {
    if (!selectedDoc) return;
    setDeleting(true);
    try {
      await documentService.deleteDocument(selectedDoc._id);
      toast.success(`Document "${selectedDoc.title}" deleted successfully`);
      setIsDeleteModalOpen(false);
      setSelectedDoc(null);
      setDocuments(documents.filter((doc) => doc._id !== selectedDoc._id));
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error(error.message || "Failed to delete document");
    } finally {
      setDeleting(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      )
    }

    const docs = Array.isArray(documents) ? documents : [];

    if (docs.length === 0) {
      return (
        <div className='flex items-center justify-center py-16'>
          <div className='text-center max-w-md space-y-3'>
            <div className='mx-auto h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center'>
              <FileText className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className='text-lg font-semibold text-slate-900'>No documents yet</h3>
            <p className='text-sm text-slate-600'>Upload your first PDF to start generating flashcards and quizzes.</p>
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /><span>Upload Document</span>
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {docs.map((doc) => (
          <DocumentCard
            key={doc._id}
            document={doc}
            onDelete={handleDeleteRequest}
          />
        ))}
      </div>
    )
  }


return (
  <div className="space-y-6">
    <div className='flex flex-wrap items-center justify-between gap-3'>
      <div>
        <h1 className='text-2xl font-semibold text-slate-900'>My documents</h1>
        <p className='text-sm text-slate-600'>Manage and organize your learning materials.</p>
      </div>
      {Array.isArray(documents) && documents.length > 0 && (
        <Button onClick={() => setIsUploadModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Upload New Document
        </Button>
      )}
    </div>

    {renderContent()}





    {/* Upload Modal */}
    {isUploadModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 relative">
          <button
            onClick={() => setIsUploadModalOpen(false)}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-slate-100"
            aria-label="Close upload modal"
          >
            <X strokeWidth={2} className="h-5 w-5" />
          </button>

          <div className="space-y-1 mb-4">
            <h2 className="text-xl font-semibold text-slate-900">Upload New Document</h2>
            <p className="text-sm text-slate-600">Add a PDF file to your library.</p>
          </div>

          <form onSubmit={handleUpload} className='space-y-5'>
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-slate-800'>Document Title</label>
              <input 
                type="text" 
                className='w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30' 
                placeholder='Enter document title' 
                value={uploadTitle} 
                onChange={(e) => setUploadTitle(e.target.value)} 
                required 
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-slate-800'>Upload PDF</label>
              <div
                className={`rounded-xl border-2 border-dashed p-6 text-center transition ${dragActive ? 'border-emerald-400 bg-emerald-50/50' : 'border-slate-200 bg-slate-50'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-2 text-slate-600">
                  <Upload className="h-6 w-6 text-emerald-500" />
                  <p className="text-sm">Drag & drop your PDF here, or</p>
                  <label className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-400 cursor-pointer">
                    <Upload className="h-4 w-4" />
                    <span>Browse files</span>
                    <input 
                      type="file" 
                      accept="application/pdf" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                  </label>
                  {uploadFile && <p className="text-xs text-slate-500">Selected: {uploadFile.name}</p>}
                </div>
              </div>
            </div>

            <div className='flex justify-end gap-2'>
              <Button variant="outline" onClick={() => setIsUploadModalOpen(false)} disabled={uploading}>Cancel</Button>
              <Button type="submit" disabled={uploading || !uploadFile || !uploadTitle.trim()}>
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Delete confirmation modal */}
    {isDeleteModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 relative">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-slate-100"
            aria-label="Close delete modal"
          >
            <X strokeWidth={2} className="h-5 w-5" />
          </button>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              <h2 className="text-xl font-semibold text-slate-900">Delete document</h2>
            </div>
            <p className="text-sm text-slate-600">Are you sure you want to delete <span className="font-semibold text-slate-900">"{selectedDoc?.title}"</span>? This action cannot be undone.</p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={deleting}>Cancel</Button>
            <Button onClick={handleComfirmDelete} disabled={deleting} className="bg-red-500 hover:bg-red-400 focus:ring-red-500/50">
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </div>
    )}


  </div>
)
}

export default DocumentListPage