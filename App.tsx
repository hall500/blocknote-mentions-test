import {
  BlockNoteSchema,
  defaultInlineContentSpecs,
  defaultStyleSpecs,
  filterSuggestionItems,
} from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import "@blocknote/react/style.css";
import {
  DefaultReactSuggestionItem,
  SuggestionMenuController,
  useCreateBlockNote,
  BlockNoteView,
} from "@blocknote/react";
import { commentStyleSpec } from "@defensestation/blocknote-comments";

import { Mention, MentionProps } from "./Mention";
import { CustomFormattingToolbar } from "./comments/CustomFormattingToolbar";

const customStyleSpecs = {
  ...defaultStyleSpecs,
  comment: commentStyleSpec,
};

// Function which gets all users for the mentions menu.
const getMentionMenuItems = (editor: any): DefaultReactSuggestionItem[] => {
  const mentions = [
    {
      id: "mention1",
      mentionType: "task",
      mentionId: "taskId",
      title: "Hello Task",
    },
    { id: "mention2", mentionType: "user", mentionId: "userId", title: "John" },
    {
      id: "mention3",
      mentionType: "user",
      mentionId: "userId2",
      title: "Mary",
    },
  ];

  return mentions.map((mention) => ({
    title: `${mention.mentionType}/${mention.title}`,
    onItemClick: () => {
      editor.insertInlineContent([
        {
          type: "mention",
          props: {
            ...mention,
            timestamp: new Date().toISOString(),
          },
        },
        " ",
      ]);
    },
  }));
};

export function App() {
  const schema = BlockNoteSchema.create({
    inlineContentSpecs: {
      ...defaultInlineContentSpecs,
      mention: Mention,
    },
    styleSpecs: customStyleSpecs,
  });

  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        id: "26de9ad9-8814-4633-8a02-4a6502da3ecf",
        type: "paragraph",
        props: {
          textColor: "default",
          backgroundColor: "default",
          textAlignment: "left",
        },
        content: [
          {
            type: "text",
            text: "Lorem Ipsum",
            styles: {
              bold: true,
            },
          },
          {
            type: "text",
            text: " is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of ",
            styles: {},
          },
          {
            type: "text",
            text: "Letraset",
            styles: {
              comment: "{ id: commentId, content: commentContent }",
            },
          },
          {
            type: "text",
            text: " sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            styles: {},
          },
        ],
        children: [],
      },
      {
        id: "d69d1ce8-7e59-48a3-8c87-99007ff81a7f",
        type: "paragraph",
        props: {
          textColor: "default",
          backgroundColor: "default",
          textAlignment: "left",
        },
        content: [],
        children: [],
      },
    ],
  });

  const editorChanged = () => {
    const editorData = editor.document;
    const mentions = editorData.reduce((acc: MentionProps[], block: any) => {
      if (block.content) {
        acc.push(
          ...block.content
            .filter(
              (item: any) => item.type === "mention" && item.props !== undefined
            )
            .map((mention: any) => mention.props as MentionProps)
        );
      }
      return acc;
    }, [] as MentionProps[]);

    // console.log(mentions);
  };

  return (
    <BlockNoteView
      onChange={editorChanged}
      theme={"light"}
      editable
      editor={editor}
      formattingToolbar={false}
    >
      {/* Adds a mentions menu which opens with the "@" key */}
      <SuggestionMenuController
        triggerCharacter={"@"}
        getItems={async (query) =>
          // Gets the mentions menu items
          filterSuggestionItems(getMentionMenuItems(editor), query)
        }
      />
      <CustomFormattingToolbar />
    </BlockNoteView>
  );
}

export default App;
