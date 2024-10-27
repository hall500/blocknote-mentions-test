import { createReactInlineContentSpec } from '@blocknote/react';

// The Mention inline content.
export const Mention = createReactInlineContentSpec(
  {
    type: "mention",
    propSchema: {
      title: {
        default: "Unknown",
      },
      id: {
        default: "Unknown",
      },
      mentionType: {
        default: "Unknown",
      },
      mentionId: {
        default: "Unknown",
      },
      timestamp: {
        default: "Unknown",
      },
    },
    content: "none",
  },
  {
    render: (props) => (
      <span style={{ backgroundColor: "#8400ff33" }}>
        @{props.inlineContent.props.title}
      </span>
    ),
  }
);

export interface MentionProps {
  id: string;
  mentionType: string;
  mentionId: string;
  title: string;
}

export interface ContentItems {
  content: {
    type: string;
    props?: MentionProps;
  }[];
}
