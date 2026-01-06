import React, {useState} from 'react'
import Sidebar from './Sidebar';
import Header from './Header.jsx';


const AppLayout = ({children}) => {
const [isSidebarOpen, setIsSidebarOpen] = useState(false);

const toggleSidebar = () => {
  setIsSidebarOpen(!isSidebarOpen);
}

  return (
    <div className="flex min-h-screen bg-slate-100 text-neutral-900 md:pl-64">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col flex-1 min-h-screen">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 bg-slate-50 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppLayout