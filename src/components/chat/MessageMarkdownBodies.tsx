import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

interface Props {
  variant: 'user' | 'assistant';
  content: string;
}

/**
 * Тяжёлые зависимости (react-markdown, highlight.js) загружаются отдельным чанком через React.lazy в Message.tsx.
 */
export function MessageMarkdownBodies({ variant, content }: Props) {
  if (variant === 'assistant') {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    );
  }
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
}

export default MessageMarkdownBodies;
