import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import documentService from '../../services/documentService.js'
import Spinner from '../../Components/common/Spinner.jsx'
import toast from 'react-hot-toast'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import PageHeader from '../../Components/common/PageHeader.jsx'
import Tabs from '../../Components/common/Tabs.jsx'
import ChatInterface from '../../Components/chat/ChatInterface.jsx'
import AiAction from '../../Components/ai/AiAction.jsx'


const DocumentDetailPage = () => {

  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('content');


  useEffect(() => {
    const fetchDocumentDetails = async () => {
      setLoading(true);
      try {
        const data = await documentService.getDocumentById(id);
        setDocument(data);

      } catch (error) {
        toast.error(error.message || "Failed to fetch document details");
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentDetails();
  }, [id]);


  // Helper function to get the full pdf url
  const getPdfUrl = () => {
    if (!document?.data?.filepath) {
      return null;
    }

    const filePath = document.data.filepath;
    
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }

    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
    const fullUrl = `${baseUrl}/${filePath.startsWith('/') ? filePath.slice(1) : filePath}`;
    return fullUrl;
  };

  const renderContent = () => {
    if (!document || !document.data || !document.data.filepath) {
      return <p className="text-center text-slate-600">PDF not available</p>;
    }
    const pdfUrl = getPdfUrl();

    return (
      <div className='bg-white border border-gray-300 rounded-lg shadow-sm h-full min-h-0 flex flex-col overflow-hidden'>
        <div className="flex items-center justify-between gap-3 p-4 border-b border-slate-200 bg-slate-50/80 flex-shrink-0">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            <ExternalLink className="h-4 w-4" />
            Open PDF in new tab
          </a>
        </div>
        <div className="flex-1 min-h-0 flex flex-col p-4 bg-slate-50">
          <div className="flex-1 min-h-0 rounded-lg border border-slate-200 overflow-hidden shadow-inner bg-white">
            <iframe
              src={pdfUrl}
              title="Document PDF"
              className="w-full h-full border-0"
            ></iframe>
          </div>
        </div>
      </div>
    );
  };

  const renderChat = () => {
    return (
      <div className="bg-white border border-gray-300 rounded-lg h-full min-h-0 overflow-hidden p-4 flex">
        <ChatInterface />
      </div>
    );
  };

  const renderAIAction = () => {
    return (
      <AiAction />
    );
  };

  const renderFlashcardTab = () => {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <p className="text-slate-600">Flashcards feature coming soon...</p>
      </div>
    );
  };

  const renderQuizTab = () => {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <p className="text-slate-600">Quiz feature coming soon...</p>
      </div>
    );
  };

  const tabs = [
    { label: 'Content', key: 'content', render: renderContent },
    { label: 'Chat', key: 'chat', render: renderChat },
    { label: 'AI Actions', key: 'ai-actions', render: renderAIAction },
    { label: 'Flashcards', key: 'flashcards', render: renderFlashcardTab },
    { label: 'Quiz', key: 'quiz', render: renderQuizTab },
  ];

  if (loading) {
    return <Spinner />;
  }

  if (!document) {
    return <p className="text-center text-slate-600">Document not found</p>;
  }

  const activeTabData = tabs.find(tab => tab.key === activeTab);

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full overflow-hidden gap-4">
      <Link to='/documents' className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-500 font-medium mb-4">
        <ArrowLeft className="h-4 w-4" />
        Back to Documents
      </Link>
      <PageHeader 
        title={document.data.title || "Document Details"} 
        description={document.data.description || "View document details and interact with the content."} 
      />
      <div className="flex-shrink-0">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      <div className="mt-2 flex-1 min-h-0 overflow-hidden">
        {activeTabData && activeTabData.render()}
      </div>
    </div>
  );
}

export default DocumentDetailPage