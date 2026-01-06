import React from 'react'

const Tabs = ({ tabs = [], activeTab, setActiveTab }) => {
  return (
    <div className="w-full border-b border-slate-200">
      <nav className="flex flex-wrap gap-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`relative pb-3 px-1 text-sm font-semibold transition-colors ${
                isActive
                  ? 'text-emerald-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-emerald-500" />
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default Tabs