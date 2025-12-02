'use client';

import { QuickReply } from '@/types/coaching';

interface QuickReplyButtonsProps {
  replies: QuickReply[];
  onSelect: (value: string) => void;
}

export default function QuickReplyButtons({ replies, onSelect }: QuickReplyButtonsProps) {
  if (!replies || replies.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {replies.map((reply, index) => (
        <button
          key={index}
          onClick={() => onSelect(reply.value)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
        >
          {reply.label}
        </button>
      ))}
    </div>
  );
}


