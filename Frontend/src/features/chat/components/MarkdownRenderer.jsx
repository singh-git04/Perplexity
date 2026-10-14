import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export const MarkdownRenderer = ({ content }) => {
  return (
    <div className="markdown-content text-zinc-300 text-sm leading-7 break-words overflow-hidden">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ node, ...props }) => (
            <div className="my-3 w-full overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/60 shadow-inner">
              <table
                className="w-full min-w-[500px] divide-y divide-zinc-800 text-left text-xs md:text-sm"
                {...props}
              />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-[#121417] text-zinc-200" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th
              className="px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-300 border-b border-zinc-800 whitespace-nowrap"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="px-3.5 py-2.5 text-xs md:text-sm text-zinc-300 border-b border-zinc-800/60 align-top leading-relaxed"
              {...props}
            />
          ),
          tr: ({ node, ...props }) => (
            <tr
              className="even:bg-zinc-900/30 hover:bg-zinc-800/40 transition-colors"
              {...props}
            />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            if (inline) {
              return (
                <code
                  className="rounded bg-zinc-800/80 px-1.5 py-0.5 text-xs font-mono text-zinc-200"
                  {...props}
                >
                  {children}
                </code>
              )
            }
            return (
              <div className="my-3 overflow-x-auto rounded-xl border border-zinc-800 bg-[#121417] p-3.5 text-xs font-mono text-zinc-200">
                <code className={className} {...props}>
                  {children}
                </code>
              </div>
            )
          },
          p: ({ node, ...props }) => (
            <p className="mb-3 last:mb-0 leading-relaxed" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="my-2 ml-5 list-disc space-y-1.5" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="my-2 ml-5 list-decimal space-y-1.5" {...props} />
          ),
          li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
          h1: ({ node, ...props }) => (
            <h1 className="mt-4 mb-2 text-lg md:text-xl font-bold text-white first:mt-0" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="mt-3 mb-2 text-base md:text-lg font-bold text-white first:mt-0" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="mt-2.5 mb-1 text-sm md:text-base font-semibold text-white first:mt-0" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="my-3 border-l-2 border-[#31b8c6] pl-3 italic text-zinc-400"
              {...props}
            />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-[#31b8c6] hover:underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownRenderer
