import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'

const MarkdownRenderer = ({ content = '' }) => {
    return (
        <div className="prose prose-slate max-w-none text-neutral-800">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ node, ...props }) => <h1 className="text-3xl font-bold my-4" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-2xl font-bold my-4" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-xl font-bold my-4" {...props} />,
                    p: ({ node, ...props }) => <p className="my-2 leading-7" {...props} />,
                    a: ({ node, ...props }) => <a className="text-emerald-600 hover:underline" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside my-2 space-y-1" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside my-2 space-y-1" {...props} />,
                    li: ({ node, ...props }) => <li className="ml-4" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                    em: ({ node, ...props }) => <em className="italic" {...props} />,
                    blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-slate-300 pl-4 italic text-slate-600 my-4" {...props} />
                    ),
                    code: ({ node, inline, className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '')
                        if (!inline && match) {
                            return (
                                <SyntaxHighlighter
                                    style={dracula}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            )
                        }
                        return (
                            <code className="bg-slate-100 px-1 py-0.5 rounded text-sm" {...props}>
                                {children}
                            </code>
                        )
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}

export default MarkdownRenderer