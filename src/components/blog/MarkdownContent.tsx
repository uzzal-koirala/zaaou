import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { slugify } from "@/lib/blog-utils";

function nodeToText(children: React.ReactNode): string {
  if (children == null || typeof children === "boolean") return "";
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(nodeToText).join("");
  const maybe = children as unknown as { props?: { children?: React.ReactNode } };
  if (maybe && typeof maybe === "object" && "props" in maybe) {
    return nodeToText(maybe.props?.children);
  }
  return "";
}

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="article-prose prose prose-neutral dark:prose-invert max-w-none prose-lg prose-headings:font-display prose-headings:tracking-tight prose-headings:scroll-mt-28 prose-h2:mt-12 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-p:text-foreground/85 prose-a:text-primary prose-a:font-semibold hover:prose-a:underline prose-strong:text-foreground prose-img:rounded-2xl prose-img:shadow-soft prose-blockquote:border-l-primary prose-blockquote:bg-muted/40 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-li:marker:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
          h2: ({ children, ...props }) => (
            <h2 id={slugify(nodeToText(children))} {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 id={slugify(nodeToText(children))} {...props}>
              {children}
            </h3>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
