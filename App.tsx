import {
  BlockNoteSchema,
  defaultInlineContentSpecs,
  defaultStyleSpecs,
  filterSuggestionItems,
} from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  DefaultReactSuggestionItem,
  FormattingToolbar,
  FormattingToolbarController,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";

import { Mention } from "./Mention";
import {
  commentStyleSpec,
  CommentToolbarController,
  CreateCommentButton,
} from "@defensestation/blocknote-comments";

// Our schema with inline content specs, which contain the configs and
// implementations for inline content  that we want our editor to use.
const schema = BlockNoteSchema.create({
  styleSpecs: {
    ...defaultStyleSpecs,
    comment: commentStyleSpec,
  },
  inlineContentSpecs: {
    // Adds all default inline content.
    ...defaultInlineContentSpecs,
    // Adds the mention tag.
    mention: Mention,
  },
});

const CustomFormattingToolbar = () => (
  <FormattingToolbarController
    formattingToolbar={() => (
      <FormattingToolbar>
        <CreateCommentButton key={"createCommentButton"} />
      </FormattingToolbar>
    )}
  />
);

// Function which gets all users for the mentions menu.
const getMentionMenuItems = (
  editor: typeof schema.BlockNoteEditor
): DefaultReactSuggestionItem[] => {
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
          },
        },
        " ", // add a space after the mention
      ]);
    },
  }));
};

export function App() {
  const editor = useCreateBlockNote({
    schema,
  });

  const editorChanged = () => {
    const editorData = editor.document;
    const mentions = editorData
      .flatMap((ed) => {
        // Check if ed.content is an array
        if (Array.isArray(ed.content)) {
          // Filter mentions from ed.content
          return ed.content.filter((con) => con.type === "mention");
        }
        // Return an empty array if ed.content is not an array
        return [];
      })
      .map((mention: any) => mention.props);

    console.log(mentions);
  };

  if (!editor) return <div>Loading Editor...</div>;

  return (
    <BlockNoteView
      editor={editor}
      onChange={editorChanged}
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
      <CommentToolbarController />
    </BlockNoteView>
  );
}

export default App;
