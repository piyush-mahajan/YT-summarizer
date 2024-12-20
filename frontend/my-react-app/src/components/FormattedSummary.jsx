import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

function FormattedSummary({ text }) {
  // Function to format text with markdown syntax
  const formatText = (text) => {
    if (!text) return '';

    // Define patterns to make bold
    const patterns = [
      'Key Points:',
      'Main Topics:',
      'Summary:',
      'Conclusion:',
      'Background:',
      'Discussion Points:',
      'Analysis:',
      'Introduction:',
      'Overview:',
      'Highlights:',
      'Recommendations:',
      'Timestamps:',
      'Chapter \\d+:',
      '\\d+:\\d+\\s*-',
      '[A-Za-z\\s]+ said:',
      'Q:',
      'A:'
    ];

    let formattedText = text;

    // Make patterns bold
    patterns.forEach(pattern => {
      formattedText = formattedText.replace(
        new RegExp(`(${pattern})`, 'g'),
        '**$1**'
      );
    });

    // Convert lists
    formattedText = formattedText.replace(/^(\d+\.\s)/gm, '1. ');
    formattedText = formattedText.replace(/^[-•]\s/gm, '* ');

    // Convert URLs to markdown links
    formattedText = formattedText.replace(
      /(https?:\/\/[^\s]+)/g,
      '[$1]($1)'
    );

    // Add line breaks for readability
    formattedText = formattedText.replace(/\n/g, '\n\n');

    return formattedText;
  };

  const customRenderers = {
    // Custom rendering for specific elements if needed
    strong: ({ children }) => (
      <span className="font-bold text-gray-900">{children}</span>
    ),
    link: ({ href, children }) => (
      <a 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline"
      >
        {children}
      </a>
    ),
    paragraph: ({ children }) => (
      <p className="mb-4 text-gray-700">{children}</p>
    ),
    list: ({ ordered, children }) => (
      ordered ? (
        <ol className="list-decimal ml-6 mb-4 space-y-2">{children}</ol>
      ) : (
        <ul className="list-disc ml-6 mb-4 space-y-2">{children}</ul>
      )
    ),
  };

  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={customRenderers}
      >
        {formatText(text)}
      </ReactMarkdown>
    </div>
  );
}

export default FormattedSummary;