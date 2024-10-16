import {
  BlockNoteSchema,
  defaultInlineContentSpecs,
  filterSuggestionItems,
} from '@blocknote/core';
import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import {
  DefaultReactSuggestionItem,
  SuggestionMenuController,
  useCreateBlockNote,
} from '@blocknote/react';

import { Mention } from './Mention';

// Our schema with inline content specs, which contain the configs and
// implementations for inline content  that we want our editor to use.
const schema = BlockNoteSchema.create({
  inlineContentSpecs: {
    // Adds all default inline content.
    ...defaultInlineContentSpecs,
    // Adds the mention tag.
    mention: Mention,
  },
});

// Function which gets all users for the mentions menu.
const getMentionMenuItems = (
  editor: typeof schema.BlockNoteEditor
): DefaultReactSuggestionItem[] => {
  const mentions = [
    {
      id: 'mention1',
      mentionType: 'task',
      mentionId: 'taskId',
      title: 'Hello Task',
    },
    { id: 'mention2', mentionType: 'user', mentionId: 'userId', title: 'John' },
    {
      id: 'mention3',
      mentionType: 'user',
      mentionId: 'userId2',
      title: 'Mary',
    },
  ];

  return mentions.map((mention) => ({
    title: `${mention.mentionType}/${mention.title}`,
    onItemClick: () => {
      editor.insertInlineContent([
        {
          type: 'mention',
          props: {
            ...mention,
          },
        },
        ' ', // add a space after the mention
      ]);
    },
  }));
};

export function App() {
  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: 'paragraph',
        content: 'Welcome to this demo!',
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'mention',
            props: {
              id: 'mention2',
              mentionType: 'user',
              mentionId: 'userId',
              title: 'John',
            },
          },
          {
            type: 'text',
            text: ' <- This is an example mention',
            styles: {},
          },
        ],
      },
      {
        type: 'paragraph',
        content: "Press the '@' key to open the mentions menu and add another",
      },
      {
        type: 'paragraph',
      },
    ],
  });

  const editorChanged = () => {
    console.log(editor.document);
  };

  return (
    <BlockNoteView editor={editor} onChange={editorChanged}>
      {/* Adds a mentions menu which opens with the "@" key */}
      <SuggestionMenuController
        triggerCharacter={'@'}
        getItems={async (query) =>
          // Gets the mentions menu items
          filterSuggestionItems(getMentionMenuItems(editor), query)
        }
      />
    </BlockNoteView>
  );
}

export default App;
